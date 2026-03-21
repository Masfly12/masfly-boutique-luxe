import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ─── Auth vendeur ─────────────────────────────────────────────────────────────

export function useVendorAuth() {
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  return { signIn, signUp };
}

export interface VendorPayload {
  name: string;
  slug: string;
  description?: string;
  whatsapp?: string;
  phone?: string;
  address?: string;
}

// ✅ Fonction ajoutée ici
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export function useCurrentVendor(userId?: string | null) {
  return useQuery({
    queryKey: ["current-vendor", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useUpsertVendor(userId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: VendorPayload) => {
      if (!userId) {
        throw new Error("Utilisateur non connecté");
      }

      const { data, error } = await supabase
        .from("vendors")
        .upsert(
          { user_id: userId, ...payload },
          { onConflict: "user_id" }
        )
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-vendor"] });
      toast.success("Profil vendeur enregistré !");
    },
    onError: (err: any) => {
      toast.error(err.message || "Impossible d'enregistrer le profil vendeur");
    },
  });
}

// ─── Profil vendeur (utilisé par VendorSetup + VendorDashboard) ───────────────

export function useVendorProfile() {
  return useQuery({
    queryKey: ["vendor-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
}

export function useSaveVendorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<VendorPayload> & { logo_url?: string; shop_name?: string; shop_description?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      const { data, error } = await supabase
        .from("vendors")
        .upsert({ user_id: user.id, ...payload }, { onConflict: "user_id" })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      queryClient.invalidateQueries({ queryKey: ["current-vendor"] });
      toast.success("Profil enregistré !");
    },
    onError: (err: any) => {
      toast.error(err.message || "Erreur lors de l'enregistrement");
    },
  });
}

export async function uploadVendorLogo(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { error } = await supabase.storage
    .from("vendor-logos")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("vendor-logos")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// ─── Produits du vendeur (utilisé par VendorDashboard) ────────────────────────

export function useVendorProducts() {
  return useQuery({
    queryKey: ["vendor-products"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!vendor) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(*), categories(*)")
        .eq("vendor_id", vendor.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

// ─── Commandes du vendeur (utilisé par VendorDashboard) ───────────────────────

export function useVendorOrders() {
  return useQuery({
    queryKey: ["vendor-orders"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!vendor) return [];

      const { data, error } = await supabase
        .from("order_items")
        .select("*, orders(*), products(name, image_url)")
        .in(
          "product_id",
          (
            await supabase
              .from("products")
              .select("id")
              .eq("vendor_id", vendor.id)
          ).data?.map((p) => p.id) ?? []
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

// ─── Statistiques vendeur (utilisé par VendorDashboard) ───────────────────────

export function useVendorStats() {
  const { data: products } = useVendorProducts();
  const { data: orders } = useVendorOrders();

  const totalProducts = products?.length ?? 0;
  const totalOrders = orders?.length ?? 0;
  const totalRevenue = orders?.reduce(
    (sum: number, item: any) => sum + (item.unit_price ?? 0) * (item.quantity ?? 1),
    0
  ) ?? 0;

  return { totalProducts, totalOrders, totalRevenue };
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
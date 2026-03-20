import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useFavorites(userId?: string | null) {
  return useQuery({
    queryKey: ["favorites", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("id, product_id, products(*, product_images(*), categories(*))")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useToggleFavorite(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(); // ✅ Supabase v2

      if (userError) throw userError;
      if (!user) {
        throw new Error("Connectez-vous pour ajouter aux favoris.");
      }

      const { data: existing, error: existingError } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (existingError) throw existingError;

      if (existing) {
        const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
        if (error) throw error;
        return { added: false };
      }

      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        product_id: productId,
      });
      if (error) throw error;
      return { added: true };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(result.added ? "Ajouté aux favoris" : "Retiré des favoris");
    },
    onError: (err: any) => {
      toast.error(err.message || "Impossible de mettre à jour les favoris");
    },
  });
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useProductReviews(productId?: string) {
  return useQuery({
    queryKey: ["product-reviews", productId],
    enabled: !!productId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useAddReview(productId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { rating: number; comment?: string }) => {
      if (!productId) throw new Error("Produit introuvable");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Connectez-vous pour laisser un avis.");

      const { error } = await supabase.from("product_reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating: payload.rating,
        comment: payload.comment || null,
      });

      if (error) throw error;
    },
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      toast.success("Merci pour votre avis !");
      return context;
    },
    onError: (err: any) => {
      toast.error(err.message || "Impossible d'enregistrer votre avis");
    },
  });
}


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// ─── Charger les avis d'un produit ────────────────────────
export function useReviews(productId?: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    enabled: !!productId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId!)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });
}

// ─── Stats des avis (moyenne + nombre) ────────────────────
export function useReviewStats(productId?: string) {
  const { data: reviews } = useReviews(productId);
  const count = reviews?.length ?? 0;
  const average =
    count > 0
      ? reviews!.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews?.filter((r) => r.rating === star).length ?? 0,
  }));
  return { count, average, distribution };
}

// ─── Soumettre un avis ─────────────────────────────────────
export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      product_id: string;
      author_name: string;
      rating: number;
      comment?: string;
    }) => {
      const { error } = await supabase.from("reviews").insert(payload);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["reviews", variables.product_id] });
    },
  });
}
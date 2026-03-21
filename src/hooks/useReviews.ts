import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

// ─── Récupération des avis ────────────────────────────────────────────────────

/** Utilisé par ProductReviews.tsx et ProductDetail.tsx */
export function useReviews(productId?: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    enabled: !!productId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });
}

/** Alias pour Product.tsx qui importe useProductReviews */
export const useProductReviews = useReviews;

// ─── Statistiques ─────────────────────────────────────────────────────────────

/** Calcule moyenne + distribution à partir des avis déjà chargés */
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

// ─── Soumission d'un avis (sans compte obligatoire) ───────────────────────────

export interface SubmitReviewPayload {
  product_id: string;
  rating: number;
  comment?: string;
}

/** Utilisé par ProductReviews.tsx — n'exige pas d'être connecté */
export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitReviewPayload) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("reviews").insert({
        product_id: payload.product_id,
        rating: payload.rating,
        comment: payload.comment ?? null,
        user_id: user?.id ?? null,
      });

      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", vars.product_id] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Impossible d'enregistrer votre avis");
    },
  });
}

// ─── Ajout d'un avis (compte obligatoire) ─────────────────────────────────────

/** Utilisé par Product.tsx — exige d'être connecté */
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

      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating: payload.rating,
        comment: payload.comment ?? null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      toast.success("Merci pour votre avis !");
    },
    onError: (err: any) => {
      toast.error(err.message || "Impossible d'enregistrer votre avis");
    },
  });
}
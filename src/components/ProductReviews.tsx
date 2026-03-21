import { useState } from "react";
import { useReviews, useReviewStats, useSubmitReview } from "@/hooks/useReviews";
import { StarRating } from "@/components/StarRating";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare, Loader2, User, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  productId: string;
  productName: string;
}

export function ProductReviews({ productId, productName }: Props) {
  const { data: reviews, isLoading } = useReviews(productId);
  const stats = useReviewStats(productId);
  const submitReview = useSubmitReview();

  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({ rating: 0, comment: "" });
  const [submitted, setSubmitted] = useState(false);

  const VISIBLE = 3;
  const displayedReviews = showAll ? reviews : reviews?.slice(0, VISIBLE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) {
      toast.error("Veuillez choisir une note");
      return;
    }
    try {
      await submitReview.mutateAsync({
        product_id: productId,
        rating: form.rating,
        comment: form.comment.trim() || undefined,
      });
      setSubmitted(true);
      setShowForm(false);
      setForm({ rating: 0, comment: "" });
      toast.success("Merci pour votre avis !");
    } catch {
      toast.error("Erreur lors de l'envoi. Réessayez.");
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Avis clients
          {stats.count > 0 && (
            <span className="text-sm font-body font-normal text-muted-foreground">
              ({stats.count} avis)
            </span>
          )}
        </h2>
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-body font-medium text-primary hover:underline"
          >
            + Laisser un avis
          </button>
        )}
      </div>

      {/* ─── Stats globales ─── */}
      {stats.count > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row gap-6">
          {/* Note globale */}
          <div className="flex flex-col items-center justify-center sm:border-r border-border sm:pr-6 sm:min-w-[120px]">
            <span className="font-display text-5xl font-bold text-foreground">
              {stats.average.toFixed(1)}
            </span>
            <StarRating value={Math.round(stats.average)} size="sm" />
            <span className="text-xs text-muted-foreground font-body mt-1">
              {stats.count} avis
            </span>
          </div>

          {/* Distribution */}
          <div className="flex-1 space-y-1.5">
            {stats.distribution.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs font-body text-muted-foreground w-4 text-right">{star}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: stats.count > 0 ? `${(count / stats.count) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-xs font-body text-muted-foreground w-4">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Formulaire ─── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4"
        >
          <h3 className="font-body font-semibold text-foreground">
            Votre avis sur "{productName}"
          </h3>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-sm font-body font-medium text-foreground">
              Note <span className="text-destructive">*</span>
            </label>
            <StarRating
              value={form.rating}
              onChange={(v) => setForm({ ...form, rating: v })}
              size="lg"
            />
            {form.rating > 0 && (
              <p className="text-xs text-muted-foreground font-body">
                {["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent !"][form.rating]}
              </p>
            )}
          </div>

          {/* Commentaire */}
          <div className="space-y-1.5">
            <label className="text-sm font-body font-medium text-foreground">
              Commentaire <span className="text-muted-foreground font-normal">(optionnel)</span>
            </label>
            <Textarea
              placeholder="Partagez votre expérience avec ce produit..."
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={submitReview.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold"
            >
              {submitReview.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi...
                </span>
              ) : "Publier mon avis"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => { setShowForm(false); setForm({ rating: 0, comment: "" }); }}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}

      {/* ─── Message après soumission ─── */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-green-700 font-body font-medium text-sm">
            ✅ Merci ! Votre avis a été publié.
          </p>
        </div>
      )}

      {/* ─── Liste des avis ─── */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl h-24 animate-pulse border border-border" />
          ))}
        </div>
      ) : reviews?.length === 0 ? (
        <div className="text-center py-10 bg-card border border-border rounded-2xl">
          <MessageSquare className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-muted-foreground font-body text-sm">
            Aucun avis pour l'instant. Soyez le premier !
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 text-sm text-primary hover:underline font-body font-medium"
            >
              Laisser un avis
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedReviews?.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-foreground text-sm">
                      Utilisateur
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} size="sm" />
              </div>
              {review.comment && (
                <p className="mt-3 text-sm font-body text-muted-foreground leading-relaxed pl-10">
                  "{review.comment}"
                </p>
              )}
            </div>
          ))}

          {/* Voir plus / moins */}
          {reviews && reviews.length > VISIBLE && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-body font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors border border-border"
            >
              {showAll ? (
                <><ChevronUp className="h-4 w-4" /> Voir moins</>
              ) : (
                <><ChevronDown className="h-4 w-4" /> Voir les {reviews.length - VISIBLE} autres avis</>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
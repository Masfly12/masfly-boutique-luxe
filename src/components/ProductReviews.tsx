import { useState } from "react";
import { useReviews, useReviewStats, useSubmitReview } from "@/hooks/useReviews";
import { StarRating } from "@/components/StarRating";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, User, ChevronDown, ChevronUp, MessageSquare, Send } from "lucide-react";

const GOLD = "#C9A84C";

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

  const LABELS = ["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent !"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) { toast.error("Choisissez une note"); return; }
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
    <div>

      {/* ── En-tête section ── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-5" style={{ background: GOLD }} />
            <p className="text-[9px] font-body tracking-[0.32em] uppercase" style={{ color: GOLD }}>
              Expériences clients
            </p>
          </div>
          <h2 className="font-display text-xl md:text-2xl font-light tracking-wide text-foreground">
            Avis & témoignages
            {stats.count > 0 && (
              <span className="ml-3 text-sm font-body font-normal text-muted-foreground">
                ({stats.count})
              </span>
            )}
          </h2>
        </div>

        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 transition-all duration-200"
            style={{ border: `1px solid rgba(201,168,76,0.4)`, color: GOLD }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
          >
            <MessageSquare className="h-3 w-3" />
            Laisser un avis
          </button>
        )}
      </div>

      {/* ── Stats globales ── */}
      {stats.count > 0 && (
        <div
          className="flex flex-col sm:flex-row gap-6 p-6 mb-8"
          style={{ border: "1px solid var(--border)", background: "var(--card)" }}
        >
          {/* Note globale */}
          <div
            className="flex flex-col items-center justify-center sm:pr-6 sm:min-w-[120px]"
            style={{ borderRight: "1px solid var(--border)" }}
          >
            <span className="font-display text-5xl font-bold" style={{ color: GOLD }}>
              {stats.average.toFixed(1)}
            </span>
            <div className="mt-1">
              <StarRating value={Math.round(stats.average)} size="sm" />
            </div>
            <span className="text-[10px] text-muted-foreground font-body mt-1.5 tracking-widest uppercase">
              {stats.count} avis
            </span>
          </div>

          {/* Barres distribution */}
          <div className="flex-1 space-y-2">
            {stats.distribution.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-[10px] font-body text-muted-foreground w-3 text-right tracking-wide">
                  {star}
                </span>
                <div className="flex-1 h-1.5 bg-secondary overflow-hidden">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: stats.count > 0 ? `${(count / stats.count) * 100}%` : "0%",
                      background: GOLD,
                      opacity: count > 0 ? 1 : 0.2,
                    }}
                  />
                </div>
                <span className="text-[10px] font-body text-muted-foreground w-4 tracking-wide">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Formulaire ── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 space-y-5"
          style={{ border: `1px solid rgba(201,168,76,0.25)`, background: "var(--card)" }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="h-px w-4" style={{ background: GOLD }} />
            <p className="text-[9px] font-body tracking-[0.3em] uppercase" style={{ color: GOLD }}>
              Votre avis sur "{productName}"
            </p>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground">
              Note <span style={{ color: GOLD }}>*</span>
            </label>
            <StarRating
              value={form.rating}
              onChange={(v) => setForm({ ...form, rating: v })}
              size="lg"
            />
            {form.rating > 0 && (
              <p className="text-[10px] font-body tracking-[0.15em] uppercase" style={{ color: GOLD }}>
                {LABELS[form.rating]}
              </p>
            )}
          </div>

          {/* Commentaire */}
          <div className="space-y-2">
            <label className="text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground">
              Commentaire <span className="text-muted-foreground/50">(optionnel)</span>
            </label>
            <Textarea
              placeholder="Partagez votre expérience avec ce produit..."
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={3}
              className="resize-none text-sm border-border focus-visible:ring-0 focus-visible:border-[#C9A84C]"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={submitReview.isPending}
              className="btn-press inline-flex items-center gap-2 font-body font-medium text-[10px] tracking-[0.2em] uppercase px-7 py-3 transition-all duration-200 hover:opacity-90"
              style={{ background: GOLD, color: "#0a0a0a" }}
            >
              {submitReview.isPending ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Envoi...</>
              ) : (
                <><Send className="h-3 w-3" /> Publier</>
              )}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setForm({ rating: 0, comment: "" }); }}
              className="font-body text-[10px] tracking-[0.2em] uppercase px-5 py-3 text-muted-foreground transition-colors hover:text-foreground"
              style={{ border: "1px solid var(--border)" }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* ── Message confirmation ── */}
      {submitted && (
        <div
          className="mb-8 p-5 text-center"
          style={{ border: `1px solid rgba(201,168,76,0.3)`, background: "rgba(201,168,76,0.04)" }}
        >
          <p className="text-[11px] font-body tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            ✦ Merci — votre avis a été publié
          </p>
        </div>
      )}

      {/* ── Liste des avis ── */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-24 skeleton-shimmer border border-border" />
          ))}
        </div>
      ) : reviews?.length === 0 ? (
        <div
          className="text-center py-14 border border-border"
          style={{ background: "var(--card)" }}
        >
          <MessageSquare className="h-8 w-8 mx-auto mb-3" style={{ color: `rgba(201,168,76,0.25)` }} />
          <p className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Aucun avis pour l'instant
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="text-[10px] tracking-[0.2em] uppercase font-body transition-colors"
              style={{ color: GOLD }}
            >
              Soyez le premier →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedReviews?.map((review) => (
            <div
              key={review.id}
              className="p-5 border border-border transition-all duration-200"
              style={{ background: "var(--card)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ border: `1px solid rgba(201,168,76,0.25)` }}
                  >
                    <User className="h-3.5 w-3.5" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <p className="font-body text-xs font-medium text-foreground tracking-wide">
                      Client vérifié
                    </p>
                    <p className="text-[10px] text-muted-foreground tracking-wide mt-0.5">
                      {new Date(review.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} size="sm" />
              </div>

              {review.comment && (
                <p
                  className="mt-4 text-sm font-body text-muted-foreground leading-[1.85] pl-11"
                  style={{ borderLeft: `2px solid rgba(201,168,76,0.2)`, paddingLeft: "16px" }}
                >
                  {review.comment}
                </p>
              )}
            </div>
          ))}

          {/* Voir plus / moins */}
          {reviews && reviews.length > VISIBLE && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-2 py-3 font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-200"
              style={{
                border: "1px solid var(--border)",
                color: "var(--muted-foreground)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `rgba(201,168,76,0.4)`;
                (e.currentTarget as HTMLElement).style.color = GOLD;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "";
                (e.currentTarget as HTMLElement).style.color = "";
              }}
            >
              {showAll ? (
                <><ChevronUp className="h-3 w-3" /> Voir moins</>
              ) : (
                <><ChevronDown className="h-3 w-3" /> Voir les {reviews.length - VISIBLE} autres avis</>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
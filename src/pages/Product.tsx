import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useProductReviews, useAddReview } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Star, StarHalf, MessageCircle, Package, Loader2 } from "lucide-react";

const MAX_RATING = 5;

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id);
  const { data: reviews } = useProductReviews(id);
  const { user } = useAuth();
  const addReview = useAddReview(id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const images =
    ((product as any)?.product_images || [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((img: any) => img.image_url) || [];

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    addReview.mutate({ rating, comment: comment.trim() || undefined });
    setComment("");
  };

  const renderStars = (value: number) => {
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    const empty = MAX_RATING - full - (half ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
        {half && <StarHalf className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} className="h-4 w-4 text-muted-foreground" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {isLoading || !product ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Images */}
              <div className="space-y-3">
                <div className="aspect-square rounded-lg overflow-hidden bg-card border border-border flex items-center justify-center">
                  {images.length > 0 || product.image_url ? (
                    <img
                      src={images[0] || product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-12 w-12 text-muted-foreground/40" />
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.slice(1).map((img: string, i: number) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="w-20 h-20 rounded-md object-cover border border-border"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Infos produit */}
              <div className="space-y-4">
                <h1 className="font-display text-2xl md:text-3xl font-bold">{product.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {(product.categories as any)?.name || "Produit MASFLY"}
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-bold text-primary">
                    {product.price.toLocaleString("fr-FR")} FCFA
                  </span>
                  {reviews && reviews.length > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      {renderStars(avgRating)}
                      <span className="text-muted-foreground">
                        {avgRating.toFixed(1)} / 5 ({reviews.length} avis)
                      </span>
                    </div>
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-foreground leading-relaxed">{product.description}</p>
                )}

                <a
                  href={getWhatsAppUrl(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-primary-foreground font-body font-semibold px-6 py-2.5 rounded transition-colors text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  Commander sur WhatsApp
                </a>
              </div>
            </div>

            {/* Avis clients */}
            <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
              <div>
                <h2 className="font-display text-xl font-semibold mb-3">Avis des clients</h2>
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((r: any) => (
                      <div key={r.id} className="bg-card border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          {renderStars(r.rating)}
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        {r.comment && (
                          <p className="text-sm text-foreground">{r.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucun avis pour le moment. Soyez le premier à donner votre avis.
                  </p>
                )}
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-display text-lg font-semibold mb-2">Laisser un avis</h3>
                {!user ? (
                  <p className="text-sm text-muted-foreground">
                    Connectez-vous via <span className="font-semibold">Mon compte</span> pour laisser un avis.
                  </p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Note</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full bg-background border border-border rounded-md px-2 py-1 text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((v) => (
                          <option key={v} value={v}>
                            {v} étoile{v > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Commentaire (optionnel)</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="w-full bg-background border border-border rounded-md px-2 py-1 text-sm resize-none"
                        placeholder="Partagez votre expérience avec ce produit..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={addReview.isPending}
                      className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2 rounded hover:opacity-90 transition-opacity"
                    >
                      {addReview.isPending ? "Envoi..." : "Publier l'avis"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Product;


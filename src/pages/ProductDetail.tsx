import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useReviewStats } from "@/hooks/useReviews";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ProductReviews } from "@/components/ProductReviews";
import { StarRating } from "@/components/StarRating";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import {
  MessageCircle, ChevronLeft, ChevronRight,
  ArrowLeft, Package, Share2, CheckCircle,
  ShoppingCart, Truck, Shield, RotateCcw,
} from "lucide-react";

const GOLD = "#C9A84C";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id!);
  const reviewStats = useReviewStats(id);
  const { addItem } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square bg-card animate-pulse border border-border" />
            <div className="space-y-5 pt-2">
              <div className="h-3 bg-card animate-pulse w-1/3" />
              <div className="h-8 bg-card animate-pulse w-4/5" />
              <div className="h-10 bg-card animate-pulse w-1/4 mt-4" />
              <div className="h-px bg-border w-full" />
              <div className="h-4 bg-card animate-pulse w-full" />
              <div className="h-4 bg-card animate-pulse w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Erreur ── */
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div
            className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
            style={{ border: `1px solid rgba(201,168,76,0.2)` }}
          >
            <Package className="h-8 w-8" style={{ color: `rgba(201,168,76,0.4)` }} />
          </div>
          <h2 className="font-display text-2xl font-light text-foreground mb-3 tracking-wide">
            Produit introuvable
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-8 tracking-wide">
            Ce produit n'existe pas ou a été retiré.
          </p>
          <button
            onClick={() => navigate("/catalogue")}
            className="inline-flex items-center gap-2 font-body font-medium text-[10px] tracking-[0.2em] uppercase px-8 py-3 transition-all duration-200 hover:opacity-90"
            style={{ background: GOLD, color: "#0a0a0a" }}
          >
            <ArrowLeft className="h-3 w-3" />
            Retour au catalogue
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images =
    ((product as any).product_images || [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((img: any) => img.image_url).length > 0
      ? ((product as any).product_images || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((img: any) => img.image_url)
      : product.image_url ? [product.image_url] : [];

  const categoryName = (product as any).categories?.name;
  const categorySlug = (product as any).categories?.slug;
  const THUMB_VISIBLE = 5;

  const prev = () => {
    const i = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(i);
    if (i < thumbStart) setThumbStart(i);
    if (i === images.length - 1) setThumbStart(Math.max(0, images.length - THUMB_VISIBLE));
  };
  const next = () => {
    const i = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(i);
    if (i >= thumbStart + THUMB_VISIBLE) setThumbStart(i - THUMB_VISIBLE + 1);
    if (i === 0) setThumbStart(0);
  };

  const handleShare = async () => {
    if (navigator.share) await navigator.share({ title: product.name, url: window.location.href });
    else { await navigator.clipboard.writeText(window.location.href); toast.success("Lien copié !"); }
  };

  const handleCart = () => {
    addItem({ id: id!, name: product.name, price: product.price, imageUrl: product.image_url });
    toast.success("Ajouté au panier !");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-8">

        {/* ── Breadcrumb ── */}
        <nav className="flex flex-wrap items-center gap-2 mb-8 text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground">
          <span className="cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate("/")}>Accueil</span>
          <span style={{ color: `rgba(201,168,76,0.4)` }}>◆</span>
          <span className="cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate("/catalogue")}>Catalogue</span>
          {categoryName && (
            <>
              <span style={{ color: `rgba(201,168,76,0.4)` }}>◆</span>
              <span className="cursor-pointer hover:text-foreground transition-colors"
                onClick={() => navigate(categorySlug ? `/catalogue?cat=${categorySlug}` : "/catalogue")}>
                {categoryName}
              </span>
            </>
          )}
          <span style={{ color: `rgba(201,168,76,0.4)` }}>◆</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* ════════════════════════════════
              GALERIE
          ════════════════════════════════ */}
          <div className="flex flex-col gap-3">

            {/* Image principale */}
            <div
              className="relative overflow-hidden bg-card border border-border group cursor-zoom-in"
              style={{ aspectRatio: "1/1" }}
              onClick={() => setZoomed(!zoomed)}
            >
              {images.length > 0 ? (
                <img
                  src={images[currentIndex]}
                  alt={`${product.name} — ${currentIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{ transform: zoomed ? "scale(1.25)" : "scale(1)" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16" style={{ color: `rgba(201,168,76,0.2)` }} />
                </div>
              )}

              {/* Overlay hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)" }}
              />

              {/* Flèches navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  {/* Compteur */}
                  <span
                    className="absolute bottom-3 right-3 font-body text-[10px] tracking-[0.15em] text-white px-2.5 py-1"
                    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
                  >
                    {currentIndex + 1} / {images.length}
                  </span>
                </>
              )}

              {/* Liseré or bas */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: GOLD, opacity: 0.6 }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-hidden">
                {images.slice(thumbStart, thumbStart + THUMB_VISIBLE).map((img, i) => {
                  const idx = thumbStart + i;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className="flex-shrink-0 w-16 h-16 overflow-hidden transition-all duration-200"
                      style={{
                        border: idx === currentIndex
                          ? `2px solid ${GOLD}`
                          : "1px solid rgba(0,0,0,0.12)",
                        opacity: idx === currentIndex ? 1 : 0.55,
                      }}
                    >
                      <img src={img} alt={`vue ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ════════════════════════════════
              INFOS PRODUIT
          ════════════════════════════════ */}
          <div className="flex flex-col gap-5">

            {/* Catégorie */}
            {categoryName && (
              <div className="flex items-center gap-2">
                <div className="h-px w-5" style={{ background: GOLD }} />
                <span
                  className="text-[9px] font-body tracking-[0.35em] uppercase"
                  style={{ color: GOLD }}
                >
                  {categoryName}
                </span>
              </div>
            )}

            {/* Nom produit */}
            <h1 className="font-display text-2xl sm:text-3xl font-light text-foreground leading-tight tracking-wide">
              {product.name}
            </h1>

            {/* Note */}
            {reviewStats.count > 0 && (
              <div className="flex items-center gap-3">
                <StarRating value={Math.round(reviewStats.average)} size="sm" />
                <span className="text-[11px] font-body text-muted-foreground tracking-wide">
                  {reviewStats.average.toFixed(1)} · {reviewStats.count} avis
                </span>
              </div>
            )}

            {/* Prix */}
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold" style={{ color: GOLD }}>
                {product.price.toLocaleString("fr-FR")}
              </span>
              <span className="font-body text-xs text-muted-foreground tracking-[0.2em] uppercase">
                FCFA
              </span>
            </div>

            {/* Séparateur or */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8" style={{ background: GOLD, opacity: 0.4 }} />
              <div className="w-1 h-1 rotate-45" style={{ background: GOLD, opacity: 0.6 }} />
              <div className="h-px flex-1" style={{ background: GOLD, opacity: 0.12 }} />
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <p className="text-[9px] font-body tracking-[0.3em] uppercase text-muted-foreground mb-3">
                  Description
                </p>
                <p className="font-body text-sm text-muted-foreground leading-[1.85] whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Réassurances */}
            <div className="space-y-2.5">
              {[
                { icon: CheckCircle, text: "Produit sélectionné par MASFLY" },
                { icon: Truck,       text: "Livraison disponible sur commande" },
                { icon: Shield,      text: "Qualité garantie ou remboursé" },
                { icon: RotateCcw,   text: "Support client 7j/7 via WhatsApp" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: GOLD }} />
                  <span className="font-body text-xs text-muted-foreground tracking-wide">{text}</span>
                </div>
              ))}
            </div>

            {/* Séparateur */}
            <div className="h-px w-full" style={{ background: "var(--border)" }} />

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppUrl(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press flex-1 flex items-center justify-center gap-2 font-body font-medium text-[11px] tracking-[0.2em] uppercase py-[14px] px-6 transition-all duration-200 hover:opacity-90"
                style={{ background: GOLD, color: "#0a0a0a" }}
              >
                <MessageCircle className="h-4 w-4" />
                Commander via WhatsApp
              </a>
              <button
                onClick={handleCart}
                className="btn-press flex items-center justify-center gap-2 font-body font-medium text-[11px] tracking-[0.2em] uppercase py-[14px] px-5 transition-all duration-200"
                style={{
                  border: `1px solid rgba(201,168,76,0.4)`,
                  color: GOLD,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "";
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                Panier
              </button>
              <button
                onClick={handleShare}
                className="btn-press flex items-center justify-center gap-2 font-body font-medium text-[11px] tracking-[0.2em] uppercase py-[14px] px-5 transition-all duration-200"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--muted-foreground)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                }}
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Retour */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-body text-muted-foreground hover:text-foreground transition-colors mt-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Retour
            </button>
          </div>
        </div>

        {/* ════════════════════════════════
            AVIS CLIENTS
        ════════════════════════════════ */}
        <div className="mt-16 pt-12" style={{ borderTop: "1px solid var(--border)" }}>
          <ProductReviews productId={id!} productName={product.name} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
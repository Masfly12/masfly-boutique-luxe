import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Package,
  Share2,
  Tag,
  CheckCircle,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id!);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-card animate-pulse rounded-xl border border-border" />
            <div className="space-y-4">
              <div className="h-8 bg-card animate-pulse rounded w-3/4" />
              <div className="h-6 bg-card animate-pulse rounded w-1/4" />
              <div className="h-4 bg-card animate-pulse rounded w-full" />
              <div className="h-4 bg-card animate-pulse rounded w-5/6" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Produit introuvable
          </h2>
          <p className="text-muted-foreground font-body mb-6">
            Ce produit n'existe pas ou a été retiré.
          </p>
          <button
            onClick={() => navigate("/catalogue")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-body font-medium hover:opacity-90 transition"
          >
            <ArrowLeft className="h-4 w-4" />
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
      : product.image_url
      ? [product.image_url]
      : [];

  const categoryName = (product as any).categories?.name;
  const categorySlug = (product as any).categories?.slug;

  const THUMB_VISIBLE = 5;

  const prev = () => {
    const newIdx = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIdx);
    if (newIdx < thumbStart) setThumbStart(newIdx);
    if (newIdx === images.length - 1) setThumbStart(Math.max(0, images.length - THUMB_VISIBLE));
  };

  const next = () => {
    const newIdx = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIdx);
    if (newIdx >= thumbStart + THUMB_VISIBLE) setThumbStart(newIdx - THUMB_VISIBLE + 1);
    if (newIdx === 0) setThumbStart(0);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Lien copié !");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm font-body text-muted-foreground mb-6 flex flex-wrap items-center gap-1">
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            Accueil
          </span>
          <span>/</span>
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => navigate("/catalogue")}
          >
            Catalogue
          </span>
          {categoryName && (
            <>
              <span>/</span>
              <span
                className="hover:text-primary cursor-pointer"
                onClick={() =>
                  navigate(
                    categorySlug ? `/catalogue?cat=${categorySlug}` : "/catalogue"
                  )
                }
              >
                {categoryName}
              </span>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[180px]">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* ─── Galerie images ─── */}
          <div className="flex flex-col gap-3">
            {/* Image principale */}
            <div className="relative aspect-square bg-card border border-border rounded-xl overflow-hidden group">
              {images.length > 0 ? (
                <img
                  src={images[currentIndex]}
                  alt={`${product.name} - image ${currentIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-20 w-20 text-muted-foreground/20" />
                </div>
              )}

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card text-foreground rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card text-foreground rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  {/* Counter */}
                  <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-body px-2 py-1 rounded-full">
                    {currentIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-hidden">
                {images
                  .slice(thumbStart, thumbStart + THUMB_VISIBLE)
                  .map((img, i) => {
                    const realIdx = thumbStart + i;
                    return (
                      <button
                        key={realIdx}
                        onClick={() => setCurrentIndex(realIdx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentIndex === realIdx
                            ? "border-primary opacity-100"
                            : "border-border opacity-60 hover:opacity-90"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`miniature ${realIdx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* ─── Informations produit ─── */}
          <div className="flex flex-col gap-5">
            {/* Catégorie badge */}
            {categoryName && (
              <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-body font-semibold text-primary uppercase tracking-wider">
                  {categoryName}
                </span>
              </div>
            )}

            {/* Nom */}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Prix */}
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-primary">
                {product.price.toLocaleString("fr-FR")}
              </span>
              <span className="font-body text-base text-muted-foreground">FCFA</span>
            </div>

            {/* Séparateur */}
            <hr className="border-border" />

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="font-body font-semibold text-foreground text-sm mb-2 uppercase tracking-wide">
                  Description
                </h2>
                <p className="font-body text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Points de réassurance */}
            <div className="space-y-2">
              {[
                "Produit de qualité sélectionné par MASFLY",
                "Livraison disponible sur commande",
                "Commande rapide via WhatsApp",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {point}
                </div>
              ))}
            </div>

            {/* Séparateur */}
            <hr className="border-border" />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppUrl(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-body font-semibold py-3.5 px-6 rounded-xl transition-colors text-base shadow-md"
              >
                <MessageCircle className="h-5 w-5" />
                Commander via WhatsApp
              </a>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 border border-border bg-card hover:bg-secondary text-foreground font-body font-medium py-3.5 px-5 rounded-xl transition-colors text-sm"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </button>
            </div>

            {/* Retour */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary font-body transition-colors mt-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
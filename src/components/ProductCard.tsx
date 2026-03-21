import { useState } from "react";
import { Link } from "react-router-dom";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ShoppingBag, ChevronLeft, ChevronRight, MessageCircle, Heart, ShoppingCart } from "lucide-react";
import { useToggleFavorite } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const GOLD = "#C9A84C";

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  imageUrls?: string[];
  categoryName?: string;
  isFeatured?: boolean;
}

export function ProductCard({
  id, name, price, description, imageUrl, imageUrls = [], categoryName, isFeatured,
}: ProductCardProps) {
  const allImages = imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const toggleFavorite = id ? useToggleFavorite(id) : null;
  const cart = id ? useCart() : null;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    cart?.addItem({ id: id!, name, price, imageUrl });
    toast.success("Ajouté au panier !", { duration: 1500 });
  };

  return (
    <div
      className="group flex flex-col bg-card border border-border overflow-hidden transition-all duration-300"
      style={{
        borderColor: hovered ? `rgba(201,168,76,0.45)` : undefined,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.12)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image ── */}
      <Link
        to={id ? `/produit/${id}` : "#"}
        className="block relative overflow-hidden bg-secondary"
        style={{ aspectRatio: "4/3" }}
      >
        {allImages.length > 0 ? (
          <img
            src={allImages[currentIndex]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center min-h-[160px]">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Overlay dégradé bas — apparaît au hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Navigation images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-1 transition-all duration-200"
              style={{
                background: "rgba(0,0,0,0.5)",
                opacity: hovered ? 1 : 0,
                backdropFilter: "blur(4px)",
              }}
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-1 transition-all duration-200"
              style={{
                background: "rgba(0,0,0,0.5)",
                opacity: hovered ? 1 : 0,
                backdropFilter: "blur(4px)",
              }}
            >
              <ChevronRight className="h-3 w-3" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {allImages.map((_, i) => (
                <span
                  key={i}
                  className="h-[3px] rounded-none transition-all duration-300"
                  style={{
                    width: i === currentIndex ? "16px" : "4px",
                    background: i === currentIndex ? GOLD : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Badge catégorie */}
        {categoryName && (
          <div className="absolute top-0 left-0">
            <span
              className="block text-[9px] font-body tracking-[0.2em] uppercase px-3 py-1"
              style={{
                background: "rgba(0,0,0,0.65)",
                color: `rgba(201,168,76,0.9)`,
                backdropFilter: "blur(4px)",
              }}
            >
              {categoryName}
            </span>
          </div>
        )}

        {/* Badge populaire */}
        {isFeatured && (
          <div className="absolute top-0 right-0">
            <span
              className="block text-[9px] font-body tracking-[0.15em] uppercase px-3 py-1"
              style={{ background: GOLD, color: "#0a0a0a" }}
            >
              Populaire
            </span>
          </div>
        )}

        {/* Bouton favoris */}
        {id && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite?.mutate(); }}
            className="absolute bottom-2 right-2 p-1.5 text-white transition-all duration-200"
            style={{
              background: "rgba(0,0,0,0.5)",
              opacity: hovered ? 1 : 0,
              backdropFilter: "blur(4px)",
              border: `1px solid rgba(201,168,76,0.3)`,
            }}
          >
            <Heart className="h-3 w-3" />
          </button>
        )}
      </Link>

      {/* ── Liseré or animé ── */}
      <div
        className="h-[2px] transition-all duration-300 origin-left"
        style={{
          background: GOLD,
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
        }}
      />

      {/* ── Infos produit ── */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        {/* Nom */}
        <h3
          className="font-body text-sm font-medium text-foreground line-clamp-2 leading-snug tracking-wide"
        >
          {name}
        </h3>

        {/* Prix */}
        <div className="mt-auto pt-1 flex items-baseline gap-1.5">
          <span
            className="font-display text-base font-bold"
            style={{ color: GOLD }}
          >
            {price.toLocaleString("fr-FR")}
          </span>
          <span className="text-[10px] font-body text-muted-foreground tracking-widest uppercase">
            fcfa
          </span>
        </div>

        {/* Boutons — visibles au hover */}
        <div
          className="flex gap-1.5 mt-1 transition-all duration-300 overflow-hidden"
          style={{
            maxHeight: hovered ? "48px" : "0px",
            opacity: hovered ? 1 : 0,
          }}
        >
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!id}
            className="btn-press flex-1 flex items-center justify-center gap-1.5 font-body font-medium py-2 transition-all text-[10px] tracking-[0.15em] uppercase"
            style={{
              border: `1px solid rgba(201,168,76,0.5)`,
              color: GOLD,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = GOLD;
              (e.currentTarget as HTMLElement).style.color = "#0a0a0a";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.color = GOLD;
            }}
          >
            <ShoppingCart className="h-3 w-3" />
            Panier
          </button>
          <a
            href={getWhatsAppUrl(name)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-press flex-1 flex items-center justify-center gap-1.5 font-body font-medium py-2 transition-all text-[10px] tracking-[0.15em] uppercase"
            style={{
              background: "#1a1a1a",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#25D366";
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1a1a1a";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
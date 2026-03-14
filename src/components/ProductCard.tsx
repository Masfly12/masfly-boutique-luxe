import { useState } from "react";
import { Link } from "react-router-dom";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ShoppingBag, ChevronLeft, ChevronRight, MessageCircle, Heart, ShoppingCart } from "lucide-react";
import { useToggleFavorite } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  imageUrls?: string[];
  categoryName?: string;
}

export function ProductCard({ id, name, price, description, imageUrl, imageUrls = [], categoryName }: ProductCardProps) {
  const allImages = imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const toggleFavorite = id ? useToggleFavorite(id) : null;
  const cart = id ? useCart() : null;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="group bg-card rounded-lg border border-border hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <Link to={id ? `/produit/${id}` : "#"} className="block aspect-[4/3] overflow-hidden bg-secondary relative">
        {allImages.length > 0 ? (
          <>
            <img
              src={allImages[currentIndex]}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {allImages.map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentIndex ? "bg-primary" : "bg-card/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        {categoryName && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-body font-semibold px-2 py-0.5 rounded">
            {categoryName}
          </span>
        )}
        {id && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite?.mutate();
            }}
            className="absolute top-2 right-2 bg-card/80 hover:bg-card rounded-full p-1.5 text-muted-foreground hover:text-red-500 transition-colors shadow"
          >
            <Heart className="h-4 w-4" />
          </button>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="font-body text-sm font-medium text-foreground line-clamp-2 leading-snug min-h-[2.5rem]">{name}</h3>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
        )}
        <div className="flex items-end justify-between pt-1">
          <span className="font-display text-lg font-bold text-primary leading-none">
            {price.toLocaleString("fr-FR")} <span className="text-xs font-body font-normal text-muted-foreground">FCFA</span>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              cart?.addItem({ id: id!, name, price, imageUrl });
            }}
            disabled={!id}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-body font-medium py-2 rounded transition-colors text-xs"
          >
            <ShoppingCart className="h-3 w-3" />
            Ajouter au panier
          </button>
          <a
            href={getWhatsAppUrl(name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-primary-foreground font-body font-medium py-2 rounded transition-colors text-xs"
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

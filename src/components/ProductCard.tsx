import { useState } from "react";
import { Link } from "react-router-dom";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ShoppingBag, ChevronLeft, ChevronRight, MessageCircle, Heart, ShoppingCart } from "lucide-react";
import { useToggleFavorite } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

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

export function ProductCard({ id, name, price, description, imageUrl, imageUrls = [], categoryName, isFeatured }: ProductCardProps) {
  const allImages = imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const toggleFavorite = id ? useToggleFavorite(id) : null;
  const cart = id ? useCart() : null;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    cart?.addItem({ id: id!, name, price, imageUrl });
    toast.success("Ajouté au panier !", { duration: 1500 });
  };

  return (
    <div className="group product-card-hover bg-card rounded-2xl border border-border overflow-hidden flex flex-col">
      {/* Image */}
      <Link to={id ? `/produit/${id}` : "#"} className="block relative img-zoom bg-secondary" style={{ aspectRatio: "4/3" }}>
        {allImages.length > 0 ? (
          <img
            src={allImages[currentIndex]}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center min-h-[160px]">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Nav images */}
        {allImages.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {allImages.map((_, i) => (
                <span key={i} className={`w-1 h-1 rounded-full transition-all ${i === currentIndex ? "bg-white w-3" : "bg-white/50"}`} />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {categoryName && (
            <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-body font-semibold px-2 py-0.5 rounded-full">
              {categoryName}
            </span>
          )}
          {isFeatured && (
            <span className="bg-primary text-white text-[10px] font-body font-semibold px-2 py-0.5 rounded-full badge-pulse">
              ⭐ Populaire
            </span>
          )}
        </div>

        {/* Favoris */}
        {id && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite?.mutate(); }}
            className="absolute top-2 right-2 bg-black/40 hover:bg-red-500/80 backdrop-blur-sm text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Heart className="h-3.5 w-3.5" />
          </button>
        )}
      </Link>

      {/* Infos */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <h3 className="font-body text-sm font-semibold text-foreground line-clamp-2 leading-snug">
          {name}
        </h3>

        <div className="mt-auto pt-1 flex items-center justify-between">
          <span className="font-display text-base font-bold text-primary">
            {price.toLocaleString("fr-FR")}
            <span className="text-xs font-body font-normal text-muted-foreground ml-1">FCFA</span>
          </span>
        </div>

        {/* Boutons */}
        <div className="flex gap-1.5 mt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!id}
            className="btn-press flex-1 flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary hover:text-white text-primary font-body font-semibold py-2 rounded-xl transition-all text-xs"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Panier
          </button>
          <a
            href={getWhatsAppUrl(name)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-press flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-body font-semibold py-2 rounded-xl transition-colors text-xs"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
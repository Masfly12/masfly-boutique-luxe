import { useState } from "react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  imageUrls?: string[];
  categoryName?: string;
}

export function ProductCard({ name, price, description, imageUrl, imageUrls = [], categoryName }: ProductCardProps) {
  const allImages = imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="group bg-dark-card rounded-xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-300 hover:shadow-gold">
      <div className="aspect-square overflow-hidden bg-dark-muted relative">
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-dark/60 hover:bg-dark/80 text-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-dark/60 hover:bg-dark/80 text-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {allImages.map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentIndex ? "bg-gold" : "bg-foreground/30"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="h-16 w-16 text-gold/20" />
          </div>
        )}
        {categoryName && (
          <span className="absolute top-3 left-3 bg-gold/90 text-dark text-xs font-body font-semibold px-3 py-1 rounded-full">
            {categoryName}
          </span>
        )}
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="font-display text-xl font-bold text-gold">
            {price.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
        <a
          href={getWhatsAppUrl(name)}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-body font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          📱 Commander sur WhatsApp
        </a>
      </div>
    </div>
  );
}

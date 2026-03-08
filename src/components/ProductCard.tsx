import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  categoryName?: string;
}

export function ProductCard({ name, price, description, imageUrl, categoryName }: ProductCardProps) {
  return (
    <div className="group bg-dark-card rounded-xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-300 hover:shadow-gold">
      <div className="aspect-square overflow-hidden bg-dark-muted relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
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

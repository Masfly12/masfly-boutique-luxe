import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { getWhatsAppCartUrl } from "@/lib/whatsapp";
import { ShoppingCart, Trash2 } from "lucide-react";

const Cart = () => {
  const { items, total, updateQuantity, removeItem, clear } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    const url = getWhatsAppCartUrl(items);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Mon panier</h1>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Votre panier est vide. Ajoutez des produits depuis le catalogue ou la page d'accueil.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-lg p-3 flex items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xl">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.price.toLocaleString("fr-FR")} FCFA
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded border border-border text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded border border-border text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-lg p-4 space-y-3 h-fit">
              <h2 className="font-display text-lg font-semibold mb-1">Récapitulatif</h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display font-bold text-primary">
                  {total.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-primary-foreground text-sm font-semibold py-2 rounded transition-colors flex items-center justify-center gap-2"
              >
                Commander via WhatsApp
              </button>
              <button
                onClick={clear}
                className="w-full text-xs text-muted-foreground hover:text-destructive mt-1"
              >
                Vider le panier
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;


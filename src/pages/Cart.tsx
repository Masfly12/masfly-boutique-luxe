import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { getWhatsAppCartUrl } from "@/lib/whatsapp";
import { ShoppingCart, Trash2, Loader2, CheckCircle2, Package, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageTransition } from "@/hooks/usePageTransition";
import { Link } from "react-router-dom";

const Cart = () => {
  usePageTitle("Mon panier");
  const { transitionKey } = usePageTransition();
  const { items, total, updateQuantity, removeItem, clear } = useCart();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const [ordered, setOrdered] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0 || isPending) return;
    try {
      await createOrder({ items });
      setOrdered(true);
      window.open(getWhatsAppCartUrl(items), "_blank");
      clear();
      toast.success("Commande enregistrée !");
    } catch {
      toast.error("Erreur — redirection WhatsApp quand même.");
      window.open(getWhatsAppCartUrl(items), "_blank");
    }
  };

  if (ordered && items.length === 0) {
    return (
      <div key={transitionKey} className="min-h-screen bg-background text-foreground page-transition">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-display text-2xl font-bold">Commande enregistrée !</h1>
          <p className="text-muted-foreground text-sm max-w-sm font-body leading-relaxed">
            Votre commande a été sauvegardée. Continuez la conversation WhatsApp pour confirmer la livraison et le paiement.
          </p>
          <Link to="/" className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline font-body">
            <ArrowLeft className="h-3.5 w-3.5" /> Retour à l'accueil
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div key={transitionKey} className="min-h-screen bg-background text-foreground page-transition">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
            <ShoppingCart className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold">Mon panier</h1>
            <p className="text-xs text-muted-foreground font-body">
              {items.length} article{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <Package className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">Panier vide</h2>
            <p className="text-sm text-muted-foreground font-body mb-6">
              Ajoutez des produits depuis le catalogue
            </p>
            <Link
              to="/catalogue"
              className="btn-press inline-flex items-center gap-2 bg-primary text-white font-body font-semibold px-6 py-2.5 rounded-xl text-sm"
            >
              Voir le catalogue
            </Link>
          </div>
        ) : (
          /* Layout : colonne sur mobile, 2 colonnes sur desktop */
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Liste articles */}
            <div className="flex-1 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
                  {/* Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-secondary shrink-0">
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                    }
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground line-clamp-2 leading-snug">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">
                      {item.price.toLocaleString("fr-FR")} FCFA / unité
                    </p>

                    {/* Quantité */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-sm hover:bg-secondary transition-colors font-bold"
                      >−</button>
                      <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-sm hover:bg-secondary transition-colors font-bold"
                      >+</button>
                    </div>
                  </div>

                  {/* Prix + suppr */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="font-display text-sm font-bold text-primary">
                      {(item.price * item.quantity).toLocaleString("fr-FR")} F
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={clear}
                className="text-xs text-muted-foreground hover:text-destructive font-body transition-colors px-2"
              >
                Vider le panier
              </button>
            </div>

            {/* Récapitulatif — sticky sur desktop */}
            <div className="lg:w-80 lg:shrink-0">
              <div className="bg-card border border-border rounded-2xl p-5 lg:sticky lg:top-24 space-y-4">
                <h2 className="font-display text-base font-bold">Récapitulatif</h2>

                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-muted-foreground">
                      <span className="truncate max-w-[60%] font-body">{item.name} ×{item.quantity}</span>
                      <span className="font-body">{(item.price * item.quantity).toLocaleString("fr-FR")} F</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="font-body text-sm text-muted-foreground">Total</span>
                  <span className="font-display text-xl font-bold text-primary">
                    {total.toLocaleString("fr-FR")} <span className="text-sm font-body text-muted-foreground">FCFA</span>
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                  La commande sera enregistrée puis vous serez redirigé vers WhatsApp pour confirmer.
                </p>

                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="btn-press w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                >
                  {isPending
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement…</>
                    : <>📱 Commander via WhatsApp</>
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
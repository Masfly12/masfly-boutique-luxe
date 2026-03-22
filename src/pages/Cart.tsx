import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { getWhatsAppCartUrl } from "@/lib/whatsapp";
import {
  ShoppingCart, Trash2, Loader2, Package,
  ArrowLeft, MessageCircle, Plus, Minus,
  Truck, Shield, Clock, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageTransition } from "@/hooks/usePageTransition";
import { Link } from "react-router-dom";

const GOLD = "#C9A84C";

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

  /* ── Confirmation commande ── */
  if (ordered && items.length === 0) {
    return (
      <div key={transitionKey} className="min-h-screen bg-background text-foreground page-transition">
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
          {/* Icône succès */}
          <div
            className="w-20 h-20 flex items-center justify-center mb-8 relative"
            style={{ border: `1px solid rgba(201,168,76,0.3)` }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "rgba(201,168,76,0.05)" }}
            />
            <span style={{ color: GOLD, fontSize: "28px" }}>✦</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: GOLD, opacity: 0.5 }} />
            <p className="text-[9px] font-body tracking-[0.35em] uppercase" style={{ color: GOLD }}>
              Commande confirmée
            </p>
            <div className="h-px w-8" style={{ background: GOLD, opacity: 0.5 }} />
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-light text-foreground tracking-wide mb-3">
            Votre commande est enregistrée
          </h1>
          <p className="text-sm text-muted-foreground font-body max-w-sm leading-relaxed mb-10 tracking-wide">
            Continuez la conversation WhatsApp pour confirmer la livraison et le paiement.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase px-8 py-3 transition-all duration-200 hover:opacity-90"
            style={{ background: GOLD, color: "#0a0a0a" }}
          >
            <ArrowLeft className="h-3 w-3" />
            Retour à l'accueil
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div key={transitionKey} className="min-h-screen bg-background text-foreground page-transition">
      <Navbar />

      <div className="container mx-auto px-4 py-10">

        {/* ── En-tête ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-5" style={{ background: GOLD }} />
            <p className="text-[9px] font-body tracking-[0.32em] uppercase" style={{ color: GOLD }}>
              Votre sélection
            </p>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl md:text-3xl font-light tracking-wide text-foreground">
              Mon panier
            </h1>
            {items.length > 0 && (
              <span
                className="text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground"
              >
                {items.length} article{items.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* ── Panier vide ── */}
        {items.length === 0 ? (
          <div
            className="text-center py-20 border border-border"
            style={{ background: "var(--card)" }}
          >
            <div
              className="w-16 h-16 mx-auto mb-5 flex items-center justify-center"
              style={{ border: `1px solid rgba(201,168,76,0.2)` }}
            >
              <Package className="h-7 w-7" style={{ color: `rgba(201,168,76,0.35)` }} />
            </div>
            <h2 className="font-display text-lg font-light text-foreground tracking-wide mb-2">
              Panier vide
            </h2>
            <p className="text-sm text-muted-foreground font-body mb-8 tracking-wide">
              Découvrez notre sélection de produits
            </p>
            <Link
              to="/catalogue"
              className="btn-press inline-flex items-center gap-2 font-body font-medium text-[10px] tracking-[0.2em] uppercase px-8 py-3 transition-all duration-200 hover:opacity-90"
              style={{ background: GOLD, color: "#0a0a0a" }}
            >
              Voir le catalogue
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ════════════════════════════════
                LISTE ARTICLES
            ════════════════════════════════ */}
            <div className="flex-1 space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-border transition-all duration-200"
                  style={{ background: "var(--card)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                >
                  {/* Numéro */}
                  <span
                    className="text-[10px] font-body tracking-widest text-muted-foreground w-4 text-center shrink-0 hidden sm:block"
                    style={{ color: `rgba(201,168,76,0.5)` }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Image */}
                  <div className="w-16 h-16 overflow-hidden shrink-0 border border-border">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <Package className="h-5 w-5 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-foreground line-clamp-1 tracking-wide">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-body mt-1 tracking-widest uppercase">
                      {item.price.toLocaleString("fr-FR")} FCFA / unité
                    </p>
                  </div>

                  {/* Quantité */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center transition-all duration-150"
                      style={{ border: "1px solid var(--border)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `rgba(201,168,76,0.5)`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                    >
                      <Minus className="h-2.5 w-2.5" />
                    </button>
                    <span
                      className="font-display text-sm font-semibold w-6 text-center"
                      style={{ color: GOLD }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center transition-all duration-150"
                      style={{ border: "1px solid var(--border)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `rgba(201,168,76,0.5)`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                    >
                      <Plus className="h-2.5 w-2.5" />
                    </button>
                  </div>

                  {/* Sous-total + supprimer */}
                  <div className="flex flex-col items-end gap-2 shrink-0 min-w-[80px]">
                    <span className="font-display text-sm font-bold" style={{ color: GOLD }}>
                      {(item.price * item.quantity).toLocaleString("fr-FR")}
                      <span className="text-[9px] font-body font-normal text-muted-foreground ml-1">F</span>
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Vider le panier */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={clear}
                  className="text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground hover:text-destructive transition-colors"
                >
                  Vider le panier
                </button>
                <Link
                  to="/catalogue"
                  className="text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-2.5 w-2.5" />
                  Continuer les achats
                </Link>
              </div>
            </div>

            {/* ════════════════════════════════
                RÉCAPITULATIF — sticky
            ════════════════════════════════ */}
            <div className="lg:w-80 lg:shrink-0">
              <div
                className="border border-border p-6 lg:sticky lg:top-24 space-y-5"
                style={{ background: "var(--card)" }}
              >
                {/* Titre */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-px w-4" style={{ background: GOLD }} />
                    <span className="text-[9px] font-body tracking-[0.3em] uppercase" style={{ color: GOLD }}>
                      Récapitulatif
                    </span>
                  </div>
                </div>

                {/* Lignes articles */}
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-2">
                      <span className="font-body text-[11px] text-muted-foreground line-clamp-1 flex-1 tracking-wide">
                        {item.name}
                        <span className="ml-1 opacity-60">×{item.quantity}</span>
                      </span>
                      <span className="font-body text-[11px] text-foreground shrink-0">
                        {(item.price * item.quantity).toLocaleString("fr-FR")} F
                      </span>
                    </div>
                  ))}
                </div>

                {/* Séparateur */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1" style={{ background: GOLD, opacity: 0.2 }} />
                  <div className="w-1 h-1 rotate-45" style={{ background: GOLD, opacity: 0.4 }} />
                  <div className="h-px flex-1" style={{ background: GOLD, opacity: 0.2 }} />
                </div>

                {/* Total */}
                <div className="flex items-baseline justify-between">
                  <span className="font-body text-xs text-muted-foreground tracking-[0.2em] uppercase">
                    Total estimé
                  </span>
                  <div className="text-right">
                    <span className="font-display text-2xl font-bold" style={{ color: GOLD }}>
                      {total.toLocaleString("fr-FR")}
                    </span>
                    <span className="font-body text-[10px] text-muted-foreground ml-1.5 tracking-widest uppercase">
                      FCFA
                    </span>
                  </div>
                </div>

                {/* Note */}
                <p className="text-[10px] text-muted-foreground font-body leading-relaxed tracking-wide border-l-2 pl-3"
                  style={{ borderColor: `rgba(201,168,76,0.3)` }}>
                  La commande est enregistrée puis vous êtes redirigé vers WhatsApp pour confirmer la livraison.
                </p>

                {/* Bouton principal */}
                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="btn-press w-full flex items-center justify-center gap-2 font-body font-medium text-[10px] tracking-[0.2em] uppercase py-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: GOLD, color: "#0a0a0a" }}
                  onMouseEnter={(e) => { if (!isPending) (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  {isPending ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Enregistrement...</>
                  ) : (
                    <><MessageCircle className="h-3.5 w-3.5" /> Commander via WhatsApp</>
                  )}
                </button>

                {/* Réassurances */}
                <div className="space-y-2 pt-1">
                  {[
                    { icon: Clock,   text: "Réponse en moins de 5 min" },
                    { icon: Truck,   text: "Livraison partout au Bénin" },
                    { icon: Shield,  text: "Paiement sécurisé" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <Icon className="h-3 w-3 flex-shrink-0" style={{ color: `rgba(201,168,76,0.55)` }} />
                      <span className="text-[10px] font-body text-muted-foreground tracking-wide">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
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
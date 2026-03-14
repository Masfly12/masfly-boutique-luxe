import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const LivraisonPaiements = () => {
  useEffect(() => {
    document.title = "Livraison & Paiements - MASFLY";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">
          Livraison &amp; <span className="text-primary">Paiements</span>
        </h1>

        <div className="max-w-3xl space-y-6">
          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="font-display text-xl font-semibold mb-3">Zones de livraison</h2>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              MASFLY livre dans tout le <strong className="text-foreground">Bénin</strong>. Selon votre
              localisation, les délais et frais peuvent légèrement varier.
            </p>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="font-display text-xl font-semibold mb-3">Délais de livraison</h2>
            <ul className="text-sm text-muted-foreground font-body space-y-2">
              <li>• Cotonou / environs : en général sous 24 à 48h ouvrées.</li>
              <li>• Autres villes du Bénin : 48 à 72h ouvrées selon la destination.</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Les délais sont donnés à titre indicatif et peuvent varier selon la disponibilité des
              produits et les conditions de transport.
            </p>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="font-display text-xl font-semibold mb-3">Modes de paiement</h2>
            <ul className="text-sm text-muted-foreground font-body space-y-2">
              <li>• Paiement mobile (Mobile Money) lors de la commande.</li>
              <li>• Paiement à la livraison disponible sur certaines zones.</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Les détails du paiement sont confirmés avec notre équipe via WhatsApp avant la
              validation finale de votre commande.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LivraisonPaiements;


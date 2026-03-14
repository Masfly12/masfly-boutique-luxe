import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const ConditionsUtilisation = () => {
  useEffect(() => {
    document.title = "Conditions d'utilisation - MASFLY";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">
          Conditions d'<span className="text-primary">Utilisation</span>
        </h1>

        <div className="max-w-3xl space-y-5 text-sm text-muted-foreground font-body leading-relaxed">
          <p>
            En utilisant le site <strong className="text-foreground">MASFLY</strong>, vous acceptez les présentes
            conditions d&apos;utilisation. Elles peuvent être mises à jour à tout moment.
          </p>

          <section className="bg-card rounded-lg p-5 border border-border">
            <h2 className="font-display text-lg font-semibold mb-2 text-foreground">Utilisation du site</h2>
            <p>
              Vous vous engagez à utiliser MASFLY uniquement pour consulter des produits, passer des
              commandes et contacter notre équipe. Toute utilisation abusive, tentative de fraude ou
              activité illégale est strictement interdite.
            </p>
          </section>

          <section className="bg-card rounded-lg p-5 border border-border">
            <h2 className="font-display text-lg font-semibold mb-2 text-foreground">Produits et prix</h2>
            <p>
              Les descriptions de produits et les prix sont fournis à titre indicatif. Nous nous
              réservons le droit de modifier les prix ou la disponibilité des produits à tout
              moment, avant la confirmation de la commande.
            </p>
          </section>

          <section className="bg-card rounded-lg p-5 border border-border">
            <h2 className="font-display text-lg font-semibold mb-2 text-foreground">Commandes</h2>
            <p>
              Les commandes se font principalement via WhatsApp. Une commande n&apos;est considérée
              comme validée qu&apos;après confirmation avec notre équipe et accord sur le mode de
              paiement et de livraison.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConditionsUtilisation;


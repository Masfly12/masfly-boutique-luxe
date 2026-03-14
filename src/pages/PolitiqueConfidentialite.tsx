import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const PolitiqueConfidentialite = () => {
  useEffect(() => {
    document.title = "Politique de confidentialité - MASFLY";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">
          Politique de <span className="text-primary">Confidentialité</span>
        </h1>

        <div className="max-w-3xl space-y-5 text-sm text-muted-foreground font-body leading-relaxed">
          <p>
            MASFLY respecte votre vie privée. Cette page explique quelles informations nous
            collectons et comment elles sont utilisées.
          </p>

          <section className="bg-card rounded-lg p-5 border border-border">
            <h2 className="font-display text-lg font-semibold mb-2 text-foreground">Données collectées</h2>
            <p>
              Lors de vos commandes ou de vos échanges via WhatsApp, nous pouvons collecter des
              informations telles que votre nom, numéro de téléphone, adresse de livraison et détails
              de commande.
            </p>
          </section>

          <section className="bg-card rounded-lg p-5 border border-border">
            <h2 className="font-display text-lg font-semibold mb-2 text-foreground">Utilisation des données</h2>
            <p>
              Ces informations sont utilisées uniquement pour traiter vos commandes, assurer la
              livraison et améliorer notre service client. Nous ne revendons pas vos données à des
              tiers.
            </p>
          </section>

          <section className="bg-card rounded-lg p-5 border border-border">
            <h2 className="font-display text-lg font-semibold mb-2 text-foreground">Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures raisonnables pour protéger vos données. Cependant,
              aucun système n&apos;est totalement sécurisé et nous vous recommandons de rester
              vigilants lors du partage d&apos;informations en ligne.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;


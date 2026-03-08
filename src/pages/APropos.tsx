import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const APropos = () => {
  return (
    <div className="min-h-screen bg-dark text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
          À Propos de <span className="text-gold">MASFLY</span>
        </h1>
        <div className="max-w-3xl space-y-6">
          <div className="bg-dark-card rounded-xl p-8 border border-gold/10">
            <p className="text-muted-foreground leading-relaxed text-lg">
              <strong className="text-foreground">MASFLY</strong> est votre boutique en ligne de confiance basée au <strong className="text-foreground">Bénin</strong>. 
              Nous proposons une large gamme de produits soigneusement sélectionnés dans les catégories <strong className="text-gold">Mode & Beauté</strong>, 
              <strong className="text-gold"> Produits Électroniques</strong> et <strong className="text-gold"> Produits Importés</strong>.
            </p>
          </div>
          <div className="bg-dark-card rounded-xl p-8 border border-gold/10">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Notre Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Offrir aux Béninois un accès facile à des produits de qualité premium à des prix accessibles, 
              avec un service client réactif via WhatsApp pour une expérience d'achat simple et agréable.
            </p>
          </div>
          <div className="bg-dark-card rounded-xl p-8 border border-gold/10">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Pourquoi MASFLY ?</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3"><span className="text-gold text-lg">✓</span> Produits authentiques et de qualité</li>
              <li className="flex items-start gap-3"><span className="text-gold text-lg">✓</span> Commande simple via WhatsApp</li>
              <li className="flex items-start gap-3"><span className="text-gold text-lg">✓</span> Livraison rapide au Bénin</li>
              <li className="flex items-start gap-3"><span className="text-gold text-lg">✓</span> Service client disponible et réactif</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default APropos;

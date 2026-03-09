import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const APropos = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">
          À Propos de <span className="text-primary">MASFLY</span>
        </h1>
        <div className="max-w-3xl space-y-4">
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground leading-relaxed font-body">
              <strong className="text-foreground">MASFLY</strong> est votre boutique en ligne de confiance basée au <strong className="text-foreground">Bénin</strong>. 
              Nous proposons une large gamme de produits soigneusement sélectionnés dans les catégories <strong className="text-primary">Mode & Beauté</strong>, 
              <strong className="text-primary"> Produits Électroniques</strong> et <strong className="text-primary"> Produits Importés</strong>.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">Notre Mission</h2>
            <p className="text-muted-foreground leading-relaxed font-body">
              Offrir aux Béninois un accès facile à des produits de qualité premium à des prix accessibles, 
              avec un service client réactif via WhatsApp pour une expérience d'achat simple et agréable.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">Pourquoi MASFLY ?</h2>
            <ul className="space-y-2 text-muted-foreground font-body">
              <li className="flex items-start gap-3"><span className="text-primary">✓</span> Produits authentiques et de qualité</li>
              <li className="flex items-start gap-3"><span className="text-primary">✓</span> Commande simple via WhatsApp</li>
              <li className="flex items-start gap-3"><span className="text-primary">✓</span> Livraison rapide au Bénin</li>
              <li className="flex items-start gap-3"><span className="text-primary">✓</span> Service client disponible et réactif</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default APropos;

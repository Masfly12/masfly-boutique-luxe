import { Link } from "react-router-dom";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-foreground text-card">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold text-primary mb-3">MASFLY</h3>
            <p className="text-sm text-card/70 font-body leading-relaxed">
              Votre boutique en ligne premium au Bénin. Produits de qualité, prix imbattables.
            </p>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold text-card mb-3 uppercase tracking-wide">Navigation</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-card/70 hover:text-primary transition-colors font-body">Accueil</Link>
              <Link to="/catalogue" className="block text-sm text-card/70 hover:text-primary transition-colors font-body">Catalogue</Link>
              <Link to="/a-propos" className="block text-sm text-card/70 hover:text-primary transition-colors font-body">À Propos</Link>
              <Link to="/contact" className="block text-sm text-card/70 hover:text-primary transition-colors font-body">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold text-card mb-3 uppercase tracking-wide">Service Client</h4>
            <div className="space-y-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-card/70 hover:text-primary transition-colors font-body"
              >
                📱 WhatsApp
              </a>
              <p className="text-sm text-card/70 font-body">📍 Bénin</p>
            </div>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold text-card mb-3 uppercase tracking-wide">Pourquoi MASFLY ?</h4>
            <div className="space-y-2 text-sm text-card/70 font-body">
              <p>✅ Produits authentiques</p>
              <p>✅ Livraison rapide</p>
              <p>✅ Paiement sécurisé</p>
              <p>✅ Service client réactif</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-card/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-card/50 font-body">
            © {new Date().getFullYear()} MASFLY. Tous droits réservés.
          </p>
          <Link
            to="/admin"
            className="text-xs text-card/30 hover:text-primary/70 transition-colors font-body"
          >
            Administration
          </Link>
        </div>
      </div>
    </footer>
  );
}

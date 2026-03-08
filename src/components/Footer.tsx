import { Link } from "react-router-dom";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-dark border-t border-gold/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold text-gold mb-4">MASFLY</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre boutique en ligne premium au Bénin. Découvrez nos produits de qualité à des prix imbattables.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">Navigation</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-gold transition-colors">Accueil</Link>
              <Link to="/catalogue" className="block text-sm text-muted-foreground hover:text-gold transition-colors">Catalogue</Link>
              <Link to="/a-propos" className="block text-sm text-muted-foreground hover:text-gold transition-colors">À Propos</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-gold transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground mb-2">📍 Bénin</p>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
            >
              📱 Contactez-nous sur WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gold/10 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MASFLY. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

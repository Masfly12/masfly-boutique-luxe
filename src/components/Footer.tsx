import { Link } from "react-router-dom";
import { LogoMasfly } from "@/components/LogoMasfly";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { MapPin, MessageCircle, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-card">
      {/* CTA band */}
      <div className="border-b border-card/10">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-base font-bold text-white">Une question ? On répond vite.</p>
            <p className="text-sm text-card/50 font-body">Support disponible 7j/7 via WhatsApp</p>
          </div>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press shrink-0 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-body font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            Nous contacter
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <LogoMasfly size="md" />
            <p className="text-sm text-card/60 font-body leading-relaxed mb-4">
              Votre boutique en ligne premium au Bénin. Produits de qualité, prix imbattables.
            </p>
            <div className="flex items-center gap-2 text-sm text-card/50 font-body">
              <MapPin className="h-3.5 w-3.5 text-primary/70" />
              Bénin, Afrique de l'Ouest
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-body text-xs font-bold text-card/40 uppercase tracking-widest mb-4">Navigation</h4>
            <div className="space-y-2.5">
              {[
                { to: "/", label: "Accueil" },
                { to: "/catalogue", label: "Catalogue" },
                { to: "/favoris", label: "Mes favoris" },
                { to: "/a-propos", label: "À propos" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="flex items-center gap-1.5 text-sm text-card/60 hover:text-primary transition-colors font-body group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Service client */}
          <div>
            <h4 className="font-body text-xs font-bold text-card/40 uppercase tracking-widest mb-4">Service client</h4>
            <div className="space-y-2.5">
              {[
                { to: "/livraison-paiements", label: "Livraison & Paiements" },
                { to: "/conditions-utilisation", label: "Conditions d'utilisation" },
                { to: "/confidentialite", label: "Confidentialité" },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="block text-sm text-card/60 hover:text-primary transition-colors font-body">
                  {label}
                </Link>
              ))}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-card/60 hover:text-primary transition-colors font-body"
              >
                📱 WhatsApp direct
              </a>
            </div>
          </div>

          {/* Pourquoi MASFLY */}
          <div>
            <h4 className="font-body text-xs font-bold text-card/40 uppercase tracking-widest mb-4">Pourquoi MASFLY ?</h4>
            <div className="space-y-2.5">
              {[
                "Produits 100% authentiques",
                "Livraison rapide au Bénin",
                "Paiement 100% sécurisé",
                "Support réactif 7j/7",
                "Prix imbattables",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-card/60 font-body">
                  <span className="text-primary text-xs">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-card/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-card/30 font-body">
            © {new Date().getFullYear()} MASFLY. Tous droits réservés.
          </p>
          <p className="text-xs text-card/20 font-body">
            Fait avec ❤️ au Bénin 🇧🇯
          </p>
        </div>
      </div>
    </footer>
  );
}
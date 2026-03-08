import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { MapPin, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-dark text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
          Nous <span className="text-gold">Contacter</span>
        </h1>
        <div className="max-w-2xl space-y-6">
          <div className="bg-dark-card rounded-xl p-8 border border-gold/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-dark" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">WhatsApp</h2>
                <p className="text-sm text-muted-foreground">Notre moyen de contact principal</p>
              </div>
            </div>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-body font-semibold py-3 rounded-lg transition-colors"
            >
              📱 Écrire sur WhatsApp
            </a>
          </div>

          <div className="bg-dark-card rounded-xl p-8 border border-gold/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center">
                <MapPin className="h-6 w-6 text-dark" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">Localisation</h2>
                <p className="text-muted-foreground">MASFLY — Bénin 🇧🇯</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { MapPin, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">
          Nous <span className="text-primary">Contacter</span>
        </h1>
        <div className="max-w-2xl space-y-4">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">WhatsApp</h2>
                <p className="text-sm text-muted-foreground font-body">Notre moyen de contact principal</p>
              </div>
            </div>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-primary-foreground font-body font-semibold py-2.5 rounded transition-colors text-sm"
            >
              📱 Écrire sur WhatsApp
            </a>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Localisation</h2>
                <p className="text-muted-foreground font-body">MASFLY — Bénin 🇧🇯</p>
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

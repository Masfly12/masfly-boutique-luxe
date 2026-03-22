import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAuth, useVendorProfile } from "@/hooks/useVendor";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  CreditCard, MessageCircle, CheckCircle, Clock,
  ArrowRight, Loader2, AlertCircle, Phone,
} from "lucide-react";

const GOLD = "#C9A84C";

// ── Numéro WhatsApp de l'admin MASFLY ──
const ADMIN_WHATSAPP = "2290148108013";
// ── Montant des frais d'accès vendeur (à définir) ──
const FRAIS_ACCES = "À définir";

const VendorPayment = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useVendorAuth();
  const { data: profile, isLoading: profileLoading, refetch } = useVendorProfile(user?.id);

  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [declared, setDeclared] = useState(false);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  if (!user) { navigate("/vendor/auth"); return null; }
  if (!profile) { navigate("/vendor/setup"); return null; }

  // Déjà payé et approuvé → dashboard
  if (profile.is_approved && profile.payment_status === "paid") {
    navigate("/vendor/dashboard");
    return null;
  }

  // En attente de vérification → afficher message d'attente
  const isPendingVerification = profile.payment_status === "pending_verification";

  const handleDeclarePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      toast.error("Entrez votre référence de paiement");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.rpc("vendor_declare_payment", {
        _vendor_id: profile.id,
        _reference: reference.trim(),
      });
      if (error) throw error;
      await refetch();
      setDeclared(true);
      toast.success("Paiement déclaré ! Nous vérifierons sous 24h.");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la déclaration");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Bonjour MASFLY, je souhaite payer les frais d'accès vendeur.\n\nNom boutique: ${profile.shop_name || profile.name}\nEmail: ${user.email}\nID compte: ${profile.id}`
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-14 max-w-xl">

        {/* En-tête */}
        <div className="text-center mb-10">
          <div
            className="w-14 h-14 mx-auto mb-5 flex items-center justify-center"
            style={{ border: `1px solid rgba(201,168,76,0.35)`, background: "#0a0a0a" }}
          >
            <CreditCard className="h-5 w-5" style={{ color: GOLD }} />
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: GOLD, opacity: 0.4 }} />
            <p className="text-[9px] font-body tracking-[0.35em] uppercase" style={{ color: GOLD }}>
              Activation de votre boutique
            </p>
            <div className="h-px w-8" style={{ background: GOLD, opacity: 0.4 }} />
          </div>
          <h1 className="font-display text-2xl font-light tracking-wide text-foreground">
            Frais d'accès vendeur
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-2 tracking-wide">
            Un seul paiement pour activer votre espace boutique
          </p>
        </div>

        {/* ── En attente de vérification ── */}
        {(isPendingVerification || declared) ? (
          <div className="space-y-4">
            <div
              className="p-6 text-center border"
              style={{ borderColor: `rgba(201,168,76,0.3)`, background: "rgba(201,168,76,0.04)" }}
            >
              <Clock className="h-8 w-8 mx-auto mb-3" style={{ color: GOLD }} />
              <h2 className="font-display text-lg font-light text-foreground mb-2 tracking-wide">
                Paiement en cours de vérification
              </h2>
              <p className="text-xs text-muted-foreground font-body leading-relaxed tracking-wide">
                Votre paiement a bien été déclaré. L'équipe MASFLY va vérifier et activer votre boutique dans les <strong>24 à 48 heures</strong>.
              </p>
              {profile.payment_reference && (
                <p className="text-[10px] tracking-[0.2em] uppercase font-body mt-3" style={{ color: `rgba(201,168,76,0.7)` }}>
                  Référence : {profile.payment_reference}
                </p>
              )}
            </div>

            <div
              className="p-4 border border-border"
              style={{ background: "var(--card)" }}
            >
              <p className="text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Besoin d'aide ?
              </p>
              <a
                href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent("Bonjour MASFLY, j'ai déclaré mon paiement mais j'ai besoin d'assistance.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.15em] uppercase"
                style={{ color: GOLD }}
              >
                <MessageCircle className="h-3 w-3" />
                Contacter MASFLY sur WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">

            {/* Montant */}
            <div
              className="p-6 border text-center"
              style={{ border: `1px solid rgba(201,168,76,0.3)`, background: "var(--card)" }}
            >
              <p className="text-[9px] font-body tracking-[0.3em] uppercase text-muted-foreground mb-2">
                Frais d'accès unique
              </p>
              <p className="font-display text-4xl font-bold" style={{ color: GOLD }}>
                {FRAIS_ACCES}
              </p>
              <p className="text-[10px] text-muted-foreground font-body tracking-wide mt-1">
                FCFA — paiement unique, sans abonnement
              </p>
            </div>

            {/* Étapes */}
            <div className="border border-border" style={{ background: "var(--card)" }}>
              <div className="p-4 border-b border-border">
                <p className="text-[9px] font-body tracking-[0.3em] uppercase text-muted-foreground mb-3">
                  Comment payer
                </p>
                {[
                  { step: "01", text: "Contactez-nous sur WhatsApp pour obtenir les instructions de paiement" },
                  { step: "02", text: "Effectuez le paiement via Mobile Money ou virement" },
                  { step: "03", text: "Entrez votre référence de transaction ci-dessous" },
                  { step: "04", text: "Nous activons votre boutique sous 24–48h" },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3 mb-3 last:mb-0">
                    <span
                      className="text-[10px] font-display font-bold w-6 shrink-0 mt-0.5"
                      style={{ color: GOLD }}
                    >
                      {step}
                    </span>
                    <p className="text-xs font-body text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              {/* Bouton WhatsApp */}
              <div className="p-4">
                <a
                  href={`https://wa.me/${ADMIN_WHATSAPP}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press w-full flex items-center justify-center gap-2 font-body font-medium text-[10px] tracking-[0.2em] uppercase py-3.5 transition-all duration-200"
                  style={{ background: "#25D366", color: "#fff" }}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Contacter MASFLY pour payer
                </a>
              </div>
            </div>

            {/* Formulaire référence */}
            <div className="border border-border p-5" style={{ background: "var(--card)" }}>
              <p className="text-[9px] font-body tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Après paiement — déclarez votre référence
              </p>
              <form onSubmit={handleDeclarePayment} className="space-y-3">
                <div className="space-y-2">
                  <label className="text-[9px] font-body tracking-[0.2em] uppercase text-muted-foreground">
                    Référence de transaction
                  </label>
                  <Input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ex: TXN-2025-XXXXX"
                    className="h-11 text-sm border-border focus-visible:ring-0 focus-visible:border-[#C9A84C]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !reference.trim()}
                  className="btn-press w-full flex items-center justify-center gap-2 font-body font-medium text-[10px] tracking-[0.2em] uppercase py-3.5 transition-all duration-200 disabled:opacity-50 hover:opacity-90"
                  style={{ background: GOLD, color: "#0a0a0a" }}
                >
                  {loading ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Envoi...</>
                  ) : (
                    <>J'ai payé — déclarer mon paiement <ArrowRight className="h-3 w-3" /></>
                  )}
                </button>
              </form>
            </div>

            {/* Alerte */}
            <div className="flex items-start gap-3 p-4 border border-border">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: `rgba(201,168,76,0.7)` }} />
              <p className="text-[10px] font-body text-muted-foreground leading-relaxed">
                Ne déclarez votre paiement qu'après avoir réellement effectué le virement. Toute fausse déclaration entraîne la suspension du compte.
              </p>
            </div>
          </div>
        )}

        {/* Lien retour */}
        <p className="text-center mt-8">
          <button
            onClick={() => navigate("/vendor/setup")}
            className="text-[10px] tracking-[0.2em] uppercase font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Modifier mon profil boutique
          </button>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default VendorPayment;
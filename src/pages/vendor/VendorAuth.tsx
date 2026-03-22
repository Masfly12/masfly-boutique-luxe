import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useVendorAuth } from "@/hooks/useVendor";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Store, User } from "lucide-react";

const GOLD = "#C9A84C";
type Mode = "login" | "signup";

const VendorAuth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useVendorAuth();

  const [mode, setMode]             = useState<Mode>("login");
  const [showPwd, setShowPwd]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [form, setForm] = useState({
    email: "", password: "", confirm: "", fullName: "",
  });

  const pwdMismatch = mode === "signup" && form.confirm.length > 0 && form.confirm !== form.password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdMismatch) return;
    if (mode === "signup" && form.password.length < 6) {
      toast.error("Mot de passe trop court (6 caractères min)");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(form.email, form.password);
        toast.success("Compte créé ! Configurez votre boutique.");
        navigate("/vendor/setup");
      } else {
        await signIn(form.email, form.password);
        navigate("/vendor/dashboard");
      }
    } catch (err: any) {
      const msg = err.message?.includes("Invalid login")
        ? "Email ou mot de passe incorrect"
        : err.message?.includes("already registered")
        ? "Cet email est déjà utilisé"
        : err.message || "Une erreur est survenue";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-14 flex justify-center">
        <div className="w-full max-w-md">

          {/* En-tête */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 mx-auto mb-5 flex items-center justify-center relative"
              style={{ border: `1px solid rgba(201,168,76,0.35)`, background: "#0a0a0a" }}
            >
              <Store className="h-6 w-6" style={{ color: GOLD }} />
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8" style={{ background: GOLD, opacity: 0.4 }} />
              <p className="text-[9px] font-body tracking-[0.35em] uppercase" style={{ color: GOLD }}>
                Espace vendeur
              </p>
              <div className="h-px w-8" style={{ background: GOLD, opacity: 0.4 }} />
            </div>
            <h1 className="font-display text-2xl font-light tracking-wide text-foreground">
              {mode === "login" ? "Connexion vendeur" : "Devenir vendeur"}
            </h1>
            <p className="text-xs text-muted-foreground font-body mt-1.5 tracking-wide">
              {mode === "login"
                ? "Accédez à votre espace boutique"
                : "Créez votre boutique sur MASFLY"}
            </p>
          </div>

          {/* Carte */}
          <div className="border border-border overflow-hidden" style={{ background: "var(--card)" }}>

            {/* Tabs */}
            <div className="flex border-b border-border">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 py-3.5 text-[10px] font-body tracking-[0.2em] uppercase transition-all"
                  style={{
                    color: mode === m ? GOLD : "var(--muted-foreground)",
                    borderBottom: mode === m ? `2px solid ${GOLD}` : "2px solid transparent",
                    background: mode === m ? "rgba(201,168,76,0.03)" : "",
                  }}
                >
                  {m === "login" ? "Connexion" : "Inscription"}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Nom — inscription */}
                {mode === "signup" && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-body tracking-[0.3em] uppercase text-muted-foreground">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="Jean Dupont"
                        className="pl-10 h-11 text-sm border-border focus-visible:ring-0 focus-visible:border-[#C9A84C]"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[9px] font-body tracking-[0.3em] uppercase text-muted-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="votre@email.com"
                      required
                      className="pl-10 h-11 text-sm border-border focus-visible:ring-0 focus-visible:border-[#C9A84C]"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <label className="text-[9px] font-body tracking-[0.3em] uppercase text-muted-foreground">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="pl-10 pr-10 h-11 text-sm border-border focus-visible:ring-0 focus-visible:border-[#C9A84C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirmer MDP */}
                {mode === "signup" && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-body tracking-[0.3em] uppercase text-muted-foreground">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        type={showPwd ? "text" : "password"}
                        value={form.confirm}
                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        placeholder="••••••••"
                        required
                        className="pl-10 h-11 text-sm border-border focus-visible:ring-0 focus-visible:border-[#C9A84C]"
                        style={{ borderColor: pwdMismatch ? "var(--destructive)" : undefined }}
                      />
                    </div>
                    {pwdMismatch && (
                      <p className="text-[10px] text-destructive font-body">Les mots de passe ne correspondent pas</p>
                    )}
                  </div>
                )}

                {/* Bouton */}
                <button
                  type="submit"
                  disabled={loading || pwdMismatch}
                  className="btn-press w-full flex items-center justify-center gap-2 font-body font-medium text-[10px] tracking-[0.2em] uppercase py-[14px] mt-2 transition-all duration-200 disabled:opacity-50 hover:opacity-90"
                  style={{ background: GOLD, color: "#0a0a0a" }}
                >
                  {loading ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Chargement...</>
                  ) : (
                    <>
                      {mode === "login" ? "Se connecter" : "Créer mon compte vendeur"}
                      <ArrowRight className="h-3 w-3" />
                    </>
                  )}
                </button>

                {/* Info inscription */}
                {mode === "signup" && (
                  <div
                    className="p-4 text-[10px] font-body leading-relaxed text-muted-foreground"
                    style={{ borderLeft: `2px solid rgba(201,168,76,0.4)`, paddingLeft: "16px" }}
                  >
                    Après inscription : configurez votre boutique → payez les frais d'accès → attendez notre validation. Délai : 24–48h.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Liens */}
          <div className="flex items-center justify-between mt-5">
            <Link
              to="/"
              className="text-[10px] tracking-[0.2em] uppercase font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Accueil
            </Link>
            <Link
              to="/connexion"
              className="text-[10px] tracking-[0.2em] uppercase font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              Espace acheteur →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorAuth;
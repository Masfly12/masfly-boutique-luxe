import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";

const GOLD = "#C9A84C";
type Mode = "login" | "signup" | "reset";

/* ── Champ de formulaire luxe ── */
function Field({
  label, icon: Icon, type = "text", value, onChange, placeholder, required, error,
  right,
}: {
  label: string;
  icon: React.ElementType;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-body tracking-[0.3em] uppercase text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="pl-10 pr-10 h-11 text-sm border-border focus-visible:ring-0 focus-visible:border-[#C9A84C] transition-colors"
          style={{
            borderColor: error ? "var(--destructive)" : undefined,
          }}
        />
        {right && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>
        )}
      </div>
      {error && <p className="text-[10px] text-destructive font-body">{error}</p>}
    </div>
  );
}

const Connexion = () => {
  usePageTitle("Connexion");
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [mode, setMode]         = useState<Mode>("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const pwdMismatch = mode === "signup" && confirm.length > 0 && confirm !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        toast.success("Bienvenue !");
        navigate("/compte");
      } else if (mode === "signup") {
        if (pwdMismatch) throw new Error("Les mots de passe ne correspondent pas.");
        if (password.length < 6) throw new Error("Mot de passe trop court (6 caractères min).");
        await signUp(email, password, fullName);
        toast.success("Compte créé ! Vérifiez votre email.");
        navigate("/compte");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/compte`,
          });
        if (error) throw error;
        setResetSent(true);
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const eyeBtn = (
    <button
      type="button"
      onClick={() => setShowPwd(!showPwd)}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground page-transition">
      <Navbar />

      <div className="container mx-auto px-4 py-14 flex justify-center">
        <div className="w-full max-w-md">

          {/* ── En-tête ── */}
          <div className="text-center mb-8">
            {/* Monogramme décoratif */}
            <div
              className="w-14 h-14 mx-auto mb-5 flex items-center justify-center relative"
              style={{ border: `1px solid rgba(201,168,76,0.35)` }}
            >
              <div className="absolute inset-0" style={{ background: "rgba(201,168,76,0.04)" }} />
              <User className="h-5 w-5" style={{ color: GOLD }} />
            </div>

            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8" style={{ background: GOLD, opacity: 0.4 }} />
              <p className="text-[9px] font-body tracking-[0.35em] uppercase" style={{ color: GOLD }}>
                Espace client
              </p>
              <div className="h-px w-8" style={{ background: GOLD, opacity: 0.4 }} />
            </div>

            <h1 className="font-display text-2xl font-light tracking-wide text-foreground">
              {mode === "login"  && "Connexion"}
              {mode === "signup" && "Créer un compte"}
              {mode === "reset"  && "Réinitialisation"}
            </h1>
            <p className="text-xs text-muted-foreground font-body mt-1.5 tracking-wide">
              {mode === "login"  && "Accédez à votre espace MASFLY"}
              {mode === "signup" && "Rejoignez la communauté MASFLY"}
              {mode === "reset"  && "Recevez un lien de réinitialisation"}
            </p>
          </div>

          {/* ── Carte principale ── */}
          <div
            className="border border-border overflow-hidden"
            style={{ background: "var(--card)" }}
          >
            {/* Tabs login / signup */}
            {mode !== "reset" && (
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
            )}

            {/* Contenu formulaire */}
            <div className="p-6 md:p-8">

              {/* ── Email de réinitialisation envoyé ── */}
              {resetSent ? (
                <div className="text-center py-6 space-y-4">
                  <div
                    className="w-12 h-12 mx-auto flex items-center justify-center"
                    style={{ border: `1px solid rgba(201,168,76,0.3)` }}
                  >
                    <Mail className="h-5 w-5" style={{ color: GOLD }} />
                  </div>
                  <p className="font-body text-sm text-foreground font-medium tracking-wide">
                    Email envoyé !
                  </p>
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">
                    Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
                  </p>
                  <button
                    onClick={() => { setMode("login"); setResetSent(false); }}
                    className="text-[10px] tracking-[0.2em] uppercase font-body transition-colors"
                    style={{ color: GOLD }}
                  >
                    ← Retour à la connexion
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Nom — inscription */}
                  {mode === "signup" && (
                    <Field
                      label="Prénom & Nom"
                      icon={User}
                      value={fullName}
                      onChange={setFullName}
                      placeholder="Jean Dupont"
                    />
                  )}

                  {/* Email */}
                  <Field
                    label="Email"
                    icon={Mail}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="vous@exemple.com"
                    required
                  />

                  {/* Mot de passe */}
                  {mode !== "reset" && (
                    <Field
                      label="Mot de passe"
                      icon={Lock}
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={setPassword}
                      placeholder="••••••••"
                      required
                      right={eyeBtn}
                    />
                  )}

                  {/* Confirmer MDP — inscription */}
                  {mode === "signup" && (
                    <Field
                      label="Confirmer le mot de passe"
                      icon={Lock}
                      type={showPwd ? "text" : "password"}
                      value={confirm}
                      onChange={setConfirm}
                      placeholder="••••••••"
                      required
                      error={pwdMismatch ? "Les mots de passe ne correspondent pas" : undefined}
                    />
                  )}

                  {/* Mot de passe oublié */}
                  {mode === "login" && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setMode("reset")}
                        className="text-[10px] tracking-[0.15em] uppercase font-body text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                  )}

                  {/* Bouton soumettre */}
                  <button
                    type="submit"
                    disabled={loading || pwdMismatch}
                    className="btn-press w-full flex items-center justify-center gap-2 font-body font-medium text-[10px] tracking-[0.2em] uppercase py-[14px] mt-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ background: GOLD, color: "#0a0a0a" }}
                  >
                    {loading ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Chargement...</>
                    ) : (
                      <>
                        {mode === "login"  && "Se connecter"}
                        {mode === "signup" && "Créer mon compte"}
                        {mode === "reset"  && "Envoyer le lien"}
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </button>

                  {/* CGU inscription */}
                  {mode === "signup" && (
                    <p className="text-[10px] text-muted-foreground font-body text-center leading-relaxed">
                      En créant un compte, vous acceptez nos{" "}
                      <Link to="/conditions-utilisation" className="underline underline-offset-2 hover:text-foreground transition-colors">
                        conditions d'utilisation
                      </Link>{" "}
                      et notre{" "}
                      <Link to="/confidentialite" className="underline underline-offset-2 hover:text-foreground transition-colors">
                        politique de confidentialité
                      </Link>.
                    </p>
                  )}

                  {mode === "reset" && (
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="w-full text-[10px] tracking-[0.2em] uppercase font-body text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Retour
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Retour accueil */}
          <p className="text-center mt-5">
            <Link
              to="/"
              className="text-[10px] tracking-[0.2em] uppercase font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Connexion;
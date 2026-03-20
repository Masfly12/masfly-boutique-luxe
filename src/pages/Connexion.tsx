import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";

type Mode = "login" | "signup" | "reset";

const Connexion = () => {
  usePageTitle("Connexion");
  const navigate  = useNavigate();
  const { signIn, signUp } = useAuth();

  const [mode, setMode]         = useState<Mode>("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        toast.success("Bienvenue !");
        navigate("/compte");
      } else if (mode === "signup") {
        if (password !== confirm) throw new Error("Les mots de passe ne correspondent pas.");
        if (password.length < 6) throw new Error("Mot de passe trop court (6 caractères min).");
        await signUp(email, password, fullName);
        toast.success("Compte créé ! Vérifiez votre email pour confirmer.");
        navigate("/compte");
      } else {
        const { error } = await (await import("@/integrations/supabase/client")).supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/compte`,
        });
        if (error) throw error;
        setResetSent(true);
        toast.success("Email de réinitialisation envoyé !");
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground page-transition">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-primary px-8 py-8 text-center">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="h-7 w-7 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white">
                {mode === "login"  && "Connexion"}
                {mode === "signup" && "Créer un compte"}
                {mode === "reset"  && "Mot de passe oublié"}
              </h1>
              <p className="text-white/70 font-body text-sm mt-1">
                {mode === "login"  && "Accédez à votre espace MASFLY"}
                {mode === "signup" && "Rejoignez la communauté MASFLY"}
                {mode === "reset"  && "On vous envoie un lien de réinitialisation"}
              </p>
            </div>

            {/* Tabs login / signup */}
            {mode !== "reset" && (
              <div className="flex border-b border-border">
                {(["login", "signup"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-3.5 text-sm font-body font-semibold transition-colors ${
                      mode === m
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "login" ? "Connexion" : "Inscription"}
                  </button>
                ))}
              </div>
            )}

            {/* Form */}
            <div className="px-8 py-6">
              {resetSent ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="font-body text-sm text-foreground font-semibold">Email envoyé !</p>
                  <p className="text-xs text-muted-foreground font-body">Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.</p>
                  <button onClick={() => { setMode("login"); setResetSent(false); }} className="text-sm text-primary hover:underline font-body">
                    Retour à la connexion
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nom — inscription seulement */}
                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Prénom & Nom</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Jean Dupont"
                          className="pl-10 h-11 rounded-xl"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vous@exemple.com"
                        className="pl-10 h-11 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Mot de passe */}
                  {mode !== "reset" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Mot de passe</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPwd ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11 rounded-xl"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(!showPwd)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirmer mot de passe — inscription */}
                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Confirmer le mot de passe</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPwd ? "text" : "password"}
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          placeholder="••••••••"
                          className={`pl-10 h-11 rounded-xl ${confirm && confirm !== password ? "border-destructive" : ""}`}
                          required
                        />
                      </div>
                      {confirm && confirm !== password && (
                        <p className="text-xs text-destructive font-body">Les mots de passe ne correspondent pas</p>
                      )}
                    </div>
                  )}

                  {/* Mot de passe oublié — login */}
                  {mode === "login" && (
                    <div className="text-right">
                      <button type="button" onClick={() => setMode("reset")} className="text-xs text-primary hover:underline font-body">
                        Mot de passe oublié ?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-press w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-body font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Chargement…</>
                    ) : (
                      <>
                        {mode === "login"  && "Se connecter"}
                        {mode === "signup" && "Créer mon compte"}
                        {mode === "reset"  && "Envoyer le lien"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  {/* CGU inscription */}
                  {mode === "signup" && (
                    <p className="text-[11px] text-muted-foreground font-body text-center leading-relaxed">
                      En créant un compte, vous acceptez nos{" "}
                      <Link to="/conditions-utilisation" className="text-primary hover:underline">conditions d'utilisation</Link>
                      {" "}et notre{" "}
                      <Link to="/confidentialite" className="text-primary hover:underline">politique de confidentialité</Link>.
                    </p>
                  )}

                  {mode === "reset" && (
                    <button type="button" onClick={() => setMode("login")} className="w-full text-sm text-muted-foreground hover:text-foreground font-body transition-colors">
                      ← Retour à la connexion
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Lien retour */}
          <p className="text-center mt-4 text-sm text-muted-foreground font-body">
            <Link to="/" className="hover:text-primary transition-colors">← Retour à l'accueil</Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Connexion;
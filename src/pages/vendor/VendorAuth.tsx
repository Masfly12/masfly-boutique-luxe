import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAuth } from "@/hooks/useVendor";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Store, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const VendorAuth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useVendorAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(form.email, form.password);
        toast.success("Compte créé ! Complétez votre profil vendeur.");
      } else {
        await signIn(form.email, form.password);
        toast.success("Connexion réussie !");
      }
      navigate("/vendeur/dashboard");
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

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {isSignUp ? "Créer votre boutique" : "Espace Vendeur"}
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              {isSignUp
                ? "Rejoignez MASFLY et commencez à vendre dès aujourd'hui"
                : "Connectez-vous pour gérer votre boutique"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-body font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-body font-medium text-foreground">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isSignUp && (
                  <p className="text-xs text-muted-foreground">Minimum 6 caractères</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold py-2.5 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Chargement...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isSignUp ? "Créer mon compte" : "Se connecter"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}
              </p>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline font-medium mt-1"
              >
                {isSignUp ? "Se connecter" : "Créer une boutique gratuitement"}
              </button>
            </div>
          </div>

          {/* Info */}
          {isSignUp && (
            <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                🎉 Après inscription, vous pourrez configurer votre boutique et ajouter vos produits immédiatement. Votre boutique sera visible après validation par l'équipe MASFLY.
              </p>
            </div>
          )}

          {/* Back to site */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            <span
              className="hover:text-primary cursor-pointer underline underline-offset-2"
              onClick={() => navigate("/")}
            >
              ← Retour à la boutique
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorAuth;
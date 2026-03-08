import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";

const Admin = () => {
  const { user, loading, isAdmin, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success("Compte créé avec succès ! Vous êtes maintenant connecté.");
      } else {
        await signIn(email, password);
        toast.success("Connexion réussie !");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-pulse text-gold font-display text-2xl">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark text-foreground">
        <Navbar />
        <div className="flex items-center justify-center py-20 px-4">
          <div className="w-full max-w-md bg-dark-card rounded-xl border border-gold/20 p-8">
            <h1 className="font-display text-2xl font-bold text-center mb-2">Administration</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {isSignUp ? "Créez votre compte administrateur" : "Connectez-vous pour gérer vos produits"}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-dark border-gold/20"
                required
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-dark border-gold/20"
                required
              />
              <Button
                type="submit"
                disabled={submitting}
                className="w-full gradient-gold text-dark font-semibold hover:opacity-90"
              >
                {submitting ? "Chargement..." : isSignUp ? "Créer le compte" : "Se connecter"}
              </Button>
            </form>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm text-gold/70 hover:text-gold mt-4 transition-colors"
            >
              {isSignUp ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? S'inscrire"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-dark text-foreground">
        <Navbar />
        <div className="flex items-center justify-center py-20 px-4">
          <div className="w-full max-w-md bg-dark-card rounded-xl border border-destructive/30 p-8 text-center">
            <h1 className="font-display text-2xl font-bold mb-2 text-destructive">Accès refusé</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Vous n'avez pas les droits d'administration.
            </p>
            <Button onClick={signOut} variant="outline" className="border-gold/30 text-foreground hover:bg-gold/10">
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">
            Tableau de <span className="text-gold">Bord</span>
          </h1>
          <Button onClick={signOut} variant="outline" className="border-gold/30 text-foreground hover:bg-gold/10">
            Déconnexion
          </Button>
        </div>
        <AdminDashboard />
      </div>
    </div>
  );
};

export default Admin;

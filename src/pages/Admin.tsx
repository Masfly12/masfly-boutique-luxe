import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";

const Admin = () => {
  const { user, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success("Connexion réussie !");
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
            <p className="text-sm text-muted-foreground text-center mb-6">Connectez-vous pour gérer vos produits</p>
            <form onSubmit={handleLogin} className="space-y-4">
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
                {submitting ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
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

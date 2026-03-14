import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentVendor, useUpsertVendor } from "@/hooks/useVendor";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";

const Admin = () => {
  const { user, loading, isAdmin, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopWhatsapp, setShopWhatsapp] = useState("");
  const [shopAddress, setShopAddress] = useState("");

  const { data: vendor, isLoading: loadingVendor } = useCurrentVendor(user?.id);
  const upsertVendor = useUpsertVendor(user?.id);

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
      <div className="dark min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-pulse text-gold font-display text-2xl">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dark min-h-screen bg-dark text-foreground">
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

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      toast.error("Le nom de la boutique est obligatoire.");
      return;
    }

    const slug = shopName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    upsertVendor.mutate({
      name: shopName.trim(),
      slug,
      description: shopDescription || undefined,
      whatsapp: shopWhatsapp || undefined,
      address: shopAddress || undefined,
    });
  };

  return (
    <div className="dark min-h-screen bg-dark text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Espace <span className="text-gold">Vendeur</span>
            </h1>
            {isAdmin && (
              <p className="text-xs text-gold/70 mt-1">
                Vous êtes aussi administrateur. Vous voyez tous les produits.
              </p>
            )}
          </div>
          <Button onClick={signOut} variant="outline" className="border-gold/30 text-foreground hover:bg-gold/10">
            Déconnexion
          </Button>
        </div>

        {/* Profil vendeur */}
        <div className="bg-dark-card rounded-xl border border-gold/20 p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Profil de la boutique</h2>
          {loadingVendor ? (
            <p className="text-sm text-muted-foreground">Chargement du profil vendeur...</p>
          ) : (
            <form onSubmit={handleVendorSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Nom de la boutique</label>
                  <Input
                    value={shopName || vendor?.name || ""}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Ex: MASFLY Shop Cotonou"
                    className="bg-dark border-gold/20"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">WhatsApp</label>
                  <Input
                    value={shopWhatsapp || vendor?.whatsapp || ""}
                    onChange={(e) => setShopWhatsapp(e.target.value)}
                    placeholder="+229..."
                    className="bg-dark border-gold/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Adresse</label>
                  <Input
                    value={shopAddress || vendor?.address || ""}
                    onChange={(e) => setShopAddress(e.target.value)}
                    placeholder="Ville, quartier..."
                    className="bg-dark border-gold/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <Textarea
                  value={shopDescription || vendor?.description || ""}
                  onChange={(e) => setShopDescription(e.target.value)}
                  placeholder="Présentez rapidement votre boutique, vos produits..."
                  className="bg-dark border-gold/20"
                />
              </div>
              <Button
                type="submit"
                disabled={upsertVendor.isPending}
                className="gradient-gold text-dark font-semibold hover:opacity-90"
              >
                {upsertVendor.isPending ? "Enregistrement..." : vendor ? "Mettre à jour le profil" : "Créer le profil"}
              </Button>
            </form>
          )}
        </div>

        {/* Gestion des produits */}
        <AdminDashboard
          vendorId={vendor?.id}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default Admin;

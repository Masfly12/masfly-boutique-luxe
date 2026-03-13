import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAuth, useVendorProfile, useSaveVendorProfile, uploadVendorLogo } from "@/hooks/useVendor";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Store, Phone, Camera, CheckCircle, Loader2 } from "lucide-react";

const VendorSetup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useVendorAuth();
  const { data: existingProfile } = useVendorProfile(user?.id);
  const saveProfile = useSaveVendorProfile();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    shop_name: existingProfile?.shop_name || "",
    shop_description: existingProfile?.shop_description || "",
    phone: existingProfile?.phone || "",
    whatsapp: existingProfile?.whatsapp || "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(existingProfile?.logo_url || "");
  const [saving, setSaving] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/vendeur/connexion");
    return null;
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shop_name.trim()) {
      toast.error("Le nom de la boutique est obligatoire");
      return;
    }
    setSaving(true);
    try {
      let logoUrl = existingProfile?.logo_url || "";
      if (logoFile) {
        logoUrl = await uploadVendorLogo(logoFile);
      }
      await saveProfile.mutateAsync({
        user_id: user.id,
        shop_name: form.shop_name,
        shop_description: form.shop_description,
        phone: form.phone,
        whatsapp: form.whatsapp,
        logo_url: logoUrl,
      });
      toast.success("Profil enregistré !");
      navigate("/vendeur/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Configurer votre boutique
          </h1>
          <p className="text-muted-foreground font-body">
            Ces informations seront visibles par vos clients
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-body font-semibold text-foreground mb-4">Logo de la boutique</h2>
            <div className="flex items-center gap-5">
              <div
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-border bg-secondary flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => logoInputRef.current?.click()}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Store className="h-10 w-10 text-muted-foreground/40" />
                )}
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => logoInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {logoPreview ? "Changer le logo" : "Ajouter un logo"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG – max 5 Mo</p>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          {/* Infos boutique */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-body font-semibold text-foreground">Informations de la boutique</h2>

            <div className="space-y-1.5">
              <label className="text-sm font-body font-medium text-foreground">
                Nom de la boutique <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Ex: KOSI Fashion, TechShop Bénin..."
                value={form.shop_name}
                onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-body font-medium text-foreground">
                Description de la boutique
              </label>
              <Textarea
                placeholder="Décrivez vos produits et votre boutique en quelques mots..."
                value={form.shop_description}
                onChange={(e) => setForm({ ...form, shop_description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Contact */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-body font-semibold text-foreground">Coordonnées de contact</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-body font-medium text-foreground">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="+229 XX XX XX XX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-body font-medium text-foreground">WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="+229 XX XX XX XX"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Votre boutique sera soumise à validation par l'équipe MASFLY avant d'être visible publiquement. Vous pouvez dès maintenant ajouter vos produits.
            </p>
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold py-3"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Enregistrement...
              </span>
            ) : "Enregistrer et accéder au tableau de bord"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VendorSetup;
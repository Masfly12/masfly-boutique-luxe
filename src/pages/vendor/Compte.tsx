import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageTransition } from "@/hooks/usePageTransition";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  User, ShoppingBag, Heart, Settings, LogOut, Loader2,
  Package, ChevronRight, CheckCircle2, Clock, Truck, XCircle,
  Phone, MapPin, Mail, Edit3, Save,
} from "lucide-react";

type Tab = "commandes" | "profil" | "favoris";

const STATUS_UI: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending:   { label: "En attente",  color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  confirmed: { label: "Confirmée",   color: "text-blue-600   bg-blue-50   border-blue-200",   icon: CheckCircle2 },
  shipped:   { label: "Expédiée",    color: "text-purple-600 bg-purple-50 border-purple-200",  icon: Truck },
  delivered: { label: "Livrée",      color: "text-green-600  bg-green-50  border-green-200",   icon: CheckCircle2 },
  cancelled: { label: "Annulée",     color: "text-red-600    bg-red-50    border-red-200",     icon: XCircle },
};

const Compte = () => {
  usePageTitle("Mon compte");
  const { transitionKey } = usePageTransition();
  useScrollReveal();
  const navigate  = useNavigate();
  const { user, profile, loading, signOut, updateProfile } = useAuth();

  const [tab, setTab]           = useState<Tab>("commandes");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({
    full_name: profile?.full_name ?? "",
    phone:     profile?.phone     ?? "",
    address:   profile?.address   ?? "",
    city:      profile?.city      ?? "",
  });

  // Sync form when profile loads
  if (profile && !editMode && form.full_name === "" && profile.full_name) {
    setForm({
      full_name: profile.full_name ?? "",
      phone:     profile.phone     ?? "",
      address:   profile.address   ?? "",
      city:      profile.city      ?? "",
    });
  }

  // Commandes de l'utilisateur
  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ["user-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Favoris de l'utilisateur
  const { data: favorites, isLoading: loadingFavs } = useQuery({
    queryKey: ["favorites", user?.id],
    enabled: !!user && tab === "favoris",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("id, product_id, products(id, name, price, image_url)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Redirect to login if not authenticated
  if (!loading && !user) {
    navigate("/connexion");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      setEditMode(false);
      toast.success("Profil mis à jour !");
    } catch {
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Déconnecté.");
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Client";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div key={transitionKey} className="min-h-screen bg-background text-foreground page-transition">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-4xl">

        {/* Header profil */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6 flex items-center gap-4 reveal">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg font-bold text-foreground truncate">{displayName}</h1>
            <p className="text-sm text-muted-foreground font-body truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors font-body px-3 py-2 rounded-xl hover:bg-destructive/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-6 reveal">
          {([
            { id: "commandes", label: "Commandes", icon: ShoppingBag },
            { id: "profil",    label: "Profil",    icon: User },
            { id: "favoris",   label: "Favoris",   icon: Heart },
          ] as { id: Tab; label: string; icon: typeof User }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-body font-semibold transition-all ${
                tab === id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ── COMMANDES ── */}
        {tab === "commandes" && (
          <div className="space-y-3 reveal">
            {loadingOrders ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-card rounded-2xl skeleton-shimmer border border-border" />
                ))}
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Package className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <h2 className="font-display text-base font-semibold text-foreground mb-2">Aucune commande</h2>
                <p className="text-sm text-muted-foreground font-body mb-5">Vos commandes apparaîtront ici</p>
                <Link
                  to="/catalogue"
                  className="btn-press inline-flex items-center gap-2 bg-primary text-white font-body font-semibold px-5 py-2.5 rounded-xl text-sm"
                >
                  Découvrir le catalogue
                </Link>
              </div>
            ) : (
              orders.map((order: any) => {
                const s = STATUS_UI[order.status] ?? STATUS_UI.pending;
                const StatusIcon = s.icon;
                return (
                  <div key={order.id} className="bg-card border border-border rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground font-body mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "long", year: "numeric"
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] px-2.5 py-1 rounded-full border font-body font-semibold flex items-center gap-1 ${s.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {s.label}
                        </span>
                        <span className="font-display text-sm font-bold text-primary">
                          {Number(order.total_fcfa).toLocaleString("fr-FR")} F
                        </span>
                      </div>
                    </div>
                    {/* Articles */}
                    <div className="space-y-1">
                      {(order.order_items ?? []).slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex justify-between text-xs font-body text-muted-foreground">
                          <span className="truncate max-w-[60%]">{item.product_name} ×{item.quantity}</span>
                          <span>{Number(item.subtotal).toLocaleString("fr-FR")} F</span>
                        </div>
                      ))}
                      {(order.order_items ?? []).length > 3 && (
                        <p className="text-xs text-muted-foreground font-body">
                          +{order.order_items.length - 3} autre{order.order_items.length - 3 > 1 ? "s" : ""} article{order.order_items.length - 3 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── PROFIL ── */}
        {tab === "profil" && (
          <div className="bg-card border border-border rounded-2xl p-6 reveal">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-base font-bold">Informations personnelles</h2>
              {!editMode && (
                <button
                  onClick={() => {
                    setForm({
                      full_name: profile?.full_name ?? "",
                      phone:     profile?.phone     ?? "",
                      address:   profile?.address   ?? "",
                      city:      profile?.city      ?? "",
                    });
                    setEditMode(true);
                  }}
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline font-body"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Modifier
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Prénom Nom" className="pl-10 h-11 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+229 XX XX XX XX" className="pl-10 h-11 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Adresse</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Quartier, rue..." className="pl-10 h-11 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Ville</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Cotonou, Porto-Novo..." className="pl-10 h-11 rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-press flex-1 flex items-center justify-center gap-2 bg-primary text-white font-body font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Enregistrer
                  </button>
                  <button type="button" onClick={() => setEditMode(false)} className="flex-1 border border-border text-muted-foreground font-body font-semibold py-2.5 rounded-xl text-sm hover:bg-secondary transition-colors">
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {[
                  { icon: Mail,  label: "Email",     value: user?.email },
                  { icon: User,  label: "Nom",       value: profile?.full_name || "—" },
                  { icon: Phone, label: "Téléphone", value: profile?.phone     || "—" },
                  { icon: MapPin,label: "Adresse",   value: [profile?.address, profile?.city].filter(Boolean).join(", ") || "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-body">{label}</p>
                      <p className="text-sm text-foreground font-body font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FAVORIS ── */}
        {tab === "favoris" && (
          <div className="reveal">
            {loadingFavs ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 bg-card rounded-2xl skeleton-shimmer border border-border" />
                ))}
              </div>
            ) : !favorites || favorites.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Heart className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <h2 className="font-display text-base font-semibold text-foreground mb-2">Aucun favori</h2>
                <p className="text-sm text-muted-foreground font-body mb-5">Ajoutez des produits à vos favoris</p>
                <Link to="/catalogue" className="btn-press inline-flex items-center gap-2 bg-primary text-white font-body font-semibold px-5 py-2.5 rounded-xl text-sm">
                  Explorer le catalogue
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {favorites.map((fav: any) => {
                  const p = fav.products;
                  if (!p) return null;
                  return (
                    <Link key={fav.id} to={`/produit/${p.id}`} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-md transition-all group">
                      <div className="aspect-video bg-secondary overflow-hidden">
                        {p.image_url
                          ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          : <div className="w-full h-full flex items-center justify-center"><Package className="h-8 w-8 text-muted-foreground/20" /></div>
                        }
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-body font-semibold text-foreground line-clamp-1">{p.name}</p>
                        <p className="text-xs text-primary font-display font-bold mt-0.5">{Number(p.price).toLocaleString("fr-FR")} FCFA</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Compte;
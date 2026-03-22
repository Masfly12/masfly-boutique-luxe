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
  User, ShoppingBag, Heart, LogOut, Loader2, Package,
  Clock, Truck, XCircle, CheckCircle2,
  Phone, MapPin, Mail, Edit3, Save,
} from "lucide-react";

const GOLD = "#C9A84C";
type Tab = "commandes" | "profil" | "favoris";

const STATUS_UI: Record<string, { label: string; dotColor: string; icon: typeof Clock }> = {
  pending:   { label: "En attente",  dotColor: "#EAB308", icon: Clock },
  confirmed: { label: "Confirmée",   dotColor: "#3B82F6", icon: CheckCircle2 },
  shipped:   { label: "Expédiée",    dotColor: "#8B5CF6", icon: Truck },
  delivered: { label: "Livrée",      dotColor: "#22C55E", icon: CheckCircle2 },
  cancelled: { label: "Annulée",     dotColor: "#EF4444", icon: XCircle },
};

const Compte = () => {
  usePageTitle("Mon compte");
  const { transitionKey } = usePageTransition();
  useScrollReveal();
  const navigate = useNavigate();
  const { user, profile, loading, signOut, updateProfile } = useAuth();

  const [tab, setTab]           = useState<Tab>("commandes");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone:     profile?.phone     ?? "",
    address:   profile?.address   ?? "",
    city:      profile?.city      ?? "",
  });

  if (profile && !editMode && form.full_name === "" && profile.full_name) {
    setForm({
      full_name: profile.full_name ?? "",
      phone:     profile.phone     ?? "",
      address:   profile.address   ?? "",
      city:      profile.city      ?? "",
    });
  }

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

  if (!loading && !user) { navigate("/connexion"); return null; }
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: GOLD }} />
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
    } finally { setSaving(false); }
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

      <div className="container mx-auto px-4 py-10 max-w-4xl">

        {/* ── Header profil ── */}
        <div
          className="flex items-center gap-5 p-5 mb-6 border border-border reveal"
          style={{ background: "var(--card)" }}
        >
          {/* Avatar initiales */}
          <div
            className="w-14 h-14 flex items-center justify-center text-[18px] font-display font-bold flex-shrink-0"
            style={{
              background: "#0a0a0a",
              color: GOLD,
              border: `1px solid rgba(201,168,76,0.35)`,
            }}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg font-light tracking-wide text-foreground truncate">
              {displayName}
            </h1>
            <p className="text-[11px] text-muted-foreground font-body tracking-wide truncate mt-0.5">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="shrink-0 flex items-center gap-1.5 font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-destructive transition-colors px-3 py-2"
            style={{ border: "1px solid var(--border)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.4)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
          >
            <LogOut className="h-3 w-3" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>

        {/* ── Tabs ── */}
        <div
          className="flex mb-6 border border-border reveal"
          style={{ background: "var(--card)" }}
        >
          {([
            { id: "commandes", label: "Commandes", icon: ShoppingBag },
            { id: "profil",    label: "Profil",    icon: User },
            { id: "favoris",   label: "Favoris",   icon: Heart },
          ] as { id: Tab; label: string; icon: typeof User }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 font-body text-[10px] tracking-[0.2em] uppercase transition-all"
              style={{
                color: tab === id ? GOLD : "var(--muted-foreground)",
                borderBottom: tab === id ? `2px solid ${GOLD}` : "2px solid transparent",
                background: tab === id ? "rgba(201,168,76,0.03)" : "",
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ════════════════ COMMANDES ════════════════ */}
        {tab === "commandes" && (
          <div className="space-y-2 reveal">
            {loadingOrders ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-20 skeleton-shimmer border border-border" />
              ))
            ) : !orders || orders.length === 0 ? (
              <div
                className="text-center py-16 border border-border"
                style={{ background: "var(--card)" }}
              >
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center"
                  style={{ border: `1px solid rgba(201,168,76,0.2)` }}>
                  <Package className="h-5 w-5" style={{ color: "rgba(201,168,76,0.35)" }} />
                </div>
                <h2 className="font-display text-base font-light text-foreground mb-2 tracking-wide">
                  Aucune commande
                </h2>
                <p className="text-xs text-muted-foreground font-body mb-6 tracking-wide">
                  Vos commandes apparaîtront ici
                </p>
                <Link
                  to="/catalogue"
                  className="btn-press inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase px-7 py-3 transition-all duration-200 hover:opacity-90"
                  style={{ background: GOLD, color: "#0a0a0a" }}
                >
                  Découvrir le catalogue
                </Link>
              </div>
            ) : orders.map((order: any) => {
              const s = STATUS_UI[order.status] ?? STATUS_UI.pending;
              const StatusIcon = s.icon;
              return (
                <div
                  key={order.id}
                  className="border border-border p-4 transition-all duration-200"
                  style={{ background: "var(--card)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-body mt-1 tracking-wide">
                        {new Date(order.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Badge statut */}
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: s.dotColor }}
                        />
                        <span className="text-[10px] font-body tracking-[0.1em] uppercase text-muted-foreground">
                          {s.label}
                        </span>
                      </div>
                      {/* Total */}
                      <span className="font-display text-sm font-bold" style={{ color: GOLD }}>
                        {Number(order.total_fcfa).toLocaleString("fr-FR")}
                        <span className="text-[9px] font-body font-normal text-muted-foreground ml-1">F</span>
                      </span>
                    </div>
                  </div>

                  {/* Lignes articles */}
                  <div className="space-y-1 border-t border-border pt-3">
                    {(order.order_items ?? []).slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-[11px] font-body text-muted-foreground truncate max-w-[60%] tracking-wide">
                          {item.product_name}
                          <span className="opacity-60 ml-1">×{item.quantity}</span>
                        </span>
                        <span className="text-[11px] font-body text-foreground">
                          {Number(item.subtotal).toLocaleString("fr-FR")} F
                        </span>
                      </div>
                    ))}
                    {(order.order_items ?? []).length > 3 && (
                      <p className="text-[10px] text-muted-foreground font-body tracking-wide" style={{ color: `rgba(201,168,76,0.6)` }}>
                        +{order.order_items.length - 3} autre{order.order_items.length - 3 > 1 ? "s" : ""} article{order.order_items.length - 3 > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════════════════ PROFIL ════════════════ */}
        {tab === "profil" && (
          <div
            className="border border-border p-6 reveal"
            style={{ background: "var(--card)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-px w-4" style={{ background: GOLD }} />
                  <span className="text-[9px] font-body tracking-[0.3em] uppercase" style={{ color: GOLD }}>
                    Informations personnelles
                  </span>
                </div>
              </div>
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
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-body text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit3 className="h-3 w-3" />
                  Modifier
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: "full_name", label: "Nom complet",  icon: User,   placeholder: "Jean Dupont" },
                    { field: "phone",     label: "Téléphone",    icon: Phone,  placeholder: "+229 XX XX XX XX" },
                    { field: "address",   label: "Adresse",      icon: MapPin, placeholder: "Quartier, rue..." },
                    { field: "city",      label: "Ville",        icon: MapPin, placeholder: "Cotonou, Porto-Novo..." },
                  ].map(({ field, label, icon: Icon, placeholder }) => (
                    <div key={field} className="space-y-1.5">
                      <label className="text-[9px] font-body tracking-[0.3em] uppercase text-muted-foreground">
                        {label}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          value={(form as any)[field]}
                          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                          placeholder={placeholder}
                          className="pl-10 h-11 text-sm border-border focus-visible:ring-0 focus-visible:border-[#C9A84C]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-press flex-1 flex items-center justify-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase py-3 transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                    style={{ background: GOLD, color: "#0a0a0a" }}
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 font-body text-[10px] tracking-[0.2em] uppercase py-3 text-muted-foreground hover:text-foreground transition-colors border border-border"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {[
                  { icon: Mail,   label: "Email",     value: user?.email },
                  { icon: User,   label: "Nom",       value: profile?.full_name || "—" },
                  { icon: Phone,  label: "Téléphone", value: profile?.phone     || "—" },
                  { icon: MapPin, label: "Adresse",   value: [profile?.address, profile?.city].filter(Boolean).join(", ") || "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{ border: `1px solid rgba(201,168,76,0.2)` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: `rgba(201,168,76,0.6)` }} />
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground font-body tracking-[0.2em] uppercase">{label}</p>
                      <p className="text-sm text-foreground font-body font-medium mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════ FAVORIS ════════════════ */}
        {tab === "favoris" && (
          <div className="reveal">
            {loadingFavs ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 skeleton-shimmer border border-border" />
                ))}
              </div>
            ) : !favorites || favorites.length === 0 ? (
              <div
                className="text-center py-16 border border-border"
                style={{ background: "var(--card)" }}
              >
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center"
                  style={{ border: `1px solid rgba(201,168,76,0.2)` }}>
                  <Heart className="h-5 w-5" style={{ color: "rgba(201,168,76,0.35)" }} />
                </div>
                <h2 className="font-display text-base font-light text-foreground mb-2 tracking-wide">
                  Aucun favori
                </h2>
                <p className="text-xs text-muted-foreground font-body mb-6 tracking-wide">
                  Ajoutez des produits à vos favoris
                </p>
                <Link
                  to="/catalogue"
                  className="btn-press inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase px-7 py-3 transition-all duration-200 hover:opacity-90"
                  style={{ background: GOLD, color: "#0a0a0a" }}
                >
                  Explorer le catalogue
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {favorites.map((fav: any) => {
                  const p = fav.products;
                  if (!p) return null;
                  return (
                    <Link
                      key={fav.id}
                      to={`/produit/${p.id}`}
                      className="group border border-border overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/8"
                      style={{ background: "var(--card)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                    >
                      <div className="aspect-square overflow-hidden bg-secondary">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-107"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground/20" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-body font-medium text-foreground line-clamp-1 tracking-wide">
                          {p.name}
                        </p>
                        <p className="text-xs font-display font-bold mt-1" style={{ color: GOLD }}>
                          {Number(p.price).toLocaleString("fr-FR")}
                          <span className="text-[9px] font-body font-normal text-muted-foreground ml-1">FCFA</span>
                        </p>
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
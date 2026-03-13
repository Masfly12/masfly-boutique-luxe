import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useVendorAuth,
  useVendorProfile,
  useVendorProducts,
  useVendorOrders,
  useVendorStats,
} from "@/hooks/useVendor";
import { VendorProductForm } from "@/components/vendor/VendorProductForm";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Store, Package, ShoppingBag, TrendingUp, Clock,
  Plus, Pencil, Trash2, Settings, LogOut, Loader2,
  CheckCircle, XCircle, Truck, Eye, EyeOff,
  AlertCircle,
} from "lucide-react";

type Tab = "overview" | "products" | "orders" | "settings";

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: "En attente",  color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  confirmed: { label: "Confirmée",   color: "text-blue-600 bg-blue-50 border-blue-200",       icon: CheckCircle },
  shipped:   { label: "Expédiée",    color: "text-purple-600 bg-purple-50 border-purple-200",  icon: Truck },
  delivered: { label: "Livrée",      color: "text-green-600 bg-green-50 border-green-200",     icon: CheckCircle },
  cancelled: { label: "Annulée",     color: "text-red-600 bg-red-50 border-red-200",           icon: XCircle },
};

const VendorDashboard = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, loading: authLoading, signOut } = useVendorAuth();
  const { data: profile, isLoading: profileLoading } = useVendorProfile(user?.id);
  const { data: products, isLoading: productsLoading } = useVendorProducts(profile?.id);
  const { data: orders, isLoading: ordersLoading } = useVendorOrders(profile?.id);
  const stats = useVendorStats(profile?.id);

  const [tab, setTab] = useState<Tab>("overview");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products", profile?.id] });
      toast.success("Produit supprimé");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-orders", profile?.id] });
      toast.success("Statut mis à jour");
    },
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/vendeur/connexion");
  };

  // ── Loading states ──
  if (authLoading || profileLoading) {
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center max-w-md">
          <Store className="h-16 w-16 text-primary/30 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Boutique non configurée</h2>
          <p className="text-muted-foreground font-body mb-6">
            Vous devez d'abord configurer votre boutique avant d'accéder au tableau de bord.
          </p>
          <Button onClick={() => navigate("/vendeur/configurer")} className="bg-primary text-primary-foreground">
            Configurer ma boutique
          </Button>
        </div>
      </div>
    );
  }

  // ── TABS ──
  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview",  label: "Vue d'ensemble", icon: TrendingUp },
    { id: "products",  label: `Produits (${stats.totalProducts})`, icon: Package },
    { id: "orders",    label: `Commandes (${stats.totalOrders})`, icon: ShoppingBag },
    { id: "settings",  label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile.logo_url ? (
              <img src={profile.logo_url} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-border" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Store className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <h1 className="font-display font-bold text-foreground leading-tight">{profile.shop_name}</h1>
              <div className="flex items-center gap-1.5">
                {profile.is_approved ? (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Boutique approuvée
                  </span>
                ) : (
                  <span className="text-xs text-yellow-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> En attente de validation
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setShowForm(false); setEditProduct(null); }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-body font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl">

        {/* ── VUE D'ENSEMBLE ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Produits actifs", value: stats.activeProducts, total: stats.totalProducts, icon: Package, color: "text-blue-600 bg-blue-50" },
                { label: "Commandes reçues", value: stats.totalOrders, icon: ShoppingBag, color: "text-purple-600 bg-purple-50" },
                { label: "En attente", value: stats.pendingOrders, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
                { label: "Revenus (livrés)", value: `${stats.totalRevenue.toLocaleString("fr-FR")} F`, icon: TrendingUp, color: "text-green-600 bg-green-50" },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
                  {s.total !== undefined && (
                    <p className="text-xs text-muted-foreground">sur {s.total} total</p>
                  )}
                  <p className="text-sm text-muted-foreground font-body mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-foreground">Dernières commandes</h3>
                <button onClick={() => setTab("orders")} className="text-sm text-primary hover:underline">
                  Voir tout
                </button>
              </div>
              {orders?.slice(0, 5).map((order) => {
                const s = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
                return (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-sm font-semibold text-primary">{Number(order.total_amount).toLocaleString("fr-FR")} F</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-body ${s.color}`}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
              {!orders?.length && (
                <p className="text-muted-foreground text-sm text-center py-6">Aucune commande reçue.</p>
              )}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => { setTab("products"); setShowForm(true); }}
                className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-5 hover:bg-primary/10 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-body font-semibold text-foreground text-sm">Ajouter un produit</p>
                  <p className="text-xs text-muted-foreground">Mettre en vente un nouveau produit</p>
                </div>
              </button>
              <button
                onClick={() => setTab("settings")}
                className="flex items-center gap-3 bg-card border border-border rounded-2xl p-5 hover:bg-secondary transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-body font-semibold text-foreground text-sm">Paramètres boutique</p>
                  <p className="text-xs text-muted-foreground">Modifier les informations</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── PRODUITS ── */}
        {tab === "products" && (
          <div className="space-y-4">
            {!showForm && (
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground">Mes produits</h2>
                <Button onClick={() => { setShowForm(true); setEditProduct(null); }} className="bg-primary text-primary-foreground flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Ajouter
                </Button>
              </div>
            )}

            {showForm && (
              <VendorProductForm
                vendorId={profile.id}
                editProduct={editProduct}
                onClose={() => { setShowForm(false); setEditProduct(null); }}
              />
            )}

            {!showForm && (
              productsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-card rounded-2xl h-20 animate-pulse border border-border" />
                  ))}
                </div>
              ) : products?.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-body mb-4">Aucun produit. Ajoutez votre premier produit !</p>
                  <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" /> Ajouter un produit
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {products?.map((p) => {
                    const images = (p as any)?.product_images || [];
                    return (
                      <div key={p.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                          {images[0]?.image_url || p.image_url ? (
                            <img src={images[0]?.image_url || p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-body font-semibold text-foreground truncate">{p.name}</h3>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-primary font-semibold">{p.price.toLocaleString("fr-FR")} FCFA</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{(p.categories as any)?.name || "Sans catégorie"}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {p.is_active ? (
                              <span className="text-xs text-green-600 flex items-center gap-1"><Eye className="h-3 w-3" /> Visible</span>
                            ) : (
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><EyeOff className="h-3 w-3" /> Masqué</span>
                            )}
                            {images.length > 0 && (
                              <span className="text-xs text-muted-foreground">• {images.length} photo{images.length > 1 ? "s" : ""}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => { setEditProduct({ ...p, product_images: images }); setShowForm(true); }}
                            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Supprimer ce produit ?")) deleteMutation.mutate(p.id);
                            }}
                            className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        )}

        {/* ── COMMANDES ── */}
        {tab === "orders" && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">Mes commandes</h2>
            {ordersLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl h-24 animate-pulse border border-border" />
                ))}
              </div>
            ) : orders?.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-body">Aucune commande reçue pour l'instant.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders?.map((order) => {
                  const s = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
                  const StatusIcon = s.icon;
                  return (
                    <div key={order.id} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-body font-semibold text-foreground">{order.customer_name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-body flex items-center gap-1 ${s.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {s.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                          {order.customer_address && (
                            <p className="text-sm text-muted-foreground">{order.customer_address}</p>
                          )}
                          {order.notes && (
                            <p className="text-sm text-muted-foreground italic mt-1">"{order.notes}"</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-display text-lg font-bold text-primary">
                            {Number(order.total_amount).toLocaleString("fr-FR")} F
                          </p>
                          {/* Status update */}
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus.mutate({ id: order.id, status: e.target.value })}
                            className="mt-2 text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground font-body"
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PARAMÈTRES ── */}
        {tab === "settings" && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground">Paramètres de la boutique</h2>
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground font-body mb-1">Nom de la boutique</p>
                  <p className="font-body font-medium text-foreground">{profile.shop_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-body mb-1">Statut</p>
                  <p className={`font-body font-medium ${profile.is_approved ? "text-green-600" : "text-yellow-600"}`}>
                    {profile.is_approved ? "✓ Approuvée" : "⏳ En attente"}
                  </p>
                </div>
                {profile.phone && (
                  <div>
                    <p className="text-muted-foreground font-body mb-1">Téléphone</p>
                    <p className="font-body font-medium text-foreground">{profile.phone}</p>
                  </div>
                )}
                {profile.whatsapp && (
                  <div>
                    <p className="text-muted-foreground font-body mb-1">WhatsApp</p>
                    <p className="font-body font-medium text-foreground">{profile.whatsapp}</p>
                  </div>
                )}
              </div>
              {profile.shop_description && (
                <div>
                  <p className="text-muted-foreground font-body mb-1 text-sm">Description</p>
                  <p className="font-body text-sm text-foreground">{profile.shop_description}</p>
                </div>
              )}
              <Button
                onClick={() => navigate("/vendeur/configurer")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Modifier les informations
              </Button>
            </div>

            {/* Email du compte */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-body font-semibold text-foreground mb-3">Compte</h3>
              <p className="text-sm text-muted-foreground font-body">Email : <span className="text-foreground">{user.email}</span></p>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="mt-4 flex items-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
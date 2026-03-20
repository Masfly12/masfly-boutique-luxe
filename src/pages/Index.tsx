import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useFeaturedProducts, useCategories } from "@/hooks/useProducts";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, Truck, Shield, Headphones, Package, Star, Zap, ShoppingBag } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { usePageTransition } from "@/hooks/usePageTransition";
import heroBanner from "@/assets/hero-banner.jpg";

const CATEGORY_ICONS: Record<string, string> = {
  "mode-beaute": "👗",
  "produits-electroniques": "📱",
  "produits-importes": "📦",
};

const Index = () => {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: categories } = useCategories();
  usePageTitle();
  useScrollReveal();
  const { transitionKey } = usePageTransition();

  return (
    <div key={transitionKey} className="min-h-screen bg-background text-foreground page-transition">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={heroBanner} alt="MASFLY" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary-foreground text-xs font-body font-semibold px-3 py-1.5 rounded-full mb-5 backdrop-blur-sm">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-white/90">Livraison dans tout le Bénin 🇧🇯</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
              Les Meilleurs<br />
              <span className="text-primary">Produits</span> au Bénin
            </h1>
            <p className="font-body text-base md:text-lg text-white/75 mb-8 max-w-lg leading-relaxed">
              Mode, électronique et bien plus. Qualité premium, prix imbattables — commandez en quelques secondes via WhatsApp.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalogue"
                className="btn-press inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-body font-semibold px-7 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-primary/30"
              >
                <ShoppingBag className="h-4 w-4" />
                Voir les produits
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-body font-semibold px-7 py-3 rounded-xl transition-colors text-sm"
              >
                📱 WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
              {[
                { value: "500+", label: "Produits" },
                { value: "1 000+", label: "Clients satisfaits" },
                { value: "48h", label: "Livraison" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/50 font-body mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="bg-card border-y border-border reveal">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { icon: Truck,      text: "Livraison rapide",   sub: "Partout au Bénin" },
              { icon: Shield,     text: "Paiement sécurisé",  sub: "100% fiable" },
              { icon: Star,       text: "Qualité garantie",   sub: "Produits sélectionnés" },
              { icon: Headphones, text: "Support WhatsApp",   sub: "7j/7 disponible" },
            ].map(({ icon: Icon, text, sub }, i) => (
              <div
                key={text}
                className={`flex items-center gap-3 py-5 px-4 ${i < 3 ? "border-r border-border" : ""}`}
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-body font-semibold text-foreground">{text}</p>
                  <p className="text-xs text-muted-foreground font-body">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Catégories ── */}
      {categories && categories.length > 0 && (
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8 reveal">
              <div>
                <p className="text-xs font-body font-semibold text-primary uppercase tracking-widest mb-1">Collections</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Parcourir par catégorie
                </h2>
              </div>
              <Link to="/catalogue" className="hidden sm:flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-primary transition-colors">
                Voir tout <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/catalogue?cat=${cat.slug}`}
                  className={`reveal reveal-delay-${Math.min(i + 1, 6)} group relative bg-card border border-border rounded-2xl p-5 text-center hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-300" />
                  <div className="relative">
                    <div className="text-3xl mb-3">
                      {CATEGORY_ICONS[cat.slug] || "🛍️"}
                    </div>
                    <h3 className="font-body text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Produits populaires ── */}
      <section className="py-14 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8 reveal">
            <div>
              <p className="text-xs font-body font-semibold text-primary uppercase tracking-widest mb-1">Tendances</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Produits populaires
              </h2>
            </div>
            <Link to="/catalogue" className="hidden sm:flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-primary transition-colors">
              Voir tout <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl h-72 skeleton-shimmer border border-border" />
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featured.map((p, i) => {
                const images = ((p as any).product_images || [])
                  .sort((a: any, b: any) => a.display_order - b.display_order)
                  .map((img: any) => img.image_url);
                return (
                  <div key={p.id} className={`reveal reveal-delay-${Math.min(i + 1, 6)}`}>
                    <ProductCard
                      id={p.id}
                      name={p.name}
                      price={p.price}
                      description={p.description}
                      imageUrl={p.image_url}
                      imageUrls={images}
                      categoryName={(p.categories as any)?.name}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-body">Aucun produit populaire pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 reveal">
        <div className="container mx-auto px-4">
          <div className="relative bg-primary rounded-3xl overflow-hidden px-8 py-14 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
            </div>
            <div className="relative">
              <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-3">
                Prêt à commander ?
              </h2>
              <p className="text-white/75 font-body mb-8 max-w-md mx-auto">
                Contactez-nous directement sur WhatsApp — réponse en moins de 5 minutes.
              </p>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-2 bg-white text-primary font-body font-bold px-8 py-3.5 rounded-xl transition-all hover:bg-white/90 text-base shadow-lg"
              >
                📱 Commander sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useFeaturedProducts, useCategories } from "@/hooks/useProducts";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, Truck, Shield, Headphones, Package } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: categories } = useCategories();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="MASFLY Premium" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-xl">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
              Les Meilleurs Produits au Bénin
            </h1>
            <p className="font-body text-base md:text-lg text-primary-foreground/80 mb-6">
              Mode, électronique et bien plus. Qualité premium, prix imbattables.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 bg-card text-foreground font-body font-semibold px-6 py-2.5 rounded hover:bg-secondary transition-colors text-sm"
              >
                Voir les produits <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-primary-foreground font-body font-semibold px-6 py-2.5 rounded transition-colors text-sm"
              >
                📱 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { icon: Truck, text: "Livraison rapide" },
              { icon: Shield, text: "Paiement sécurisé" },
              { icon: Package, text: "Produits de qualité" },
              { icon: Headphones, text: "Support WhatsApp" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center justify-center gap-2 py-4">
                <Icon className="h-5 w-5 text-primary shrink-0" />
                <span className="text-xs md:text-sm font-body text-foreground font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories grid */}
      {categories && categories.length > 0 && (
        <section className="py-10 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                Parcourir par catégorie
              </h2>
              <Link to="/catalogue" className="text-sm font-body text-primary hover:underline flex items-center gap-1">
                Voir tout <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalogue?cat=${cat.slug}`}
                  className="group bg-card border border-border rounded-lg p-4 text-center hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-secondary flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{cat.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-10 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
              Produits populaires
            </h2>
            <Link to="/catalogue" className="text-sm font-body text-primary hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {loadingFeatured ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg h-72 animate-pulse border border-border" />
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featured.map((p) => {
                const images = ((p as any).product_images || [])
                  .sort((a: any, b: any) => a.display_order - b.display_order)
                  .map((img: any) => img.image_url);
                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    price={p.price}
                    description={p.description}
                    imageUrl={p.image_url}
                    imageUrls={images}
                    categoryName={(p.categories as any)?.name}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-body">Aucun produit populaire pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
            Prêt à commander ?
          </h2>
          <p className="text-muted-foreground font-body mb-5 max-w-md mx-auto text-sm">
            Contactez-nous directement sur WhatsApp pour passer votre commande rapidement.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-primary-foreground font-body font-semibold px-8 py-3 rounded transition-colors"
          >
            📱 Commander sur WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
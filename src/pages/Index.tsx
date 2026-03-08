import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useFeaturedProducts, useCategories } from "@/hooks/useProducts";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, Sparkles, Truck, Shield } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: categories } = useCategories();

  return (
    <div className="min-h-screen bg-dark text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="MASFLY Premium" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 gradient-dark opacity-80" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10">
            <span className="text-gold text-sm font-body font-medium">✨ Boutique Premium au Bénin</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Bienvenue chez <span className="text-gold">MASFLY</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Découvrez notre sélection exclusive de produits de qualité. Mode, électronique et bien plus encore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalogue"
              className="inline-flex items-center justify-center gap-2 gradient-gold text-dark font-body font-semibold px-8 py-3.5 rounded-lg shadow-gold hover:opacity-90 transition-opacity"
            >
              Voir les produits <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-body font-semibold px-8 py-3.5 rounded-lg transition-colors"
            >
              📱 Commander sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-y border-gold/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "Qualité Premium", desc: "Des produits soigneusement sélectionnés" },
              { icon: Truck, title: "Livraison Rapide", desc: "Livraison dans tout le Bénin" },
              { icon: Shield, title: "Paiement Sécurisé", desc: "Commandez en toute confiance" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-6 rounded-xl bg-dark-card border border-gold/10">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg gradient-gold flex items-center justify-center">
                  <Icon className="h-6 w-6 text-dark" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
              Nos <span className="text-gold">Catégories</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalogue?cat=${cat.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-dark-card border border-gold/10 hover:border-gold/30 p-8 text-center transition-all duration-300"
                >
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-gold transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                  <ArrowRight className="h-5 w-5 text-gold mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 bg-dark-card/50">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Produits <span className="text-gold">Populaires</span>
          </h2>
          {loadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-dark-card rounded-xl h-80 animate-pulse border border-gold/5" />
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  price={p.price}
                  description={p.description}
                  imageUrl={p.image_url}
                  categoryName={(p.categories as any)?.name}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Aucun produit populaire pour le moment. Revenez bientôt !</p>
          )}
          <div className="text-center mt-10">
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 border border-gold/30 text-gold hover:bg-gold/10 font-body font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Voir tout le catalogue <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

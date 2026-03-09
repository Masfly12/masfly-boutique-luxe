import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catSlug = searchParams.get("cat") || undefined;
  const queryParam = searchParams.get("q") || "";
  const [search, setSearch] = useState(queryParam);

  const { data: products, isLoading } = useProducts(catSlug);
  const { data: categories } = useCategories();

  useEffect(() => {
    setSearch(queryParam);
  }, [queryParam]);

  const filtered = products?.filter((p) =>
    search ? p.name.toLowerCase().includes(search.toLowerCase()) ||
             p.description?.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="min-h-screen bg-dark text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
          Notre <span className="text-gold">Catalogue</span>
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="pl-10 bg-dark-card border-gold/20 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchParams({})}
              className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors ${
                !catSlug ? "gradient-gold text-dark" : "bg-dark-card border border-gold/20 text-foreground hover:border-gold/40"
              }`}
            >
              Tous
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ cat: cat.slug })}
                className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors ${
                  catSlug === cat.slug ? "gradient-gold text-dark" : "bg-dark-card border border-gold/20 text-foreground hover:border-gold/40"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-dark-card rounded-xl h-80 animate-pulse border border-gold/5" />
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => {
              const images = ((p as any).product_images || [])
                .sort((a: any, b: any) => a.display_order - b.display_order)
                .map((img: any) => img.image_url);
              return (
                <ProductCard
                  key={p.id}
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
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">Aucun produit trouvé.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Catalogue;

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Package } from "lucide-react";

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

  const activeCat = categories?.find((c) => c.slug === catSlug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm font-body text-muted-foreground mb-4">
          <span className="hover:text-primary cursor-pointer" onClick={() => (window.location.href = "/")}>Accueil</span>
          <span className="mx-2">/</span>
          <span className={activeCat ? "hover:text-primary cursor-pointer" : "text-foreground font-medium"} onClick={() => !activeCat && setSearchParams({})}>
            Catalogue
          </span>
          {activeCat && (
            <>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">{activeCat.name}</span>
            </>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters - desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-card border border-border rounded-lg p-4 sticky top-32">
              <h3 className="font-body font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Catégories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSearchParams({})}
                  className={`block w-full text-left px-3 py-1.5 rounded text-sm font-body transition-colors ${
                    !catSlug ? "bg-primary text-primary-foreground font-medium" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  Tous les produits
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSearchParams({ cat: cat.slug })}
                    className={`block w-full text-left px-3 py-1.5 rounded text-sm font-body transition-colors ${
                      catSlug === cat.slug ? "bg-primary text-primary-foreground font-medium" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher dans cette catégorie..."
                  className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground h-10"
                />
              </div>
              {/* Mobile category pills */}
              <div className="flex lg:hidden flex-wrap gap-2">
                <button
                  onClick={() => setSearchParams({})}
                  className={`px-3 py-1.5 rounded text-xs font-body font-medium transition-colors ${
                    !catSlug ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:border-primary"
                  }`}
                >
                  Tous
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSearchParams({ cat: cat.slug })}
                    className={`px-3 py-1.5 rounded text-xs font-body font-medium transition-colors ${
                      catSlug === cat.slug ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm font-body text-muted-foreground mb-4">
              {filtered ? `${filtered.length} produit${filtered.length !== 1 ? "s" : ""} trouvé${filtered.length !== 1 ? "s" : ""}` : "Chargement..."}
            </div>

            {/* Products grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card rounded-lg h-72 animate-pulse border border-border" />
                ))}
              </div>
            ) : filtered && filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((p) => {
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
              <div className="text-center py-20 bg-card rounded-lg border border-border">
                <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-body">Aucun produit trouvé.</p>
                <button onClick={() => { setSearch(""); setSearchParams({}); }} className="mt-3 text-sm text-primary hover:underline font-body">
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalogue;

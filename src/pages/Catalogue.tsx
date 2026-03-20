import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageTransition } from "@/hooks/usePageTransition";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Package, X, LayoutGrid } from "lucide-react";

const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catSlug    = searchParams.get("cat") || undefined;
  const queryParam = searchParams.get("q")   || "";

  const [search, setSearch] = useState(queryParam);
  const debouncedSearch = useDebounce(search, 350);

  const { data: products, isLoading, isFetching } = useProducts({
    categorySlug: catSlug,
    search: debouncedSearch,
  });
  const { data: categories } = useCategories();

  usePageTitle("Catalogue");
  const { transitionKey } = usePageTransition();
  useScrollReveal();

  useEffect(() => { setSearch(queryParam); }, [queryParam]);

  useEffect(() => {
    if (debouncedSearch) {
      setSearchParams((prev) => { prev.set("q", debouncedSearch); return prev; }, { replace: true });
    } else {
      setSearchParams((prev) => { prev.delete("q"); return prev; }, { replace: true });
    }
  }, [debouncedSearch]); // eslint-disable-line

  const activeCat = categories?.find((c) => c.slug === catSlug);
  const resetFilters = () => { setSearch(""); setSearchParams({}); };
  const hasActiveFilter = !!catSlug || !!debouncedSearch;

  return (
    <div key={transitionKey} className="min-h-screen bg-background text-foreground page-transition">
      <Navbar />

      {/* Header catalogue */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/catalogue" className={activeCat ? "hover:text-primary transition-colors" : "text-foreground font-medium"}>Catalogue</Link>
            {activeCat && <><span>/</span><span className="text-foreground font-medium">{activeCat.name}</span></>}
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {activeCat ? activeCat.name : "Tous les produits"}
              </h1>
              {activeCat?.description && (
                <p className="text-sm text-muted-foreground font-body mt-1">{activeCat.description}</p>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground font-body bg-secondary px-3 py-1.5 rounded-full">
              <LayoutGrid className="h-3.5 w-3.5" />
              {isLoading || isFetching ? "…" : `${products?.length ?? 0} produit${(products?.length ?? 0) !== 1 ? "s" : ""}`}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-24">
              <h3 className="font-body font-bold text-foreground text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                Catégories
              </h3>
              <div className="space-y-0.5">
                <button
                  onClick={() => setSearchParams(search ? { q: search } : {})}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-body transition-colors ${
                    !catSlug ? "bg-primary text-white font-semibold" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  Tous les produits
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSearchParams(search ? { cat: cat.slug, q: search } : { cat: cat.slug })}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-body transition-colors ${
                      catSlug === cat.slug ? "bg-primary text-white font-semibold" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            {/* Barre recherche + pills mobile */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un produit…"
                  className="pl-10 pr-9 bg-card border-border h-11 rounded-xl"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {/* Pills mobile */}
              <div className="flex lg:hidden flex-wrap gap-2">
                <button
                  onClick={() => setSearchParams(search ? { q: search } : {})}
                  className={`px-3 py-1.5 rounded-xl text-xs font-body font-semibold transition-colors ${
                    !catSlug ? "bg-primary text-white" : "bg-card border border-border text-foreground hover:border-primary"
                  }`}
                >
                  Tous
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSearchParams(search ? { cat: cat.slug, q: search } : { cat: cat.slug })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-body font-semibold transition-colors ${
                      catSlug === cat.slug ? "bg-primary text-white" : "bg-card border border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Barre status */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-body text-muted-foreground">
                {isLoading || isFetching
                  ? "Recherche en cours…"
                  : `${products?.length ?? 0} produit${(products?.length ?? 0) !== 1 ? "s" : ""} trouvé${(products?.length ?? 0) !== 1 ? "s" : ""}`}
              </p>
              {hasActiveFilter && (
                <button onClick={resetFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <X className="h-3 w-3" /> Réinitialiser
                </button>
              )}
            </div>

            {/* Grille */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl h-72 skeleton-shimmer border border-border" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => {
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
                      isFeatured={(p as any).is_featured}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <Package className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-foreground font-body font-semibold mb-1">
                  {debouncedSearch ? `Aucun résultat pour « ${debouncedSearch} »` : "Aucun produit dans cette catégorie."}
                </p>
                <p className="text-sm text-muted-foreground font-body mb-4">Essaie une autre recherche ou une autre catégorie.</p>
                <button onClick={resetFilters} className="text-sm text-primary hover:underline font-body">
                  Voir tous les produits
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
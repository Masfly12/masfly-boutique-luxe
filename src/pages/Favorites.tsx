import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart, Package } from "lucide-react";

const Favorites = () => {
  const { user, loading } = useAuth();
  const { data: favorites, isLoading } = useFavorites(user?.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Mes favoris</h1>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : !user ? (
          <p className="text-sm text-muted-foreground">
            Connectez-vous via l'onglet <span className="font-semibold">Mon compte</span> pour voir vos favoris.
          </p>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg h-72 animate-pulse border border-border" />
            ))}
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map((fav) => {
              const product = (fav as any).products;
              if (!product) return null;

              const images = ((product.product_images as any[]) || [])
                .sort((a, b) => a.display_order - b.display_order)
                .map((img) => img.image_url);

              return (
                <ProductCard
                  key={fav.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  imageUrl={product.image_url}
                  imageUrls={images}
                  categoryName={(product.categories as any)?.name}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-body mb-1">Vous n'avez encore aucun favori.</p>
            <p className="text-xs text-muted-foreground">
              Ajoutez des produits à vos favoris depuis le catalogue ou la page d'accueil.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Favorites;


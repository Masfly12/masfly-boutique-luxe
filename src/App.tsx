import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import Index from "@/pages/Index";
import Catalogue from "@/pages/Catalogue";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Connexion from "@/pages/Connexion";
import Compte from "@/pages/Compte";
import Favorites from "@/pages/Favorites";
import Contact from "@/pages/Contact";
import APropos from "@/pages/APropos";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
// ... autres pages

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/produit/:id" element={<ProductDetail />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/compte" element={<Compte />} />
          <Route path="/favoris" element={<Favorites />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

---

**Erreur 3 — corriger `.env`**

La clé `VITE_SUPABASE_ANON_KEY` est absente. Ajoute-la :
```
VITE_SUPABASE_URL="https://nnhvlrnvjqfncxoakqje.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uaHZscm52anFmbmN4b2FrcWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTY5MjIsImV4cCI6MjA4OTU3MjkyMn0.-PXJNla3MWKVdgyY7qW6WRt9ri3KA4TViVLmZC2aw9U"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uaHZscm52anFmbmN4b2FrcWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTY5MjIsImV4cCI6MjA4OTU3MjkyMn0.-PXJNla3MWKVdgyY7qW6WRt9ri3KA4TViVLmZC2aw9U" ← même valeur que PUBLISHABLE_KEY
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BottomNav } from "@/components/BottomNav";
import Index from "./pages/Index";
import Catalogue from "./pages/Catalogue";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import LivraisonPaiements from "./pages/LivraisonPaiements";
import ConditionsUtilisation from "./pages/ConditionsUtilisation";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Favorites from "./pages/Favorites";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Connexion from "./pages/Connexion";
import Compte from "./pages/Compte";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/favoris" element={<Favorites />} />
            <Route path="/produit/:id" element={<ProductDetail />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/livraison-paiements" element={<LivraisonPaiements />} />
            <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
            <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/compte" element={<Compte />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
        </ErrorBoundary>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
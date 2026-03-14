import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
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
import Product from "./pages/Product";
import Cart from "./pages/Cart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/favoris" element={<Favorites />} />
            <Route path="/produit/:id" element={<Product />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/livraison-paiements" element={<LivraisonPaiements />} />
            <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
            <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

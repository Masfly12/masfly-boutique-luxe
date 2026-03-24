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
import LivraisonPaiements from "@/pages/LivraisonPaiements";
import PolitiqueConfidentialite from "@/pages/PolitiqueConfidentialite";
import ConditionsUtilisation from "@/pages/ConditionsUtilisation";
import NotFound from "@/pages/NotFound";

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
          <Route path="/livraison-paiements" element={<LivraisonPaiements />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
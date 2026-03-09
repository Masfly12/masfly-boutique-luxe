import { Link } from "react-router-dom";
import { Search, Menu, X, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/useProducts";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const { data: categories } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogue?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-sm">
      {/* Top bar */}
      <div className="bg-foreground text-card text-xs">
        <div className="container mx-auto px-4 flex items-center justify-between h-8">
          <span className="font-body">Bienvenue chez MASFLY — Livraison dans tout le Bénin 🇧🇯</span>
          <Link to="/contact" className="hover:underline font-body hidden sm:block">Aide & Contact</Link>
        </div>
      </div>

      {/* Main bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-bold text-primary tracking-tight shrink-0">
            MASFLY
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="flex w-full border border-primary rounded-md overflow-hidden">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des produits..."
                className="flex-1 border-0 rounded-none h-10 bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
              <button type="submit" className="bg-primary text-primary-foreground px-5 hover:opacity-90 transition-opacity">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-4 ml-auto">
            <Link to="/admin" className="hidden md:flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-primary transition-colors">
              <User className="h-4 w-4" />
              Mon compte
            </Link>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
            </button>
          </div>
        </div>
      </div>

      {/* Categories bar */}
      <div className="hidden md:block border-t border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 h-10">
            {/* All categories dropdown */}
            <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className="flex items-center gap-1.5 px-4 h-10 text-sm font-body font-medium text-foreground hover:text-primary transition-colors">
                <Menu className="h-4 w-4" />
                Catégories
                <ChevronDown className="h-3 w-3" />
              </button>
              {catOpen && categories && categories.length > 0 && (
                <div className="absolute top-full left-0 bg-card border border-border rounded-md shadow-lg min-w-[200px] py-1 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/catalogue?cat=${cat.slug}`}
                      className="block px-4 py-2 text-sm font-body text-foreground hover:bg-secondary hover:text-primary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/" className="px-4 h-10 flex items-center text-sm font-body text-foreground hover:text-primary transition-colors">Accueil</Link>
            <Link to="/catalogue" className="px-4 h-10 flex items-center text-sm font-body text-foreground hover:text-primary transition-colors">Tous les produits</Link>
            <Link to="/a-propos" className="px-4 h-10 flex items-center text-sm font-body text-foreground hover:text-primary transition-colors">À Propos</Link>
            <Link to="/contact" className="px-4 h-10 flex items-center text-sm font-body text-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-1">
            <form onSubmit={handleSearch} className="flex mb-3">
              <div className="flex w-full border border-primary rounded-md overflow-hidden">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="flex-1 border-0 rounded-none h-10 bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                />
                <button type="submit" className="bg-primary text-primary-foreground px-4">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-foreground hover:text-primary transition-colors font-body">Accueil</Link>
            <Link to="/catalogue" onClick={() => setMenuOpen(false)} className="block py-2 text-foreground hover:text-primary transition-colors font-body">Tous les produits</Link>
            {categories?.map((cat) => (
              <Link key={cat.id} to={`/catalogue?cat=${cat.slug}`} onClick={() => setMenuOpen(false)} className="block py-2 pl-4 text-muted-foreground hover:text-primary transition-colors font-body text-sm">
                {cat.name}
              </Link>
            ))}
            <Link to="/a-propos" onClick={() => setMenuOpen(false)} className="block py-2 text-foreground hover:text-primary transition-colors font-body">À Propos</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="block py-2 text-foreground hover:text-primary transition-colors font-body">Contact</Link>
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-foreground hover:text-primary transition-colors font-body">Mon compte</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

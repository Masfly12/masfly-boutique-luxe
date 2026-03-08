import { Link } from "react-router-dom";
import { Search, Menu, X, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogue?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark border-b border-gold/20 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-bold text-gold tracking-wider">
            MASFLY
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-body text-foreground/80 hover:text-gold transition-colors">
              Accueil
            </Link>
            <Link to="/catalogue" className="text-sm font-body text-foreground/80 hover:text-gold transition-colors">
              Catalogue
            </Link>
            <Link to="/a-propos" className="text-sm font-body text-foreground/80 hover:text-gold transition-colors">
              À Propos
            </Link>
            <Link to="/contact" className="text-sm font-body text-foreground/80 hover:text-gold transition-colors">
              Contact
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-40 md:w-60 h-9 bg-dark-card border-gold/30 text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X className="h-5 w-5 text-foreground/60" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5 text-foreground/60 hover:text-gold transition-colors" />
              </button>
            )}
            <Link to="/admin">
              <User className="h-5 w-5 text-foreground/60 hover:text-gold transition-colors" />
            </Link>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-gold/10 pt-4">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block text-foreground/80 hover:text-gold transition-colors">Accueil</Link>
            <Link to="/catalogue" onClick={() => setMenuOpen(false)} className="block text-foreground/80 hover:text-gold transition-colors">Catalogue</Link>
            <Link to="/a-propos" onClick={() => setMenuOpen(false)} className="block text-foreground/80 hover:text-gold transition-colors">À Propos</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="block text-foreground/80 hover:text-gold transition-colors">Contact</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

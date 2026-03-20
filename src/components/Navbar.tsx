import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, ChevronDown, Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useProducts";

export function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catOpen, setCatOpen]       = useState(false);
  const { data: categories } = useCategories();
  const { user } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const prevCountRef = useRef(cartCount);
  const [cartBounce, setCartBounce] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cart bounce animation
  useEffect(() => {
    if (cartCount > prevCountRef.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(t);
    }
    prevCountRef.current = cartCount;
  }, [cartCount]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [navigate]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card shadow-sm">
        {/* Top bar — desktop only */}
        <div className="hidden sm:block bg-foreground text-card text-xs">
          <div className="container mx-auto px-4 flex items-center justify-between h-8">
            <span className="font-body">Bienvenue chez MASFLY — Livraison dans tout le Bénin 🇧🇯</span>
            <Link to="/contact" className="hover:underline font-body">Aide & Contact</Link>
          </div>
        </div>

        {/* Main bar */}
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="font-display text-xl md:text-2xl font-bold text-primary tracking-tight shrink-0">
              MASFLY
            </Link>

            {/* Search bar — desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="flex w-full border border-primary rounded-xl overflow-hidden">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des produits..."
                  className="flex-1 border-0 rounded-none h-10 bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                />
                <button type="submit" className="bg-primary text-white px-5 hover:opacity-90 transition-opacity shrink-0">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Search — mobile */}
              <button
                className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart — always visible */}
              <Link
                to="/panier"
                className="relative p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                aria-label="Panier"
              >
                <ShoppingCart className={`h-5 w-5 ${cartBounce ? "cart-bounce" : ""}`} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold leading-none">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Favorites — desktop */}
              <Link to="/favoris" className="hidden md:flex p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary transition-colors" aria-label="Favoris">
                <Heart className="h-5 w-5" />
              </Link>

              {/* Account — desktop */}
              <Link to="/admin" className="hidden md:flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-primary px-3 py-2 rounded-xl hover:bg-secondary transition-colors">
                <User className="h-4 w-4" />
                Compte
              </Link>

              {/* Hamburger — mobile */}
              <button
                className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar — mobile (dropdown) */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${searchOpen ? "max-h-20 border-t border-border" : "max-h-0"}`}>
          <form onSubmit={handleSearch} className="px-4 py-3">
            <div className="flex w-full border border-primary rounded-xl overflow-hidden">
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="flex-1 border-0 rounded-none h-10 bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-0 text-base"
              />
              <button type="submit" className="bg-primary text-white px-4 shrink-0">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Categories bar — desktop */}
        <div className="hidden md:block border-t border-border bg-card">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 h-10">
              <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
                <button className="flex items-center gap-1.5 px-4 h-10 text-sm font-body font-medium text-foreground hover:text-primary transition-colors">
                  <Menu className="h-4 w-4" />
                  Catégories
                  <ChevronDown className="h-3 w-3" />
                </button>
                {catOpen && categories && categories.length > 0 && (
                  <div className="absolute top-full left-0 bg-card border border-border rounded-xl shadow-lg min-w-[200px] py-1.5 z-50">
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
              <Link to="/" className="px-4 h-10 flex items-center text-sm font-body text-foreground hover:text-primary transition-colors nav-link-animated">Accueil</Link>
              <Link to="/catalogue" className="px-4 h-10 flex items-center text-sm font-body text-foreground hover:text-primary transition-colors nav-link-animated">Tous les produits</Link>
              <Link to="/a-propos" className="px-4 h-10 flex items-center text-sm font-body text-foreground hover:text-primary transition-colors nav-link-animated">À Propos</Link>
              <Link to="/contact" className="px-4 h-10 flex items-center text-sm font-body text-foreground hover:text-primary transition-colors nav-link-animated">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile menu slide panel */}
      <div className={`md:hidden fixed top-0 right-0 bottom-0 z-50 w-72 bg-card shadow-2xl transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <span className="font-display text-lg font-bold text-primary">MASFLY</span>
          <button onClick={() => setMenuOpen(false)} className="p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-32">
          <div className="px-4 py-4 space-y-1">
            {[
              { to: "/",           label: "🏠 Accueil" },
              { to: "/catalogue",  label: "🛍️ Tous les produits" },
              { to: "/favoris",    label: "❤️ Mes favoris" },
              { to: "/panier",     label: "🛒 Mon panier" },
              { to: "/a-propos",   label: "ℹ️ À propos" },
              { to: "/contact",    label: "📞 Contact" },
              { to: user ? "/compte" : "/connexion", label: user ? "👤 Mon compte" : "👤 Se connecter" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary hover:text-primary transition-colors font-body text-sm font-medium"
              >
                {label}
              </Link>
            ))}
          </div>

          {categories && categories.length > 0 && (
            <div className="px-4 pt-2">
              <p className="text-xs font-body font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2">Catégories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalogue?cat=${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-primary transition-colors font-body text-sm"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
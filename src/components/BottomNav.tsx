import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, ShoppingCart, Heart, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const NAV_ITEMS = [
  { to: "/",          icon: Home,        label: "Accueil"   },
  { to: "/catalogue", icon: LayoutGrid,  label: "Catalogue" },
  { to: "/panier",    icon: ShoppingCart,label: "Panier"    },
  { to: "/favoris",   icon: Heart,       label: "Favoris"   },
  { to: "/compte",    icon: User,        label: "Compte"    },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb">
      <div className="grid grid-cols-5 h-16">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
          const isCart = to === "/panier";
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-body font-medium transition-colors relative ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`} />
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold leading-none">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span>{label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
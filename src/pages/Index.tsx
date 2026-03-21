import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useFeaturedProducts, useCategories } from "@/hooks/useProducts";
import { useSiteStats } from "@/hooks/useStats";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, Truck, Shield, Headphones, Package, Star, Gem, Clock, ShoppingBag, Users } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { usePageTransition } from "@/hooks/usePageTransition";
import heroBanner from "@/assets/hero-banner.jpg";

const GOLD = "#C9A84C";

const CATEGORY_ICONS: Record<string, string> = {
  "mode-beaute": "👗",
  "produits-electroniques": "📱",
  "produits-importes": "📦",
};

/* ─── Compteur animé ─────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current || started.current || target === 0) return;
    started.current = true;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (ref.current) {
        ref.current.textContent = Math.floor(eased * target).toLocaleString("fr-FR");
      }
      if (progress < 1) requestAnimationFrame(step);
      else if (ref.current) ref.current.textContent = target.toLocaleString("fr-FR");
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return ref;
}

/* ─── Stat box ───────────────────────────────────────────────────────────── */
function StatBox({
  icon: Icon,
  value,
  suffix = "",
  label,
  delay = 0,
}: {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const ref = useCountUp(value);
  return (
    <div
      className="flex items-center gap-4 px-6 py-5 transition-colors duration-300"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "none",
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.06)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
    >
      <div
        className="w-9 h-9 flex items-center justify-center shrink-0"
        style={{ border: `1px solid rgba(201,168,76,0.25)` }}
      >
        <Icon className="h-[14px] w-[14px]" style={{ color: GOLD }} />
      </div>
      <div>
        <div
          className="font-display text-[22px] font-semibold leading-none"
          style={{ color: "rgba(255,255,255,0.78)" }}
        >
          <span ref={ref}>{value > 0 ? value.toLocaleString("fr-FR") : "—"}</span>
          <span style={{ color: GOLD }}>{suffix}</span>
        </div>
        <div
          className="text-[9px] tracking-[0.28em] uppercase font-body mt-1"
          style={{ color: "rgba(201,168,76,0.6)" }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/* ─── GoldDivider ────────────────────────────────────────────────────────── */
const GoldDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="h-px w-7" style={{ background: GOLD, opacity: 0.5 }} />
    <div className="w-1 h-1 rotate-45" style={{ background: GOLD, opacity: 0.7 }} />
    <div className="h-px flex-1" style={{ background: GOLD, opacity: 0.12 }} />
  </div>
);

/* ─── SectionTitle ───────────────────────────────────────────────────────── */
const SectionTitle = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div>
    <div className="flex items-center gap-3 mb-2">
      <div className="h-px w-5" style={{ background: GOLD }} />
      <p className="text-[9px] font-body tracking-[0.32em] uppercase" style={{ color: GOLD }}>
        {eyebrow}
      </p>
    </div>
    <h2 className="font-display text-xl md:text-[26px] font-light tracking-wide text-foreground">
      {title}
    </h2>
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────────── */
const Index = () => {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: categories } = useCategories();
  const { data: stats } = useSiteStats();
  usePageTitle();
  useScrollReveal();
  const { transitionKey } = usePageTransition();

  return (
    <div key={transitionKey} className="min-h-screen bg-background text-foreground page-transition">
      <Navbar />

      {/* ════════════════════════════════════════════════════════
          HERO — layout 2 colonnes, compact
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[480px] md:min-h-[520px] flex items-center">
        {/* Fond */}
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="MASFLY"
            className="w-full h-full object-cover scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-black/78" />
          {/* Liseré or gauche */}
          <div
            className="absolute left-0 top-[8%] bottom-[8%] w-[2px]"
            style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`, opacity: 0.55 }}
          />
          {/* Lueur radiale bas-gauche */}
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[220px] pointer-events-none"
            style={{ background: `radial-gradient(ellipse at bottom left, rgba(201,168,76,0.12) 0%, transparent 70%)` }}
          />
        </div>

        {/* Contenu 2 colonnes */}
        <div className="relative w-full container mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center animate-fade-up">

          {/* ── Colonne gauche : titre + CTA ── */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 text-[9px] tracking-[0.35em] uppercase font-body"
              style={{ border: `1px solid rgba(201,168,76,0.3)`, color: `rgba(201,168,76,0.8)` }}
            >
              <span className="w-3 h-px" style={{ background: GOLD }} />
              Bénin · Afrique de l'Ouest
              <span className="w-3 h-px" style={{ background: GOLD }} />
            </div>

            {/* Titre */}
            <h1 className="mb-5 leading-[1.02]">
              <span
                className="block font-display text-[10px] tracking-[0.5em] uppercase mb-3 font-light"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                Sélection exclusive
              </span>
              <span
                className="block font-display font-extralight text-white leading-none"
                style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
              >
                L'élégance
              </span>
              <span
                className="block font-display font-bold leading-none tracking-[0.05em]"
                style={{ fontSize: "clamp(38px, 5vw, 64px)", color: GOLD }}
              >
                ACCESSIBLE
              </span>
              <span
                className="block font-display font-light tracking-[0.35em] uppercase mt-2"
                style={{ fontSize: "clamp(14px, 1.8vw, 20px)", color: "rgba(255,255,255,0.4)" }}
              >
                au Bénin
              </span>
            </h1>

            {/* Séparateur */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10" style={{ background: `rgba(201,168,76,0.55)` }} />
              <span className="text-[9px] tracking-[0.3em] uppercase font-body" style={{ color: "rgba(255,255,255,0.28)" }}>
                Qualité supérieure
              </span>
            </div>

            <p
              className="font-body text-[13px] mb-8 max-w-[360px] leading-[1.85]"
              style={{ color: "rgba(255,255,255,0.44)" }}
            >
              Mode, électronique & produits importés —{" "}
              <span style={{ color: "rgba(255,255,255,0.68)" }}>
                une expérience d'achat raffinée
              </span>
              , livrée chez vous.
            </p>

            {/* Boutons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalogue"
                className="btn-press inline-flex items-center gap-2 font-body font-medium text-[10px] tracking-[0.2em] uppercase px-7 py-3 transition-all duration-200 hover:opacity-90"
                style={{ background: GOLD, color: "#0a0a0a" }}
              >
                Voir les produits <ArrowRight className="h-3 w-3" />
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-2 font-body font-light text-[10px] tracking-[0.2em] uppercase px-7 py-3 transition-all duration-200"
                style={{ border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.55)" }}
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* ── Colonne droite : stats réelles ── */}
          <div
            className="flex flex-col"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <StatBox
              icon={ShoppingBag}
              value={stats?.totalProducts ?? 0}
              suffix="+"
              label="Produits disponibles"
              delay={200}
            />
            <StatBox
              icon={Users}
              value={stats?.totalOrders ?? 0}
              suffix="+"
              label="Commandes passées"
              delay={350}
            />
            <div
              className="flex items-center gap-4 px-6 py-5 transition-colors duration-300"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
            >
              <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ border: `1px solid rgba(201,168,76,0.25)` }}>
                <Truck className="h-[14px] w-[14px]" style={{ color: GOLD }} />
              </div>
              <div>
                <div className="font-display text-[22px] font-semibold leading-none" style={{ color: "rgba(255,255,255,0.78)" }}>
                  48<span style={{ color: GOLD }}>h</span>
                </div>
                <div className="text-[9px] tracking-[0.28em] uppercase font-body mt-1" style={{ color: "rgba(201,168,76,0.6)" }}>
                  Délai de livraison
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TRUST BAR
      ════════════════════════════════════════════════════════ */}
      <section className="bg-card border-y border-border reveal">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { icon: Truck,      text: "Livraison rapide",  sub: "Partout au Bénin" },
              { icon: Shield,     text: "Paiement sécurisé", sub: "100% fiable" },
              { icon: Gem,        text: "Qualité garantie",  sub: "Sélection premium" },
              { icon: Headphones, text: "Support 7j/7",      sub: "Via WhatsApp" },
            ].map(({ icon: Icon, text, sub }, i) => (
              <div
                key={text}
                className={`flex items-center gap-3 py-5 px-4 transition-colors duration-200 hover:bg-primary/5 ${i < 3 ? "border-r border-border" : ""}`}
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0" style={{ border: `1px solid rgba(201,168,76,0.22)` }}>
                  <Icon className="h-3 w-3" style={{ color: GOLD }} />
                </div>
                <div>
                  <p className="text-[11px] font-body font-semibold text-foreground tracking-wide">{text}</p>
                  <p className="text-[10px] text-muted-foreground font-body mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CATÉGORIES
      ════════════════════════════════════════════════════════ */}
      {categories && categories.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-6 reveal">
              <SectionTitle eyebrow="Collections" title="Parcourir par catégorie" />
              <Link
                to="/catalogue"
                className="hidden sm:flex items-center gap-2 text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Voir tout <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <GoldDivider className="mb-6 reveal" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/catalogue?cat=${cat.slug}`}
                  className={`reveal reveal-delay-${Math.min(i + 1, 6)} group relative bg-card border border-border p-4 text-center transition-all duration-300 overflow-hidden hover:border-[#C9A84C]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5`}
                >
                  <div className="text-2xl mb-2 transition-transform duration-300 group-hover:scale-115">
                    {CATEGORY_ICONS[cat.slug] || "🛍️"}
                  </div>
                  <h3 className="font-body text-[10px] font-medium text-foreground tracking-wide leading-tight group-hover:opacity-70 transition-opacity">
                    {cat.name}
                  </h3>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ background: GOLD }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          PRODUITS POPULAIRES
      ════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6 reveal">
            <SectionTitle eyebrow="Tendances" title="Produits populaires" />
            <Link
              to="/catalogue"
              className="hidden sm:flex items-center gap-2 text-[10px] font-body tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <GoldDivider className="mb-6 reveal" />

          {loadingFeatured ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-card h-64 skeleton-shimmer border border-border" />
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {featured.map((p, i) => {
                const images = ((p as any).product_images || [])
                  .sort((a: any, b: any) => a.display_order - b.display_order)
                  .map((img: any) => img.image_url);
                return (
                  <div key={p.id} className={`reveal reveal-delay-${Math.min(i + 1, 6)}`}>
                    <ProductCard
                      id={p.id}
                      name={p.name}
                      price={p.price}
                      description={p.description}
                      imageUrl={p.image_url}
                      imageUrls={images}
                      categoryName={(p.categories as any)?.name}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border">
              <Package className="h-9 w-9 mx-auto mb-3" style={{ color: `rgba(201,168,76,0.3)` }} />
              <p className="text-muted-foreground font-body text-xs tracking-wide">
                Aucun produit populaire pour le moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA FINAL
      ════════════════════════════════════════════════════════ */}
      <section className="py-12 reveal">
        <div className="container mx-auto px-4">
          <div
            className="relative overflow-hidden px-8 md:px-16 py-12 md:py-16 text-center"
            style={{ background: "#0a0a0a" }}
          >
            {/* Coins dorés */}
            <div className="absolute top-0 left-0 w-14 h-14" style={{ borderTop: `2px solid rgba(201,168,76,0.5)`, borderLeft: `2px solid rgba(201,168,76,0.5)` }} />
            <div className="absolute bottom-0 right-0 w-14 h-14" style={{ borderBottom: `2px solid rgba(201,168,76,0.5)`, borderRight: `2px solid rgba(201,168,76,0.5)` }} />
            {/* Lueur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[150px] pointer-events-none" style={{ background: `radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)` }} />

            <div className="relative max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: `rgba(201,168,76,0.45)` }} />
                <Star className="h-3 w-3" style={{ color: GOLD }} />
                <div className="h-px w-8" style={{ background: `rgba(201,168,76,0.45)` }} />
              </div>

              <h2 className="font-display font-light text-white leading-tight mb-1" style={{ fontSize: "clamp(24px,3.5vw,40px)" }}>
                Prêt à commander ?
              </h2>
              <p className="font-display font-bold leading-tight mb-6" style={{ fontSize: "clamp(24px,3.5vw,40px)", color: GOLD }}>
                On s'en occupe.
              </p>
              <p className="font-body text-[12px] leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.32)" }}>
                Réponse en moins de 5 minutes — 7j/7
              </p>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-2 font-body font-medium text-[10px] tracking-[0.25em] uppercase px-9 py-[13px] transition-all duration-200 hover:opacity-90"
                style={{ background: GOLD, color: "#0a0a0a" }}
              >
                Commander sur WhatsApp
                <ArrowRight className="h-3 w-3" />
              </a>

              <div
                className="flex flex-wrap items-center justify-center gap-5 mt-8 pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                {[
                  { icon: Clock, text: "Réponse rapide" },
                  { icon: Truck, text: "Livraison Bénin" },
                  { icon: Shield, text: "Paiement sécurisé" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className="h-3 w-3" style={{ color: `rgba(201,168,76,0.5)` }} />
                    <span className="text-[9px] tracking-[0.15em] uppercase font-body" style={{ color: "rgba(255,255,255,0.26)" }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
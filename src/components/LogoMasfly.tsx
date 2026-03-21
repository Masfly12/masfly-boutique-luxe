import { useEffect, useState } from "react";

interface LogoMasflyProps {
  size?: "sm" | "md" | "lg";
  /** force un thème (sinon détecté automatiquement) */
  theme?: "dark" | "light";
}

export function LogoMasfly({ size = "md", theme }: LogoMasflyProps) {
  const [isDark, setIsDark] = useState(false);

  // Détection automatique du mode jour/nuit
  useEffect(() => {
    if (theme) {
      setIsDark(theme === "dark");
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);

    // Observer les changements en temps réel
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // Dimensions selon la taille
  const dims = { sm: 32, md: 40, lg: 52 };
  const iconSize = dims[size];
  const wordSize = { sm: 18, md: 22, lg: 28 };
  const tagSize  = { sm: 7,  md: 8,  lg: 9  };
  const gap      = { sm: 10, md: 14, lg: 18 };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${gap[size]}px`,
        userSelect: "none",
      }}
    >
      {/* ── Icône monogramme ── */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          {/* Or brillant — version sombre */}
          <linearGradient id="mf-gold-dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFF8C0" />
            <stop offset="18%"  stopColor="#D4A020" />
            <stop offset="40%"  stopColor="#F8E060" />
            <stop offset="58%"  stopColor="#A87000" />
            <stop offset="78%"  stopColor="#E8C040" />
            <stop offset="100%" stopColor="#886000" />
          </linearGradient>
          {/* Or foncé — version claire */}
          <linearGradient id="mf-gold-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#B07800" />
            <stop offset="30%"  stopColor="#D4A020" />
            <stop offset="55%"  stopColor="#986000" />
            <stop offset="80%"  stopColor="#C09010" />
            <stop offset="100%" stopColor="#7A5000" />
          </linearGradient>
        </defs>

        {/* Cercle externe */}
        <circle
          cx="32" cy="32" r="28"
          fill="none"
          stroke={`url(#mf-gold-${isDark ? "dark" : "light"})`}
          strokeWidth="0.9"
        />
        {/* Arc intérieur en tirets */}
        <circle
          cx="32" cy="32" r="23"
          fill="none"
          stroke={`url(#mf-gold-${isDark ? "dark" : "light"})`}
          strokeWidth="0.35"
          strokeDasharray="2.5 3.5"
          opacity="0.45"
        />
        {/* M avec empattements */}
        <path
          d="M13 45 L13 19 L32 37 L51 19 L51 45"
          fill="none"
          stroke={`url(#mf-gold-${isDark ? "dark" : "light"})`}
          strokeWidth="2.8"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* Empattements */}
        <line x1="9.5"  y1="19" x2="16.5" y2="19" stroke={`url(#mf-gold-${isDark ? "dark" : "light"})`} strokeWidth="1.8" />
        <line x1="47.5" y1="19" x2="54.5" y2="19" stroke={`url(#mf-gold-${isDark ? "dark" : "light"})`} strokeWidth="1.8" />
        <line x1="9.5"  y1="45" x2="16.5" y2="45" stroke={`url(#mf-gold-${isDark ? "dark" : "light"})`} strokeWidth="1.8" />
        <line x1="47.5" y1="45" x2="54.5" y2="45" stroke={`url(#mf-gold-${isDark ? "dark" : "light"})`} strokeWidth="1.8" />
        {/* Point central brillant */}
        <circle cx="32" cy="32" r="2.2" fill={isDark ? "#FFF8C0" : "#C09010"} opacity="0.9" />
        <circle cx="32" cy="32" r="1"   fill={isDark ? "#ffffff" : "#E8C040"} opacity="0.8" />
      </svg>

      {/* ── Séparateur vertical ── */}
      <div
        style={{
          width: "1px",
          height: `${iconSize * 0.75}px`,
          background: isDark
            ? "linear-gradient(to bottom, transparent, rgba(201,160,48,0.55), transparent)"
            : "linear-gradient(to bottom, transparent, rgba(140,95,0,0.35), transparent)",
          flexShrink: 0,
        }}
      />

      {/* ── Texte : wordmark + tagline ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        {/* MASFLY */}
        <span
          style={{
            fontFamily: "'Montserrat', 'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: `${wordSize[size]}px`,
            letterSpacing: "0.32em",
            lineHeight: 1,
            paddingRight: "0.32em",
            background: isDark
              ? "linear-gradient(105deg, #7d5a00 0%, #d4a020 18%, #f8e060 32%, #fdf5c0 40%, #f5d060 48%, #b07800 60%, #e8c040 72%, #fdf5c0 80%, #c09010 88%, #7d5a00 100%)"
              : "linear-gradient(105deg, #6a4800 0%, #c09010 22%, #e8b820 36%, #8a6200 52%, #d0a020 68%, #6a4800 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            backgroundSize: "200% 100%",
            animation: "masfly-sheen 4s ease-in-out infinite",
          }}
        >
          MASFLY
        </span>
        {/* Tagline */}
        <span
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontWeight: 300,
            fontSize: `${tagSize[size]}px`,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            paddingRight: "0.4em",
            color: isDark
              ? "rgba(201,160,48,0.58)"
              : "rgba(138,98,0,0.55)",
          }}
        >
          Boutique Luxe · Bénin
        </span>
      </div>

      {/* Animation sheen injectée une seule fois */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=Montserrat:wght@800&display=swap');
        @keyframes masfly-sheen {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}
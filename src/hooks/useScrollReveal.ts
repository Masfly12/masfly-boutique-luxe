import { useEffect, useRef } from "react";

/**
 * Ajoute la classe `reveal--visible` aux éléments `.reveal`
 * dès qu'ils entrent dans le viewport.
 * 
 * Usage : appelle useScrollReveal() dans n'importe quelle page,
 * puis ajoute className="reveal" sur les éléments à animer.
 * Pour des délais en cascade : ajoute aussi "reveal-delay-1", "reveal-delay-2"...
 */
export function useScrollReveal(rootMargin = "0px 0px -60px 0px") {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            // On unobserve après la première apparition
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [rootMargin]);
}
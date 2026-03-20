import { useEffect } from "react";

const BASE_TITLE = "MASFLY – Boutique au Bénin";

/**
 * Définit le <title> de la page de façon réactive.
 * Restaure le titre de base au démontage du composant.
 *
 * Usage :  usePageTitle("Mon panier");
 *          usePageTitle(); // → titre de base
 */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    return () => { document.title = BASE_TITLE; };
  }, [title]);
}
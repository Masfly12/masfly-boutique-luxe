import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Retourne une clé qui change à chaque navigation,
 * déclenchant la classe `page-transition` sur la page.
 * 
 * Usage :
 *   const { transitionKey } = usePageTransition();
 *   <div key={transitionKey} className="page-transition"> ... </div>
 */
export function usePageTransition() {
  const location = useLocation();
  const [transitionKey, setTransitionKey] = useState(location.key);

  useEffect(() => {
    // Scroll vers le haut à chaque changement de page
    window.scrollTo({ top: 0, behavior: "instant" });
    setTransitionKey(location.key);
  }, [location.key]);

  return { transitionKey };
}
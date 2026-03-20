import { useEffect, useState } from "react";

/**
 * Retarde la mise à jour d'une valeur pour éviter trop de requêtes
 * pendant la frappe (ex: champ de recherche).
 */
export function useDebounce<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
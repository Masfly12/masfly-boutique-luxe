import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductFilters {
  categorySlug?: string;
  search?: string;        // recherche côté serveur via ilike
}

export function useProducts({ categorySlug, search }: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", categorySlug, search],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, categories(*), product_images(*)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      // Filtrer par catégorie côté serveur
      if (categorySlug) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categorySlug)
          .single();
        if (cat) query = query.eq("category_id", cat.id);
      }

      // Recherche plein-texte côté serveur — plus de filter() côté client
      if (search && search.trim().length > 0) {
        const term = `%${search.trim()}%`;
        query = query.or(`name.ilike.${term},description.ilike.${term}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*), product_images(*)")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*), product_images(*), vendors(*)")
        .eq("id", id!)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
}
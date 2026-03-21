import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteStats {
  totalProducts: number;
  totalOrders: number;
  totalVendors: number;
}

export function useSiteStats() {
  return useQuery({
    queryKey: ["site-stats"],
    staleTime: 1000 * 60 * 5, // cache 5 minutes
    queryFn: async (): Promise<SiteStats> => {
      const [products, orders, vendors] = await Promise.all([
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("vendors")
          .select("id", { count: "exact", head: true })
          .eq("is_approved", true),
      ]);

      return {
        totalProducts: products.count ?? 0,
        totalOrders:   orders.count   ?? 0,
        totalVendors:  vendors.count  ?? 0,
      };
    },
  });
}
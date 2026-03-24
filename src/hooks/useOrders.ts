import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, supabaseAuth } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

// ─── Créer une commande ───────────────────────────────────────────────────────

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      items,
      customerName,
      customerPhone,
      notes,
    }: CreateOrderInput) => {
      if (items.length === 0) throw new Error("Le panier est vide");

      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      // Récupère l'utilisateur connecté (peut être null → commande guest)
      const {
        data: { user },
      } = await supabaseAuth.auth.getUser();

      // 1. Créer la commande
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
          total_fcfa: total,
          customer_name: customerName ?? null,
          customer_phone: customerPhone ?? null,
          notes: notes ?? null,
          status: "pending",
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      // 2. Insérer les lignes de commande
      const { error: itemsError } = await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          unit_price: item.price,
          quantity: item.quantity,
        }))
      );

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Impossible d'enregistrer la commande");
    },
  });
}

// ─── Mes commandes (utilisateur connecté) ────────────────────────────────────

export function useMyOrders() {
  return useQuery({
    queryKey: ["orders", "mine"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
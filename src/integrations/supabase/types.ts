// Types TypeScript générés manuellement depuis le schéma MASFLY
// Basé sur masfly_schema_complet.sql

export type AppRole = 'admin' | 'user';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: AppRole;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: AppRole;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: AppRole;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
        };
      };
      vendors: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          shop_name: string | null;
          shop_description: string | null;
          description: string | null;
          logo_url: string | null;
          whatsapp: string | null;
          phone: string | null;
          address: string | null;
          is_approved: boolean;
          approval_status: ApprovalStatus;
          approval_note: string | null;
          approved_at: string | null;
          approved_by: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          shop_name?: string | null;
          shop_description?: string | null;
          description?: string | null;
          logo_url?: string | null;
          whatsapp?: string | null;
          phone?: string | null;
          address?: string | null;
          is_approved?: boolean;
          approval_status?: ApprovalStatus;
          approval_note?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          shop_name?: string | null;
          shop_description?: string | null;
          description?: string | null;
          logo_url?: string | null;
          whatsapp?: string | null;
          phone?: string | null;
          address?: string | null;
          is_approved?: boolean;
          approval_status?: ApprovalStatus;
          approval_note?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          category_id: string | null;
          vendor_id: string | null;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          category_id?: string | null;
          vendor_id?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          category_id?: string | null;
          vendor_id?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          display_order?: number;
        };
        Update: {
          image_url?: string;
          display_order?: number;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id?: string | null;
          rating: number;
          comment?: string | null;
        };
        Update: {
          rating?: number;
          comment?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          status: OrderStatus;
          total_fcfa: number;
          customer_name: string | null;
          customer_phone: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          status?: OrderStatus;
          total_fcfa: number;
          customer_name?: string | null;
          customer_phone?: string | null;
          notes?: string | null;
        };
        Update: {
          status?: OrderStatus;
          total_fcfa?: number;
          customer_name?: string | null;
          customer_phone?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
        };
        Update: never;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: AppRole };
        Returns: boolean;
      };
      approve_vendor: {
        Args: { _vendor_id: string; _note?: string };
        Returns: void;
      };
      reject_vendor: {
        Args: { _vendor_id: string; _note?: string };
        Returns: void;
      };
    };
    Enums: {
      app_role: AppRole;
    };
  };
}
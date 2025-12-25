export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          brand: string
          category: string
          created_at: string | null
          gst_percent: number
          id: string
          name: string
          opening_stock: number
          product_id: string
          purchase_rate: number
          reorder_level: number
          selling_rate: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          brand: string
          category: string
          created_at?: string | null
          gst_percent: number
          id?: string
          name: string
          opening_stock: number
          product_id: string
          purchase_rate: number
          reorder_level: number
          selling_rate: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          brand?: string
          category?: string
          created_at?: string | null
          gst_percent?: number
          id?: string
          name?: string
          opening_stock?: number
          product_id?: string
          purchase_rate?: number
          reorder_level?: number
          selling_rate?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          created_at: string | null
          date: string
          grand_total: number
          gst_amount: number
          id: string
          invoice_no: string
          product_id: string
          purchase_rate: number
          quantity: number
          supplier: string
          total_value: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          grand_total: number
          gst_amount: number
          id?: string
          invoice_no: string
          product_id: string
          purchase_rate: number
          quantity: number
          supplier: string
          total_value: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          grand_total?: number
          gst_amount?: number
          id?: string
          invoice_no?: string
          product_id?: string
          purchase_rate?: number
          quantity?: number
          supplier?: string
          total_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string | null
          customer: string
          date: string
          grand_total: number
          gst_amount: number
          id: string
          invoice_no: string
          product_id: string
          quantity: number
          selling_rate: number
          total_value: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer: string
          date: string
          grand_total: number
          gst_amount: number
          id?: string
          invoice_no: string
          product_id: string
          quantity: number
          selling_rate: number
          total_value: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer?: string
          date?: string
          grand_total?: number
          gst_amount?: number
          id?: string
          invoice_no?: string
          product_id?: string
          quantity?: number
          selling_rate?: number
          total_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  TableName extends keyof PublicSchema["Tables"] | keyof PublicSchema["Views"],
> = TableName extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][TableName]["Row"]
  : TableName extends keyof PublicSchema["Views"]
    ? PublicSchema["Views"][TableName]["Row"]
    : never

export type TablesInsert<
  TableName extends keyof PublicSchema["Tables"],
> = PublicSchema["Tables"][TableName]["Insert"]

export type TablesUpdate<
  TableName extends keyof PublicSchema["Tables"],
> = PublicSchema["Tables"][TableName]["Update"]

export type Enums<TableName extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][TableName]
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          about_designer: string | null
          about_image: string | null
          about_image_mobile: string | null
          banner_image: string | null
          brand_story: string | null
          craftsmanship: string | null
          craftsmanship_creative: string | null
          created_at: string
          description: string | null
          designer_image: string | null
          designer_name: string | null
          environmental_sustainability: string[] | null
          featured_in: string | null
          handle: string
          hero_image: string | null
          id: string
          instagram_link: string | null
          logo_image: string | null
          name: string
          quotation: string | null
          social_responsibility: string[] | null
          special_badges: string[] | null
          style: string[] | null
          updated_at: string
          usp_tags: string | null
        }
        Insert: {
          about_designer?: string | null
          about_image?: string | null
          about_image_mobile?: string | null
          banner_image?: string | null
          brand_story?: string | null
          craftsmanship?: string | null
          craftsmanship_creative?: string | null
          created_at?: string
          description?: string | null
          designer_image?: string | null
          designer_name?: string | null
          environmental_sustainability?: string[] | null
          featured_in?: string | null
          handle: string
          hero_image?: string | null
          id?: string
          instagram_link?: string | null
          logo_image?: string | null
          name: string
          quotation?: string | null
          social_responsibility?: string[] | null
          special_badges?: string[] | null
          style?: string[] | null
          updated_at?: string
          usp_tags?: string | null
        }
        Update: {
          about_designer?: string | null
          about_image?: string | null
          about_image_mobile?: string | null
          banner_image?: string | null
          brand_story?: string | null
          craftsmanship?: string | null
          craftsmanship_creative?: string | null
          created_at?: string
          description?: string | null
          designer_image?: string | null
          designer_name?: string | null
          environmental_sustainability?: string[] | null
          featured_in?: string | null
          handle?: string
          hero_image?: string | null
          id?: string
          instagram_link?: string | null
          logo_image?: string | null
          name?: string
          quotation?: string | null
          social_responsibility?: string[] | null
          special_badges?: string[] | null
          style?: string[] | null
          updated_at?: string
          usp_tags?: string | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          artisan_cluster: string | null
          banner_image: string | null
          brand_id: string | null
          brand_name: string | null
          category: string | null
          created_at: string
          description: string | null
          environmental_sustainability: string[] | null
          handle: string
          id: string
          is_brand_store: boolean | null
          lookbook_link: string | null
          more_collections: string[] | null
          primary_craft_l1: string | null
          primary_craft_l2: string | null
          products_count: number | null
          published: boolean | null
          seasonality: string | null
          shopify_id: string | null
          tagline: string | null
          thumbnail_image: string | null
          title: string
          updated_at: string
        }
        Insert: {
          artisan_cluster?: string | null
          banner_image?: string | null
          brand_id?: string | null
          brand_name?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          environmental_sustainability?: string[] | null
          handle: string
          id?: string
          is_brand_store?: boolean | null
          lookbook_link?: string | null
          more_collections?: string[] | null
          primary_craft_l1?: string | null
          primary_craft_l2?: string | null
          products_count?: number | null
          published?: boolean | null
          seasonality?: string | null
          shopify_id?: string | null
          tagline?: string | null
          thumbnail_image?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          artisan_cluster?: string | null
          banner_image?: string | null
          brand_id?: string | null
          brand_name?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          environmental_sustainability?: string[] | null
          handle?: string
          id?: string
          is_brand_store?: boolean | null
          lookbook_link?: string | null
          more_collections?: string[] | null
          primary_craft_l1?: string | null
          primary_craft_l2?: string | null
          products_count?: number | null
          published?: boolean | null
          seasonality?: string | null
          shopify_id?: string | null
          tagline?: string | null
          thumbnail_image?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      product_collections: {
        Row: {
          collection_id: string | null
          created_at: string
          id: string
          product_id: string | null
        }
        Insert: {
          collection_id?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
        }
        Update: {
          collection_id?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          position: number | null
          product_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          position?: number | null
          product_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          position?: number | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          price: number | null
          product_id: string | null
          shopify_variant_id: string | null
          size: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          price?: number | null
          product_id?: string | null
          shopify_variant_id?: string | null
          size?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          price?: number | null
          product_id?: string | null
          shopify_variant_id?: string | null
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_name: string | null
          bulk_discount_100_plus: number | null
          bulk_discount_25_49: number | null
          bulk_discount_5_24: number | null
          bulk_discount_50_99: number | null
          bulk_margin: string | null
          care_guide: string | null
          craft: string[] | null
          created_at: string
          delivery_timelines: string | null
          description: string | null
          fabric_type: string | null
          gender: string | null
          gst: number | null
          handle: string
          id: string
          material: string | null
          occasion: string[] | null
          product_story: string | null
          product_type: string | null
          qala_category: string[] | null
          sample_discount: number | null
          shipping: string | null
          shopify_id: string | null
          size_chart_image: string | null
          status: string | null
          tags: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          brand_name?: string | null
          bulk_discount_100_plus?: number | null
          bulk_discount_25_49?: number | null
          bulk_discount_5_24?: number | null
          bulk_discount_50_99?: number | null
          bulk_margin?: string | null
          care_guide?: string | null
          craft?: string[] | null
          created_at?: string
          delivery_timelines?: string | null
          description?: string | null
          fabric_type?: string | null
          gender?: string | null
          gst?: number | null
          handle: string
          id?: string
          material?: string | null
          occasion?: string[] | null
          product_story?: string | null
          product_type?: string | null
          qala_category?: string[] | null
          sample_discount?: number | null
          shipping?: string | null
          shopify_id?: string | null
          size_chart_image?: string | null
          status?: string | null
          tags?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          brand_name?: string | null
          bulk_discount_100_plus?: number | null
          bulk_discount_25_49?: number | null
          bulk_discount_5_24?: number | null
          bulk_discount_50_99?: number | null
          bulk_margin?: string | null
          care_guide?: string | null
          craft?: string[] | null
          created_at?: string
          delivery_timelines?: string | null
          description?: string | null
          fabric_type?: string | null
          gender?: string | null
          gst?: number | null
          handle?: string
          id?: string
          material?: string | null
          occasion?: string[] | null
          product_story?: string | null
          product_type?: string | null
          qala_category?: string[] | null
          sample_discount?: number | null
          shipping?: string | null
          shopify_id?: string | null
          size_chart_image?: string | null
          status?: string | null
          tags?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

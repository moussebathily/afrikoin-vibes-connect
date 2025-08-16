export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      followers: {
        Row: {
          created_at: string;
          follower_id: string;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          follower_id: string;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          follower_id?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      holiday_notifications: {
        Row: {
          created_at: string;
          holiday_id: string | null;
          id: string;
          message: string;
          notification_type: string;
          sent_at: string;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          holiday_id?: string | null;
          id?: string;
          message: string;
          notification_type: string;
          sent_at?: string;
          status?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          holiday_id?: string | null;
          id?: string;
          message?: string;
          notification_type?: string;
          sent_at?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "holiday_notifications_holiday_id_fkey";
            columns: ["holiday_id"];
            isOneToOne: false;
            referencedRelation: "holidays";
            referencedColumns: ["id"];
          },
        ];
      };
      holidays: {
        Row: {
          celebration_duration: number | null;
          countries: string[] | null;
          created_at: string;
          date_formula: string | null;
          description: string | null;
          id: string;
          is_lunar: boolean | null;
          name: string;
          religions: string[] | null;
          type: string;
          updated_at: string;
        };
        Insert: {
          celebration_duration?: number | null;
          countries?: string[] | null;
          created_at?: string;
          date_formula?: string | null;
          description?: string | null;
          id?: string;
          is_lunar?: boolean | null;
          name: string;
          religions?: string[] | null;
          type?: string;
          updated_at?: string;
        };
        Update: {
          celebration_duration?: number | null;
          countries?: string[] | null;
          created_at?: string;
          date_formula?: string | null;
          description?: string | null;
          id?: string;
          is_lunar?: boolean | null;
          name?: string;
          religions?: string[] | null;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      like_credits: {
        Row: {
          balance: number;
          created_at: string;
          id: string;
          total_purchased: number;
          total_used: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          balance?: number;
          created_at?: string;
          id?: string;
          total_purchased?: number;
          total_used?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          balance?: number;
          created_at?: string;
          id?: string;
          total_purchased?: number;
          total_used?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      like_purchases: {
        Row: {
          created_at: string;
          currency: string;
          id: string;
          likes_amount: number;
          pack_name: string;
          price_amount: number;
          product_id: string;
          purchase_token: string;
          status: string;
          store_type: string;
          user_id: string;
          verified_at: string | null;
        };
        Insert: {
          created_at?: string;
          currency?: string;
          id?: string;
          likes_amount: number;
          pack_name: string;
          price_amount: number;
          product_id: string;
          purchase_token: string;
          status?: string;
          store_type?: string;
          user_id: string;
          verified_at?: string | null;
        };
        Update: {
          created_at?: string;
          currency?: string;
          id?: string;
          likes_amount?: number;
          pack_name?: string;
          price_amount?: number;
          product_id?: string;
          purchase_token?: string;
          status?: string;
          store_type?: string;
          user_id?: string;
          verified_at?: string | null;
        };
        Relationships: [];
      };
      like_usage: {
        Row: {
          created_at: string;
          id: string;
          likes_used: number;
          target_post_id: string | null;
          target_user_id: string | null;
          usage_type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          likes_used?: number;
          target_post_id?: string | null;
          target_user_id?: string | null;
          usage_type?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          likes_used?: number;
          target_post_id?: string | null;
          target_user_id?: string | null;
          usage_type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      media_files: {
        Row: {
          created_at: string;
          duration: number | null;
          file_name: string;
          file_path: string;
          file_size: number | null;
          height: number | null;
          id: string;
          mime_type: string;
          post_id: string;
          storage_bucket: string;
          thumbnail_path: string | null;
          width: number | null;
        };
        Insert: {
          created_at?: string;
          duration?: number | null;
          file_name: string;
          file_path: string;
          file_size?: number | null;
          height?: number | null;
          id?: string;
          mime_type: string;
          post_id: string;
          storage_bucket?: string;
          thumbnail_path?: string | null;
          width?: number | null;
        };
        Update: {
          created_at?: string;
          duration?: number | null;
          file_name?: string;
          file_path?: string;
          file_size?: number | null;
          height?: number | null;
          id?: string;
          mime_type?: string;
          post_id?: string;
          storage_bucket?: string;
          thumbnail_path?: string | null;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "media_files_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_methods: {
        Row: {
          account_name: string;
          account_number: string;
          created_at: string;
          id: string;
          is_default: boolean | null;
          is_verified: boolean | null;
          method_type: string;
          provider: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          account_name: string;
          account_number: string;
          created_at?: string;
          id?: string;
          is_default?: boolean | null;
          is_verified?: boolean | null;
          method_type: string;
          provider: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          account_name?: string;
          account_number?: string;
          created_at?: string;
          id?: string;
          is_default?: boolean | null;
          is_verified?: boolean | null;
          method_type?: string;
          provider?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          content_type: string;
          created_at: string;
          description: string | null;
          id: string;
          is_monetized: boolean;
          like_count: number;
          location: string | null;
          price: number | null;
          status: string;
          title: string | null;
          updated_at: string;
          user_id: string;
          view_count: number;
        };
        Insert: {
          content_type?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_monetized?: boolean;
          like_count?: number;
          location?: string | null;
          price?: number | null;
          status?: string;
          title?: string | null;
          updated_at?: string;
          user_id: string;
          view_count?: number;
        };
        Update: {
          content_type?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_monetized?: boolean;
          like_count?: number;
          location?: string | null;
          price?: number | null;
          status?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
          view_count?: number;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          country: string | null;
          created_at: string;
          email: string;
          id: string;
          is_verified: boolean | null;
          name: string | null;
          phone: string | null;
          role: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          country?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          is_verified?: boolean | null;
          name?: string | null;
          phone?: string | null;
          role?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          country?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          is_verified?: boolean | null;
          name?: string | null;
          phone?: string | null;
          role?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      security_logs: {
        Row: {
          created_at: string;
          event_type: string;
          id: string;
          ip_address: unknown | null;
          metadata: Json | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          event_type: string;
          id?: string;
          ip_address?: unknown | null;
          metadata?: Json | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          event_type?: string;
          id?: string;
          ip_address?: unknown | null;
          metadata?: Json | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          metadata: Json | null;
          reference_id: string | null;
          status: string;
          transaction_type: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          reference_id?: string | null;
          status: string;
          transaction_type: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          reference_id?: string | null;
          status?: string;
          transaction_type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_balances: {
        Row: {
          available_balance: number | null;
          id: string;
          last_updated: string;
          pending_balance: number | null;
          total_balance: number | null;
          user_id: string;
        };
        Insert: {
          available_balance?: number | null;
          id?: string;
          last_updated?: string;
          pending_balance?: number | null;
          total_balance?: number | null;
          user_id: string;
        };
        Update: {
          available_balance?: number | null;
          id?: string;
          last_updated?: string;
          pending_balance?: number | null;
          total_balance?: number | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_notification_preferences: {
        Row: {
          birthday: string | null;
          country_code: string;
          created_at: string;
          id: string;
          is_active: boolean | null;
          language_code: string;
          notification_time: string | null;
          receive_birthday: boolean | null;
          receive_cultural: boolean | null;
          receive_international: boolean | null;
          receive_national: boolean | null;
          receive_religious: boolean | null;
          religion: string | null;
          timezone: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          birthday?: string | null;
          country_code: string;
          created_at?: string;
          id?: string;
          is_active?: boolean | null;
          language_code?: string;
          notification_time?: string | null;
          receive_birthday?: boolean | null;
          receive_cultural?: boolean | null;
          receive_international?: boolean | null;
          receive_national?: boolean | null;
          receive_religious?: boolean | null;
          religion?: string | null;
          timezone?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          birthday?: string | null;
          country_code?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean | null;
          language_code?: string;
          notification_time?: string | null;
          receive_birthday?: boolean | null;
          receive_cultural?: boolean | null;
          receive_international?: boolean | null;
          receive_national?: boolean | null;
          receive_religious?: boolean | null;
          religion?: string | null;
          timezone?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      withdrawal_requests: {
        Row: {
          amount: number;
          created_at: string;
          fees: number;
          id: string;
          net_amount: number;
          payment_method_id: string;
          processed_at: string | null;
          processed_by: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          fees?: number;
          id?: string;
          net_amount: number;
          payment_method_id: string;
          processed_at?: string | null;
          processed_by?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          fees?: number;
          id?: string;
          net_amount?: number;
          payment_method_id?: string;
          processed_at?: string | null;
          processed_by?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_payment_method_id_fkey";
            columns: ["payment_method_id"];
            isOneToOne: false;
            referencedRelation: "payment_methods";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      update_user_balance: {
        Args: {
          user_id: string;
          available_change?: number;
          pending_change?: number;
        };
        Returns: {
          available_balance: number;
          pending_balance: number;
          total_balance: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

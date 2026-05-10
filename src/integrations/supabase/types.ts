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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          added_at: string | null
          cart_id: string
          currency_snapshot: string | null
          id: string
          price_snapshot: number
          product_id: string
          quantity: number | null
        }
        Insert: {
          added_at?: string | null
          cart_id: string
          currency_snapshot?: string | null
          id?: string
          price_snapshot: number
          product_id: string
          quantity?: number | null
        }
        Update: {
          added_at?: string | null
          cart_id?: string
          currency_snapshot?: string | null
          id?: string
          price_snapshot?: number
          product_id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          category_slug: string | null
          challenge_type: string | null
          created_at: string | null
          current_participants: number | null
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          max_participants: number | null
          participants_count: number | null
          prize: string | null
          reward_points: number | null
          reward_title: string | null
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_slug?: string | null
          challenge_type?: string | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_participants?: number | null
          participants_count?: number | null
          prize?: string | null
          reward_points?: number | null
          reward_title?: string | null
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_slug?: string | null
          challenge_type?: string | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_participants?: number | null
          participants_count?: number | null
          prize?: string | null
          reward_points?: number | null
          reward_title?: string | null
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          posts_count: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          posts_count?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          posts_count?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_members: {
        Row: {
          conversation_id: string
          id: string
          is_muted: boolean | null
          joined_at: string | null
          last_read_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          is_muted?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          is_muted?: boolean | null
          joined_at?: string | null
          last_read_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          last_message: string | null
          last_message_at: string | null
          name: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          name?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          name?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_news: {
        Row: {
          category: string | null
          category_slug: string | null
          content: string | null
          country: string | null
          country_codes: string[] | null
          created_at: string | null
          id: string
          image_url: string | null
          is_breaking: boolean | null
          is_featured: boolean | null
          published_at: string | null
          source: string | null
          source_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          category_slug?: string | null
          content?: string | null
          country?: string | null
          country_codes?: string[] | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_breaking?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          source?: string | null
          source_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          category_slug?: string | null
          content?: string | null
          country?: string | null
          country_codes?: string[] | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_breaking?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          source?: string | null
          source_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      drivers: {
        Row: {
          average_rating: number | null
          created_at: string | null
          current_lat: number | null
          current_lng: number | null
          driving_license_url: string | null
          email: string | null
          full_name: string
          id: string
          id_card_url: string | null
          is_active: boolean | null
          is_verified: boolean | null
          last_location_update: string | null
          phone: string | null
          photo_url: string | null
          status: string | null
          total_earnings: number | null
          total_reviews: number | null
          total_rides: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_rating?: number | null
          created_at?: string | null
          current_lat?: number | null
          current_lng?: number | null
          driving_license_url?: string | null
          email?: string | null
          full_name: string
          id?: string
          id_card_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          last_location_update?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: string | null
          total_earnings?: number | null
          total_reviews?: number | null
          total_rides?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_rating?: number | null
          created_at?: string | null
          current_lat?: number | null
          current_lng?: number | null
          driving_license_url?: string | null
          email?: string | null
          full_name?: string
          id?: string
          id_card_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          last_location_update?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: string | null
          total_earnings?: number | null
          total_reviews?: number | null
          total_rides?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          id: string
          job_id: string
          resume_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_views: {
        Row: {
          id: string
          job_id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_views_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          applicants_count: number | null
          category: string | null
          company: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          experience_level: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_remote: boolean | null
          job_type: string | null
          location: string | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          title: string
          updated_at: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          applicants_count?: number | null
          category?: string | null
          company?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_remote?: boolean | null
          job_type?: string | null
          location?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title: string
          updated_at?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          applicants_count?: number | null
          category?: string | null
          company?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_remote?: boolean | null
          job_type?: string | null
          location?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      media_files: {
        Row: {
          created_at: string | null
          duration: number | null
          file_path: string | null
          id: string
          mime_type: string | null
          post_id: string | null
          thumbnail_path: string | null
          thumbnail_url: string | null
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          file_path?: string | null
          id?: string
          mime_type?: string | null
          post_id?: string | null
          thumbnail_path?: string | null
          thumbnail_url?: string | null
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          file_path?: string | null
          id?: string
          mime_type?: string | null
          post_id?: string | null
          thumbnail_path?: string | null
          thumbnail_url?: string | null
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_files_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reads: {
        Row: {
          id: string
          message_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          message_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          message_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reads_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string | null
          duration_sec: number | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_deleted: boolean | null
          message_type: string | null
          reply_to_id: string | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string | null
          duration_sec?: number | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          message_type?: string | null
          reply_to_id?: string | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string | null
          duration_sec?: number | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          message_type?: string | null
          reply_to_id?: string | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
          shipping_address_id: string | null
          shipping_fee: number | null
          status: string | null
          subtotal: number | null
          total: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address_id?: string | null
          shipping_fee?: number | null
          status?: string | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          shipping_address_id?: string | null
          shipping_fee?: number | null
          status?: string | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "shipping_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: string | null
          category_slug: string | null
          challenge_id: string | null
          comment_count: number | null
          comments_count: number | null
          content: string | null
          content_type: string | null
          country: string | null
          country_code: string | null
          created_at: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          is_monetized: boolean | null
          is_news_article: boolean | null
          like_count: number | null
          likes_count: number | null
          location: string | null
          media_type: string | null
          media_url: string | null
          price: number | null
          save_count: number | null
          share_count: number | null
          shares_count: number | null
          status: string | null
          title: string | null
          trending_score: number | null
          updated_at: string | null
          user_id: string
          view_count: number | null
          views_count: number | null
          weekly_score: number | null
        }
        Insert: {
          category?: string | null
          category_slug?: string | null
          challenge_id?: string | null
          comment_count?: number | null
          comments_count?: number | null
          content?: string | null
          content_type?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_monetized?: boolean | null
          is_news_article?: boolean | null
          like_count?: number | null
          likes_count?: number | null
          location?: string | null
          media_type?: string | null
          media_url?: string | null
          price?: number | null
          save_count?: number | null
          share_count?: number | null
          shares_count?: number | null
          status?: string | null
          title?: string | null
          trending_score?: number | null
          updated_at?: string | null
          user_id: string
          view_count?: number | null
          views_count?: number | null
          weekly_score?: number | null
        }
        Update: {
          category?: string | null
          category_slug?: string | null
          challenge_id?: string | null
          comment_count?: number | null
          comments_count?: number | null
          content?: string | null
          content_type?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_monetized?: boolean | null
          is_news_article?: boolean | null
          like_count?: number | null
          likes_count?: number | null
          location?: string | null
          media_type?: string | null
          media_url?: string | null
          price?: number | null
          save_count?: number | null
          share_count?: number | null
          shares_count?: number | null
          status?: string | null
          title?: string | null
          trending_score?: number | null
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
          views_count?: number | null
          weekly_score?: number | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          product_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          price: number
          seller_id: string | null
          stock: number | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          category?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          price?: number
          seller_id?: string | null
          stock?: number | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          category?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          price?: number
          seller_id?: string | null
          stock?: number | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string | null
          display_name: string | null
          id: string
          is_verified: boolean | null
          name: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      rentals: {
        Row: {
          actual_return_date: string | null
          created_at: string | null
          currency: string | null
          customer_id: string
          daily_rate: number
          deposit: number | null
          driver_daily_rate: number | null
          driver_id: string | null
          end_date: string
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          pickup_address: string | null
          rental_number: string
          return_address: string | null
          start_date: string
          status: string | null
          subtotal: number
          total_amount: number
          total_days: number
          updated_at: string | null
          vehicle_id: string
          with_driver: boolean | null
        }
        Insert: {
          actual_return_date?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id: string
          daily_rate: number
          deposit?: number | null
          driver_daily_rate?: number | null
          driver_id?: string | null
          end_date: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_address?: string | null
          rental_number?: string
          return_address?: string | null
          start_date: string
          status?: string | null
          subtotal: number
          total_amount: number
          total_days: number
          updated_at?: string | null
          vehicle_id: string
          with_driver?: boolean | null
        }
        Update: {
          actual_return_date?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string
          daily_rate?: number
          deposit?: number | null
          driver_daily_rate?: number | null
          driver_id?: string | null
          end_date?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_address?: string | null
          rental_number?: string
          return_address?: string | null
          start_date?: string
          status?: string | null
          subtotal?: number
          total_amount?: number
          total_days?: number
          updated_at?: string | null
          vehicle_id?: string
          with_driver?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "rentals_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          created_at: string | null
          file_name: string | null
          file_url: string
          id: string
          is_default: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name?: string | null
          file_url: string
          id?: string
          is_default?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string | null
          file_url?: string
          id?: string
          is_default?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      ride_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          ride_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          ride_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          ride_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_messages_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          driver_id: string
          id: string
          rating: number
          reviewer_id: string
          ride_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          driver_id: string
          id?: string
          rating: number
          reviewer_id: string
          ride_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          driver_id?: string
          id?: string
          rating?: number
          reviewer_id?: string
          ride_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_reviews_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ride_reviews_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          accepted_at: string | null
          actual_duration_min: number | null
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          customer_id: string
          distance_km: number | null
          driver_id: string | null
          dropoff_address: string
          dropoff_lat: number
          dropoff_lng: number
          estimated_duration_min: number | null
          estimated_price: number
          final_price: number | null
          has_helmet: boolean | null
          id: string
          needs_loading_help: boolean | null
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          pickup_address: string
          pickup_lat: number
          pickup_lng: number
          requested_at: string | null
          ride_number: string
          service_type: string
          started_at: string | null
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          actual_duration_min?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id: string
          distance_km?: number | null
          driver_id?: string | null
          dropoff_address: string
          dropoff_lat: number
          dropoff_lng: number
          estimated_duration_min?: number | null
          estimated_price: number
          final_price?: number | null
          has_helmet?: boolean | null
          id?: string
          needs_loading_help?: boolean | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_address: string
          pickup_lat: number
          pickup_lng: number
          requested_at?: string | null
          ride_number?: string
          service_type: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          actual_duration_min?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string
          distance_km?: number | null
          driver_id?: string | null
          dropoff_address?: string
          dropoff_lat?: number
          dropoff_lng?: number
          estimated_duration_min?: number | null
          estimated_price?: number
          final_price?: number | null
          has_helmet?: boolean | null
          id?: string
          needs_loading_help?: boolean | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pickup_address?: string
          pickup_lat?: number
          pickup_lng?: number
          requested_at?: string | null
          ride_number?: string
          service_type?: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rides_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_premium_activity: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          event_type: string
          id: string
          message: string | null
          metadata: Json | null
          new_status: string | null
          payment_method: string | null
          plan: string | null
          premium_until: string | null
          previous_status: string | null
          seller_id: string | null
          source: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          event_type: string
          id?: string
          message?: string | null
          metadata?: Json | null
          new_status?: string | null
          payment_method?: string | null
          plan?: string | null
          premium_until?: string | null
          previous_status?: string | null
          seller_id?: string | null
          source?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          event_type?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          new_status?: string | null
          payment_method?: string | null
          plan?: string | null
          premium_until?: string | null
          previous_status?: string | null
          seller_id?: string | null
          source?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seller_profiles: {
        Row: {
          banner_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          id_verified: boolean | null
          is_premium: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          phone: string | null
          phone_verified: boolean | null
          premium_until: string | null
          rating: number | null
          store_name: string
          total_reviews: number | null
          total_sales: number | null
          trust_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          banner_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          id_verified?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          premium_until?: string | null
          rating?: number | null
          store_name: string
          total_reviews?: number | null
          total_sales?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          banner_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          id_verified?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          premium_until?: string | null
          rating?: number | null
          store_name?: string
          total_reviews?: number | null
          total_sales?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seller_subscriptions: {
        Row: {
          amount: number
          auto_renew: boolean | null
          cancelled_at: string | null
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          payment_method: string | null
          plan: string
          seller_id: string
          starts_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          auto_renew?: boolean | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          plan?: string
          seller_id: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          auto_renew?: boolean | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          plan?: string
          seller_id?: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shipping_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string | null
          full_name: string
          id: string
          is_default: boolean | null
          phone: string
          postal_code: string | null
          state: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country: string
          created_at?: string | null
          full_name: string
          id?: string
          is_default?: boolean | null
          phone: string
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string | null
          full_name?: string
          id?: string
          is_default?: boolean | null
          phone?: string
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      station_reports: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          station_id: string
          status: string
          user_id: string
          wait_time_min: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          station_id: string
          status: string
          user_id: string
          wait_time_min?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          station_id?: string
          status?: string
          user_id?: string
          wait_time_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "station_reports_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      stations: {
        Row: {
          address: string | null
          brand: string | null
          city: string | null
          country: string | null
          created_at: string | null
          current_status: string | null
          fuel_types: string[] | null
          id: string
          image_url: string | null
          is_24h: boolean | null
          is_open: boolean | null
          latitude: number
          longitude: number
          name: string
          opening_hours: string | null
          phone: string | null
          price_diesel: number | null
          price_essence: number | null
          price_gaz: number | null
          products: string[] | null
          total_reports: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          brand?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          current_status?: string | null
          fuel_types?: string[] | null
          id?: string
          image_url?: string | null
          is_24h?: boolean | null
          is_open?: boolean | null
          latitude: number
          longitude: number
          name: string
          opening_hours?: string | null
          phone?: string | null
          price_diesel?: number | null
          price_essence?: number | null
          price_gaz?: number | null
          products?: string[] | null
          total_reports?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          brand?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          current_status?: string | null
          fuel_types?: string[] | null
          id?: string
          image_url?: string | null
          is_24h?: boolean | null
          is_open?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          opening_hours?: string | null
          phone?: string | null
          price_diesel?: number | null
          price_essence?: number | null
          price_gaz?: number | null
          products?: string[] | null
          total_reports?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tabaski_reservations: {
        Row: {
          animal_name: string | null
          animal_type: string
          breed: string | null
          created_at: string | null
          delivery_address: string | null
          delivery_date: string | null
          deposit_amount: number | null
          id: string
          location: string | null
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          price: number
          seller_name: string | null
          seller_phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          weight: string | null
        }
        Insert: {
          animal_name?: string | null
          animal_type: string
          breed?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          deposit_amount?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          price: number
          seller_name?: string | null
          seller_phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          weight?: string | null
        }
        Update: {
          animal_name?: string | null
          animal_type?: string
          breed?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          deposit_amount?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          price?: number
          seller_name?: string | null
          seller_phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          weight?: string | null
        }
        Relationships: []
      }
      user_job_preferences: {
        Row: {
          created_at: string | null
          experience_level: string | null
          id: string
          min_salary: number | null
          preferred_categories: string[] | null
          preferred_job_types: string[] | null
          preferred_locations: string[] | null
          remote_only: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          experience_level?: string | null
          id?: string
          min_salary?: number | null
          preferred_categories?: string[] | null
          preferred_job_types?: string[] | null
          preferred_locations?: string[] | null
          remote_only?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          experience_level?: string | null
          id?: string
          min_salary?: number | null
          preferred_categories?: string[] | null
          preferred_job_types?: string[] | null
          preferred_locations?: string[] | null
          remote_only?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          chat_translate_lang: string
          chat_translate_own: boolean
          created_at: string
          id: string
          preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_translate_lang?: string
          chat_translate_own?: boolean
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_translate_lang?: string
          chat_translate_own?: boolean
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string | null
          cargo_volume_m3: number | null
          color: string | null
          created_at: string | null
          driver_id: string
          has_ac: boolean | null
          id: string
          insurance_url: string | null
          is_active: boolean | null
          is_verified: boolean | null
          luggage_capacity: number | null
          max_weight_kg: number | null
          model: string | null
          photo_url: string | null
          plate_number: string | null
          registration_card_url: string | null
          seats: number | null
          updated_at: string | null
          vehicle_type: string
          year: number | null
        }
        Insert: {
          brand?: string | null
          cargo_volume_m3?: number | null
          color?: string | null
          created_at?: string | null
          driver_id: string
          has_ac?: boolean | null
          id?: string
          insurance_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          luggage_capacity?: number | null
          max_weight_kg?: number | null
          model?: string | null
          photo_url?: string | null
          plate_number?: string | null
          registration_card_url?: string | null
          seats?: number | null
          updated_at?: string | null
          vehicle_type: string
          year?: number | null
        }
        Update: {
          brand?: string | null
          cargo_volume_m3?: number | null
          color?: string | null
          created_at?: string | null
          driver_id?: string
          has_ac?: boolean | null
          id?: string
          insurance_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          luggage_capacity?: number | null
          max_weight_kg?: number | null
          model?: string | null
          photo_url?: string | null
          plate_number?: string | null
          registration_card_url?: string | null
          seats?: number | null
          updated_at?: string | null
          vehicle_type?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      wallpaper_categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          wallpaper_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          wallpaper_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          wallpaper_count?: number | null
        }
        Relationships: []
      }
      wallpaper_favorites: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          wallpaper_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          wallpaper_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          wallpaper_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallpaper_favorites_wallpaper_id_fkey"
            columns: ["wallpaper_id"]
            isOneToOne: false
            referencedRelation: "wallpapers"
            referencedColumns: ["id"]
          },
        ]
      }
      wallpapers: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          file_size: number | null
          file_url: string
          height: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          media_type: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
          width: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_size?: number | null
          file_url: string
          height?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          media_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
          width?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_size?: number | null
          file_url?: string
          height?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          media_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wallpapers_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "wallpaper_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_rankings: {
        Row: {
          category: string | null
          category_slug: string | null
          change_count: number | null
          country_code: string | null
          created_at: string | null
          id: string
          previous_rank: number | null
          rank: number | null
          rank_position: number | null
          score: number | null
          title: string | null
          total_likes: number | null
          total_posts: number | null
          total_score: number | null
          total_views: number | null
          trend: string | null
          updated_at: string | null
          user_id: string | null
          week_end: string | null
          week_start: string
        }
        Insert: {
          category?: string | null
          category_slug?: string | null
          change_count?: number | null
          country_code?: string | null
          created_at?: string | null
          id?: string
          previous_rank?: number | null
          rank?: number | null
          rank_position?: number | null
          score?: number | null
          title?: string | null
          total_likes?: number | null
          total_posts?: number | null
          total_score?: number | null
          total_views?: number | null
          trend?: string | null
          updated_at?: string | null
          user_id?: string | null
          week_end?: string | null
          week_start: string
        }
        Update: {
          category?: string | null
          category_slug?: string | null
          change_count?: number | null
          country_code?: string | null
          created_at?: string | null
          id?: string
          previous_rank?: number | null
          rank?: number | null
          rank_position?: number | null
          score?: number | null
          title?: string | null
          total_likes?: number | null
          total_posts?: number | null
          total_score?: number | null
          total_views?: number | null
          trend?: string | null
          updated_at?: string | null
          user_id?: string | null
          week_end?: string | null
          week_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      compute_seller_trust_score: {
        Args: { _seller_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_premium_activity: {
        Args: {
          _amount?: number
          _currency?: string
          _event_type: string
          _message?: string
          _metadata?: Json
          _new_status?: string
          _payment_method?: string
          _plan?: string
          _premium_until?: string
          _previous_status?: string
          _source?: string
          _user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

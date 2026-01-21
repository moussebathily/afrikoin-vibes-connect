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
      cart_items: {
        Row: {
          added_at: string | null
          cart_id: string
          currency_snapshot: string
          id: string
          price_snapshot: number
          product_id: string
          quantity: number
        }
        Insert: {
          added_at?: string | null
          cart_id: string
          currency_snapshot?: string
          id?: string
          price_snapshot: number
          product_id: string
          quantity?: number
        }
        Update: {
          added_at?: string | null
          cart_id?: string
          currency_snapshot?: string
          id?: string
          price_snapshot?: number
          product_id?: string
          quantity?: number
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
          participants_count: number | null
          prize: string | null
          reward_points: number | null
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
          participants_count?: number | null
          prize?: string | null
          reward_points?: number | null
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
          participants_count?: number | null
          prize?: string | null
          reward_points?: number | null
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
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      driver_documents: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string
          driver_id: string
          expiry_date: string | null
          id: string
          is_verified: boolean | null
          updated_at: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url: string
          driver_id: string
          expiry_date?: string | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string
          driver_id?: string
          expiry_date?: string | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
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
          phone: string
          photo_url: string | null
          status: Database["public"]["Enums"]["driver_status"] | null
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
          phone: string
          photo_url?: string | null
          status?: Database["public"]["Enums"]["driver_status"] | null
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
          phone?: string
          photo_url?: string | null
          status?: Database["public"]["Enums"]["driver_status"] | null
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
          benefits: string | null
          category: string | null
          company: string
          company_logo_url: string | null
          company_website: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          experience_level: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          job_type: string
          location: string
          requirements: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          title: string
          updated_at: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          applicants_count?: number | null
          benefits?: string | null
          category?: string | null
          company: string
          company_logo_url?: string | null
          company_website?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          experience_level?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          job_type?: string
          location: string
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title: string
          updated_at?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          applicants_count?: number | null
          benefits?: string | null
          category?: string | null
          company?: string
          company_logo_url?: string | null
          company_website?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          experience_level?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          job_type?: string
          location?: string
          requirements?: string | null
          salary_currency?: string | null
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
          id: string
          post_id: string | null
          thumbnail_url: string | null
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          id?: string
          post_id?: string | null
          thumbnail_url?: string | null
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          id?: string
          post_id?: string | null
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
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string
          product_image: string | null
          product_title: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id: string
          product_image?: string | null
          product_title: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
          product_image?: string | null
          product_title?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string | null
          currency: string | null
          id: string
          mobile_money_provider: string | null
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          seller_id: string
          shipping_address: Json | null
          shipping_fee: number | null
          status: string | null
          subtotal: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          currency?: string | null
          id?: string
          mobile_money_provider?: string | null
          notes?: string | null
          order_number: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          seller_id: string
          shipping_address?: Json | null
          shipping_fee?: number | null
          status?: string | null
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          mobile_money_provider?: string | null
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          seller_id?: string
          shipping_address?: Json | null
          shipping_fee?: number | null
          status?: string | null
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string | null
          comment_count: number | null
          comments_count: number | null
          content: string | null
          content_type: string | null
          country: string | null
          created_at: string | null
          id: string
          is_featured: boolean | null
          is_monetized: boolean | null
          like_count: number | null
          likes_count: number | null
          media_type: string | null
          media_url: string | null
          save_count: number | null
          share_count: number | null
          shares_count: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          category?: string | null
          comment_count?: number | null
          comments_count?: number | null
          content?: string | null
          content_type?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_monetized?: boolean | null
          like_count?: number | null
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
          save_count?: number | null
          share_count?: number | null
          shares_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string | null
          comment_count?: number | null
          comments_count?: number | null
          content?: string | null
          content_type?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_monetized?: boolean | null
          like_count?: number | null
          likes_count?: number | null
          media_type?: string | null
          media_url?: string | null
          save_count?: number | null
          share_count?: number | null
          shares_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      product_recommendations: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          recommendation_type: string | null
          recommended_product_id: string | null
          score: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          recommendation_type?: string | null
          recommended_product_id?: string | null
          score?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          recommendation_type?: string | null
          recommended_product_id?: string | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_recommendations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_recommendations_recommended_product_id_fkey"
            columns: ["recommended_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified_purchase: boolean | null
          product_id: string
          rating: number
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          product_id: string
          rating: number
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string
          rating?: number
          title?: string | null
          updated_at?: string | null
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
          average_rating: number | null
          category: string | null
          country: string | null
          created_at: string | null
          currency: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          price: number
          reviews_count: number | null
          seller_id: string | null
          stock: number | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          average_rating?: number | null
          category?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          price?: number
          reviews_count?: number | null
          seller_id?: string | null
          stock?: number | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          average_rating?: number | null
          category?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          price?: number
          reviews_count?: number | null
          seller_id?: string | null
          stock?: number | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          pickup_address: string
          rental_number: string
          return_address: string | null
          start_date: string
          status: Database["public"]["Enums"]["rental_status"] | null
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
          pickup_address: string
          rental_number: string
          return_address?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["rental_status"] | null
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
          pickup_address?: string
          rental_number?: string
          return_address?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["rental_status"] | null
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
      ride_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          ride_id: string
          sender_id: string
          sender_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          ride_id: string
          sender_id: string
          sender_type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          ride_id?: string
          sender_id?: string
          sender_type?: string
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
          service_type: Database["public"]["Enums"]["vehicle_type"]
          started_at: string | null
          status: Database["public"]["Enums"]["ride_status"] | null
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
          ride_number: string
          service_type: Database["public"]["Enums"]["vehicle_type"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["ride_status"] | null
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
          service_type?: Database["public"]["Enums"]["vehicle_type"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["ride_status"] | null
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
      seller_profiles: {
        Row: {
          address: string | null
          banner_url: string | null
          business_type: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          joined_at: string | null
          logo_url: string | null
          phone: string | null
          rating: number | null
          store_description: string | null
          store_name: string
          total_revenue: number | null
          total_reviews: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          banner_url?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          joined_at?: string | null
          logo_url?: string | null
          phone?: string | null
          rating?: number | null
          store_description?: string | null
          store_name: string
          total_revenue?: number | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          banner_url?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          joined_at?: string | null
          logo_url?: string | null
          phone?: string | null
          rating?: number | null
          store_description?: string | null
          store_name?: string
          total_revenue?: number | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      shipping_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean | null
          phone: string
          postal_code: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean | null
          phone: string
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean | null
          phone?: string
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_job_preferences: {
        Row: {
          created_at: string | null
          experience_level: string | null
          id: string
          max_salary: number | null
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
          max_salary?: number | null
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
          max_salary?: number | null
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
      vehicles: {
        Row: {
          brand: string
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
          model: string
          photo_url: string | null
          plate_number: string
          registration_card_url: string | null
          seats: number | null
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: number | null
        }
        Insert: {
          brand: string
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
          model: string
          photo_url?: string | null
          plate_number: string
          registration_card_url?: string | null
          seats?: number | null
          updated_at?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year?: number | null
        }
        Update: {
          brand?: string
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
          model?: string
          photo_url?: string | null
          plate_number?: string
          registration_card_url?: string | null
          seats?: number | null
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
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
      weekly_rankings: {
        Row: {
          category: string | null
          category_slug: string | null
          change_count: number | null
          country_code: string | null
          created_at: string | null
          id: string
          previous_rank: number | null
          rank: number
          score: number | null
          total_score: number | null
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
          rank: number
          score?: number | null
          total_score?: number | null
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
          rank?: number
          score?: number | null
          total_score?: number | null
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
      [_ in never]: never
    }
    Enums: {
      driver_status: "offline" | "available" | "busy"
      rental_status:
        | "pending"
        | "confirmed"
        | "active"
        | "completed"
        | "cancelled"
      ride_status:
        | "pending"
        | "accepted"
        | "in_progress"
        | "completed"
        | "cancelled"
      vehicle_type: "moto" | "taxi" | "utility" | "rental"
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
      driver_status: ["offline", "available", "busy"],
      rental_status: [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
      ],
      ride_status: [
        "pending",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
      ],
      vehicle_type: ["moto", "taxi", "utility", "rental"],
    },
  },
} as const

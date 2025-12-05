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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_improvement_suggestions: {
        Row: {
          based_on_interactions: number | null
          category: string
          confidence_score: number | null
          created_at: string | null
          current_approach: string
          id: string
          implemented_at: string | null
          metadata: Json | null
          reasoning: string
          status: string
          suggested_approach: string
          suggestion_type: string
          updated_at: string | null
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          based_on_interactions?: number | null
          category: string
          confidence_score?: number | null
          created_at?: string | null
          current_approach: string
          id?: string
          implemented_at?: string | null
          metadata?: Json | null
          reasoning: string
          status?: string
          suggested_approach: string
          suggestion_type: string
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          based_on_interactions?: number | null
          category?: string
          confidence_score?: number | null
          created_at?: string | null
          current_approach?: string
          id?: string
          implemented_at?: string | null
          metadata?: Json | null
          reasoning?: string
          status?: string
          suggested_approach?: string
          suggestion_type?: string
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: []
      }
      ai_knowledge_base: {
        Row: {
          content: string
          created_at: string | null
          difficulty_level: string
          effectiveness_score: number | null
          id: string
          is_active: boolean | null
          language: string
          source: string | null
          subtopic: string | null
          success_rate: number | null
          tags: string[] | null
          topic: string
          updated_at: string | null
          usage_count: number | null
          version: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          difficulty_level: string
          effectiveness_score?: number | null
          id?: string
          is_active?: boolean | null
          language?: string
          source?: string | null
          subtopic?: string | null
          success_rate?: number | null
          tags?: string[] | null
          topic: string
          updated_at?: string | null
          usage_count?: number | null
          version?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          difficulty_level?: string
          effectiveness_score?: number | null
          id?: string
          is_active?: boolean | null
          language?: string
          source?: string | null
          subtopic?: string | null
          success_rate?: number | null
          tags?: string[] | null
          topic?: string
          updated_at?: string | null
          usage_count?: number | null
          version?: number | null
        }
        Relationships: []
      }
      ai_learning_interactions: {
        Row: {
          ai_response: string | null
          context: Json
          created_at: string | null
          feedback_score: number | null
          feedback_text: string | null
          id: string
          interaction_type: string
          success_metrics: Json | null
          user_id: string
          user_input: string | null
        }
        Insert: {
          ai_response?: string | null
          context?: Json
          created_at?: string | null
          feedback_score?: number | null
          feedback_text?: string | null
          id?: string
          interaction_type: string
          success_metrics?: Json | null
          user_id: string
          user_input?: string | null
        }
        Update: {
          ai_response?: string | null
          context?: Json
          created_at?: string | null
          feedback_score?: number | null
          feedback_text?: string | null
          id?: string
          interaction_type?: string
          success_metrics?: Json | null
          user_id?: string
          user_input?: string | null
        }
        Relationships: []
      }
      ai_performance_metrics: {
        Row: {
          average_satisfaction: number | null
          common_issues: Json | null
          created_at: string | null
          id: string
          improvement_areas: Json | null
          metric_date: string
          metric_type: string
          top_performing_topics: Json | null
          total_interactions: number | null
        }
        Insert: {
          average_satisfaction?: number | null
          common_issues?: Json | null
          created_at?: string | null
          id?: string
          improvement_areas?: Json | null
          metric_date?: string
          metric_type: string
          top_performing_topics?: Json | null
          total_interactions?: number | null
        }
        Update: {
          average_satisfaction?: number | null
          common_issues?: Json | null
          created_at?: string | null
          id?: string
          improvement_areas?: Json | null
          metric_date?: string
          metric_type?: string
          top_performing_topics?: Json | null
          total_interactions?: number | null
        }
        Relationships: []
      }
      calls: {
        Row: {
          ai_teacher_id: string | null
          caller_id: string
          created_at: string | null
          duration_seconds: number | null
          end_time: string | null
          id: string
          metadata: Json | null
          receiver_id: string | null
          session_token: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["call_status"]
          summary: string | null
          transcript: string | null
          type: Database["public"]["Enums"]["call_type"]
          updated_at: string | null
        }
        Insert: {
          ai_teacher_id?: string | null
          caller_id: string
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          metadata?: Json | null
          receiver_id?: string | null
          session_token?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["call_status"]
          summary?: string | null
          transcript?: string | null
          type: Database["public"]["Enums"]["call_type"]
          updated_at?: string | null
        }
        Update: {
          ai_teacher_id?: string | null
          caller_id?: string
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          metadata?: Json | null
          receiver_id?: string | null
          session_token?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["call_status"]
          summary?: string | null
          transcript?: string | null
          type?: Database["public"]["Enums"]["call_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_ai_teacher_id_fkey"
            columns: ["ai_teacher_id"]
            isOneToOne: false
            referencedRelation: "professeurs_ai"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          category_slug: string
          challenge_type: string
          created_at: string | null
          current_participants: number | null
          description: string
          end_date: string
          id: string
          is_active: boolean | null
          max_participants: number | null
          reward_points: number | null
          reward_title: string | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category_slug: string
          challenge_type: string
          created_at?: string | null
          current_participants?: number | null
          description: string
          end_date: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          reward_points?: number | null
          reward_title?: string | null
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category_slug?: string
          challenge_type?: string
          created_at?: string | null
          current_participants?: number | null
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          reward_points?: number | null
          reward_title?: string | null
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      child_parents: {
        Row: {
          can_pickup: boolean | null
          child_id: string
          is_primary: boolean | null
          parent_id: string
          relationship: string | null
        }
        Insert: {
          can_pickup?: boolean | null
          child_id: string
          is_primary?: boolean | null
          parent_id: string
          relationship?: string | null
        }
        Update: {
          can_pickup?: boolean | null
          child_id?: string
          is_primary?: boolean | null
          parent_id?: string
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_parents_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "creche_children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_parents_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "creche_parents"
            referencedColumns: ["id"]
          },
        ]
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
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      course_accessibility: {
        Row: {
          accessibility_features: Json | null
          autism_friendly: boolean | null
          communication_support: Json | null
          course_id: string
          created_at: string | null
          id: string
          sensory_considerations: Json | null
          updated_at: string | null
        }
        Insert: {
          accessibility_features?: Json | null
          autism_friendly?: boolean | null
          communication_support?: Json | null
          course_id: string
          created_at?: string | null
          id?: string
          sensory_considerations?: Json | null
          updated_at?: string | null
        }
        Update: {
          accessibility_features?: Json | null
          autism_friendly?: boolean | null
          communication_support?: Json | null
          course_id?: string
          created_at?: string | null
          id?: string
          sensory_considerations?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_accessibility_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          course_id: string
          enrolled_at: string
          id: string
          invitation_id: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string
          id?: string
          invitation_id?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string
          id?: string
          invitation_id?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "course_invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_invitations: {
        Row: {
          course_id: string
          created_at: string
          created_by: string
          current_uses: number | null
          expires_at: string | null
          id: string
          invitation_link: string
          max_uses: number | null
          qr_code: string
        }
        Insert: {
          course_id: string
          created_at?: string
          created_by: string
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          invitation_link: string
          max_uses?: number | null
          qr_code: string
        }
        Update: {
          course_id?: string
          created_at?: string
          created_by?: string
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          invitation_link?: string
          max_uses?: number | null
          qr_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_invitations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_invitations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          duration: string | null
          id: string
          is_active: boolean | null
          level: string
          max_students: number | null
          qr_code: string | null
          schedule: string | null
          school_id: string
          subject: string
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          is_active?: boolean | null
          level: string
          max_students?: number | null
          qr_code?: string | null
          schedule?: string | null
          school_id: string
          subject: string
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          is_active?: boolean | null
          level?: string
          max_students?: number | null
          qr_code?: string | null
          schedule?: string | null
          school_id?: string
          subject?: string
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creche_children: {
        Row: {
          allergies: string[] | null
          birthdate: string | null
          created_at: string | null
          creche_id: string
          emergency_contact: Json | null
          full_name: string
          group_name: string | null
          id: string
          medical_notes: string | null
          photo_url: string | null
          updated_at: string | null
        }
        Insert: {
          allergies?: string[] | null
          birthdate?: string | null
          created_at?: string | null
          creche_id: string
          emergency_contact?: Json | null
          full_name: string
          group_name?: string | null
          id?: string
          medical_notes?: string | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          allergies?: string[] | null
          birthdate?: string | null
          created_at?: string | null
          creche_id?: string
          emergency_contact?: Json | null
          full_name?: string
          group_name?: string | null
          id?: string
          medical_notes?: string | null
          photo_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creche_children_creche_id_fkey"
            columns: ["creche_id"]
            isOneToOne: false
            referencedRelation: "creches"
            referencedColumns: ["id"]
          },
        ]
      }
      creche_daily_tracking: {
        Row: {
          absence_reason: string | null
          activities: string[] | null
          arrival_time: string | null
          child_id: string
          created_at: string | null
          created_by: string | null
          departure_time: string | null
          id: string
          is_present: boolean | null
          meals: Json | null
          mood: string | null
          naps: Json | null
          notes: string | null
          tracking_date: string
          updated_at: string | null
        }
        Insert: {
          absence_reason?: string | null
          activities?: string[] | null
          arrival_time?: string | null
          child_id: string
          created_at?: string | null
          created_by?: string | null
          departure_time?: string | null
          id?: string
          is_present?: boolean | null
          meals?: Json | null
          mood?: string | null
          naps?: Json | null
          notes?: string | null
          tracking_date?: string
          updated_at?: string | null
        }
        Update: {
          absence_reason?: string | null
          activities?: string[] | null
          arrival_time?: string | null
          child_id?: string
          created_at?: string | null
          created_by?: string | null
          departure_time?: string | null
          id?: string
          is_present?: boolean | null
          meals?: Json | null
          mood?: string | null
          naps?: Json | null
          notes?: string | null
          tracking_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creche_daily_tracking_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "creche_children"
            referencedColumns: ["id"]
          },
        ]
      }
      creche_invitations: {
        Row: {
          child_id: string | null
          code: string
          created_at: string | null
          created_by: string | null
          creche_id: string
          expires_at: string | null
          id: string
          invited_email: string | null
          is_used: boolean | null
          qr_code_url: string | null
        }
        Insert: {
          child_id?: string | null
          code: string
          created_at?: string | null
          created_by?: string | null
          creche_id: string
          expires_at?: string | null
          id?: string
          invited_email?: string | null
          is_used?: boolean | null
          qr_code_url?: string | null
        }
        Update: {
          child_id?: string | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          creche_id?: string
          expires_at?: string | null
          id?: string
          invited_email?: string | null
          is_used?: boolean | null
          qr_code_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creche_invitations_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "creche_children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creche_invitations_creche_id_fkey"
            columns: ["creche_id"]
            isOneToOne: false
            referencedRelation: "creches"
            referencedColumns: ["id"]
          },
        ]
      }
      creche_parents: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      creche_posts: {
        Row: {
          author_id: string
          category: string | null
          child_id: string | null
          content: string | null
          created_at: string | null
          creche_id: string
          id: string
          is_pinned: boolean | null
          media: Json | null
          title: string | null
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          author_id: string
          category?: string | null
          child_id?: string | null
          content?: string | null
          created_at?: string | null
          creche_id: string
          id?: string
          is_pinned?: boolean | null
          media?: Json | null
          title?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          author_id?: string
          category?: string | null
          child_id?: string | null
          content?: string | null
          created_at?: string | null
          creche_id?: string
          id?: string
          is_pinned?: boolean | null
          media?: Json | null
          title?: string | null
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creche_posts_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "creche_children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creche_posts_creche_id_fkey"
            columns: ["creche_id"]
            isOneToOne: false
            referencedRelation: "creches"
            referencedColumns: ["id"]
          },
        ]
      }
      creche_staff: {
        Row: {
          created_at: string | null
          creche_id: string
          id: string
          permissions: Json | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          creche_id: string
          id?: string
          permissions?: Json | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          creche_id?: string
          id?: string
          permissions?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creche_staff_creche_id_fkey"
            columns: ["creche_id"]
            isOneToOne: false
            referencedRelation: "creches"
            referencedColumns: ["id"]
          },
        ]
      }
      creches: {
        Row: {
          address: string | null
          admin_id: string | null
          created_at: string | null
          email: string | null
          establishment_type: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          admin_id?: string | null
          created_at?: string | null
          email?: string | null
          establishment_type?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          admin_id?: string | null
          created_at?: string | null
          email?: string | null
          establishment_type?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_news: {
        Row: {
          category_slug: string
          content: string
          country_codes: string[] | null
          created_at: string | null
          id: string
          image_url: string | null
          is_breaking: boolean | null
          is_featured: boolean | null
          published_at: string | null
          source_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_slug: string
          content: string
          country_codes?: string[] | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_breaking?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          source_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_slug?: string
          content?: string
          country_codes?: string[] | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_breaking?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          source_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          ai_summary: string | null
          course_id: string | null
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_ai_explained: boolean | null
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_ai_explained?: boolean | null
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_ai_explained?: boolean | null
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      failed_login_attempts: {
        Row: {
          attempted_at: string | null
          email: string
          id: string
          ip_address: unknown
          user_agent: string | null
        }
        Insert: {
          attempted_at?: string | null
          email: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Update: {
          attempted_at?: string | null
          email?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Relationships: []
      }
      like_credits: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          total_purchased: number | null
          total_used: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          total_purchased?: number | null
          total_used?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          total_purchased?: number | null
          total_used?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      like_purchases: {
        Row: {
          amount: number
          created_at: string | null
          credits_purchased: number
          currency: string | null
          id: string
          likes_amount: number
          pack_name: string | null
          payment_status: string | null
          price_amount: number
          product_id: string | null
          purchase_token: string | null
          status: string
          store_type: string | null
          stripe_payment_id: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          credits_purchased: number
          currency?: string | null
          id?: string
          likes_amount: number
          pack_name?: string | null
          payment_status?: string | null
          price_amount: number
          product_id?: string | null
          purchase_token?: string | null
          status?: string
          store_type?: string | null
          stripe_payment_id?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          credits_purchased?: number
          currency?: string | null
          id?: string
          likes_amount?: number
          pack_name?: string | null
          payment_status?: string | null
          price_amount?: number
          product_id?: string | null
          purchase_token?: string | null
          status?: string
          store_type?: string | null
          stripe_payment_id?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      media_files: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          mime_type: string
          post_id: string
          thumbnail_path: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          mime_type: string
          post_id: string
          thumbnail_path?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          mime_type?: string
          post_id?: string
          thumbnail_path?: string | null
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
      ml_alerts: {
        Row: {
          action_taken: string | null
          anomaly_score: number
          anomaly_type: string | null
          confidence: number | null
          created_at: string | null
          event_id: string | null
          id: string
          is_false_positive: boolean | null
          model_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          action_taken?: string | null
          anomaly_score: number
          anomaly_type?: string | null
          confidence?: number | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_false_positive?: boolean | null
          model_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          action_taken?: string | null
          anomaly_score?: number
          anomaly_type?: string | null
          confidence?: number | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_false_positive?: boolean | null
          model_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ml_alerts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "security_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ml_alerts_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ml_models"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_models: {
        Row: {
          accuracy: number | null
          created_at: string | null
          false_positive_rate: number | null
          features: Json | null
          hyperparameters: Json | null
          id: string
          is_active: boolean | null
          model_name: string
          model_type: string | null
          model_version: string
          trained_at: string | null
          training_data_size: number | null
        }
        Insert: {
          accuracy?: number | null
          created_at?: string | null
          false_positive_rate?: number | null
          features?: Json | null
          hyperparameters?: Json | null
          id?: string
          is_active?: boolean | null
          model_name: string
          model_type?: string | null
          model_version: string
          trained_at?: string | null
          training_data_size?: number | null
        }
        Update: {
          accuracy?: number | null
          created_at?: string | null
          false_positive_rate?: number | null
          features?: Json | null
          hyperparameters?: Json | null
          id?: string
          is_active?: boolean | null
          model_name?: string
          model_type?: string | null
          model_version?: string
          trained_at?: string | null
          training_data_size?: number | null
        }
        Relationships: []
      }
      ong: {
        Row: {
          address: string | null
          admin_id: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          is_verified: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          settings: Json | null
          type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          admin_id?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          settings?: Json | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          admin_id?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          settings?: Json | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      ong_event_participants: {
        Row: {
          event_id: string
          id: string
          registered_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ong_event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "ong_events"
            referencedColumns: ["id"]
          },
        ]
      }
      ong_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          description: string | null
          end_time: string | null
          event_type: string | null
          id: string
          is_online: boolean | null
          is_public: boolean | null
          location: string | null
          max_participants: number | null
          meeting_url: string | null
          ong_id: string
          start_time: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_online?: boolean | null
          is_public?: boolean | null
          location?: string | null
          max_participants?: number | null
          meeting_url?: string | null
          ong_id: string
          start_time: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_online?: boolean | null
          is_public?: boolean | null
          location?: string | null
          max_participants?: number | null
          meeting_url?: string | null
          ong_id?: string
          start_time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ong_events_ong_id_fkey"
            columns: ["ong_id"]
            isOneToOne: false
            referencedRelation: "ong"
            referencedColumns: ["id"]
          },
        ]
      }
      ong_invitations: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          invited_email: string | null
          is_used: boolean | null
          ong_id: string
          qr_code_url: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          invited_email?: string | null
          is_used?: boolean | null
          ong_id: string
          qr_code_url?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          invited_email?: string | null
          is_used?: boolean | null
          ong_id?: string
          qr_code_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ong_invitations_ong_id_fkey"
            columns: ["ong_id"]
            isOneToOne: false
            referencedRelation: "ong"
            referencedColumns: ["id"]
          },
        ]
      }
      ong_members: {
        Row: {
          created_at: string | null
          id: string
          ong_id: string
          permissions: Json | null
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ong_id: string
          permissions?: Json | null
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ong_id?: string
          permissions?: Json | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ong_members_ong_id_fkey"
            columns: ["ong_id"]
            isOneToOne: false
            referencedRelation: "ong"
            referencedColumns: ["id"]
          },
        ]
      }
      ong_partnerships: {
        Row: {
          created_at: string | null
          creche_id: string | null
          description: string | null
          end_date: string | null
          id: string
          ong_id: string
          partnership_type: string | null
          school_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creche_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          ong_id: string
          partnership_type?: string | null
          school_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creche_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          ong_id?: string
          partnership_type?: string | null
          school_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ong_partnerships_creche_id_fkey"
            columns: ["creche_id"]
            isOneToOne: false
            referencedRelation: "creches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ong_partnerships_ong_id_fkey"
            columns: ["ong_id"]
            isOneToOne: false
            referencedRelation: "ong"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ong_partnerships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      ong_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string | null
          id: string
          is_pinned: boolean | null
          media: Json | null
          ong_id: string
          title: string | null
          updated_at: string | null
          view_count: number | null
          visibility: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          media?: Json | null
          ong_id: string
          title?: string | null
          updated_at?: string | null
          view_count?: number | null
          visibility?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          media?: Json | null
          ong_id?: string
          title?: string | null
          updated_at?: string | null
          view_count?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ong_posts_ong_id_fkey"
            columns: ["ong_id"]
            isOneToOne: false
            referencedRelation: "ong"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category_slug: string | null
          challenge_id: string | null
          content_type: string
          country_code: string | null
          created_at: string | null
          description: string | null
          id: string
          is_monetized: boolean | null
          is_news_article: boolean | null
          like_count: number | null
          location: string | null
          price: number | null
          status: string | null
          title: string | null
          trending_score: number | null
          updated_at: string | null
          user_id: string
          view_count: number | null
          weekly_score: number | null
        }
        Insert: {
          category_slug?: string | null
          challenge_id?: string | null
          content_type: string
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_monetized?: boolean | null
          is_news_article?: boolean | null
          like_count?: number | null
          location?: string | null
          price?: number | null
          status?: string | null
          title?: string | null
          trending_score?: number | null
          updated_at?: string | null
          user_id: string
          view_count?: number | null
          weekly_score?: number | null
        }
        Update: {
          category_slug?: string | null
          challenge_id?: string | null
          content_type?: string
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_monetized?: boolean | null
          is_news_article?: boolean | null
          like_count?: number | null
          location?: string | null
          price?: number | null
          status?: string | null
          title?: string | null
          trending_score?: number | null
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
          weekly_score?: number | null
        }
        Relationships: []
      }
      professeurs_ai: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          description: string | null
          genre: string
          id: string
          langues: string[] | null
          matieres: string[] | null
          nom: string
          personnalite: string | null
          style: string
          voix_description: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          genre: string
          id?: string
          langues?: string[] | null
          matieres?: string[] | null
          nom: string
          personnalite?: string | null
          style: string
          voix_description?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          genre?: string
          id?: string
          langues?: string[] | null
          matieres?: string[] | null
          nom?: string
          personnalite?: string | null
          style?: string
          voix_description?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_verified: boolean | null
          name: string | null
          professeur_ai_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          name?: string | null
          professeur_ai_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string | null
          professeur_ai_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_professeur_ai_id_fkey"
            columns: ["professeur_ai_id"]
            isOneToOne: false
            referencedRelation: "professeurs_ai"
            referencedColumns: ["id"]
          },
        ]
      }
      religious_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      religious_course_enrollments: {
        Row: {
          certificate_issued: boolean | null
          certificate_url: string | null
          completed: boolean | null
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          last_accessed_at: string | null
          progress: number | null
          student_id: string
        }
        Insert: {
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completed?: boolean | null
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          last_accessed_at?: string | null
          progress?: number | null
          student_id: string
        }
        Update: {
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completed?: boolean | null
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          last_accessed_at?: string | null
          progress?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "religious_course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "religious_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      religious_courses: {
        Row: {
          age_appropriate: boolean | null
          category_id: string | null
          completion_count: number | null
          content: string | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          ethical_validation_status: string | null
          has_audio: boolean | null
          has_pictograms: boolean | null
          has_sign_language: boolean | null
          has_video: boolean | null
          id: string
          is_active: boolean | null
          is_ai_assisted: boolean | null
          is_certified: boolean | null
          languages: string[] | null
          parent_control_required: boolean | null
          rating: number | null
          teacher_id: string | null
          title: string
          updated_at: string
          validated_at: string | null
          validated_by: string | null
          view_count: number | null
        }
        Insert: {
          age_appropriate?: boolean | null
          category_id?: string | null
          completion_count?: number | null
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          ethical_validation_status?: string | null
          has_audio?: boolean | null
          has_pictograms?: boolean | null
          has_sign_language?: boolean | null
          has_video?: boolean | null
          id?: string
          is_active?: boolean | null
          is_ai_assisted?: boolean | null
          is_certified?: boolean | null
          languages?: string[] | null
          parent_control_required?: boolean | null
          rating?: number | null
          teacher_id?: string | null
          title: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
          view_count?: number | null
        }
        Update: {
          age_appropriate?: boolean | null
          category_id?: string | null
          completion_count?: number | null
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          ethical_validation_status?: string | null
          has_audio?: boolean | null
          has_pictograms?: boolean | null
          has_sign_language?: boolean | null
          has_video?: boolean | null
          id?: string
          is_active?: boolean | null
          is_ai_assisted?: boolean | null
          is_certified?: boolean | null
          languages?: string[] | null
          parent_control_required?: boolean | null
          rating?: number | null
          teacher_id?: string | null
          title?: string
          updated_at?: string
          validated_at?: string | null
          validated_by?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "religious_courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "religious_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      school_post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "school_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      school_post_reactions: {
        Row: {
          created_at: string | null
          post_id: string
          reaction: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          post_id: string
          reaction: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          post_id?: string
          reaction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "school_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      school_posts: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_flagged: boolean | null
          language: string | null
          media: Json | null
          metadata: Json | null
          moderation_status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          view_count: number | null
          visibility: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          language?: string | null
          media?: Json | null
          metadata?: Json | null
          moderation_status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          view_count?: number | null
          visibility?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          language?: string | null
          media?: Json | null
          metadata?: Json | null
          moderation_status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          view_count?: number | null
          visibility?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          admin_id: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          qr_code: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          qr_code: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          qr_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schools_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      screen_share_sessions: {
        Row: {
          created_at: string
          description: string | null
          expires_at: string
          id: string
          is_active: boolean
          session_code: string
          title: string
          user_id: string
          viewer_count: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean
          session_code: string
          title: string
          user_id: string
          viewer_count?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean
          session_code?: string
          title?: string
          user_id?: string
          viewer_count?: number
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          anomaly_score: number | null
          created_at: string | null
          endpoint: string | null
          event_type: string
          http_method: string | null
          id: string
          is_blocked: boolean | null
          payload: Json | null
          response_time_ms: number | null
          source_ip: unknown
          status_code: number | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          anomaly_score?: number | null
          created_at?: string | null
          endpoint?: string | null
          event_type: string
          http_method?: string | null
          id?: string
          is_blocked?: boolean | null
          payload?: Json | null
          response_time_ms?: number | null
          source_ip?: unknown
          status_code?: number | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          anomaly_score?: number | null
          created_at?: string | null
          endpoint?: string | null
          event_type?: string
          http_method?: string | null
          id?: string
          is_blocked?: boolean | null
          payload?: Json | null
          response_time_ms?: number | null
          source_ip?: unknown
          status_code?: number | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_playbooks: {
        Row: {
          actions: Json | null
          auto_execute: boolean | null
          created_at: string | null
          description: string | null
          execution_count: number | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          name: string
          severity_threshold: string | null
          trigger_conditions: Json | null
        }
        Insert: {
          actions?: Json | null
          auto_execute?: boolean | null
          created_at?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name: string
          severity_threshold?: string | null
          trigger_conditions?: Json | null
        }
        Update: {
          actions?: Json | null
          auto_execute?: boolean | null
          created_at?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name?: string
          severity_threshold?: string | null
          trigger_conditions?: Json | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          status: string | null
          transaction_type: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          transaction_type: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          transaction_type?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          available_balance: number | null
          created_at: string | null
          id: string
          pending_balance: number | null
          total_balance: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available_balance?: number | null
          created_at?: string | null
          id?: string
          pending_balance?: number | null
          total_balance?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available_balance?: number | null
          created_at?: string | null
          id?: string
          pending_balance?: number | null
          total_balance?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_rankings: {
        Row: {
          category_slug: string
          country_code: string
          created_at: string | null
          id: string
          rank_position: number | null
          title: string | null
          total_likes: number | null
          total_posts: number | null
          total_score: number | null
          total_views: number | null
          updated_at: string | null
          user_id: string
          week_end: string
          week_start: string
        }
        Insert: {
          category_slug: string
          country_code: string
          created_at?: string | null
          id?: string
          rank_position?: number | null
          title?: string | null
          total_likes?: number | null
          total_posts?: number | null
          total_score?: number | null
          total_views?: number | null
          updated_at?: string | null
          user_id: string
          week_end: string
          week_start: string
        }
        Update: {
          category_slug?: string
          country_code?: string
          created_at?: string | null
          id?: string
          rank_position?: number | null
          title?: string | null
          total_likes?: number | null
          total_posts?: number | null
          total_score?: number | null
          total_views?: number | null
          updated_at?: string | null
          user_id?: string
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_block_account: { Args: { p_email: string }; Returns: Json }
      cleanup_security_data: { Args: never; Returns: undefined }
      credit_likes: {
        Args: { p_likes_amount: number; p_user_id: string }
        Returns: number
      }
      decrement_like_credit: {
        Args: { p_post_id: string; p_user_id: string }
        Returns: Json
      }
      get_current_user_role: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_school_admin: {
        Args: { _school_id: string; _user_id: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_action: string
          p_metadata?: Json
          p_resource_id?: string
          p_resource_type?: string
          p_user_id: string
        }
        Returns: undefined
      }
      validate_strong_password: {
        Args: { p_password: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "teacher"
        | "student"
        | "creche_admin"
        | "creche_staff"
        | "parent"
        | "ong_admin"
        | "ong_member"
      call_status: "pending" | "active" | "ended" | "missed" | "rejected"
      call_type: "ai" | "human"
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
      app_role: [
        "admin",
        "teacher",
        "student",
        "creche_admin",
        "creche_staff",
        "parent",
        "ong_admin",
        "ong_member",
      ],
      call_status: ["pending", "active", "ended", "missed", "rejected"],
      call_type: ["ai", "human"],
    },
  },
} as const

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
      articles: {
        Row: {
          banner_file_id: number | null
          content: string
          created_at: string
          draft: boolean
          id: number
          title: string
          updated_at: string
        }
        Insert: {
          banner_file_id?: number | null
          content?: string
          created_at?: string
          draft?: boolean
          id?: number
          title?: string
          updated_at?: string
        }
        Update: {
          banner_file_id?: number | null
          content?: string
          created_at?: string
          draft?: boolean
          id?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_articles_banner_file_id_fkey"
            columns: ["banner_file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
      constants: {
        Row: {
          id: Database["public"]["Enums"]["CONSTANT_ID"]
          value: string
        }
        Insert: {
          id: Database["public"]["Enums"]["CONSTANT_ID"]
          value?: string
        }
        Update: {
          id?: Database["public"]["Enums"]["CONSTANT_ID"]
          value?: string
        }
        Relationships: []
      }
      files: {
        Row: {
          description: string
          extension: string
          id: number
          uploaded_at: string
        }
        Insert: {
          description?: string
          extension: string
          id?: number
          uploaded_at?: string
        }
        Update: {
          description?: string
          extension?: string
          id?: number
          uploaded_at?: string
        }
        Relationships: []
      }
      leaders: {
        Row: {
          direction: boolean
          first_name: string
          headline: string
          id: number
          last_name: string
        }
        Insert: {
          direction?: boolean
          first_name: string
          headline: string
          id?: number
          last_name: string
        }
        Update: {
          direction?: boolean
          first_name?: string
          headline?: string
          id?: number
          last_name?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          id: number
          logo_file_id: number | null
          name: string
          url: string | null
        }
        Insert: {
          id?: number
          logo_file_id?: number | null
          name: string
          url?: string | null
        }
        Update: {
          id?: number
          logo_file_id?: number | null
          name?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_partners_logo_file_id_fkey"
            columns: ["logo_file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          avatar_file_id: number | null
          first_name: string
          id: number
          last_name: string
        }
        Insert: {
          avatar_file_id?: number | null
          first_name: string
          id?: number
          last_name: string
        }
        Update: {
          avatar_file_id?: number | null
          first_name?: string
          id?: number
          last_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_teachers_avatar_file_id_fkey"
            columns: ["avatar_file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          banner_file_id: number | null
          content: string
          created_at: string
          draft: boolean
          id: number
          title: string
          updated_at: string
        }
        Insert: {
          banner_file_id?: number | null
          content?: string
          created_at?: string
          draft?: boolean
          id?: number
          title?: string
          updated_at?: string
        }
        Update: {
          banner_file_id?: number | null
          content?: string
          created_at?: string
          draft?: boolean
          id?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_tournaments_banner_file_id_fkey"
            columns: ["banner_file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      CONSTANT_ID:
        | "TEACHING_DESCRIPTION"
        | "YOUTUBE_URL"
        | "FACEBOOK_URL"
        | "ADDRESS_LINE_1"
        | "ADDRESS_LINE_2"
        | "PHONE_NUMBER"
        | "CLUB_ID"
        | "CONTACT_EMAIL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

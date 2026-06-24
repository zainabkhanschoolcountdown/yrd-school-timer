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
      banned_devices: {
        Row: {
          banned_by: string | null
          created_at: string
          fingerprint: string
        }
        Insert: {
          banned_by?: string | null
          created_at?: string
          fingerprint: string
        }
        Update: {
          banned_by?: string | null
          created_at?: string
          fingerprint?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          author: string
          avatar: Json | null
          created_at: string
          id: string
          text: string
          user_id: string | null
        }
        Insert: {
          author: string
          avatar?: Json | null
          created_at?: string
          id?: string
          text: string
          user_id?: string | null
        }
        Update: {
          author?: string
          avatar?: Json | null
          created_at?: string
          id?: string
          text?: string
          user_id?: string | null
        }
        Relationships: []
      }
      device_fingerprints: {
        Row: {
          created_at: string
          fingerprint: string
          last_seen_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fingerprint: string
          last_seen_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fingerprint?: string
          last_seen_at?: string
          user_id?: string
        }
        Relationships: []
      }
      game_recommendations: {
        Row: {
          created_at: string
          game_name: string
          game_url: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_name: string
          game_url?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          game_name?: string
          game_url?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: Json
          created_at: string
          custom_end_date: string | null
          custom_holidays: Json
          grade: string
          school_board: string | null
          sound_enabled: boolean
          updated_at: string
          user_id: string
          username: string
          username_lower: string
        }
        Insert: {
          avatar?: Json
          created_at?: string
          custom_end_date?: string | null
          custom_holidays?: Json
          grade?: string
          school_board?: string | null
          sound_enabled?: boolean
          updated_at?: string
          user_id: string
          username: string
          username_lower: string
        }
        Update: {
          avatar?: Json
          created_at?: string
          custom_end_date?: string | null
          custom_holidays?: Json
          grade?: string
          school_board?: string | null
          sound_enabled?: boolean
          updated_at?: string
          user_id?: string
          username?: string
          username_lower?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: string
          username_lower: string
        }
        Insert: {
          created_at?: string
          role: string
          username_lower: string
        }
        Update: {
          created_at?: string
          role?: string
          username_lower?: string
        }
        Relationships: []
      }
      widgets: {
        Row: {
          created_at: string
          emoji: string
          id: string
          label: string
          url: string | null
        }
        Insert: {
          created_at?: string
          emoji?: string
          id?: string
          label: string
          url?: string | null
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          label?: string
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ban_user_devices: { Args: { _username: string }; Returns: number }
      current_username_lower: { Args: never; Returns: string }
      is_creator: { Args: never; Returns: boolean }
      user_has_role: { Args: { _role: string }; Returns: boolean }
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

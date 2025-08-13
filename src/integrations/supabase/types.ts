export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      daily_summaries: {
        Row: {
          created_at: string
          id: string
          summary_date: string
          total_calories_burned: number | null
          total_calories_consumed: number | null
          total_carbs_g: number | null
          total_fat_g: number | null
          total_protein_g: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          summary_date?: string
          total_calories_burned?: number | null
          total_calories_consumed?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_protein_g?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          summary_date?: string
          total_calories_burned?: number | null
          total_calories_consumed?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_protein_g?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number
          carbs_g: number | null
          created_at: string
          fat_g: number | null
          id: string
          meal_time: string
          meal_type: string | null
          name: string
          protein_g: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories?: number
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          id?: string
          meal_time?: string
          meal_type?: string | null
          name: string
          protein_g?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          id?: string
          meal_time?: string
          meal_type?: string | null
          name?: string
          protein_g?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: Database["public"]["Enums"]["activity_level"] | null
          age: number | null
          created_at: string
          daily_calorie_goal: number | null
          display_name: string | null
          fitness_goal: Database["public"]["Enums"]["fitness_goal"] | null
          gender: Database["public"]["Enums"]["gender"] | null
          height_cm: number | null
          id: string
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          age?: number | null
          created_at?: string
          daily_calorie_goal?: number | null
          display_name?: string | null
          fitness_goal?: Database["public"]["Enums"]["fitness_goal"] | null
          gender?: Database["public"]["Enums"]["gender"] | null
          height_cm?: number | null
          id?: string
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          age?: number | null
          created_at?: string
          daily_calorie_goal?: number | null
          display_name?: string | null
          fitness_goal?: Database["public"]["Enums"]["fitness_goal"] | null
          gender?: Database["public"]["Enums"]["gender"] | null
          height_cm?: number | null
          id?: string
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      weight_logs: {
        Row: {
          created_at: string
          id: string
          log_date: string
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: string
          log_date?: string
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
      workouts: {
        Row: {
          calories_burned: number
          created_at: string
          duration_minutes: number
          id: string
          name: string
          notes: string | null
          updated_at: string
          user_id: string
          workout_date: string
          workout_type: string | null
        }
        Insert: {
          calories_burned?: number
          created_at?: string
          duration_minutes?: number
          id?: string
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
          workout_date?: string
          workout_type?: string | null
        }
        Update: {
          calories_burned?: number
          created_at?: string
          duration_minutes?: number
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          workout_date?: string
          workout_type?: string | null
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
      activity_level:
        | "sedentary"
        | "lightly_active"
        | "moderately_active"
        | "very_active"
        | "extremely_active"
      fitness_goal: "lose_weight" | "maintain_weight" | "gain_weight"
      gender: "male" | "female" | "other"
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
      activity_level: [
        "sedentary",
        "lightly_active",
        "moderately_active",
        "very_active",
        "extremely_active",
      ],
      fitness_goal: ["lose_weight", "maintain_weight", "gain_weight"],
      gender: ["male", "female", "other"],
    },
  },
} as const

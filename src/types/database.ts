// src/types/database.ts
// ─────────────────────────────────────────────────────────────────────────────
// DATABASE TYPE DEFINITIONS
// Mirrors the Supabase PostgreSQL schema defined in supabase/migrations/
// ─────────────────────────────────────────────────────────────────────────────

export type DayStatus = 'not_started' | 'in_progress' | 'completed'

export interface UserProfile {
  id: string
  display_name: string | null
  created_at: string
  updated_at: string
}

export interface UserDayProgress {
  id: string
  user_id: string
  day_number: number
  status: DayStatus
  completed_tasks: number[]
  updated_at: string
}

export interface UserDayNotes {
  id: string
  user_id: string
  day_number: number
  notes_markdown: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile
        Insert: {
          id: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_day_progress: {
        Row: UserDayProgress
        Insert: {
          id?: string
          user_id: string
          day_number: number
          status: DayStatus
          completed_tasks?: number[]
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          day_number?: number
          status?: DayStatus
          completed_tasks?: number[]
          updated_at?: string
        }
        Relationships: []
      }
      user_day_notes: {
        Row: UserDayNotes
        Insert: {
          id?: string
          user_id: string
          day_number: number
          notes_markdown?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          day_number?: number
          notes_markdown?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      day_status: DayStatus
    }
    CompositeTypes: Record<string, never>
  }
}

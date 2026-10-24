// src/lib/supabase.ts
// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CLIENT INITIALIZATION
// Gracefully handles missing environment variables in local development.
// Never exposes service-role keys.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
)?.trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabasePublishableKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-ref') &&
    supabasePublishableKey !== 'your-publishable-key-here' &&
    supabasePublishableKey.length > 10
)

// Safe client during local development or when credentials are not yet supplied
// Prevents the public learning website from breaking or crashing
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient(
      'https://placeholder-project.supabase.co',
      'placeholder-anon-key-for-local-development',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )

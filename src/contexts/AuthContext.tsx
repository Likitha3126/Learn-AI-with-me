// src/contexts/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// USER AUTHENTICATION CONTEXT (Supabase Auth)
// Provides authentication state, sign in/up/out methods, profile fetching,
// and session persistence.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { UserProfile } from '../types/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  isConfigured: boolean
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: AuthError | null; user: User | null; session: Session | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithOtp: (email: string, options?: { redirectTo?: string; shouldCreateUser?: boolean }) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>
  resendVerificationEmail: (email: string) => Promise<{ error: AuthError | null }>
  deleteAccount: () => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured)

  // Keep a ref to the current user so fetchProfile doesn't need `user` in its
  // dependency array. If we included `user` there, fetchProfile would be
  // recreated on every auth-state change, which would re-trigger the effect
  // that calls supabase.auth.onAuthStateChange — registering a new listener
  // on every render (listener leak).
  const userRef = useRef<User | null>(null)

  const fetchProfile = useCallback(async (userId: string, userMeta?: Record<string, unknown>) => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (!error && data) {
        setProfile(data as UserProfile)
      } else {
        // Fallback profile if the DB trigger is still executing
        setProfile({
          id: userId,
          display_name: (userMeta?.display_name as string) ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    } catch {
      // ignore
    }
  }, []) // Stable reference — no deps that change on auth events

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    let isMounted = true

    // Initial session retrieval — runs once on mount.
    // We set loading=true (already the initial value) and only clear it after
    // the session is known. This prevents a flash where components assume
    // "not authenticated" before the async check has completed.
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted) return
      const currentUser = currentSession?.user ?? null
      userRef.current = currentUser
      setSession(currentSession)
      setUser(currentUser)
      if (currentUser) {
        fetchProfile(currentUser.id, currentUser.user_metadata)
      }
      setLoading(false)
    }).catch(() => {
      if (isMounted) setLoading(false)
    })

    // Listen to auth state changes — subscribed exactly once.
    // fetchProfile is stable (no deps), so this effect only runs once.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return
      const newUser = newSession?.user ?? null
      userRef.current = newUser
      setSession(newSession)
      setUser(newUser)
      if (newUser) {
        fetchProfile(newUser.id, newUser.user_metadata)
      } else {
        setProfile(null)
      }
      // Only set loading false here if it's still true (covers race between
      // INITIAL_SESSION event and the getSession() promise above)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile]) // fetchProfile is stable — this effect runs exactly once

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      if (!isSupabaseConfigured) {
        return {
          error: {
            name: 'ConfigurationError',
            message: 'Supabase credentials are not configured in environment variables.',
          } as AuthError,
          user: null,
          session: null,
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName?.trim() || splitEmail(email),
          },
        },
      })

      // Do NOT manually call setUser/setSession here.
      // onAuthStateChange fires automatically when Supabase sets the session,
      // and doing it manually here causes a race condition double-set.

      return { error, user: data.user, session: data.session }
    },
    []
  )

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in environment variables.',
        } as AuthError,
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // Do NOT manually call setUser/setSession here.
    // onAuthStateChange fires on successful sign-in and handles state updates.

    return { error }
  }, [])

  const signInWithOtp = useCallback(
    async (
      email: string,
      options?: { redirectTo?: string; shouldCreateUser?: boolean }
    ) => {
      if (!isSupabaseConfigured) {
        return {
          error: {
            name: 'ConfigurationError',
            message: 'Supabase credentials are not configured in environment variables.',
          } as AuthError,
        }
      }

      // Configure the redirect URL dynamically using current application origin
      const targetDestination = options?.redirectTo || '/account'
      const redirectUrl = `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
        targetDestination
      )}`

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: redirectUrl,
          // Prevent accidental duplicate account creations from the sign-in page
          shouldCreateUser: options?.shouldCreateUser ?? false,
        },
      })

      return { error }
    },
    []
  )

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setSession(null)
    setProfile(null)
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in environment variables.',
        } as AuthError,
      }
    }

    const redirectUrl = `${window.location.origin}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    return { error }
  }, [])

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured.',
        } as AuthError,
      }
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    return { error }
  }, [])

  const resendVerificationEmail = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured.',
        } as AuthError,
      }
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    return { error }
  }, [])

  const deleteAccount = useCallback(async () => {
    const currentUser = userRef.current
    if (!currentUser || !isSupabaseConfigured) {
      return { error: new Error('User not authenticated') }
    }

    try {
      // Delete user_profiles row (cascades to user_day_progress and user_day_notes
      // via ON DELETE CASCADE foreign keys defined in the migration).
      // Note: This removes the profile data. The auth.users record itself
      // requires a server-side admin action (service role) to delete permanently.
      // Signing out here prevents re-login without email, but the auth record
      // persists in Supabase Auth — a full deletion requires a Supabase Edge
      // Function with the admin client (see README for instructions).
      await supabase.from('user_profiles').delete().eq('id', currentUser.id)
      await signOut()
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }, [signOut])

  const refreshProfile = useCallback(async () => {
    const currentUser = userRef.current
    if (currentUser) {
      await fetchProfile(currentUser.id, currentUser.user_metadata)
    }
  }, [fetchProfile])

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      isConfigured: isSupabaseConfigured,
      signUp,
      signIn,
      signInWithOtp,
      signOut,
      resetPassword,
      updatePassword,
      resendVerificationEmail,
      deleteAccount,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signInWithOtp,
      signOut,
      resetPassword,
      updatePassword,
      resendVerificationEmail,
      deleteAccount,
      refreshProfile,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const defaultAuthContext: AuthContextType = {
  user: null,
  session: null,
  profile: null,
  loading: false,
  isConfigured: false,
  signUp: async () => ({ error: null, user: null, session: null }),
  signIn: async () => ({ error: null }),
  signInWithOtp: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  resendVerificationEmail: async () => ({ error: null }),
  deleteAccount: async () => ({ error: null }),
  refreshProfile: async () => {},
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context ?? defaultAuthContext
}

function splitEmail(email: string): string {
  return email.split('@')[0] || 'Learner'
}

// src/contexts/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// USER AUTHENTICATION CONTEXT (Supabase Auth)
// Provides authentication state, sign in/up/out methods, profile fetching,
// and session persistence.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
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

  const fetchProfile = useCallback(async (userId: string) => {
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
        // Fallback profile if row trigger is still executing
        setProfile({
          id: userId,
          display_name: user?.user_metadata?.display_name ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    } catch {
      // ignore
    }
  }, [user])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    let isMounted = true

    // Initial session retrieval
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted) return
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id)
      }
      setLoading(false)
    }).catch(() => {
      if (isMounted) setLoading(false)
    })

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession?.user) {
        fetchProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

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

      if (data.user && !error) {
        if (data.session) {
          setUser(data.user)
          setSession(data.session)
        }
      }

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (data.user && !error) {
      setUser(data.user)
      setSession(data.session)
    }

    return { error }
  }, [])

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
    if (!user || !isSupabaseConfigured) {
      return { error: new Error('User not authenticated') }
    }

    try {
      // In Supabase client, deleting user data cascades across user_profiles, user_day_progress, and user_day_notes
      await supabase.from('user_profiles').delete().eq('id', user.id)
      await signOut()
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }, [user, signOut])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      isConfigured: isSupabaseConfigured,
      signUp,
      signIn,
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

// src/pages/AuthCallbackPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION CALLBACK HANDLER
// Verifies OTP/magic link tokens, exchanges PKCE codes, handles errors
// (expired, invalid, denied), restores the Supabase session, and redirects
// cleanly to the intended destination.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, CheckCircle2, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { session, user, isConfigured } = useAuth()

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<'expired' | 'invalid' | 'network' | 'general'>('general')

  const processedRef = useRef(false)
  const redirectTo = searchParams.get('redirectTo') || '/account'

  useEffect(() => {
    // If user is already authenticated, redirect immediately
    if (user || session) {
      setStatus('success')
      cleanUrlAndRedirect(redirectTo)
      return
    }

    if (!isConfigured) {
      setStatus('error')
      setErrorType('general')
      setErrorMessage('Supabase authentication is not configured in environment variables.')
      return
    }

    // Prevent duplicate processing in React StrictMode
    if (processedRef.current) return
    processedRef.current = true

    const verifyCallback = async () => {
      try {
        // Parse parameters from location (supports both BrowserRouter and MemoryRouter)
        const searchStr = location.search || (typeof window !== 'undefined' ? window.location.search : '')
        const hashStr = location.hash || (typeof window !== 'undefined' ? window.location.hash : '')

        const queryParams = new URLSearchParams(searchStr)
        const rawHash = hashStr.startsWith('#') ? hashStr.slice(1) : hashStr
        const hashParams = new URLSearchParams(rawHash)

        const error = queryParams.get('error') || hashParams.get('error')
        const errorCode = queryParams.get('error_code') || hashParams.get('error_code')
        const errorDesc =
          queryParams.get('error_description') || hashParams.get('error_description')

        // 1. Check for errors returned by Supabase Auth server
        if (error || errorCode || errorDesc) {
          setStatus('error')
          if (errorCode === 'otp_expired' || errorDesc?.toLowerCase().includes('expired')) {
            setErrorType('expired')
            setErrorMessage(
              'This magic link has expired or has already been used. For security, magic links can only be used once.'
            )
          } else if (
            error === 'access_denied' ||
            errorCode === 'access_denied' ||
            errorDesc?.toLowerCase().includes('invalid')
          ) {
            setErrorType('invalid')
            setErrorMessage(
              errorDesc
                ? decodeURIComponent(errorDesc.replace(/\+/g, ' '))
                : 'The sign-in link is invalid or incomplete. Please request a new link.'
            )
          } else {
            setErrorType('general')
            setErrorMessage(
              errorDesc
                ? decodeURIComponent(errorDesc.replace(/\+/g, ' '))
                : 'Authentication link verification failed. Please try signing in again.'
            )
          }
          return
        }

        // 2. Check for PKCE auth code
        const code = queryParams.get('code')
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            setStatus('error')
            const msg = exchangeError.message.toLowerCase()
            if (msg.includes('expired') || msg.includes('already been used') || msg.includes('invalid')) {
              setErrorType('expired')
              setErrorMessage('This sign-in link has expired or has already been redeemed. Please request a new one.')
            } else {
              setErrorType('network')
              setErrorMessage(exchangeError.message)
            }
            return
          }

          if (data.session) {
            setStatus('success')
            cleanUrlAndRedirect(redirectTo)
            return
          }
        }

        // 3. Check for implicit hash session or existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          setStatus('error')
          setErrorType('general')
          setErrorMessage(sessionError.message)
          return
        }

        if (sessionData?.session) {
          setStatus('success')
          cleanUrlAndRedirect(redirectTo)
          return
        }

        // 4. Wait for potential asynchronous onAuthStateChange token extraction
        const timeoutId = setTimeout(async () => {
          const { data: retryData } = await supabase.auth.getSession()
          if (retryData?.session) {
            setStatus('success')
            cleanUrlAndRedirect(redirectTo)
          } else {
            setStatus('error')
            setErrorType('expired')
            setErrorMessage('Unable to restore session. The link may have expired or is no longer valid.')
          }
        }, 3000)

        return () => clearTimeout(timeoutId)
      } catch (err) {
        setStatus('error')
        setErrorType('network')
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'A network error occurred while verifying your sign-in link.'
        )
      }
    }

    verifyCallback()
  }, [user, session, isConfigured, location, redirectTo])

  const cleanUrlAndRedirect = (destination: string) => {
    // Strip hash tokens and auth query parameters from browser URL bar and history
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      window.history.replaceState(null, document.title, window.location.pathname)
    }
    // Navigate smoothly to target destination
    navigate(destination, { replace: true })
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-20 text-center">
      {status === 'verifying' && (
        <div className="space-y-4">
          <div className="inline-block animate-spin rounded-full h-9 w-9 border-2 border-solid border-[color:var(--color-sage)] border-r-transparent" />
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--color-charcoal)' }}>
            Verifying your sign-in link…
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-charcoal-muted)' }}>
            Please wait while we restore your authenticated session.
          </p>
        </div>
      )}

      {status === 'success' && (
        <div
          className="rounded border p-6 text-center space-y-3"
          style={{
            borderColor: 'var(--color-sage-border)',
            backgroundColor: 'var(--color-sage-pale)',
          }}
        >
          <CheckCircle2 size={36} className="mx-auto" style={{ color: 'var(--color-sage)' }} />
          <h2 className="font-serif text-xl font-semibold" style={{ color: 'var(--color-charcoal)' }}>
            Authentication successful!
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-charcoal-muted)' }}>
            Redirecting you to your account…
          </p>
          <Link
            to={redirectTo}
            className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline pt-2"
            style={{ color: 'var(--color-sage)' }}
          >
            Continue immediately <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div
          className="rounded border p-6 text-left space-y-4"
          style={{
            borderColor: 'var(--color-ivory-border)',
            backgroundColor: 'white',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--color-red-pale)', color: '#b91c1c' }}
            >
              <AlertCircle size={22} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold" style={{ color: 'var(--color-charcoal)' }}>
                {errorType === 'expired'
                  ? 'Sign-in link expired'
                  : errorType === 'invalid'
                  ? 'Invalid sign-in link'
                  : 'Authentication error'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-charcoal-muted)' }}>
                {errorType === 'expired'
                  ? 'Magic links can only be used once and expire shortly after sending.'
                  : 'We could not sign you in with this link.'}
              </p>
            </div>
          </div>

          <div
            className="p-3 rounded text-xs leading-relaxed text-red-800"
            style={{ backgroundColor: 'var(--color-red-pale)' }}
            role="alert"
          >
            {errorMessage || 'Unable to authenticate. Please request a new magic link.'}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Link
              to={`/signin?mode=magic-link&redirectTo=${encodeURIComponent(redirectTo)}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded text-xs font-medium transition-colors"
              style={{ backgroundColor: 'var(--color-charcoal)', color: 'white' }}
            >
              <Mail size={13} />
              Request new link
            </Link>
            <Link
              to={`/signin?redirectTo=${encodeURIComponent(redirectTo)}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded border text-xs font-medium transition-colors"
              style={{
                borderColor: 'var(--color-ivory-border)',
                color: 'var(--color-charcoal)',
                backgroundColor: 'var(--color-ivory)',
              }}
            >
              Sign in with password
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// src/pages/SignInPage.tsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, AlertCircle, Info, Lock, Mail, RefreshCw, Check, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function SignInPage() {
  const { signIn, signInWithOtp, isConfigured, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/account'

  // Redirect to destination if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate(redirectTo, { replace: true })
    }
  }, [user, authLoading, navigate, redirectTo])

  // Authentication mode: 'password' (default) or 'magic-link' (passwordless)
  const [authMode, setAuthMode] = useState<'password' | 'magic-link'>(() => {
    return searchParams.get('mode') === 'magic-link' ? 'magic-link' : 'password'
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Magic link confirmation & resend states
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  // Check URL parameters for authentication errors redirected from Supabase
  useEffect(() => {
    const errorCode = searchParams.get('error_code')
    const errorDescription = searchParams.get('error_description')
    if (errorCode === 'otp_expired' || errorDescription?.toLowerCase().includes('expired')) {
      setError('Your sign-in link has expired or has already been used. Please request a new link.')
      setAuthMode('magic-link')
    } else if (errorDescription) {
      setError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')))
    }
  }, [searchParams])

  // Cooldown countdown effect
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // 1. Password sign-in handler
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both your email and password.')
      return
    }

    setSubmitting(true)
    setError(null)

    const { error: signInError } = await signIn(email, password)
    setSubmitting(false)

    if (signInError) {
      setError(signInError.message)
    } else {
      navigate(redirectTo, { replace: true })
    }
  }

  // 2. Passwordless magic link handler
  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Please enter your email address.')
      return
    }

    setSubmitting(true)
    setError(null)

    // shouldCreateUser: false prevents duplicate/unintended account creation from sign-in
    const { error: otpError } = await signInWithOtp(trimmedEmail, {
      redirectTo,
      shouldCreateUser: false,
    })
    setSubmitting(false)

    if (otpError) {
      const msg = otpError.message.toLowerCase()
      if (
        msg.includes('signups not allowed') ||
        msg.includes('user not found') ||
        (otpError.status === 400 && msg.includes('signup'))
      ) {
        setError('No account found with this email address. Please create an account first.')
      } else if (msg.includes('fetch') || msg.includes('network')) {
        setError('Network connection failed. Please check your internet connection and try again.')
      } else if (msg.includes('rate limit') || msg.includes('too many requests')) {
        setError('Too many requests. Please wait a minute before requesting another link.')
      } else {
        setError(otpError.message)
      }
    } else {
      setMagicLinkSent(true)
      setCooldown(60)
    }
  }

  // 3. Resend magic link handler
  const handleResendMagicLink = async () => {
    if (cooldown > 0 || resending || !email.trim()) return
    setResending(true)
    setResendError(null)
    setResendSuccess(null)

    const { error: resendErr } = await signInWithOtp(email.trim(), {
      redirectTo,
      shouldCreateUser: false,
    })
    setResending(false)

    if (resendErr) {
      setResendError(resendErr.message)
    } else {
      setResendSuccess('A fresh magic link has been sent. Please check your inbox.')
      setCooldown(60)
    }
  }

  // Render Magic Link Sent Confirmation Screen
  if (magicLinkSent) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm"
          style={{ backgroundColor: 'var(--color-sage-pale)', color: 'var(--color-sage)' }}
        >
          <Mail size={26} aria-hidden="true" />
        </div>

        <p className="text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-sage)' }}>
          Magic link dispatched
        </p>

        <h1 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--color-charcoal)' }}>
          Check your inbox!
        </h1>

        <div
          className="rounded border p-6 text-left mb-6 space-y-4"
          style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
            We've sent a passwordless sign-in link to{' '}
            <strong className="font-semibold break-all" style={{ color: 'var(--color-charcoal)' }}>
              {email}
            </strong>
            . Open the link in that email to sign in immediately.
          </p>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
            Can't find the email? Be sure to check your spam or junk folder, or request another link below.
          </p>

          {resendSuccess && (
            <div
              className="p-3 rounded text-xs flex items-start gap-2"
              style={{ backgroundColor: 'var(--color-sage-pale)', color: 'var(--color-sage)' }}
              role="status"
            >
              <Check size={14} className="flex-shrink-0 mt-0.5" />
              <span>{resendSuccess}</span>
            </div>
          )}

          {resendError && (
            <div
              className="p-3 rounded text-xs flex items-start gap-2 text-red-700"
              style={{ backgroundColor: 'var(--color-red-pale)' }}
              role="alert"
            >
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{resendError}</span>
            </div>
          )}

          <div
            className="pt-3 border-t flex items-center justify-between gap-3"
            style={{ borderColor: 'var(--color-ivory-border)' }}
          >
            <button
              type="button"
              onClick={handleResendMagicLink}
              disabled={resending || cooldown > 0}
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{
                color: cooldown > 0 || resending ? 'var(--color-text-tertiary)' : 'var(--color-sage)',
                cursor: cooldown > 0 || resending ? 'not-allowed' : 'pointer',
              }}
            >
              <RefreshCw size={12} className={resending ? 'animate-spin' : ''} />
              {resending
                ? 'Resending sign-in link…'
                : cooldown > 0
                ? `Resend available in ${cooldown}s`
                : 'Resend magic link'}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              setMagicLinkSent(false)
              setAuthMode('password')
              setError(null)
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors border"
            style={{
              borderColor: 'var(--color-ivory-border)',
              backgroundColor: 'white',
              color: 'var(--color-charcoal)',
            }}
          >
            Use password instead
          </button>
          <button
            type="button"
            onClick={() => {
              setMagicLinkSent(false)
              setError(null)
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-charcoal)', color: 'white' }}
          >
            Try another email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center mb-8">
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--color-sage)' }}>
          Account access
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: 'var(--color-charcoal)' }}>
          Welcome back
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-charcoal-muted)' }}>
          Sign in to access your synchronized progress and personal study notes across devices.
        </p>
      </div>

      {!isConfigured && (
        <div
          className="rounded border p-4 mb-6 text-sm"
          style={{
            borderColor: 'var(--color-amber)',
            backgroundColor: 'var(--color-amber-pale)',
            color: 'var(--color-charcoal)',
          }}
        >
          <div className="flex items-start gap-2.5">
            <Info size={18} className="flex-shrink-0 mt-0.5 text-amber-700" />
            <div>
              <p className="font-medium text-amber-900">Supabase Not Configured</p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Cloud authentication requires Supabase environment variables (<code className="font-mono">VITE_SUPABASE_URL</code> and <code className="font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</code>). You can still browse all 70 lessons and save study notes locally in your browser.
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="rounded border p-6 sm:p-8 space-y-5"
        style={{
          borderColor: 'var(--color-ivory-border)',
          backgroundColor: 'white',
        }}
      >
        {/* Method Toggle Tabs */}
        <div
          className="flex border-b pb-1 gap-6"
          style={{ borderColor: 'var(--color-ivory-border)' }}
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={authMode === 'password'}
            onClick={() => {
              setAuthMode('password')
              setError(null)
            }}
            className={`pb-2 text-xs font-medium transition-colors border-b-2 -mb-[5px] ${
              authMode === 'password'
                ? 'border-[color:var(--color-charcoal)] text-[color:var(--color-charcoal)] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={authMode === 'magic-link'}
            onClick={() => {
              setAuthMode('magic-link')
              setError(null)
            }}
            className={`pb-2 text-xs font-medium transition-colors border-b-2 -mb-[5px] flex items-center gap-1.5 ${
              authMode === 'magic-link'
                ? 'border-[color:var(--color-charcoal)] text-[color:var(--color-charcoal)] font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles size={12} className={authMode === 'magic-link' ? 'text-amber-500' : 'text-gray-400'} />
            Email Link (Passwordless)
          </button>
        </div>

        {error && (
          <div
            className="flex items-start gap-2 p-3 rounded text-xs text-red-700"
            style={{ backgroundColor: 'var(--color-red-pale)' }}
            role="alert"
          >
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {authMode === 'password' ? (
          /* Password Authentication Form */
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="signin-email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded border outline-none transition-colors"
                  style={{
                    borderColor: 'var(--color-ivory-border)',
                    backgroundColor: 'var(--color-ivory)',
                    color: 'var(--color-charcoal)',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="signin-password"
                  className="block text-xs font-medium"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs hover:underline"
                  style={{ color: 'var(--color-sage)' }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded border outline-none transition-colors"
                  style={{
                    borderColor: 'var(--color-ivory-border)',
                    backgroundColor: 'var(--color-ivory)',
                    color: 'var(--color-charcoal)',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-charcoal)',
                color: 'white',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
              <ArrowRight size={14} />
            </button>

            {/* "Continue with email link" option */}
            <div className="relative my-4 pt-2">
              <div className="absolute inset-0 flex items-center pt-2">
                <div className="w-full border-t" style={{ borderColor: 'var(--color-ivory-border)' }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-400">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setAuthMode('magic-link')
                setError(null)
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded border text-sm font-medium transition-colors"
              style={{
                borderColor: 'var(--color-ivory-border)',
                backgroundColor: 'var(--color-ivory)',
                color: 'var(--color-charcoal)',
              }}
            >
              <Mail size={15} style={{ color: 'var(--color-sage)' }} />
              Continue with email link
            </button>
          </form>
        ) : (
          /* Passwordless Magic Link Form */
          <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
              Enter your email address and we'll send you a secure magic link to sign in instantly without typing a password.
            </p>

            <div>
              <label
                htmlFor="magiclink-email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="magiclink-email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={submitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded border outline-none transition-colors"
                  style={{
                    borderColor: 'var(--color-ivory-border)',
                    backgroundColor: 'var(--color-ivory)',
                    color: 'var(--color-charcoal)',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-charcoal)',
                color: 'white',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Sending link…' : 'Send Magic Link'}
              <ArrowRight size={14} />
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('password')
                  setError(null)
                }}
                className="text-xs hover:underline inline-flex items-center gap-1"
                style={{ color: 'var(--color-sage)' }}
              >
                Sign in with password instead
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="text-center text-xs mt-6" style={{ color: 'var(--color-text-secondary)' }}>
        Don’t have an account yet?{' '}
        <Link
          to={`/signup?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="font-medium underline hover:text-[color:var(--color-charcoal)]"
          style={{ color: 'var(--color-sage)' }}
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}

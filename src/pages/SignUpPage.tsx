// src/pages/SignUpPage.tsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, AlertCircle, Info, Lock, Mail, User as UserIcon, Check, RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function SignUpPage() {
  const { signUp, resendVerificationEmail, isConfigured, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/account'

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationSent, setConfirmationSent] = useState(false)

  // Redirect to destination if already authenticated
  useEffect(() => {
    if (!authLoading && user && !confirmationSent) {
      navigate(redirectTo, { replace: true })
    }
  }, [user, authLoading, confirmationSent, navigate, redirectTo])

  // Resend confirmation email state
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleResend = async () => {
    if (cooldown > 0 || resending || !email) return
    setResending(true)
    setResendError(null)
    setResendSuccess(null)

    const { error: resendErr } = await resendVerificationEmail(email)
    setResending(false)

    if (resendErr) {
      setResendError(resendErr.message)
    } else {
      setResendSuccess('A fresh confirmation link has been sent. Please check your inbox.')
      setCooldown(60)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    if (!email || !password) {
      setError('Please provide both an email and a password.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setSubmitting(true)
    setError(null)

    const { error: signUpError, user: newUser, session: newSession } = await signUp(email, password, displayName)
    setSubmitting(false)

    if (signUpError) {
      setError(signUpError.message)
    } else if (newUser && newUser.identities && newUser.identities.length === 0) {
      setError('An account with this email address already exists. Please sign in.')
    } else if (newUser) {
      // If email confirmation is enabled, session is null or confirmed_at is null
      if (!newSession || !newUser.confirmed_at) {
        setConfirmationSent(true)
      } else {
        navigate(redirectTo, { replace: true })
      }
    } else {
      setError('Unable to create account. Please check your network and try again.')
    }
  }

  if (confirmationSent) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm"
          style={{ backgroundColor: 'var(--color-sage-pale)', color: 'var(--color-sage)' }}
        >
          <Mail size={26} aria-hidden="true" />
        </div>

        <p className="text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-sage)' }}>
          Confirmation link sent
        </p>

        <h1 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--color-charcoal)' }}>
          Check your inbox!
        </h1>

        <div
          className="rounded border p-6 text-left mb-6 space-y-4"
          style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
            We've sent a confirmation email to <strong className="font-semibold break-all" style={{ color: 'var(--color-charcoal)' }}>{email}</strong>. Open that email and click the confirmation link to activate your account. Once confirmed, return here and sign in.
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
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{
                color: cooldown > 0 || resending ? 'var(--color-text-tertiary)' : 'var(--color-sage)',
                cursor: cooldown > 0 || resending ? 'not-allowed' : 'pointer',
              }}
            >
              <RefreshCw size={12} className={resending ? 'animate-spin' : ''} />
              {resending
                ? 'Resending confirmation email…'
                : cooldown > 0
                ? `Resend available in ${cooldown}s`
                : 'Resend confirmation email'}
            </button>
          </div>
        </div>

        <Link
          to={`/signin?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded text-sm font-medium transition-colors shadow-sm"
          style={{ backgroundColor: 'var(--color-charcoal)', color: 'white' }}
        >
          Back to Sign In
          <ArrowRight size={14} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="text-center mb-8">
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--color-sage)' }}>
          Join the challenge
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: 'var(--color-charcoal)' }}>
          Create your account
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-charcoal-muted)' }}>
          Sync your learning progress across devices and maintain private daily study notes.
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
                Cloud sign-up requires Supabase credentials in your <code className="font-mono">.env</code> file.
                In local mode, all lessons and notes function in your browser without requiring an account.
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded border p-6 sm:p-8 space-y-4"
        style={{
          borderColor: 'var(--color-ivory-border)',
          backgroundColor: 'white',
        }}
      >
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

        <div>
          <label
            htmlFor="signup-name"
            className="block text-xs font-medium mb-1.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Your name or handle (optional)
          </label>
          <div className="relative">
            <UserIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              disabled={submitting}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex"
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
          <label
            htmlFor="signup-email"
            className="block text-xs font-medium mb-1.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Email address
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="signup-email"
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

        <div>
          <label
            htmlFor="signup-password"
            className="block text-xs font-medium mb-1.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Password
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              disabled={submitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full pl-9 pr-3 py-2 text-sm rounded border outline-none transition-colors"
              style={{
                borderColor: 'var(--color-ivory-border)',
                backgroundColor: 'var(--color-ivory)',
                color: 'var(--color-charcoal)',
              }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            Must be at least 6 characters.
          </p>
        </div>

        <div className="pt-2">
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
            {submitting ? 'Creating account…' : 'Create Account'}
            <ArrowRight size={14} />
          </button>
        </div>

        <ul className="pt-3 border-t text-xs space-y-1" style={{ borderColor: 'var(--color-ivory-border)', color: 'var(--color-text-tertiary)' }}>
          <li className="flex items-center gap-1.5">
            <Check size={12} style={{ color: 'var(--color-sage)' }} /> All 70 curriculum days remain free to explore
          </li>
          <li className="flex items-center gap-1.5">
            <Check size={12} style={{ color: 'var(--color-sage)' }} /> Personal notes remain private with strict Row Level Security
          </li>
          <li className="flex items-center gap-1.5">
            <Check size={12} style={{ color: 'var(--color-sage)' }} /> No spam or unwanted promotional emails
          </li>
        </ul>
      </form>

      <p className="text-center text-xs mt-6" style={{ color: 'var(--color-text-secondary)' }}>
        Already have an account?{' '}
        <Link
          to={`/signin?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="font-medium underline hover:text-[color:var(--color-charcoal)]"
          style={{ color: 'var(--color-sage)' }}
        >
          Sign in here
        </Link>
      </p>
    </div>
  )
}

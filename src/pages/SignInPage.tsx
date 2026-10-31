// src/pages/SignInPage.tsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, AlertCircle, Info, Lock, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function SignInPage() {
  const { signIn, isConfigured, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/account'

  // Redirect to destination if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate(redirectTo, { replace: true })
    }
  }, [user, authLoading, navigate, redirectTo])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
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
      </form>

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

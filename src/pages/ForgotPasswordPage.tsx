// src/pages/ForgotPasswordPage.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function ForgotPasswordPage() {
  const { resetPassword, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your account email.')
      return
    }

    setSubmitting(true)
    setError(null)

    const { error: resetError } = await resetPassword(email)
    setSubmitting(false)

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-8">
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--color-sage)' }}>
          Password recovery
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: 'var(--color-charcoal)' }}>
          Reset your password
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-charcoal-muted)' }}>
          Enter the email associated with your account, and we’ll send you a password reset link.
        </p>
      </div>

      {success ? (
        <div
          className="rounded border p-6 text-center space-y-4"
          style={{
            borderColor: 'var(--color-sage-border)',
            backgroundColor: 'var(--color-sage-pale)',
          }}
        >
          <CheckCircle2 size={32} className="mx-auto" style={{ color: 'var(--color-sage)' }} />
          <h2 className="font-serif text-lg font-semibold" style={{ color: 'var(--color-charcoal)' }}>
            Reset link dispatched
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
            If an account exists for <strong className="font-medium">{email}</strong>, you will receive an email shortly with instructions to choose a new password.
          </p>
          <div className="pt-2">
            <Link
              to="/signin"
              className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline"
              style={{ color: 'var(--color-sage)' }}
            >
              <ArrowLeft size={12} /> Back to sign in
            </Link>
          </div>
        </div>
      ) : (
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

          {!isConfigured && (
            <div className="p-3 rounded text-xs text-amber-800" style={{ backgroundColor: 'var(--color-amber-pale)' }}>
              Supabase credentials are not configured. Password reset is not available in local mode.
            </div>
          )}

          <div>
            <label
              htmlFor="forgot-email"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Email address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="forgot-email"
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
            {submitting ? 'Sending instructions…' : 'Send reset link'}
            <ArrowRight size={14} />
          </button>

          <div className="text-center pt-2">
            <Link
              to="/signin"
              className="inline-flex items-center gap-1 text-xs hover:underline"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <ArrowLeft size={12} /> Return to sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}

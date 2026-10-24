// src/pages/ResetPasswordPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, AlertCircle, CheckCircle2, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    setError(null)

    const { error: updateError } = await updatePassword(newPassword)
    setSubmitting(false)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/account'), 2500)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-8">
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--color-sage)' }}>
          Account security
        </p>
        <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: 'var(--color-charcoal)' }}>
          Set new password
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-charcoal-muted)' }}>
          Choose a strong password to protect your study notes and progress.
        </p>
      </div>

      {success ? (
        <div
          className="rounded border p-6 text-center space-y-3"
          style={{
            borderColor: 'var(--color-sage-border)',
            backgroundColor: 'var(--color-sage-pale)',
          }}
        >
          <CheckCircle2 size={32} className="mx-auto" style={{ color: 'var(--color-sage)' }} />
          <h2 className="font-serif text-lg font-semibold" style={{ color: 'var(--color-charcoal)' }}>
            Password updated
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-charcoal-muted)' }}>
            Your password was changed successfully. Redirecting you to your account…
          </p>
          <Link
            to="/account"
            className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline pt-2"
            style={{ color: 'var(--color-sage)' }}
          >
            Go to account now <ArrowRight size={12} />
          </Link>
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

          <div>
            <label
              htmlFor="reset-new-password"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              New password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="reset-new-password"
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
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
              htmlFor="reset-confirm-password"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Confirm new password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="reset-confirm-password"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
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
            {submitting ? 'Updating…' : 'Update Password'}
            <ArrowRight size={14} />
          </button>
        </form>
      )}
    </div>
  )
}

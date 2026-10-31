// src/pages/AccountPage.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, Mail, Calendar, LogOut, Trash2, ArrowRight, BookOpen,
  Clock, AlertTriangle, ShieldCheck, RefreshCw
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../hooks/useProgress'
import { ProgressBar } from '../components/ProgressBar'
import { inspectLocalData, migrateLocalDataToCloud } from '../lib/migration'

export function AccountPage() {
  const { user, profile, signOut, deleteAccount, loading: authLoading } = useAuth()
  const { completedDays, inProgressDays, percentage, totalDays, isCloud, syncState } = useProgress()
  const navigate = useNavigate()

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [syncingLocal, setSyncingLocal] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  const localSummary = inspectLocalData()

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-solid border-[color:var(--color-sage)] border-r-transparent mb-4" />
        <p className="text-sm font-medium" style={{ color: 'var(--color-charcoal-muted)' }}>
          Loading account details…
        </p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div
          className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-sage-pale)', color: 'var(--color-sage)' }}
        >
          <User size={24} />
        </div>
        <h1 className="font-serif text-2xl font-bold mb-3" style={{ color: 'var(--color-charcoal)' }}>
          Sign in to view your account
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-charcoal-muted)' }}>
          Create an account or sign in to sync your personal progress and study notes.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/signin"
            className="px-5 py-2.5 rounded text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-charcoal)', color: 'white' }}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 rounded border text-sm font-medium transition-colors"
            style={{ borderColor: 'var(--color-ivory-border)', color: 'var(--color-charcoal-muted)', backgroundColor: 'white' }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    setDeleteError(null)
    const { error } = await deleteAccount()
    setDeleting(false)
    if (error) {
      setDeleteError(error.message)
    } else {
      navigate('/')
    }
  }

  const handleManualSync = async () => {
    setSyncingLocal(true)
    setSyncMessage(null)
    const result = await migrateLocalDataToCloud(user.id, 'keep_cloud')
    setSyncingLocal(false)
    if (result.success) {
      setSyncMessage(
        `Imported ${result.migratedProgressCount} progress records and ${result.migratedNotesCount} notes.`
      )
      setTimeout(() => window.location.reload(), 1500)
    } else {
      setSyncMessage(result.errorMessage || 'Sync failed')
    }
  }

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 pb-6 border-b" style={{ borderColor: 'var(--color-ivory-border)' }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-sage)' }}>
          Learner profile
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold" style={{ color: 'var(--color-charcoal)' }}>
              {profile?.display_name || user.email?.split('@')[0] || 'Learner'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {user.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded border text-xs font-medium transition-colors hover:shadow-sm"
            style={{
              borderColor: 'var(--color-ivory-border)',
              backgroundColor: 'white',
              color: 'var(--color-charcoal-muted)',
            }}
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Progress Card */}
        <div
          className="rounded border p-6 md:col-span-2 space-y-5"
          style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold" style={{ color: 'var(--color-charcoal)' }}>
              70-Day Progress
            </h2>
            <Link
              to="/my-progress"
              className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: 'var(--color-sage)' }}
            >
              Full breakdown <ArrowRight size={12} />
            </Link>
          </div>

          <ProgressBar value={percentage} label="Curriculum completion" />

          <div className="grid grid-cols-3 gap-4 pt-2 border-t" style={{ borderColor: 'var(--color-ivory-border)' }}>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Completed</p>
              <p className="text-xl font-mono font-semibold" style={{ color: 'var(--color-sage)' }}>
                {completedDays} <span className="text-xs font-normal text-gray-500">/ {totalDays}</span>
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>In Progress</p>
              <p className="text-xl font-mono font-semibold" style={{ color: 'var(--color-amber)' }}>
                {inProgressDays}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Cloud Sync</p>
              <p className="text-sm font-medium flex items-center gap-1 mt-1" style={{ color: isCloud ? 'var(--color-sage)' : 'var(--color-text-tertiary)' }}>
                <ShieldCheck size={14} />
                {isCloud ? 'Active' : 'Offline'}
              </p>
            </div>
          </div>
        </div>

        {/* Account Details Card */}
        <div
          className="rounded border p-6 space-y-4"
          style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
        >
          <h2 className="font-serif text-lg font-semibold" style={{ color: 'var(--color-charcoal)' }}>
            Account info
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2" style={{ color: 'var(--color-charcoal-muted)' }}>
              <Mail size={14} className="text-gray-400" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--color-charcoal-muted)' }}>
              <Calendar size={14} className="text-gray-400" />
              <span>Joined {memberSince}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--color-charcoal-muted)' }}>
              <Clock size={14} className="text-gray-400" />
              <span>Status: {syncState === 'synced' ? 'Up to date' : syncState}</span>
            </div>
          </div>

          <div className="pt-3 border-t" style={{ borderColor: 'var(--color-ivory-border)' }}>
            <Link
              to="/roadmap"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded border text-xs font-medium transition-colors hover:shadow-sm"
              style={{
                borderColor: 'var(--color-ivory-border)',
                backgroundColor: 'var(--color-ivory)',
                color: 'var(--color-charcoal)',
              }}
            >
              <BookOpen size={13} />
              Continue Learning
            </Link>
          </div>
        </div>
      </div>

      {/* Local Data Migration Section */}
      {localSummary.hasData && (
        <div
          className="rounded border p-6 mb-12 space-y-3"
          style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif text-base font-semibold" style={{ color: 'var(--color-charcoal)' }}>
                Browser local storage backup
              </h3>
              <p className="text-xs text-[color:var(--color-text-secondary)] mt-1">
                You have {localSummary.completedCount} completed day(s) and {localSummary.notesCount} note(s) saved in this browser.
                You can import them into your cloud account at any time.
              </p>
            </div>
            <button
              onClick={handleManualSync}
              disabled={syncingLocal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-sage)',
                color: 'white',
                opacity: syncingLocal ? 0.7 : 1,
              }}
            >
              <RefreshCw size={12} className={syncingLocal ? 'animate-spin' : ''} />
              {syncingLocal ? 'Importing…' : 'Import local data'}
            </button>
          </div>
          {syncMessage && (
            <p className="text-xs font-medium" style={{ color: 'var(--color-sage)' }}>
              {syncMessage}
            </p>
          )}
        </div>
      )}

      {/* Danger Zone */}
      <div
        className="rounded border p-6 space-y-4"
        style={{ borderColor: 'var(--color-red-muted)', backgroundColor: 'var(--color-red-pale)' }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-700 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-900">Delete Account and Data</h3>
            <p className="text-xs text-red-800 mt-1 leading-relaxed">
              Permanently delete your account along with all cloud-saved learning progress and study notes.
              This action cannot be undone.
            </p>
          </div>
        </div>

        {deleteError && (
          <p className="text-xs text-red-700 font-medium">{deleteError}</p>
        )}

        {confirmDelete ? (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-4 py-1.5 rounded text-xs font-medium text-white bg-red-700 hover:bg-red-800 transition-colors"
            >
              {deleting ? 'Deleting…' : 'Yes, delete everything permanently'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 rounded text-xs font-medium text-gray-700 bg-white border border-gray-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-medium border border-red-300 text-red-700 hover:bg-white transition-colors"
          >
            <Trash2 size={13} /> Delete Account
          </button>
        )}
      </div>
    </div>
  )
}

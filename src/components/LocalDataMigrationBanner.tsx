// src/components/LocalDataMigrationBanner.tsx
import { useState, useEffect } from 'react'
import { CloudUpload, CheckCircle2, AlertCircle, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { inspectLocalData, migrateLocalDataToCloud, type LocalDataSummary } from '../lib/migration'

export function LocalDataMigrationBanner() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<LocalDataSummary | null>(null)
  const [migrating, setMigrating] = useState(false)
  const [migrated, setMigrated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!user) {
      setSummary(null)
      return
    }

    const alreadyMigrated = localStorage.getItem('learn-ai-migrated-at')
    if (alreadyMigrated) return

    const data = inspectLocalData()
    if (data.hasData) {
      setSummary(data)
    }
  }, [user])

  if (!user || !summary || dismissed || migrated) {
    return null
  }

  const handleMigrate = async () => {
    setMigrating(true)
    setError(null)
    const result = await migrateLocalDataToCloud(user.id, 'keep_cloud')
    setMigrating(false)

    if (result.success) {
      setMigrated(true)
      setTimeout(() => {
        setDismissed(true)
        window.location.reload() // reload state so hooks reflect cloud data immediately
      }, 1500)
    } else {
      setError(result.errorMessage || 'Failed to sync local data')
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem('learn-ai-migrated-at', 'dismissed')
    } catch {
      // ignore
    }
  }

  return (
    <div
      className="border-b px-4 py-3 text-sm transition-all"
      style={{
        backgroundColor: 'var(--color-sage-pale)',
        borderColor: 'var(--color-sage-border)',
        color: 'var(--color-charcoal)',
      }}
      role="region"
      aria-label="Local data sync notification"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CloudUpload size={18} style={{ color: 'var(--color-sage)' }} aria-hidden="true" />
          <div>
            <span className="font-medium">Sync your previous study progress: </span>
            <span style={{ color: 'var(--color-charcoal-muted)' }}>
              Found {summary.completedCount} completed day{summary.completedCount === 1 ? '' : 's'} and{' '}
              {summary.notesCount} study note{summary.notesCount === 1 ? '' : 's'} saved in this browser.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {error && (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} /> {error}
            </span>
          )}

          {migrated ? (
            <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--color-sage)' }}>
              <CheckCircle2 size={14} /> Synced!
            </span>
          ) : (
            <>
              <button
                onClick={handleMigrate}
                disabled={migrating}
                className="px-3 py-1 rounded text-xs font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--color-sage)',
                  color: 'white',
                  opacity: migrating ? 0.7 : 1,
                }}
              >
                {migrating ? 'Syncing…' : 'Sync to account'}
              </button>
              <button
                onClick={handleDismiss}
                className="p-1 rounded text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-charcoal)]"
                aria-label="Dismiss migration prompt"
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

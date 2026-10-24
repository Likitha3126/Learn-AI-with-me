// src/pages/MyProgressPage.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, RotateCcw, Sparkles, ShieldCheck, Filter
} from 'lucide-react'
import { roadmap, stages } from '../data/roadmap'
import { useProgress, type DayStatus } from '../hooks/useProgress'
import { ProgressBar } from '../components/ProgressBar'
import { DayCard } from '../components/DayCard'
import { useAuth } from '../contexts/AuthContext'

export function MyProgressPage() {
  const { user } = useAuth()
  const {
    getDayProgress,
    completedDays,
    inProgressDays,
    percentage,
    totalDays,
    getStageProgress,
    nextRecommendedDay,
    resetProgress,
    isCloud,
  } = useProgress()

  const [statusFilter, setStatusFilter] = useState<'all' | DayStatus>('all')
  const [confirmReset, setConfirmReset] = useState(false)

  const handleReset = async () => {
    await resetProgress()
    setConfirmReset(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--color-sage)' }}>
          Learning Journal
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: 'var(--color-charcoal)' }}>
              My Learning Progress
            </h1>
            <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
              Track your journey through all 70 days. Check off practical tasks and mark lessons as completed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded text-xs font-medium text-white bg-red-700"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded text-xs font-medium border border-gray-300 bg-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-colors hover:shadow-sm"
                style={{
                  borderColor: 'var(--color-ivory-border)',
                  backgroundColor: 'white',
                  color: 'var(--color-charcoal-muted)',
                }}
              >
                <RotateCcw size={12} />
                Reset Progress
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cloud Sync Status Callout */}
      {!user && (
        <div
          className="rounded border p-4 mb-8 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{
            borderColor: 'var(--color-sage-border)',
            backgroundColor: 'var(--color-sage-pale)',
            color: 'var(--color-charcoal)',
          }}
        >
          <div>
            <span className="font-medium">Using browser storage: </span>
            <span style={{ color: 'var(--color-charcoal-muted)' }}>
              Your progress is saved on this computer. Sign in to sync your checklist across devices.
            </span>
          </div>
          <Link
            to="/signin?redirectTo=/my-progress"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium flex-shrink-0 transition-colors"
            style={{ backgroundColor: 'var(--color-sage)', color: 'white' }}
          >
            Sign in to sync <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Overview Stats */}
      <div
        className="rounded border p-6 mb-10 space-y-5"
        style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
      >
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Curriculum completion
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            {completedDays} of {totalDays} days completed ({percentage}%)
          </span>
        </div>
        <ProgressBar value={percentage} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t" style={{ borderColor: 'var(--color-ivory-border)' }}>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Completed</p>
            <p className="text-2xl font-mono font-semibold" style={{ color: 'var(--color-sage)' }}>
              {completedDays}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>In Progress</p>
            <p className="text-2xl font-mono font-semibold" style={{ color: 'var(--color-amber)' }}>
              {inProgressDays}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Remaining</p>
            <p className="text-2xl font-mono font-semibold" style={{ color: 'var(--color-charcoal)' }}>
              {totalDays - completedDays}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Persistence</p>
            <p className="text-sm font-medium flex items-center gap-1 mt-1.5" style={{ color: isCloud ? 'var(--color-sage)' : 'var(--color-text-secondary)' }}>
              <ShieldCheck size={14} /> {isCloud ? 'Supabase Cloud' : 'Browser only'}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Next Lesson */}
      {nextRecommendedDay && (
        <div
          className="rounded border p-6 mb-10"
          style={{ borderColor: 'var(--color-sage-border)', backgroundColor: 'white' }}
        >
          <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--color-sage)' }}>
            <Sparkles size={16} />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">Recommended next lesson</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif text-lg font-bold" style={{ color: 'var(--color-charcoal)' }}>
                Day {nextRecommendedDay.day}: {nextRecommendedDay.title}
              </p>
              <p className="text-xs text-[color:var(--color-text-secondary)] mt-0.5">
                Stage {nextRecommendedDay.stage}: {nextRecommendedDay.stageName} • {nextRecommendedDay.estimatedMinutes} min estimated
              </p>
            </div>
            <Link
              to={`/day/${nextRecommendedDay.day}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium transition-colors flex-shrink-0"
              style={{ backgroundColor: 'var(--color-sage)', color: 'white' }}
            >
              Start lesson <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* Status Filter */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={14} style={{ color: 'var(--color-text-tertiary)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Filter by status:</span>
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'completed', 'in-progress', 'not-started'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className="px-2.5 py-1 text-xs rounded border transition-colors capitalize"
              style={{
                borderColor: statusFilter === filter ? 'var(--color-sage)' : 'var(--color-ivory-border)',
                backgroundColor: statusFilter === filter ? 'var(--color-sage-pale)' : 'white',
                color: statusFilter === filter ? 'var(--color-sage)' : 'var(--color-text-secondary)',
              }}
            >
              {filter.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Breakdown */}
      <div className="space-y-8">
        {stages.map((stage) => {
          const stageDays = roadmap.filter((d) => d.stage === stage.number)
          const filteredDays = stageDays.filter((d) => {
            if (statusFilter === 'all') return true
            const p = getDayProgress(d.day)
            return p.status === statusFilter
          })

          const { completed, total } = getStageProgress(stage.days)
          const stagePct = Math.round((completed / total) * 100)

          if (filteredDays.length === 0 && statusFilter !== 'all') {
            return null
          }

          return (
            <div
              key={stage.number}
              className="rounded border p-6"
              style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--color-ivory-border)' }}>
                <div>
                  <span className="text-xs font-mono font-medium" style={{ color: 'var(--color-sage)' }}>
                    Stage {stage.number}
                  </span>
                  <h2 className="font-serif text-lg font-bold" style={{ color: 'var(--color-charcoal)' }}>
                    {stage.name}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <ProgressBar value={stagePct} small />
                  </div>
                  <span className="font-mono text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    {completed} / {total}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDays.map((day) => (
                  <DayCard key={day.day} day={day} progress={getDayProgress(day.day)} compact />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

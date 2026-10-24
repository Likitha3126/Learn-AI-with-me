// src/pages/RoadmapPage.tsx
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Filter } from 'lucide-react'
import { roadmap, stages } from '../data/roadmap'
import { useProgress } from '../hooks/useProgress'
import { DayCard } from '../components/DayCard'
import { ProgressBar } from '../components/ProgressBar'

type StatusFilter = 'all' | 'not-started' | 'in-progress' | 'completed'

export function RoadmapPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [stageFilter, setStageFilter] = useState<number | 'all'>(() => {
    const s = searchParams.get('stage')
    return s ? parseInt(s, 10) : 'all'
  })
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const { getDayProgress, getStageProgress, completedDays, percentage } = useProgress()

  // Sync stageFilter from URL
  useEffect(() => {
    const s = searchParams.get('stage')
    if (s) setStageFilter(parseInt(s, 10))
  }, [searchParams])

  const handleStageFilter = (v: number | 'all') => {
    setStageFilter(v)
    if (v === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ stage: String(v) })
    }
  }

  const filtered = useMemo(() => {
    return roadmap.filter((d) => {
      const matchesQuery =
        query === '' ||
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.description.toLowerCase().includes(query.toLowerCase()) ||
        d.category.toLowerCase().includes(query.toLowerCase()) ||
        d.stageName.toLowerCase().includes(query.toLowerCase())

      const matchesStage = stageFilter === 'all' || d.stage === stageFilter

      const progress = getDayProgress(d.day)
      const matchesStatus = statusFilter === 'all' || progress.status === statusFilter

      return matchesQuery && matchesStage && matchesStatus
    })
  }, [query, stageFilter, statusFilter, getDayProgress])

  // Group filtered days by stage
  const groupedByStage = useMemo(() => {
    const map = new Map<number, typeof filtered>()
    for (const day of filtered) {
      if (!map.has(day.stage)) map.set(day.stage, [])
      map.get(day.stage)!.push(day)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b)
  }, [filtered])

  const clearFilters = () => {
    setQuery('')
    setStageFilter('all')
    setStatusFilter('all')
    setSearchParams({})
  }

  const hasActiveFilters = query !== '' || stageFilter !== 'all' || statusFilter !== 'all'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--color-sage)' }}>
          The curriculum
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--color-charcoal)' }}>
          70-Day Roadmap
        </h1>
        <p className="text-sm max-w-xl" style={{ color: 'var(--color-charcoal-muted)' }}>
          Ten stages, 70 lessons. Each day has a clear topic, practical tasks, and a reflection question.
          Your personal progress is tracked below — it is private to this browser.
        </p>
      </div>

      {/* Overall progress */}
      <div
        className="rounded border p-4 mb-8"
        style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Your progress
          </span>
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
            {completedDays} / 70 days completed
          </span>
        </div>
        <ProgressBar value={percentage} />
      </div>

      {/* Filters */}
      <div
        className="rounded border p-4 mb-8 space-y-4"
        style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
      >
        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-tertiary)' }}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, topic, or category…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded border outline-none transition-colors"
            style={{
              borderColor: 'var(--color-ivory-border)',
              backgroundColor: 'var(--color-ivory)',
              color: 'var(--color-charcoal)',
            }}
            aria-label="Search roadmap"
            id="roadmap-search"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Stage filter */}
          <div>
            <label htmlFor="stage-filter" className="text-xs font-medium block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Stage
            </label>
            <select
              id="stage-filter"
              value={stageFilter}
              onChange={(e) => handleStageFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
              className="text-sm px-3 py-1.5 rounded border outline-none"
              style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white', color: 'var(--color-charcoal)' }}
            >
              <option value="all">All stages</option>
              {stages.map((s) => (
                <option key={s.number} value={s.number}>
                  Stage {s.number}: {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label htmlFor="status-filter" className="text-xs font-medium block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="text-sm px-3 py-1.5 rounded border outline-none"
              style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white', color: 'var(--color-charcoal)' }}
            >
              <option value="all">All statuses</option>
              <option value="not-started">Not started</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded border transition-colors"
                style={{ borderColor: 'var(--color-ivory-border)', color: 'var(--color-text-secondary)' }}
              >
                <X size={11} /> Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div
          className="rounded border p-8 text-center"
          style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
        >
          <Filter size={20} className="mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            No lessons match your filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-3 text-sm font-medium transition-colors"
            style={{ color: 'var(--color-sage)' }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedByStage.map(([stageNum, days]) => {
            const stage = stages.find((s) => s.number === stageNum)!
            const { completed, total } = getStageProgress(stage.days)
            return (
              <section key={stageNum} aria-labelledby={`stage-${stageNum}-heading`}>
                {/* Stage header */}
                <div
                  className="flex items-baseline justify-between border-b pb-3 mb-4"
                  style={{ borderColor: 'var(--color-ivory-border)' }}
                >
                  <div>
                    <h2
                      id={`stage-${stageNum}-heading`}
                      className="font-serif text-lg font-semibold"
                      style={{ color: 'var(--color-charcoal)' }}
                    >
                      <span
                        className="font-mono text-xs font-normal mr-2"
                        style={{ color: 'var(--color-sage)' }}
                      >
                        Stage {stageNum}
                      </span>
                      {stage.name}
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                      Days {stage.days[0]}–{stage.days[stage.days.length - 1]} · {completed}/{total} completed
                    </p>
                  </div>
                  <div className="w-24 hidden sm:block">
                    <ProgressBar value={Math.round((completed / total) * 100)} small />
                  </div>
                </div>

                {/* Day cards */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {days.map((d) => (
                    <DayCard key={d.day} day={d} progress={getDayProgress(d.day)} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

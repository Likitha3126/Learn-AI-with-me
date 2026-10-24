// src/components/DayCard.tsx
import { Link } from 'react-router-dom'
import { Clock, CheckCircle2, Circle, PlayCircle, ExternalLink, BookOpen } from 'lucide-react'
import type { RoadmapDay } from '../data/roadmap'
import type { DayProgress } from '../hooks/useProgress'

interface DayCardProps {
  day: RoadmapDay
  progress?: DayProgress
  compact?: boolean
}

const statusConfig = {
  'not-started': {
    icon: <Circle size={14} aria-hidden="true" />,
    label: 'Not started',
    color: 'var(--color-text-tertiary)',
    bg: 'transparent',
    border: 'var(--color-ivory-border)',
  },
  'in-progress': {
    icon: <PlayCircle size={14} aria-hidden="true" />,
    label: 'In progress',
    color: 'var(--color-amber)',
    bg: 'var(--color-amber-pale)',
    border: '#e8c98a',
  },
  completed: {
    icon: <CheckCircle2 size={14} aria-hidden="true" />,
    label: 'Completed',
    color: 'var(--color-sage)',
    bg: 'var(--color-sage-pale)',
    border: 'var(--color-sage-border)',
  },
}

export function DayCard({ day, progress, compact = false }: DayCardProps) {
  const status = progress?.status ?? 'not-started'
  const cfg = statusConfig[status]
  const tasksDone = progress?.completedTasks.length ?? 0
  const tasksTotal = day.tasks.length

  if (compact) {
    return (
      <Link
        to={`/day/${day.day}`}
        className="group flex items-start gap-3 p-3 rounded border transition-all duration-150 hover:shadow-sm"
        style={{
          borderColor: status === 'not-started' ? 'var(--color-ivory-border)' : cfg.border,
          backgroundColor: status === 'not-started' ? 'white' : cfg.bg,
        }}
        aria-label={`Day ${day.day}: ${day.title}, ${cfg.label}`}
      >
        {/* Day number */}
        <span
          className="flex-shrink-0 font-mono text-xs pt-0.5"
          style={{ color: 'var(--color-text-tertiary)', minWidth: '2rem' }}
        >
          {String(day.day).padStart(2, '0')}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-medium leading-tight group-hover:text-[color:var(--color-sage)] transition-colors"
            style={{ color: 'var(--color-charcoal)' }}
          >
            {day.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              <Clock size={10} className="inline mr-0.5" aria-hidden="true" />
              {Math.round(day.estimatedMinutes / 60 * 10) / 10}h
            </span>
            {day.published && (
              <span className="text-xs" style={{ color: 'var(--color-sage)' }}>
                <BookOpen size={10} className="inline mr-0.5" aria-hidden="true" />
                Published
              </span>
            )}
          </div>
        </div>

        {/* Status */}
        <span style={{ color: cfg.color }} aria-hidden="true">
          {cfg.icon}
        </span>
      </Link>
    )
  }

  return (
    <article
      className="flex flex-col p-5 rounded border transition-all duration-150 hover:shadow-sm"
      style={{
        borderColor: status === 'not-started' ? 'var(--color-ivory-border)' : cfg.border,
        backgroundColor: status === 'not-started' ? 'white' : cfg.bg,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <span
            className="flex-shrink-0 font-mono text-xs font-medium pt-0.5"
            style={{ color: 'var(--color-text-tertiary)', minWidth: '2rem' }}
          >
            {String(day.day).padStart(2, '0')}
          </span>
          <div>
            <Link
              to={`/day/${day.day}`}
              className="font-serif font-semibold text-base leading-tight hover:text-[color:var(--color-sage)] transition-colors"
              style={{ color: 'var(--color-charcoal)' }}
            >
              {day.title}
            </Link>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              {day.category}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <span
          className="flex-shrink-0 flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium"
          style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
          aria-label={`Status: ${cfg.label}`}
        >
          {cfg.icon}
          <span className="hidden sm:inline">{cfg.label}</span>
        </span>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--color-charcoal-muted)' }}>
        {day.description}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            <Clock size={11} aria-hidden="true" />
            {day.estimatedMinutes >= 60
              ? `${Math.floor(day.estimatedMinutes / 60)}h ${day.estimatedMinutes % 60 > 0 ? `${day.estimatedMinutes % 60}m` : ''}`
              : `${day.estimatedMinutes}m`}
          </span>
          {status !== 'not-started' && tasksTotal > 0 && (
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>
              {tasksDone}/{tasksTotal} tasks
            </span>
          )}
          {day.published && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-sage)' }}>
              <BookOpen size={11} aria-hidden="true" />
              Article
            </span>
          )}
        </div>

        <Link
          to={`/day/${day.day}`}
          className="flex items-center gap-1 text-xs font-medium transition-colors hover:underline"
          style={{ color: 'var(--color-sage)' }}
          aria-label={`View Day ${day.day}: ${day.title}`}
        >
          View lesson
          <ExternalLink size={10} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

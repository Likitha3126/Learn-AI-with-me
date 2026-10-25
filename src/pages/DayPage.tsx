// src/pages/DayPage.tsx
import { useParams, Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, Clock, CheckSquare, Square,
  ExternalLink, ChevronDown, ChevronUp, Save, Copy, Download,
  Trash2, Eye, Edit2, AlertCircle, Check, Cloud, ShieldCheck
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getDayByNumber, roadmap } from '../data/roadmap'
import { useProgress } from '../hooks/useProgress'
import { useNotes, defaultNoteTemplate } from '../hooks/useNotes'
import { useAuth } from '../contexts/AuthContext'
import type { DayStatus } from '../hooks/useProgress'

export function DayPage() {
  const { dayNumber } = useParams<{ dayNumber: string }>()
  const day = getDayByNumber(Number(dayNumber))

  if (!day) return <Navigate to="/not-found" replace />

  return <DayContent key={day.day} day={day} />
}

function DayContent({ day }: { day: NonNullable<ReturnType<typeof getDayByNumber>> }) {
  const { getDayProgress, setDayStatus, toggleTask, isCloud } = useProgress()
  const progress = getDayProgress(day.day)
  const [showReflection, setShowReflection] = useState(false)

  const prevDay = day.day > 1 ? getDayByNumber(day.day - 1) : null
  const nextDay = day.day < roadmap.length ? getDayByNumber(day.day + 1) : null

  const statusOptions: { value: DayStatus; label: string }[] = [
    { value: 'not-started', label: 'Not started' },
    { value: 'in-progress', label: 'In progress' },
    { value: 'completed', label: 'Completed' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs mb-8" aria-label="Breadcrumb">
        <Link to="/roadmap" className="flex items-center gap-1 transition-colors" style={{ color: 'var(--color-text-tertiary)' }}>
          <ArrowLeft size={12} aria-hidden="true" /> Roadmap
        </Link>
        <span style={{ color: 'var(--color-ivory-border)' }}>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>
          Stage {day.stage}: {day.stageName}
        </span>
        <span style={{ color: 'var(--color-ivory-border)' }}>/</span>
        <span style={{ color: 'var(--color-charcoal)' }}>Day {day.day}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="text-xs font-mono px-2 py-0.5 rounded"
            style={{ backgroundColor: 'var(--color-sage-pale)', color: 'var(--color-sage)' }}
          >
            Stage {day.stage}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: 'var(--color-ivory-dark)', color: 'var(--color-text-secondary)' }}
          >
            {day.category}
          </span>
          {day.published && (
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{ backgroundColor: '#eaf4ee', color: 'var(--color-sage)' }}
            >
              Published
            </span>
          )}
        </div>

        <p className="font-mono text-xs mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
          Day {day.day} of 70
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-charcoal)', lineHeight: 1.2 }}>
          {day.title}
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
          {day.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-4">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            <Clock size={12} aria-hidden="true" />
            {day.estimatedMinutes >= 60
              ? `${Math.floor(day.estimatedMinutes / 60)}h${day.estimatedMinutes % 60 > 0 ? ` ${day.estimatedMinutes % 60}m` : ''}`
              : `${day.estimatedMinutes}m`}
            estimated
          </span>
        </div>
      </header>

      {/* Progress controls */}
      <section
        className="rounded border p-4 mb-8"
        style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
        aria-labelledby="progress-controls-heading"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 id="progress-controls-heading" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
            My Progress
          </h2>
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: isCloud ? 'var(--color-sage)' : 'var(--color-text-tertiary)' }}>
            <ShieldCheck size={12} />
            {isCloud ? 'Cloud sync active' : 'Browser storage'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setDayStatus(day.day, value)}
              className="px-3 py-1.5 text-xs rounded border font-medium transition-all"
              style={{
                borderColor: progress.status === value ? 'var(--color-sage)' : 'var(--color-ivory-border)',
                backgroundColor: progress.status === value ? 'var(--color-sage-pale)' : 'white',
                color: progress.status === value ? 'var(--color-sage)' : 'var(--color-text-secondary)',
              }}
              aria-pressed={progress.status === value}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* LEARN */}
      <section className="mb-10" aria-labelledby="objectives-heading">
        <SectionLabel>Learn</SectionLabel>
        <h2 id="objectives-heading" className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
          Learning Objectives
        </h2>
        <ul className="space-y-2">
          {day.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-charcoal-muted)' }}>
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-medium mt-0.5"
                style={{ backgroundColor: 'var(--color-sage-pale)', color: 'var(--color-sage)' }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              {obj}
            </li>
          ))}
        </ul>

        {/* Concepts */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
            Concepts to understand
          </h3>
          <div className="flex flex-wrap gap-2">
            {day.concepts.map((c) => (
              <span
                key={c}
                className="text-xs px-2.5 py-1 rounded border font-mono"
                style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white', color: 'var(--color-charcoal-muted)' }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr style={{ borderColor: 'var(--color-ivory-border)' }} className="mb-10" />

      {/* EXPLAIN — full lesson body (shown when creator has written it) */}
      {day.lessonBody && (
        <>
          <section className="mb-10" aria-labelledby="lesson-body-heading">
            <SectionLabel>Explain</SectionLabel>
            <h2 id="lesson-body-heading" className="font-serif text-xl font-semibold mb-6" style={{ color: 'var(--color-charcoal)' }}>
              Lesson
            </h2>
            <div
              className="prose"
              style={{ maxWidth: '100%' }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{day.lessonBody}</ReactMarkdown>
            </div>
          </section>
          <hr style={{ borderColor: 'var(--color-ivory-border)' }} className="mb-10" />
        </>
      )}

      {/* PRACTISE */}
      <section className="mb-10" aria-labelledby="tasks-heading">
        <SectionLabel>Practise</SectionLabel>
        <h2 id="tasks-heading" className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
          Practical Tasks
        </h2>
        <ul className="space-y-3" role="list">
          {day.tasks.map((task, i) => {
            const done = progress.completedTasks.includes(i)
            return (
              <li
                key={i}
                className="flex items-start gap-3 p-3 rounded border transition-colors cursor-pointer"
                style={{
                  borderColor: done ? 'var(--color-sage-border)' : 'var(--color-ivory-border)',
                  backgroundColor: done ? 'var(--color-sage-pale)' : 'white',
                }}
                onClick={() => toggleTask(day.day, i)}
              >
                <label className="flex items-start gap-3 cursor-pointer w-full">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={done}
                    aria-label={`Task ${i + 1}: ${task}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleTask(day.day, i)
                    }}
                    className="flex-shrink-0 mt-0.5 transition-colors focus:outline-none"
                    style={{ color: done ? 'var(--color-sage)' : 'var(--color-text-tertiary)' }}
                  >
                    {done ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                  <span
                    className="text-sm leading-relaxed transition-colors"
                    style={{
                      color: done ? 'var(--color-text-tertiary)' : 'var(--color-charcoal-muted)',
                      textDecoration: done ? 'line-through' : 'none',
                    }}
                  >
                    {task}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
        {progress.completedTasks.length > 0 && (
          <p className="text-xs mt-3 font-mono" style={{ color: 'var(--color-sage)' }}>
            {progress.completedTasks.length} of {day.tasks.length} tasks complete
          </p>
        )}
      </section>

      {/* Divider */}
      <hr style={{ borderColor: 'var(--color-ivory-border)' }} className="mb-10" />

      {/* REFLECT */}
      <section className="mb-10" aria-labelledby="reflect-heading">
        <SectionLabel>Reflect</SectionLabel>
        <h2 id="reflect-heading" className="font-serif text-xl font-semibold mb-3" style={{ color: 'var(--color-charcoal)' }}>
          Reflection Question
        </h2>
        <button
          onClick={() => setShowReflection((v) => !v)}
          className="w-full text-left p-4 rounded border transition-all flex items-start justify-between gap-3 group"
          style={{
            borderColor: showReflection ? 'var(--color-sage-border)' : 'var(--color-ivory-border)',
            backgroundColor: showReflection ? 'var(--color-sage-pale)' : 'white',
          }}
          aria-expanded={showReflection}
        >
          <span className="text-sm italic leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
            {showReflection
              ? day.reflectionQuestion
              : 'Tap to reveal the reflection question — try to think about it before reading.'}
          </span>
          {showReflection ? (
            <ChevronUp size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-sage)' }} aria-hidden="true" />
          ) : (
            <ChevronDown size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
          )}
        </button>
      </section>

      {/* Divider */}
      <hr style={{ borderColor: 'var(--color-ivory-border)' }} className="mb-10" />

      {/* Resources */}
      <section className="mb-10" aria-labelledby="resources-heading">
        <SectionLabel>Read</SectionLabel>
        <h2 id="resources-heading" className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
          Resources & Documentation
        </h2>
        <div className="space-y-2">
          {day.resources.map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3 rounded border group transition-all hover:shadow-sm"
              style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-mono uppercase flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-ivory-dark)', color: 'var(--color-text-tertiary)' }}
                >
                  {r.type}
                </span>
                <span
                  className="text-sm group-hover:text-[color:var(--color-sage)] transition-colors"
                  style={{ color: 'var(--color-charcoal-muted)' }}
                >
                  {r.title}
                </span>
              </div>
              <ExternalLink size={13} className="flex-shrink-0" style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      {/* Substack article */}
      <section className="mb-10" aria-labelledby="article-heading">
        <SectionLabel>Published Writing</SectionLabel>
        <h2 id="article-heading" className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
          Substack Article
        </h2>
        {day.published && day.substackUrl ? (
          <a
            href={day.substackUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Read the Substack article: Day ${day.day} (opens in a new tab)`}
            className="flex items-center justify-between p-4 rounded border transition-all hover:shadow-sm"
            style={{ borderColor: 'var(--color-sage-border)', backgroundColor: 'var(--color-sage-pale)' }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                Day {day.day}: {day.title}
              </p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--color-sage)' }}>
                Read the Substack article
              </p>
            </div>
            <ExternalLink size={15} style={{ color: 'var(--color-sage)' }} aria-hidden="true" />
          </a>
        ) : (
          <div
            className="flex items-center gap-3 p-4 rounded border"
            style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'var(--color-ivory-dark)' }}
          >
            <AlertCircle size={15} style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Article coming soon. The complete educational material and practical exercises are available directly on this page.
            </p>
          </div>
        )}

        {/* GitHub link */}
        {day.githubUrl && (
          <a
            href={day.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded border mt-3 transition-all hover:shadow-sm"
            style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                Code on GitHub
              </p>
              <p className="text-xs mt-0.5 truncate max-w-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                {day.githubUrl}
              </p>
            </div>
            <ExternalLink size={15} style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
          </a>
        )}
      </section>

      {/* Divider */}
      <hr style={{ borderColor: 'var(--color-ivory-border)' }} className="mb-10" />

      {/* Notes */}
      <NotesSection day={day.day} title={day.title} />

      {/* Navigation */}
      <nav
        className="flex items-center justify-between mt-12 pt-8 border-t"
        style={{ borderColor: 'var(--color-ivory-border)' }}
        aria-label="Day navigation"
      >
        {prevDay ? (
          <Link
            to={`/day/${prevDay.day}`}
            className="flex items-center gap-2 text-sm transition-colors hover:text-[color:var(--color-charcoal)] group"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <span>
              <span className="block text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>Day {prevDay.day}</span>
              <span className="group-hover:underline">{prevDay.title}</span>
            </span>
          </Link>
        ) : (
          <div />
        )}
        {nextDay ? (
          <Link
            to={`/day/${nextDay.day}`}
            className="flex items-center gap-2 text-sm text-right transition-colors hover:text-[color:var(--color-charcoal)] group"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span>
              <span className="block text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>Day {nextDay.day}</span>
              <span className="group-hover:underline">{nextDay.title}</span>
            </span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-mono uppercase tracking-widest mb-2"
      style={{ color: 'var(--color-sage)' }}
    >
      {children}
    </p>
  )
}

function NotesSection({ day, title }: { day: number; title: string }) {
  const { user } = useAuth()
  const {
    content,
    updateContent,
    saveNotes,
    clearNotes,
    saved,
    saveStatus,
    wordCount,
  } = useNotes(day)

  const [preview, setPreview] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleLoadTemplate = () => {
    if (content === '' || window.confirm('Replace current notes with the template?')) {
      updateContent(defaultNoteTemplate(day, title))
    }
  }

  const handleClear = () => {
    if (content === '') return
    setClearing(true)
  }

  const confirmClear = () => {
    clearNotes()
    setClearing(false)
  }

  const handleCopy = async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleDownload = () => {
    if (!content) return
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `day-${String(day).padStart(2, '0')}-notes.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section aria-labelledby="notes-heading">
      <SectionLabel>My Notes</SectionLabel>
      <div className="flex items-baseline justify-between mb-1">
        <h2 id="notes-heading" className="font-serif text-xl font-semibold" style={{ color: 'var(--color-charcoal)' }}>
          Personal Notes
        </h2>
      </div>

      <div className="mb-4">
        {user ? (
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-sage)' }}>
            <Cloud size={13} />
            Cloud synchronized. Your notes are private to your account and accessible across devices.
          </p>
        ) : (
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            Notes are saved in this browser only.{' '}
            <Link
              to={`/signin?redirectTo=${encodeURIComponent(`/day/${day}`)}`}
              className="underline hover:text-[color:var(--color-charcoal)]"
              style={{ color: 'var(--color-sage)' }}
            >
              Sign in or create an account
            </Link>{' '}
            to sync them across your devices.
          </p>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(false)}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors"
            style={{
              borderColor: !preview ? 'var(--color-sage-border)' : 'var(--color-ivory-border)',
              backgroundColor: !preview ? 'var(--color-sage-pale)' : 'white',
              color: !preview ? 'var(--color-sage)' : 'var(--color-text-secondary)',
            }}
            aria-pressed={!preview}
          >
            <Edit2 size={11} /> Edit
          </button>
          <button
            onClick={() => setPreview(true)}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors"
            style={{
              borderColor: preview ? 'var(--color-sage-border)' : 'var(--color-ivory-border)',
              backgroundColor: preview ? 'var(--color-sage-pale)' : 'white',
              color: preview ? 'var(--color-sage)' : 'var(--color-text-secondary)',
            }}
            aria-pressed={preview}
          >
            <Eye size={11} /> Preview
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
            {wordCount} words
          </span>

          <span
            className="text-xs font-medium"
            style={{
              color:
                saveStatus === 'saving'
                  ? 'var(--color-amber)'
                  : saveStatus === 'unsaved'
                  ? 'var(--color-amber)'
                  : 'var(--color-sage)',
            }}
            aria-live="polite"
          >
            {saveStatus === 'saving'
              ? '· Saving…'
              : saveStatus === 'unsaved'
              ? '· Unsaved'
              : '· Saved'}
          </span>

          <button
            onClick={saveNotes}
            disabled={saved}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors"
            style={{
              borderColor: 'var(--color-ivory-border)',
              backgroundColor: saved ? 'var(--color-ivory)' : 'var(--color-sage-pale)',
              color: saved ? 'var(--color-text-tertiary)' : 'var(--color-sage)',
            }}
          >
            <Save size={11} /> Save
          </button>
        </div>
      </div>

      {/* Editor or Preview */}
      {preview ? (
        <div
          className="prose min-h-48 p-4 rounded border text-sm"
          style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
        >
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            <p className="italic" style={{ color: 'var(--color-text-tertiary)' }}>Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => updateContent(e.target.value)}
          className="w-full min-h-64 p-4 rounded border text-sm font-mono resize-y outline-none transition-colors"
          style={{
            borderColor: 'var(--color-ivory-border)',
            backgroundColor: 'white',
            color: 'var(--color-charcoal)',
            lineHeight: 1.6,
          }}
          placeholder="Start writing your notes for today's lesson… or load the template below."
          aria-label="Personal notes editor"
          spellCheck
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-sage-border)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--color-ivory-border)')}
        />
      )}

      {/* Bottom actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadTemplate}
            className="text-xs px-2.5 py-1 rounded border transition-colors hover:shadow-sm"
            style={{
              borderColor: 'var(--color-ivory-border)',
              backgroundColor: 'white',
              color: 'var(--color-text-secondary)',
            }}
          >
            Load template
          </button>

          {clearing ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-red-600">Delete notes?</span>
              <button
                onClick={confirmClear}
                className="text-xs px-2 py-0.5 rounded bg-red-600 text-white font-medium"
              >
                Yes
              </button>
              <button
                onClick={() => setClearing(false)}
                className="text-xs px-2 py-0.5 rounded border border-gray-300 bg-white"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={handleClear}
              disabled={content === ''}
              className="text-xs px-2.5 py-1 rounded border transition-colors text-red-700 disabled:opacity-40"
              style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
            >
              <Trash2 size={11} className="inline mr-1" /> Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={content === ''}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors disabled:opacity-40"
            style={{
              borderColor: 'var(--color-ivory-border)',
              backgroundColor: 'white',
              color: 'var(--color-text-secondary)',
            }}
          >
            {copied ? <Check size={11} style={{ color: 'var(--color-sage)' }} /> : <Copy size={11} />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={handleDownload}
            disabled={content === ''}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors disabled:opacity-40"
            style={{
              borderColor: 'var(--color-ivory-border)',
              backgroundColor: 'white',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Download size={11} /> Download .md
          </button>
        </div>
      </div>
    </section>
  )
}

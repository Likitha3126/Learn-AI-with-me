// src/pages/HomePage.tsx
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ExternalLink, Rss, Layers } from 'lucide-react'
import { roadmap, stages } from '../data/roadmap'
import { siteConfig } from '../data/siteConfig'
import { projects } from '../data/projects'
import { useProgress } from '../hooks/useProgress'
import { ProgressBar } from '../components/ProgressBar'
import { DayCard } from '../components/DayCard'
import { CreatorLinks } from '../components/CreatorLinks'

export function HomePage() {
  const { completedDays, percentage, getStageProgress, getDayProgress } = useProgress()

  // The earliest non-completed day — "next lesson"
  const nextDay = roadmap.find((d) => {
    const p = getDayProgress(d.day)
    return p.status !== 'completed'
  })

  // Published articles (up to 4)
  const publishedDays = roadmap.filter((d) => d.published && d.substackUrl).slice(0, 4)

  const { links } = siteConfig


  return (
    <div>
      {/* Hero */}
      <section
        className="border-b"
        style={{ borderColor: 'var(--color-ivory-border)' }}
        aria-labelledby="hero-heading"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <p
            className="text-xs font-mono uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-sage)' }}
          >
            A 70-day learning journey
          </p>
          <h1
            id="hero-heading"
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4"
            style={{ color: 'var(--color-charcoal)', maxWidth: '18ch' }}
          >
            Learn AI<br />With Me
          </h1>
          <p
            className="text-xs font-mono tracking-wide uppercase mb-6 font-medium"
            style={{ color: 'var(--color-sage)' }}
          >
            {siteConfig.tagline}
          </p>
          <p
            className="text-lg leading-relaxed mb-8 max-w-xl"
            style={{ color: 'var(--color-charcoal-muted)' }}
          >
            {siteConfig.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors"
              style={{ backgroundColor: 'var(--color-charcoal)', color: 'white' }}
            >
              Explore the roadmap
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            {nextDay && (
              <Link
                to={`/day/${nextDay.day}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium border transition-colors"
                style={{
                  borderColor: 'var(--color-ivory-border)',
                  color: 'var(--color-charcoal-muted)',
                  backgroundColor: 'white',
                }}
              >
                <BookOpen size={14} aria-hidden="true" />
                {completedDays > 0 ? 'Continue learning' : 'Start Day 1'}
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Progress overview */}
        <section className="py-14 border-b" style={{ borderColor: 'var(--color-ivory-border)' }} aria-labelledby="progress-heading">
          <div className="flex items-baseline justify-between mb-6">
            <h2 id="progress-heading" className="font-serif text-xl font-semibold" style={{ color: 'var(--color-charcoal)' }}>
              Your Progress
            </h2>
            <span className="text-xs text-[color:var(--color-text-tertiary)] font-mono">
              {completedDays} / 70 days
            </span>
          </div>

          {completedDays === 0 ? (
            <div
              className="rounded border p-6 text-center"
              style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
            >
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                No progress recorded yet — your journey starts when you do.
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                Progress is saved in your browser. It is private to you and never sent to a server.
              </p>
              {nextDay && (
                <Link
                  to={`/day/${nextDay.day}`}
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium transition-colors"
                  style={{ color: 'var(--color-sage)' }}
                >
                  Start with Day 1
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <ProgressBar value={percentage} label={`Overall: ${completedDays} of 70 days completed`} />
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                {stages.map((stage) => {
                  const { completed, total } = getStageProgress(stage.days)
                  const pct = Math.round((completed / total) * 100)
                  return (
                    <div key={stage.number} className="text-center">
                      <ProgressBar value={pct} small />
                      <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                        S{stage.number}: {completed}/{total}
                      </p>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                Progress is stored in this browser only. Clearing browser data will reset it.
              </p>
            </div>
          )}
        </section>

        {/* About the challenge */}
        <section className="py-14 border-b" style={{ borderColor: 'var(--color-ivory-border)' }} aria-labelledby="about-section-heading">
          <div className="max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--color-sage)' }}>
              About this challenge
            </p>
            <h2 id="about-section-heading" className="font-serif text-2xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
              Seventy days. One topic at a time.
            </h2>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
              <p>
                This is a structured, public learning journal documenting a journey from Python fundamentals to working AI systems. Every day has a clear topic, practical tasks, and a reflection question.
              </p>
              <p>
                The goal is not to become an AI expert in 70 days — that would be dishonest. The goal is to build a solid foundation: understanding concepts deeply, writing real code, and developing the habits of a working AI engineer.
              </p>
              <p>
                Each lesson is published on Substack as it is completed. The code lives on GitHub. Everything is built in the open.
              </p>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-1 mt-5 text-sm font-medium transition-colors"
              style={{ color: 'var(--color-sage)' }}
            >
              Read more about the challenge
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* Ten stages overview */}
        <section className="py-14 border-b" style={{ borderColor: 'var(--color-ivory-border)' }} aria-labelledby="stages-heading">
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--color-sage)' }}>
            The curriculum
          </p>
          <h2 id="stages-heading" className="font-serif text-2xl font-semibold mb-6" style={{ color: 'var(--color-charcoal)' }}>
            Ten stages, 70 days
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {stages.map((stage) => {
              const { completed } = getStageProgress(stage.days)
              return (
                <Link
                  key={stage.number}
                  to={`/roadmap?stage=${stage.number}`}
                  className="flex items-start gap-3 p-4 rounded border transition-all hover:shadow-sm group"
                  style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
                >
                  <span
                    className="flex-shrink-0 font-mono text-xs font-bold w-8 h-8 rounded flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-sage-pale)', color: 'var(--color-sage)' }}
                  >
                    {stage.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm font-medium group-hover:text-[color:var(--color-sage)] transition-colors"
                      style={{ color: 'var(--color-charcoal)' }}
                    >
                      {stage.name}
                    </h3>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                      Days {stage.days[0]}–{stage.days[stage.days.length - 1]}
                      {completed > 0 && ` · ${completed}/7 done`}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Next lesson */}
        {nextDay && (
          <section className="py-14 border-b" style={{ borderColor: 'var(--color-ivory-border)' }} aria-labelledby="next-lesson-heading">
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--color-sage)' }}>
              {completedDays > 0 ? 'Continue here' : 'Start here'}
            </p>
            <h2 id="next-lesson-heading" className="font-serif text-2xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
              {completedDays > 0 ? 'Next lesson' : 'Day 1'}
            </h2>
            <div className="max-w-lg">
              <DayCard day={nextDay} progress={getDayProgress(nextDay.day)} />
            </div>
          </section>
        )}

        {/* Published articles */}
        {publishedDays.length > 0 ? (
          <section className="py-14 border-b" style={{ borderColor: 'var(--color-ivory-border)' }} aria-labelledby="articles-heading">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--color-sage)' }}>
                  On Substack
                </p>
                <h2 id="articles-heading" className="font-serif text-2xl font-semibold" style={{ color: 'var(--color-charcoal)' }}>
                  Published lessons
                </h2>
              </div>
              {links.substack && (
                <a
                  href={links.substack}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium transition-colors"
                  style={{ color: 'var(--color-sage)' }}
                >
                  All articles
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
            <div className="space-y-3">
              {publishedDays.map((d) => (
                <a
                  key={d.day}
                  href={d.substackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded border transition-all hover:shadow-sm group"
                  style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
                >
                  <span className="font-mono text-xs pt-0.5" style={{ color: 'var(--color-text-tertiary)', minWidth: '2rem' }}>
                    {String(d.day).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm font-medium group-hover:text-[color:var(--color-sage)] transition-colors"
                      style={{ color: 'var(--color-charcoal)' }}
                    >
                      {d.title}
                    </h3>
                    <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {d.description}
                    </p>
                  </div>
                  <ExternalLink size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        ) : (
          <section className="py-14 border-b" style={{ borderColor: 'var(--color-ivory-border)' }} aria-labelledby="articles-heading">
            <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--color-sage)' }}>
              On Substack
            </p>
            <h2 id="articles-heading" className="font-serif text-2xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
              Articles
            </h2>
            <div
              className="rounded border p-6 text-center"
              style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
            >
              <Rss size={20} className="mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                No articles published yet. Lessons will appear here as they are written and published on Substack.
              </p>
              {links.substack && (
                <a
                  href={links.substack}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-4 text-sm font-medium transition-colors"
                  style={{ color: 'var(--color-sage)' }}
                >
                  Follow on Substack
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </section>
        )}

        {/* Projects */}
        <section className="py-14 border-b" style={{ borderColor: 'var(--color-ivory-border)' }} aria-labelledby="projects-heading">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--color-sage)' }}>
                Built during the challenge
              </p>
              <h2 id="projects-heading" className="font-serif text-2xl font-semibold" style={{ color: 'var(--color-charcoal)' }}>
                Projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: 'var(--color-sage)' }}
            >
              All projects
              <ArrowRight size={11} />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div
              className="rounded border p-6 text-center"
              style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
            >
              <Layers size={20} className="mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Projects will appear here as they are built. The first major project is planned for the end of Stage 2.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded border"
                  style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--color-charcoal)' }}>{p.title}</h3>
                    <StatusPill status={p.status} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{p.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {p.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--color-ivory-dark)', color: 'var(--color-text-secondary)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Social links */}
        <section className="py-14" aria-labelledby="connect-heading">
          <h2 id="connect-heading" className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--color-charcoal)' }}>
            Follow along
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Lessons are published on Substack as they are completed. Code lives on GitHub.
          </p>
          <CreatorLinks />
        </section>

      </div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    planned: { label: 'Planned', color: 'var(--color-text-secondary)', bg: 'var(--color-ivory-dark)' },
    'in-progress': { label: 'In Progress', color: 'var(--color-amber)', bg: 'var(--color-amber-pale)' },
    completed: { label: 'Completed', color: 'var(--color-sage)', bg: 'var(--color-sage-pale)' },
  }
  const cfg = map[status] ?? map.planned
  return (
    <span className="text-xs px-2 py-0.5 rounded font-medium flex-shrink-0" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {cfg.label}
    </span>
  )
}

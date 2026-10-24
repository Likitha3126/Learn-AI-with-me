import { ExternalLink, Layers } from 'lucide-react'
import { Github } from '../components/Icons'
import { projects } from '../data/projects'
import type { ProjectStatus } from '../data/projects'

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  planned: { label: 'Planned', color: 'var(--color-text-secondary)', bg: 'var(--color-ivory-dark)' },
  'in-progress': { label: 'In Progress', color: 'var(--color-amber)', bg: 'var(--color-amber-pale)' },
  completed: { label: 'Completed', color: 'var(--color-sage)', bg: 'var(--color-sage-pale)' },
}

export function ProjectsPage() {
  const completed = projects.filter((p) => p.status === 'completed')
  const inProgress = projects.filter((p) => p.status === 'in-progress')
  const planned = projects.filter((p) => p.status === 'planned')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--color-sage)' }}>
          Built during the challenge
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--color-charcoal)' }}>
          Projects & Experiments
        </h1>
        <p className="text-sm max-w-xl leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
          Real work built while learning. Each project is linked to the stage that taught the skills needed to build it.
          Projects are added here as they are completed — not before.
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-12">
          {completed.length > 0 && (
            <ProjectGroup title="Completed" projects={completed} />
          )}
          {inProgress.length > 0 && (
            <ProjectGroup title="In Progress" projects={inProgress} />
          )}
          {planned.length > 0 && (
            <ProjectGroup title="Planned" projects={planned} />
          )}
        </div>
      )}
    </div>
  )
}

function ProjectGroup({ title, projects: items }: { title: string; projects: typeof projects }) {
  return (
    <section aria-labelledby={`group-${title.toLowerCase()}`}>
      <h2
        id={`group-${title.toLowerCase()}`}
        className="font-serif text-xl font-semibold mb-4 pb-3 border-b"
        style={{ color: 'var(--color-charcoal)', borderColor: 'var(--color-ivory-border)' }}
      >
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {items.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project: p }: { project: typeof projects[0] }) {
  const cfg = statusConfig[p.status]
  return (
    <article
      className="flex flex-col p-5 rounded border"
      style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif font-semibold text-base leading-tight" style={{ color: 'var(--color-charcoal)' }}>
          {p.title}
        </h3>
        <span
          className="flex-shrink-0 text-xs px-2 py-0.5 rounded font-medium"
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Problem */}
      <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
        Problem
      </p>
      <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-charcoal-muted)' }}>
        {p.problem}
      </p>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-charcoal-muted)' }}>
        {p.description}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {p.technologies.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ backgroundColor: 'var(--color-ivory-dark)', color: 'var(--color-charcoal-muted)' }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Related days */}
      {p.relatedDays.length > 0 && (
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
          Related days:{' '}
          {p.relatedDays.map((d, i) => (
            <span key={d}>
              {i > 0 && ', '}
              <a
                href={`/day/${d}`}
                className="font-mono hover:underline"
                style={{ color: 'var(--color-sage)' }}
              >
                {d}
              </a>
            </span>
          ))}
        </p>
      )}

      {/* Links */}
      <div className="mt-auto flex flex-wrap gap-2">
        {p.githubUrl && (
          <a
            href={p.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border font-medium transition-colors hover:shadow-sm"
            style={{ borderColor: 'var(--color-ivory-border)', color: 'var(--color-charcoal-muted)' }}
          >
            <Github size={12} aria-hidden="true" /> View code
          </a>
        )}
        {p.demoUrl && (
          <a
            href={p.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border font-medium transition-colors hover:shadow-sm"
            style={{ borderColor: 'var(--color-sage-border)', backgroundColor: 'var(--color-sage-pale)', color: 'var(--color-sage)' }}
          >
            <ExternalLink size={12} aria-hidden="true" /> Live demo
          </a>
        )}
      </div>
    </article>
  )
}

function EmptyState() {
  return (
    <div className="space-y-6">
      {/* Current empty state */}
      <div
        className="rounded border p-8 text-center"
        style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
      >
        <Layers size={24} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
        <h2 className="font-serif text-lg font-semibold mb-2" style={{ color: 'var(--color-charcoal)' }}>
          No projects yet
        </h2>
        <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Projects will appear here as they are built during the 70-day challenge. The first mini-project
          is planned at the end of Stage 2 (Day 14), with larger projects at Stage 6 (Day 42) and the capstone in Stage 10.
        </p>
      </div>

      {/* Planned milestones */}
      <div>
        <h2 className="font-serif text-xl font-semibold mb-4 pb-3 border-b" style={{ color: 'var(--color-charcoal)', borderColor: 'var(--color-ivory-border)' }}>
          Planned project milestones
        </h2>
        <div className="space-y-3">
          {[
            { day: 14, title: 'Mini-Project: Investigating a Real Dataset', stage: 'Stage 2' },
            { day: 42, title: 'End-to-End Machine Learning Model', stage: 'Stage 6' },
            { day: 56, title: 'NLP Application', stage: 'Stage 8' },
            { day: 63, title: 'RAG System Evaluation', stage: 'Stage 9' },
            { day: 69, title: 'Integrated Capstone Project', stage: 'Stage 10' },
          ].map(({ day, title, stage }) => (
            <div
              key={day}
              className="flex items-center gap-3 p-3 rounded border"
              style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'var(--color-ivory-dark)' }}
            >
              <span
                className="flex-shrink-0 text-xs font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: 'var(--color-ivory-border)', color: 'var(--color-text-tertiary)' }}
              >
                {stage}
              </span>
              <span className="text-sm" style={{ color: 'var(--color-charcoal-muted)' }}>Day {day}: {title}</span>
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: 'var(--color-ivory-dark)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-ivory-border)' }}
              >
                Planned
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

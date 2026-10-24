// src/pages/AboutPage.tsx
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, BookOpen, ExternalLink } from 'lucide-react'
import { stages } from '../data/roadmap'
import { CreatorLinks } from '../components/CreatorLinks'

export function AboutPage() {

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--color-sage)' }}>
          About this challenge
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-charcoal)' }}>
          The 70-Day AI Learning Challenge
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
          A public learning journal. No pretense of instant mastery — just consistent, deliberate study, one topic at a time.
        </p>
      </div>

      <div className="space-y-12">
        {/* Why */}
        <section aria-labelledby="why-heading">
          <h2 id="why-heading" className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
            Why this challenge exists
          </h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
            <p>
              AI engineering is a real skill set — not a collection of API calls. Building a genuine foundation requires
              understanding mathematics, writing real code, training real models, and confronting the failures honestly.
            </p>
            <p>
              This challenge was created to do exactly that in public. Not because 70 days makes anyone an expert —
              it does not — but because structured, daily learning compounds in a way that occasional reading does not.
            </p>
            <p>
              Learning in public also creates accountability. When you write about what you studied, you discover
              quickly what you do and do not understand. The articles on Substack are part of that process.
            </p>
          </div>
        </section>

        {/* What 70 days covers */}
        <section aria-labelledby="curriculum-heading">
          <h2 id="curriculum-heading" className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
            What 70 days covers
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--color-charcoal-muted)' }}>
            The curriculum is organized into ten stages of seven days each. Each stage builds on the previous.
          </p>
          <div className="space-y-2">
            {stages.map((stage) => (
              <Link
                key={stage.number}
                to={`/roadmap?stage=${stage.number}`}
                className="flex items-center gap-3 p-3 rounded border transition-all hover:shadow-sm group"
                style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'white' }}
              >
                <span
                  className="flex-shrink-0 font-mono text-xs font-bold w-7 h-7 rounded flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-sage-pale)', color: 'var(--color-sage)' }}
                >
                  {stage.number}
                </span>
                <span className="text-sm font-medium group-hover:text-[color:var(--color-sage)] transition-colors" style={{ color: 'var(--color-charcoal)' }}>
                  {stage.name}
                </span>
                <span className="ml-auto text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                  Days {stage.days[0]}–{stage.days[stage.days.length - 1]}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading">
          <h2 id="how-heading" className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
            How the daily process works
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: <BookOpen size={16} />,
                title: 'Study the concept',
                body: 'Each day introduces one topic with clear learning objectives and a short description. The focus is on genuine understanding, not surface familiarity.',
              },
              {
                icon: <Clock size={16} />,
                title: 'Complete the practical tasks',
                body: 'Every lesson has 3–6 actionable tasks: writing code, running experiments, or analyzing results. These are estimated at 60–180 minutes depending on the complexity.',
              },
              {
                icon: <ArrowRight size={16} />,
                title: 'Reflect honestly',
                body: 'Each lesson ends with a reflection question. Writing the answer — even imperfectly — reveals what you actually understood versus what you only thought you understood.',
              },
              {
                icon: <ExternalLink size={16} />,
                title: 'Publish on Substack',
                body: 'Completed lessons are written up and published on Substack. The writing process forces clarity and creates a searchable record of the journey.',
              },
            ].map(({ icon, title, body }, i) => (
              <div key={i} className="flex gap-4">
                <span
                  className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: 'var(--color-sage-pale)', color: 'var(--color-sage)' }}
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-charcoal)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why practical */}
        <section aria-labelledby="practical-heading">
          <h2 id="practical-heading" className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
            Why practical implementation matters
          </h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
            <p>
              Reading about gradient descent feels like understanding it. Writing a gradient descent implementation from
              scratch, watching it converge slowly with a high learning rate, and debugging the moment it diverges —
              that is actual understanding.
            </p>
            <p>
              This challenge prioritizes code. Every concept that can be demonstrated in code is demonstrated in code.
              Every claim about model behavior is tested empirically rather than taken on faith.
            </p>
          </div>
        </section>

        {/* Your progress and notes */}
        <section
          className="rounded border p-6"
          style={{ borderColor: 'var(--color-sage-border)', backgroundColor: 'var(--color-sage-pale)' }}
          aria-labelledby="visitor-section-heading"
        >
          <h2 id="visitor-section-heading" className="font-serif text-xl font-semibold mb-3" style={{ color: 'var(--color-charcoal)' }}>
            Your progress tracker and notes
          </h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
            <p>
              Every lesson page has a personal progress tracker and a notes editor. Both are entirely private —
              stored in your browser's localStorage and never sent to a server.
            </p>
            <p>
              You can mark each day as Not Started, In Progress, or Completed. You can check off individual tasks.
              You can write Markdown notes, preview them, download them as .md files, and clear them.
            </p>
            <p>
              <strong style={{ color: 'var(--color-charcoal)' }}>Important:</strong> Because progress and notes live only
              in your browser, they will not transfer to other devices and may be lost if you clear your browser data.
              Download your notes periodically if you want to keep them.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded transition-colors"
              style={{ backgroundColor: 'var(--color-sage)', color: 'white' }}
            >
              View the roadmap <ArrowRight size={13} />
            </Link>
            <Link
              to="/day/1"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded border transition-colors"
              style={{ borderColor: 'var(--color-sage-border)', color: 'var(--color-sage)' }}
            >
              Start Day 1
            </Link>
          </div>
        </section>

        {/* Creator links */}
        <section aria-labelledby="find-me-heading">
          <h2 id="find-me-heading" className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-charcoal)' }}>
            Find me online
          </h2>
          <CreatorLinks variant="cards" />
        </section>
      </div>
    </div>
  )
}

// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--color-sage)' }}>
        404 — Page not found
      </p>
      <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: 'var(--color-charcoal)' }}>
        This page doesn't exist
      </h1>
      <p className="text-sm mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--color-charcoal-muted)' }}>
        The page you're looking for isn't here. If you were looking for a specific day, make sure the day number is between 1 and 70.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors"
          style={{ backgroundColor: 'var(--color-charcoal)', color: 'white' }}
        >
          <ArrowLeft size={14} />
          Go home
        </Link>
        <Link
          to="/roadmap"
          className="flex items-center gap-2 px-5 py-2.5 rounded border text-sm font-medium transition-colors"
          style={{ borderColor: 'var(--color-ivory-border)', color: 'var(--color-charcoal-muted)', backgroundColor: 'white' }}
        >
          <BookOpen size={14} />
          View roadmap
        </Link>
      </div>
    </div>
  )
}

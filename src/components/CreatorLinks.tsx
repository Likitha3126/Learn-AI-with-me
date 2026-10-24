import { siteConfig } from '../data/siteConfig'
import { Github, Twitter, Substack } from './Icons'

interface CreatorLinksProps {
  variant?: 'inline' | 'cards' | 'footer'
  className?: string
}

export function CreatorLinks({ variant = 'inline', className = '' }: CreatorLinksProps) {
  const { creator } = siteConfig

  const links = [
    {
      name: 'Substack',
      label: 'Read on Substack',
      href: creator.substackProfileUrl,
      icon: <Substack size={15} />,
      description: 'Articles, essays, and deep dives',
    },
    {
      name: 'X (Twitter)',
      label: '@Likitha_3126 on X',
      href: creator.xUrl,
      icon: <Twitter size={14} />,
      description: 'Daily thoughts and progress updates',
    },
    {
      name: 'GitHub',
      label: 'Likitha3126 on GitHub',
      href: creator.githubUrl,
      icon: <Github size={15} />,
      description: 'Code repositories and implementations',
    },
  ]

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-4 rounded border transition-all duration-150 hover:shadow-sm group"
            style={{
              borderColor: 'var(--color-ivory-border)',
              backgroundColor: 'white',
            }}
            aria-label={link.label}
          >
            <div className="flex items-center gap-2 mb-1.5" style={{ color: 'var(--color-sage)' }}>
              {link.icon}
              <span className="font-medium text-sm text-[color:var(--color-charcoal)] group-hover:text-[color:var(--color-sage)] transition-colors">
                {link.name}
              </span>
            </div>
            <p className="text-xs text-[color:var(--color-text-secondary)]">
              {link.description}
            </p>
          </a>
        ))}
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-charcoal)] transition-colors"
            aria-label={link.label}
          >
            <span style={{ color: 'var(--color-sage)' }}>{link.icon}</span>
            <span>{link.name}</span>
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded border text-xs font-medium transition-colors hover:shadow-sm"
          style={{
            borderColor: 'var(--color-ivory-border)',
            color: 'var(--color-charcoal-muted)',
            backgroundColor: 'white',
          }}
          aria-label={link.label}
        >
          <span style={{ color: 'var(--color-sage)' }}>{link.icon}</span>
          <span>{link.name}</span>
        </a>
      ))}
    </div>
  )
}

// src/components/Layout.tsx
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  BookOpen, Map, Layers, Info, BarChart2, Menu, X,
  User as UserIcon, LogIn
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { siteConfig } from '../data/siteConfig'
import { useProgress } from '../hooks/useProgress'
import { useAuth } from '../contexts/AuthContext'
import { LocalDataMigrationBanner } from './LocalDataMigrationBanner'
import { CreatorLinks } from './CreatorLinks'

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm font-medium transition-colors duration-150 pb-0.5 border-b-2 ${
          isActive
            ? 'text-[color:var(--color-charcoal)] border-[color:var(--color-sage)]'
            : 'text-[color:var(--color-text-secondary)] border-transparent hover:text-[color:var(--color-charcoal)] hover:border-[color:var(--color-ivory-border)]'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { percentage, completedDays } = useProgress()
  const { user, profile } = useAuth()
  const location = useLocation()

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const userDisplayName = profile?.display_name || user?.email?.split('@')[0] || 'Account'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-ivory)' }}>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[color:var(--color-charcoal)] focus:rounded focus:shadow-lg focus:text-sm"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'rgba(250,248,244,0.95)',
          backdropFilter: 'blur(8px)',
          borderColor: 'var(--color-ivory-border)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-[color:var(--color-charcoal)] hover:text-[color:var(--color-sage)] transition-colors"
            >
              <BookOpen size={18} className="text-[color:var(--color-sage)]" aria-hidden="true" />
              <span className="font-serif font-semibold text-base tracking-tight">Learn AI With Me</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/roadmap">Roadmap</NavItem>
              <NavItem to="/projects">Projects</NavItem>
              <NavItem to="/about">About</NavItem>

              {/* Progress link */}
              <Link
                to="/my-progress"
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border transition-colors"
                style={{
                  borderColor: 'var(--color-sage-border)',
                  color: 'var(--color-sage)',
                  backgroundColor: 'var(--color-sage-pale)',
                }}
                aria-label={`My progress: ${completedDays} days completed, ${percentage}%`}
              >
                <BarChart2 size={12} aria-hidden="true" />
                <span>My Progress</span>
                {completedDays > 0 && (
                  <span
                    className="font-mono text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: 'var(--color-sage)', color: 'white' }}
                  >
                    {percentage}%
                  </span>
                )}
              </Link>

              {/* Auth button */}
              {user ? (
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border transition-colors hover:shadow-sm"
                  style={{
                    borderColor: 'var(--color-ivory-border)',
                    backgroundColor: 'white',
                    color: 'var(--color-charcoal)',
                  }}
                  aria-label={`Signed in as ${user.email}. View account.`}
                >
                  <UserIcon size={12} style={{ color: 'var(--color-sage)' }} />
                  <span className="max-w-[120px] truncate">{userDisplayName}</span>
                </Link>
              ) : (
                <Link
                  to="/signin"
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded transition-colors"
                  style={{
                    backgroundColor: 'var(--color-charcoal)',
                    color: 'white',
                  }}
                >
                  <LogIn size={12} />
                  <span>Sign In</span>
                </Link>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-charcoal)] transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t px-4 py-4 space-y-3"
            style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'var(--color-ivory)' }}
          >
            {[
              { to: '/', label: 'Home', icon: <BookOpen size={15} /> },
              { to: '/roadmap', label: 'Roadmap', icon: <Map size={15} /> },
              { to: '/projects', label: 'Projects', icon: <Layers size={15} /> },
              { to: '/about', label: 'About', icon: <Info size={15} /> },
              { to: '/my-progress', label: 'My Progress', icon: <BarChart2 size={15} /> },
            ].map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[color:var(--color-sage-pale)] text-[color:var(--color-sage)]'
                      : 'text-[color:var(--color-charcoal-muted)] hover:bg-white'
                  }`
                }
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}

            <div className="pt-2 border-t" style={{ borderColor: 'var(--color-ivory-border)' }}>
              {user ? (
                <Link
                  to="/account"
                  className="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium bg-white text-[color:var(--color-charcoal)] border"
                  style={{ borderColor: 'var(--color-ivory-border)' }}
                >
                  <UserIcon size={15} style={{ color: 'var(--color-sage)' }} />
                  <span>Account ({userDisplayName})</span>
                </Link>
              ) : (
                <Link
                  to="/signin"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium text-white"
                  style={{ backgroundColor: 'var(--color-charcoal)' }}
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Migration notice for signed in users with local guest data */}
      <LocalDataMigrationBanner />

      {/* Main content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

function Footer() {
  const { creator } = siteConfig
  const { user } = useAuth()
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t mt-16"
      style={{ borderColor: 'var(--color-ivory-border)', backgroundColor: 'var(--color-ivory-dark)' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-[color:var(--color-sage)]" aria-hidden="true" />
              <span className="font-serif font-semibold text-sm text-[color:var(--color-charcoal)]">
                Learn AI With Me
              </span>
            </div>
            <p className="text-xs text-[color:var(--color-text-secondary)] leading-relaxed">
              {siteConfig.subtitle}
            </p>
            <p className="text-xs text-[color:var(--color-sage)] font-mono mt-1">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)] mb-2">Curriculum</p>
              <nav className="flex flex-col gap-1.5">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/roadmap', label: 'Roadmap' },
                  { to: '/projects', label: 'Projects' },
                  { to: '/about', label: 'About' },
                  { to: '/my-progress', label: 'My Progress' },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-xs text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-charcoal)] transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)] mb-2">Creator</p>
              <CreatorLinks variant="footer" />
            </div>
          </div>
        </div>

        <div
          className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
          style={{ borderColor: 'var(--color-ivory-border)' }}
        >
          <p className="text-xs text-[color:var(--color-text-tertiary)]">
            © {year} {creator.name}. A public learning journal.
          </p>
          <p className="text-xs text-[color:var(--color-text-tertiary)]">
            {user
              ? `Signed in as ${user.email} • Cloud progress synchronized`
              : 'Guest mode • Progress and notes are private to this browser'}
          </p>
        </div>
      </div>
    </footer>
  )
}

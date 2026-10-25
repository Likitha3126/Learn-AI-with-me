import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { RoadmapPage } from '../pages/RoadmapPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { AboutPage } from '../pages/AboutPage'
import { DayPage } from '../pages/DayPage'
import { NotFoundPage } from '../pages/NotFoundPage'

describe('Page render tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders HomePage with hero and stage cards', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Learn AI\s*With Me/i)
    expect(screen.getByText(/Learn it\. Build it\. Explain it\. Share it\./i)).toBeInTheDocument()
    expect(screen.getByText(/Explore the roadmap/i)).toBeInTheDocument()
  })

  it('renders RoadmapPage with filters and stages', () => {
    render(
      <MemoryRouter>
        <RoadmapPage />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: /70-Day Roadmap/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search by title/i)).toBeInTheDocument()
  })

  it('renders ProjectsPage with project milestones', () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: /Projects & Experiments/i })).toBeInTheDocument()
    expect(screen.getByText(/No projects yet/i)).toBeInTheDocument()
    expect(screen.getByText(/Planned project milestones/i)).toBeInTheDocument()
  })

  it('renders AboutPage with challenge details', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: /The 70-Day AI Learning Challenge/i })).toBeInTheDocument()
    expect(screen.getByText(/Why this challenge exists/i)).toBeInTheDocument()
  })

  it('renders DayPage for Day 1 with published Substack article link', () => {
    render(
      <MemoryRouter initialEntries={['/day/1']}>
        <Routes>
          <Route path="/day/:dayNumber" element={<DayPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: /What Does an AI Engineer Actually Do\?/i })).toBeInTheDocument()
    expect(screen.getAllByText(/Day 1/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Personal Notes/i).length).toBeGreaterThanOrEqual(1)

    // Verify Read the Substack article link
    const substackLink = screen.getByRole('link', { name: /Read the Substack article/i })
    expect(substackLink).toBeInTheDocument()
    expect(substackLink).toHaveAttribute(
      'href',
      'https://likitha3126.substack.com/p/day-170-okay-im-actually-starting?r=8xcaev'
    )
    expect(substackLink).toHaveAttribute('target', '_blank')
    expect(substackLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders DayPage for an unpublished day with "Article coming soon" notice', () => {
    render(
      <MemoryRouter initialEntries={['/day/2']}>
        <Routes>
          <Route path="/day/:dayNumber" element={<DayPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText(/Article coming soon/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Read the Substack article/i })).not.toBeInTheDocument()
  })

  it('renders NotFoundPage with navigation back home', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: /This page doesn't exist/i })).toBeInTheDocument()
    expect(screen.getByText(/Go home/i)).toBeInTheDocument()
  })
})

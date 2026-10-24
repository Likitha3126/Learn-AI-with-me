import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar'
import { DayCard } from '../components/DayCard'
import { Layout } from '../components/Layout'
import { roadmap } from '../data/roadmap'

describe('ProgressBar component', () => {
  it('renders progress bar with correct aria attributes', () => {
    render(<ProgressBar value={45} label="Overall completion" />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '45')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(screen.getByText('Overall completion')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
  })

  it('clamps value between 0 and 100', () => {
    render(<ProgressBar value={150} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '100')
  })
})

describe('DayCard component', () => {
  const day1 = roadmap[0]

  it('renders day information in compact mode', () => {
    render(
      <MemoryRouter>
        <DayCard day={day1} compact={true} />
      </MemoryRouter>
    )
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText(day1.title)).toBeInTheDocument()
  })

  it('renders full day card with objectives and tasks count', () => {
    render(
      <MemoryRouter>
        <DayCard day={day1} compact={false} progress={{ status: 'in-progress', completedTasks: [0] }} />
      </MemoryRouter>
    )
    expect(screen.getByText(day1.title)).toBeInTheDocument()
    expect(screen.getByText(day1.description)).toBeInTheDocument()
    expect(screen.getByText('In progress')).toBeInTheDocument()
  })
})

describe('Layout component', () => {
  it('renders navigation links and main container', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout>
          <div>Child Content</div>
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getAllByText('Learn AI With Me').length).toBeGreaterThanOrEqual(1)
    const nav = screen.getByRole('navigation', { name: /Main navigation/i })
    expect(nav).toHaveTextContent('Home')
    expect(nav).toHaveTextContent('Roadmap')
    expect(nav).toHaveTextContent('Projects')
    expect(nav).toHaveTextContent('About')
    expect(screen.getByText('Child Content')).toBeInTheDocument()
    expect(screen.getByText('Skip to main content')).toBeInTheDocument()
  })
})

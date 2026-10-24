// src/test/notes-flow.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { DayPage } from '../pages/DayPage'
import * as AuthContextModule from '../contexts/AuthContext'

function renderDayPage() {
  return render(
    <MemoryRouter initialEntries={['/day/1']}>
      <Routes>
        <Route path="/day/:dayNumber" element={<DayPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Notes Flow and Safe Markdown Rendering', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      session: null,
      profile: null,
      loading: false,
      isConfigured: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
      deleteAccount: vi.fn(),
      refreshProfile: vi.fn(),
    })
  })

  it('renders notes editor with zero words initially', () => {
    renderDayPage()

    expect(screen.getByRole('heading', { level: 2, name: /Personal Notes/i })).toBeInTheDocument()
    expect(screen.getByText('0 words')).toBeInTheDocument()
    expect(screen.getByText(/· Saved/i)).toBeInTheDocument()
  })

  it('updates word count and marks unsaved when typing', () => {
    renderDayPage()

    const textarea = screen.getByPlaceholderText(/Start writing your notes for today's lesson/i)
    fireEvent.change(textarea, { target: { value: 'Learning Python list comprehensions and generators' } })

    expect(screen.getByText('6 words')).toBeInTheDocument()
    expect(screen.getByText(/· Unsaved/i)).toBeInTheDocument()
  })

  it('toggles markdown preview and safely renders markdown without executing scripts', () => {
    renderDayPage()

    const textarea = screen.getByPlaceholderText(/Start writing your notes for today's lesson/i)
    const dangerousContent = '### Key Takeaway\n\n**Bold concept** and *italic concept*.\n\n<script>alert("xss")</script>'
    fireEvent.change(textarea, { target: { value: dangerousContent } })

    // Switch to preview mode
    const previewButton = screen.getByRole('button', { name: /Preview/i })
    fireEvent.click(previewButton)

    // Heading and formatting rendered
    expect(screen.getByRole('heading', { level: 3, name: 'Key Takeaway' })).toBeInTheDocument()
    expect(screen.getByText('Bold concept')).toBeInTheDocument()
    expect(screen.getByText('italic concept')).toBeInTheDocument()

    // Script tag is stripped/escaped by react-markdown and NOT present as an executable script element
    const scriptElements = document.querySelectorAll('script')
    const inlineAlert = Array.from(scriptElements).find((s) => s.textContent?.includes('alert("xss")'))
    expect(inlineAlert).toBeUndefined()
  })

  it('handles load template action with confirmation', () => {
    renderDayPage()

    const templateButton = screen.getByRole('button', { name: /Load template/i })
    fireEvent.click(templateButton)

    const textarea = screen.getByPlaceholderText(/Start writing your notes for today's lesson/i) as HTMLTextAreaElement
    expect(textarea.value).toContain('# Day 1 — What Does an AI Engineer Actually Do?')
    expect(textarea.value).toContain('## What I learned today')
  })

  it('handles clear notes flow with confirmation dialog', () => {
    renderDayPage()

    const textarea = screen.getByPlaceholderText(/Start writing your notes for today's lesson/i)
    fireEvent.change(textarea, { target: { value: 'Notes to be discarded' } })

    const clearButton = screen.getByRole('button', { name: /Clear/i })
    fireEvent.click(clearButton)

    // Confirmation prompt appears
    expect(screen.getByText(/Delete notes\?/i)).toBeInTheDocument()
    const yesButton = screen.getByRole('button', { name: 'Yes' })
    fireEvent.click(yesButton)

    // Notes cleared
    expect((screen.getByPlaceholderText(/Start writing your notes for today's lesson/i) as HTMLTextAreaElement).value).toBe('')
  })
})

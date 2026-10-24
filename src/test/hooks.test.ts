import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from '../hooks/useProgress'
import { useNotes, defaultNoteTemplate } from '../hooks/useNotes'

describe('useProgress hook', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with zero completed days', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.completedDays).toBe(0)
    expect(result.current.percentage).toBe(0)
    expect(result.current.totalDays).toBe(70)
  })

  it('updates day status to completed and recalculates percentage', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.setDayStatus(1, 'completed')
    })

    expect(result.current.completedDays).toBe(1)
    expect(result.current.getDayProgress(1).status).toBe('completed')
    expect(result.current.percentage).toBe(Math.round((1 / 70) * 100))
  })

  it('toggles task completion properly', () => {
    const { result } = renderHook(() => useProgress())

    // toggle task 0
    act(() => {
      result.current.toggleTask(1, 0)
    })
    expect(result.current.getDayProgress(1).completedTasks).toEqual([0])

    // toggle task 1
    act(() => {
      result.current.toggleTask(1, 1)
    })
    expect(result.current.getDayProgress(1).completedTasks).toEqual([0, 1])

    // untoggle task 0
    act(() => {
      result.current.toggleTask(1, 0)
    })
    expect(result.current.getDayProgress(1).completedTasks).toEqual([1])
  })

  it('calculates stage progress correctly', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.setDayStatus(1, 'completed')
      result.current.setDayStatus(2, 'completed')
    })

    const stage1Stats = result.current.getStageProgress([1, 2, 3, 4, 5, 6, 7])
    expect(stage1Stats.completed).toBe(2)
    expect(stage1Stats.total).toBe(7)
  })

  it('resets progress cleanly', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.setDayStatus(1, 'completed')
      result.current.setDayStatus(2, 'in-progress')
    })

    expect(result.current.completedDays).toBe(1)

    act(() => {
      result.current.resetProgress()
    })

    expect(result.current.completedDays).toBe(0)
    expect(result.current.inProgressDays).toBe(0)
    expect(result.current.getDayProgress(1).status).toBe('not-started')
  })
})

describe('useNotes hook', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('generates a comprehensive default note template', () => {
    const template = defaultNoteTemplate(5, 'Gradient Descent')
    expect(template).toContain('# Day 5 — Gradient Descent')
    expect(template).toContain('## What I learned')
    expect(template).toContain('```python')
  })

  it('initializes empty and computes word count correctly', () => {
    const { result } = renderHook(() => useNotes(1))
    expect(result.current.content).toBe('')
    expect(result.current.wordCount).toBe(0)
    expect(result.current.saved).toBe(true)

    act(() => {
      result.current.updateContent('Deep learning fundamentals and neural networks')
    })

    expect(result.current.content).toBe('Deep learning fundamentals and neural networks')
    expect(result.current.wordCount).toBe(6)
    expect(result.current.saved).toBe(false)
  })

  it('saves and clears notes in localStorage', () => {
    const { result } = renderHook(() => useNotes(2))

    act(() => {
      result.current.updateContent('Day 2 notes')
    })
    expect(result.current.saved).toBe(false)

    act(() => {
      result.current.saveNotes()
    })
    expect(result.current.saved).toBe(true)
    expect(localStorage.getItem('learn-ai-notes-day-2')).toBe('Day 2 notes')

    act(() => {
      result.current.clearNotes()
    })
    expect(result.current.content).toBe('')
    expect(localStorage.getItem('learn-ai-notes-day-2')).toBeNull()
  })
})

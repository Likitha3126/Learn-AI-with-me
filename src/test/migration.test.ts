import { describe, it, expect, beforeEach, vi } from 'vitest'
import { inspectLocalData, migrateLocalDataToCloud } from '../lib/migration'

describe('Local data migration utility', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('detects no local data when localStorage is empty', () => {
    const summary = inspectLocalData()
    expect(summary.hasData).toBe(false)
    expect(summary.completedCount).toBe(0)
    expect(summary.notesCount).toBe(0)
  })

  it('accurately counts completed days and note items from localStorage', () => {
    // Populate localStorage with guest progress
    localStorage.setItem(
      'learn-ai-with-me-progress',
      JSON.stringify({
        days: {
          1: { status: 'completed', completedTasks: [0, 1] },
          2: { status: 'in-progress', completedTasks: [0] },
          3: { status: 'completed', completedTasks: [0, 1, 2] },
        },
        lastUpdated: new Date().toISOString(),
      })
    )

    // Populate notes
    localStorage.setItem('learn-ai-notes-day-1', '# My Day 1 Notes')
    localStorage.setItem('learn-ai-notes-day-2', '') // empty, should not count
    localStorage.setItem('learn-ai-notes-day-5', 'Day 5 study remarks')

    const summary = inspectLocalData()
    expect(summary.hasData).toBe(true)
    expect(summary.completedCount).toBe(2)
    expect(summary.inProgressCount).toBe(1)
    expect(summary.notesCount).toBe(2)
    expect(summary.noteDays).toEqual([1, 5])
  })

  it('safely completes migration when no local data exists', async () => {
    const result = await migrateLocalDataToCloud('test-user-id')
    expect(result.success).toBe(true)
    expect(result.migratedProgressCount).toBe(0)
    expect(result.migratedNotesCount).toBe(0)
  })
})

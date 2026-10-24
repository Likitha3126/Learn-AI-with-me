// src/lib/migration.ts
// ─────────────────────────────────────────────────────────────────────────────
// LOCAL DATA MIGRATION UTILITIES
// Inspects and imports guest progress & notes from localStorage to Supabase
// without silent data loss.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from './supabase'
import { loadLocalProgress } from '../hooks/useProgress'
import { loadLocalNote } from '../hooks/useNotes'
import type { Database, UserDayProgress, DayStatus } from '../types/database'

export interface LocalDataSummary {
  hasData: boolean
  completedCount: number
  inProgressCount: number
  notesCount: number
  noteDays: number[]
}

export function inspectLocalData(): LocalDataSummary {
  const progressState = loadLocalProgress()
  const days = progressState.days ?? {}

  let completedCount = 0
  let inProgressCount = 0

  Object.values(days).forEach((p) => {
    if (p.status === 'completed') completedCount++
    else if (p.status === 'in-progress') inProgressCount++
  })

  const noteDays: number[] = []
  for (let day = 1; day <= 70; day++) {
    const note = loadLocalNote(day)
    if (note && note.trim().length > 0) {
      noteDays.push(day)
    }
  }

  const hasData = completedCount > 0 || inProgressCount > 0 || noteDays.length > 0

  return {
    hasData,
    completedCount,
    inProgressCount,
    notesCount: noteDays.length,
    noteDays,
  }
}

export interface MigrationResult {
  success: boolean
  migratedProgressCount: number
  migratedNotesCount: number
  conflicts: number[]
  errorMessage?: string
}

export async function migrateLocalDataToCloud(
  userId: string,
  resolveConflict: 'keep_cloud' | 'overwrite_with_local' = 'keep_cloud'
): Promise<MigrationResult> {
  const localSummary = inspectLocalData()
  if (!localSummary.hasData) {
    return {
      success: true,
      migratedProgressCount: 0,
      migratedNotesCount: 0,
      conflicts: [],
    }
  }

  let migratedProgressCount = 0
  let migratedNotesCount = 0
  const conflicts: number[] = []

  try {
    // 1. Fetch existing cloud progress to merge intelligently
    const { data: cloudProgressRows } = await supabase
      .from('user_day_progress')
      .select('*')
      .eq('user_id', userId)

    const cloudProgressMap = new Map<number, UserDayProgress>()
    if (cloudProgressRows) {
      (cloudProgressRows as UserDayProgress[]).forEach((row) =>
        cloudProgressMap.set(row.day_number, row)
      )
    }

    const localProgress = loadLocalProgress()
    const progressInserts: Database['public']['Tables']['user_day_progress']['Insert'][] = []

    for (const [dayStr, dayProg] of Object.entries(localProgress.days)) {
      const dayNum = Number(dayStr)
      if (dayNum < 1 || dayNum > 70) continue

      const cloudRow = cloudProgressMap.get(dayNum)

      // Merge completed tasks
      const cloudTasks = cloudRow?.completed_tasks ?? []
      const localTasks = dayProg.completedTasks ?? []
      const mergedTasks = Array.from(new Set([...cloudTasks, ...localTasks]))

      // Cloud 'completed' status wins over local 'in-progress'
      let finalStatus: DayStatus =
        dayProg.status === 'in-progress'
          ? 'in_progress'
          : dayProg.status === 'not-started'
          ? 'not_started'
          : 'completed'

      if (cloudRow?.status === 'completed') {
        finalStatus = 'completed'
      }

      progressInserts.push({
        user_id: userId,
        day_number: dayNum,
        status: finalStatus,
        completed_tasks: mergedTasks,
        updated_at: new Date().toISOString(),
      })
      migratedProgressCount++
    }

    if (progressInserts.length > 0) {
      const { error: progError } = await supabase
        .from('user_day_progress')
        .upsert(progressInserts, { onConflict: 'user_id,day_number' })

      if (progError) throw progError
    }

    // 2. Fetch existing cloud notes to check for conflicts
    const { data: cloudNotesRows } = await supabase
      .from('user_day_notes')
      .select('day_number, notes_markdown')
      .eq('user_id', userId)

    const cloudNotesMap = new Map<number, string>()
    if (cloudNotesRows) {
      (cloudNotesRows as { day_number: number; notes_markdown: string }[]).forEach((row) => {
        if (row.notes_markdown && row.notes_markdown.trim().length > 0) {
          cloudNotesMap.set(row.day_number, row.notes_markdown)
        }
      })
    }

    const noteInserts: Database['public']['Tables']['user_day_notes']['Insert'][] = []

    for (const day of localSummary.noteDays) {
      const localNote = loadLocalNote(day)
      const existingCloud = cloudNotesMap.get(day)

      if (existingCloud && existingCloud !== localNote) {
        conflicts.push(day)
        if (resolveConflict === 'keep_cloud') {
          continue // preserve cloud note
        }
      }

      noteInserts.push({
        user_id: userId,
        day_number: day,
        notes_markdown: localNote,
        updated_at: new Date().toISOString(),
      })
      migratedNotesCount++
    }

    if (noteInserts.length > 0) {
      const { error: noteError } = await supabase
        .from('user_day_notes')
        .upsert(noteInserts, { onConflict: 'user_id,day_number' })

      if (noteError) throw noteError
    }

    // Record migration timestamp in localStorage so we don't nag repeatedly
    try {
      localStorage.setItem('learn-ai-migrated-at', new Date().toISOString())
    } catch {
      // ignore
    }

    return {
      success: true,
      migratedProgressCount,
      migratedNotesCount,
      conflicts,
    }
  } catch (err) {
    return {
      success: false,
      migratedProgressCount,
      migratedNotesCount,
      conflicts,
      errorMessage: err instanceof Error ? err.message : 'Migration failed',
    }
  }
}

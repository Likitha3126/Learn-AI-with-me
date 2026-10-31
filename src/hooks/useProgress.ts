// src/hooks/useProgress.ts
// ─────────────────────────────────────────────────────────────────────────────
// HYBRID PROGRESS TRACKING (Supabase Cloud + LocalStorage Fallback)
// - Authenticated users: Persists to Supabase `user_day_progress` table.
// - Guest visitors: Persists privately to browser `localStorage`.
// - Automatic migration utility to import local progress upon sign-up.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { roadmap } from '../data/roadmap'
import { useAuth } from '../contexts/AuthContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { UserDayProgress } from '../types/database'

export type DayStatus = 'not-started' | 'in-progress' | 'completed'

export interface DayProgress {
  status: DayStatus
  completedTasks: number[] // indices of completed tasks
}

export interface ProgressState {
  days: Record<number, DayProgress>
  lastUpdated: string
}

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error'

const LOCAL_STORAGE_KEY = 'learn-ai-with-me-progress'

function defaultProgress(): ProgressState {
  return { days: {}, lastUpdated: new Date().toISOString() }
}

export function loadLocalProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    if (typeof parsed !== 'object' || !parsed || !parsed.days) return defaultProgress()
    return {
      days: parsed.days ?? {},
      lastUpdated: parsed.lastUpdated ?? new Date().toISOString(),
    }
  } catch {
    return defaultProgress()
  }
}

export function saveLocalProgress(state: ProgressState): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage may be full or disabled
  }
}

function toDbStatus(status: DayStatus): 'not_started' | 'in_progress' | 'completed' {
  if (status === 'in-progress') return 'in_progress'
  if (status === 'not-started') return 'not_started'
  return 'completed'
}

function fromDbStatus(status: string): DayStatus {
  if (status === 'in_progress') return 'in-progress'
  if (status === 'not_started') return 'not-started'
  return 'completed'
}

const PROGRESS_UPDATE_EVENT = 'learn-ai-progress-updated'

function broadcastProgressUpdate(state: ProgressState) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROGRESS_UPDATE_EVENT, { detail: state }))
  }
}

// Module-level deduplication cache so multiple hook instances (Layout, Page, Cards)
// don't fire duplicate parallel requests to Supabase.
let cloudCacheUserId: string | null = null
let cloudCacheData: Record<number, DayProgress> | null = null
let inFlightCloudFetch: Promise<Record<number, DayProgress> | null> | null = null

async function fetchCloudData(userId: string): Promise<Record<number, DayProgress>> {
  const { data, error } = await supabase
    .from('user_day_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  const cloudDays: Record<number, DayProgress> = {}
  if (data) {
    data.forEach((row: UserDayProgress) => {
      cloudDays[row.day_number] = {
        status: fromDbStatus(row.status),
        completedTasks: Array.isArray(row.completed_tasks) ? row.completed_tasks : [],
      }
    })
  }
  return cloudDays
}

export function useProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<ProgressState>(loadLocalProgress)
  const [loading, setLoading] = useState<boolean>(Boolean(user && isSupabaseConfigured))
  const [syncState, setSyncState] = useState<SyncState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Track pending save timers per day to debounce rapid clicks
  const saveDebounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})

  // Listen for updates from other hook instances (e.g. DayPage updating Layout navbar)
  useEffect(() => {
    const handleCustomUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ProgressState>
      if (customEvent.detail) {
        setProgress(customEvent.detail)
      }
    }
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (parsed && parsed.days) {
            setProgress(parsed)
          }
        } catch {
          // ignore
        }
      }
    }

    window.addEventListener(PROGRESS_UPDATE_EVENT, handleCustomUpdate)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener(PROGRESS_UPDATE_EVENT, handleCustomUpdate)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  // Fetch progress from Supabase when user logs in (deduplicated across instances)
  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      // Guest mode: load from localStorage
      cloudCacheUserId = null
      cloudCacheData = null
      inFlightCloudFetch = null
      const local = loadLocalProgress()
      setProgress(local)
      setLoading(false)
      setSyncState('idle')
      return
    }

    let isMounted = true
    setLoading(true)

    async function fetchCloudProgress() {
      // Check in-memory cache first
      if (cloudCacheData && cloudCacheUserId === user!.id) {
        if (!isMounted) return
        setProgress({ days: cloudCacheData, lastUpdated: new Date().toISOString() })
        setLoading(false)
        setSyncState('synced')
        return
      }

      // Deduplicate parallel in-flight queries
      if (!inFlightCloudFetch) {
        inFlightCloudFetch = fetchCloudData(user!.id)
          .then((cloudDays) => {
            inFlightCloudFetch = null
            cloudCacheUserId = user!.id
            cloudCacheData = cloudDays
            return cloudDays
          })
          .catch((err: unknown) => {
            inFlightCloudFetch = null
            throw err
          })
      }

      try {
        const cloudDays = await inFlightCloudFetch
        if (!isMounted) return
        if (cloudDays) {
          setProgress({
            days: cloudDays,
            lastUpdated: new Date().toISOString(),
          })
          setSyncState('synced')
        }
      } catch (err) {
        if (!isMounted) return
        setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch progress')
        setSyncState('error')
        setProgress(loadLocalProgress())
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCloudProgress()

    return () => {
      isMounted = false
    }
  }, [user])

  // Persist locally for guests
  useEffect(() => {
    if (!user) {
      saveLocalProgress(progress)
    }
  }, [progress, user])

  // Save specific day progress to Supabase
  const persistDayToCloud = useCallback(
    async (dayNumber: number, dayProgress: DayProgress) => {
      if (!user || !isSupabaseConfigured) return

      setSyncState('syncing')
      setErrorMessage(null)

      try {
        const payload: {
          user_id: string
          day_number: number
          status: 'not_started' | 'in_progress' | 'completed'
          completed_tasks: number[]
          updated_at: string
        } = {
          user_id: user.id,
          day_number: dayNumber,
          status: toDbStatus(dayProgress.status),
          completed_tasks: dayProgress.completedTasks,
          updated_at: new Date().toISOString(),
        }

        const { error } = await supabase.from('user_day_progress').upsert([payload], {
          onConflict: 'user_id,day_number',
        })

        if (error) {
          setSyncState('error')
          setErrorMessage(error.message)
        } else {
          setSyncState('synced')
        }
      } catch (err) {
        setSyncState('error')
        setErrorMessage(err instanceof Error ? err.message : 'Failed to save progress')
      }
    },
    [user]
  )

  const queueDayPersist = useCallback(
    (dayNumber: number, dayProgress: DayProgress) => {
      if (!user || !isSupabaseConfigured) return

      if (saveDebounceTimers.current[dayNumber]) {
        clearTimeout(saveDebounceTimers.current[dayNumber])
      }

      setSyncState('syncing')
      saveDebounceTimers.current[dayNumber] = setTimeout(() => {
        persistDayToCloud(dayNumber, dayProgress)
        delete saveDebounceTimers.current[dayNumber]
      }, 350)
    },
    [user, persistDayToCloud]
  )

  const getDayProgress = useCallback(
    (day: number): DayProgress => {
      return progress.days[day] ?? { status: 'not-started', completedTasks: [] }
    },
    [progress]
  )

  const setDayStatus = useCallback(
    (day: number, status: DayStatus) => {
      setProgress((prev) => {
        const current = prev.days[day] ?? { completedTasks: [] }
        const updated: DayProgress = { ...current, status }
        const newState = {
          ...prev,
          lastUpdated: new Date().toISOString(),
          days: { ...prev.days, [day]: updated },
        }

        queueDayPersist(day, updated)
        broadcastProgressUpdate(newState)
        return newState
      })
    },
    [queueDayPersist]
  )

  const toggleTask = useCallback(
    (day: number, taskIndex: number) => {
      setProgress((prev) => {
        const existing = prev.days[day] ?? { status: 'not-started', completedTasks: [] }
        const alreadyDone = existing.completedTasks.includes(taskIndex)
        const completedTasks = alreadyDone
          ? existing.completedTasks.filter((i) => i !== taskIndex)
          : [...existing.completedTasks, taskIndex]

        const updated: DayProgress = { ...existing, completedTasks }
        const newState = {
          ...prev,
          lastUpdated: new Date().toISOString(),
          days: { ...prev.days, [day]: updated },
        }

        queueDayPersist(day, updated)
        broadcastProgressUpdate(newState)
        return newState
      })
    },
    [queueDayPersist]
  )

  const resetProgress = useCallback(async () => {
    const fresh = defaultProgress()
    setProgress(fresh)
    broadcastProgressUpdate(fresh)
    cloudCacheData = {}

    if (user && isSupabaseConfigured) {
      setSyncState('syncing')
      try {
        await supabase.from('user_day_progress').delete().eq('user_id', user.id)
        setSyncState('synced')
      } catch {
        setSyncState('error')
      }
    } else {
      saveLocalProgress(fresh)
    }
  }, [user])

  // Derived statistics
  const completedDays = Object.values(progress.days).filter((d) => d.status === 'completed').length
  const inProgressDays = Object.values(progress.days).filter((d) => d.status === 'in-progress').length
  const totalDays = roadmap.length
  const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0

  // Per-stage stats
  const getStageProgress = useCallback(
    (stageDays: number[]) => {
      const completed = stageDays.filter((d) => progress.days[d]?.status === 'completed').length
      return { completed, total: stageDays.length }
    },
    [progress]
  )

  // Next recommended lesson
  const nextRecommendedDay = roadmap.find((d) => {
    const p = progress.days[d.day]
    return !p || p.status !== 'completed'
  })

  return {
    progress,
    loading,
    syncState,
    errorMessage,
    getDayProgress,
    setDayStatus,
    toggleTask,
    resetProgress,
    completedDays,
    inProgressDays,
    totalDays,
    percentage,
    getStageProgress,
    nextRecommendedDay,
    isCloud: Boolean(user && isSupabaseConfigured),
  }
}

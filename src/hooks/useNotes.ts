// src/hooks/useNotes.ts
// ─────────────────────────────────────────────────────────────────────────────
// HYBRID STUDY NOTES HOOK (Supabase Cloud + LocalStorage Fallback)
// - Authenticated users: Persists to Supabase `user_day_notes` table.
// - Guest visitors: Persists privately to browser `localStorage`.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export type NoteSaveStatus = 'unsaved' | 'saving' | 'saved' | 'error'

const KEY_PREFIX = 'learn-ai-notes-day-'

export function storageKey(day: number): string {
  return `${KEY_PREFIX}${day}`
}

export function loadLocalNote(day: number): string {
  try {
    return localStorage.getItem(storageKey(day)) ?? ''
  } catch {
    return ''
  }
}

export function saveLocalNote(day: number, content: string): void {
  try {
    localStorage.setItem(storageKey(day), content)
  } catch {
    // localStorage full or disabled
  }
}

export function clearLocalNote(day: number): void {
  try {
    localStorage.removeItem(storageKey(day))
  } catch {
    // ignore
  }
}

export function useNotes(day: number) {
  const { user } = useAuth()
  const [content, setContent] = useState<string>(() => loadLocalNote(day))
  const [savedContent, setSavedContent] = useState<string>(() => loadLocalNote(day))
  const [saveStatus, setSaveStatus] = useState<NoteSaveStatus>('saved')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [loading, setLoading] = useState<boolean>(Boolean(user && isSupabaseConfigured))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isMountedRef = useRef(true)

  // Load note when day or user changes
  useEffect(() => {
    isMountedRef.current = true

    if (!user || !isSupabaseConfigured) {
      // Guest: load local note
      const local = loadLocalNote(day)
      setContent(local)
      setSavedContent(local)
      setSaveStatus('saved')
      setLoading(false)
      return
    }

    setLoading(true)
    setSaveStatus('saved')
    setErrorMessage(null)

    async function fetchCloudNote() {
      try {
        const { data, error } = await supabase
          .from('user_day_notes')
          .select('notes_markdown, updated_at')
          .eq('user_id', user!.id)
          .eq('day_number', day)
          .maybeSingle()

        if (!isMountedRef.current) return

        if (error) {
          // Fallback to local if error occurs
          const local = loadLocalNote(day)
          setContent(local)
          setSavedContent(local)
        } else if (data) {
          const row = data as unknown as { notes_markdown: string; updated_at?: string }
          setContent(row.notes_markdown || '')
          setSavedContent(row.notes_markdown || '')
          if (row.updated_at) {
            setLastSavedAt(new Date(row.updated_at))
          }
        } else {
          // No cloud note yet. Check if there is a local draft to suggest
          const local = loadLocalNote(day)
          setContent(local)
          setSavedContent(local)
        }
      } catch (err) {
        if (!isMountedRef.current) return
        setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch notes')
      } finally {
        if (isMountedRef.current) setLoading(false)
      }
    }

    fetchCloudNote()

    return () => {
      isMountedRef.current = false
    }
  }, [day, user])

  // Track unsaved state when editing
  useEffect(() => {
    if (content !== savedContent) {
      setSaveStatus('unsaved')
    } else {
      setSaveStatus('saved')
    }
  }, [content, savedContent])

  const updateContent = useCallback((value: string) => {
    setContent(value)
  }, [])

  // Save notes handler (explicit or debounced)
  const saveNotes = useCallback(async () => {
    setSaveStatus('saving')
    setErrorMessage(null)

    if (user && isSupabaseConfigured) {
      try {
        const payload: {
          user_id: string
          day_number: number
          notes_markdown: string
          updated_at: string
        } = {
          user_id: user.id,
          day_number: day,
          notes_markdown: content,
          updated_at: new Date().toISOString(),
        }

        const { error } = await supabase.from('user_day_notes').upsert([payload], {
          onConflict: 'user_id,day_number',
        })

        if (!isMountedRef.current) return

        if (error) {
          setSaveStatus('error')
          setErrorMessage(error.message)
          // Preserve draft locally so nothing is lost
          saveLocalNote(day, content)
        } else {
          setSavedContent(content)
          setSaveStatus('saved')
          setLastSavedAt(new Date())
          // Also backup locally
          saveLocalNote(day, content)
        }
      } catch (err) {
        if (!isMountedRef.current) return
        setSaveStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Save failed')
        saveLocalNote(day, content)
      }
    } else {
      // Guest mode
      saveLocalNote(day, content)
      setSavedContent(content)
      setSaveStatus('saved')
      setLastSavedAt(new Date())
    }
  }, [day, content, user])

  const clearNotes = useCallback(async () => {
    setContent('')
    setSavedContent('')
    setSaveStatus('saved')
    clearLocalNote(day)

    if (user && isSupabaseConfigured) {
      try {
        await supabase
          .from('user_day_notes')
          .delete()
          .eq('user_id', user.id)
          .eq('day_number', day)
      } catch {
        // ignore
      }
    }
  }, [day, user])

  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length

  return {
    content,
    updateContent,
    saveNotes,
    clearNotes,
    saved: content === savedContent,
    saveStatus,
    lastSavedAt,
    loading,
    errorMessage,
    wordCount,
    isCloud: Boolean(user && isSupabaseConfigured),
  }
}

export function defaultNoteTemplate(day: number, title: string): string {
  return `# Day ${day} — ${title}

## What I learned today
- 

## Core concepts & definitions
- **Key concept**: 

## Code and practical observations
\`\`\`python
# Experimenting with the concept
\`\`\`

## What confused me or needs revisiting
- 

## Real-world applications
- 

## Daily takeaway
- 
`
}

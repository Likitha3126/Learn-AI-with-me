import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Security & Row Level Security (RLS) Policy Audit', () => {
  const migrationPath = path.resolve(__dirname, '../../supabase/migrations/20261024000000_initial_schema.sql')

  it('migration file exists and is not empty', () => {
    expect(fs.existsSync(migrationPath)).toBe(true)
    const sql = fs.readFileSync(migrationPath, 'utf-8')
    expect(sql.length).toBeGreaterThan(500)
  })

  it('enables RLS on user_profiles, user_day_progress, and user_day_notes', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8')
    expect(sql).toMatch(/alter table public\.user_profiles enable row level security/i)
    expect(sql).toMatch(/alter table public\.user_day_progress enable row level security/i)
    expect(sql).toMatch(/alter table public\.user_day_notes enable row level security/i)
  })

  it('defines explicit policies isolating data per user_id via auth.uid()', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    // Profiles policies
    expect(sql).toMatch(/create policy "Users can view their own profile"/i)
    expect(sql).toMatch(/auth\.uid\(\)\s*=\s*id/i)

    // Progress policies
    expect(sql).toMatch(/create policy "Users can view their own progress"/i)
    expect(sql).toMatch(/create policy "Users can insert their own progress"/i)
    expect(sql).toMatch(/create policy "Users can update their own progress"/i)
    expect(sql).toMatch(/create policy "Users can delete their own progress"/i)
    expect(sql).toMatch(/auth\.uid\(\)\s*=\s*user_id/i)

    // Notes policies
    expect(sql).toMatch(/create policy "Users can view their own notes"/i)
    expect(sql).toMatch(/create policy "Users can insert their own notes"/i)
    expect(sql).toMatch(/create policy "Users can update their own notes"/i)
    expect(sql).toMatch(/create policy "Users can delete their own notes"/i)
  })

  it('enforces table constraints for day numbers 1 to 70 and valid statuses', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8')
    expect(sql).toMatch(/day_number between 1 and 70/i)
    expect(sql).toMatch(/status in \('not_started', 'in_progress', 'completed'\)/i)
    expect(sql).toMatch(/length\(notes_markdown\) <= 50000/i)
  })

  it('enforces unique constraints on (user_id, day_number) to prevent duplicates', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8')
    expect(sql).toMatch(/unique\s*\(user_id,\s*day_number\)/i)
  })

  it('does NOT expose service_role or secret keys in source files', () => {
    const srcDir = path.resolve(__dirname, '../..')
    const files = ['package.json', 'src/lib/supabase.ts', 'src/data/siteConfig.ts']

    files.forEach((file) => {
      const fullPath = path.resolve(srcDir, file)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        expect(content).not.toMatch(/service_role/i)
        expect(content).not.toMatch(/supabase_service_key/i)
      }
    })
  })
})

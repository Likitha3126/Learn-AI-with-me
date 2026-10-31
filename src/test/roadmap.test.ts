// src/test/roadmap.test.ts
import { describe, it, expect } from 'vitest'
import { roadmap, stages, getDayByNumber, getDaysByStage } from '../data/roadmap'

describe('Roadmap data integrity', () => {
  it('has exactly 70 unique days', () => {
    expect(roadmap).toHaveLength(70)
    const dayNumbers = roadmap.map((d) => d.day)
    const unique = new Set(dayNumbers)
    expect(unique.size).toBe(70)
  })

  it('days are ordered from 1 to 70', () => {
    roadmap.forEach((d, i) => {
      expect(d.day).toBe(i + 1)
    })
  })

  it('has exactly 10 stages', () => {
    expect(stages).toHaveLength(10)
  })

  it('each stage has exactly 7 days', () => {
    stages.forEach((stage) => {
      expect(stage.days).toHaveLength(7)
    })
  })

  it('stage day numbers are consecutive and match stage number', () => {
    stages.forEach((stage, idx) => {
      const expectedStart = idx * 7 + 1
      const expectedEnd = expectedStart + 6
      expect(stage.days[0]).toBe(expectedStart)
      expect(stage.days[stage.days.length - 1]).toBe(expectedEnd)
    })
  })

  it('every day has required fields', () => {
    roadmap.forEach((d) => {
      expect(d.day).toBeGreaterThan(0)
      expect(d.title).toBeTruthy()
      expect(d.stageName).toBeTruthy()
      expect(d.category).toBeTruthy()
      expect(d.description.length).toBeGreaterThan(20)
      expect(d.objectives.length).toBeGreaterThan(0)
      expect(d.tasks.length).toBeGreaterThan(0)
      expect(d.reflectionQuestion).toBeTruthy()
      expect(d.estimatedMinutes).toBeGreaterThan(0)
    })
  })

  it('days with published=true have a substackUrl', () => {
    roadmap.filter((d) => d.published).forEach((d) => {
      expect(d.substackUrl).toBeTruthy()
    })
  })

  it('Day 1 is published with the official Substack article link', () => {
    const day1 = getDayByNumber(1)
    expect(day1?.published).toBe(true)
    expect(day1?.substackUrl).toBe(
      'https://likitha3126.substack.com/p/day-170-okay-im-actually-starting?r=8xcaev'
    )
  })

  it('days 4 through 70 are not marked as published', () => {
    // Days 1, 2, and 3 are currently published. This test ensures no day
    // beyond the intentionally published set is accidentally marked published.
    roadmap.slice(3).forEach((d) => {
      expect(d.published).toBe(false)
    })
  })

  it('getDayByNumber returns correct day', () => {
    const day1 = getDayByNumber(1)
    expect(day1).toBeDefined()
    expect(day1?.title).toBe('What Does an AI Engineer Actually Do?')

    const day70 = getDayByNumber(70)
    expect(day70).toBeDefined()
    expect(day70?.stage).toBe(10)
  })

  it('getDayByNumber returns undefined for out-of-range numbers', () => {
    expect(getDayByNumber(0)).toBeUndefined()
    expect(getDayByNumber(71)).toBeUndefined()
    expect(getDayByNumber(-1)).toBeUndefined()
  })

  it('getDaysByStage returns 7 days for each stage', () => {
    for (let s = 1; s <= 10; s++) {
      const days = getDaysByStage(s)
      expect(days).toHaveLength(7)
      days.forEach((d) => expect(d.stage).toBe(s))
    }
  })

  it('all resource URLs are strings starting with http', () => {
    roadmap.forEach((d) => {
      d.resources.forEach((r) => {
        expect(r.url).toMatch(/^https?:\/\//)
        expect(r.title).toBeTruthy()
      })
    })
  })

  it('all stages cover days 1-70 without gaps or overlaps', () => {
    const allDays = stages.flatMap((s) => s.days).sort((a, b) => a - b)
    expect(allDays).toHaveLength(70)
    allDays.forEach((d, i) => expect(d).toBe(i + 1))
  })
})

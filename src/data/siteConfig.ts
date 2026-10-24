// src/data/siteConfig.ts
// ─────────────────────────────────────────────────────────────────────────────
// CENTRALIZED CREATOR-CONTROLLED SITE CONFIGURATION
// Visitors cannot modify these values.
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  title: 'Learn AI With Me',
  subtitle: 'A 70-day journey to becoming an AI engineer.',
  tagline: 'Learn it. Build it. Explain it. Share it.',
  description:
    'A structured 70-day public learning journal through Python, mathematics, machine learning, deep learning, NLP, Transformers, LLMs, RAG, and production deployment. One topic at a time, with practical exercises, study notes, and real-world projects.',

  creator: {
    name: 'Likitha',
    tagline: 'Documenting every step of the AI engineering journey in public.',
    xUrl: 'https://x.com/Likitha_3126',
    githubUrl: 'https://github.com/Likitha3126',
    substackProfileUrl:
      'https://substack.com/@likitha3126?r=8xcaev&utm_campaign=profile&utm_medium=profile-page',
  },

  /** Centralized external profile links */
  links: {
    twitter: 'https://x.com/Likitha_3126',
    github: 'https://github.com/Likitha3126',
    substack:
      'https://substack.com/@likitha3126?r=8xcaev&utm_campaign=profile&utm_medium=profile-page',
  },

  totalDays: 70,
  totalStages: 10,
} as const

export type SiteConfig = typeof siteConfig

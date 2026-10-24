// src/data/projects.ts
// ─────────────────────────────────────────────────────────────────────────────
// CREATOR-CONTROLLED PROJECT DATA
//
// HOW TO ADD A PROJECT:
//   1. Add a new entry to the `projects` array below.
//   2. Set `status` to 'planned', 'in-progress', or 'completed'.
//   3. Only set `githubUrl` / `demoUrl` when the link actually exists.
//   4. Run `npm run build` and redeploy.
//
// Do NOT invent URLs or metrics. Use honest, accurate information only.
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectStatus = 'planned' | 'in-progress' | 'completed'

export interface Project {
  id: string
  title: string
  problem: string
  description: string
  technologies: string[]
  status: ProjectStatus
  relatedDays: number[]
  githubUrl?: string   // Only set when the repo is public
  demoUrl?: string     // Only set when a live demo exists
}

export const projects: Project[] = [
  // Add completed projects here as you build them.
  // Example entry (uncomment and fill in when ready):
  //
  // {
  //   id: 'eda-analysis',
  //   title: 'Real Dataset Investigation',
  //   problem: 'Understand patterns in a public dataset using EDA techniques.',
  //   description:
  //     'A structured exploratory data analysis of the [dataset name] dataset, covering data cleaning, statistical analysis, and visualization.',
  //   technologies: ['Python', 'Pandas', 'Matplotlib', 'Jupyter'],
  //   status: 'completed',
  //   relatedDays: [8, 9, 10, 11, 12, 13, 14],
  //   githubUrl: 'https://github.com/yourusername/eda-analysis',
  // },
]

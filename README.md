# Learn AI With Me

> **A 70-day journey to becoming an AI engineer.**
> *Learn it. Build it. Explain it. Share it.*

A structured public learning journal documenting a 70-day path through Python, mathematics, machine learning, deep learning, NLP, Transformers, LLMs, RAG, and production AI deployment. One topic at a time, with practical exercises, personal study notes, and real-world projects.

---

## Features

| Feature | Guest | Signed-in |
|---------|-------|-----------|
| Browse all 70 lessons | ✅ | ✅ |
| Read daily educational content | ✅ | ✅ |
| View resources and references | ✅ | ✅ |
| Track progress in browser storage | ✅ | ✅ |
| Write study notes (local) | ✅ | ✅ |
| **Cloud progress sync across devices** | — | ✅ |
| **Cloud notes sync across devices** | — | ✅ |
| **Import local data to cloud** | — | ✅ |

---

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 + custom design tokens
- **Auth & DB:** Supabase (Auth + Postgres + Row Level Security)
- **Routing:** React Router v7
- **Markdown:** react-markdown + remark-gfm
- **Icons:** Lucide React
- **Tests:** Vitest + Testing Library

---

## Quick Start (Local Development)

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [npm 10+](https://www.npmjs.com/)
- A [Supabase account](https://supabase.com) (free tier works fine)

### 1. Clone and install

```bash
git clone https://github.com/Likitha3126/learn-ai-with-me.git
cd learn-ai-with-me
npm install
```

### 2. Configure environment variables

```bash
# Copy the example file
cp .env.example .env
```

Open `.env` and fill in your values (see [Supabase Setup](#supabase-setup) below):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key-here
```

> **Important:** Only the **anon / public** key is safe to use here.
> Never use the `service_role` or `secret` key in frontend code.

### 3. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173).

> **Note:** Without Supabase credentials, the public website still works fully. All 70 lessons are accessible, and progress/notes are saved in browser localStorage. Cloud sync requires the Supabase credentials.

---

## Supabase Setup

### Step 1 — Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Fill in a name, database password, and region.
4. Wait for the project to initialize (usually 1-2 minutes).

### Step 2 — Get your API credentials

1. In your Supabase project, go to **Settings -> API**.
2. Copy the **Project URL** -> this is `VITE_SUPABASE_URL`.
3. Copy the **anon / public** key -> this is `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Do **NOT** use the `service_role` key anywhere in the frontend.

### Step 3 — Apply the SQL migration

1. In your Supabase dashboard, go to **SQL Editor**.
2. Click **New query**.
3. Open the file `supabase/migrations/20261024000000_initial_schema.sql` from this repository.
4. Copy and paste the entire SQL content into the editor.
5. Click **Run**.

This migration creates:
- `user_profiles` — learner display names and account dates
- `user_day_progress` — per-day lesson status and completed tasks
- `user_day_notes` — personal Markdown study notes per day

All tables have **Row Level Security (RLS)** enabled and explicit per-user policies.

### Step 4 — Configure email authentication

1. In Supabase, go to **Authentication -> Settings**.
2. Under **Email**, ensure **Enable Email Signup** is turned on.
3. Set **Confirm email** to enabled if you want email verification (recommended for production).
4. Under **Email Templates**, you can customize the verification and password-reset emails.

### Step 5 — Configure redirect URLs

For password reset emails to work correctly, you need to add your site URL as an allowed redirect:

1. In Supabase, go to **Authentication -> URL Configuration**.
2. Set **Site URL** to your production URL, e.g. `https://your-site.com`.
3. Under **Redirect URLs**, add:
   - `http://localhost:5173/reset-password` (for local development)
   - `https://your-site.com/reset-password` (for production)

---

## Running Tests

```bash
npm test
```

All 57 tests should pass. The test suite covers:

| Category | Tests |
|----------|-------|
| Roadmap data integrity | 12 tests |
| Authentication & confirmation flows | 12 tests |
| Hook behaviour (progress + notes) | 8 tests |
| Notes editing & safe Markdown rendering | 5 tests |
| Component rendering | 5 tests |
| Page rendering | 6 tests |
| Local migration utilities | 3 tests |
| Security and RLS policy audit | 6 tests |

**Tests run without Supabase credentials.** Supabase calls are handled gracefully with mocked/unconfigured fallback behaviour so unit tests never require a live database.

---

## Building for Production

```bash
npm run build
```

This runs TypeScript type checking (`tsc`) and then Vite production bundling. Output goes to `dist/`.

To preview the production build locally:

```bash
npm run preview
```

---

## Deployment

### Vercel (recommended)

1. Push your repository to GitHub.
2. Connect the repository to [Vercel](https://vercel.com).
3. In Vercel's project settings, add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your anon/public key
4. Deploy. Vercel auto-detects Vite and configures the build command.

### Netlify

1. Connect your repository to [Netlify](https://www.netlify.com).
2. Set **Build command** to `npm run build`.
3. Set **Publish directory** to `dist`.
4. Add the same environment variables under **Site settings -> Environment variables**.

### GitHub Pages

GitHub Pages requires a SPA redirect workaround for client-side routing:

1. Update `vite.config.ts` to set `base` to your repository name.
2. Add a `public/404.html` that redirects to `index.html`.
3. Use `npm run build` and deploy the `dist/` folder with `gh-pages`.

---

## Project Structure

```
learn-ai-with-me/
├── src/
│   ├── components/          # Shared UI components
│   │   ├── Layout.tsx       # Nav, footer, migration banner
│   │   ├── DayCard.tsx      # Lesson card for roadmap/progress views
│   │   ├── CreatorLinks.tsx # X, GitHub, Substack links from siteConfig
│   │   ├── Icons.tsx        # Custom SVG icons (X, Substack)
│   │   ├── LocalDataMigrationBanner.tsx
│   │   └── ProgressBar.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Supabase Auth state, sign in/up/out
│   ├── data/
│   │   ├── roadmap.ts       # All 70 days -- CREATOR-CONTROLLED
│   │   ├── siteConfig.ts    # Profile links -- CREATOR-CONTROLLED
│   │   └── projects.ts      # Projects -- CREATOR-CONTROLLED
│   ├── hooks/
│   │   ├── useProgress.ts   # Cloud+local hybrid progress tracking
│   │   └── useNotes.ts      # Cloud+local hybrid notes editor
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client (graceful fallback)
│   │   └── migration.ts     # localStorage -> cloud migration
│   ├── pages/               # Route-level page components
│   │   ├── HomePage.tsx
│   │   ├── RoadmapPage.tsx
│   │   ├── DayPage.tsx      # Full lesson page with notes + progress
│   │   ├── ProjectsPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── SignInPage.tsx
│   │   ├── SignUpPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── AccountPage.tsx
│   │   ├── MyProgressPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── test/                # Vitest unit and integration tests
│   └── types/
│       └── database.ts      # TypeScript types mirroring Supabase schema
├── supabase/
│   └── migrations/
│       └── 20261024000000_initial_schema.sql  # Full DB schema + RLS
├── .env.example             # Template for environment variables
├── .gitignore               # Excludes .env and node_modules
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Security Architecture

### Row Level Security

All user tables have RLS enabled with explicit ownership-enforcement policies:

```sql
-- Progress: users can only see their own rows
create policy "Users can view their own progress"
  on public.user_day_progress
  for select
  using (auth.uid() = user_id);
```

Users cannot read or modify another user's progress or notes.

### Key principles

- Supabase Auth manages all password hashing and session tokens.
- No passwords are stored in application tables or localStorage.
- The `service_role` key is never used in frontend code.
- Only the `anon / public` key is exposed to the browser.
- Day numbers are validated server-side (`CHECK (day_number BETWEEN 1 AND 70)`).
- Note length is capped at 50,000 characters server-side.
- Progress status is validated against an allowed enum server-side.

---

## Updating Official Content

The creator is the only person who can change official lesson content. Visitors have no editing interface for official material.

To update a day's lesson:
1. Edit `src/data/roadmap.ts` -- find the entry by `day` number.
2. Update fields such as `description`, `objectives`, `tasks`, `resources`, etc.
3. To link a published Substack article: set `substackUrl` and `published: true`.
4. Run `npm run build` and redeploy.

To update creator profile links:
1. Edit `src/data/siteConfig.ts`.
2. Update `creator.xUrl`, `creator.githubUrl`, or `creator.substackProfileUrl`.
3. Rebuild and redeploy.

---

## Creator

**Likitha** -- documenting every step of the AI engineering journey in public.

- **X:** [@Likitha_3126](https://x.com/Likitha_3126)
- **GitHub:** [Likitha3126](https://github.com/Likitha3126)
- **Substack:** [likitha3126](https://substack.com/@likitha3126?r=8xcaev&utm_campaign=profile&utm_medium=profile-page)

---

## License

This project is a personal learning journal. The code is open for reference and personal use. The educational content belongs to the creator.

# Taskflow

Taskflow is a production-style, responsive task manager built with Vite, React, TypeScript, Supabase, and TanStack Query. It supports email authentication, private task CRUD, status and priority tracking, due dates, search, filters, and profile settings.

## Quick start

```bash
npm install
copy .env.example .env.local
# Add your Supabase project URL and anon key to .env.local
npm run dev
```

In Supabase, run `supabase/migrations/20250915000000_initial_schema.sql` in the SQL editor. Enable Email provider authentication under **Authentication → Providers**. Email confirmation can remain enabled for production.

## Environment

Only the public browser configuration belongs in Vite variables:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never add a Supabase service role key to `.env`, frontend source, or client bundles. Row-level security policies ensure each signed-in user can only access their own records.

## Commands

- `npm run dev` — local development server
- `npm run build` — type-check and production build
- `npm run preview` — preview the production bundle

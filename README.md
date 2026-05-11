# Orbact Website V2

Secure CMS-backed Orbact marketing site built with React, TypeScript, Vite, Tailwind, Supabase Auth, Supabase RLS, Storage, and Edge Functions.

## What Changed

- Clean SEO URLs via `BrowserRouter`.
- Real `/admin` CMS with Supabase Auth instead of frontend password checks.
- Public-read/admin-write RLS policies for content tables and media uploads.
- Editable content for pages, services, work/projects, pricing, reviews, FAQs, team, settings, media, and contact submissions.
- Chatbot and contact form call Supabase Edge Functions so API/webhook secrets stay server-side.
- Local Tailwind/PostCSS build, no Tailwind CDN or importmap.
- Clean package expectations: do not ship `.env.local`, `.git`, `node_modules`, `dist`, logs, or Supabase temp files.

## Local Setup

```bash
npm install
copy .env.local.example .env.local
npm run dev
```

Set these frontend variables in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://orbact.com
VITE_ADMIN_EMAIL=admin@orbact.com
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/20260510000000_orbact_v2_cms.sql` in the SQL editor, or apply it through Supabase CLI.
3. Create a Supabase Auth user using the same email as `VITE_ADMIN_EMAIL`.
4. Add that user to `admin_users`:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'admin@orbact.com'
on conflict (user_id) do nothing;
```

5. Deploy Edge Functions:

```bash
supabase functions deploy chat
supabase functions deploy contact
```

6. Set server-only Supabase secrets:

```bash
supabase secrets set GROQ_API_KEY=your_groq_key
supabase secrets set CONTACT_WEBHOOK_URL=https://your-webhook-url
supabase secrets set ALLOWED_ORIGIN=https://orbact.com
```

Use `GEMINI_API_KEY` instead of `GROQ_API_KEY` if preferred.

## Admin Panel

Visit `/admin`. The login uses `VITE_ADMIN_EMAIL` plus the Supabase Auth password for that user. RLS still blocks writes unless the logged-in user is present in `admin_users`.

Admin sections:

- Dashboard
- Pages
- Services
- Work
- Pricing
- Reviews
- FAQs
- Team
- Media
- Settings
- Messages

## Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run preview
```

## Deployment Notes

- Vercel rewrites are included in `vercel.json`.
- Netlify-style SPA fallback is included in `public/_redirects`.
- `public/robots.txt` disallows `/admin` and points to `public/sitemap.xml`.
- Set all `VITE_*` variables in your hosting platform.
- Do not deploy `.env.local`, `.git`, `node_modules`, or local logs.

## Security Notes

- The old V1 public insert/update/delete policies are removed by the V2 migration.
- `VITE_ADMIN_PASSWORD`, `VITE_GROQ_API_KEY`, `VITE_GEMINI_API_KEY`, and `VITE_MAKE_WEBHOOK_URL` are intentionally not used.
- Chat/contact secrets live in Supabase Edge Function secrets only.

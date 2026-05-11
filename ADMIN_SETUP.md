# Orbact Admin Setup

## 1. Create The Admin User

In Supabase Auth, create a user with the email configured as `VITE_ADMIN_EMAIL`.

Then run:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'admin@orbact.com'
on conflict (user_id) do nothing;
```

Replace `admin@orbact.com` with your real admin email.

## 2. Apply Database Security

Run:

```sql
supabase/migrations/20260510000000_orbact_v2_cms.sql
```

This creates CMS tables, enables RLS, allows public reads of published content, and restricts writes/uploads to authenticated admins.

## 3. Deploy Edge Functions

```bash
supabase functions deploy chat
supabase functions deploy contact
```

Required/optional secrets:

```bash
supabase secrets set GROQ_API_KEY=your_key
supabase secrets set CONTACT_WEBHOOK_URL=https://your-webhook-url
supabase secrets set ALLOWED_ORIGIN=https://orbact.com
```

`GEMINI_API_KEY` is also supported for chat if you do not use Groq.

## 4. Use The Panel

Open `/admin`, enter the Supabase Auth password for the configured admin email, and manage content.

The admin UI is not the security boundary. Supabase Auth plus `admin_users` plus RLS is the security boundary.

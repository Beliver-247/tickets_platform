# DJ / Club Event Tickets

Reusable Next.js App Router ticketing site for bank-transfer payments, receipt verification, email tickets, and door check-in.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the Supabase URL, anon key, service-role key, Gmail user, and Gmail app password.
2. Install dependencies with `npm install`.
3. In Supabase SQL Editor, run [`supabase/migrations/001_initial.sql`](./supabase/migrations/001_initial.sql).
4. The migration creates the private `receipts` bucket. If it already exists, confirm it is private.
5. Create an Auth user with email/password for the first admin, then insert that user's UUID into `public.admins`:
   `insert into public.admins (user_id) values ('AUTH_USER_UUID');`
6. Disable public signups in Supabase Auth settings.
7. Edit only [`config/event.ts`](./config/event.ts) for event details, bank details, theme, ticket prefix, capacity, and email copy.
8. Run `npm run dev`.

The service-role key and Gmail credentials are server-only. Public order submission is constrained by RLS, and all sensitive reads use server-side routes.

## Gmail App Password

Enable 2-Step Verification on the Gmail account, open Google Account → Security → App passwords, create an app password for this app, and put the generated 16-character value in `GMAIL_APP_PASSWORD`. Do not use the normal Gmail password.

## Vercel

Import the repository, add all five variables from `.env.example` in Project Settings → Environment Variables for Production/Preview as needed, and deploy. Redeploy after editing `config/event.ts`.

## Reusing for a new event

1. Edit `eventId` to a new short unique slug in [`config/event.ts`](./config/event.ts).
2. Replace the event name, date, venue, bank details, support contacts, theme, ticket prefix, email subject, and footer note.
3. Set `salesOpen` to `true`, and update `totalCapacity` if applicable.
4. Deploy/redeploy. Orders are scoped by `event_id`, so previous events remain untouched and no SQL changes are needed.

## Pre-launch checklist

- Run the migration and verify the `receipts` bucket is private.
- Create an admin Auth user, add it to `public.admins`, and confirm public signup is disabled.
- Test a valid receipt, an oversized file, unsupported file, invalid email, duplicate bank reference, and capacity limit.
- Approve a test order and confirm the email, ticket number, and status lookup.
- Test a failed email path and use Resend email.
- Test rejected orders and rejection reasons.
- Test ticket lookup with spaces/dashes, duplicate check-in, and partial multi-ticket check-in.
- Confirm service-role/Gmail variables are not exposed in client bundles.

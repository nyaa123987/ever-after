# Ever After — Wedding Planner

A Next.js + Supabase wedding planning app: shared couple accounts, guest lists,
a wedding checklist, budget-aware vendor recommendations, in-app messaging,
and view-only access for helpers like a wedding organiser.

## 1. Setup

```bash
npm install
cp .env.local.example .env.local
```

Open `.env.local` and either keep the pre-filled Supabase project values (the
same ones already used by the original app) or swap in your own project's
URL and anon key from **Supabase → Settings → API**.

## 2. Database

In your Supabase project, open the **SQL Editor** and run the contents of
`supabase/migrations/0001_init.sql` once. It creates every table, the
row-level security policies, and turns on Realtime for the `messages` table
(needed for live chat). It's safe to re-run if you ever need to.

In **Authentication → Providers → Email**, you can turn "Confirm email" off
if you'd rather test signup without clicking a confirmation link.

## 3. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

## What's real vs. what needs your own setup

This app is fully wired to Supabase — accounts, weddings, guests, the
checklist, notes, messaging, saved items, and booking requests all read and
write real data with proper access control (row-level security), and the
partner/helper invite flow works end-to-end once someone signs up with the
invited email address.

A few things to know:

- **Vendor pricing is an estimate, not a live quote.** The 17 vendor
  categories carry a `priceTier`/`estimatedCost`/`priceRange` on each entry
  (in `src/data/*.ts`) so the budget-matching feature works out of the box.
  These numbers are planning estimates, not scraped or verified prices —
  edit them freely as you collect real quotes.
- **Vendor listings are Harare-focused.** The original data set only covered
  Harare. The sign-up city dropdown now includes all major Zimbabwean
  cities/towns, but vendor pages will show a small notice when a couple's
  city isn't Harare, since there's no verified local vendor data yet for
  other towns. Add entries to the relevant file in `src/data/` as you find
  them — the shape is simple and typed.
- **Guest invitations use `mailto:` links, not automatic sending.** From the
  Guests page, "Send Invitations" opens a pre-filled email in the couple's
  own mail app for each guest with an address — genuinely functional, no
  extra setup. If you want one-click automatic sending instead, wire the
  optional `RESEND_API_KEY` env var to a Supabase Edge Function (not
  included, but the guest data and template logic are ready for it).
- **Task reminders are in-app only** (a dismissible banner on the dashboard
  when the wedding is under 60 days away and more than 8 checklist items are
  open) — there's no email/push notification service connected.

## Project structure

- `src/pages` — routes (Next.js Pages Router)
- `src/components` — shared UI, including `VendorCategoryPage` (used by all
  17 vendor category pages) and `TaskGroup1`–`TaskGroup6` (the checklist)
- `src/lib` — Supabase client, the `WeddingContext` (auth + wedding + role),
  budget math, date/countdown helpers, task-completion persistence
- `src/data` — vendor listings per category
- `supabase/migrations` — the SQL schema

## Roles

- **Owner** — created the wedding at signup. Full access.
- **Partner** — invited with full access. Can do everything the owner can:
  edit tasks, guests, notes, vendors/bookings, and use the private partner
  chat.
- **Collaborator** (e.g. a wedding organiser) — view-only. Can see
  everything and participate in the group chat, but can't create or edit
  guests, tasks, notes, or bookings, and can't see the private partner chat.

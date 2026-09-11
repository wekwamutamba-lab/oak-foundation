# OAK Zimbabwe Partner Gathering

Registration, QR attendance, live headcount, event programme, and partner directory platform for the OAK Zimbabwe Foundation Partner Gathering.

## Event

- **Dates:** 9–11 November 2026
- **Venue:** Cresta Lodge, Msasa, Harare, Zimbabwe
- **Core build:** Next.js, TypeScript, Tailwind CSS, Supabase, QR codes

## Features

- Public attendee registration with consent collection
- Unique opaque QR pass generated for each attendee
- Coordinator-only authentication and admin dashboard
- QR-based daily check-in with duplicate prevention
- Admin attendee list and CSV export
- Live daily attendance headcount
- Public programme and partner directory

## Technology

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres, Auth, Row Level Security, and Storage
- `qrcode.react` for QR pass generation
- `html5-qrcode` for browser camera scanning

## Local setup

1. Clone the repository:

   ```powershell
   git clone https://github.com/wekwamutamba-lab/oak-foundation.git
   cd oak-foundation
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Create your local environment file:

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Add your Supabase credentials to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REFERENCE.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_OR_PUBLISHABLE_KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. Apply the SQL migrations in `supabase/migrations` through the Supabase SQL Editor.

6. Start the app:

   ```powershell
   npm run dev
   ```

7. Open `http://localhost:3000`.

## Security

- Attendee accounts are not used.
- Attendees receive an opaque QR token rather than a QR code containing personal details.
- Contact information, dietary requirements, accessibility needs, travel requirements, attendance records, and CSV export are restricted to approved admin users.
- Supabase Row Level Security policies enforce access restrictions at the database layer.
- Never commit `.env.local`, the Supabase service-role key, passwords, or attendee CSV exports.

## Roles

- **Public attendees:** Register and receive a QR pass.
- **Coordinators/admins:** Log in at `/login`, access `/admin`, scan QR passes, view attendees, and manage event data.

## Current development status

- Database schema and event seed data created
- RLS policies enabled
- Secure registration RPC created
- QR pass generation implemented
- Admin login implemented
- Attendee list and CSV export implemented
- Headcount and QR check-in components in progress
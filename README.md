# Timesheet Management App

A simplified SaaS-style Timesheet Management application.

## Live Demo

[Add your Vercel URL here after deploying]

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **TailwindCSS** for styling
- **next-auth v5** for authentication (dummy credentials-based login)
- In-memory mock data store (no external database — see Assumptions below)

## Setup Instructions

1. Clone the repository:

   git clone <your-repo-url>
   cd timesheet-app


2. Install dependencies:

   npm install


3. Create a `.env.local` file in the project root with:

    AUTH_SECRET=<generate your own with: openssl rand -base64 32>

4. Run the development server:

   npm run dev


5. Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login`.

### Demo credentials
Email:    demo@tentwenty.com
Password: demo1234

## Project Structure
src/
app/
login/           - Login page (client component)
dashboard/        - Dashboard layout (auth-protected) + page
api/
auth/[...nextauth]/  - next-auth route handler
timesheets/          - CRUD API routes for timesheet entries
components/
TimesheetTable.tsx     - Table (desktop) + card list (mobile) view
TimesheetModal.tsx     - Add/Edit modal with form validation
lib/
auth.ts       - next-auth configuration
types.ts      - Shared TypeScript types
mockData.ts   - In-memory data store

## Assumptions & Notes

- **Authentication** is dummy/mock as instructed — a single hardcoded demo user via next-auth's Credentials provider. In a production version, `authorize()` would call a real backend/database to verify credentials.
- **Data persistence** uses an in-memory array on the server (`lib/mockData.ts`) rather than a real database, since no backend/API was supplied for this assessment. Data resets whenever the server restarts. All CRUD operations go through internal Next.js API routes (`/api/timesheets`), so swapping in a real database later would only require changing `mockData.ts` — the route handlers and UI would not need to change.
- **Validation** is implemented on both the client (immediate UX feedback in the modal/login form) and the server (API routes independently re-validate, since client-side checks can be bypassed).
- **Week number** is constrained to 1–53 on both client and server.
- **Responsive design** uses two distinct layouts (a table for `sm:` breakpoint and above, stacked cards below it) rather than a horizontally scrolling table, for better mobile usability.
- **Known limitation:** the validation logic is currently duplicated between `api/timesheets/route.ts` and `api/timesheets/[id]/route.ts`. Given more time, this would be extracted into a shared `lib/validation.ts` module.

# ticktock : Timesheet Management

A small Next.js + TypeScript SaaS-style timesheet manager built for the
**Front-end Developer Technical Assessment**.

It demonstrates:

- Authentication (next-auth credentials provider, session via JWT cookie).
- Internal `/api/*` routes that the client always goes through.
- A typed Redux store with thunks for asynchronous data flow.
- Modular components with co-located CSS modules and unit tests.
- Reusable English-string and colour token systems (no hardcoded copy
  or hex values inside components).

---

## Quick start

```bash
# 1. Install
npm install

# 2. Create a .env.local (use .env.example as a template)
cp .env.example .env.local

# 3. Run the dev server (port 3010)
npm run dev
```

Open http://localhost:3010.

### Demo credentials

| Email                  | Password      |
| ---------------------- | ------------- |
| john@tentwenty.com     | password123   |
| salman@tentwenty.com   | password123   |

### Available scripts

| Command                | What it does                              |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Next.js dev server on port 3010           |
| `npm run build`        | Production build                          |
| `npm start`            | Run the production build                  |
| `npm run lint`         | Lint with eslint                          |
| `npm run type-check`   | TypeScript type check (no emit)           |
| `npm test`             | Run the Jest suite                        |
| `npm run test:watch`   | Jest in watch mode                        |
| `npm run test:coverage`| Jest with coverage                        |

---

## Folder structure

```
src/
├── components/
│   ├── common/               Reusable, dumb UI primitives
│   │   ├── Button/           Button.tsx + Button.module.css + Button.test.tsx
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Textarea/
│   │   ├── Checkbox/
│   │   ├── NumberStepper/
│   │   ├── Modal/
│   │   ├── ProgressBar/
│   │   ├── Pagination/
│   │   └── StatusBadge/
│   ├── dashboard/            Pieces of the timesheet list page
│   │   ├── TimesheetTable/
│   │   ├── TimesheetFilters/
│   │   └── PageSizeSelect/
│   ├── timesheet/            Pieces of the per-week detail page
│   │   ├── WeekDetail/       Container that wires data + modal
│   │   ├── DayGroup/
│   │   ├── EntryRow/
│   │   ├── AddTaskRow/
│   │   └── EntryModal/       Add/Edit form
│   ├── login/
│   │   └── LoginForm/
│   └── layout/
│       ├── PageShell/        Header + content + footer wrapper
│       ├── Header/
│       └── Footer/
├── pages/
│   ├── api/
│   │   ├── auth/[...nextauth].ts   next-auth handler
│   │   ├── projects/index.ts       GET /api/projects
│   │   ├── timesheets/
│   │   │   ├── index.ts            GET /api/timesheets (filters + pagination)
│   │   │   └── [id].ts             GET /api/timesheets/:id
│   │   └── entries/
│   │       ├── index.ts            POST /api/entries
│   │       └── [id].ts             PATCH/DELETE /api/entries/:id
│   ├── _app.tsx                    Providers (next-auth, Redux, Inter font)
│   ├── _document.tsx
│   ├── index.tsx                   Redirect → /dashboard or /login
│   ├── login.tsx                   /login page
│   └── dashboard/
│       ├── index.tsx               /dashboard list page
│       └── [id].tsx                /dashboard/:weekId per-week page
├── constants/
│   ├── strings.ts            All user-facing English copy
│   ├── routes.ts             Internal route + API URL builders
│   └── timesheet.ts          Domain constants (40h target, page sizes,
│                             status -> label/action maps, etc.)
├── helpers/
│   ├── date.ts               Tiny dependency-free date utilities
│   ├── status.ts             deriveStatusFromHours / sumEntryHours
│   ├── pagination.ts         buildPageList for the pager
│   ├── validation.ts         Login + entry form validation rules
│   ├── classNames.ts         clsx wrapper (single-import indirection)
│   ├── fetcher.ts            jsonFetch + FetchError
│   └── apiHandler.ts         ok/fail/withAuth for API routes
├── services/
│   └── timesheetService.ts   Single module that talks to /api/*
├── store/
│   ├── index.ts              configureStore + RootState/AppDispatch
│   ├── hooks.ts              Pre-typed useAppDispatch/useAppSelector
│   └── slices/
│       ├── timesheetsSlice.ts   Dashboard list state
│       └── weekDetailSlice.ts   Per-week state + CRUD thunks
├── mocks/
│   ├── users.ts              Hard-coded users for the credentials provider
│   ├── projects.ts           Project list
│   └── timesheets.ts         99-week mock dataset + in-memory CRUD store
├── styles/
│   ├── globals.css
│   └── colors.css            Color tokens (single source of truth)
└── types/
    ├── auth.types.ts
    ├── timesheet.types.ts
    ├── api.types.ts
    ├── next-auth.d.ts        Module augmentation for session.user.id
    └── index.ts              Barrel
```

### Component conventions

Every component lives in its own folder and ships with **three** files:

```
ComponentName/
  ComponentName.tsx           - the component
  ComponentName.module.css    - co-located CSS module
  ComponentName.test.tsx      - Jest + React Testing Library tests
```

This was an explicit requirement of the assessment.

---

## Frameworks & libraries

| Concern         | Choice                              | Why                                   |
| --------------- | ----------------------------------- | ------------------------------------- |
| Framework       | **Next.js 14 (Pages Router)**       | Specified in the brief.               |
| Language        | **TypeScript** (strict mode)        | Specified.                            |
| Styling         | **Tailwind CSS** + CSS Modules      | Tailwind for utility tokens; modules  |
|                 |                                     | for component-scoped styles.          |
| Auth            | **next-auth v4** (Credentials)      | Specified.                            |
| State           | **Redux Toolkit** + react-redux     | Specified in architecture guidelines. |
| Forms           | Local state + helpers/validation.ts | No framework dependency, easy to test.|
| Tests           | **Jest** + Testing Library          | "Extra credit" per the brief.         |
| Misc            | `clsx` for class composition.       | Tiny, well-known.                     |

We deliberately avoid extra UI libraries (no Material UI, no Chakra,
no Radix). The design is small enough to stay native and accessible
and the bundle stays slim.

---

## Architecture notes

### API layer

- All client → server calls go through internal `/api/*` routes.
  Components/hooks **never** import mock data directly.
- Every endpoint returns one of two envelopes:

  ```ts
  type ApiSuccess<T> = { ok: true;  data: T };
  type ApiError      = { ok: false; error: { code; message; fields? } };
  ```

  `helpers/fetcher.ts` knows how to read the envelope and throw a
  typed `FetchError` whose `.fields` are surfaced as inline form
  validation messages.

- Authenticated routes are wrapped in `withAuth(handler)` which
  returns `401` if no session is present.

### State management

The Redux store is split into two domain slices:

- `timesheetsSlice` : dashboard list + filters + pagination.
- `weekDetailSlice` : the per-week page + create/update/delete thunks.

Each thunk that mutates uses `rejectWithValue` to carry a
`MutationError { message, fields? }`. The container component
(`WeekDetail`) reads `.fields` to display per-field errors in the
entry modal. This keeps the UI decoupled from how the server formats
errors while still surfacing them precisely.

### Status derivation

`completed`/`incomplete`/`missing` is **derived**, never stored. Both
`/api/timesheets` and `/api/timesheets/:id` recompute it from the
total hours, and `weekDetailSlice` does the same locally after every
mutation so the UI updates instantly.

### Form validation

`helpers/validation.ts` exposes pure functions (`validateLogin`,
`validateEntry`). They run on the client *and* the server, ensuring a
single source of truth. The entry validator enforces:

- All required fields present.
- 1 ≤ hours ≤ 24 per entry.
- Sum of entries in a week ≤ 40 (returns "Only X more hours
  available" when the cap is hit).
- Description ≤ 500 chars.

### Date filter behaviour

The dashboard "Date Range" filter follows the brief's "if the range
covers multiple weeks, show them all" rule via
`doesWeekOverlapRange()` : a week is included when its
`[startDate, endDate]` overlaps the selected `[from, to]` range, even
if only by one day.

### Pagination

`helpers/pagination.ts` builds the design's exact page list
(`Previous 1 2 3 4 5 6 7 8 ... 99 Next`) : first 8 + ellipsis + last,
or `1 ... cur-1 cur cur+1 ... last` once you scroll past page 8.

---

## Assumptions & known limitations

1. **Mocked persistence.** The 99-week mock dataset lives in memory
   inside `src/mocks/timesheets.ts`. Add/edit/delete persists for the
   lifetime of the dev server. Restarting wipes changes : that's fine
   for the demo.
2. **5-day work week.** Week ranges are Monday–Friday (matching the
   design which only ever shows weekdays). Saturdays and Sundays are
   not modelled.
3. **`Remember me` is presentational.** next-auth v4's credentials
   provider doesn't expose per-request cookie max-age, so the toggle
   is shown for completeness but doesn't extend the session. A real
   implementation would either set a cookie max-age in a custom
   provider or persist a flag through the JWT callback.
4. **Native date inputs.** The "Date Range" filter and entry-date
   field use `<input type="date">` rather than a custom date picker.
   This was a deliberate choice for accessibility/zero-deps.
5. **Confirm on delete.** Uses a native `window.confirm` for the
   delete flow. A production app would replace this with a styled
   confirmation modal.

---

## Evaluation criteria checklist

- [x] **UI/UX** : Responsive layout, design-faithful colors, ARIA
      labels, focus rings, error states, loading states.
- [x] **API integration** : Internal Next.js API routes, typed
      response envelope, central `jsonFetch`, server-side validation
      mirrored in client helpers.
- [x] **State management** : Redux Toolkit with two domain slices,
      typed `useAppSelector` / `useAppDispatch`, thunk-based async.
- [x] **Testing** : 80+ Jest tests covering helpers, common UI, and
      page-level components (`LoginForm`, `TimesheetTable`,
      `EntryModal`, etc.).
- [x] **README** : This file.

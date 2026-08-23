# Contributing to FitTrack

Thanks for taking an interest. This document covers everything you need to make a
change that lands cleanly.

## Getting set up

```bash
git clone https://github.com/Ahmadhsn1/fittrack-gym-management.git
cd fittrack-gym-management
npm install
npm run dev
```

Requires **Node.js 20.19+** (a Vite 8 constraint). No environment variables, no
database, no external services — the app boots against in-memory fixtures.

## Before you open a pull request

Both of these must pass. CI runs the same two commands on every push and PR.

```bash
npm run lint
npm run build
```

## Branch naming

| Prefix | Use for |
| :--- | :--- |
| `feat/` | A new capability |
| `fix/` | A bug fix |
| `refactor/` | Restructuring with no behaviour change |
| `docs/` | Documentation only |
| `chore/` | Tooling, dependencies, config |

Example: `feat/attendance-history`, `fix/expiry-date-validation`

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/). One logical change
per commit — a reviewer should be able to read the log and understand the shape of
the work without opening the diff.

```
feat(members): add bulk status update
fix(payments): correct pending total when a record is deleted
refactor(context): extract shared CRUD helpers
docs(readme): document the deployment rewrite requirement
```

## Code conventions

These are the patterns the existing code follows. Matching them matters more than
personal preference.

**Data access goes through context, never through `src/data/` directly.**
Pages and components consume `useMembers()`, `usePayments()`, `useMemberships()`.
The fixtures are wired in exactly once, inside each provider. This is the seam
that lets a real backend drop in later — please don't route around it.

**Styling uses tokens, not literals.**

```jsx
// yes
<div style={{ color: 'var(--text-secondary)' }} />

// no
<div style={{ color: '#9CA6A1' }} />
```

If you need a value that has no token, add one to `src/styles/tokens.css` for
**both** themes rather than hardcoding. A hex literal in a component is a bug that
only shows up when someone toggles the theme.

**Reuse the primitives.** Before writing a new dialog, badge or blank slate, check
`src/components/` — `Modal`, `ConfirmDialog`, `Badge` and `EmptyState` already
exist and carry the app's behaviour and styling.

**Destructive actions are always confirmed.** Anything that deletes routes through
`ConfirmDialog`, and the message names the specific record being removed.

**Memoise derived lists.** Filtered and sorted collections go through `useMemo`
keyed on their real inputs.

**Keep accessibility intact.** Icon-only buttons need an `aria-label`. Don't remove
focus outlines. Don't carry meaning in colour alone.

## Project layout

```
src/
├── components/   Reusable UI — presentational, no data fetching
├── context/      The data layer. Four scoped providers.
├── data/         Seed fixtures. Imported only by providers.
├── pages/        One file per route.
└── styles/       tokens → base → layout → components
```

## Reporting bugs and requesting features

Use the [issue templates](.github/ISSUE_TEMPLATE). For a bug, the reproduction
steps are the part that actually gets it fixed — please don't skip them.

## Scope

FitTrack aims to be a genuinely useful gym admin surface, not a kitchen sink. A
feature that would only serve one specific gym's workflow is probably better as a
fork. If you're unsure whether something fits, open an issue before building it —
that conversation is cheaper than a rejected PR.

# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-08-24

First public release. Complete front end across eight routes.

### Added

**Dashboard**
- KPI tiles for total members, active members, expiring memberships and today's
  attendance — all derived from the live data layer, none hardcoded
- Weekly attendance bar chart (Recharts) themed through CSS custom properties
- Monthly revenue roll-up summing `Paid` payment records
- Recent members table sorted by join date

**Members**
- Full create / read / update / delete via a shared modal form
- Compound filtering: free-text search over name and phone, composed with status
  and plan filters, memoised with `useMemo`
- Row drill-through to a detail route, with action-cell click isolation
- Confirmation dialog on delete, naming the record being removed
- Designed empty state when filters match nothing
- Cross-field date validation — expiry must fall after start date

**Member details** (`/members/:id`)
- Personal information, membership window and attendance split
- Payment history joined from the payments store by `memberId`
- Graceful not-found state for unknown IDs

**Memberships**
- Plans as editable entities with full CRUD
- Live per-plan member counts cross-referenced from the members store
- Featured tier treatment

**Attendance**
- Daily roster with per-member present/absent toggle
- Date picker and searchable roster
- Present / absent totals recomputed on every toggle

**Trainers**
- Card-grid directory with specialty, rating, availability and experience
- Full CRUD plus a detail modal

**Payments**
- Ledger with per-row CRUD
- Status filtering across `Paid` / `Pending` / `Failed`
- Running collected-versus-pending totals in locale-formatted currency

**Settings**
- Admin profile form with save confirmation
- Dark / light theme switch

**Foundation**
- Design token system in `styles/tokens.css` covering both themes — roughly 40
  custom properties for colour, type, radius, shadow and layout
- Four-layer CSS cascade: tokens → base → layout → components
- Four scoped React Context providers (members, payments, memberships, theme),
  each with a guarded consumer hook
- Responsive layout at 1024 / 860 / 560 px, verified to 390 px
- `prefers-reduced-motion` support and styled `:focus-visible` outlines
- Zero UI dependencies — every table, modal, badge, form control, avatar and
  empty state authored in-repo
- Brand favicon matching the sidebar mark, plus `theme-color` and `description`
  meta tags in the document head

### Notes

This is the first tagged release, so there is no prior version to diff against.
The project was scaffolded from the Vite React template; its unused starter
assets (`vite.svg`, `react.svg`, `hero.png`, `icons.svg`) are not present in this
release.

[1.0.0]: https://github.com/Ahmadhsn1/fittrack-gym-management/releases/tag/v1.0.0

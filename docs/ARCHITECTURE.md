# Architecture

This document explains how FitTrack is put together and, more usefully, *why*.
The README covers what the app does; this covers the decisions underneath it.

---

## 1. Shape of the application

FitTrack is a client-rendered single-page application. There is no server, no
build-time data fetching and no routing on a backend. One HTML document loads one
JS bundle, React takes over the `#root` node, and React Router owns the URL from
there.

```
index.html
   └── src/main.jsx
         ThemeProvider                  ← sets data-theme on <html>
           └── MembersProvider          ← member records + CRUD
                └── PaymentsProvider    ← payment records + CRUD
                     └── MembershipsProvider   ← plan records + CRUD
                          └── BrowserRouter
                               └── App   ← app shell + <Routes>
```

The nesting order is deliberate. `ThemeProvider` sits outermost because it writes
to `document.documentElement` and nothing else depends on it. The three data
providers sit inside it and outside the router, so navigating between routes never
unmounts a store — member state survives a trip to Payments and back.

### The shell

`App.jsx` renders a persistent two-part chrome — `Sidebar` and `Topbar` — with
`<Routes>` mounted in the content area. Only the content region swaps on
navigation. `App` owns exactly one piece of state, `sidebarOpen`, which drives the
mobile drawer; every other piece of state lives either in a provider or in the
page that needs it.

---

## 2. The data layer

### Why Context and not Redux

The app has four stores, no async, no middleware, no time-travel requirement and
no cross-cutting derived state that isn't cheap to compute in a render. Redux
would add a dependency, a boilerplate tax and an indirection layer to buy
capabilities this problem doesn't have. Context plus `useState` is the correct
size of tool.

### Why four providers and not one

A single `AppContext` holding everything would mean any update re-renders every
consumer. Splitting by domain means a theme toggle doesn't touch the payments
table, and adding a member doesn't re-render the trainer grid.

The split also enforces a boundary. `PaymentsContext` cannot accidentally mutate
member records, because it has no reference to them. Cross-domain reads happen at
the *page* level, where they're visible:

```jsx
// MemberDetails.jsx — the join is explicit and local
const { members }  = useMembers();
const { payments } = usePayments();

const member         = members.find(m => String(m.id) === id);
const memberPayments = payments.filter(p => p.memberId === Number(id));
```

### Guarded consumer hooks

Every store exports a hook that fails loudly rather than returning `undefined`:

```jsx
export function useMembers() {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error('useMembers must be used within MembersProvider');
  return ctx;
}
```

Without the guard, rendering a component outside its provider yields `undefined`,
and the failure surfaces later as `Cannot read properties of undefined (reading
'members')` somewhere down the tree. With it, you get the component's name and the
missing provider at the exact call site.

### Intention-named mutators

Providers expose verbs, not setters:

```jsx
value={{ members, addMember, updateMember, deleteMember }}
```

`setMembers` is never handed out. A consumer cannot replace the collection with
the wrong shape, and every write path is greppable — searching `deleteMember`
finds every place a member can be removed.

Updates are immutable and functional, so React's batching and `StrictMode`
double-invocation both behave:

```jsx
const updateMember = (id, data) =>
  setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...data } : m)));
```

### Fixtures as a placeholder, not a foundation

`src/data/` holds realistic seed data — 26 members, 26 payment records, 5
trainers, 3 plans, a week of attendance. It is imported in exactly one place per
domain: the provider's `useState` initialiser.

```jsx
import { members as initialMembers } from '../data/members';
const [members, setMembers] = useState(initialMembers);
```

**No page or component imports from `src/data/`.** That single rule is what makes
the backend swap tractable. Replacing fixtures with a real API means changing
those four initialisers into fetches and adding loading state to the provider's
return value. The 8 pages and 11 components consuming the hooks don't change at
all, because the contract they were written against — `{ members, addMember,
updateMember, deleteMember }` — is unchanged.

### Known limitation

State lives in memory and resets on reload. This is honest scope, not an
oversight: the app is a complete front end awaiting a persistence layer.
`localStorage` was considered and rejected — it would make the demo feel
persistent while entrenching a data model that a real backend has to undo.

---

## 3. Rendering and derived state

Nothing meaningful is stored twice. Every aggregate is computed from the stores at
render time:

```jsx
const activeMembers  = members.filter(m => m.status === 'Active').length;
const monthlyRevenue = payments
  .filter(p => p.status === 'Paid')
  .reduce((sum, p) => sum + p.amount, 0);
```

The alternative — caching counts alongside the records — creates two sources of
truth that drift the moment one write path forgets to update the cache. At this
data scale the recompute is free, so the correct trade is to always derive.

Where a derivation is non-trivial and runs on every keystroke, it's memoised:

```jsx
const filtered = useMemo(() => {
  return members.filter(m => {
    const matchesQuery  = m.name.toLowerCase().includes(query.toLowerCase())
                       || m.phone.includes(query);
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesPlan   = planFilter   === 'All' || m.plan   === planFilter;
    return matchesQuery && matchesStatus && matchesPlan;
  });
}, [members, query, statusFilter, planFilter]);
```

Three independent filter dimensions compose into one predicate and one pass over
the collection, recomputed only when an actual input changes.

---

## 4. Component design

### Composition over configuration

`Modal.jsx` is a shell with no knowledge of what it contains. It owns the overlay,
the click-outside dismissal and the labelled close button, and takes `title`,
`children` and `footer`:

```jsx
<div
  className="modal-overlay"
  onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
>
```

The `e.target === e.currentTarget` guard matters: without it, a text selection
that starts inside the dialog and ends on the overlay closes the dialog and
discards the user's input. `onMouseDown` rather than `onClick` makes the intent
unambiguous.

Six components compose this shell: `ConfirmDialog`, `AddMemberModal`,
`EditPaymentModal`, `EditPlanModal`, `EditTrainerModal`, and the trainer detail
view. Overlay behaviour is defined once.

### One form, two flows

`AddMemberModal` handles create and edit by branching on an optional
`initialData` prop:

```jsx
const isEdit = Boolean(initialData);
const [form, setForm] = useState(initialData ? { /* mapped */ } : emptyForm);
```

The alternative — a separate `EditMemberModal` — duplicates ten fields, the
layout and the validation rules, and guarantees the two drift apart. The mapping
step is where the seam sits: the form's `startDate` maps to the domain's
`joinDate`, and that translation lives in one place.

On edit, fields the form doesn't own are preserved rather than reset:

```jsx
status:     initialData ? initialData.status     : 'Active',
attendance: initialData ? initialData.attendance : { present: 0, absent: 0 },
```

Editing a member's phone number does not silently wipe their attendance history.

### Validation

Three layers, cheapest first:

1. **Native constraints** — `required`, `type="email"`, `type="number"` with
   `min`/`max`, `type="date"` with a `min` bound to the chosen start date.
2. **A submit guard** for required fields.
3. **A cross-field rule** the browser cannot express — expiry must fall strictly
   after start — which renders an inline error and clears on the next edit:

```jsx
if (form.expiryDate <= form.startDate) {
  setDateError('Expiry date must be after the start date.');
  return;
}
```

### Status colour in one place

`Badge.jsx` is the only component that maps a status string to a colour. `Active`,
`Present` and `Paid` all resolve to `--success` through it. Nothing else in the
codebase decides what green means, so adding a status is a one-file change.

### Click isolation in interactive rows

Member rows navigate on click *and* contain Edit and Delete buttons. The action
cell stops propagation:

```jsx
<div className="row-actions" onClick={(e) => e.stopPropagation()}>
```

Without it, every delete would also navigate to the record being deleted.

---

## 5. Styling

### Four layers, loaded in order

| Order | File | Owns |
| :-- | :--- | :--- |
| 1 | `tokens.css` | Custom properties for both themes. No selectors beyond `:root`. |
| 2 | `base.css` | Reset, body type, focus rings, scrollbars, reduced-motion |
| 3 | `layout.css` | App shell, sidebar, topbar, breakpoints |
| 4 | `components.css` | Cards, tables, buttons, badges, forms, modals |

Each layer may consume the ones above it and never reaches downward. Specificity
stays flat — single classes throughout, no nesting battles, no `!important`
outside the reduced-motion override.

### Why hand-authored CSS

A utility framework would ship a large stylesheet and put styling decisions in
markup. Here, the entire application — two themes, every component, every
breakpoint — compiles to **3.43 kB gzipped**. The token layer means a design
change happens in one file rather than across every class list.

The real payoff is theming.

### One attribute, two themes

`tokens.css` defines the dark palette on `:root` and re-points the same names
under an attribute selector:

```css
:root                    { --bg: #0A0E0D; --card: #131917; --text-primary: #F5F7F5; }
html[data-theme="light"] { --bg: #F5F7F4; --card: #FFFFFF; --text-primary: #14231A; }
```

`ThemeContext` writes the attribute and nothing else:

```jsx
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);
```

No component reads `theme`. No component branches on it. Because every rule
already resolves through a custom property, changing one attribute re-themes the
entire tree in a single style recalculation.

Note that semantic status colours are held constant across themes. `--success`
stays `#34D399` in both, because "paid" should not change meaning with ambient
light. Only surfaces, borders, text and shadows re-point.

### Charts inherit the theme

This is the part that usually breaks. Chart libraries want colour literals in JS
config, which means a second palette that drifts from the CSS one and a manual
branch on the active theme.

Recharts accepts arbitrary SVG attribute values, so it can be handed the tokens
directly:

```jsx
<CartesianGrid stroke="var(--border)" />
<XAxis stroke="var(--text-muted)" />
<Bar   fill="var(--accent)" radius={[5, 5, 0, 0]} />
<Tooltip contentStyle={{
  background: 'var(--card)',
  border: '1px solid var(--border)',
}} />
```

The chart re-themes with the DOM. There is no chart-specific palette, no
`theme === 'dark' ? … : …` in render, and no way for the two to disagree.

---

## 6. Responsive strategy

Desktop-first, with three breakpoints that each solve a specific failure:

| Breakpoint | Problem | Response |
| :--- | :--- | :--- |
| `1024px` | Two-column grids and charts get too narrow to read | Stack to one column |
| `860px` | A 248 px fixed sidebar eats the content area | Sidebar becomes an off-canvas drawer with a backdrop |
| `560px` | Four stat tiles in a row become unreadable | Single column; tables condense |

The drawer is CSS-driven — `App` toggles an `open` class and the sidebar
transitions on `transform`. `onNavigate` closes it on link click, so tapping a nav
item doesn't leave the drawer covering the page you just opened. The backdrop is a
sibling element that closes on click, which is both the expected gesture and a
larger touch target than the close button.

Tables scroll horizontally inside `.table-wrap` rather than reflowing into cards.
For a data-dense admin table, preserving column alignment is more useful on a
phone than a stack of label/value pairs.

---

## 7. Trade-offs and what comes next

Decisions made knowingly, with the reasoning:

**In-memory state.** No persistence layer. Isolated behind context so it can be
replaced without touching the UI. `localStorage` was rejected as a false
milestone.

**One eager bundle.** 190 kB gzipped, dominated by Recharts and React DOM. Route-
level `React.lazy` is the obvious next step and moves the chart library off the
critical path for six of eight routes — deferred until there is a real network to
measure against.

**JavaScript, not TypeScript.** The entity shapes are stable and documented
through the fixtures. TS is on the roadmap; adding it now, before the persistence
layer settles the real API shapes, would mean typing the same objects twice.

**No test suite yet.** The honest reason is that the highest-value tests here are
against the filter and derivation logic, and that logic is currently inlined in
page components. Extracting it into pure functions is the prerequisite, and doing
that properly is the first item of test work rather than a separate refactor.

**Attendance is a single day.** The roster is one in-memory array, so toggles
don't accumulate into history. Per-day persisted records are a data-layer feature,
not a UI one.

**Form labels are not programmatically bound.** `<label>` elements are present and
visually correct but lack `htmlFor`/`id` pairing, so screen readers don't
associate them with their inputs. `Modal` also lacks a focus trap and
`Escape`-to-close. Both are tracked accessibility work in the README roadmap.

---

## 8. File map

```
src/
├── main.jsx                    Entry. Provider nesting + router mount.
├── App.jsx                     Shell. Route table. Owns sidebarOpen.
├── index.css                   Imports the four style layers in order.
│
├── context/                    ── THE DATA LAYER ──
│   ├── MembersContext.jsx      members + add/update/delete
│   ├── PaymentsContext.jsx     payments + add/update/delete
│   ├── MembershipsContext.jsx  plans + add/update/delete
│   └── ThemeContext.jsx        theme + toggle; writes data-theme
│
├── data/                       Seed fixtures. Imported only by providers.
│   ├── members.js              26 records
│   ├── payments.js             26 records
│   ├── trainers.js             5 records
│   ├── memberships.js          3 plans
│   └── attendance.js           weekly totals + today's roster
│
├── pages/                      One per route.
│   ├── Dashboard.jsx           Derived KPIs, chart, recent members
│   ├── Members.jsx             Table, compound filters, CRUD
│   ├── MemberDetails.jsx       /members/:id — cross-store join
│   ├── Memberships.jsx         Plan cards with live counts
│   ├── Attendance.jsx          Daily roster toggle
│   ├── Trainers.jsx            Staff grid (local state, not context)
│   ├── Payments.jsx            Ledger, status filter, running totals
│   └── Settings.jsx            Profile form, theme switch
│
├── components/
│   ├── Modal.jsx               Overlay shell. Composed by 6 dialogs.
│   ├── ConfirmDialog.jsx       Destructive-action guard.
│   ├── AddMemberModal.jsx      Create + edit. Cross-field date validation.
│   ├── EditPaymentModal.jsx
│   ├── EditPlanModal.jsx
│   ├── EditTrainerModal.jsx
│   ├── Sidebar.jsx             Data-driven nav. Drawer below 860px.
│   ├── Topbar.jsx              Search, notifications, menu trigger.
│   ├── StatCard.jsx            KPI tile with delta indicator.
│   ├── TrainerCard.jsx
│   ├── Badge.jsx               Single source of truth for status colour.
│   └── EmptyState.jsx
│
└── styles/
    ├── tokens.css              Both themes. ~40 custom properties.
    ├── base.css                Reset, type, focus, reduced-motion.
    ├── layout.css              Shell, sidebar, topbar, breakpoints.
    └── components.css          Cards, tables, buttons, badges, forms.
```

One asymmetry worth naming: `Trainers.jsx` keeps its records in local `useState`
rather than a provider, because nothing else in the app reads trainer data.
Promoting it to context is a small, mechanical change the moment a second
consumer appears — for example, assigning a trainer from the member detail view.

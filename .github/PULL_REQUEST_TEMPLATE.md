## What this changes

<!-- One or two sentences. What is different after this PR? -->

## Why

<!-- The problem being solved. Link the issue if there is one: Closes #123 -->

## Type of change

- [ ] Bug fix — restores intended behaviour
- [ ] Feature — adds a new capability
- [ ] Refactor — no behaviour change
- [ ] Docs
- [ ] Tooling / chore

## Screenshots

<!--
For any visual change, include before and after. If it touches layout or
colour, show BOTH themes — a change that looks right in dark mode and breaks
in light mode is the single most common regression in this codebase.
-->

| Before | After |
| :--- | :--- |
|  |  |

## Checks

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] I verified the change in **both** dark and light themes
- [ ] I verified the change at mobile width (≤ 560 px)

## Conventions

- [ ] Data access goes through a context hook, not a direct `src/data/` import
- [ ] Colours use tokens (`var(--…)`), with no hex literals added to components
- [ ] Any new token was added for both themes in `styles/tokens.css`
- [ ] Existing primitives were reused where they applied (`Modal`, `ConfirmDialog`,
      `Badge`, `EmptyState`)
- [ ] Destructive actions are guarded by a confirmation dialog
- [ ] Icon-only controls have an `aria-label`
- [ ] Derived lists are memoised

## Anything reviewers should know

<!-- Trade-offs you made, things you deliberately left out, areas you'd like a
     closer look at. -->

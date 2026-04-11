# Proposal: Screen 1 HLTV Layout

## Intent

Convert the static HLTV-inspired mock in `public/code.html` into the first real Angular screen, keeping the dark dashboard style while aligning it with the local Tailwind + Angular Material setup.

## Scope

### In Scope

- Rebuild screen 1 as a routed Angular dashboard page.
- Split the monolithic template into shell + presentational sections.
- Define local styling tokens/structure for the dark theme, spacing, and card density.
- Use `public/` assets as visual reference only, not as runtime dependencies.

### Out of Scope

- Backend integration and live data fetching.
- Authentication, user preferences, or personalization.
- Full redesign of later screens.
- Pixel-perfect cloning of external CDN/font/image behavior.

## Capabilities

### New Capabilities

- `screen-1-dashboard-layout`: dashboard shell, hero banner, live match card, upcoming/results lists, and right-rail composition.

### Modified Capabilities

- None.

## Approach

- Keep one screen route, but break it into reusable sections/components.
- Move static data into typed view-models in the page TS file or small local models.
- Prefer Tailwind utility classes for layout/spacing, with Angular Material only where it adds value.
- Replace CDN assumptions from `public/code.html` with app-owned tokens and local assets strategy.

## Affected Areas

| Area                            | Impact            | Description                                         |
| ------------------------------- | ----------------- | --------------------------------------------------- |
| `public/code.html`              | Reference         | Source layout/content contract for screen 1.        |
| `public/*.png`, `public/*.jpeg` | Reference         | Visual density and composition guidance.            |
| `src/app/app.html`              | Modified          | Break the single template into screen sections.     |
| `src/app/app.ts`                | Modified          | Introduce typed view-models and mock data.          |
| `src/styles.scss`               | Modified          | Own local theme tokens and Tailwind-aligned styles. |
| `src/index.html`                | Possibly modified | Revisit external icon/font loading if needed.       |
| `angular.json`                  | Possibly modified | Only if asset or style pipeline needs adjustment.   |

## Risks

| Risk                                              | Likelihood | Mitigation                                                              |
| ------------------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| CDN-based mock diverges from local build behavior | High       | Recreate styles locally and treat `public/code.html` as reference only. |
| Monolithic template becomes hard to maintain      | Medium     | Split into shell/sections from the start.                               |
| Remote images/fonts introduce flaky rendering     | Medium     | Define a local asset strategy early.                                    |

## Rollback Plan

Revert the screen 1 refactor by restoring the previous `app.html`/`app.ts` state and removing any new section components or style tokens. Keep `public/code.html` untouched as a reference artifact.

## Dependencies

- Existing Angular 21 + Tailwind setup.
- Reference materials in `public/`.

## Success Criteria

- [ ] Screen 1 renders from the Angular app without relying on the CDN mock.
- [ ] Layout matches the intended dark dashboard composition.
- [ ] Sections are split into maintainable units.
- [ ] Proposal is ready for spec breakdown.

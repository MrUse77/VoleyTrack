# Design: Screen 1 HLTV Layout

## Technical Approach

Implement Screen 1 as a standalone routed Angular 21 page (`loadComponent`) and decompose the current monolithic mock into a page shell plus focused presentational components. Tailwind will own layout, spacing, and responsive behavior; Angular Material will be kept only where it adds value (buttons/icons/theme primitives).

## Architecture Decisions

| Decision         | Choice                                                              | Alternatives considered           | Rationale                                                                             |
| ---------------- | ------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| Page composition | Route-level `screen-one.page` with nested presentational components | Keep everything in `App` template | Makes the screen maintainable and keeps root bootstrap thin.                          |
| Data model       | Typed local mock view-models in `.models.ts`                        | Untyped arrays in template TS     | Improves clarity, supports future backend swap, and keeps template logic small.       |
| Styling strategy | Tailwind utilities + a small set of CSS tokens in `src/styles.scss` | SCSS-heavy component styling      | Tailwind is better for dense dashboard layout; tokens prevent arbitrary-color sprawl. |
| Icons            | `MatIconModule` API + local SVG registry for critical icons         | Google Material Icons CDN font    | Avoids runtime CDN dependency while preserving familiar icon usage.                   |

## Data Flow

`app.routes.ts` → `screen-one.page` → local view-models → child components

    route
      ↓

ScreenOnePage
├─ Top strip / header
├─ Hero / live match
├─ Secondary lists
└─ Right rail cards

The page owns mock data and passes compact inputs to each presentational component. No service/store is needed yet.

## File Changes

| File                            | Action | Description                                                                       |
| ------------------------------- | ------ | --------------------------------------------------------------------------------- |
| `src/app/app.routes.ts`         | Modify | Add the screen-1 route as the default path using lazy standalone loading.         |
| `src/app/app.ts`                | Modify | Reduce root component to a router host / minimal shell.                           |
| `src/app/features/screen-one/*` | Create | Page component, child components, and mock models for the dashboard.              |
| `src/styles.scss`               | Modify | Define dark tokens (`--vt-*`) and global focus/spacing baselines.                 |
| `src/index.html`                | Modify | Remove CDN font assumptions; keep only app-safe metadata and local icon strategy. |

## Interfaces / Contracts

```ts
export interface ScreenOneVm {
  brand: { title: string; subtitle: string };
  utility: { live: boolean; dateLabel: string };
  navigation: NavItem[];
  hero: LiveMatchVm;
  lists: MatchListVm[];
  rail: RailCardVm[];
}
```

Child components should receive narrow inputs like `@Input() hero`, `@Input() items`, `@Input() actions`, never the whole page VM.

## Testing Strategy

| Layer       | What to Test                                 | Approach                                                                   |
| ----------- | -------------------------------------------- | -------------------------------------------------------------------------- |
| Unit        | Component rendering and empty-state fallback | `ng test` with shallow DOM assertions on the page and leaf components.     |
| Integration | Route activation and responsive composition  | Validate the default route renders all required sections in one host spec. |
| E2E         | Not planned yet                              | No end-to-end infra exists in this repo.                                   |

## Migration / Rollout

No data migration required. Roll out by replacing the root template with the routed page and keeping `public/code.html` as a reference artifact only.

## Open Questions

- [ ] Do we want to keep any Google font dependency for typography, or fully self-host later?
- [ ] Should the right rail be a reusable generic card grid now, or stay screen-specific for this first iteration?

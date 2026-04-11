## Exploration: frontend-screen-1-hltv-layout

### Current State

- `public/code.html` is a static HLTV-style mock that depends on Tailwind CDN, inline Tailwind config, remote Google Fonts, Material Symbols, and remote images.
- The Angular app already has local Tailwind v4 wired through `src/styles.scss` + PostCSS, and Material icons are loaded from Google Fonts in `src/index.html`.
- The current screen is a single large template in `src/app/app.html` backed by static arrays in `src/app/app.ts`.

### Affected Areas

- `public/code.html` — source reference for layout, spacing, colors, and content hierarchy.
- `public/*.png|*.jpeg` — visual references for the target composition and density.
- `src/app/app.html` — needs decomposition into reusable screen sections.
- `src/app/app.ts` — current data shape should become typed view-models per section.
- `src/styles.scss` — local Tailwind entry point; should own theme tokens instead of CDN config.
- `src/index.html` — currently hosts Material Icons font load.
- `angular.json` — confirms `public/` asset delivery and local style pipeline.

### Approaches

1. **Single screen component + internal section components** — keep one route and split the template into shell/header/nav/hero/live panel/lists/cards.
   - Pros: lowest migration cost; easy to match the mock quickly; keeps routing simple.
   - Cons: large feature component unless further broken into presentational children.
   - Effort: Medium

2. **Composable dashboard shell + domain sections** — create a shell layout component plus small reusable cards/lists for live matches, upcoming, results, and right rail.
   - Pros: better long-term maintainability; easier to reuse sections in later screens; cleaner state boundaries.
   - Cons: more files and initial setup; slightly slower to reach pixel parity.
   - Effort: Medium/High

### Recommendation

Start with a shell + section split: `Header`, `TopBar/Filters`, `Hero`, `LiveMatchCard`, `MatchListSection`, `RightRail`. This matches the static mock closely while avoiding an oversized monolith and keeping the next refactor cheap.

### Risks

- Tailwind CDN behavior in `public/code.html` can mask differences from the local build pipeline; do not port it verbatim.
- `src/index.html` still loads Material Icons from Google Fonts, so offline/build reproducibility is weaker unless icons are migrated later.
- Angular Material + Tailwind can clash on defaults if spacing/typography tokens are not aligned early.
- The mock relies on remote images and avatars; asset strategy must be defined before pixel-perfect work.

### Ready for Proposal

Yes — the exploration is sufficient to draft a proposal with a clear component split, styling strategy, and risk rollback plan.

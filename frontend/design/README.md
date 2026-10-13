# VoleyTrack Frontend Design

**Canonical implementation reference:** [`html/`](html/) — the vendored HTML/CSS design pack.

This directory is **design-only**. No runtime frontend implementation lives here; the
implementation source is `frontend/src/`.

## What is canonical, and why

The design authority for this repository is the **HTML/CSS design pack** in [`html/`](html/):

| Path | Role |
|---|---|
| `html/voleytrack.css` | Shared shell + primitives (the authoritative palette, radii, spacing) |
| `html/voleytrack-*.css` | Per-section styles |
| `html/voleytrack-*.html` | 21 screens: public (invitado), planillero and admin |
| `html/brand-spec.md` | Derived token/typography notes extracted from the original canvas |
| `html/imagen.png` | The 512×512 VoleyTrack mark used by the shell |
| `html/README.md` | The pack's own provenance and usage notes |

The design became canonical on 2026-10-11, when it arrived as
`voleytrack-proyecto-2026-10-11.zip`. It is a newer revision of the same product design.

### Governance rule for conflicts

`html/brand-spec.md` is a **derived** document and carries two values that contradict the
runnable CSS it was extracted from. When the CSS and the derived notes disagree, **the CSS
wins**. Confirmed cases:

| Token | CSS (`html/voleytrack.css`) | `brand-spec.md` | Adopted |
|---|---|---|---|
| `success` | `#22c55e` | `#4caf50` | **CSS** |
| `danger` | `#ef4444` | `#ef4444` / `#f44336` | **CSS** |

## Retired: the OpenPencil canvas documents

The previous design authority was `voleytrack-webapp-design.op`, a single 23-page OpenPencil
document (`.pen` being its OpenDesign canvas copy). Both are **retired as design authority** by
explicit product decision:

- They are not migrated, edited, or validated any further.
- They are not required to implement or review frontend work.
- Where a canvas page and an HTML screen disagree, the HTML screen is the intent.

The `.op` file may still be present in this directory as a historical artifact. It is not
referenced by the implementation and can be removed whenever the maintainer decides to; it
remains recoverable from git history either way.

## Scope of the design pack

The pack covers the core application flows:

- **Auth** — `voleytrack-login.html`
- **Public / invitado** — dashboard, partidos, torneos, equipos, jugadores, live
- **Scoring / planillero** — `voleytrack-planillero.html`
- **Admin** — torneos (list, create, edit, view, bracket), equipos (list, create, view),
  jugadores (list, create), partidos (list, create), staff gestión

Unlike the retired canvas, the pack treats the tournament views as **in scope**, including the
bracket (`voleytrack-admin-ver-copa.html`) and the tournament overview. The canvas-era
"V1 boundary" note that excluded tournament views no longer applies.

## UI/UX Audit

See the [UI/UX parity audit](voleytrack-webapp-uiux-audit.md) for the source-level comparison
between the original canvas revision and the frontend implementation as it stood at that time.
It is a historical record of that earlier comparison, not a statement about the current pack.

## Using the pack

Each screen is a self-contained file. Open it directly in a browser:

```bash
xdg-open frontend/design/html/voleytrack-dashboard.html
```

Screens link to each other for navigation, and share `html/voleytrack.css` plus one
per-section stylesheet. Avatars point at the external `i.pravatar.cc` placeholder service;
nothing else is fetched remotely.

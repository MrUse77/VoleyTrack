# VoleyTrack Frontend Design

**Canonical file:** `voleytrack-webapp-design.op`

This directory contains the visual design for the VoleyTrack web application. It is **design-only** — no runtime frontend implementation lives here. The implementation source is in `frontend/src/`.

## Artifact Provenance

From this commit forward, this file is the repository's sole canonical design source. Previous recovery artifacts are intentionally excluded from version control.

## PR Size Exception

This PR has an intentional size exception. The canonical `voleytrack-webapp-design.op` is a single, native, atomic 23-page OpenPencil document that cannot be meaningfully split into smaller units without breaking design integrity and cross-page references.

## Review Boundary

The review boundary is the whole OpenPencil document (`.op` file). Reviewers should verify design intent, page structure, visual consistency, and metadata correctness. This is **not** a review of runtime frontend implementation — that lives in `frontend/src/` and follows its own review process.

## Viewer / Editor

Open the canonical file with [OpenPencil](https://openpencil.dev):

```bash
op open frontend/design/voleytrack-webapp-design.op
```

## Design Scope

This document covers 23 pages across the core application flows:

- **0.01** — Autenticación
- **1.0x** — Public-facing views (Spectator Dashboard, Matches)
- **1.0x** — Tournament views (**future-scope exploratory design**, excluded from V1 implementation)
- **2.0x** — Match management (Setup, Scoring Console, Post-Match Summary)
- **3.0x** — Staff management and admin forms/listings
- **Z.xx** — Public tournament tabs (exploratory, excluded from V1)
- **Z.20** — UI States (**generic V1-ready design reference** — included in V1)

## V1 Implementation Boundary

Tournament views (pages 1.03, 1.04, and all `Z.*`-prefixed pages **except `Z.20 UI States`**) are **future-scope exploratory design**. They are not part of the V1 frontend implementation plan.

The `Z.20 UI States` page remains a generic V1-ready design reference — it documents common UI patterns (loading, empty, error, edge cases) that apply across all V1 flows.

## Recovery Guidance

To recover and validate this design document:

1. **Validate JSON** — ensure the `.op` file parses as valid JSON.
2. **Open with OpenPencil** — `op open frontend/design/voleytrack-webapp-design.op`.
3. **Recover from Git history** — the canonical file and this PR's commit history are the authoritative recovery source.
4. **No external backup or local tool config required** — everything needed to recover the design is in this repository.

# Proposal: Business-First Backend Structure for Matches

Prepare the new Java backend with a hexagonal, business-first package organization for the `partidos` bounded context, so the first concrete slice, **Create match**, has a clear place to evolve without falling into generic Spring folders.

## Intent

The backend is a new Spring Boot application and currently needs an explicit package structure that reflects the product domain before feature work starts. Without this, the codebase can drift into framework-first folders such as `controllers`, `services`, and `repositories`, making match orchestration harder to reason about as volleyball rules, scoring, roster constraints, and live statistics grow.

This change establishes the organization needed for the `partidos` context first. Other bounded contexts are documented as future modules, but this proposal intentionally avoids creating broad empty implementation structures for all of them.

## Scope

### In Scope

- Define the backend package/folder organization for the `partidos` / matches bounded context.
- Prepare minimal skeleton and documentation needed for the first business slice: **Create match**.
- Use hexagonal architecture naming: domain model, application use cases/ports, and adapters.
- Document future bounded contexts: `usuarios`, `plantel`, and `live-stats`.
- Keep the package structure under the existing root package: `com.mrusedev.voleytrack`.
- Keep review scope small enough to stay within the 400 changed-line review budget.

### Out of Scope

- Persistence implementation.
- Database migrations or schema design.
- REST endpoints unless later specs/tasks explicitly select them.
- Full match lifecycle beyond the structural preparation for **Create match**.
- Creating implementation modules for every bounded context.
- Frontend changes.
- Authentication, authorization, or user management behavior.

## Product Context

| Topic | Decision |
|-------|----------|
| First bounded context | `partidos` / matches |
| First business slice | Create match |
| Primary goal | Make the Java backend structure express the volleyball business domain before adding behavior |
| Future contexts | `usuarios`, `plantel`, and `live-stats` are documented only |
| Architecture style | Hexagonal Architecture with DDD-oriented package boundaries |

## Proposal Question Round

The user already clarified that **Create match** is the first concrete slice and that other bounded contexts should be documented only. The following product questions should be reviewed before downstream spec/design work so the proposal does not overbuild or miss domain constraints:

1. What is the minimum valid information required to create a match: teams, scheduled date, competition/tournament, venue, match format, or only participating sides?
2. At creation time, should a match be independent from `plantel`, or must it reference existing teams and players once that context exists?
3. Who is expected to create matches in the product workflow: an admin, scorer, coach, or any authenticated user?
4. Should the first slice model only a scheduled match, or also allow an immediately live/in-progress match?
5. What should remain intentionally undocumented for now to avoid constraining future live-stat and roster decisions too early?

### Current Assumptions

- The first implementation slice should only need enough structure to place a future `CreateMatch` use case coherently.
- Cross-context references should be represented as boundaries or documentation, not implemented integrations.
- Match creation rules can be refined in the spec/design phases before code is written.

## Approach

Use a vertical bounded-context package for matches instead of generic Spring folders. The expected shape is:

```text
backend/src/main/java/com/mrusedev/voleytrack/
  partidos/
    domain/
    application/
      port/
        in/
        out/
    adapter/
      in/
      out/
```

The proposal does not require every folder to contain production code immediately. The next phases should decide the smallest useful skeleton for **Create match**, favoring named package boundaries and documentation over empty placeholder classes.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/src/main/java/com/mrusedev/voleytrack/partidos/` | New planned area | Business-first package boundary for matches |
| `backend/src/main/java/com/mrusedev/voleytrack/partidos/domain/` | New planned area | Match domain concepts and invariants when specs define them |
| `backend/src/main/java/com/mrusedev/voleytrack/partidos/application/` | New planned area | Use cases and ports for Create match |
| `backend/src/main/java/com/mrusedev/voleytrack/partidos/adapter/` | New planned area | Framework adapters selected by later specs/tasks |
| Backend architecture documentation | New/updated | Explain future modules without creating broad empty implementation structures |
| `openspec/changes/backend-match-structure/` | New | SDD artifacts for this change |

## Acceptance Criteria

- [ ] The backend package structure is business-first and centered on `partidos`, not generic Spring layers.
- [ ] The structure supports a future **Create match** use case without requiring persistence or REST decisions yet.
- [ ] Other bounded contexts are documented as future modules only.
- [ ] No broad empty module tree is created for `usuarios`, `plantel`, or `live-stats`.
- [ ] Package names remain under `com.mrusedev.voleytrack`.
- [ ] The resulting change stays understandable within the 400-line review budget.

## Review Workload Expectations

| Concern | Expectation |
|---------|-------------|
| Changed-line budget | Target under 400 changed lines |
| Review focus | Package boundaries, naming, and scope discipline |
| Chained PRs | Not expected for this structural slice unless later specs expand scope |
| Risk level | Low to medium; architectural drift risk matters more than runtime risk |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Overbuilding empty modules | Medium | Limit implementation structure to `partidos`; document other contexts only |
| Framework-first drift | Medium | Use bounded-context and hexagonal package names from the start |
| Premature domain modeling | Medium | Keep Create match rules in spec/design before adding behavior |
| Ambiguous cross-context ownership | Medium | Document future integrations instead of implementing them in this slice |
| Review fatigue from architecture churn | Low | Keep the first slice small and under the review budget |

## Rollback Plan

1. Revert the package/documentation changes introduced for `partidos`.
2. Remove any empty or placeholder files created only to preserve directories.
3. Keep the Spring Boot application root unchanged.
4. Re-run the backend test command after rollback: `cd backend && ./gradlew test`.

## Success Criteria

- [ ] Reviewers can identify where Create match domain, application, and adapter code will live.
- [ ] The package organization communicates the volleyball business domain before Spring mechanics.
- [ ] Future bounded contexts are visible in documentation without appearing implemented.
- [ ] No persistence, endpoint, or full lifecycle behavior is introduced by this proposal alone.
- [ ] The next SDD phases can write specs/design/tasks without needing to re-decide the top-level backend organization.

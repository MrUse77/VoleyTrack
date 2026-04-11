# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | /home/agustin/.config/opencode/skills/branch-pr/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage | go-testing | /home/agustin/.config/opencode/skills/go-testing/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | /home/agustin/.config/opencode/skills/issue-creation/SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | /home/agustin/.config/opencode/skills/judgment-day/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | /home/agustin/.config/opencode/skills/skill-creator/SKILL.md |

## Compact Rules

### branch-pr
- Every PR MUST link an approved issue (`Closes/Fixes/Resolves #N`)
- Add exactly one `type:*` label
- Branch names must match `type/description` with lowercase `a-z0-9._-`
- Commit messages must follow conventional commits regex
- PR body should include summary, changes table, test plan, and checklist
- Run shellcheck on modified scripts before opening PR

### go-testing
- Prefer table-driven tests for multiple cases
- Test Bubbletea models via direct `Update()` state transitions
- Use `teatest.NewTestModel()` for full TUI flows
- Use golden files for view rendering checks
- Use `t.TempDir()` for filesystem tests and mock side-effectful dependencies

### issue-creation
- Blank issues are disabled; always use a template
- Search for duplicates before creating an issue
- Every new issue starts with `status:needs-review`
- A maintainer must add `status:approved` before any PR
- Questions belong in Discussions, not issues
- PRs must not be opened until approval exists

### judgment-day
- Resolve the skill registry first, then inject matching compact rules into BOTH judges and the fix agent
- Launch two blind judges in parallel via `delegate`; never review yourself
- Classify warnings as real vs theoretical; only real warnings block
- Fix agent must only touch confirmed issues and apply the same fix pattern everywhere
- After 2 fix iterations, ask the user whether to continue or escalate

### skill-creator
- Create skills only for reusable patterns; avoid one-offs and trivial docs
- Keep SKILL.md focused on critical patterns, minimal examples, and commands
- Description must include both what the skill does and the trigger phrase
- Use local `references/` paths, not web URLs
- Add the new skill to AGENTS.md after creating it

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | /home/agustin/Documentos/Proyectos/VoleyTrack/AGENTS.md | Root stack/architecture convention; current frontend implementation diverges from its Angular note |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.

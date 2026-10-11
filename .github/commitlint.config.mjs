// Commitlint config — enforces Conventional Commits for this repository.
// Not wired to a hook or CI yet: run it manually with
//   bunx commitlint --from origin/main --to HEAD
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Allowed types, aligned with the branch naming convention
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
    ],
    // Max 72 chars in the subject line
    "header-max-length": [2, "always", 72],
    // Type must be lowercase
    "type-case": [2, "always", "lower-case"],
    // Subject must not end with a period
    "subject-full-stop": [2, "never", "."],
  },
};

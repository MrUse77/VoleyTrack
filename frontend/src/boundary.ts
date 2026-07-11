import { readdirSync, readFileSync } from "node:fs";
import { extname, relative, join } from "node:path";
import { fileURLToPath } from "node:url";

export type BoundaryViolation = {
  file: string;
  line: number;
  rule: string;
  source: string;
};

type BoundaryRule = { name: string; pattern: RegExp };

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);
const IGNORED_FILES = new Set(["boundary.ts"]);
const IGNORED_TEST_FILE = /\.(?:test|spec)\.(?:ts|tsx)$/;
const RULES: BoundaryRule[] = [
  {
    name: "network transport",
    pattern: /\b(?:fetch|axios|WebSocket|EventSource)\b/i,
  },
  {
    name: "HTTP or API module",
    pattern: /\b(?:from|import)\s*(?:\(\s*)?["'][^"']*(?:api|http|axios)[^"']*["']|\b(?:api|http)(?:Client|Service|Module)?\b/i,
  },
  {
    name: "browser persistence",
    pattern: /\b(?:localStorage|sessionStorage|indexedDB|cookieStore|cookies?|cookie(?:Jar|Manager|Service)?|document\s*\.\s*cookie|setCookie|getCookie)\b/i,
  },
  {
    name: "authentication guard",
    pattern: /\b(?:AuthGuard|ProtectedRoute|RequireAuth|requireAuth|authGuard|isAuthenticated|useAuth|withAuth|guardedRoute|auth(?:entication|orization)?\s*guard)\b/i,
  },
  {
    name: "persistence abstraction",
    pattern: /\b(?:create|use|get|set)?(?:Persistence|Persisted|Repository|Storage|Cache)(?:Adapter|Service)?\b/i,
  },
];

export function findBoundaryViolations(
  sourceRoot = fileURLToPath(new URL(".", import.meta.url)),
): BoundaryViolation[] {
  return sourceFiles(sourceRoot).flatMap((file) => {
    const source = readFileSync(file, "utf8");
    const relativeFile = relative(sourceRoot, file);

    if (IGNORED_FILES.has(relativeFile)) return [];

    return RULES.flatMap((rule) => {
      const match = rule.pattern.exec(source);
      if (!match) return [];

      const line = source.slice(0, match.index).split("\n").length;
      return [{
        file: relativeFile,
        line,
        rule: rule.name,
        source: source.split("\n")[line - 1].trim(),
      }];
    });
  });
}

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(path);
      if (!SOURCE_EXTENSIONS.has(extname(entry.name)) || IGNORED_TEST_FILE.test(entry.name)) return [];
      return [path];
    })
    .sort();
}

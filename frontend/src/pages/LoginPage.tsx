import { ArrowRight, Eye, EyeOff, Mail, ShieldCheck, Volleyball } from "lucide-react";
import { useState } from "react";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,140,66,0.18),_transparent_30%),linear-gradient(180deg,_rgba(17,26,43,0.96),_rgba(11,18,32,0.98))] p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-vt-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative grid w-full max-w-7xl items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-vt-accent/30 bg-vt-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-vt-accent">
              <Volleyball className="h-3.5 w-3.5" />
              VoleyTrack access
            </div>

            <div className="max-w-xl space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-vt-muted">
                Sign in
              </p>
              <h1 className="max-w-lg text-4xl font-black uppercase tracking-[-0.07em] text-white sm:text-5xl xl:text-6xl">
                Entrá al control room del vóley.
              </h1>
              <p className="max-w-lg text-sm leading-7 text-vt-muted sm:text-base">
                Accedé para revisar partidos, estadísticas y paneles en vivo con la paleta oscura del proyecto.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["Live", "Scoreboards and active courts"],
              ["Stats", "Match momentum and team data"],
              ["Media", "Editorial and gallery surfaces"],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="rounded-[20px] border border-white/10 bg-black/20 p-4"
              >
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-white">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-6 text-vt-muted">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center rounded-[28px] border border-white/10 bg-vt-panel/90 p-4 sm:p-6 lg:p-8">
          <form className="w-full max-w-md space-y-6 rounded-[24px] border border-vt-border bg-black/25 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-vt-muted">
                Welcome back
              </p>
              <h2 className="text-2xl font-black uppercase tracking-[-0.05em] text-white">
                Start session
              </h2>
              <p className="text-sm leading-6 text-vt-muted">
                Use your team account to continue.
              </p>
            </div>

            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-vt-muted">
                Email
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-vt-border bg-vt-background/80 px-4 py-3 transition focus-within:border-vt-accent/60">
                <Mail className="h-4 w-4 text-vt-muted" />
                <input
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-vt-muted"
                  type="email"
                  name="email"
                  placeholder="you@voleytrack.com"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-vt-muted">
                Password
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-vt-border bg-vt-background/80 px-4 py-3 transition focus-within:border-vt-accent/60">
                <ShieldCheck className="h-4 w-4 text-vt-muted" />
                <input
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-vt-muted"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                />
                <button
                  className="text-vt-muted transition hover:text-white"
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-vt-muted">
                <input
                  className="h-4 w-4 rounded border-vt-border bg-transparent accent-vt-accent"
                  type="checkbox"
                  name="remember"
                />
                Remember me
              </label>

              <a className="font-semibold text-vt-accent transition hover:text-white" href="#">
                Forgot password?
              </a>
            </div>

            <button
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-vt-accent px-5 py-3.5 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#ff9b59]"
              type="submit"
            >
              Sign in
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>

            <p className="text-center text-sm leading-6 text-vt-muted">
              No account yet? <a className="font-semibold text-white transition hover:text-vt-accent" href="#">Create one</a>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

/**
 * The auth screens' branding column — the design pack's own treatment, drawn once.
 *
 * Design source: frontend/design/html/voleytrack-login.html, the only screen the pack draws
 * outside the shell:
 *   `.branding{background:var(--surface);display:flex;flex-direction:column;
 *    justify-content:center;padding:80px;border-right:1px solid var(--border)}` (line 43)
 *   `.brand-logo{font-size:48px;font-weight:900;letter-spacing:-0.03em;display:flex;
 *    align-items:center;gap:12px}` (line 44), whose `.vb` mark is overridden inline to a 54px
 *    box holding `imagen.png` (line 73)
 *   `.brand-claim{color:var(--muted);font-size:16px;margin-top:16px;max-width:32ch}` (line 46)
 * and the whole column is hidden below 920px (line 62).
 *
 * This is the ONE branding block in the application: `LoginPage` and `ChangePasswordPage` both
 * render it, so the two auth screens cannot drift apart again. The pack models no
 * change-password screen, but this feature's precedent is to give an unspecced screen the
 * pack's treatment rather than keep a second one — the four scoring headers were migrated onto
 * the shared `PageHeader` the same way.
 *
 * The mark is the app's existing emoji: the design's `.vb` mark is `imagen.png` under a
 * hardcoded filter chain (lines 44 and 73), and no equivalent asset ships in the app.
 *
 * The claim drops the design's "Panel de administración —" role frame: this app has ONE login
 * for every role, so the design's own list of areas is kept and the role frame is not.
 */
export function BrandingPanel() {
	return (
		<section
			className="hidden flex-col justify-center border-r border-vt-border bg-vt-surface p-20 min-[920px]:flex"
			data-testid="auth-branding"
		>
			<div className="flex items-center gap-3 text-[48px] font-black tracking-[-0.03em] text-vt-text">
				{/* The design's mark is an image filling a 54px box (lines 44-45 and 73), so the app's
				    emoji mark inherits the wordmark's size and centres in the same box. */}
				<span aria-hidden="true" className="grid size-[54px] shrink-0 place-items-center">
					🏐
				</span>
				VoleyTrack
			</div>
			<p className="mt-4 mb-0 max-w-[32ch] text-base text-vt-muted">
				Gestión de staff, equipos, jugadores y torneos.
			</p>
		</section>
	);
}

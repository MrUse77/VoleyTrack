// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChangePasswordPage } from "./ChangePasswordPage";
import { LoginPage } from "./LoginPage";

function renderPage() {
	const container = document.createElement("div");
	document.body.append(container);
	const root = createRoot(container);
	act(() => root.render(<LoginPage />));
	return { container, root };
}

function getControlByLabel<Control extends HTMLInputElement>(container: HTMLElement, labelText: string) {
	const label = [...container.querySelectorAll("label")].find((candidate) => candidate.textContent === labelText);
	const controlId = label?.htmlFor;

	if (!controlId) {
		throw new Error(`Missing control label: ${labelText}`);
	}

	return container.querySelector<Control>(`#${controlId}`)!;
}

function setInputValue(input: HTMLInputElement, value: string) {
	Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
	input.dispatchEvent(new Event("input", { bubbles: true }));
}

function announcedMessages(container: HTMLElement) {
	return [...container.querySelectorAll('[role="alert"]')].map((alert) => alert.textContent);
}

describe("auth feature pages", () => {
	it("renders the design's login split and its branding column", () => {
		const html = renderToStaticMarkup(<LoginPage />);

		// Design: voleytrack-login.html:42 —
		// `.login-wrap{display:grid;grid-template-columns:640px 1fr;min-height:100vh}`.
		// The app previously split into 4fr/5fr, which only coincides with 640/800 at a
		// 1440px viewport, and showed the panel on mobile where the design hides it.
		expect(html).toContain("min-[920px]:grid-cols-[640px_minmax(0,1fr)]");
		expect(html).toContain("min-h-svh");
		expect(html).not.toContain("min-w-[1440px]");
		expect(html).not.toContain("4fr");
		// Design: line 62 — `@media(max-width:920px){.branding{display:none}}`.
		expect(html).toContain("min-[920px]:flex");
		// Design: lines 44-46 — the 48px/900 -0.03em wordmark, the mark beside it and the
		// --muted claim capped at 32ch.
		expect(html).toContain("VoleyTrack");
		expect(html).toContain("text-[48px]");
		expect(html).toContain("tracking-[-0.03em]");
		expect(html).toContain("max-w-[32ch]");
		// The design's own sentence opens with "Panel de administración —" and this app has
		// ONE login for every role, so the role frame is dropped and the design's list kept.
		expect(html).toContain("Gestión de staff, equipos, jugadores y torneos.");
		expect(html).not.toContain("Panel de administración");
		// The design's stylesheet declares .brand-stats (lines 47-49) but its markup renders
		// no statistics block, so none is invented here.
		expect(html).not.toContain("brand-stat");
	});

	it("renders the design's form box, role-neutral copy and un-prefilled controls", () => {
		const html = renderToStaticMarkup(<LoginPage />);

		// Design: line 78 is `<h1>Admin</h1>` — a role label on a screen this app shares
		// between roles — so the slot carries the screen's own name, in the same words the
		// design puts on its submit control. Line 53's "Acceso restringido." stays; its
		// "Demo: cualquier email válido." clause leaves with the demo credentials.
		expect(html).toContain("Iniciar sesión");
		expect(html).toContain("Acceso restringido.");
		expect(html).not.toContain("Admin");
		expect(html).not.toContain("Demo");

		expect(html).toContain('id="login-email"');
		expect(html).toContain('for="login-email"');
		expect(html).toContain('id="login-password"');
		expect(html).toContain('for="login-password"');
		expect(html).toContain('name="email"');
		expect(html).toContain('name="password"');
		expect(html).toContain('type="password"');
		expect(html).toContain('placeholder="usuario@voleytrack.com"');
		expect(html).toContain('placeholder="••••••••"');
		// Design: lines 82-84 prefill both fields with `admin@voleytrack.com` / `admin2026`.
		// A production login ships no prefilled credential.
		expect(html).not.toContain("admin@voleytrack.com");
		expect(html).not.toContain("admin2026");
		expect(html).toContain('value=""');
		// Design: line 85 — `Iniciar sesión →`.
		expect(html).toContain("Iniciar sesión →");

		// Design: line 51 — `.form-box{width:100%;max-width:480px}`, a bare column rather
		// than a `.card`.
		expect(html).toContain("max-w-[480px]");
		expect(html).not.toContain("rounded-2xl");
		// Design: line 57 — the login control is this screen's own 48px / 10px box, not the
		// shared 46px / 12px admin control and not the 40px `.btn` pill.
		expect(html).toContain("h-12");
		expect(html).toContain("rounded-vt-sm");
		expect(html).not.toContain("rounded-full");
		expect(html).not.toContain("h-[46px]");
	});

	it("reports both fields on an empty submit, announces them and focuses the first one", () => {
		const rendered = renderPage();

		try {
			const form = rendered.container.querySelector("form")!;
			const email = getControlByLabel<HTMLInputElement>(rendered.container, "Email");
			const password = getControlByLabel<HTMLInputElement>(rendered.container, "Contraseña");

			act(() => form.requestSubmit());

			// The design's own two messages (lines 88-90).
			expect(announcedMessages(rendered.container)).toEqual([
				"Ingresá un email válido",
				"Contraseña muy corta",
			]);
			// `Field` owns the wiring: the message is described by the control it belongs to.
			expect(email.getAttribute("aria-invalid")).toBe("true");
			expect(password.getAttribute("aria-invalid")).toBe("true");
			expect(
				rendered.container.querySelector(`#${email.getAttribute("aria-describedby")}`)?.textContent,
			).toBe("Ingresá un email válido");
			expect(
				rendered.container.querySelector(`#${password.getAttribute("aria-describedby")}`)?.textContent,
			).toBe("Contraseña muy corta");
			// Focus does not fall to the body: the first invalid control takes it, which is
			// what makes its described error reachable for a keyboard or screen-reader user.
			expect(document.activeElement).toBe(email);
		} finally {
			act(() => rendered.root.unmount());
			rendered.container.remove();
		}
	});

	it("clears a field's error as soon as it is edited, and keeps the other one", () => {
		const rendered = renderPage();

		try {
			const form = rendered.container.querySelector("form")!;
			const email = getControlByLabel<HTMLInputElement>(rendered.container, "Email");

			act(() => form.requestSubmit());
			expect(announcedMessages(rendered.container).length).toBe(2);

			act(() => setInputValue(email, "usuario@voleytrack.com"));

			expect(announcedMessages(rendered.container)).toEqual(["Contraseña muy corta"]);
			expect(email.getAttribute("aria-invalid")).toBeNull();
			expect(email.getAttribute("aria-describedby")).toBeNull();
		} finally {
			act(() => rendered.root.unmount());
			rendered.container.remove();
		}
	});

	it("accepts a well-formed pair without a credential prefill and without navigating", () => {
		const rendered = renderPage();

		try {
			const form = rendered.container.querySelector("form")!;
			const email = getControlByLabel<HTMLInputElement>(rendered.container, "Email");
			const password = getControlByLabel<HTMLInputElement>(rendered.container, "Contraseña");

			// Design: lines 82-84 — the prototype ships `admin@voleytrack.com` / `admin2026`
			// prefilled; this screen starts empty.
			expect(email.value).toBe("");
			expect(password.value).toBe("");

			act(() => {
				setInputValue(email, "usuario@voleytrack.com");
				setInputValue(password, "secreto");
			});
			act(() => form.requestSubmit());

			expect(announcedMessages(rendered.container)).toEqual([]);
			expect(email.getAttribute("aria-invalid")).toBeNull();
			// The prototype navigates to the admin console on success (line 90); this app adds
			// no auth destination, so a valid submit stays on the screen.
			expect(window.location.pathname).toBe("/");
		} finally {
			act(() => rendered.root.unmount());
			rendered.container.remove();
		}
	});

	it("renders the canonical change-password fields and actions", () => {
		const html = renderToStaticMarkup(<ChangePasswordPage />);

		expect(html).toContain("Cambiar Contraseña");
		expect(html).toContain("Actualiza tu credencial de acceso.");
		expect(html).toContain("Contraseña Actual");
		expect(html).toContain("Nueva Contraseña");
		expect(html).toContain("Mínimo 8 caracteres");
		expect(html).toContain("Confirmar Nueva Contraseña");
		expect(html).toContain("Repite la nueva contraseña");
		expect(html).toContain('name="currentPassword"');
		expect(html).toContain('name="newPassword"');
		expect(html).toContain('name="confirmPassword"');
		expect(html).toContain("Cancelar");
	});
});

import { type ChangeEvent, type FormEvent, useState } from "react";
import { Field } from "../../components/primitives/Field";
import { BrandingPanel } from "./BrandingPanel";

/**
 * Design source: frontend/design/html/voleytrack-login.html — the pack's model of the
 * auth screen, which is the only screen it draws outside the shell. This screen keeps its
 * own control spec rather than the shared admin one: `.input{height:48px;border-radius:10px;
 * border:1px solid var(--border-2);background:var(--surface);padding:0 16px;font-size:14px}`
 * (line 57) against the admin `input{height:46px;padding:0 14px;border-radius:12px;
 * border:1px solid var(--border);background:var(--bg);font-size:13px}`
 * (voleytrack-admin.css:184) that `fieldControlClasses` implements. `Field` still owns the
 * label/id/error wiring; only the box belongs to this screen.
 */
const loginFieldClasses =
	"block h-12 w-full rounded-vt-sm border border-vt-border-2 bg-vt-surface px-4 text-sm text-vt-text outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-vt-muted-2 focus:border-vt-accent focus:shadow-vt-focus-ring aria-invalid:border-vt-danger";

/**
 * Design source: voleytrack-login.html:58-59 —
 *   `.btn-primary{width:100%;height:48px;border-radius:10px;border:1px solid var(--accent);
 *    background:var(--accent);color:<canvas ink>;font-weight:800;font-size:14px;
 *    letter-spacing:.01em;transition:.15s}`
 *   `.btn-primary:hover{filter:brightness(1.05);transform:translateY(-1px)}`
 * The elided ink is the design's dark canvas tone, i.e. `vt-background`; its literal cannot be
 * written here because src/styles/tokens.test.ts bans raw colour literals in this directory.
 * This is deliberately not the app's `Button`/`buttonClasses` pill: the shared `.btn`
 * (voleytrack.css:69) is a 40px fully-rounded control at 700 weight, and the design gives
 * the login submit its own 48px, 10px-radius, 800-weight box.
 */
const loginSubmitClasses =
	"mt-[18px] block h-12 w-full rounded-vt-sm border border-vt-accent bg-vt-accent text-sm font-extrabold tracking-[0.01em] text-vt-background transition-[filter,transform] duration-150 hover:-translate-y-px hover:brightness-[1.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent";

type LoginErrors = {
	email?: string;
	password?: string;
};

/**
 * The design's own two checks and their messages (voleytrack-login.html:88-90). The app
 * had no validation on this screen before, so these are the spec's rules rather than a
 * migration: a trimmed email must contain an `@`, and a trimmed password must be at least
 * three characters. The prototype's success branch navigates to the admin console; this
 * app has no session store and no auth destination to reach, so a valid submit only clears
 * the errors and stops — no destination was added.
 */
function validateLogin(email: string, password: string): LoginErrors {
	const errors: LoginErrors = {};

	if (!email.includes("@")) {
		errors.email = "Ingresá un email válido";
	}

	if (password.length < 3) {
		errors.password = "Contraseña muy corta";
	}

	return errors;
}

/**
 * `Field` renders the error and derives `aria-invalid` from it. Wrapping the text in
 * `role="alert"` is this codebase's convention for a form error (CreatePlayerPage.tsx:99),
 * so a failed submit is announced as well as described. The design's single message slot
 * below the button (voleytrack-login.html:86) is realised as the failing field's error line
 * instead, because the app owns exactly one field-error concept.
 */
function errorFeedback(message: string | undefined) {
	return message ? { error: <span role="alert">{message}</span> } : {};
}

export function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<LoginErrors>({});

	const updateField = (field: keyof LoginErrors, setValue: (value: string) => void) => (
		event: ChangeEvent<HTMLInputElement>,
	) => {
		setValue(event.target.value);
		setErrors((current) => {
			if (!current[field]) {
				return current;
			}

			const nextErrors = { ...current };
			delete nextErrors[field];
			return nextErrors;
		});
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const nextErrors = validateLogin(email.trim(), password.trim());
		setErrors(nextErrors);

		if (Object.keys(nextErrors).length > 0) {
			const firstInvalidId = nextErrors.email ? "login-email" : "login-password";
			event.currentTarget.querySelector<HTMLElement>(`#${firstInvalidId}`)?.focus();
		}
	};

	return (
		/* Design: `.login-wrap{display:grid;grid-template-columns:640px 1fr;min-height:100vh}`
		   (line 42) with the panel hidden below 920px (line 62). The design pins the 640px
		   branding column exactly, where the app previously used a 4fr/5fr split that only
		   coincides with 640/800 at a 1440px viewport. */
		<main
			className="grid min-h-svh w-full grid-cols-1 bg-vt-background text-vt-text min-[920px]:grid-cols-[640px_minmax(0,1fr)]"
			data-testid="login-screen"
		>
			{/* Design: `.branding` is the pack's own column (voleytrack-login.html:43-46), drawn once
			   in `BrandingPanel` and shared with the change-password screen so the two auth screens
			   carry one branding treatment rather than two. */}
			<BrandingPanel />

			{/* Design: `.form-col{display:flex;align-items:center;justify-content:center;padding:40px;
			   background:var(--bg)}` (line 50) holding `.form-box{width:100%;max-width:480px}` (line 51). */}
			<section className="flex items-center justify-center bg-vt-background p-10">
				<form className="w-full max-w-[480px]" noValidate onSubmit={handleSubmit}>
					{/* Design: `.form-box h1{font-size:32px;font-weight:900;letter-spacing:-0.02em;margin:0}`
					   (line 52), with the body's inherited line-height. The design's heading is the
					   ROLE it was drawn for ("Admin", line 78) and this app has one login for every
					   role, so the slot carries the screen's own name instead — the same words the
					   design puts on its submit control. */}
					<h1 className="m-0 text-[32px] font-black tracking-[-0.02em] text-vt-text">Iniciar sesión</h1>
					{/* Design: `.form-box .sub{color:var(--muted);font-size:14px;margin:8px 0 32px}` (line 53).
					   Its second sentence, "Demo: cualquier email válido.", describes the prototype's
					   prefilled credentials and is dropped with them. */}
					<p className="mt-2 mb-8 text-sm text-vt-muted">Acceso restringido.</p>

					{/* The design prefills `value="admin@voleytrack.com"` (line 82), which is both a
					    role-specific account and a credential a production login must never ship, so no
					    field is prefilled. Its placeholder is the same admin address, so the example keeps
					    the design's shape and drops the role. */}
					<Field id="login-email" label="Email" {...errorFeedback(errors.email)}>
						<input
							className={loginFieldClasses}
							name="email"
							onChange={updateField("email", setEmail)}
							placeholder="usuario@voleytrack.com"
							type="email"
							value={email}
						/>
					</Field>

					{/* Design: the second label carries `style="margin-top:14px"` (line 83), the only
					   gap the prototype gives between the two controls. */}
					<div className="mt-[14px]">
						<Field id="login-password" label="Contraseña" {...errorFeedback(errors.password)}>
							<input
								className={loginFieldClasses}
								name="password"
								onChange={updateField("password", setPassword)}
								placeholder="••••••••"
								type="password"
								value={password}
							/>
						</Field>
					</div>

					<button className={loginSubmitClasses} type="submit">
						Iniciar sesión →
					</button>
				</form>
			</section>
		</main>
	);
}

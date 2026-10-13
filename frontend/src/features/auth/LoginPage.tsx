import { useState } from "react";
import { BrandingPanel } from "./BrandingPanel";

const fieldClassName =
	"mt-2 block h-12 w-full rounded-lg border border-vt-border-2 bg-vt-surface px-4 text-sm text-vt-text outline-none placeholder:text-vt-muted-2 focus:border-vt-accent";
const labelClassName = "block text-sm font-bold leading-4 text-vt-label";

export function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<main className="grid min-h-svh w-full grid-cols-1 bg-vt-background text-vt-text lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]">
			<BrandingPanel />
			<section className="bg-vt-background">
				<form
					className="w-full px-6 py-12 sm:px-10 sm:py-16 lg:px-[20%] lg:py-[200px]"
					onSubmit={(event) => event.preventDefault()}
				>
					<h1 className="m-0 max-w-[480px] text-[28px] font-black leading-10 text-vt-text sm:text-[32px]">
						Bienvenido de vuelta
					</h1>
					<p className="mt-[10px] mb-0 max-w-[480px] text-sm leading-6 text-vt-muted">
						Ingresa tus credenciales para acceder al sistema.
					</p>

					<div className="mt-[36px] w-full max-w-[480px]">
						<label className={labelClassName} htmlFor="login-email">
							Email
						</label>
						<input
							className={fieldClassName}
							id="login-email"
							name="email"
							onChange={(event) => setEmail(event.target.value)}
							placeholder="planillero@voleytrack.com"
							type="email"
							value={email}
						/>
					</div>

					<div className="mt-6 w-full max-w-[480px]">
						<label className={labelClassName} htmlFor="login-password">
							Contraseña
						</label>
						<input
							className={fieldClassName}
							id="login-password"
							name="password"
							onChange={(event) => setPassword(event.target.value)}
							placeholder="••••••••"
							type="password"
							value={password}
						/>
					</div>

					<button
						className="mt-10 block h-12 w-full max-w-[480px] rounded-lg bg-vt-accent text-sm font-bold text-vt-background transition-colors hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
						type="submit"
					>
						Iniciar Sesión
					</button>
				</form>
			</section>
		</main>
	);
}

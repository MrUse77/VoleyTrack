import { useState } from "react";
import { BrandingPanel } from "./BrandingPanel";

const fieldClassName =
	"mt-2 block h-12 w-full rounded-lg border border-[#1e293b] bg-[#111a2b] px-4 text-sm text-white outline-none placeholder:text-[#64748b] focus:border-[#ff8c42]";
const labelClassName = "block text-sm font-bold leading-4 text-[#e2e8f0]";

export function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<main className="grid min-h-svh w-full grid-cols-1 bg-[#0b1220] text-white lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]">
			<BrandingPanel />
			<section className="bg-[#0b1220]">
				<form
					className="w-full px-6 py-12 sm:px-10 sm:py-16 lg:px-[20%] lg:py-[200px]"
					onSubmit={(event) => event.preventDefault()}
				>
					<h1 className="m-0 max-w-[480px] text-[28px] font-black leading-10 text-white sm:text-[32px]">
						Bienvenido de vuelta
					</h1>
					<p className="mt-[10px] mb-0 max-w-[480px] text-sm leading-6 text-[#94a3b8]">
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
						className="mt-10 block h-12 w-full max-w-[480px] rounded-lg bg-[#ff8c42] text-sm font-bold text-black transition-colors hover:bg-[#ff9b59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8c42]"
						type="submit"
					>
						Iniciar Sesión
					</button>
				</form>
			</section>
		</main>
	);
}

import { useState } from "react";

const fieldClassName =
	"mt-2 block h-12 w-full rounded-lg border border-[#1e293b] bg-[#111a2b] px-4 text-sm text-white outline-none placeholder:text-[#64748b] focus:border-[#ff8c42]";
const labelClassName = "block h-4 text-sm font-bold leading-4 text-[#e2e8f0]";

function BrandingPanel() {
	return (
		<section className="relative h-[900px] w-[640px] bg-[#111a2b]">
			<p className="absolute left-[80px] top-[380px] m-0 h-[60px] w-[400px] text-[48px] font-black leading-[60px] text-white">
				🏐 VoleyTrack
			</p>
			<p className="absolute left-[80px] top-[460px] m-0 h-10 w-[480px] text-base leading-10 text-[#94a3b8]">
				El sistema definitivo para gestión y análisis de ligas de vóley.
			</p>
		</section>
	);
}

export function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<main className="grid min-h-[900px] min-w-[1440px] w-full grid-cols-[640px_800px] bg-[#0b1220] text-white">
			<BrandingPanel />
			<section className="h-[900px] w-[800px] bg-[#0b1220]">
				<form
					className="h-full w-full px-[160px] pt-[200px]"
					onSubmit={(event) => event.preventDefault()}
				>
					<h1 className="m-0 h-10 w-[480px] text-[32px] font-black leading-10 text-white">
						Bienvenido de vuelta
					</h1>
					<p className="mt-[10px] mb-0 h-6 w-[480px] text-sm leading-6 text-[#94a3b8]">
						Ingresa tus credenciales para acceder al sistema.
					</p>

					<div className="mt-[36px] w-[480px]">
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

					<div className="mt-6 w-[480px]">
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
						className="mt-10 block h-12 w-[480px] rounded-lg bg-[#ff8c42] text-sm font-bold text-black transition-colors hover:bg-[#ff9b59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8c42]"
						type="submit"
					>
						Iniciar Sesión
					</button>
				</form>
			</section>
		</main>
	);
}

import { useState } from "react";
import { BrandingPanel } from "./BrandingPanel";

const fieldClassName =
	"mt-2 block h-12 w-full rounded-lg border border-vt-border-2 bg-vt-surface px-4 text-sm text-vt-text outline-none placeholder:text-vt-muted-2 focus:border-vt-accent";
const labelClassName = "block text-sm font-bold leading-4 text-vt-label";

export function ChangePasswordPage() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	return (
		<main className="grid min-h-svh w-full grid-cols-1 bg-vt-background text-vt-text lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]">
			<BrandingPanel />
			<section className="bg-vt-background">
				<form
					className="w-full px-6 py-12 sm:px-10 sm:py-16 lg:px-[20%] lg:py-[200px]"
					onSubmit={(event) => event.preventDefault()}
				>
					<h1 className="m-0 max-w-[480px] text-[28px] font-black leading-10 text-vt-text sm:text-[32px]">
						Cambiar Contraseña
					</h1>
					<p className="mt-[10px] mb-0 max-w-[480px] text-sm leading-6 text-vt-muted">
						Actualiza tu credencial de acceso.
					</p>

					<div className="mt-[36px] w-full max-w-[480px]">
						<label className={labelClassName} htmlFor="current-password">
							Contraseña Actual
						</label>
						<input
							className={fieldClassName}
							id="current-password"
							name="currentPassword"
							onChange={(event) => setCurrentPassword(event.target.value)}
							placeholder="••••••••"
							type="password"
							value={currentPassword}
						/>
					</div>

					<div className="mt-6 w-full max-w-[480px]">
						<label className={labelClassName} htmlFor="new-password">
							Nueva Contraseña
						</label>
						<input
							className={fieldClassName}
							id="new-password"
							name="newPassword"
							onChange={(event) => setNewPassword(event.target.value)}
							placeholder="Mínimo 8 caracteres"
							type="password"
							value={newPassword}
						/>
					</div>

					<div className="mt-6 w-full max-w-[480px]">
						<label className={labelClassName} htmlFor="confirm-password">
							Confirmar Nueva Contraseña
						</label>
						<input
							className={fieldClassName}
							id="confirm-password"
							name="confirmPassword"
							onChange={(event) => setConfirmPassword(event.target.value)}
							placeholder="Repite la nueva contraseña"
							type="password"
							value={confirmPassword}
						/>
					</div>

					<button
						className="mt-10 block h-12 w-full max-w-[480px] rounded-lg bg-vt-accent text-sm font-bold text-vt-background transition-colors hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
						type="submit"
					>
						Cambiar Contraseña
					</button>
					<button
						className="mt-4 block h-12 w-full max-w-[480px] rounded-lg border border-vt-raised-border bg-transparent text-sm font-bold text-vt-text transition-colors hover:bg-vt-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
						type="button"
					>
						Cancelar
					</button>
				</form>
			</section>
		</main>
	);
}

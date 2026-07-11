import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChangePasswordPage } from "./ChangePasswordPage";
import { LoginPage } from "./LoginPage";

describe("auth feature pages", () => {
	it("renders the canonical desktop login composition with Spanish copy", () => {
		const html = renderToStaticMarkup(<LoginPage />);

		expect(html).toContain("🏐 VoleyTrack");
		expect(html).toContain("El sistema definitivo para gestión y análisis de ligas de vóley.");
		expect(html).toContain("Bienvenido de vuelta");
		expect(html).toContain("Ingresa tus credenciales para acceder al sistema.");
		expect(html).toContain('name="email"');
		expect(html).toContain('placeholder="planillero@voleytrack.com"');
		expect(html).toContain('name="password"');
		expect(html).toContain('placeholder="••••••••"');
		expect(html).toContain("Iniciar Sesión");
		expect(html).toContain("grid-cols-[640px_800px]");
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

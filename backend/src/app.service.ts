import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

type DatabaseInfo = {
  name: string;
};

@Injectable()
export class AppService {
  private readonly pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 1,
      })
    : null;

  async listDatabases(): Promise<{
    databases: DatabaseInfo[];
    error?: string;
  }> {
    if (!this.pool) {
      return { databases: [], error: "DATABASE_URL no está configurada" };
    }

    try {
      const result = await this.pool.query<{ datname: string }>(
        `
        SELECT datname
        FROM pg_database
        WHERE datistemplate = false
        ORDER BY datname;
        `,
      );

      return {
        databases: result.rows.map((row) => ({ name: row.datname })),
      };
    } catch (error) {
      return {
        databases: [],
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron leer las bases",
      };
    }
  }

  async getLandingPage(): Promise<string> {
    const { databases, error } = await this.listDatabases();
    const adminerUrl = process.env.ADMINER_URL ?? "http://localhost:8080";
    const dbHost = process.env.DB_HOST ?? "db";
    const dbName = process.env.POSTGRES_DB ?? "voleytrack";

    return `
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>VoleyTrack</title>
          <style>
            :root { color-scheme: dark; }
            body {
              margin: 0;
              font-family: Inter, system-ui, sans-serif;
              background: linear-gradient(135deg, #0f172a, #111827 55%, #1e293b);
              color: #e5e7eb;
            }
            .wrap { max-width: 960px; margin: 0 auto; padding: 48px 24px 64px; }
            .hero { background: rgba(15, 23, 42, 0.72); border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 24px; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,.25); }
            h1 { margin: 0 0 12px; font-size: 2.8rem; }
            p { line-height: 1.6; color: #cbd5e1; }
            .actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 24px 0; }
            a { color: #0f172a; background: #f8fafc; text-decoration: none; padding: 12px 18px; border-radius: 999px; font-weight: 700; }
            .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 24px; }
            .card { background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(148, 163, 184, 0.15); border-radius: 20px; padding: 20px; }
            .label { text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; color: #94a3b8; }
            ul { padding-left: 18px; }
            code { background: rgba(15, 23, 42, .8); padding: 2px 6px; border-radius: 6px; }
            .error { color: #fca5a5; }
          </style>
        </head>
        <body>
          <main class="wrap">
            <section class="hero">
              <div class="label">VoleyTrack · NestJS + Bun + Prisma</div>
              <h1>Base operativa del proyecto</h1>
              <p>Acá tenés una landing simple para levantar el stack en Docker y ver las bases de datos que expone PostgreSQL.</p>
              <div class="actions">
                <a href="${adminerUrl}" target="_blank" rel="noreferrer">Abrir Adminer</a>
                <a href="/api/databases" target="_blank" rel="noreferrer">Ver JSON</a>
              </div>
              <div class="card-grid">
                <article class="card">
                  <div class="label">PostgreSQL</div>
                  <p>Host: <code>${dbHost}</code><br />Base por defecto: <code>${dbName}</code></p>
                </article>
                <article class="card">
                  <div class="label">Base de datos detectadas</div>
                  ${
                    databases.length > 0
                      ? `<ul>${databases.map((db) => `<li>${db.name}</li>`).join("")}</ul>`
                      : "<p>No se encontraron bases de datos visibles.</p>"
                  }
                  ${error ? `<p class="error">${error}</p>` : ""}
                </article>
                <article class="card">
                  <div class="label">Adminer</div>
                  <p>Visualizador liviano de tablas y esquemas: <code>${adminerUrl}</code></p>
                </article>
              </div>
            </section>
          </main>
        </body>
      </html>
    `;
  }
}

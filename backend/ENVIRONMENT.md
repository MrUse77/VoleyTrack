# Backend local environment

This backend runs with Spring Boot and PostgreSQL for local development. Use Docker Compose for the database and Gradle for the application.

## Quick path

1. Copy the local environment template into `.env`.
2. Start PostgreSQL with `make db-up`.
3. Run the backend with `make run`.
4. Run tests with `make test`.

## Local `.env` template

```env
POSTGRES_DB=voleytrack
POSTGRES_USER=voleytrack
POSTGRES_PASSWORD=voleytrack

SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/voleytrack
SPRING_DATASOURCE_USERNAME=voleytrack
SPRING_DATASOURCE_PASSWORD=voleytrack
```

## Commands

| Command | Purpose |
| --- | --- |
| `make db-up` | Start local PostgreSQL. |
| `make db-down` | Stop local PostgreSQL. |
| `make db-logs` | Follow PostgreSQL logs. |
| `make run` | Run the Spring Boot backend. |
| `make test` | Run backend tests. |
| `make build` | Build the backend. |

## Test profile

Tests use an in-memory H2 database through the `test` profile, so `make test` does not require Docker or PostgreSQL.

Flyway is disabled in the test profile until the first real migration exists.

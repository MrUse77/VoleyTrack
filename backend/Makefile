.DEFAULT_GOAL := help

.PHONY: help run test build clean db-up db-down db-logs

help:
	@echo "Available targets:"
	@echo "  make run      - Run the Spring Boot application"
	@echo "  make test     - Run backend tests"
	@echo "  make build    - Build the backend"
	@echo "  make clean    - Clean Gradle outputs"
	@echo "  make db-up    - Start local PostgreSQL"
	@echo "  make db-down  - Stop local PostgreSQL"
	@echo "  make db-logs  - Follow PostgreSQL logs"

run:
	./gradlew bootRun

test:
	./gradlew test

build:
	./gradlew build

clean:
	./gradlew clean

db-up:
	docker compose up -d postgres

db-down:
	docker compose down

db-logs:
	docker compose logs -f postgres

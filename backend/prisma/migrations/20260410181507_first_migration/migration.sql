-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "encuentros";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "iam";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "plantel";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "proyecciones";

-- CreateEnum
CREATE TYPE "iam"."UserRole" AS ENUM ('ADMIN', 'PLANILLERO');

-- CreateEnum
CREATE TYPE "encuentros"."MatchState" AS ENUM ('DRAFT', 'SCHEDULED', 'LIVE', 'FINISHED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "encuentros"."EventType" AS ENUM ('MATCH_START', 'MATCH_END', 'SET_START', 'SET_END', 'POINT', 'SUBSTITUTION', 'TIMEOUT', 'CARD');

-- CreateTable
CREATE TABLE "plantel"."players" (
    "id" UUID NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "lastname" VARCHAR(30) NOT NULL,
    "height" INTEGER NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantel"."teams" (
    "id" UUID NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "name_trainer" VARCHAR(30),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantel"."team_players" (
    "team_id" UUID NOT NULL,
    "player_id" UUID NOT NULL,

    CONSTRAINT "team_players_pkey" PRIMARY KEY ("team_id","player_id")
);

-- CreateTable
CREATE TABLE "iam"."users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "role" "iam"."UserRole" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encuentros"."matches" (
    "id" UUID NOT NULL,
    "fecha" DATE,
    "state" "encuentros"."MatchState" NOT NULL DEFAULT 'DRAFT',
    "team_a_id" UUID NOT NULL,
    "team_b_id" UUID NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encuentros"."sets" (
    "id" UUID NOT NULL,
    "match_id" UUID NOT NULL,
    "num_set" INTEGER NOT NULL,

    CONSTRAINT "sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encuentros"."events" (
    "id" UUID NOT NULL,
    "set_id" UUID NOT NULL,
    "type" "encuentros"."EventType" NOT NULL,
    "n_point" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encuentros"."substitutions" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "player_enters_id" UUID NOT NULL,
    "player_leaves_id" UUID NOT NULL,

    CONSTRAINT "substitutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encuentros"."outbox" (
    "id" UUID NOT NULL,
    "aggregate_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "payload" JSONB NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyecciones"."live_scoreboards" (
    "match_id" UUID NOT NULL,
    "team_a_name" VARCHAR(60),
    "team_b_name" VARCHAR(60),
    "points_a" INTEGER NOT NULL DEFAULT 0,
    "points_b" INTEGER NOT NULL DEFAULT 0,
    "current_set" INTEGER NOT NULL DEFAULT 1,
    "last_event_id" UUID,

    CONSTRAINT "live_scoreboards_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "proyecciones"."live_timeline" (
    "event_id" UUID NOT NULL,
    "match_id" UUID NOT NULL,
    "description" TEXT,
    "score_snapshot" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" VARCHAR(50) NOT NULL,

    CONSTRAINT "live_timeline_pkey" PRIMARY KEY ("event_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "plantel"."teams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "iam"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sets_match_id_num_set_key" ON "encuentros"."sets"("match_id", "num_set");

-- CreateIndex
CREATE UNIQUE INDEX "substitutions_event_id_key" ON "encuentros"."substitutions"("event_id");

-- AddForeignKey
ALTER TABLE "plantel"."team_players" ADD CONSTRAINT "team_players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "plantel"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantel"."team_players" ADD CONSTRAINT "team_players_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "plantel"."players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encuentros"."matches" ADD CONSTRAINT "matches_team_a_id_fkey" FOREIGN KEY ("team_a_id") REFERENCES "plantel"."teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encuentros"."matches" ADD CONSTRAINT "matches_team_b_id_fkey" FOREIGN KEY ("team_b_id") REFERENCES "plantel"."teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encuentros"."sets" ADD CONSTRAINT "sets_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "encuentros"."matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encuentros"."events" ADD CONSTRAINT "events_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "encuentros"."sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encuentros"."substitutions" ADD CONSTRAINT "substitutions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "encuentros"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encuentros"."substitutions" ADD CONSTRAINT "substitutions_player_enters_id_fkey" FOREIGN KEY ("player_enters_id") REFERENCES "plantel"."players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encuentros"."substitutions" ADD CONSTRAINT "substitutions_player_leaves_id_fkey" FOREIGN KEY ("player_leaves_id") REFERENCES "plantel"."players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encuentros"."outbox" ADD CONSTRAINT "outbox_aggregate_id_fkey" FOREIGN KEY ("aggregate_id") REFERENCES "encuentros"."matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyecciones"."live_scoreboards" ADD CONSTRAINT "live_scoreboards_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "encuentros"."matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyecciones"."live_scoreboards" ADD CONSTRAINT "live_scoreboards_last_event_id_fkey" FOREIGN KEY ("last_event_id") REFERENCES "encuentros"."events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyecciones"."live_timeline" ADD CONSTRAINT "live_timeline_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "encuentros"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyecciones"."live_timeline" ADD CONSTRAINT "live_timeline_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "encuentros"."matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

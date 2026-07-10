# Plantel Queries Specification

## Purpose

Query endpoints and gestores for reading players, teams, and roster data from the Plantel bounded context. These are read-only operations — no domain logic, simple data retrieval via repository ports.

## Requirements

### Requirement: Listar Jugadores

The system SHALL return all active players, optionally filtered by team. Each response entry SHALL include: id, name, lastname, height, birthday, number.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Player identifier |
| name | string | First name |
| lastname | string | Last name |
| height | number | In cm |
| birthday | Date | Date of birth |
| number | number | Jersey number |

#### Scenario: List all active players

- GIVEN there are 5 active players in the database
- WHEN a GET request is made to `/players`
- THEN the response SHALL contain all 5 players
- AND logically deleted players SHALL NOT be included

#### Scenario: List players filtered by team

- GIVEN team "River" has 3 active players and team "Boca" has 2
- WHEN a GET request is made to `/players` with team filter for "River"
- THEN the response SHALL contain exactly 3 players from River

#### Scenario: No players exist

- GIVEN the player table is empty
- WHEN a GET request is made to `/players`
- THEN the response SHALL be an empty array with status 200

### Requirement: Obtener Jugador

The system SHALL return a single player by ID. If the player does not exist or is logically deleted, the system SHALL return 404.

#### Scenario: Get existing player

- GIVEN a player with id `abc-123` exists and is active
- WHEN a GET request is made to `/players/abc-123`
- THEN the response SHALL contain the player's full data

#### Scenario: Player not found

- GIVEN no player exists with id `xyz-999`
- WHEN a GET request is made to `/players/xyz-999`
- THEN the response SHALL be 404

#### Scenario: Player logically deleted

- GIVEN a player with id `abc-123` exists but is logically deleted
- WHEN a GET request is made to `/players/abc-123`
- THEN the response SHALL be 404

### Requirement: Listar Equipos

The system SHALL return all active teams. Each response entry SHALL include: id, name, nameTrainer.

#### Scenario: List all active teams

- GIVEN there are 3 active teams in the database
- WHEN a GET request is made to `/teams`
- THEN the response SHALL contain all 3 teams with id, name, and nameTrainer

#### Scenario: No teams exist

- GIVEN the team table is empty
- WHEN a GET request is made to `/teams`
- THEN the response SHALL be an empty array with status 200

### Requirement: Obtener Equipo

The system SHALL return a single team by ID. If the team does not exist or is logically deleted, the system SHALL return 404.

#### Scenario: Get existing team

- GIVEN a team with id `team-001` exists and is active
- WHEN a GET request is made to `/teams/team-001`
- THEN the response SHALL contain the team's id, name, and nameTrainer

#### Scenario: Team not found

- GIVEN no team exists with id `fake-id`
- WHEN a GET request is made to `/teams/fake-id`
- THEN the response SHALL be 404

#### Scenario: Team logically deleted

- GIVEN a team with id `team-001` exists but is logically deleted
- WHEN a GET request is made to `/teams/team-001`
- THEN the response SHALL be 404

### Requirement: Listar Jugadores por Equipo

The system SHALL return all active players belonging to a specific team. If the team does not exist, return 404. If the team exists but has no players, return an empty list.

#### Scenario: List players for a team with players

- GIVEN team "River" exists and has 12 active players assigned
- WHEN a GET request is made to `/teams/river-id/players`
- THEN the response SHALL contain exactly 12 players

#### Scenario: Team exists but has no players

- GIVEN team "New Team" exists but has no players assigned
- WHEN a GET request is made to `/teams/new-team-id/players`
- THEN the response SHALL be an empty array with status 200

#### Scenario: Team not found

- GIVEN no team exists with id `nonexistent-id`
- WHEN a GET request is made to `/teams/nonexistent-id/players`
- THEN the response SHALL be 404

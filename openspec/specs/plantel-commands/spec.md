# Plantel Commands Specification

## Purpose

Baseline specification for existing command endpoints in the Plantel bounded context. Covers CRUD operations for players and teams, plus roster management (assign/remove players from teams).

## Requirements

### Requirement: Crear Jugador

The system SHALL create a new player with the provided data. The player SHALL be created with active status.

| Field | Type | Required |
|-------|------|----------|
| name | string (max 30) | Yes |
| lastname | string (max 30) | Yes |
| height | number (cm) | Yes |
| birthday | Date | Yes |
| number | number (jersey) | Yes |

#### Scenario: Successful player creation

- GIVEN valid player data with unique name+lastname combination
- WHEN a POST request is made to `/player/crear`
- THEN the system SHALL persist the player with active status

#### Scenario: Invalid data

- GIVEN a request with missing required fields or invalid types
- WHEN a POST request is made to `/player/crear`
- THEN the response SHALL be 400 Bad Request

### Requirement: Editar Jugador

The system SHALL update an existing player's mutable fields (height, number). The player ID is provided in the URL path. Fields not provided SHALL remain unchanged.

| Field | Type | Required |
|-------|------|----------|
| id | UUID (path param) | Yes |
| height | number | No |
| number | number | No |

#### Scenario: Successful player update

- GIVEN a player exists with id `player-001`
- WHEN a PUT request is made to `/player/editar/player-001` with new height
- THEN the player's height SHALL be updated

#### Scenario: Player not found

- GIVEN no player exists with id `fake-id`
- WHEN a PUT request is made to `/player/editar/fake-id`
- THEN the response SHALL be 400 Bad Request

### Requirement: Eliminar Jugador

The system SHALL perform a logical delete (baja logica) of a player. The player record SHALL NOT be physically removed from the database. If the player is involved in an active match, the deletion SHALL fail.

#### Scenario: Successful logical delete

- GIVEN an active player with id `player-001` not in any active match
- WHEN a DELETE request is made to `/player/eliminar/player-001`
- THEN the player's status SHALL be set to deleted
- AND the player SHALL NOT appear in active queries

#### Scenario: Player in active match

- GIVEN a player with id `player-001` is part of an active match
- WHEN a DELETE request is made to `/player/eliminar/player-001`
- THEN the response SHALL be 400 Bad Request
- AND the player SHALL remain active

#### Scenario: Player not found

- GIVEN no player exists with id `fake-id`
- WHEN a DELETE request is made to `/player/eliminar/fake-id`
- THEN the response SHALL be 400 Bad Request

### Requirement: Crear Equipo

The system SHALL create a new team. The team name SHALL be unique across all active teams.

| Field | Type | Required |
|-------|------|----------|
| nameTeam | string (max 30) | Yes |
| nameTrainer | string (max 30) | No |

#### Scenario: Successful team creation

- GIVEN a unique team name "River Plate"
- WHEN a POST request is made to `/team/crear`
- THEN the system SHALL persist the team with active status

#### Scenario: Duplicate team name

- GIVEN a team "River Plate" already exists
- WHEN a POST request is made to `/team/crear` with the same name
- THEN the response SHALL be 400 Bad Request

### Requirement: Editar Equipo

The system SHALL update an existing team's name and/or trainer name. The team name SHALL remain unique.

| Field | Type | Required |
|-------|------|----------|
| id | UUID (path param) | Yes |
| nameTeam | string | No |
| nameTrainer | string | No |

#### Scenario: Successful team update

- GIVEN a team exists with id `team-001`
- WHEN a PUT request is made to `/team/editar/team-001` with new trainer name
- THEN the team's nameTrainer SHALL be updated

#### Scenario: Duplicate name on update

- GIVEN team "Boca" exists and team "River" exists with id `team-001`
- WHEN a PUT request is made to `/team/editar/team-001` changing name to "Boca"
- THEN the response SHALL be 400 Bad Request

### Requirement: Eliminar Equipo

The system SHALL perform a logical delete of a team. If the team is involved in an active match, the deletion SHALL fail. All player-team associations SHALL be removed.

#### Scenario: Successful logical delete

- GIVEN an active team with id `team-001` not in any active match
- WHEN a DELETE request is made to `/team/eliminar/team-001`
- THEN the team's status SHALL be set to deleted
- AND all player-team associations SHALL be removed

#### Scenario: Team in active match

- GIVEN a team with id `team-001` is part of an active match
- WHEN a DELETE request is made to `/team/eliminar/team-001`
- THEN the response SHALL be 400 Bad Request

### Requirement: Anadir Jugador a Equipo

The system SHALL link an existing player to an existing team via the TeamPlayer join table. If the player's jersey number duplicates another player's number on the same team, the operation SHALL fail.

| Field | Type | Required |
|-------|------|----------|
| idTeam | UUID | Yes |
| idPlayer | UUID | Yes |

#### Scenario: Successful assignment

- GIVEN player `p-1` and team `t-1` both exist and are active
- WHEN the add player to team gestor is invoked with both IDs
- THEN a TeamPlayer record SHALL be created

#### Scenario: Duplicate jersey number on team

- GIVEN team `t-1` has a player with number 10
- WHEN adding player `p-2` (also number 10) to team `t-1`
- THEN the operation SHALL fail with an error

### Requirement: Remover Jugador de Equipo

The system SHALL remove the association between a player and a team. The player and team records SHALL NOT be deleted.

| Field | Type | Required |
|-------|------|----------|
| idTeam | string | Yes |
| idPlayer | string | Yes |

#### Scenario: Successful removal

- GIVEN player `p-1` is assigned to team `t-1`
- WHEN the remove player from team gestor is invoked
- THEN the TeamPlayer record SHALL be deleted
- AND both player and team SHALL remain active

#### Scenario: Player not assigned to team

- GIVEN player `p-1` is NOT assigned to team `t-1`
- WHEN the remove player from team gestor is invoked
- THEN the operation SHALL fail gracefully

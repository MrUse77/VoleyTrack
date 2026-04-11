# Contratos entre Módulos (Opción B)

## Objetivo
Definir **puertos de aplicación** entre bounded contexts para mantener desacople (Hexagonal) y permitir evolución futura.

---

## 1) Usuarios -> otros contextos

### Puerto: `AuthContextPort`
Responsabilidad: resolver identidad y permisos del actor autenticado.

```ts
export interface AuthContext {
  userId: string;
  role: 'ADMIN' | 'SCORER' | 'GUEST';
}

export interface AuthContextPort {
  getAuthContext(accessToken: string): Promise<AuthContext>;
  can(permission: string, ctx: AuthContext): boolean;
}
```

Uso:
- `Partidos` valida acciones de planillero.
- `Plantel` valida acciones administrativas.
- `LiveStats` decide permisos de lectura.

---

## 2) Plantel -> Partidos

### Puerto: `RosterQueryPort`
Responsabilidad: exponer roster elegible para alinear y sustituir.

```ts
export interface EligiblePlayerDTO {
  playerId: string;
  teamId: string;
  fullName: string;
  role: 'PLAYER' | 'LIBERO';
  active: boolean;
}

export interface TeamRosterDTO {
  teamId: string;
  players: EligiblePlayerDTO[];
}

export interface RosterQueryPort {
  getTeamRoster(teamId: string): Promise<TeamRosterDTO>;
  isPlayerEligible(teamId: string, playerId: string): Promise<boolean>;
}
```

Reglas:
- `Partidos` no consulta tablas de `Plantel` directamente.
- `Partidos` confía en este puerto para validar alineación/sustitución.

---

## 3) Partidos -> LiveStats

### Contrato de eventos de integración
Responsabilidad: publicar cambios del juego para proyecciones en vivo.

```ts
export type MatchEvent =
  | { type: 'MatchStarted'; matchId: string; at: string }
  | { type: 'SetStarted'; matchId: string; setNumber: number; at: string }
  | {
      type: 'PointRegistered';
      matchId: string;
      setNumber: number;
      scoringTeamId: string;
      playerId?: string;
      skill: 'SERVE' | 'ATTACK' | 'BLOCK' | 'OTHER';
      result: 'POINT' | 'ERROR';
      at: string;
    }
  | { type: 'PointUndone'; matchId: string; setNumber: number; at: string }
  | {
      type: 'SubstitutionPerformed';
      matchId: string;
      setNumber: number;
      teamId: string;
      outPlayerId: string;
      inPlayerId: string;
      liberoInvolved: boolean;
      at: string;
    }
  | { type: 'SetFinished'; matchId: string; setNumber: number; winnerTeamId: string; at: string }
  | { type: 'MatchFinished'; matchId: string; winnerTeamId: string; at: string };

export interface MatchEventsPublisherPort {
  publish(event: MatchEvent): Promise<void>;
}
```

Reglas:
- Eventos versionados (`type + payload estable`).
- Entrega al menos una vez (idempotencia en proyectores).

---

## 4) LiveStats -> Clientes (Web/App)

### Puerto de salida: `LiveFeedPort`
Responsabilidad: exponer consultas y stream en vivo.

```ts
export interface LiveScoreboardDTO {
  matchId: string;
  localTeamId: string;
  awayTeamId: string;
  setsLocal: number;
  setsAway: number;
  pointsLocal: number;
  pointsAway: number;
  currentSet: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED';
}

export interface LiveFeedPort {
  getScoreboard(matchId: string): Promise<LiveScoreboardDTO>;
  subscribe(matchId: string, listener: (event: unknown) => void): Promise<void>;
}
```

---

## Contratos internos por módulo (mínimos)

### Plantel (Application)
- `CreatePlayerUseCase`
- `AssignPlayerToTeamUseCase`
- `TransferPlayerUseCase`

### Partidos (Application)
- `CreateMatchUseCase`
- `StartMatchUseCase`
- `StartSetUseCase`
- `RegisterPointUseCase`
- `UndoPointUseCase`
- `PerformSubstitutionUseCase`
- `FinishSetUseCase`
- `FinishMatchUseCase`

### LiveStats (Application)
- `ProjectMatchEventUseCase`
- `GetLiveScoreboardQuery`
- `GetLiveStatsQuery`

---

## Políticas de contrato (obligatorias)

1. **Semver de contratos**: cambios breaking => nueva versión.
2. **No shared entities** entre contextos (solo DTOs/eventos).
3. **Idempotencia** en consumidores de eventos.
4. **Observabilidad**: correlationId en comandos/eventos.
5. **Transacciones**: `Partidos` garantiza consistencia antes de publicar evento.

---

## Checklist de “listo para escalar B -> C”

- [ ] Ningún módulo hace SQL cross-context.
- [ ] `Partidos` depende de `RosterQueryPort`, no de repos de `Plantel`.
- [ ] Eventos `Partidos -> LiveStats` están versionados.
- [ ] Read models son reconstruibles desde eventos.
- [ ] IDs de dominio estables (`TeamId`, `PlayerId`, `MatchId`).

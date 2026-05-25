import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Player: "Player";
    readonly Team: "Team";
    readonly TeamPlayer: "TeamPlayer";
    readonly User: "User";
    readonly Match: "Match";
    readonly Set: "Set";
    readonly Event: "Event";
    readonly Substitution: "Substitution";
    readonly Outbox: "Outbox";
    readonly LiveScoreboard: "LiveScoreboard";
    readonly LiveTimeline: "LiveTimeline";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const PlayerScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly lastname: "lastname";
    readonly height: "height";
};
export type PlayerScalarFieldEnum = (typeof PlayerScalarFieldEnum)[keyof typeof PlayerScalarFieldEnum];
export declare const TeamScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly nameTrainer: "nameTrainer";
};
export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum];
export declare const TeamPlayerScalarFieldEnum: {
    readonly teamId: "teamId";
    readonly playerId: "playerId";
};
export type TeamPlayerScalarFieldEnum = (typeof TeamPlayerScalarFieldEnum)[keyof typeof TeamPlayerScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly password: "password";
    readonly name: "name";
    readonly role: "role";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const MatchScalarFieldEnum: {
    readonly id: "id";
    readonly fecha: "fecha";
    readonly state: "state";
    readonly teamAId: "teamAId";
    readonly teamBId: "teamBId";
};
export type MatchScalarFieldEnum = (typeof MatchScalarFieldEnum)[keyof typeof MatchScalarFieldEnum];
export declare const SetScalarFieldEnum: {
    readonly id: "id";
    readonly matchId: "matchId";
    readonly numSet: "numSet";
};
export type SetScalarFieldEnum = (typeof SetScalarFieldEnum)[keyof typeof SetScalarFieldEnum];
export declare const EventScalarFieldEnum: {
    readonly id: "id";
    readonly setId: "setId";
    readonly type: "type";
    readonly nPoint: "nPoint";
    readonly createdAt: "createdAt";
};
export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum];
export declare const SubstitutionScalarFieldEnum: {
    readonly id: "id";
    readonly eventId: "eventId";
    readonly playerEntersId: "playerEntersId";
    readonly playerLeavesId: "playerLeavesId";
};
export type SubstitutionScalarFieldEnum = (typeof SubstitutionScalarFieldEnum)[keyof typeof SubstitutionScalarFieldEnum];
export declare const OutboxScalarFieldEnum: {
    readonly id: "id";
    readonly aggregateId: "aggregateId";
    readonly type: "type";
    readonly payload: "payload";
    readonly consumed: "consumed";
    readonly createdAt: "createdAt";
};
export type OutboxScalarFieldEnum = (typeof OutboxScalarFieldEnum)[keyof typeof OutboxScalarFieldEnum];
export declare const LiveScoreboardScalarFieldEnum: {
    readonly matchId: "matchId";
    readonly teamAName: "teamAName";
    readonly teamBName: "teamBName";
    readonly pointsA: "pointsA";
    readonly pointsB: "pointsB";
    readonly currentSet: "currentSet";
    readonly lastEventId: "lastEventId";
};
export type LiveScoreboardScalarFieldEnum = (typeof LiveScoreboardScalarFieldEnum)[keyof typeof LiveScoreboardScalarFieldEnum];
export declare const LiveTimelineScalarFieldEnum: {
    readonly eventId: "eventId";
    readonly matchId: "matchId";
    readonly description: "description";
    readonly scoreSnapshot: "scoreSnapshot";
    readonly timestamp: "timestamp";
    readonly type: "type";
};
export type LiveTimelineScalarFieldEnum = (typeof LiveTimelineScalarFieldEnum)[keyof typeof LiveTimelineScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

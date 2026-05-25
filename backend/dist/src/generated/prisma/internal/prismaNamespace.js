"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.NullableJsonNullValueInput = exports.JsonNullValueInput = exports.SortOrder = exports.LiveTimelineScalarFieldEnum = exports.LiveScoreboardScalarFieldEnum = exports.OutboxScalarFieldEnum = exports.SubstitutionScalarFieldEnum = exports.EventScalarFieldEnum = exports.SetScalarFieldEnum = exports.MatchScalarFieldEnum = exports.UserScalarFieldEnum = exports.TeamPlayerScalarFieldEnum = exports.TeamScalarFieldEnum = exports.PlayerScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.7.0",
    engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Player: 'Player',
    Team: 'Team',
    TeamPlayer: 'TeamPlayer',
    User: 'User',
    Match: 'Match',
    Set: 'Set',
    Event: 'Event',
    Substitution: 'Substitution',
    Outbox: 'Outbox',
    LiveScoreboard: 'LiveScoreboard',
    LiveTimeline: 'LiveTimeline'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.PlayerScalarFieldEnum = {
    id: 'id',
    name: 'name',
    lastname: 'lastname',
    height: 'height'
};
exports.TeamScalarFieldEnum = {
    id: 'id',
    name: 'name',
    nameTrainer: 'nameTrainer'
};
exports.TeamPlayerScalarFieldEnum = {
    teamId: 'teamId',
    playerId: 'playerId'
};
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    role: 'role'
};
exports.MatchScalarFieldEnum = {
    id: 'id',
    fecha: 'fecha',
    state: 'state',
    teamAId: 'teamAId',
    teamBId: 'teamBId'
};
exports.SetScalarFieldEnum = {
    id: 'id',
    matchId: 'matchId',
    numSet: 'numSet'
};
exports.EventScalarFieldEnum = {
    id: 'id',
    setId: 'setId',
    type: 'type',
    nPoint: 'nPoint',
    createdAt: 'createdAt'
};
exports.SubstitutionScalarFieldEnum = {
    id: 'id',
    eventId: 'eventId',
    playerEntersId: 'playerEntersId',
    playerLeavesId: 'playerLeavesId'
};
exports.OutboxScalarFieldEnum = {
    id: 'id',
    aggregateId: 'aggregateId',
    type: 'type',
    payload: 'payload',
    consumed: 'consumed',
    createdAt: 'createdAt'
};
exports.LiveScoreboardScalarFieldEnum = {
    matchId: 'matchId',
    teamAName: 'teamAName',
    teamBName: 'teamBName',
    pointsA: 'pointsA',
    pointsB: 'pointsB',
    currentSet: 'currentSet',
    lastEventId: 'lastEventId'
};
exports.LiveTimelineScalarFieldEnum = {
    eventId: 'eventId',
    matchId: 'matchId',
    description: 'description',
    scoreSnapshot: 'scoreSnapshot',
    timestamp: 'timestamp',
    type: 'type'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map
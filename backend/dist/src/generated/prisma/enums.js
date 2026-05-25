"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.MatchState = exports.UserRole = void 0;
exports.UserRole = {
    ADMIN: 'ADMIN',
    PLANILLERO: 'PLANILLERO'
};
exports.MatchState = {
    DRAFT: 'DRAFT',
    SCHEDULED: 'SCHEDULED',
    LIVE: 'LIVE',
    FINISHED: 'FINISHED',
    SUSPENDED: 'SUSPENDED'
};
exports.EventType = {
    MATCH_START: 'MATCH_START',
    MATCH_END: 'MATCH_END',
    SET_START: 'SET_START',
    SET_END: 'SET_END',
    POINT: 'POINT',
    SUBSTITUTION: 'SUBSTITUTION',
    TIMEOUT: 'TIMEOUT',
    CARD: 'CARD'
};
//# sourceMappingURL=enums.js.map
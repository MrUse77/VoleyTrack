export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly PLANILLERO: "PLANILLERO";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const MatchState: {
    readonly DRAFT: "DRAFT";
    readonly SCHEDULED: "SCHEDULED";
    readonly LIVE: "LIVE";
    readonly FINISHED: "FINISHED";
    readonly SUSPENDED: "SUSPENDED";
};
export type MatchState = (typeof MatchState)[keyof typeof MatchState];
export declare const EventType: {
    readonly MATCH_START: "MATCH_START";
    readonly MATCH_END: "MATCH_END";
    readonly SET_START: "SET_START";
    readonly SET_END: "SET_END";
    readonly POINT: "POINT";
    readonly SUBSTITUTION: "SUBSTITUTION";
    readonly TIMEOUT: "TIMEOUT";
    readonly CARD: "CARD";
};
export type EventType = (typeof EventType)[keyof typeof EventType];

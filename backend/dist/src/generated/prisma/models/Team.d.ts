import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TeamModel = runtime.Types.Result.DefaultSelection<Prisma.$TeamPayload>;
export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null;
    _min: TeamMinAggregateOutputType | null;
    _max: TeamMaxAggregateOutputType | null;
};
export type TeamMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    nameTrainer: string | null;
};
export type TeamMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    nameTrainer: string | null;
};
export type TeamCountAggregateOutputType = {
    id: number;
    name: number;
    nameTrainer: number;
    _all: number;
};
export type TeamMinAggregateInputType = {
    id?: true;
    name?: true;
    nameTrainer?: true;
};
export type TeamMaxAggregateInputType = {
    id?: true;
    name?: true;
    nameTrainer?: true;
};
export type TeamCountAggregateInputType = {
    id?: true;
    name?: true;
    nameTrainer?: true;
    _all?: true;
};
export type TeamAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    cursor?: Prisma.TeamWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TeamCountAggregateInputType;
    _min?: TeamMinAggregateInputType;
    _max?: TeamMaxAggregateInputType;
};
export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
    [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeam[P]> : Prisma.GetScalarType<T[P], AggregateTeam[P]>;
};
export type TeamGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithAggregationInput | Prisma.TeamOrderByWithAggregationInput[];
    by: Prisma.TeamScalarFieldEnum[] | Prisma.TeamScalarFieldEnum;
    having?: Prisma.TeamScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeamCountAggregateInputType | true;
    _min?: TeamMinAggregateInputType;
    _max?: TeamMaxAggregateInputType;
};
export type TeamGroupByOutputType = {
    id: string;
    name: string;
    nameTrainer: string | null;
    _count: TeamCountAggregateOutputType | null;
    _min: TeamMinAggregateOutputType | null;
    _max: TeamMaxAggregateOutputType | null;
};
export type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeamGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeamGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeamGroupByOutputType[P]>;
}>>;
export type TeamWhereInput = {
    AND?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    OR?: Prisma.TeamWhereInput[];
    NOT?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    id?: Prisma.UuidFilter<"Team"> | string;
    name?: Prisma.StringFilter<"Team"> | string;
    nameTrainer?: Prisma.StringNullableFilter<"Team"> | string | null;
    players?: Prisma.TeamPlayerListRelationFilter;
    matchesAsA?: Prisma.MatchListRelationFilter;
    matchesAsB?: Prisma.MatchListRelationFilter;
};
export type TeamOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    nameTrainer?: Prisma.SortOrderInput | Prisma.SortOrder;
    players?: Prisma.TeamPlayerOrderByRelationAggregateInput;
    matchesAsA?: Prisma.MatchOrderByRelationAggregateInput;
    matchesAsB?: Prisma.MatchOrderByRelationAggregateInput;
};
export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    name?: string;
    AND?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    OR?: Prisma.TeamWhereInput[];
    NOT?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    nameTrainer?: Prisma.StringNullableFilter<"Team"> | string | null;
    players?: Prisma.TeamPlayerListRelationFilter;
    matchesAsA?: Prisma.MatchListRelationFilter;
    matchesAsB?: Prisma.MatchListRelationFilter;
}, "id" | "name">;
export type TeamOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    nameTrainer?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TeamCountOrderByAggregateInput;
    _max?: Prisma.TeamMaxOrderByAggregateInput;
    _min?: Prisma.TeamMinOrderByAggregateInput;
};
export type TeamScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeamScalarWhereWithAggregatesInput | Prisma.TeamScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeamScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeamScalarWhereWithAggregatesInput | Prisma.TeamScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Team"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Team"> | string;
    nameTrainer?: Prisma.StringNullableWithAggregatesFilter<"Team"> | string | null;
};
export type TeamCreateInput = {
    id?: string;
    name: string;
    nameTrainer?: string | null;
    players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    matchesAsA?: Prisma.MatchCreateNestedManyWithoutTeamAInput;
    matchesAsB?: Prisma.MatchCreateNestedManyWithoutTeamBInput;
};
export type TeamUncheckedCreateInput = {
    id?: string;
    name: string;
    nameTrainer?: string | null;
    players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    matchesAsA?: Prisma.MatchUncheckedCreateNestedManyWithoutTeamAInput;
    matchesAsB?: Prisma.MatchUncheckedCreateNestedManyWithoutTeamBInput;
};
export type TeamUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameTrainer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    matchesAsA?: Prisma.MatchUpdateManyWithoutTeamANestedInput;
    matchesAsB?: Prisma.MatchUpdateManyWithoutTeamBNestedInput;
};
export type TeamUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameTrainer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    matchesAsA?: Prisma.MatchUncheckedUpdateManyWithoutTeamANestedInput;
    matchesAsB?: Prisma.MatchUncheckedUpdateManyWithoutTeamBNestedInput;
};
export type TeamCreateManyInput = {
    id?: string;
    name: string;
    nameTrainer?: string | null;
};
export type TeamUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameTrainer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TeamUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameTrainer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TeamCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    nameTrainer?: Prisma.SortOrder;
};
export type TeamMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    nameTrainer?: Prisma.SortOrder;
};
export type TeamMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    nameTrainer?: Prisma.SortOrder;
};
export type TeamScalarRelationFilter = {
    is?: Prisma.TeamWhereInput;
    isNot?: Prisma.TeamWhereInput;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type TeamCreateNestedOneWithoutPlayersInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutPlayersInput, Prisma.TeamUncheckedCreateWithoutPlayersInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutPlayersInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutPlayersNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutPlayersInput, Prisma.TeamUncheckedCreateWithoutPlayersInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutPlayersInput;
    upsert?: Prisma.TeamUpsertWithoutPlayersInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutPlayersInput, Prisma.TeamUpdateWithoutPlayersInput>, Prisma.TeamUncheckedUpdateWithoutPlayersInput>;
};
export type TeamCreateNestedOneWithoutMatchesAsAInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchesAsAInput, Prisma.TeamUncheckedCreateWithoutMatchesAsAInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchesAsAInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamCreateNestedOneWithoutMatchesAsBInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchesAsBInput, Prisma.TeamUncheckedCreateWithoutMatchesAsBInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchesAsBInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutMatchesAsANestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchesAsAInput, Prisma.TeamUncheckedCreateWithoutMatchesAsAInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchesAsAInput;
    upsert?: Prisma.TeamUpsertWithoutMatchesAsAInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutMatchesAsAInput, Prisma.TeamUpdateWithoutMatchesAsAInput>, Prisma.TeamUncheckedUpdateWithoutMatchesAsAInput>;
};
export type TeamUpdateOneRequiredWithoutMatchesAsBNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMatchesAsBInput, Prisma.TeamUncheckedCreateWithoutMatchesAsBInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMatchesAsBInput;
    upsert?: Prisma.TeamUpsertWithoutMatchesAsBInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutMatchesAsBInput, Prisma.TeamUpdateWithoutMatchesAsBInput>, Prisma.TeamUncheckedUpdateWithoutMatchesAsBInput>;
};
export type TeamCreateWithoutPlayersInput = {
    id?: string;
    name: string;
    nameTrainer?: string | null;
    matchesAsA?: Prisma.MatchCreateNestedManyWithoutTeamAInput;
    matchesAsB?: Prisma.MatchCreateNestedManyWithoutTeamBInput;
};
export type TeamUncheckedCreateWithoutPlayersInput = {
    id?: string;
    name: string;
    nameTrainer?: string | null;
    matchesAsA?: Prisma.MatchUncheckedCreateNestedManyWithoutTeamAInput;
    matchesAsB?: Prisma.MatchUncheckedCreateNestedManyWithoutTeamBInput;
};
export type TeamCreateOrConnectWithoutPlayersInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutPlayersInput, Prisma.TeamUncheckedCreateWithoutPlayersInput>;
};
export type TeamUpsertWithoutPlayersInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutPlayersInput, Prisma.TeamUncheckedUpdateWithoutPlayersInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutPlayersInput, Prisma.TeamUncheckedCreateWithoutPlayersInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutPlayersInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutPlayersInput, Prisma.TeamUncheckedUpdateWithoutPlayersInput>;
};
export type TeamUpdateWithoutPlayersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameTrainer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchesAsA?: Prisma.MatchUpdateManyWithoutTeamANestedInput;
    matchesAsB?: Prisma.MatchUpdateManyWithoutTeamBNestedInput;
};
export type TeamUncheckedUpdateWithoutPlayersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameTrainer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchesAsA?: Prisma.MatchUncheckedUpdateManyWithoutTeamANestedInput;
    matchesAsB?: Prisma.MatchUncheckedUpdateManyWithoutTeamBNestedInput;
};
export type TeamCreateWithoutMatchesAsAInput = {
    id?: string;
    name: string;
    nameTrainer?: string | null;
    players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    matchesAsB?: Prisma.MatchCreateNestedManyWithoutTeamBInput;
};
export type TeamUncheckedCreateWithoutMatchesAsAInput = {
    id?: string;
    name: string;
    nameTrainer?: string | null;
    players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    matchesAsB?: Prisma.MatchUncheckedCreateNestedManyWithoutTeamBInput;
};
export type TeamCreateOrConnectWithoutMatchesAsAInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchesAsAInput, Prisma.TeamUncheckedCreateWithoutMatchesAsAInput>;
};
export type TeamCreateWithoutMatchesAsBInput = {
    id?: string;
    name: string;
    nameTrainer?: string | null;
    players?: Prisma.TeamPlayerCreateNestedManyWithoutTeamInput;
    matchesAsA?: Prisma.MatchCreateNestedManyWithoutTeamAInput;
};
export type TeamUncheckedCreateWithoutMatchesAsBInput = {
    id?: string;
    name: string;
    nameTrainer?: string | null;
    players?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutTeamInput;
    matchesAsA?: Prisma.MatchUncheckedCreateNestedManyWithoutTeamAInput;
};
export type TeamCreateOrConnectWithoutMatchesAsBInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchesAsBInput, Prisma.TeamUncheckedCreateWithoutMatchesAsBInput>;
};
export type TeamUpsertWithoutMatchesAsAInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutMatchesAsAInput, Prisma.TeamUncheckedUpdateWithoutMatchesAsAInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchesAsAInput, Prisma.TeamUncheckedCreateWithoutMatchesAsAInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutMatchesAsAInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutMatchesAsAInput, Prisma.TeamUncheckedUpdateWithoutMatchesAsAInput>;
};
export type TeamUpdateWithoutMatchesAsAInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameTrainer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    matchesAsB?: Prisma.MatchUpdateManyWithoutTeamBNestedInput;
};
export type TeamUncheckedUpdateWithoutMatchesAsAInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameTrainer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    matchesAsB?: Prisma.MatchUncheckedUpdateManyWithoutTeamBNestedInput;
};
export type TeamUpsertWithoutMatchesAsBInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutMatchesAsBInput, Prisma.TeamUncheckedUpdateWithoutMatchesAsBInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMatchesAsBInput, Prisma.TeamUncheckedCreateWithoutMatchesAsBInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutMatchesAsBInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutMatchesAsBInput, Prisma.TeamUncheckedUpdateWithoutMatchesAsBInput>;
};
export type TeamUpdateWithoutMatchesAsBInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameTrainer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    players?: Prisma.TeamPlayerUpdateManyWithoutTeamNestedInput;
    matchesAsA?: Prisma.MatchUpdateManyWithoutTeamANestedInput;
};
export type TeamUncheckedUpdateWithoutMatchesAsBInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    nameTrainer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    players?: Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput;
    matchesAsA?: Prisma.MatchUncheckedUpdateManyWithoutTeamANestedInput;
};
export type TeamCountOutputType = {
    players: number;
    matchesAsA: number;
    matchesAsB: number;
};
export type TeamCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    players?: boolean | TeamCountOutputTypeCountPlayersArgs;
    matchesAsA?: boolean | TeamCountOutputTypeCountMatchesAsAArgs;
    matchesAsB?: boolean | TeamCountOutputTypeCountMatchesAsBArgs;
};
export type TeamCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamCountOutputTypeSelect<ExtArgs> | null;
};
export type TeamCountOutputTypeCountPlayersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamPlayerWhereInput;
};
export type TeamCountOutputTypeCountMatchesAsAArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
};
export type TeamCountOutputTypeCountMatchesAsBArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
};
export type TeamSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    nameTrainer?: boolean;
    players?: boolean | Prisma.Team$playersArgs<ExtArgs>;
    matchesAsA?: boolean | Prisma.Team$matchesAsAArgs<ExtArgs>;
    matchesAsB?: boolean | Prisma.Team$matchesAsBArgs<ExtArgs>;
    _count?: boolean | Prisma.TeamCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["team"]>;
export type TeamSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    nameTrainer?: boolean;
}, ExtArgs["result"]["team"]>;
export type TeamSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    nameTrainer?: boolean;
}, ExtArgs["result"]["team"]>;
export type TeamSelectScalar = {
    id?: boolean;
    name?: boolean;
    nameTrainer?: boolean;
};
export type TeamOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "nameTrainer", ExtArgs["result"]["team"]>;
export type TeamInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    players?: boolean | Prisma.Team$playersArgs<ExtArgs>;
    matchesAsA?: boolean | Prisma.Team$matchesAsAArgs<ExtArgs>;
    matchesAsB?: boolean | Prisma.Team$matchesAsBArgs<ExtArgs>;
    _count?: boolean | Prisma.TeamCountOutputTypeDefaultArgs<ExtArgs>;
};
export type TeamIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type TeamIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $TeamPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Team";
    objects: {
        players: Prisma.$TeamPlayerPayload<ExtArgs>[];
        matchesAsA: Prisma.$MatchPayload<ExtArgs>[];
        matchesAsB: Prisma.$MatchPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        nameTrainer: string | null;
    }, ExtArgs["result"]["team"]>;
    composites: {};
};
export type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeamPayload, S>;
export type TeamCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeamCountAggregateInputType | true;
};
export interface TeamDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Team'];
        meta: {
            name: 'Team';
        };
    };
    findUnique<T extends TeamFindUniqueArgs>(args: Prisma.SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TeamFindFirstArgs>(args?: Prisma.SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TeamFindManyArgs>(args?: Prisma.SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TeamCreateArgs>(args: Prisma.SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TeamCreateManyArgs>(args?: Prisma.SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TeamDeleteArgs>(args: Prisma.SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TeamUpdateArgs>(args: Prisma.SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TeamDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TeamUpdateManyArgs>(args: Prisma.SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TeamUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TeamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TeamUpsertArgs>(args: Prisma.SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TeamCountArgs>(args?: Prisma.Subset<T, TeamCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeamCountAggregateOutputType> : number>;
    aggregate<T extends TeamAggregateArgs>(args: Prisma.Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>;
    groupBy<T extends TeamGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeamGroupByArgs['orderBy'];
    } : {
        orderBy?: TeamGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TeamFieldRefs;
}
export interface Prisma__TeamClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    players<T extends Prisma.Team$playersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$playersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matchesAsA<T extends Prisma.Team$matchesAsAArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$matchesAsAArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    matchesAsB<T extends Prisma.Team$matchesAsBArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$matchesAsBArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TeamFieldRefs {
    readonly id: Prisma.FieldRef<"Team", 'String'>;
    readonly name: Prisma.FieldRef<"Team", 'String'>;
    readonly nameTrainer: Prisma.FieldRef<"Team", 'String'>;
}
export type TeamFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where: Prisma.TeamWhereUniqueInput;
};
export type TeamFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where: Prisma.TeamWhereUniqueInput;
};
export type TeamFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    cursor?: Prisma.TeamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
export type TeamFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    cursor?: Prisma.TeamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
export type TeamFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    cursor?: Prisma.TeamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
export type TeamCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamCreateInput, Prisma.TeamUncheckedCreateInput>;
};
export type TeamCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TeamCreateManyInput | Prisma.TeamCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TeamCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    data: Prisma.TeamCreateManyInput | Prisma.TeamCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TeamUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamUpdateInput, Prisma.TeamUncheckedUpdateInput>;
    where: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TeamUpdateManyMutationInput, Prisma.TeamUncheckedUpdateManyInput>;
    where?: Prisma.TeamWhereInput;
    limit?: number;
};
export type TeamUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamUpdateManyMutationInput, Prisma.TeamUncheckedUpdateManyInput>;
    where?: Prisma.TeamWhereInput;
    limit?: number;
};
export type TeamUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateInput, Prisma.TeamUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TeamUpdateInput, Prisma.TeamUncheckedUpdateInput>;
};
export type TeamDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
    where: Prisma.TeamWhereUniqueInput;
};
export type TeamDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
    limit?: number;
};
export type Team$playersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    where?: Prisma.TeamPlayerWhereInput;
    orderBy?: Prisma.TeamPlayerOrderByWithRelationInput | Prisma.TeamPlayerOrderByWithRelationInput[];
    cursor?: Prisma.TeamPlayerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamPlayerScalarFieldEnum | Prisma.TeamPlayerScalarFieldEnum[];
};
export type Team$matchesAsAArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchSelect<ExtArgs> | null;
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    include?: Prisma.MatchInclude<ExtArgs> | null;
    where?: Prisma.MatchWhereInput;
    orderBy?: Prisma.MatchOrderByWithRelationInput | Prisma.MatchOrderByWithRelationInput[];
    cursor?: Prisma.MatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MatchScalarFieldEnum | Prisma.MatchScalarFieldEnum[];
};
export type Team$matchesAsBArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchSelect<ExtArgs> | null;
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    include?: Prisma.MatchInclude<ExtArgs> | null;
    where?: Prisma.MatchWhereInput;
    orderBy?: Prisma.MatchOrderByWithRelationInput | Prisma.MatchOrderByWithRelationInput[];
    cursor?: Prisma.MatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MatchScalarFieldEnum | Prisma.MatchScalarFieldEnum[];
};
export type TeamDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamSelect<ExtArgs> | null;
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    include?: Prisma.TeamInclude<ExtArgs> | null;
};

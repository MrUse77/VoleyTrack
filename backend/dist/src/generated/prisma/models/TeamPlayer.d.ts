import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TeamPlayerModel = runtime.Types.Result.DefaultSelection<Prisma.$TeamPlayerPayload>;
export type AggregateTeamPlayer = {
    _count: TeamPlayerCountAggregateOutputType | null;
    _min: TeamPlayerMinAggregateOutputType | null;
    _max: TeamPlayerMaxAggregateOutputType | null;
};
export type TeamPlayerMinAggregateOutputType = {
    teamId: string | null;
    playerId: string | null;
};
export type TeamPlayerMaxAggregateOutputType = {
    teamId: string | null;
    playerId: string | null;
};
export type TeamPlayerCountAggregateOutputType = {
    teamId: number;
    playerId: number;
    _all: number;
};
export type TeamPlayerMinAggregateInputType = {
    teamId?: true;
    playerId?: true;
};
export type TeamPlayerMaxAggregateInputType = {
    teamId?: true;
    playerId?: true;
};
export type TeamPlayerCountAggregateInputType = {
    teamId?: true;
    playerId?: true;
    _all?: true;
};
export type TeamPlayerAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamPlayerWhereInput;
    orderBy?: Prisma.TeamPlayerOrderByWithRelationInput | Prisma.TeamPlayerOrderByWithRelationInput[];
    cursor?: Prisma.TeamPlayerWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TeamPlayerCountAggregateInputType;
    _min?: TeamPlayerMinAggregateInputType;
    _max?: TeamPlayerMaxAggregateInputType;
};
export type GetTeamPlayerAggregateType<T extends TeamPlayerAggregateArgs> = {
    [P in keyof T & keyof AggregateTeamPlayer]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeamPlayer[P]> : Prisma.GetScalarType<T[P], AggregateTeamPlayer[P]>;
};
export type TeamPlayerGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamPlayerWhereInput;
    orderBy?: Prisma.TeamPlayerOrderByWithAggregationInput | Prisma.TeamPlayerOrderByWithAggregationInput[];
    by: Prisma.TeamPlayerScalarFieldEnum[] | Prisma.TeamPlayerScalarFieldEnum;
    having?: Prisma.TeamPlayerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeamPlayerCountAggregateInputType | true;
    _min?: TeamPlayerMinAggregateInputType;
    _max?: TeamPlayerMaxAggregateInputType;
};
export type TeamPlayerGroupByOutputType = {
    teamId: string;
    playerId: string;
    _count: TeamPlayerCountAggregateOutputType | null;
    _min: TeamPlayerMinAggregateOutputType | null;
    _max: TeamPlayerMaxAggregateOutputType | null;
};
export type GetTeamPlayerGroupByPayload<T extends TeamPlayerGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeamPlayerGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeamPlayerGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeamPlayerGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeamPlayerGroupByOutputType[P]>;
}>>;
export type TeamPlayerWhereInput = {
    AND?: Prisma.TeamPlayerWhereInput | Prisma.TeamPlayerWhereInput[];
    OR?: Prisma.TeamPlayerWhereInput[];
    NOT?: Prisma.TeamPlayerWhereInput | Prisma.TeamPlayerWhereInput[];
    teamId?: Prisma.UuidFilter<"TeamPlayer"> | string;
    playerId?: Prisma.UuidFilter<"TeamPlayer"> | string;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    player?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
};
export type TeamPlayerOrderByWithRelationInput = {
    teamId?: Prisma.SortOrder;
    playerId?: Prisma.SortOrder;
    team?: Prisma.TeamOrderByWithRelationInput;
    player?: Prisma.PlayerOrderByWithRelationInput;
};
export type TeamPlayerWhereUniqueInput = Prisma.AtLeast<{
    teamId_playerId?: Prisma.TeamPlayerTeamIdPlayerIdCompoundUniqueInput;
    AND?: Prisma.TeamPlayerWhereInput | Prisma.TeamPlayerWhereInput[];
    OR?: Prisma.TeamPlayerWhereInput[];
    NOT?: Prisma.TeamPlayerWhereInput | Prisma.TeamPlayerWhereInput[];
    teamId?: Prisma.UuidFilter<"TeamPlayer"> | string;
    playerId?: Prisma.UuidFilter<"TeamPlayer"> | string;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    player?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
}, "teamId_playerId">;
export type TeamPlayerOrderByWithAggregationInput = {
    teamId?: Prisma.SortOrder;
    playerId?: Prisma.SortOrder;
    _count?: Prisma.TeamPlayerCountOrderByAggregateInput;
    _max?: Prisma.TeamPlayerMaxOrderByAggregateInput;
    _min?: Prisma.TeamPlayerMinOrderByAggregateInput;
};
export type TeamPlayerScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeamPlayerScalarWhereWithAggregatesInput | Prisma.TeamPlayerScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeamPlayerScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeamPlayerScalarWhereWithAggregatesInput | Prisma.TeamPlayerScalarWhereWithAggregatesInput[];
    teamId?: Prisma.UuidWithAggregatesFilter<"TeamPlayer"> | string;
    playerId?: Prisma.UuidWithAggregatesFilter<"TeamPlayer"> | string;
};
export type TeamPlayerCreateInput = {
    team: Prisma.TeamCreateNestedOneWithoutPlayersInput;
    player: Prisma.PlayerCreateNestedOneWithoutTeamsInput;
};
export type TeamPlayerUncheckedCreateInput = {
    teamId: string;
    playerId: string;
};
export type TeamPlayerUpdateInput = {
    team?: Prisma.TeamUpdateOneRequiredWithoutPlayersNestedInput;
    player?: Prisma.PlayerUpdateOneRequiredWithoutTeamsNestedInput;
};
export type TeamPlayerUncheckedUpdateInput = {
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
    playerId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type TeamPlayerCreateManyInput = {
    teamId: string;
    playerId: string;
};
export type TeamPlayerUpdateManyMutationInput = {};
export type TeamPlayerUncheckedUpdateManyInput = {
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
    playerId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type TeamPlayerListRelationFilter = {
    every?: Prisma.TeamPlayerWhereInput;
    some?: Prisma.TeamPlayerWhereInput;
    none?: Prisma.TeamPlayerWhereInput;
};
export type TeamPlayerOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TeamPlayerTeamIdPlayerIdCompoundUniqueInput = {
    teamId: string;
    playerId: string;
};
export type TeamPlayerCountOrderByAggregateInput = {
    teamId?: Prisma.SortOrder;
    playerId?: Prisma.SortOrder;
};
export type TeamPlayerMaxOrderByAggregateInput = {
    teamId?: Prisma.SortOrder;
    playerId?: Prisma.SortOrder;
};
export type TeamPlayerMinOrderByAggregateInput = {
    teamId?: Prisma.SortOrder;
    playerId?: Prisma.SortOrder;
};
export type TeamPlayerCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerCreateWithoutPlayerInput[] | Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerCreateManyPlayerInputEnvelope;
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
};
export type TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerCreateWithoutPlayerInput[] | Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerCreateManyPlayerInputEnvelope;
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
};
export type TeamPlayerUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerCreateWithoutPlayerInput[] | Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerCreateManyPlayerInputEnvelope;
    set?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    delete?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    update?: Prisma.TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.TeamPlayerUpdateManyWithWhereWithoutPlayerInput | Prisma.TeamPlayerUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
};
export type TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput> | Prisma.TeamPlayerCreateWithoutPlayerInput[] | Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput | Prisma.TeamPlayerCreateOrConnectWithoutPlayerInput[];
    upsert?: Prisma.TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput[];
    createMany?: Prisma.TeamPlayerCreateManyPlayerInputEnvelope;
    set?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    delete?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    update?: Prisma.TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput | Prisma.TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput[];
    updateMany?: Prisma.TeamPlayerUpdateManyWithWhereWithoutPlayerInput | Prisma.TeamPlayerUpdateManyWithWhereWithoutPlayerInput[];
    deleteMany?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
};
export type TeamPlayerCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput> | Prisma.TeamPlayerCreateWithoutTeamInput[] | Prisma.TeamPlayerUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutTeamInput | Prisma.TeamPlayerCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.TeamPlayerCreateManyTeamInputEnvelope;
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
};
export type TeamPlayerUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput> | Prisma.TeamPlayerCreateWithoutTeamInput[] | Prisma.TeamPlayerUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutTeamInput | Prisma.TeamPlayerCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.TeamPlayerCreateManyTeamInputEnvelope;
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
};
export type TeamPlayerUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput> | Prisma.TeamPlayerCreateWithoutTeamInput[] | Prisma.TeamPlayerUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutTeamInput | Prisma.TeamPlayerCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.TeamPlayerUpsertWithWhereUniqueWithoutTeamInput | Prisma.TeamPlayerUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.TeamPlayerCreateManyTeamInputEnvelope;
    set?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    delete?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    update?: Prisma.TeamPlayerUpdateWithWhereUniqueWithoutTeamInput | Prisma.TeamPlayerUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.TeamPlayerUpdateManyWithWhereWithoutTeamInput | Prisma.TeamPlayerUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
};
export type TeamPlayerUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput> | Prisma.TeamPlayerCreateWithoutTeamInput[] | Prisma.TeamPlayerUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.TeamPlayerCreateOrConnectWithoutTeamInput | Prisma.TeamPlayerCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.TeamPlayerUpsertWithWhereUniqueWithoutTeamInput | Prisma.TeamPlayerUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.TeamPlayerCreateManyTeamInputEnvelope;
    set?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    disconnect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    delete?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    connect?: Prisma.TeamPlayerWhereUniqueInput | Prisma.TeamPlayerWhereUniqueInput[];
    update?: Prisma.TeamPlayerUpdateWithWhereUniqueWithoutTeamInput | Prisma.TeamPlayerUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.TeamPlayerUpdateManyWithWhereWithoutTeamInput | Prisma.TeamPlayerUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
};
export type TeamPlayerCreateWithoutPlayerInput = {
    team: Prisma.TeamCreateNestedOneWithoutPlayersInput;
};
export type TeamPlayerUncheckedCreateWithoutPlayerInput = {
    teamId: string;
};
export type TeamPlayerCreateOrConnectWithoutPlayerInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput>;
};
export type TeamPlayerCreateManyPlayerInputEnvelope = {
    data: Prisma.TeamPlayerCreateManyPlayerInput | Prisma.TeamPlayerCreateManyPlayerInput[];
    skipDuplicates?: boolean;
};
export type TeamPlayerUpsertWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamPlayerUpdateWithoutPlayerInput, Prisma.TeamPlayerUncheckedUpdateWithoutPlayerInput>;
    create: Prisma.XOR<Prisma.TeamPlayerCreateWithoutPlayerInput, Prisma.TeamPlayerUncheckedCreateWithoutPlayerInput>;
};
export type TeamPlayerUpdateWithWhereUniqueWithoutPlayerInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateWithoutPlayerInput, Prisma.TeamPlayerUncheckedUpdateWithoutPlayerInput>;
};
export type TeamPlayerUpdateManyWithWhereWithoutPlayerInput = {
    where: Prisma.TeamPlayerScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateManyMutationInput, Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerInput>;
};
export type TeamPlayerScalarWhereInput = {
    AND?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
    OR?: Prisma.TeamPlayerScalarWhereInput[];
    NOT?: Prisma.TeamPlayerScalarWhereInput | Prisma.TeamPlayerScalarWhereInput[];
    teamId?: Prisma.UuidFilter<"TeamPlayer"> | string;
    playerId?: Prisma.UuidFilter<"TeamPlayer"> | string;
};
export type TeamPlayerCreateWithoutTeamInput = {
    player: Prisma.PlayerCreateNestedOneWithoutTeamsInput;
};
export type TeamPlayerUncheckedCreateWithoutTeamInput = {
    playerId: string;
};
export type TeamPlayerCreateOrConnectWithoutTeamInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput>;
};
export type TeamPlayerCreateManyTeamInputEnvelope = {
    data: Prisma.TeamPlayerCreateManyTeamInput | Prisma.TeamPlayerCreateManyTeamInput[];
    skipDuplicates?: boolean;
};
export type TeamPlayerUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamPlayerUpdateWithoutTeamInput, Prisma.TeamPlayerUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.TeamPlayerCreateWithoutTeamInput, Prisma.TeamPlayerUncheckedCreateWithoutTeamInput>;
};
export type TeamPlayerUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.TeamPlayerWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateWithoutTeamInput, Prisma.TeamPlayerUncheckedUpdateWithoutTeamInput>;
};
export type TeamPlayerUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.TeamPlayerScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateManyMutationInput, Prisma.TeamPlayerUncheckedUpdateManyWithoutTeamInput>;
};
export type TeamPlayerCreateManyPlayerInput = {
    teamId: string;
};
export type TeamPlayerUpdateWithoutPlayerInput = {
    team?: Prisma.TeamUpdateOneRequiredWithoutPlayersNestedInput;
};
export type TeamPlayerUncheckedUpdateWithoutPlayerInput = {
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type TeamPlayerUncheckedUpdateManyWithoutPlayerInput = {
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type TeamPlayerCreateManyTeamInput = {
    playerId: string;
};
export type TeamPlayerUpdateWithoutTeamInput = {
    player?: Prisma.PlayerUpdateOneRequiredWithoutTeamsNestedInput;
};
export type TeamPlayerUncheckedUpdateWithoutTeamInput = {
    playerId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type TeamPlayerUncheckedUpdateManyWithoutTeamInput = {
    playerId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type TeamPlayerSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    teamId?: boolean;
    playerId?: boolean;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teamPlayer"]>;
export type TeamPlayerSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    teamId?: boolean;
    playerId?: boolean;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teamPlayer"]>;
export type TeamPlayerSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    teamId?: boolean;
    playerId?: boolean;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teamPlayer"]>;
export type TeamPlayerSelectScalar = {
    teamId?: boolean;
    playerId?: boolean;
};
export type TeamPlayerOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"teamId" | "playerId", ExtArgs["result"]["teamPlayer"]>;
export type TeamPlayerInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
};
export type TeamPlayerIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
};
export type TeamPlayerIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    player?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
};
export type $TeamPlayerPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TeamPlayer";
    objects: {
        team: Prisma.$TeamPayload<ExtArgs>;
        player: Prisma.$PlayerPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        teamId: string;
        playerId: string;
    }, ExtArgs["result"]["teamPlayer"]>;
    composites: {};
};
export type TeamPlayerGetPayload<S extends boolean | null | undefined | TeamPlayerDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload, S>;
export type TeamPlayerCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeamPlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeamPlayerCountAggregateInputType | true;
};
export interface TeamPlayerDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TeamPlayer'];
        meta: {
            name: 'TeamPlayer';
        };
    };
    findUnique<T extends TeamPlayerFindUniqueArgs>(args: Prisma.SelectSubset<T, TeamPlayerFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TeamPlayerFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeamPlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TeamPlayerFindFirstArgs>(args?: Prisma.SelectSubset<T, TeamPlayerFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TeamPlayerFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeamPlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TeamPlayerFindManyArgs>(args?: Prisma.SelectSubset<T, TeamPlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TeamPlayerCreateArgs>(args: Prisma.SelectSubset<T, TeamPlayerCreateArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TeamPlayerCreateManyArgs>(args?: Prisma.SelectSubset<T, TeamPlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TeamPlayerCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TeamPlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TeamPlayerDeleteArgs>(args: Prisma.SelectSubset<T, TeamPlayerDeleteArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TeamPlayerUpdateArgs>(args: Prisma.SelectSubset<T, TeamPlayerUpdateArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TeamPlayerDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeamPlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TeamPlayerUpdateManyArgs>(args: Prisma.SelectSubset<T, TeamPlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TeamPlayerUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TeamPlayerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TeamPlayerUpsertArgs>(args: Prisma.SelectSubset<T, TeamPlayerUpsertArgs<ExtArgs>>): Prisma.Prisma__TeamPlayerClient<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TeamPlayerCountArgs>(args?: Prisma.Subset<T, TeamPlayerCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeamPlayerCountAggregateOutputType> : number>;
    aggregate<T extends TeamPlayerAggregateArgs>(args: Prisma.Subset<T, TeamPlayerAggregateArgs>): Prisma.PrismaPromise<GetTeamPlayerAggregateType<T>>;
    groupBy<T extends TeamPlayerGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeamPlayerGroupByArgs['orderBy'];
    } : {
        orderBy?: TeamPlayerGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeamPlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TeamPlayerFieldRefs;
}
export interface Prisma__TeamPlayerClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    player<T extends Prisma.PlayerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PlayerDefaultArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TeamPlayerFieldRefs {
    readonly teamId: Prisma.FieldRef<"TeamPlayer", 'String'>;
    readonly playerId: Prisma.FieldRef<"TeamPlayer", 'String'>;
}
export type TeamPlayerFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    where: Prisma.TeamPlayerWhereUniqueInput;
};
export type TeamPlayerFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    where: Prisma.TeamPlayerWhereUniqueInput;
};
export type TeamPlayerFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TeamPlayerFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TeamPlayerFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TeamPlayerCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamPlayerCreateInput, Prisma.TeamPlayerUncheckedCreateInput>;
};
export type TeamPlayerCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TeamPlayerCreateManyInput | Prisma.TeamPlayerCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TeamPlayerCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamPlayerSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    data: Prisma.TeamPlayerCreateManyInput | Prisma.TeamPlayerCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TeamPlayerIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TeamPlayerUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateInput, Prisma.TeamPlayerUncheckedUpdateInput>;
    where: Prisma.TeamPlayerWhereUniqueInput;
};
export type TeamPlayerUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TeamPlayerUpdateManyMutationInput, Prisma.TeamPlayerUncheckedUpdateManyInput>;
    where?: Prisma.TeamPlayerWhereInput;
    limit?: number;
};
export type TeamPlayerUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamPlayerSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeamPlayerUpdateManyMutationInput, Prisma.TeamPlayerUncheckedUpdateManyInput>;
    where?: Prisma.TeamPlayerWhereInput;
    limit?: number;
    include?: Prisma.TeamPlayerIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TeamPlayerUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    where: Prisma.TeamPlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamPlayerCreateInput, Prisma.TeamPlayerUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TeamPlayerUpdateInput, Prisma.TeamPlayerUncheckedUpdateInput>;
};
export type TeamPlayerDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
    where: Prisma.TeamPlayerWhereUniqueInput;
};
export type TeamPlayerDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamPlayerWhereInput;
    limit?: number;
};
export type TeamPlayerDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeamPlayerSelect<ExtArgs> | null;
    omit?: Prisma.TeamPlayerOmit<ExtArgs> | null;
    include?: Prisma.TeamPlayerInclude<ExtArgs> | null;
};

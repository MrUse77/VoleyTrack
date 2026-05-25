import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PlayerModel = runtime.Types.Result.DefaultSelection<Prisma.$PlayerPayload>;
export type AggregatePlayer = {
    _count: PlayerCountAggregateOutputType | null;
    _avg: PlayerAvgAggregateOutputType | null;
    _sum: PlayerSumAggregateOutputType | null;
    _min: PlayerMinAggregateOutputType | null;
    _max: PlayerMaxAggregateOutputType | null;
};
export type PlayerAvgAggregateOutputType = {
    height: number | null;
};
export type PlayerSumAggregateOutputType = {
    height: number | null;
};
export type PlayerMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    lastname: string | null;
    height: number | null;
};
export type PlayerMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    lastname: string | null;
    height: number | null;
};
export type PlayerCountAggregateOutputType = {
    id: number;
    name: number;
    lastname: number;
    height: number;
    _all: number;
};
export type PlayerAvgAggregateInputType = {
    height?: true;
};
export type PlayerSumAggregateInputType = {
    height?: true;
};
export type PlayerMinAggregateInputType = {
    id?: true;
    name?: true;
    lastname?: true;
    height?: true;
};
export type PlayerMaxAggregateInputType = {
    id?: true;
    name?: true;
    lastname?: true;
    height?: true;
};
export type PlayerCountAggregateInputType = {
    id?: true;
    name?: true;
    lastname?: true;
    height?: true;
    _all?: true;
};
export type PlayerAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlayerWhereInput;
    orderBy?: Prisma.PlayerOrderByWithRelationInput | Prisma.PlayerOrderByWithRelationInput[];
    cursor?: Prisma.PlayerWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PlayerCountAggregateInputType;
    _avg?: PlayerAvgAggregateInputType;
    _sum?: PlayerSumAggregateInputType;
    _min?: PlayerMinAggregateInputType;
    _max?: PlayerMaxAggregateInputType;
};
export type GetPlayerAggregateType<T extends PlayerAggregateArgs> = {
    [P in keyof T & keyof AggregatePlayer]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePlayer[P]> : Prisma.GetScalarType<T[P], AggregatePlayer[P]>;
};
export type PlayerGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlayerWhereInput;
    orderBy?: Prisma.PlayerOrderByWithAggregationInput | Prisma.PlayerOrderByWithAggregationInput[];
    by: Prisma.PlayerScalarFieldEnum[] | Prisma.PlayerScalarFieldEnum;
    having?: Prisma.PlayerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlayerCountAggregateInputType | true;
    _avg?: PlayerAvgAggregateInputType;
    _sum?: PlayerSumAggregateInputType;
    _min?: PlayerMinAggregateInputType;
    _max?: PlayerMaxAggregateInputType;
};
export type PlayerGroupByOutputType = {
    id: string;
    name: string;
    lastname: string;
    height: number;
    _count: PlayerCountAggregateOutputType | null;
    _avg: PlayerAvgAggregateOutputType | null;
    _sum: PlayerSumAggregateOutputType | null;
    _min: PlayerMinAggregateOutputType | null;
    _max: PlayerMaxAggregateOutputType | null;
};
export type GetPlayerGroupByPayload<T extends PlayerGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PlayerGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PlayerGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PlayerGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PlayerGroupByOutputType[P]>;
}>>;
export type PlayerWhereInput = {
    AND?: Prisma.PlayerWhereInput | Prisma.PlayerWhereInput[];
    OR?: Prisma.PlayerWhereInput[];
    NOT?: Prisma.PlayerWhereInput | Prisma.PlayerWhereInput[];
    id?: Prisma.UuidFilter<"Player"> | string;
    name?: Prisma.StringFilter<"Player"> | string;
    lastname?: Prisma.StringFilter<"Player"> | string;
    height?: Prisma.IntFilter<"Player"> | number;
    teams?: Prisma.TeamPlayerListRelationFilter;
    substitutionsAsEnter?: Prisma.SubstitutionListRelationFilter;
    substitutionsAsLeave?: Prisma.SubstitutionListRelationFilter;
};
export type PlayerOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    lastname?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
    teams?: Prisma.TeamPlayerOrderByRelationAggregateInput;
    substitutionsAsEnter?: Prisma.SubstitutionOrderByRelationAggregateInput;
    substitutionsAsLeave?: Prisma.SubstitutionOrderByRelationAggregateInput;
};
export type PlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PlayerWhereInput | Prisma.PlayerWhereInput[];
    OR?: Prisma.PlayerWhereInput[];
    NOT?: Prisma.PlayerWhereInput | Prisma.PlayerWhereInput[];
    name?: Prisma.StringFilter<"Player"> | string;
    lastname?: Prisma.StringFilter<"Player"> | string;
    height?: Prisma.IntFilter<"Player"> | number;
    teams?: Prisma.TeamPlayerListRelationFilter;
    substitutionsAsEnter?: Prisma.SubstitutionListRelationFilter;
    substitutionsAsLeave?: Prisma.SubstitutionListRelationFilter;
}, "id">;
export type PlayerOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    lastname?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
    _count?: Prisma.PlayerCountOrderByAggregateInput;
    _avg?: Prisma.PlayerAvgOrderByAggregateInput;
    _max?: Prisma.PlayerMaxOrderByAggregateInput;
    _min?: Prisma.PlayerMinOrderByAggregateInput;
    _sum?: Prisma.PlayerSumOrderByAggregateInput;
};
export type PlayerScalarWhereWithAggregatesInput = {
    AND?: Prisma.PlayerScalarWhereWithAggregatesInput | Prisma.PlayerScalarWhereWithAggregatesInput[];
    OR?: Prisma.PlayerScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PlayerScalarWhereWithAggregatesInput | Prisma.PlayerScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Player"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Player"> | string;
    lastname?: Prisma.StringWithAggregatesFilter<"Player"> | string;
    height?: Prisma.IntWithAggregatesFilter<"Player"> | number;
};
export type PlayerCreateInput = {
    id?: string;
    name: string;
    lastname: string;
    height: number;
    teams?: Prisma.TeamPlayerCreateNestedManyWithoutPlayerInput;
    substitutionsAsEnter?: Prisma.SubstitutionCreateNestedManyWithoutPlayerEntersInput;
    substitutionsAsLeave?: Prisma.SubstitutionCreateNestedManyWithoutPlayerLeavesInput;
};
export type PlayerUncheckedCreateInput = {
    id?: string;
    name: string;
    lastname: string;
    height: number;
    teams?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput;
    substitutionsAsEnter?: Prisma.SubstitutionUncheckedCreateNestedManyWithoutPlayerEntersInput;
    substitutionsAsLeave?: Prisma.SubstitutionUncheckedCreateNestedManyWithoutPlayerLeavesInput;
};
export type PlayerUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    lastname?: Prisma.StringFieldUpdateOperationsInput | string;
    height?: Prisma.IntFieldUpdateOperationsInput | number;
    teams?: Prisma.TeamPlayerUpdateManyWithoutPlayerNestedInput;
    substitutionsAsEnter?: Prisma.SubstitutionUpdateManyWithoutPlayerEntersNestedInput;
    substitutionsAsLeave?: Prisma.SubstitutionUpdateManyWithoutPlayerLeavesNestedInput;
};
export type PlayerUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    lastname?: Prisma.StringFieldUpdateOperationsInput | string;
    height?: Prisma.IntFieldUpdateOperationsInput | number;
    teams?: Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    substitutionsAsEnter?: Prisma.SubstitutionUncheckedUpdateManyWithoutPlayerEntersNestedInput;
    substitutionsAsLeave?: Prisma.SubstitutionUncheckedUpdateManyWithoutPlayerLeavesNestedInput;
};
export type PlayerCreateManyInput = {
    id?: string;
    name: string;
    lastname: string;
    height: number;
};
export type PlayerUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    lastname?: Prisma.StringFieldUpdateOperationsInput | string;
    height?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PlayerUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    lastname?: Prisma.StringFieldUpdateOperationsInput | string;
    height?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PlayerCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    lastname?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
};
export type PlayerAvgOrderByAggregateInput = {
    height?: Prisma.SortOrder;
};
export type PlayerMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    lastname?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
};
export type PlayerMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    lastname?: Prisma.SortOrder;
    height?: Prisma.SortOrder;
};
export type PlayerSumOrderByAggregateInput = {
    height?: Prisma.SortOrder;
};
export type PlayerScalarRelationFilter = {
    is?: Prisma.PlayerWhereInput;
    isNot?: Prisma.PlayerWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type PlayerCreateNestedOneWithoutTeamsInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutTeamsInput, Prisma.PlayerUncheckedCreateWithoutTeamsInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutTeamsInput;
    connect?: Prisma.PlayerWhereUniqueInput;
};
export type PlayerUpdateOneRequiredWithoutTeamsNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutTeamsInput, Prisma.PlayerUncheckedCreateWithoutTeamsInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutTeamsInput;
    upsert?: Prisma.PlayerUpsertWithoutTeamsInput;
    connect?: Prisma.PlayerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlayerUpdateToOneWithWhereWithoutTeamsInput, Prisma.PlayerUpdateWithoutTeamsInput>, Prisma.PlayerUncheckedUpdateWithoutTeamsInput>;
};
export type PlayerCreateNestedOneWithoutSubstitutionsAsEnterInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutSubstitutionsAsEnterInput, Prisma.PlayerUncheckedCreateWithoutSubstitutionsAsEnterInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutSubstitutionsAsEnterInput;
    connect?: Prisma.PlayerWhereUniqueInput;
};
export type PlayerCreateNestedOneWithoutSubstitutionsAsLeaveInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutSubstitutionsAsLeaveInput, Prisma.PlayerUncheckedCreateWithoutSubstitutionsAsLeaveInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutSubstitutionsAsLeaveInput;
    connect?: Prisma.PlayerWhereUniqueInput;
};
export type PlayerUpdateOneRequiredWithoutSubstitutionsAsEnterNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutSubstitutionsAsEnterInput, Prisma.PlayerUncheckedCreateWithoutSubstitutionsAsEnterInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutSubstitutionsAsEnterInput;
    upsert?: Prisma.PlayerUpsertWithoutSubstitutionsAsEnterInput;
    connect?: Prisma.PlayerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlayerUpdateToOneWithWhereWithoutSubstitutionsAsEnterInput, Prisma.PlayerUpdateWithoutSubstitutionsAsEnterInput>, Prisma.PlayerUncheckedUpdateWithoutSubstitutionsAsEnterInput>;
};
export type PlayerUpdateOneRequiredWithoutSubstitutionsAsLeaveNestedInput = {
    create?: Prisma.XOR<Prisma.PlayerCreateWithoutSubstitutionsAsLeaveInput, Prisma.PlayerUncheckedCreateWithoutSubstitutionsAsLeaveInput>;
    connectOrCreate?: Prisma.PlayerCreateOrConnectWithoutSubstitutionsAsLeaveInput;
    upsert?: Prisma.PlayerUpsertWithoutSubstitutionsAsLeaveInput;
    connect?: Prisma.PlayerWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PlayerUpdateToOneWithWhereWithoutSubstitutionsAsLeaveInput, Prisma.PlayerUpdateWithoutSubstitutionsAsLeaveInput>, Prisma.PlayerUncheckedUpdateWithoutSubstitutionsAsLeaveInput>;
};
export type PlayerCreateWithoutTeamsInput = {
    id?: string;
    name: string;
    lastname: string;
    height: number;
    substitutionsAsEnter?: Prisma.SubstitutionCreateNestedManyWithoutPlayerEntersInput;
    substitutionsAsLeave?: Prisma.SubstitutionCreateNestedManyWithoutPlayerLeavesInput;
};
export type PlayerUncheckedCreateWithoutTeamsInput = {
    id?: string;
    name: string;
    lastname: string;
    height: number;
    substitutionsAsEnter?: Prisma.SubstitutionUncheckedCreateNestedManyWithoutPlayerEntersInput;
    substitutionsAsLeave?: Prisma.SubstitutionUncheckedCreateNestedManyWithoutPlayerLeavesInput;
};
export type PlayerCreateOrConnectWithoutTeamsInput = {
    where: Prisma.PlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutTeamsInput, Prisma.PlayerUncheckedCreateWithoutTeamsInput>;
};
export type PlayerUpsertWithoutTeamsInput = {
    update: Prisma.XOR<Prisma.PlayerUpdateWithoutTeamsInput, Prisma.PlayerUncheckedUpdateWithoutTeamsInput>;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutTeamsInput, Prisma.PlayerUncheckedCreateWithoutTeamsInput>;
    where?: Prisma.PlayerWhereInput;
};
export type PlayerUpdateToOneWithWhereWithoutTeamsInput = {
    where?: Prisma.PlayerWhereInput;
    data: Prisma.XOR<Prisma.PlayerUpdateWithoutTeamsInput, Prisma.PlayerUncheckedUpdateWithoutTeamsInput>;
};
export type PlayerUpdateWithoutTeamsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    lastname?: Prisma.StringFieldUpdateOperationsInput | string;
    height?: Prisma.IntFieldUpdateOperationsInput | number;
    substitutionsAsEnter?: Prisma.SubstitutionUpdateManyWithoutPlayerEntersNestedInput;
    substitutionsAsLeave?: Prisma.SubstitutionUpdateManyWithoutPlayerLeavesNestedInput;
};
export type PlayerUncheckedUpdateWithoutTeamsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    lastname?: Prisma.StringFieldUpdateOperationsInput | string;
    height?: Prisma.IntFieldUpdateOperationsInput | number;
    substitutionsAsEnter?: Prisma.SubstitutionUncheckedUpdateManyWithoutPlayerEntersNestedInput;
    substitutionsAsLeave?: Prisma.SubstitutionUncheckedUpdateManyWithoutPlayerLeavesNestedInput;
};
export type PlayerCreateWithoutSubstitutionsAsEnterInput = {
    id?: string;
    name: string;
    lastname: string;
    height: number;
    teams?: Prisma.TeamPlayerCreateNestedManyWithoutPlayerInput;
    substitutionsAsLeave?: Prisma.SubstitutionCreateNestedManyWithoutPlayerLeavesInput;
};
export type PlayerUncheckedCreateWithoutSubstitutionsAsEnterInput = {
    id?: string;
    name: string;
    lastname: string;
    height: number;
    teams?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput;
    substitutionsAsLeave?: Prisma.SubstitutionUncheckedCreateNestedManyWithoutPlayerLeavesInput;
};
export type PlayerCreateOrConnectWithoutSubstitutionsAsEnterInput = {
    where: Prisma.PlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutSubstitutionsAsEnterInput, Prisma.PlayerUncheckedCreateWithoutSubstitutionsAsEnterInput>;
};
export type PlayerCreateWithoutSubstitutionsAsLeaveInput = {
    id?: string;
    name: string;
    lastname: string;
    height: number;
    teams?: Prisma.TeamPlayerCreateNestedManyWithoutPlayerInput;
    substitutionsAsEnter?: Prisma.SubstitutionCreateNestedManyWithoutPlayerEntersInput;
};
export type PlayerUncheckedCreateWithoutSubstitutionsAsLeaveInput = {
    id?: string;
    name: string;
    lastname: string;
    height: number;
    teams?: Prisma.TeamPlayerUncheckedCreateNestedManyWithoutPlayerInput;
    substitutionsAsEnter?: Prisma.SubstitutionUncheckedCreateNestedManyWithoutPlayerEntersInput;
};
export type PlayerCreateOrConnectWithoutSubstitutionsAsLeaveInput = {
    where: Prisma.PlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutSubstitutionsAsLeaveInput, Prisma.PlayerUncheckedCreateWithoutSubstitutionsAsLeaveInput>;
};
export type PlayerUpsertWithoutSubstitutionsAsEnterInput = {
    update: Prisma.XOR<Prisma.PlayerUpdateWithoutSubstitutionsAsEnterInput, Prisma.PlayerUncheckedUpdateWithoutSubstitutionsAsEnterInput>;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutSubstitutionsAsEnterInput, Prisma.PlayerUncheckedCreateWithoutSubstitutionsAsEnterInput>;
    where?: Prisma.PlayerWhereInput;
};
export type PlayerUpdateToOneWithWhereWithoutSubstitutionsAsEnterInput = {
    where?: Prisma.PlayerWhereInput;
    data: Prisma.XOR<Prisma.PlayerUpdateWithoutSubstitutionsAsEnterInput, Prisma.PlayerUncheckedUpdateWithoutSubstitutionsAsEnterInput>;
};
export type PlayerUpdateWithoutSubstitutionsAsEnterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    lastname?: Prisma.StringFieldUpdateOperationsInput | string;
    height?: Prisma.IntFieldUpdateOperationsInput | number;
    teams?: Prisma.TeamPlayerUpdateManyWithoutPlayerNestedInput;
    substitutionsAsLeave?: Prisma.SubstitutionUpdateManyWithoutPlayerLeavesNestedInput;
};
export type PlayerUncheckedUpdateWithoutSubstitutionsAsEnterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    lastname?: Prisma.StringFieldUpdateOperationsInput | string;
    height?: Prisma.IntFieldUpdateOperationsInput | number;
    teams?: Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    substitutionsAsLeave?: Prisma.SubstitutionUncheckedUpdateManyWithoutPlayerLeavesNestedInput;
};
export type PlayerUpsertWithoutSubstitutionsAsLeaveInput = {
    update: Prisma.XOR<Prisma.PlayerUpdateWithoutSubstitutionsAsLeaveInput, Prisma.PlayerUncheckedUpdateWithoutSubstitutionsAsLeaveInput>;
    create: Prisma.XOR<Prisma.PlayerCreateWithoutSubstitutionsAsLeaveInput, Prisma.PlayerUncheckedCreateWithoutSubstitutionsAsLeaveInput>;
    where?: Prisma.PlayerWhereInput;
};
export type PlayerUpdateToOneWithWhereWithoutSubstitutionsAsLeaveInput = {
    where?: Prisma.PlayerWhereInput;
    data: Prisma.XOR<Prisma.PlayerUpdateWithoutSubstitutionsAsLeaveInput, Prisma.PlayerUncheckedUpdateWithoutSubstitutionsAsLeaveInput>;
};
export type PlayerUpdateWithoutSubstitutionsAsLeaveInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    lastname?: Prisma.StringFieldUpdateOperationsInput | string;
    height?: Prisma.IntFieldUpdateOperationsInput | number;
    teams?: Prisma.TeamPlayerUpdateManyWithoutPlayerNestedInput;
    substitutionsAsEnter?: Prisma.SubstitutionUpdateManyWithoutPlayerEntersNestedInput;
};
export type PlayerUncheckedUpdateWithoutSubstitutionsAsLeaveInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    lastname?: Prisma.StringFieldUpdateOperationsInput | string;
    height?: Prisma.IntFieldUpdateOperationsInput | number;
    teams?: Prisma.TeamPlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    substitutionsAsEnter?: Prisma.SubstitutionUncheckedUpdateManyWithoutPlayerEntersNestedInput;
};
export type PlayerCountOutputType = {
    teams: number;
    substitutionsAsEnter: number;
    substitutionsAsLeave: number;
};
export type PlayerCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    teams?: boolean | PlayerCountOutputTypeCountTeamsArgs;
    substitutionsAsEnter?: boolean | PlayerCountOutputTypeCountSubstitutionsAsEnterArgs;
    substitutionsAsLeave?: boolean | PlayerCountOutputTypeCountSubstitutionsAsLeaveArgs;
};
export type PlayerCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerCountOutputTypeSelect<ExtArgs> | null;
};
export type PlayerCountOutputTypeCountTeamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamPlayerWhereInput;
};
export type PlayerCountOutputTypeCountSubstitutionsAsEnterArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubstitutionWhereInput;
};
export type PlayerCountOutputTypeCountSubstitutionsAsLeaveArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubstitutionWhereInput;
};
export type PlayerSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    lastname?: boolean;
    height?: boolean;
    teams?: boolean | Prisma.Player$teamsArgs<ExtArgs>;
    substitutionsAsEnter?: boolean | Prisma.Player$substitutionsAsEnterArgs<ExtArgs>;
    substitutionsAsLeave?: boolean | Prisma.Player$substitutionsAsLeaveArgs<ExtArgs>;
    _count?: boolean | Prisma.PlayerCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["player"]>;
export type PlayerSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    lastname?: boolean;
    height?: boolean;
}, ExtArgs["result"]["player"]>;
export type PlayerSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    lastname?: boolean;
    height?: boolean;
}, ExtArgs["result"]["player"]>;
export type PlayerSelectScalar = {
    id?: boolean;
    name?: boolean;
    lastname?: boolean;
    height?: boolean;
};
export type PlayerOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "lastname" | "height", ExtArgs["result"]["player"]>;
export type PlayerInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    teams?: boolean | Prisma.Player$teamsArgs<ExtArgs>;
    substitutionsAsEnter?: boolean | Prisma.Player$substitutionsAsEnterArgs<ExtArgs>;
    substitutionsAsLeave?: boolean | Prisma.Player$substitutionsAsLeaveArgs<ExtArgs>;
    _count?: boolean | Prisma.PlayerCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PlayerIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type PlayerIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $PlayerPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Player";
    objects: {
        teams: Prisma.$TeamPlayerPayload<ExtArgs>[];
        substitutionsAsEnter: Prisma.$SubstitutionPayload<ExtArgs>[];
        substitutionsAsLeave: Prisma.$SubstitutionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        lastname: string;
        height: number;
    }, ExtArgs["result"]["player"]>;
    composites: {};
};
export type PlayerGetPayload<S extends boolean | null | undefined | PlayerDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PlayerPayload, S>;
export type PlayerCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PlayerCountAggregateInputType | true;
};
export interface PlayerDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Player'];
        meta: {
            name: 'Player';
        };
    };
    findUnique<T extends PlayerFindUniqueArgs>(args: Prisma.SelectSubset<T, PlayerFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PlayerFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PlayerFindFirstArgs>(args?: Prisma.SelectSubset<T, PlayerFindFirstArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PlayerFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PlayerFindManyArgs>(args?: Prisma.SelectSubset<T, PlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PlayerCreateArgs>(args: Prisma.SelectSubset<T, PlayerCreateArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PlayerCreateManyArgs>(args?: Prisma.SelectSubset<T, PlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PlayerCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PlayerDeleteArgs>(args: Prisma.SelectSubset<T, PlayerDeleteArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PlayerUpdateArgs>(args: Prisma.SelectSubset<T, PlayerUpdateArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PlayerDeleteManyArgs>(args?: Prisma.SelectSubset<T, PlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PlayerUpdateManyArgs>(args: Prisma.SelectSubset<T, PlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PlayerUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PlayerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PlayerUpsertArgs>(args: Prisma.SelectSubset<T, PlayerUpsertArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PlayerCountArgs>(args?: Prisma.Subset<T, PlayerCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PlayerCountAggregateOutputType> : number>;
    aggregate<T extends PlayerAggregateArgs>(args: Prisma.Subset<T, PlayerAggregateArgs>): Prisma.PrismaPromise<GetPlayerAggregateType<T>>;
    groupBy<T extends PlayerGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PlayerGroupByArgs['orderBy'];
    } : {
        orderBy?: PlayerGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PlayerFieldRefs;
}
export interface Prisma__PlayerClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    teams<T extends Prisma.Player$teamsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Player$teamsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    substitutionsAsEnter<T extends Prisma.Player$substitutionsAsEnterArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Player$substitutionsAsEnterArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    substitutionsAsLeave<T extends Prisma.Player$substitutionsAsLeaveArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Player$substitutionsAsLeaveArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PlayerFieldRefs {
    readonly id: Prisma.FieldRef<"Player", 'String'>;
    readonly name: Prisma.FieldRef<"Player", 'String'>;
    readonly lastname: Prisma.FieldRef<"Player", 'String'>;
    readonly height: Prisma.FieldRef<"Player", 'Int'>;
}
export type PlayerFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    where: Prisma.PlayerWhereUniqueInput;
};
export type PlayerFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    where: Prisma.PlayerWhereUniqueInput;
};
export type PlayerFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    where?: Prisma.PlayerWhereInput;
    orderBy?: Prisma.PlayerOrderByWithRelationInput | Prisma.PlayerOrderByWithRelationInput[];
    cursor?: Prisma.PlayerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlayerScalarFieldEnum | Prisma.PlayerScalarFieldEnum[];
};
export type PlayerFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    where?: Prisma.PlayerWhereInput;
    orderBy?: Prisma.PlayerOrderByWithRelationInput | Prisma.PlayerOrderByWithRelationInput[];
    cursor?: Prisma.PlayerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlayerScalarFieldEnum | Prisma.PlayerScalarFieldEnum[];
};
export type PlayerFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    where?: Prisma.PlayerWhereInput;
    orderBy?: Prisma.PlayerOrderByWithRelationInput | Prisma.PlayerOrderByWithRelationInput[];
    cursor?: Prisma.PlayerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlayerScalarFieldEnum | Prisma.PlayerScalarFieldEnum[];
};
export type PlayerCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlayerCreateInput, Prisma.PlayerUncheckedCreateInput>;
};
export type PlayerCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PlayerCreateManyInput | Prisma.PlayerCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlayerCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    data: Prisma.PlayerCreateManyInput | Prisma.PlayerCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlayerUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlayerUpdateInput, Prisma.PlayerUncheckedUpdateInput>;
    where: Prisma.PlayerWhereUniqueInput;
};
export type PlayerUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PlayerUpdateManyMutationInput, Prisma.PlayerUncheckedUpdateManyInput>;
    where?: Prisma.PlayerWhereInput;
    limit?: number;
};
export type PlayerUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlayerUpdateManyMutationInput, Prisma.PlayerUncheckedUpdateManyInput>;
    where?: Prisma.PlayerWhereInput;
    limit?: number;
};
export type PlayerUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    where: Prisma.PlayerWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlayerCreateInput, Prisma.PlayerUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PlayerUpdateInput, Prisma.PlayerUncheckedUpdateInput>;
};
export type PlayerDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    include?: Prisma.PlayerInclude<ExtArgs> | null;
    where: Prisma.PlayerWhereUniqueInput;
};
export type PlayerDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlayerWhereInput;
    limit?: number;
};
export type Player$teamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Player$substitutionsAsEnterArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionInclude<ExtArgs> | null;
    where?: Prisma.SubstitutionWhereInput;
    orderBy?: Prisma.SubstitutionOrderByWithRelationInput | Prisma.SubstitutionOrderByWithRelationInput[];
    cursor?: Prisma.SubstitutionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubstitutionScalarFieldEnum | Prisma.SubstitutionScalarFieldEnum[];
};
export type Player$substitutionsAsLeaveArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionInclude<ExtArgs> | null;
    where?: Prisma.SubstitutionWhereInput;
    orderBy?: Prisma.SubstitutionOrderByWithRelationInput | Prisma.SubstitutionOrderByWithRelationInput[];
    cursor?: Prisma.SubstitutionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubstitutionScalarFieldEnum | Prisma.SubstitutionScalarFieldEnum[];
};
export type PlayerDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlayerSelect<ExtArgs> | null;
    omit?: Prisma.PlayerOmit<ExtArgs> | null;
    include?: Prisma.PlayerInclude<ExtArgs> | null;
};

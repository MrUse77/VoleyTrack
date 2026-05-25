import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type LiveScoreboardModel = runtime.Types.Result.DefaultSelection<Prisma.$LiveScoreboardPayload>;
export type AggregateLiveScoreboard = {
    _count: LiveScoreboardCountAggregateOutputType | null;
    _avg: LiveScoreboardAvgAggregateOutputType | null;
    _sum: LiveScoreboardSumAggregateOutputType | null;
    _min: LiveScoreboardMinAggregateOutputType | null;
    _max: LiveScoreboardMaxAggregateOutputType | null;
};
export type LiveScoreboardAvgAggregateOutputType = {
    pointsA: number | null;
    pointsB: number | null;
    currentSet: number | null;
};
export type LiveScoreboardSumAggregateOutputType = {
    pointsA: number | null;
    pointsB: number | null;
    currentSet: number | null;
};
export type LiveScoreboardMinAggregateOutputType = {
    matchId: string | null;
    teamAName: string | null;
    teamBName: string | null;
    pointsA: number | null;
    pointsB: number | null;
    currentSet: number | null;
    lastEventId: string | null;
};
export type LiveScoreboardMaxAggregateOutputType = {
    matchId: string | null;
    teamAName: string | null;
    teamBName: string | null;
    pointsA: number | null;
    pointsB: number | null;
    currentSet: number | null;
    lastEventId: string | null;
};
export type LiveScoreboardCountAggregateOutputType = {
    matchId: number;
    teamAName: number;
    teamBName: number;
    pointsA: number;
    pointsB: number;
    currentSet: number;
    lastEventId: number;
    _all: number;
};
export type LiveScoreboardAvgAggregateInputType = {
    pointsA?: true;
    pointsB?: true;
    currentSet?: true;
};
export type LiveScoreboardSumAggregateInputType = {
    pointsA?: true;
    pointsB?: true;
    currentSet?: true;
};
export type LiveScoreboardMinAggregateInputType = {
    matchId?: true;
    teamAName?: true;
    teamBName?: true;
    pointsA?: true;
    pointsB?: true;
    currentSet?: true;
    lastEventId?: true;
};
export type LiveScoreboardMaxAggregateInputType = {
    matchId?: true;
    teamAName?: true;
    teamBName?: true;
    pointsA?: true;
    pointsB?: true;
    currentSet?: true;
    lastEventId?: true;
};
export type LiveScoreboardCountAggregateInputType = {
    matchId?: true;
    teamAName?: true;
    teamBName?: true;
    pointsA?: true;
    pointsB?: true;
    currentSet?: true;
    lastEventId?: true;
    _all?: true;
};
export type LiveScoreboardAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveScoreboardWhereInput;
    orderBy?: Prisma.LiveScoreboardOrderByWithRelationInput | Prisma.LiveScoreboardOrderByWithRelationInput[];
    cursor?: Prisma.LiveScoreboardWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LiveScoreboardCountAggregateInputType;
    _avg?: LiveScoreboardAvgAggregateInputType;
    _sum?: LiveScoreboardSumAggregateInputType;
    _min?: LiveScoreboardMinAggregateInputType;
    _max?: LiveScoreboardMaxAggregateInputType;
};
export type GetLiveScoreboardAggregateType<T extends LiveScoreboardAggregateArgs> = {
    [P in keyof T & keyof AggregateLiveScoreboard]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLiveScoreboard[P]> : Prisma.GetScalarType<T[P], AggregateLiveScoreboard[P]>;
};
export type LiveScoreboardGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveScoreboardWhereInput;
    orderBy?: Prisma.LiveScoreboardOrderByWithAggregationInput | Prisma.LiveScoreboardOrderByWithAggregationInput[];
    by: Prisma.LiveScoreboardScalarFieldEnum[] | Prisma.LiveScoreboardScalarFieldEnum;
    having?: Prisma.LiveScoreboardScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LiveScoreboardCountAggregateInputType | true;
    _avg?: LiveScoreboardAvgAggregateInputType;
    _sum?: LiveScoreboardSumAggregateInputType;
    _min?: LiveScoreboardMinAggregateInputType;
    _max?: LiveScoreboardMaxAggregateInputType;
};
export type LiveScoreboardGroupByOutputType = {
    matchId: string;
    teamAName: string | null;
    teamBName: string | null;
    pointsA: number;
    pointsB: number;
    currentSet: number;
    lastEventId: string | null;
    _count: LiveScoreboardCountAggregateOutputType | null;
    _avg: LiveScoreboardAvgAggregateOutputType | null;
    _sum: LiveScoreboardSumAggregateOutputType | null;
    _min: LiveScoreboardMinAggregateOutputType | null;
    _max: LiveScoreboardMaxAggregateOutputType | null;
};
export type GetLiveScoreboardGroupByPayload<T extends LiveScoreboardGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LiveScoreboardGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LiveScoreboardGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LiveScoreboardGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LiveScoreboardGroupByOutputType[P]>;
}>>;
export type LiveScoreboardWhereInput = {
    AND?: Prisma.LiveScoreboardWhereInput | Prisma.LiveScoreboardWhereInput[];
    OR?: Prisma.LiveScoreboardWhereInput[];
    NOT?: Prisma.LiveScoreboardWhereInput | Prisma.LiveScoreboardWhereInput[];
    matchId?: Prisma.UuidFilter<"LiveScoreboard"> | string;
    teamAName?: Prisma.StringNullableFilter<"LiveScoreboard"> | string | null;
    teamBName?: Prisma.StringNullableFilter<"LiveScoreboard"> | string | null;
    pointsA?: Prisma.IntFilter<"LiveScoreboard"> | number;
    pointsB?: Prisma.IntFilter<"LiveScoreboard"> | number;
    currentSet?: Prisma.IntFilter<"LiveScoreboard"> | number;
    lastEventId?: Prisma.UuidNullableFilter<"LiveScoreboard"> | string | null;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
    lastEvent?: Prisma.XOR<Prisma.EventNullableScalarRelationFilter, Prisma.EventWhereInput> | null;
};
export type LiveScoreboardOrderByWithRelationInput = {
    matchId?: Prisma.SortOrder;
    teamAName?: Prisma.SortOrderInput | Prisma.SortOrder;
    teamBName?: Prisma.SortOrderInput | Prisma.SortOrder;
    pointsA?: Prisma.SortOrder;
    pointsB?: Prisma.SortOrder;
    currentSet?: Prisma.SortOrder;
    lastEventId?: Prisma.SortOrderInput | Prisma.SortOrder;
    match?: Prisma.MatchOrderByWithRelationInput;
    lastEvent?: Prisma.EventOrderByWithRelationInput;
};
export type LiveScoreboardWhereUniqueInput = Prisma.AtLeast<{
    matchId?: string;
    AND?: Prisma.LiveScoreboardWhereInput | Prisma.LiveScoreboardWhereInput[];
    OR?: Prisma.LiveScoreboardWhereInput[];
    NOT?: Prisma.LiveScoreboardWhereInput | Prisma.LiveScoreboardWhereInput[];
    teamAName?: Prisma.StringNullableFilter<"LiveScoreboard"> | string | null;
    teamBName?: Prisma.StringNullableFilter<"LiveScoreboard"> | string | null;
    pointsA?: Prisma.IntFilter<"LiveScoreboard"> | number;
    pointsB?: Prisma.IntFilter<"LiveScoreboard"> | number;
    currentSet?: Prisma.IntFilter<"LiveScoreboard"> | number;
    lastEventId?: Prisma.UuidNullableFilter<"LiveScoreboard"> | string | null;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
    lastEvent?: Prisma.XOR<Prisma.EventNullableScalarRelationFilter, Prisma.EventWhereInput> | null;
}, "matchId">;
export type LiveScoreboardOrderByWithAggregationInput = {
    matchId?: Prisma.SortOrder;
    teamAName?: Prisma.SortOrderInput | Prisma.SortOrder;
    teamBName?: Prisma.SortOrderInput | Prisma.SortOrder;
    pointsA?: Prisma.SortOrder;
    pointsB?: Prisma.SortOrder;
    currentSet?: Prisma.SortOrder;
    lastEventId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.LiveScoreboardCountOrderByAggregateInput;
    _avg?: Prisma.LiveScoreboardAvgOrderByAggregateInput;
    _max?: Prisma.LiveScoreboardMaxOrderByAggregateInput;
    _min?: Prisma.LiveScoreboardMinOrderByAggregateInput;
    _sum?: Prisma.LiveScoreboardSumOrderByAggregateInput;
};
export type LiveScoreboardScalarWhereWithAggregatesInput = {
    AND?: Prisma.LiveScoreboardScalarWhereWithAggregatesInput | Prisma.LiveScoreboardScalarWhereWithAggregatesInput[];
    OR?: Prisma.LiveScoreboardScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LiveScoreboardScalarWhereWithAggregatesInput | Prisma.LiveScoreboardScalarWhereWithAggregatesInput[];
    matchId?: Prisma.UuidWithAggregatesFilter<"LiveScoreboard"> | string;
    teamAName?: Prisma.StringNullableWithAggregatesFilter<"LiveScoreboard"> | string | null;
    teamBName?: Prisma.StringNullableWithAggregatesFilter<"LiveScoreboard"> | string | null;
    pointsA?: Prisma.IntWithAggregatesFilter<"LiveScoreboard"> | number;
    pointsB?: Prisma.IntWithAggregatesFilter<"LiveScoreboard"> | number;
    currentSet?: Prisma.IntWithAggregatesFilter<"LiveScoreboard"> | number;
    lastEventId?: Prisma.UuidNullableWithAggregatesFilter<"LiveScoreboard"> | string | null;
};
export type LiveScoreboardCreateInput = {
    teamAName?: string | null;
    teamBName?: string | null;
    pointsA?: number;
    pointsB?: number;
    currentSet?: number;
    match: Prisma.MatchCreateNestedOneWithoutScoreboardInput;
    lastEvent?: Prisma.EventCreateNestedOneWithoutScoreboardsAsLastEventInput;
};
export type LiveScoreboardUncheckedCreateInput = {
    matchId: string;
    teamAName?: string | null;
    teamBName?: string | null;
    pointsA?: number;
    pointsB?: number;
    currentSet?: number;
    lastEventId?: string | null;
};
export type LiveScoreboardUpdateInput = {
    teamAName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamBName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pointsA?: Prisma.IntFieldUpdateOperationsInput | number;
    pointsB?: Prisma.IntFieldUpdateOperationsInput | number;
    currentSet?: Prisma.IntFieldUpdateOperationsInput | number;
    match?: Prisma.MatchUpdateOneRequiredWithoutScoreboardNestedInput;
    lastEvent?: Prisma.EventUpdateOneWithoutScoreboardsAsLastEventNestedInput;
};
export type LiveScoreboardUncheckedUpdateInput = {
    matchId?: Prisma.StringFieldUpdateOperationsInput | string;
    teamAName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamBName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pointsA?: Prisma.IntFieldUpdateOperationsInput | number;
    pointsB?: Prisma.IntFieldUpdateOperationsInput | number;
    currentSet?: Prisma.IntFieldUpdateOperationsInput | number;
    lastEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type LiveScoreboardCreateManyInput = {
    matchId: string;
    teamAName?: string | null;
    teamBName?: string | null;
    pointsA?: number;
    pointsB?: number;
    currentSet?: number;
    lastEventId?: string | null;
};
export type LiveScoreboardUpdateManyMutationInput = {
    teamAName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamBName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pointsA?: Prisma.IntFieldUpdateOperationsInput | number;
    pointsB?: Prisma.IntFieldUpdateOperationsInput | number;
    currentSet?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type LiveScoreboardUncheckedUpdateManyInput = {
    matchId?: Prisma.StringFieldUpdateOperationsInput | string;
    teamAName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamBName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pointsA?: Prisma.IntFieldUpdateOperationsInput | number;
    pointsB?: Prisma.IntFieldUpdateOperationsInput | number;
    currentSet?: Prisma.IntFieldUpdateOperationsInput | number;
    lastEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type LiveScoreboardNullableScalarRelationFilter = {
    is?: Prisma.LiveScoreboardWhereInput | null;
    isNot?: Prisma.LiveScoreboardWhereInput | null;
};
export type LiveScoreboardListRelationFilter = {
    every?: Prisma.LiveScoreboardWhereInput;
    some?: Prisma.LiveScoreboardWhereInput;
    none?: Prisma.LiveScoreboardWhereInput;
};
export type LiveScoreboardOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LiveScoreboardCountOrderByAggregateInput = {
    matchId?: Prisma.SortOrder;
    teamAName?: Prisma.SortOrder;
    teamBName?: Prisma.SortOrder;
    pointsA?: Prisma.SortOrder;
    pointsB?: Prisma.SortOrder;
    currentSet?: Prisma.SortOrder;
    lastEventId?: Prisma.SortOrder;
};
export type LiveScoreboardAvgOrderByAggregateInput = {
    pointsA?: Prisma.SortOrder;
    pointsB?: Prisma.SortOrder;
    currentSet?: Prisma.SortOrder;
};
export type LiveScoreboardMaxOrderByAggregateInput = {
    matchId?: Prisma.SortOrder;
    teamAName?: Prisma.SortOrder;
    teamBName?: Prisma.SortOrder;
    pointsA?: Prisma.SortOrder;
    pointsB?: Prisma.SortOrder;
    currentSet?: Prisma.SortOrder;
    lastEventId?: Prisma.SortOrder;
};
export type LiveScoreboardMinOrderByAggregateInput = {
    matchId?: Prisma.SortOrder;
    teamAName?: Prisma.SortOrder;
    teamBName?: Prisma.SortOrder;
    pointsA?: Prisma.SortOrder;
    pointsB?: Prisma.SortOrder;
    currentSet?: Prisma.SortOrder;
    lastEventId?: Prisma.SortOrder;
};
export type LiveScoreboardSumOrderByAggregateInput = {
    pointsA?: Prisma.SortOrder;
    pointsB?: Prisma.SortOrder;
    currentSet?: Prisma.SortOrder;
};
export type LiveScoreboardCreateNestedOneWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutMatchInput, Prisma.LiveScoreboardUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.LiveScoreboardCreateOrConnectWithoutMatchInput;
    connect?: Prisma.LiveScoreboardWhereUniqueInput;
};
export type LiveScoreboardUncheckedCreateNestedOneWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutMatchInput, Prisma.LiveScoreboardUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.LiveScoreboardCreateOrConnectWithoutMatchInput;
    connect?: Prisma.LiveScoreboardWhereUniqueInput;
};
export type LiveScoreboardUpdateOneWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutMatchInput, Prisma.LiveScoreboardUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.LiveScoreboardCreateOrConnectWithoutMatchInput;
    upsert?: Prisma.LiveScoreboardUpsertWithoutMatchInput;
    disconnect?: Prisma.LiveScoreboardWhereInput | boolean;
    delete?: Prisma.LiveScoreboardWhereInput | boolean;
    connect?: Prisma.LiveScoreboardWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LiveScoreboardUpdateToOneWithWhereWithoutMatchInput, Prisma.LiveScoreboardUpdateWithoutMatchInput>, Prisma.LiveScoreboardUncheckedUpdateWithoutMatchInput>;
};
export type LiveScoreboardUncheckedUpdateOneWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutMatchInput, Prisma.LiveScoreboardUncheckedCreateWithoutMatchInput>;
    connectOrCreate?: Prisma.LiveScoreboardCreateOrConnectWithoutMatchInput;
    upsert?: Prisma.LiveScoreboardUpsertWithoutMatchInput;
    disconnect?: Prisma.LiveScoreboardWhereInput | boolean;
    delete?: Prisma.LiveScoreboardWhereInput | boolean;
    connect?: Prisma.LiveScoreboardWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LiveScoreboardUpdateToOneWithWhereWithoutMatchInput, Prisma.LiveScoreboardUpdateWithoutMatchInput>, Prisma.LiveScoreboardUncheckedUpdateWithoutMatchInput>;
};
export type LiveScoreboardCreateNestedManyWithoutLastEventInput = {
    create?: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutLastEventInput, Prisma.LiveScoreboardUncheckedCreateWithoutLastEventInput> | Prisma.LiveScoreboardCreateWithoutLastEventInput[] | Prisma.LiveScoreboardUncheckedCreateWithoutLastEventInput[];
    connectOrCreate?: Prisma.LiveScoreboardCreateOrConnectWithoutLastEventInput | Prisma.LiveScoreboardCreateOrConnectWithoutLastEventInput[];
    createMany?: Prisma.LiveScoreboardCreateManyLastEventInputEnvelope;
    connect?: Prisma.LiveScoreboardWhereUniqueInput | Prisma.LiveScoreboardWhereUniqueInput[];
};
export type LiveScoreboardUncheckedCreateNestedManyWithoutLastEventInput = {
    create?: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutLastEventInput, Prisma.LiveScoreboardUncheckedCreateWithoutLastEventInput> | Prisma.LiveScoreboardCreateWithoutLastEventInput[] | Prisma.LiveScoreboardUncheckedCreateWithoutLastEventInput[];
    connectOrCreate?: Prisma.LiveScoreboardCreateOrConnectWithoutLastEventInput | Prisma.LiveScoreboardCreateOrConnectWithoutLastEventInput[];
    createMany?: Prisma.LiveScoreboardCreateManyLastEventInputEnvelope;
    connect?: Prisma.LiveScoreboardWhereUniqueInput | Prisma.LiveScoreboardWhereUniqueInput[];
};
export type LiveScoreboardUpdateManyWithoutLastEventNestedInput = {
    create?: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutLastEventInput, Prisma.LiveScoreboardUncheckedCreateWithoutLastEventInput> | Prisma.LiveScoreboardCreateWithoutLastEventInput[] | Prisma.LiveScoreboardUncheckedCreateWithoutLastEventInput[];
    connectOrCreate?: Prisma.LiveScoreboardCreateOrConnectWithoutLastEventInput | Prisma.LiveScoreboardCreateOrConnectWithoutLastEventInput[];
    upsert?: Prisma.LiveScoreboardUpsertWithWhereUniqueWithoutLastEventInput | Prisma.LiveScoreboardUpsertWithWhereUniqueWithoutLastEventInput[];
    createMany?: Prisma.LiveScoreboardCreateManyLastEventInputEnvelope;
    set?: Prisma.LiveScoreboardWhereUniqueInput | Prisma.LiveScoreboardWhereUniqueInput[];
    disconnect?: Prisma.LiveScoreboardWhereUniqueInput | Prisma.LiveScoreboardWhereUniqueInput[];
    delete?: Prisma.LiveScoreboardWhereUniqueInput | Prisma.LiveScoreboardWhereUniqueInput[];
    connect?: Prisma.LiveScoreboardWhereUniqueInput | Prisma.LiveScoreboardWhereUniqueInput[];
    update?: Prisma.LiveScoreboardUpdateWithWhereUniqueWithoutLastEventInput | Prisma.LiveScoreboardUpdateWithWhereUniqueWithoutLastEventInput[];
    updateMany?: Prisma.LiveScoreboardUpdateManyWithWhereWithoutLastEventInput | Prisma.LiveScoreboardUpdateManyWithWhereWithoutLastEventInput[];
    deleteMany?: Prisma.LiveScoreboardScalarWhereInput | Prisma.LiveScoreboardScalarWhereInput[];
};
export type LiveScoreboardUncheckedUpdateManyWithoutLastEventNestedInput = {
    create?: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutLastEventInput, Prisma.LiveScoreboardUncheckedCreateWithoutLastEventInput> | Prisma.LiveScoreboardCreateWithoutLastEventInput[] | Prisma.LiveScoreboardUncheckedCreateWithoutLastEventInput[];
    connectOrCreate?: Prisma.LiveScoreboardCreateOrConnectWithoutLastEventInput | Prisma.LiveScoreboardCreateOrConnectWithoutLastEventInput[];
    upsert?: Prisma.LiveScoreboardUpsertWithWhereUniqueWithoutLastEventInput | Prisma.LiveScoreboardUpsertWithWhereUniqueWithoutLastEventInput[];
    createMany?: Prisma.LiveScoreboardCreateManyLastEventInputEnvelope;
    set?: Prisma.LiveScoreboardWhereUniqueInput | Prisma.LiveScoreboardWhereUniqueInput[];
    disconnect?: Prisma.LiveScoreboardWhereUniqueInput | Prisma.LiveScoreboardWhereUniqueInput[];
    delete?: Prisma.LiveScoreboardWhereUniqueInput | Prisma.LiveScoreboardWhereUniqueInput[];
    connect?: Prisma.LiveScoreboardWhereUniqueInput | Prisma.LiveScoreboardWhereUniqueInput[];
    update?: Prisma.LiveScoreboardUpdateWithWhereUniqueWithoutLastEventInput | Prisma.LiveScoreboardUpdateWithWhereUniqueWithoutLastEventInput[];
    updateMany?: Prisma.LiveScoreboardUpdateManyWithWhereWithoutLastEventInput | Prisma.LiveScoreboardUpdateManyWithWhereWithoutLastEventInput[];
    deleteMany?: Prisma.LiveScoreboardScalarWhereInput | Prisma.LiveScoreboardScalarWhereInput[];
};
export type LiveScoreboardCreateWithoutMatchInput = {
    teamAName?: string | null;
    teamBName?: string | null;
    pointsA?: number;
    pointsB?: number;
    currentSet?: number;
    lastEvent?: Prisma.EventCreateNestedOneWithoutScoreboardsAsLastEventInput;
};
export type LiveScoreboardUncheckedCreateWithoutMatchInput = {
    teamAName?: string | null;
    teamBName?: string | null;
    pointsA?: number;
    pointsB?: number;
    currentSet?: number;
    lastEventId?: string | null;
};
export type LiveScoreboardCreateOrConnectWithoutMatchInput = {
    where: Prisma.LiveScoreboardWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutMatchInput, Prisma.LiveScoreboardUncheckedCreateWithoutMatchInput>;
};
export type LiveScoreboardUpsertWithoutMatchInput = {
    update: Prisma.XOR<Prisma.LiveScoreboardUpdateWithoutMatchInput, Prisma.LiveScoreboardUncheckedUpdateWithoutMatchInput>;
    create: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutMatchInput, Prisma.LiveScoreboardUncheckedCreateWithoutMatchInput>;
    where?: Prisma.LiveScoreboardWhereInput;
};
export type LiveScoreboardUpdateToOneWithWhereWithoutMatchInput = {
    where?: Prisma.LiveScoreboardWhereInput;
    data: Prisma.XOR<Prisma.LiveScoreboardUpdateWithoutMatchInput, Prisma.LiveScoreboardUncheckedUpdateWithoutMatchInput>;
};
export type LiveScoreboardUpdateWithoutMatchInput = {
    teamAName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamBName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pointsA?: Prisma.IntFieldUpdateOperationsInput | number;
    pointsB?: Prisma.IntFieldUpdateOperationsInput | number;
    currentSet?: Prisma.IntFieldUpdateOperationsInput | number;
    lastEvent?: Prisma.EventUpdateOneWithoutScoreboardsAsLastEventNestedInput;
};
export type LiveScoreboardUncheckedUpdateWithoutMatchInput = {
    teamAName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamBName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pointsA?: Prisma.IntFieldUpdateOperationsInput | number;
    pointsB?: Prisma.IntFieldUpdateOperationsInput | number;
    currentSet?: Prisma.IntFieldUpdateOperationsInput | number;
    lastEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type LiveScoreboardCreateWithoutLastEventInput = {
    teamAName?: string | null;
    teamBName?: string | null;
    pointsA?: number;
    pointsB?: number;
    currentSet?: number;
    match: Prisma.MatchCreateNestedOneWithoutScoreboardInput;
};
export type LiveScoreboardUncheckedCreateWithoutLastEventInput = {
    matchId: string;
    teamAName?: string | null;
    teamBName?: string | null;
    pointsA?: number;
    pointsB?: number;
    currentSet?: number;
};
export type LiveScoreboardCreateOrConnectWithoutLastEventInput = {
    where: Prisma.LiveScoreboardWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutLastEventInput, Prisma.LiveScoreboardUncheckedCreateWithoutLastEventInput>;
};
export type LiveScoreboardCreateManyLastEventInputEnvelope = {
    data: Prisma.LiveScoreboardCreateManyLastEventInput | Prisma.LiveScoreboardCreateManyLastEventInput[];
    skipDuplicates?: boolean;
};
export type LiveScoreboardUpsertWithWhereUniqueWithoutLastEventInput = {
    where: Prisma.LiveScoreboardWhereUniqueInput;
    update: Prisma.XOR<Prisma.LiveScoreboardUpdateWithoutLastEventInput, Prisma.LiveScoreboardUncheckedUpdateWithoutLastEventInput>;
    create: Prisma.XOR<Prisma.LiveScoreboardCreateWithoutLastEventInput, Prisma.LiveScoreboardUncheckedCreateWithoutLastEventInput>;
};
export type LiveScoreboardUpdateWithWhereUniqueWithoutLastEventInput = {
    where: Prisma.LiveScoreboardWhereUniqueInput;
    data: Prisma.XOR<Prisma.LiveScoreboardUpdateWithoutLastEventInput, Prisma.LiveScoreboardUncheckedUpdateWithoutLastEventInput>;
};
export type LiveScoreboardUpdateManyWithWhereWithoutLastEventInput = {
    where: Prisma.LiveScoreboardScalarWhereInput;
    data: Prisma.XOR<Prisma.LiveScoreboardUpdateManyMutationInput, Prisma.LiveScoreboardUncheckedUpdateManyWithoutLastEventInput>;
};
export type LiveScoreboardScalarWhereInput = {
    AND?: Prisma.LiveScoreboardScalarWhereInput | Prisma.LiveScoreboardScalarWhereInput[];
    OR?: Prisma.LiveScoreboardScalarWhereInput[];
    NOT?: Prisma.LiveScoreboardScalarWhereInput | Prisma.LiveScoreboardScalarWhereInput[];
    matchId?: Prisma.UuidFilter<"LiveScoreboard"> | string;
    teamAName?: Prisma.StringNullableFilter<"LiveScoreboard"> | string | null;
    teamBName?: Prisma.StringNullableFilter<"LiveScoreboard"> | string | null;
    pointsA?: Prisma.IntFilter<"LiveScoreboard"> | number;
    pointsB?: Prisma.IntFilter<"LiveScoreboard"> | number;
    currentSet?: Prisma.IntFilter<"LiveScoreboard"> | number;
    lastEventId?: Prisma.UuidNullableFilter<"LiveScoreboard"> | string | null;
};
export type LiveScoreboardCreateManyLastEventInput = {
    matchId: string;
    teamAName?: string | null;
    teamBName?: string | null;
    pointsA?: number;
    pointsB?: number;
    currentSet?: number;
};
export type LiveScoreboardUpdateWithoutLastEventInput = {
    teamAName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamBName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pointsA?: Prisma.IntFieldUpdateOperationsInput | number;
    pointsB?: Prisma.IntFieldUpdateOperationsInput | number;
    currentSet?: Prisma.IntFieldUpdateOperationsInput | number;
    match?: Prisma.MatchUpdateOneRequiredWithoutScoreboardNestedInput;
};
export type LiveScoreboardUncheckedUpdateWithoutLastEventInput = {
    matchId?: Prisma.StringFieldUpdateOperationsInput | string;
    teamAName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamBName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pointsA?: Prisma.IntFieldUpdateOperationsInput | number;
    pointsB?: Prisma.IntFieldUpdateOperationsInput | number;
    currentSet?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type LiveScoreboardUncheckedUpdateManyWithoutLastEventInput = {
    matchId?: Prisma.StringFieldUpdateOperationsInput | string;
    teamAName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamBName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pointsA?: Prisma.IntFieldUpdateOperationsInput | number;
    pointsB?: Prisma.IntFieldUpdateOperationsInput | number;
    currentSet?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type LiveScoreboardSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    matchId?: boolean;
    teamAName?: boolean;
    teamBName?: boolean;
    pointsA?: boolean;
    pointsB?: boolean;
    currentSet?: boolean;
    lastEventId?: boolean;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    lastEvent?: boolean | Prisma.LiveScoreboard$lastEventArgs<ExtArgs>;
}, ExtArgs["result"]["liveScoreboard"]>;
export type LiveScoreboardSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    matchId?: boolean;
    teamAName?: boolean;
    teamBName?: boolean;
    pointsA?: boolean;
    pointsB?: boolean;
    currentSet?: boolean;
    lastEventId?: boolean;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    lastEvent?: boolean | Prisma.LiveScoreboard$lastEventArgs<ExtArgs>;
}, ExtArgs["result"]["liveScoreboard"]>;
export type LiveScoreboardSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    matchId?: boolean;
    teamAName?: boolean;
    teamBName?: boolean;
    pointsA?: boolean;
    pointsB?: boolean;
    currentSet?: boolean;
    lastEventId?: boolean;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    lastEvent?: boolean | Prisma.LiveScoreboard$lastEventArgs<ExtArgs>;
}, ExtArgs["result"]["liveScoreboard"]>;
export type LiveScoreboardSelectScalar = {
    matchId?: boolean;
    teamAName?: boolean;
    teamBName?: boolean;
    pointsA?: boolean;
    pointsB?: boolean;
    currentSet?: boolean;
    lastEventId?: boolean;
};
export type LiveScoreboardOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"matchId" | "teamAName" | "teamBName" | "pointsA" | "pointsB" | "currentSet" | "lastEventId", ExtArgs["result"]["liveScoreboard"]>;
export type LiveScoreboardInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    lastEvent?: boolean | Prisma.LiveScoreboard$lastEventArgs<ExtArgs>;
};
export type LiveScoreboardIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    lastEvent?: boolean | Prisma.LiveScoreboard$lastEventArgs<ExtArgs>;
};
export type LiveScoreboardIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    lastEvent?: boolean | Prisma.LiveScoreboard$lastEventArgs<ExtArgs>;
};
export type $LiveScoreboardPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LiveScoreboard";
    objects: {
        match: Prisma.$MatchPayload<ExtArgs>;
        lastEvent: Prisma.$EventPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        matchId: string;
        teamAName: string | null;
        teamBName: string | null;
        pointsA: number;
        pointsB: number;
        currentSet: number;
        lastEventId: string | null;
    }, ExtArgs["result"]["liveScoreboard"]>;
    composites: {};
};
export type LiveScoreboardGetPayload<S extends boolean | null | undefined | LiveScoreboardDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload, S>;
export type LiveScoreboardCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LiveScoreboardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LiveScoreboardCountAggregateInputType | true;
};
export interface LiveScoreboardDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LiveScoreboard'];
        meta: {
            name: 'LiveScoreboard';
        };
    };
    findUnique<T extends LiveScoreboardFindUniqueArgs>(args: Prisma.SelectSubset<T, LiveScoreboardFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LiveScoreboardClient<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LiveScoreboardFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LiveScoreboardFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveScoreboardClient<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LiveScoreboardFindFirstArgs>(args?: Prisma.SelectSubset<T, LiveScoreboardFindFirstArgs<ExtArgs>>): Prisma.Prisma__LiveScoreboardClient<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LiveScoreboardFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LiveScoreboardFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveScoreboardClient<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LiveScoreboardFindManyArgs>(args?: Prisma.SelectSubset<T, LiveScoreboardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LiveScoreboardCreateArgs>(args: Prisma.SelectSubset<T, LiveScoreboardCreateArgs<ExtArgs>>): Prisma.Prisma__LiveScoreboardClient<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LiveScoreboardCreateManyArgs>(args?: Prisma.SelectSubset<T, LiveScoreboardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LiveScoreboardCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LiveScoreboardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LiveScoreboardDeleteArgs>(args: Prisma.SelectSubset<T, LiveScoreboardDeleteArgs<ExtArgs>>): Prisma.Prisma__LiveScoreboardClient<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LiveScoreboardUpdateArgs>(args: Prisma.SelectSubset<T, LiveScoreboardUpdateArgs<ExtArgs>>): Prisma.Prisma__LiveScoreboardClient<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LiveScoreboardDeleteManyArgs>(args?: Prisma.SelectSubset<T, LiveScoreboardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LiveScoreboardUpdateManyArgs>(args: Prisma.SelectSubset<T, LiveScoreboardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LiveScoreboardUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LiveScoreboardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LiveScoreboardUpsertArgs>(args: Prisma.SelectSubset<T, LiveScoreboardUpsertArgs<ExtArgs>>): Prisma.Prisma__LiveScoreboardClient<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LiveScoreboardCountArgs>(args?: Prisma.Subset<T, LiveScoreboardCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LiveScoreboardCountAggregateOutputType> : number>;
    aggregate<T extends LiveScoreboardAggregateArgs>(args: Prisma.Subset<T, LiveScoreboardAggregateArgs>): Prisma.PrismaPromise<GetLiveScoreboardAggregateType<T>>;
    groupBy<T extends LiveScoreboardGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LiveScoreboardGroupByArgs['orderBy'];
    } : {
        orderBy?: LiveScoreboardGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LiveScoreboardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLiveScoreboardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LiveScoreboardFieldRefs;
}
export interface Prisma__LiveScoreboardClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    match<T extends Prisma.MatchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MatchDefaultArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    lastEvent<T extends Prisma.LiveScoreboard$lastEventArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LiveScoreboard$lastEventArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LiveScoreboardFieldRefs {
    readonly matchId: Prisma.FieldRef<"LiveScoreboard", 'String'>;
    readonly teamAName: Prisma.FieldRef<"LiveScoreboard", 'String'>;
    readonly teamBName: Prisma.FieldRef<"LiveScoreboard", 'String'>;
    readonly pointsA: Prisma.FieldRef<"LiveScoreboard", 'Int'>;
    readonly pointsB: Prisma.FieldRef<"LiveScoreboard", 'Int'>;
    readonly currentSet: Prisma.FieldRef<"LiveScoreboard", 'Int'>;
    readonly lastEventId: Prisma.FieldRef<"LiveScoreboard", 'String'>;
}
export type LiveScoreboardFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelect<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    include?: Prisma.LiveScoreboardInclude<ExtArgs> | null;
    where: Prisma.LiveScoreboardWhereUniqueInput;
};
export type LiveScoreboardFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelect<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    include?: Prisma.LiveScoreboardInclude<ExtArgs> | null;
    where: Prisma.LiveScoreboardWhereUniqueInput;
};
export type LiveScoreboardFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelect<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    include?: Prisma.LiveScoreboardInclude<ExtArgs> | null;
    where?: Prisma.LiveScoreboardWhereInput;
    orderBy?: Prisma.LiveScoreboardOrderByWithRelationInput | Prisma.LiveScoreboardOrderByWithRelationInput[];
    cursor?: Prisma.LiveScoreboardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LiveScoreboardScalarFieldEnum | Prisma.LiveScoreboardScalarFieldEnum[];
};
export type LiveScoreboardFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelect<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    include?: Prisma.LiveScoreboardInclude<ExtArgs> | null;
    where?: Prisma.LiveScoreboardWhereInput;
    orderBy?: Prisma.LiveScoreboardOrderByWithRelationInput | Prisma.LiveScoreboardOrderByWithRelationInput[];
    cursor?: Prisma.LiveScoreboardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LiveScoreboardScalarFieldEnum | Prisma.LiveScoreboardScalarFieldEnum[];
};
export type LiveScoreboardFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelect<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    include?: Prisma.LiveScoreboardInclude<ExtArgs> | null;
    where?: Prisma.LiveScoreboardWhereInput;
    orderBy?: Prisma.LiveScoreboardOrderByWithRelationInput | Prisma.LiveScoreboardOrderByWithRelationInput[];
    cursor?: Prisma.LiveScoreboardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LiveScoreboardScalarFieldEnum | Prisma.LiveScoreboardScalarFieldEnum[];
};
export type LiveScoreboardCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelect<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    include?: Prisma.LiveScoreboardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveScoreboardCreateInput, Prisma.LiveScoreboardUncheckedCreateInput>;
};
export type LiveScoreboardCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LiveScoreboardCreateManyInput | Prisma.LiveScoreboardCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LiveScoreboardCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    data: Prisma.LiveScoreboardCreateManyInput | Prisma.LiveScoreboardCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LiveScoreboardIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LiveScoreboardUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelect<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    include?: Prisma.LiveScoreboardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveScoreboardUpdateInput, Prisma.LiveScoreboardUncheckedUpdateInput>;
    where: Prisma.LiveScoreboardWhereUniqueInput;
};
export type LiveScoreboardUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LiveScoreboardUpdateManyMutationInput, Prisma.LiveScoreboardUncheckedUpdateManyInput>;
    where?: Prisma.LiveScoreboardWhereInput;
    limit?: number;
};
export type LiveScoreboardUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveScoreboardUpdateManyMutationInput, Prisma.LiveScoreboardUncheckedUpdateManyInput>;
    where?: Prisma.LiveScoreboardWhereInput;
    limit?: number;
    include?: Prisma.LiveScoreboardIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LiveScoreboardUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelect<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    include?: Prisma.LiveScoreboardInclude<ExtArgs> | null;
    where: Prisma.LiveScoreboardWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveScoreboardCreateInput, Prisma.LiveScoreboardUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LiveScoreboardUpdateInput, Prisma.LiveScoreboardUncheckedUpdateInput>;
};
export type LiveScoreboardDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelect<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    include?: Prisma.LiveScoreboardInclude<ExtArgs> | null;
    where: Prisma.LiveScoreboardWhereUniqueInput;
};
export type LiveScoreboardDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveScoreboardWhereInput;
    limit?: number;
};
export type LiveScoreboard$lastEventArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
};
export type LiveScoreboardDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelect<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    include?: Prisma.LiveScoreboardInclude<ExtArgs> | null;
};

import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MatchModel = runtime.Types.Result.DefaultSelection<Prisma.$MatchPayload>;
export type AggregateMatch = {
    _count: MatchCountAggregateOutputType | null;
    _min: MatchMinAggregateOutputType | null;
    _max: MatchMaxAggregateOutputType | null;
};
export type MatchMinAggregateOutputType = {
    id: string | null;
    fecha: Date | null;
    state: $Enums.MatchState | null;
    teamAId: string | null;
    teamBId: string | null;
};
export type MatchMaxAggregateOutputType = {
    id: string | null;
    fecha: Date | null;
    state: $Enums.MatchState | null;
    teamAId: string | null;
    teamBId: string | null;
};
export type MatchCountAggregateOutputType = {
    id: number;
    fecha: number;
    state: number;
    teamAId: number;
    teamBId: number;
    _all: number;
};
export type MatchMinAggregateInputType = {
    id?: true;
    fecha?: true;
    state?: true;
    teamAId?: true;
    teamBId?: true;
};
export type MatchMaxAggregateInputType = {
    id?: true;
    fecha?: true;
    state?: true;
    teamAId?: true;
    teamBId?: true;
};
export type MatchCountAggregateInputType = {
    id?: true;
    fecha?: true;
    state?: true;
    teamAId?: true;
    teamBId?: true;
    _all?: true;
};
export type MatchAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
    orderBy?: Prisma.MatchOrderByWithRelationInput | Prisma.MatchOrderByWithRelationInput[];
    cursor?: Prisma.MatchWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MatchCountAggregateInputType;
    _min?: MatchMinAggregateInputType;
    _max?: MatchMaxAggregateInputType;
};
export type GetMatchAggregateType<T extends MatchAggregateArgs> = {
    [P in keyof T & keyof AggregateMatch]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMatch[P]> : Prisma.GetScalarType<T[P], AggregateMatch[P]>;
};
export type MatchGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
    orderBy?: Prisma.MatchOrderByWithAggregationInput | Prisma.MatchOrderByWithAggregationInput[];
    by: Prisma.MatchScalarFieldEnum[] | Prisma.MatchScalarFieldEnum;
    having?: Prisma.MatchScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MatchCountAggregateInputType | true;
    _min?: MatchMinAggregateInputType;
    _max?: MatchMaxAggregateInputType;
};
export type MatchGroupByOutputType = {
    id: string;
    fecha: Date | null;
    state: $Enums.MatchState;
    teamAId: string;
    teamBId: string;
    _count: MatchCountAggregateOutputType | null;
    _min: MatchMinAggregateOutputType | null;
    _max: MatchMaxAggregateOutputType | null;
};
export type GetMatchGroupByPayload<T extends MatchGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MatchGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MatchGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MatchGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MatchGroupByOutputType[P]>;
}>>;
export type MatchWhereInput = {
    AND?: Prisma.MatchWhereInput | Prisma.MatchWhereInput[];
    OR?: Prisma.MatchWhereInput[];
    NOT?: Prisma.MatchWhereInput | Prisma.MatchWhereInput[];
    id?: Prisma.UuidFilter<"Match"> | string;
    fecha?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    state?: Prisma.EnumMatchStateFilter<"Match"> | $Enums.MatchState;
    teamAId?: Prisma.UuidFilter<"Match"> | string;
    teamBId?: Prisma.UuidFilter<"Match"> | string;
    teamA?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    teamB?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    sets?: Prisma.SetListRelationFilter;
    outbox?: Prisma.OutboxListRelationFilter;
    scoreboard?: Prisma.XOR<Prisma.LiveScoreboardNullableScalarRelationFilter, Prisma.LiveScoreboardWhereInput> | null;
    timeline?: Prisma.LiveTimelineListRelationFilter;
};
export type MatchOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    fecha?: Prisma.SortOrderInput | Prisma.SortOrder;
    state?: Prisma.SortOrder;
    teamAId?: Prisma.SortOrder;
    teamBId?: Prisma.SortOrder;
    teamA?: Prisma.TeamOrderByWithRelationInput;
    teamB?: Prisma.TeamOrderByWithRelationInput;
    sets?: Prisma.SetOrderByRelationAggregateInput;
    outbox?: Prisma.OutboxOrderByRelationAggregateInput;
    scoreboard?: Prisma.LiveScoreboardOrderByWithRelationInput;
    timeline?: Prisma.LiveTimelineOrderByRelationAggregateInput;
};
export type MatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MatchWhereInput | Prisma.MatchWhereInput[];
    OR?: Prisma.MatchWhereInput[];
    NOT?: Prisma.MatchWhereInput | Prisma.MatchWhereInput[];
    fecha?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    state?: Prisma.EnumMatchStateFilter<"Match"> | $Enums.MatchState;
    teamAId?: Prisma.UuidFilter<"Match"> | string;
    teamBId?: Prisma.UuidFilter<"Match"> | string;
    teamA?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    teamB?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    sets?: Prisma.SetListRelationFilter;
    outbox?: Prisma.OutboxListRelationFilter;
    scoreboard?: Prisma.XOR<Prisma.LiveScoreboardNullableScalarRelationFilter, Prisma.LiveScoreboardWhereInput> | null;
    timeline?: Prisma.LiveTimelineListRelationFilter;
}, "id">;
export type MatchOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    fecha?: Prisma.SortOrderInput | Prisma.SortOrder;
    state?: Prisma.SortOrder;
    teamAId?: Prisma.SortOrder;
    teamBId?: Prisma.SortOrder;
    _count?: Prisma.MatchCountOrderByAggregateInput;
    _max?: Prisma.MatchMaxOrderByAggregateInput;
    _min?: Prisma.MatchMinOrderByAggregateInput;
};
export type MatchScalarWhereWithAggregatesInput = {
    AND?: Prisma.MatchScalarWhereWithAggregatesInput | Prisma.MatchScalarWhereWithAggregatesInput[];
    OR?: Prisma.MatchScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MatchScalarWhereWithAggregatesInput | Prisma.MatchScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Match"> | string;
    fecha?: Prisma.DateTimeNullableWithAggregatesFilter<"Match"> | Date | string | null;
    state?: Prisma.EnumMatchStateWithAggregatesFilter<"Match"> | $Enums.MatchState;
    teamAId?: Prisma.UuidWithAggregatesFilter<"Match"> | string;
    teamBId?: Prisma.UuidWithAggregatesFilter<"Match"> | string;
};
export type MatchCreateInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamA: Prisma.TeamCreateNestedOneWithoutMatchesAsAInput;
    teamB: Prisma.TeamCreateNestedOneWithoutMatchesAsBInput;
    sets?: Prisma.SetCreateNestedManyWithoutMatchInput;
    outbox?: Prisma.OutboxCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardCreateNestedOneWithoutMatchInput;
    timeline?: Prisma.LiveTimelineCreateNestedManyWithoutMatchInput;
};
export type MatchUncheckedCreateInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamAId: string;
    teamBId: string;
    sets?: Prisma.SetUncheckedCreateNestedManyWithoutMatchInput;
    outbox?: Prisma.OutboxUncheckedCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedCreateNestedOneWithoutMatchInput;
    timeline?: Prisma.LiveTimelineUncheckedCreateNestedManyWithoutMatchInput;
};
export type MatchUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamA?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsANestedInput;
    teamB?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsBNestedInput;
    sets?: Prisma.SetUpdateManyWithoutMatchNestedInput;
    outbox?: Prisma.OutboxUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUpdateOneWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUpdateManyWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamAId?: Prisma.StringFieldUpdateOperationsInput | string;
    teamBId?: Prisma.StringFieldUpdateOperationsInput | string;
    sets?: Prisma.SetUncheckedUpdateManyWithoutMatchNestedInput;
    outbox?: Prisma.OutboxUncheckedUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedUpdateOneWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUncheckedUpdateManyWithoutMatchNestedInput;
};
export type MatchCreateManyInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamAId: string;
    teamBId: string;
};
export type MatchUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
};
export type MatchUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamAId?: Prisma.StringFieldUpdateOperationsInput | string;
    teamBId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MatchListRelationFilter = {
    every?: Prisma.MatchWhereInput;
    some?: Prisma.MatchWhereInput;
    none?: Prisma.MatchWhereInput;
};
export type MatchOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MatchCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fecha?: Prisma.SortOrder;
    state?: Prisma.SortOrder;
    teamAId?: Prisma.SortOrder;
    teamBId?: Prisma.SortOrder;
};
export type MatchMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fecha?: Prisma.SortOrder;
    state?: Prisma.SortOrder;
    teamAId?: Prisma.SortOrder;
    teamBId?: Prisma.SortOrder;
};
export type MatchMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fecha?: Prisma.SortOrder;
    state?: Prisma.SortOrder;
    teamAId?: Prisma.SortOrder;
    teamBId?: Prisma.SortOrder;
};
export type MatchScalarRelationFilter = {
    is?: Prisma.MatchWhereInput;
    isNot?: Prisma.MatchWhereInput;
};
export type MatchCreateNestedManyWithoutTeamAInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutTeamAInput, Prisma.MatchUncheckedCreateWithoutTeamAInput> | Prisma.MatchCreateWithoutTeamAInput[] | Prisma.MatchUncheckedCreateWithoutTeamAInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutTeamAInput | Prisma.MatchCreateOrConnectWithoutTeamAInput[];
    createMany?: Prisma.MatchCreateManyTeamAInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchCreateNestedManyWithoutTeamBInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutTeamBInput, Prisma.MatchUncheckedCreateWithoutTeamBInput> | Prisma.MatchCreateWithoutTeamBInput[] | Prisma.MatchUncheckedCreateWithoutTeamBInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutTeamBInput | Prisma.MatchCreateOrConnectWithoutTeamBInput[];
    createMany?: Prisma.MatchCreateManyTeamBInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUncheckedCreateNestedManyWithoutTeamAInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutTeamAInput, Prisma.MatchUncheckedCreateWithoutTeamAInput> | Prisma.MatchCreateWithoutTeamAInput[] | Prisma.MatchUncheckedCreateWithoutTeamAInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutTeamAInput | Prisma.MatchCreateOrConnectWithoutTeamAInput[];
    createMany?: Prisma.MatchCreateManyTeamAInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUncheckedCreateNestedManyWithoutTeamBInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutTeamBInput, Prisma.MatchUncheckedCreateWithoutTeamBInput> | Prisma.MatchCreateWithoutTeamBInput[] | Prisma.MatchUncheckedCreateWithoutTeamBInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutTeamBInput | Prisma.MatchCreateOrConnectWithoutTeamBInput[];
    createMany?: Prisma.MatchCreateManyTeamBInputEnvelope;
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
};
export type MatchUpdateManyWithoutTeamANestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutTeamAInput, Prisma.MatchUncheckedCreateWithoutTeamAInput> | Prisma.MatchCreateWithoutTeamAInput[] | Prisma.MatchUncheckedCreateWithoutTeamAInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutTeamAInput | Prisma.MatchCreateOrConnectWithoutTeamAInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutTeamAInput | Prisma.MatchUpsertWithWhereUniqueWithoutTeamAInput[];
    createMany?: Prisma.MatchCreateManyTeamAInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutTeamAInput | Prisma.MatchUpdateWithWhereUniqueWithoutTeamAInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutTeamAInput | Prisma.MatchUpdateManyWithWhereWithoutTeamAInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUpdateManyWithoutTeamBNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutTeamBInput, Prisma.MatchUncheckedCreateWithoutTeamBInput> | Prisma.MatchCreateWithoutTeamBInput[] | Prisma.MatchUncheckedCreateWithoutTeamBInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutTeamBInput | Prisma.MatchCreateOrConnectWithoutTeamBInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutTeamBInput | Prisma.MatchUpsertWithWhereUniqueWithoutTeamBInput[];
    createMany?: Prisma.MatchCreateManyTeamBInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutTeamBInput | Prisma.MatchUpdateWithWhereUniqueWithoutTeamBInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutTeamBInput | Prisma.MatchUpdateManyWithWhereWithoutTeamBInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUncheckedUpdateManyWithoutTeamANestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutTeamAInput, Prisma.MatchUncheckedCreateWithoutTeamAInput> | Prisma.MatchCreateWithoutTeamAInput[] | Prisma.MatchUncheckedCreateWithoutTeamAInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutTeamAInput | Prisma.MatchCreateOrConnectWithoutTeamAInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutTeamAInput | Prisma.MatchUpsertWithWhereUniqueWithoutTeamAInput[];
    createMany?: Prisma.MatchCreateManyTeamAInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutTeamAInput | Prisma.MatchUpdateWithWhereUniqueWithoutTeamAInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutTeamAInput | Prisma.MatchUpdateManyWithWhereWithoutTeamAInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type MatchUncheckedUpdateManyWithoutTeamBNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutTeamBInput, Prisma.MatchUncheckedCreateWithoutTeamBInput> | Prisma.MatchCreateWithoutTeamBInput[] | Prisma.MatchUncheckedCreateWithoutTeamBInput[];
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutTeamBInput | Prisma.MatchCreateOrConnectWithoutTeamBInput[];
    upsert?: Prisma.MatchUpsertWithWhereUniqueWithoutTeamBInput | Prisma.MatchUpsertWithWhereUniqueWithoutTeamBInput[];
    createMany?: Prisma.MatchCreateManyTeamBInputEnvelope;
    set?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    disconnect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    delete?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    connect?: Prisma.MatchWhereUniqueInput | Prisma.MatchWhereUniqueInput[];
    update?: Prisma.MatchUpdateWithWhereUniqueWithoutTeamBInput | Prisma.MatchUpdateWithWhereUniqueWithoutTeamBInput[];
    updateMany?: Prisma.MatchUpdateManyWithWhereWithoutTeamBInput | Prisma.MatchUpdateManyWithWhereWithoutTeamBInput[];
    deleteMany?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type EnumMatchStateFieldUpdateOperationsInput = {
    set?: $Enums.MatchState;
};
export type MatchCreateNestedOneWithoutSetsInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutSetsInput, Prisma.MatchUncheckedCreateWithoutSetsInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutSetsInput;
    connect?: Prisma.MatchWhereUniqueInput;
};
export type MatchUpdateOneRequiredWithoutSetsNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutSetsInput, Prisma.MatchUncheckedCreateWithoutSetsInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutSetsInput;
    upsert?: Prisma.MatchUpsertWithoutSetsInput;
    connect?: Prisma.MatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MatchUpdateToOneWithWhereWithoutSetsInput, Prisma.MatchUpdateWithoutSetsInput>, Prisma.MatchUncheckedUpdateWithoutSetsInput>;
};
export type MatchCreateNestedOneWithoutOutboxInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutOutboxInput, Prisma.MatchUncheckedCreateWithoutOutboxInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutOutboxInput;
    connect?: Prisma.MatchWhereUniqueInput;
};
export type MatchUpdateOneRequiredWithoutOutboxNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutOutboxInput, Prisma.MatchUncheckedCreateWithoutOutboxInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutOutboxInput;
    upsert?: Prisma.MatchUpsertWithoutOutboxInput;
    connect?: Prisma.MatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MatchUpdateToOneWithWhereWithoutOutboxInput, Prisma.MatchUpdateWithoutOutboxInput>, Prisma.MatchUncheckedUpdateWithoutOutboxInput>;
};
export type MatchCreateNestedOneWithoutScoreboardInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutScoreboardInput, Prisma.MatchUncheckedCreateWithoutScoreboardInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutScoreboardInput;
    connect?: Prisma.MatchWhereUniqueInput;
};
export type MatchUpdateOneRequiredWithoutScoreboardNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutScoreboardInput, Prisma.MatchUncheckedCreateWithoutScoreboardInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutScoreboardInput;
    upsert?: Prisma.MatchUpsertWithoutScoreboardInput;
    connect?: Prisma.MatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MatchUpdateToOneWithWhereWithoutScoreboardInput, Prisma.MatchUpdateWithoutScoreboardInput>, Prisma.MatchUncheckedUpdateWithoutScoreboardInput>;
};
export type MatchCreateNestedOneWithoutTimelineInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutTimelineInput, Prisma.MatchUncheckedCreateWithoutTimelineInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutTimelineInput;
    connect?: Prisma.MatchWhereUniqueInput;
};
export type MatchUpdateOneRequiredWithoutTimelineNestedInput = {
    create?: Prisma.XOR<Prisma.MatchCreateWithoutTimelineInput, Prisma.MatchUncheckedCreateWithoutTimelineInput>;
    connectOrCreate?: Prisma.MatchCreateOrConnectWithoutTimelineInput;
    upsert?: Prisma.MatchUpsertWithoutTimelineInput;
    connect?: Prisma.MatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MatchUpdateToOneWithWhereWithoutTimelineInput, Prisma.MatchUpdateWithoutTimelineInput>, Prisma.MatchUncheckedUpdateWithoutTimelineInput>;
};
export type MatchCreateWithoutTeamAInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamB: Prisma.TeamCreateNestedOneWithoutMatchesAsBInput;
    sets?: Prisma.SetCreateNestedManyWithoutMatchInput;
    outbox?: Prisma.OutboxCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardCreateNestedOneWithoutMatchInput;
    timeline?: Prisma.LiveTimelineCreateNestedManyWithoutMatchInput;
};
export type MatchUncheckedCreateWithoutTeamAInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamBId: string;
    sets?: Prisma.SetUncheckedCreateNestedManyWithoutMatchInput;
    outbox?: Prisma.OutboxUncheckedCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedCreateNestedOneWithoutMatchInput;
    timeline?: Prisma.LiveTimelineUncheckedCreateNestedManyWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutTeamAInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutTeamAInput, Prisma.MatchUncheckedCreateWithoutTeamAInput>;
};
export type MatchCreateManyTeamAInputEnvelope = {
    data: Prisma.MatchCreateManyTeamAInput | Prisma.MatchCreateManyTeamAInput[];
    skipDuplicates?: boolean;
};
export type MatchCreateWithoutTeamBInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamA: Prisma.TeamCreateNestedOneWithoutMatchesAsAInput;
    sets?: Prisma.SetCreateNestedManyWithoutMatchInput;
    outbox?: Prisma.OutboxCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardCreateNestedOneWithoutMatchInput;
    timeline?: Prisma.LiveTimelineCreateNestedManyWithoutMatchInput;
};
export type MatchUncheckedCreateWithoutTeamBInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamAId: string;
    sets?: Prisma.SetUncheckedCreateNestedManyWithoutMatchInput;
    outbox?: Prisma.OutboxUncheckedCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedCreateNestedOneWithoutMatchInput;
    timeline?: Prisma.LiveTimelineUncheckedCreateNestedManyWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutTeamBInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutTeamBInput, Prisma.MatchUncheckedCreateWithoutTeamBInput>;
};
export type MatchCreateManyTeamBInputEnvelope = {
    data: Prisma.MatchCreateManyTeamBInput | Prisma.MatchCreateManyTeamBInput[];
    skipDuplicates?: boolean;
};
export type MatchUpsertWithWhereUniqueWithoutTeamAInput = {
    where: Prisma.MatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchUpdateWithoutTeamAInput, Prisma.MatchUncheckedUpdateWithoutTeamAInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutTeamAInput, Prisma.MatchUncheckedCreateWithoutTeamAInput>;
};
export type MatchUpdateWithWhereUniqueWithoutTeamAInput = {
    where: Prisma.MatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutTeamAInput, Prisma.MatchUncheckedUpdateWithoutTeamAInput>;
};
export type MatchUpdateManyWithWhereWithoutTeamAInput = {
    where: Prisma.MatchScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyWithoutTeamAInput>;
};
export type MatchScalarWhereInput = {
    AND?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
    OR?: Prisma.MatchScalarWhereInput[];
    NOT?: Prisma.MatchScalarWhereInput | Prisma.MatchScalarWhereInput[];
    id?: Prisma.UuidFilter<"Match"> | string;
    fecha?: Prisma.DateTimeNullableFilter<"Match"> | Date | string | null;
    state?: Prisma.EnumMatchStateFilter<"Match"> | $Enums.MatchState;
    teamAId?: Prisma.UuidFilter<"Match"> | string;
    teamBId?: Prisma.UuidFilter<"Match"> | string;
};
export type MatchUpsertWithWhereUniqueWithoutTeamBInput = {
    where: Prisma.MatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.MatchUpdateWithoutTeamBInput, Prisma.MatchUncheckedUpdateWithoutTeamBInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutTeamBInput, Prisma.MatchUncheckedCreateWithoutTeamBInput>;
};
export type MatchUpdateWithWhereUniqueWithoutTeamBInput = {
    where: Prisma.MatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutTeamBInput, Prisma.MatchUncheckedUpdateWithoutTeamBInput>;
};
export type MatchUpdateManyWithWhereWithoutTeamBInput = {
    where: Prisma.MatchScalarWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyWithoutTeamBInput>;
};
export type MatchCreateWithoutSetsInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamA: Prisma.TeamCreateNestedOneWithoutMatchesAsAInput;
    teamB: Prisma.TeamCreateNestedOneWithoutMatchesAsBInput;
    outbox?: Prisma.OutboxCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardCreateNestedOneWithoutMatchInput;
    timeline?: Prisma.LiveTimelineCreateNestedManyWithoutMatchInput;
};
export type MatchUncheckedCreateWithoutSetsInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamAId: string;
    teamBId: string;
    outbox?: Prisma.OutboxUncheckedCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedCreateNestedOneWithoutMatchInput;
    timeline?: Prisma.LiveTimelineUncheckedCreateNestedManyWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutSetsInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutSetsInput, Prisma.MatchUncheckedCreateWithoutSetsInput>;
};
export type MatchUpsertWithoutSetsInput = {
    update: Prisma.XOR<Prisma.MatchUpdateWithoutSetsInput, Prisma.MatchUncheckedUpdateWithoutSetsInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutSetsInput, Prisma.MatchUncheckedCreateWithoutSetsInput>;
    where?: Prisma.MatchWhereInput;
};
export type MatchUpdateToOneWithWhereWithoutSetsInput = {
    where?: Prisma.MatchWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutSetsInput, Prisma.MatchUncheckedUpdateWithoutSetsInput>;
};
export type MatchUpdateWithoutSetsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamA?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsANestedInput;
    teamB?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsBNestedInput;
    outbox?: Prisma.OutboxUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUpdateOneWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUpdateManyWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateWithoutSetsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamAId?: Prisma.StringFieldUpdateOperationsInput | string;
    teamBId?: Prisma.StringFieldUpdateOperationsInput | string;
    outbox?: Prisma.OutboxUncheckedUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedUpdateOneWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUncheckedUpdateManyWithoutMatchNestedInput;
};
export type MatchCreateWithoutOutboxInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamA: Prisma.TeamCreateNestedOneWithoutMatchesAsAInput;
    teamB: Prisma.TeamCreateNestedOneWithoutMatchesAsBInput;
    sets?: Prisma.SetCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardCreateNestedOneWithoutMatchInput;
    timeline?: Prisma.LiveTimelineCreateNestedManyWithoutMatchInput;
};
export type MatchUncheckedCreateWithoutOutboxInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamAId: string;
    teamBId: string;
    sets?: Prisma.SetUncheckedCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedCreateNestedOneWithoutMatchInput;
    timeline?: Prisma.LiveTimelineUncheckedCreateNestedManyWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutOutboxInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutOutboxInput, Prisma.MatchUncheckedCreateWithoutOutboxInput>;
};
export type MatchUpsertWithoutOutboxInput = {
    update: Prisma.XOR<Prisma.MatchUpdateWithoutOutboxInput, Prisma.MatchUncheckedUpdateWithoutOutboxInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutOutboxInput, Prisma.MatchUncheckedCreateWithoutOutboxInput>;
    where?: Prisma.MatchWhereInput;
};
export type MatchUpdateToOneWithWhereWithoutOutboxInput = {
    where?: Prisma.MatchWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutOutboxInput, Prisma.MatchUncheckedUpdateWithoutOutboxInput>;
};
export type MatchUpdateWithoutOutboxInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamA?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsANestedInput;
    teamB?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsBNestedInput;
    sets?: Prisma.SetUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUpdateOneWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUpdateManyWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateWithoutOutboxInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamAId?: Prisma.StringFieldUpdateOperationsInput | string;
    teamBId?: Prisma.StringFieldUpdateOperationsInput | string;
    sets?: Prisma.SetUncheckedUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedUpdateOneWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUncheckedUpdateManyWithoutMatchNestedInput;
};
export type MatchCreateWithoutScoreboardInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamA: Prisma.TeamCreateNestedOneWithoutMatchesAsAInput;
    teamB: Prisma.TeamCreateNestedOneWithoutMatchesAsBInput;
    sets?: Prisma.SetCreateNestedManyWithoutMatchInput;
    outbox?: Prisma.OutboxCreateNestedManyWithoutMatchInput;
    timeline?: Prisma.LiveTimelineCreateNestedManyWithoutMatchInput;
};
export type MatchUncheckedCreateWithoutScoreboardInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamAId: string;
    teamBId: string;
    sets?: Prisma.SetUncheckedCreateNestedManyWithoutMatchInput;
    outbox?: Prisma.OutboxUncheckedCreateNestedManyWithoutMatchInput;
    timeline?: Prisma.LiveTimelineUncheckedCreateNestedManyWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutScoreboardInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutScoreboardInput, Prisma.MatchUncheckedCreateWithoutScoreboardInput>;
};
export type MatchUpsertWithoutScoreboardInput = {
    update: Prisma.XOR<Prisma.MatchUpdateWithoutScoreboardInput, Prisma.MatchUncheckedUpdateWithoutScoreboardInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutScoreboardInput, Prisma.MatchUncheckedCreateWithoutScoreboardInput>;
    where?: Prisma.MatchWhereInput;
};
export type MatchUpdateToOneWithWhereWithoutScoreboardInput = {
    where?: Prisma.MatchWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutScoreboardInput, Prisma.MatchUncheckedUpdateWithoutScoreboardInput>;
};
export type MatchUpdateWithoutScoreboardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamA?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsANestedInput;
    teamB?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsBNestedInput;
    sets?: Prisma.SetUpdateManyWithoutMatchNestedInput;
    outbox?: Prisma.OutboxUpdateManyWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUpdateManyWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateWithoutScoreboardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamAId?: Prisma.StringFieldUpdateOperationsInput | string;
    teamBId?: Prisma.StringFieldUpdateOperationsInput | string;
    sets?: Prisma.SetUncheckedUpdateManyWithoutMatchNestedInput;
    outbox?: Prisma.OutboxUncheckedUpdateManyWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUncheckedUpdateManyWithoutMatchNestedInput;
};
export type MatchCreateWithoutTimelineInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamA: Prisma.TeamCreateNestedOneWithoutMatchesAsAInput;
    teamB: Prisma.TeamCreateNestedOneWithoutMatchesAsBInput;
    sets?: Prisma.SetCreateNestedManyWithoutMatchInput;
    outbox?: Prisma.OutboxCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardCreateNestedOneWithoutMatchInput;
};
export type MatchUncheckedCreateWithoutTimelineInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamAId: string;
    teamBId: string;
    sets?: Prisma.SetUncheckedCreateNestedManyWithoutMatchInput;
    outbox?: Prisma.OutboxUncheckedCreateNestedManyWithoutMatchInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedCreateNestedOneWithoutMatchInput;
};
export type MatchCreateOrConnectWithoutTimelineInput = {
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateWithoutTimelineInput, Prisma.MatchUncheckedCreateWithoutTimelineInput>;
};
export type MatchUpsertWithoutTimelineInput = {
    update: Prisma.XOR<Prisma.MatchUpdateWithoutTimelineInput, Prisma.MatchUncheckedUpdateWithoutTimelineInput>;
    create: Prisma.XOR<Prisma.MatchCreateWithoutTimelineInput, Prisma.MatchUncheckedCreateWithoutTimelineInput>;
    where?: Prisma.MatchWhereInput;
};
export type MatchUpdateToOneWithWhereWithoutTimelineInput = {
    where?: Prisma.MatchWhereInput;
    data: Prisma.XOR<Prisma.MatchUpdateWithoutTimelineInput, Prisma.MatchUncheckedUpdateWithoutTimelineInput>;
};
export type MatchUpdateWithoutTimelineInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamA?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsANestedInput;
    teamB?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsBNestedInput;
    sets?: Prisma.SetUpdateManyWithoutMatchNestedInput;
    outbox?: Prisma.OutboxUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUpdateOneWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateWithoutTimelineInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamAId?: Prisma.StringFieldUpdateOperationsInput | string;
    teamBId?: Prisma.StringFieldUpdateOperationsInput | string;
    sets?: Prisma.SetUncheckedUpdateManyWithoutMatchNestedInput;
    outbox?: Prisma.OutboxUncheckedUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedUpdateOneWithoutMatchNestedInput;
};
export type MatchCreateManyTeamAInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamBId: string;
};
export type MatchCreateManyTeamBInput = {
    id?: string;
    fecha?: Date | string | null;
    state?: $Enums.MatchState;
    teamAId: string;
};
export type MatchUpdateWithoutTeamAInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamB?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsBNestedInput;
    sets?: Prisma.SetUpdateManyWithoutMatchNestedInput;
    outbox?: Prisma.OutboxUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUpdateOneWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUpdateManyWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateWithoutTeamAInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamBId?: Prisma.StringFieldUpdateOperationsInput | string;
    sets?: Prisma.SetUncheckedUpdateManyWithoutMatchNestedInput;
    outbox?: Prisma.OutboxUncheckedUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedUpdateOneWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUncheckedUpdateManyWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateManyWithoutTeamAInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamBId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MatchUpdateWithoutTeamBInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamA?: Prisma.TeamUpdateOneRequiredWithoutMatchesAsANestedInput;
    sets?: Prisma.SetUpdateManyWithoutMatchNestedInput;
    outbox?: Prisma.OutboxUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUpdateOneWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUpdateManyWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateWithoutTeamBInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamAId?: Prisma.StringFieldUpdateOperationsInput | string;
    sets?: Prisma.SetUncheckedUpdateManyWithoutMatchNestedInput;
    outbox?: Prisma.OutboxUncheckedUpdateManyWithoutMatchNestedInput;
    scoreboard?: Prisma.LiveScoreboardUncheckedUpdateOneWithoutMatchNestedInput;
    timeline?: Prisma.LiveTimelineUncheckedUpdateManyWithoutMatchNestedInput;
};
export type MatchUncheckedUpdateManyWithoutTeamBInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fecha?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    state?: Prisma.EnumMatchStateFieldUpdateOperationsInput | $Enums.MatchState;
    teamAId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MatchCountOutputType = {
    sets: number;
    outbox: number;
    timeline: number;
};
export type MatchCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sets?: boolean | MatchCountOutputTypeCountSetsArgs;
    outbox?: boolean | MatchCountOutputTypeCountOutboxArgs;
    timeline?: boolean | MatchCountOutputTypeCountTimelineArgs;
};
export type MatchCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchCountOutputTypeSelect<ExtArgs> | null;
};
export type MatchCountOutputTypeCountSetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SetWhereInput;
};
export type MatchCountOutputTypeCountOutboxArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OutboxWhereInput;
};
export type MatchCountOutputTypeCountTimelineArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveTimelineWhereInput;
};
export type MatchSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fecha?: boolean;
    state?: boolean;
    teamAId?: boolean;
    teamBId?: boolean;
    teamA?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    teamB?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    sets?: boolean | Prisma.Match$setsArgs<ExtArgs>;
    outbox?: boolean | Prisma.Match$outboxArgs<ExtArgs>;
    scoreboard?: boolean | Prisma.Match$scoreboardArgs<ExtArgs>;
    timeline?: boolean | Prisma.Match$timelineArgs<ExtArgs>;
    _count?: boolean | Prisma.MatchCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["match"]>;
export type MatchSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fecha?: boolean;
    state?: boolean;
    teamAId?: boolean;
    teamBId?: boolean;
    teamA?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    teamB?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["match"]>;
export type MatchSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fecha?: boolean;
    state?: boolean;
    teamAId?: boolean;
    teamBId?: boolean;
    teamA?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    teamB?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["match"]>;
export type MatchSelectScalar = {
    id?: boolean;
    fecha?: boolean;
    state?: boolean;
    teamAId?: boolean;
    teamBId?: boolean;
};
export type MatchOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "fecha" | "state" | "teamAId" | "teamBId", ExtArgs["result"]["match"]>;
export type MatchInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    teamA?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    teamB?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    sets?: boolean | Prisma.Match$setsArgs<ExtArgs>;
    outbox?: boolean | Prisma.Match$outboxArgs<ExtArgs>;
    scoreboard?: boolean | Prisma.Match$scoreboardArgs<ExtArgs>;
    timeline?: boolean | Prisma.Match$timelineArgs<ExtArgs>;
    _count?: boolean | Prisma.MatchCountOutputTypeDefaultArgs<ExtArgs>;
};
export type MatchIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    teamA?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    teamB?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
};
export type MatchIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    teamA?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    teamB?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
};
export type $MatchPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Match";
    objects: {
        teamA: Prisma.$TeamPayload<ExtArgs>;
        teamB: Prisma.$TeamPayload<ExtArgs>;
        sets: Prisma.$SetPayload<ExtArgs>[];
        outbox: Prisma.$OutboxPayload<ExtArgs>[];
        scoreboard: Prisma.$LiveScoreboardPayload<ExtArgs> | null;
        timeline: Prisma.$LiveTimelinePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        fecha: Date | null;
        state: $Enums.MatchState;
        teamAId: string;
        teamBId: string;
    }, ExtArgs["result"]["match"]>;
    composites: {};
};
export type MatchGetPayload<S extends boolean | null | undefined | MatchDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MatchPayload, S>;
export type MatchCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MatchCountAggregateInputType | true;
};
export interface MatchDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Match'];
        meta: {
            name: 'Match';
        };
    };
    findUnique<T extends MatchFindUniqueArgs>(args: Prisma.SelectSubset<T, MatchFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MatchFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MatchFindFirstArgs>(args?: Prisma.SelectSubset<T, MatchFindFirstArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MatchFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MatchFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MatchFindManyArgs>(args?: Prisma.SelectSubset<T, MatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MatchCreateArgs>(args: Prisma.SelectSubset<T, MatchCreateArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MatchCreateManyArgs>(args?: Prisma.SelectSubset<T, MatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MatchCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MatchDeleteArgs>(args: Prisma.SelectSubset<T, MatchDeleteArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MatchUpdateArgs>(args: Prisma.SelectSubset<T, MatchUpdateArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MatchDeleteManyArgs>(args?: Prisma.SelectSubset<T, MatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MatchUpdateManyArgs>(args: Prisma.SelectSubset<T, MatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MatchUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MatchUpsertArgs>(args: Prisma.SelectSubset<T, MatchUpsertArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MatchCountArgs>(args?: Prisma.Subset<T, MatchCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MatchCountAggregateOutputType> : number>;
    aggregate<T extends MatchAggregateArgs>(args: Prisma.Subset<T, MatchAggregateArgs>): Prisma.PrismaPromise<GetMatchAggregateType<T>>;
    groupBy<T extends MatchGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MatchGroupByArgs['orderBy'];
    } : {
        orderBy?: MatchGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MatchFieldRefs;
}
export interface Prisma__MatchClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    teamA<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    teamB<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    sets<T extends Prisma.Match$setsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$setsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    outbox<T extends Prisma.Match$outboxArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$outboxArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OutboxPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    scoreboard<T extends Prisma.Match$scoreboardArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$scoreboardArgs<ExtArgs>>): Prisma.Prisma__LiveScoreboardClient<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    timeline<T extends Prisma.Match$timelineArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Match$timelineArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MatchFieldRefs {
    readonly id: Prisma.FieldRef<"Match", 'String'>;
    readonly fecha: Prisma.FieldRef<"Match", 'DateTime'>;
    readonly state: Prisma.FieldRef<"Match", 'MatchState'>;
    readonly teamAId: Prisma.FieldRef<"Match", 'String'>;
    readonly teamBId: Prisma.FieldRef<"Match", 'String'>;
}
export type MatchFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchSelect<ExtArgs> | null;
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    include?: Prisma.MatchInclude<ExtArgs> | null;
    where: Prisma.MatchWhereUniqueInput;
};
export type MatchFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchSelect<ExtArgs> | null;
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    include?: Prisma.MatchInclude<ExtArgs> | null;
    where: Prisma.MatchWhereUniqueInput;
};
export type MatchFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MatchFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MatchFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MatchCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchSelect<ExtArgs> | null;
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    include?: Prisma.MatchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MatchCreateInput, Prisma.MatchUncheckedCreateInput>;
};
export type MatchCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MatchCreateManyInput | Prisma.MatchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MatchCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    data: Prisma.MatchCreateManyInput | Prisma.MatchCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MatchIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MatchUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchSelect<ExtArgs> | null;
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    include?: Prisma.MatchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MatchUpdateInput, Prisma.MatchUncheckedUpdateInput>;
    where: Prisma.MatchWhereUniqueInput;
};
export type MatchUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyInput>;
    where?: Prisma.MatchWhereInput;
    limit?: number;
};
export type MatchUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MatchUpdateManyMutationInput, Prisma.MatchUncheckedUpdateManyInput>;
    where?: Prisma.MatchWhereInput;
    limit?: number;
    include?: Prisma.MatchIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MatchUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchSelect<ExtArgs> | null;
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    include?: Prisma.MatchInclude<ExtArgs> | null;
    where: Prisma.MatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.MatchCreateInput, Prisma.MatchUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MatchUpdateInput, Prisma.MatchUncheckedUpdateInput>;
};
export type MatchDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchSelect<ExtArgs> | null;
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    include?: Prisma.MatchInclude<ExtArgs> | null;
    where: Prisma.MatchWhereUniqueInput;
};
export type MatchDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MatchWhereInput;
    limit?: number;
};
export type Match$setsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SetSelect<ExtArgs> | null;
    omit?: Prisma.SetOmit<ExtArgs> | null;
    include?: Prisma.SetInclude<ExtArgs> | null;
    where?: Prisma.SetWhereInput;
    orderBy?: Prisma.SetOrderByWithRelationInput | Prisma.SetOrderByWithRelationInput[];
    cursor?: Prisma.SetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SetScalarFieldEnum | Prisma.SetScalarFieldEnum[];
};
export type Match$outboxArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OutboxSelect<ExtArgs> | null;
    omit?: Prisma.OutboxOmit<ExtArgs> | null;
    include?: Prisma.OutboxInclude<ExtArgs> | null;
    where?: Prisma.OutboxWhereInput;
    orderBy?: Prisma.OutboxOrderByWithRelationInput | Prisma.OutboxOrderByWithRelationInput[];
    cursor?: Prisma.OutboxWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OutboxScalarFieldEnum | Prisma.OutboxScalarFieldEnum[];
};
export type Match$scoreboardArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveScoreboardSelect<ExtArgs> | null;
    omit?: Prisma.LiveScoreboardOmit<ExtArgs> | null;
    include?: Prisma.LiveScoreboardInclude<ExtArgs> | null;
    where?: Prisma.LiveScoreboardWhereInput;
};
export type Match$timelineArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveTimelineSelect<ExtArgs> | null;
    omit?: Prisma.LiveTimelineOmit<ExtArgs> | null;
    include?: Prisma.LiveTimelineInclude<ExtArgs> | null;
    where?: Prisma.LiveTimelineWhereInput;
    orderBy?: Prisma.LiveTimelineOrderByWithRelationInput | Prisma.LiveTimelineOrderByWithRelationInput[];
    cursor?: Prisma.LiveTimelineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LiveTimelineScalarFieldEnum | Prisma.LiveTimelineScalarFieldEnum[];
};
export type MatchDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MatchSelect<ExtArgs> | null;
    omit?: Prisma.MatchOmit<ExtArgs> | null;
    include?: Prisma.MatchInclude<ExtArgs> | null;
};

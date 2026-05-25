import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type LiveTimelineModel = runtime.Types.Result.DefaultSelection<Prisma.$LiveTimelinePayload>;
export type AggregateLiveTimeline = {
    _count: LiveTimelineCountAggregateOutputType | null;
    _min: LiveTimelineMinAggregateOutputType | null;
    _max: LiveTimelineMaxAggregateOutputType | null;
};
export type LiveTimelineMinAggregateOutputType = {
    eventId: string | null;
    matchId: string | null;
    description: string | null;
    timestamp: Date | null;
    type: string | null;
};
export type LiveTimelineMaxAggregateOutputType = {
    eventId: string | null;
    matchId: string | null;
    description: string | null;
    timestamp: Date | null;
    type: string | null;
};
export type LiveTimelineCountAggregateOutputType = {
    eventId: number;
    matchId: number;
    description: number;
    scoreSnapshot: number;
    timestamp: number;
    type: number;
    _all: number;
};
export type LiveTimelineMinAggregateInputType = {
    eventId?: true;
    matchId?: true;
    description?: true;
    timestamp?: true;
    type?: true;
};
export type LiveTimelineMaxAggregateInputType = {
    eventId?: true;
    matchId?: true;
    description?: true;
    timestamp?: true;
    type?: true;
};
export type LiveTimelineCountAggregateInputType = {
    eventId?: true;
    matchId?: true;
    description?: true;
    scoreSnapshot?: true;
    timestamp?: true;
    type?: true;
    _all?: true;
};
export type LiveTimelineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveTimelineWhereInput;
    orderBy?: Prisma.LiveTimelineOrderByWithRelationInput | Prisma.LiveTimelineOrderByWithRelationInput[];
    cursor?: Prisma.LiveTimelineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LiveTimelineCountAggregateInputType;
    _min?: LiveTimelineMinAggregateInputType;
    _max?: LiveTimelineMaxAggregateInputType;
};
export type GetLiveTimelineAggregateType<T extends LiveTimelineAggregateArgs> = {
    [P in keyof T & keyof AggregateLiveTimeline]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLiveTimeline[P]> : Prisma.GetScalarType<T[P], AggregateLiveTimeline[P]>;
};
export type LiveTimelineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveTimelineWhereInput;
    orderBy?: Prisma.LiveTimelineOrderByWithAggregationInput | Prisma.LiveTimelineOrderByWithAggregationInput[];
    by: Prisma.LiveTimelineScalarFieldEnum[] | Prisma.LiveTimelineScalarFieldEnum;
    having?: Prisma.LiveTimelineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LiveTimelineCountAggregateInputType | true;
    _min?: LiveTimelineMinAggregateInputType;
    _max?: LiveTimelineMaxAggregateInputType;
};
export type LiveTimelineGroupByOutputType = {
    eventId: string;
    matchId: string;
    description: string | null;
    scoreSnapshot: runtime.JsonValue | null;
    timestamp: Date;
    type: string;
    _count: LiveTimelineCountAggregateOutputType | null;
    _min: LiveTimelineMinAggregateOutputType | null;
    _max: LiveTimelineMaxAggregateOutputType | null;
};
export type GetLiveTimelineGroupByPayload<T extends LiveTimelineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LiveTimelineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LiveTimelineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LiveTimelineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LiveTimelineGroupByOutputType[P]>;
}>>;
export type LiveTimelineWhereInput = {
    AND?: Prisma.LiveTimelineWhereInput | Prisma.LiveTimelineWhereInput[];
    OR?: Prisma.LiveTimelineWhereInput[];
    NOT?: Prisma.LiveTimelineWhereInput | Prisma.LiveTimelineWhereInput[];
    eventId?: Prisma.UuidFilter<"LiveTimeline"> | string;
    matchId?: Prisma.UuidFilter<"LiveTimeline"> | string;
    description?: Prisma.StringNullableFilter<"LiveTimeline"> | string | null;
    scoreSnapshot?: Prisma.JsonNullableFilter<"LiveTimeline">;
    timestamp?: Prisma.DateTimeFilter<"LiveTimeline"> | Date | string;
    type?: Prisma.StringFilter<"LiveTimeline"> | string;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
};
export type LiveTimelineOrderByWithRelationInput = {
    eventId?: Prisma.SortOrder;
    matchId?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    scoreSnapshot?: Prisma.SortOrderInput | Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    event?: Prisma.EventOrderByWithRelationInput;
    match?: Prisma.MatchOrderByWithRelationInput;
};
export type LiveTimelineWhereUniqueInput = Prisma.AtLeast<{
    eventId?: string;
    AND?: Prisma.LiveTimelineWhereInput | Prisma.LiveTimelineWhereInput[];
    OR?: Prisma.LiveTimelineWhereInput[];
    NOT?: Prisma.LiveTimelineWhereInput | Prisma.LiveTimelineWhereInput[];
    matchId?: Prisma.UuidFilter<"LiveTimeline"> | string;
    description?: Prisma.StringNullableFilter<"LiveTimeline"> | string | null;
    scoreSnapshot?: Prisma.JsonNullableFilter<"LiveTimeline">;
    timestamp?: Prisma.DateTimeFilter<"LiveTimeline"> | Date | string;
    type?: Prisma.StringFilter<"LiveTimeline"> | string;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
}, "eventId">;
export type LiveTimelineOrderByWithAggregationInput = {
    eventId?: Prisma.SortOrder;
    matchId?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    scoreSnapshot?: Prisma.SortOrderInput | Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    _count?: Prisma.LiveTimelineCountOrderByAggregateInput;
    _max?: Prisma.LiveTimelineMaxOrderByAggregateInput;
    _min?: Prisma.LiveTimelineMinOrderByAggregateInput;
};
export type LiveTimelineScalarWhereWithAggregatesInput = {
    AND?: Prisma.LiveTimelineScalarWhereWithAggregatesInput | Prisma.LiveTimelineScalarWhereWithAggregatesInput[];
    OR?: Prisma.LiveTimelineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LiveTimelineScalarWhereWithAggregatesInput | Prisma.LiveTimelineScalarWhereWithAggregatesInput[];
    eventId?: Prisma.UuidWithAggregatesFilter<"LiveTimeline"> | string;
    matchId?: Prisma.UuidWithAggregatesFilter<"LiveTimeline"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"LiveTimeline"> | string | null;
    scoreSnapshot?: Prisma.JsonNullableWithAggregatesFilter<"LiveTimeline">;
    timestamp?: Prisma.DateTimeWithAggregatesFilter<"LiveTimeline"> | Date | string;
    type?: Prisma.StringWithAggregatesFilter<"LiveTimeline"> | string;
};
export type LiveTimelineCreateInput = {
    description?: string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Date | string;
    type: string;
    event: Prisma.EventCreateNestedOneWithoutTimelineInput;
    match: Prisma.MatchCreateNestedOneWithoutTimelineInput;
};
export type LiveTimelineUncheckedCreateInput = {
    eventId: string;
    matchId: string;
    description?: string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Date | string;
    type: string;
};
export type LiveTimelineUpdateInput = {
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    event?: Prisma.EventUpdateOneRequiredWithoutTimelineNestedInput;
    match?: Prisma.MatchUpdateOneRequiredWithoutTimelineNestedInput;
};
export type LiveTimelineUncheckedUpdateInput = {
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    matchId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LiveTimelineCreateManyInput = {
    eventId: string;
    matchId: string;
    description?: string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Date | string;
    type: string;
};
export type LiveTimelineUpdateManyMutationInput = {
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LiveTimelineUncheckedUpdateManyInput = {
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    matchId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LiveTimelineListRelationFilter = {
    every?: Prisma.LiveTimelineWhereInput;
    some?: Prisma.LiveTimelineWhereInput;
    none?: Prisma.LiveTimelineWhereInput;
};
export type LiveTimelineOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LiveTimelineCountOrderByAggregateInput = {
    eventId?: Prisma.SortOrder;
    matchId?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    scoreSnapshot?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
};
export type LiveTimelineMaxOrderByAggregateInput = {
    eventId?: Prisma.SortOrder;
    matchId?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
};
export type LiveTimelineMinOrderByAggregateInput = {
    eventId?: Prisma.SortOrder;
    matchId?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
};
export type LiveTimelineCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.LiveTimelineCreateWithoutMatchInput, Prisma.LiveTimelineUncheckedCreateWithoutMatchInput> | Prisma.LiveTimelineCreateWithoutMatchInput[] | Prisma.LiveTimelineUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.LiveTimelineCreateOrConnectWithoutMatchInput | Prisma.LiveTimelineCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.LiveTimelineCreateManyMatchInputEnvelope;
    connect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
};
export type LiveTimelineUncheckedCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.LiveTimelineCreateWithoutMatchInput, Prisma.LiveTimelineUncheckedCreateWithoutMatchInput> | Prisma.LiveTimelineCreateWithoutMatchInput[] | Prisma.LiveTimelineUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.LiveTimelineCreateOrConnectWithoutMatchInput | Prisma.LiveTimelineCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.LiveTimelineCreateManyMatchInputEnvelope;
    connect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
};
export type LiveTimelineUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.LiveTimelineCreateWithoutMatchInput, Prisma.LiveTimelineUncheckedCreateWithoutMatchInput> | Prisma.LiveTimelineCreateWithoutMatchInput[] | Prisma.LiveTimelineUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.LiveTimelineCreateOrConnectWithoutMatchInput | Prisma.LiveTimelineCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.LiveTimelineUpsertWithWhereUniqueWithoutMatchInput | Prisma.LiveTimelineUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.LiveTimelineCreateManyMatchInputEnvelope;
    set?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    disconnect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    delete?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    connect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    update?: Prisma.LiveTimelineUpdateWithWhereUniqueWithoutMatchInput | Prisma.LiveTimelineUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.LiveTimelineUpdateManyWithWhereWithoutMatchInput | Prisma.LiveTimelineUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.LiveTimelineScalarWhereInput | Prisma.LiveTimelineScalarWhereInput[];
};
export type LiveTimelineUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.LiveTimelineCreateWithoutMatchInput, Prisma.LiveTimelineUncheckedCreateWithoutMatchInput> | Prisma.LiveTimelineCreateWithoutMatchInput[] | Prisma.LiveTimelineUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.LiveTimelineCreateOrConnectWithoutMatchInput | Prisma.LiveTimelineCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.LiveTimelineUpsertWithWhereUniqueWithoutMatchInput | Prisma.LiveTimelineUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.LiveTimelineCreateManyMatchInputEnvelope;
    set?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    disconnect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    delete?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    connect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    update?: Prisma.LiveTimelineUpdateWithWhereUniqueWithoutMatchInput | Prisma.LiveTimelineUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.LiveTimelineUpdateManyWithWhereWithoutMatchInput | Prisma.LiveTimelineUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.LiveTimelineScalarWhereInput | Prisma.LiveTimelineScalarWhereInput[];
};
export type LiveTimelineCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.LiveTimelineCreateWithoutEventInput, Prisma.LiveTimelineUncheckedCreateWithoutEventInput> | Prisma.LiveTimelineCreateWithoutEventInput[] | Prisma.LiveTimelineUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.LiveTimelineCreateOrConnectWithoutEventInput | Prisma.LiveTimelineCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.LiveTimelineCreateManyEventInputEnvelope;
    connect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
};
export type LiveTimelineUncheckedCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.LiveTimelineCreateWithoutEventInput, Prisma.LiveTimelineUncheckedCreateWithoutEventInput> | Prisma.LiveTimelineCreateWithoutEventInput[] | Prisma.LiveTimelineUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.LiveTimelineCreateOrConnectWithoutEventInput | Prisma.LiveTimelineCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.LiveTimelineCreateManyEventInputEnvelope;
    connect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
};
export type LiveTimelineUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.LiveTimelineCreateWithoutEventInput, Prisma.LiveTimelineUncheckedCreateWithoutEventInput> | Prisma.LiveTimelineCreateWithoutEventInput[] | Prisma.LiveTimelineUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.LiveTimelineCreateOrConnectWithoutEventInput | Prisma.LiveTimelineCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.LiveTimelineUpsertWithWhereUniqueWithoutEventInput | Prisma.LiveTimelineUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.LiveTimelineCreateManyEventInputEnvelope;
    set?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    disconnect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    delete?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    connect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    update?: Prisma.LiveTimelineUpdateWithWhereUniqueWithoutEventInput | Prisma.LiveTimelineUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.LiveTimelineUpdateManyWithWhereWithoutEventInput | Prisma.LiveTimelineUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.LiveTimelineScalarWhereInput | Prisma.LiveTimelineScalarWhereInput[];
};
export type LiveTimelineUncheckedUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.LiveTimelineCreateWithoutEventInput, Prisma.LiveTimelineUncheckedCreateWithoutEventInput> | Prisma.LiveTimelineCreateWithoutEventInput[] | Prisma.LiveTimelineUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.LiveTimelineCreateOrConnectWithoutEventInput | Prisma.LiveTimelineCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.LiveTimelineUpsertWithWhereUniqueWithoutEventInput | Prisma.LiveTimelineUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.LiveTimelineCreateManyEventInputEnvelope;
    set?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    disconnect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    delete?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    connect?: Prisma.LiveTimelineWhereUniqueInput | Prisma.LiveTimelineWhereUniqueInput[];
    update?: Prisma.LiveTimelineUpdateWithWhereUniqueWithoutEventInput | Prisma.LiveTimelineUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.LiveTimelineUpdateManyWithWhereWithoutEventInput | Prisma.LiveTimelineUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.LiveTimelineScalarWhereInput | Prisma.LiveTimelineScalarWhereInput[];
};
export type LiveTimelineCreateWithoutMatchInput = {
    description?: string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Date | string;
    type: string;
    event: Prisma.EventCreateNestedOneWithoutTimelineInput;
};
export type LiveTimelineUncheckedCreateWithoutMatchInput = {
    eventId: string;
    description?: string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Date | string;
    type: string;
};
export type LiveTimelineCreateOrConnectWithoutMatchInput = {
    where: Prisma.LiveTimelineWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveTimelineCreateWithoutMatchInput, Prisma.LiveTimelineUncheckedCreateWithoutMatchInput>;
};
export type LiveTimelineCreateManyMatchInputEnvelope = {
    data: Prisma.LiveTimelineCreateManyMatchInput | Prisma.LiveTimelineCreateManyMatchInput[];
    skipDuplicates?: boolean;
};
export type LiveTimelineUpsertWithWhereUniqueWithoutMatchInput = {
    where: Prisma.LiveTimelineWhereUniqueInput;
    update: Prisma.XOR<Prisma.LiveTimelineUpdateWithoutMatchInput, Prisma.LiveTimelineUncheckedUpdateWithoutMatchInput>;
    create: Prisma.XOR<Prisma.LiveTimelineCreateWithoutMatchInput, Prisma.LiveTimelineUncheckedCreateWithoutMatchInput>;
};
export type LiveTimelineUpdateWithWhereUniqueWithoutMatchInput = {
    where: Prisma.LiveTimelineWhereUniqueInput;
    data: Prisma.XOR<Prisma.LiveTimelineUpdateWithoutMatchInput, Prisma.LiveTimelineUncheckedUpdateWithoutMatchInput>;
};
export type LiveTimelineUpdateManyWithWhereWithoutMatchInput = {
    where: Prisma.LiveTimelineScalarWhereInput;
    data: Prisma.XOR<Prisma.LiveTimelineUpdateManyMutationInput, Prisma.LiveTimelineUncheckedUpdateManyWithoutMatchInput>;
};
export type LiveTimelineScalarWhereInput = {
    AND?: Prisma.LiveTimelineScalarWhereInput | Prisma.LiveTimelineScalarWhereInput[];
    OR?: Prisma.LiveTimelineScalarWhereInput[];
    NOT?: Prisma.LiveTimelineScalarWhereInput | Prisma.LiveTimelineScalarWhereInput[];
    eventId?: Prisma.UuidFilter<"LiveTimeline"> | string;
    matchId?: Prisma.UuidFilter<"LiveTimeline"> | string;
    description?: Prisma.StringNullableFilter<"LiveTimeline"> | string | null;
    scoreSnapshot?: Prisma.JsonNullableFilter<"LiveTimeline">;
    timestamp?: Prisma.DateTimeFilter<"LiveTimeline"> | Date | string;
    type?: Prisma.StringFilter<"LiveTimeline"> | string;
};
export type LiveTimelineCreateWithoutEventInput = {
    description?: string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Date | string;
    type: string;
    match: Prisma.MatchCreateNestedOneWithoutTimelineInput;
};
export type LiveTimelineUncheckedCreateWithoutEventInput = {
    matchId: string;
    description?: string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Date | string;
    type: string;
};
export type LiveTimelineCreateOrConnectWithoutEventInput = {
    where: Prisma.LiveTimelineWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveTimelineCreateWithoutEventInput, Prisma.LiveTimelineUncheckedCreateWithoutEventInput>;
};
export type LiveTimelineCreateManyEventInputEnvelope = {
    data: Prisma.LiveTimelineCreateManyEventInput | Prisma.LiveTimelineCreateManyEventInput[];
    skipDuplicates?: boolean;
};
export type LiveTimelineUpsertWithWhereUniqueWithoutEventInput = {
    where: Prisma.LiveTimelineWhereUniqueInput;
    update: Prisma.XOR<Prisma.LiveTimelineUpdateWithoutEventInput, Prisma.LiveTimelineUncheckedUpdateWithoutEventInput>;
    create: Prisma.XOR<Prisma.LiveTimelineCreateWithoutEventInput, Prisma.LiveTimelineUncheckedCreateWithoutEventInput>;
};
export type LiveTimelineUpdateWithWhereUniqueWithoutEventInput = {
    where: Prisma.LiveTimelineWhereUniqueInput;
    data: Prisma.XOR<Prisma.LiveTimelineUpdateWithoutEventInput, Prisma.LiveTimelineUncheckedUpdateWithoutEventInput>;
};
export type LiveTimelineUpdateManyWithWhereWithoutEventInput = {
    where: Prisma.LiveTimelineScalarWhereInput;
    data: Prisma.XOR<Prisma.LiveTimelineUpdateManyMutationInput, Prisma.LiveTimelineUncheckedUpdateManyWithoutEventInput>;
};
export type LiveTimelineCreateManyMatchInput = {
    eventId: string;
    description?: string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Date | string;
    type: string;
};
export type LiveTimelineUpdateWithoutMatchInput = {
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    event?: Prisma.EventUpdateOneRequiredWithoutTimelineNestedInput;
};
export type LiveTimelineUncheckedUpdateWithoutMatchInput = {
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LiveTimelineUncheckedUpdateManyWithoutMatchInput = {
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LiveTimelineCreateManyEventInput = {
    matchId: string;
    description?: string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Date | string;
    type: string;
};
export type LiveTimelineUpdateWithoutEventInput = {
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    match?: Prisma.MatchUpdateOneRequiredWithoutTimelineNestedInput;
};
export type LiveTimelineUncheckedUpdateWithoutEventInput = {
    matchId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LiveTimelineUncheckedUpdateManyWithoutEventInput = {
    matchId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scoreSnapshot?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LiveTimelineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    eventId?: boolean;
    matchId?: boolean;
    description?: boolean;
    scoreSnapshot?: boolean;
    timestamp?: boolean;
    type?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveTimeline"]>;
export type LiveTimelineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    eventId?: boolean;
    matchId?: boolean;
    description?: boolean;
    scoreSnapshot?: boolean;
    timestamp?: boolean;
    type?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveTimeline"]>;
export type LiveTimelineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    eventId?: boolean;
    matchId?: boolean;
    description?: boolean;
    scoreSnapshot?: boolean;
    timestamp?: boolean;
    type?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["liveTimeline"]>;
export type LiveTimelineSelectScalar = {
    eventId?: boolean;
    matchId?: boolean;
    description?: boolean;
    scoreSnapshot?: boolean;
    timestamp?: boolean;
    type?: boolean;
};
export type LiveTimelineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"eventId" | "matchId" | "description" | "scoreSnapshot" | "timestamp" | "type", ExtArgs["result"]["liveTimeline"]>;
export type LiveTimelineInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
};
export type LiveTimelineIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
};
export type LiveTimelineIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
};
export type $LiveTimelinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LiveTimeline";
    objects: {
        event: Prisma.$EventPayload<ExtArgs>;
        match: Prisma.$MatchPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        eventId: string;
        matchId: string;
        description: string | null;
        scoreSnapshot: runtime.JsonValue | null;
        timestamp: Date;
        type: string;
    }, ExtArgs["result"]["liveTimeline"]>;
    composites: {};
};
export type LiveTimelineGetPayload<S extends boolean | null | undefined | LiveTimelineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload, S>;
export type LiveTimelineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LiveTimelineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LiveTimelineCountAggregateInputType | true;
};
export interface LiveTimelineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LiveTimeline'];
        meta: {
            name: 'LiveTimeline';
        };
    };
    findUnique<T extends LiveTimelineFindUniqueArgs>(args: Prisma.SelectSubset<T, LiveTimelineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LiveTimelineClient<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LiveTimelineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LiveTimelineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveTimelineClient<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LiveTimelineFindFirstArgs>(args?: Prisma.SelectSubset<T, LiveTimelineFindFirstArgs<ExtArgs>>): Prisma.Prisma__LiveTimelineClient<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LiveTimelineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LiveTimelineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LiveTimelineClient<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LiveTimelineFindManyArgs>(args?: Prisma.SelectSubset<T, LiveTimelineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LiveTimelineCreateArgs>(args: Prisma.SelectSubset<T, LiveTimelineCreateArgs<ExtArgs>>): Prisma.Prisma__LiveTimelineClient<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LiveTimelineCreateManyArgs>(args?: Prisma.SelectSubset<T, LiveTimelineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LiveTimelineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LiveTimelineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LiveTimelineDeleteArgs>(args: Prisma.SelectSubset<T, LiveTimelineDeleteArgs<ExtArgs>>): Prisma.Prisma__LiveTimelineClient<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LiveTimelineUpdateArgs>(args: Prisma.SelectSubset<T, LiveTimelineUpdateArgs<ExtArgs>>): Prisma.Prisma__LiveTimelineClient<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LiveTimelineDeleteManyArgs>(args?: Prisma.SelectSubset<T, LiveTimelineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LiveTimelineUpdateManyArgs>(args: Prisma.SelectSubset<T, LiveTimelineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LiveTimelineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LiveTimelineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LiveTimelineUpsertArgs>(args: Prisma.SelectSubset<T, LiveTimelineUpsertArgs<ExtArgs>>): Prisma.Prisma__LiveTimelineClient<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LiveTimelineCountArgs>(args?: Prisma.Subset<T, LiveTimelineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LiveTimelineCountAggregateOutputType> : number>;
    aggregate<T extends LiveTimelineAggregateArgs>(args: Prisma.Subset<T, LiveTimelineAggregateArgs>): Prisma.PrismaPromise<GetLiveTimelineAggregateType<T>>;
    groupBy<T extends LiveTimelineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LiveTimelineGroupByArgs['orderBy'];
    } : {
        orderBy?: LiveTimelineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LiveTimelineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLiveTimelineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LiveTimelineFieldRefs;
}
export interface Prisma__LiveTimelineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    event<T extends Prisma.EventDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventDefaultArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    match<T extends Prisma.MatchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MatchDefaultArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LiveTimelineFieldRefs {
    readonly eventId: Prisma.FieldRef<"LiveTimeline", 'String'>;
    readonly matchId: Prisma.FieldRef<"LiveTimeline", 'String'>;
    readonly description: Prisma.FieldRef<"LiveTimeline", 'String'>;
    readonly scoreSnapshot: Prisma.FieldRef<"LiveTimeline", 'Json'>;
    readonly timestamp: Prisma.FieldRef<"LiveTimeline", 'DateTime'>;
    readonly type: Prisma.FieldRef<"LiveTimeline", 'String'>;
}
export type LiveTimelineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveTimelineSelect<ExtArgs> | null;
    omit?: Prisma.LiveTimelineOmit<ExtArgs> | null;
    include?: Prisma.LiveTimelineInclude<ExtArgs> | null;
    where: Prisma.LiveTimelineWhereUniqueInput;
};
export type LiveTimelineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveTimelineSelect<ExtArgs> | null;
    omit?: Prisma.LiveTimelineOmit<ExtArgs> | null;
    include?: Prisma.LiveTimelineInclude<ExtArgs> | null;
    where: Prisma.LiveTimelineWhereUniqueInput;
};
export type LiveTimelineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveTimelineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveTimelineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LiveTimelineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveTimelineSelect<ExtArgs> | null;
    omit?: Prisma.LiveTimelineOmit<ExtArgs> | null;
    include?: Prisma.LiveTimelineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveTimelineCreateInput, Prisma.LiveTimelineUncheckedCreateInput>;
};
export type LiveTimelineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LiveTimelineCreateManyInput | Prisma.LiveTimelineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LiveTimelineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveTimelineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveTimelineOmit<ExtArgs> | null;
    data: Prisma.LiveTimelineCreateManyInput | Prisma.LiveTimelineCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LiveTimelineIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LiveTimelineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveTimelineSelect<ExtArgs> | null;
    omit?: Prisma.LiveTimelineOmit<ExtArgs> | null;
    include?: Prisma.LiveTimelineInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveTimelineUpdateInput, Prisma.LiveTimelineUncheckedUpdateInput>;
    where: Prisma.LiveTimelineWhereUniqueInput;
};
export type LiveTimelineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LiveTimelineUpdateManyMutationInput, Prisma.LiveTimelineUncheckedUpdateManyInput>;
    where?: Prisma.LiveTimelineWhereInput;
    limit?: number;
};
export type LiveTimelineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveTimelineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LiveTimelineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LiveTimelineUpdateManyMutationInput, Prisma.LiveTimelineUncheckedUpdateManyInput>;
    where?: Prisma.LiveTimelineWhereInput;
    limit?: number;
    include?: Prisma.LiveTimelineIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LiveTimelineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveTimelineSelect<ExtArgs> | null;
    omit?: Prisma.LiveTimelineOmit<ExtArgs> | null;
    include?: Prisma.LiveTimelineInclude<ExtArgs> | null;
    where: Prisma.LiveTimelineWhereUniqueInput;
    create: Prisma.XOR<Prisma.LiveTimelineCreateInput, Prisma.LiveTimelineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LiveTimelineUpdateInput, Prisma.LiveTimelineUncheckedUpdateInput>;
};
export type LiveTimelineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveTimelineSelect<ExtArgs> | null;
    omit?: Prisma.LiveTimelineOmit<ExtArgs> | null;
    include?: Prisma.LiveTimelineInclude<ExtArgs> | null;
    where: Prisma.LiveTimelineWhereUniqueInput;
};
export type LiveTimelineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveTimelineWhereInput;
    limit?: number;
};
export type LiveTimelineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LiveTimelineSelect<ExtArgs> | null;
    omit?: Prisma.LiveTimelineOmit<ExtArgs> | null;
    include?: Prisma.LiveTimelineInclude<ExtArgs> | null;
};

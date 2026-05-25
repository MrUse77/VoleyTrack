import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EventModel = runtime.Types.Result.DefaultSelection<Prisma.$EventPayload>;
export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null;
    _avg: EventAvgAggregateOutputType | null;
    _sum: EventSumAggregateOutputType | null;
    _min: EventMinAggregateOutputType | null;
    _max: EventMaxAggregateOutputType | null;
};
export type EventAvgAggregateOutputType = {
    nPoint: number | null;
};
export type EventSumAggregateOutputType = {
    nPoint: number | null;
};
export type EventMinAggregateOutputType = {
    id: string | null;
    setId: string | null;
    type: $Enums.EventType | null;
    nPoint: number | null;
    createdAt: Date | null;
};
export type EventMaxAggregateOutputType = {
    id: string | null;
    setId: string | null;
    type: $Enums.EventType | null;
    nPoint: number | null;
    createdAt: Date | null;
};
export type EventCountAggregateOutputType = {
    id: number;
    setId: number;
    type: number;
    nPoint: number;
    createdAt: number;
    _all: number;
};
export type EventAvgAggregateInputType = {
    nPoint?: true;
};
export type EventSumAggregateInputType = {
    nPoint?: true;
};
export type EventMinAggregateInputType = {
    id?: true;
    setId?: true;
    type?: true;
    nPoint?: true;
    createdAt?: true;
};
export type EventMaxAggregateInputType = {
    id?: true;
    setId?: true;
    type?: true;
    nPoint?: true;
    createdAt?: true;
};
export type EventCountAggregateInputType = {
    id?: true;
    setId?: true;
    type?: true;
    nPoint?: true;
    createdAt?: true;
    _all?: true;
};
export type EventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EventCountAggregateInputType;
    _avg?: EventAvgAggregateInputType;
    _sum?: EventSumAggregateInputType;
    _min?: EventMinAggregateInputType;
    _max?: EventMaxAggregateInputType;
};
export type GetEventAggregateType<T extends EventAggregateArgs> = {
    [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEvent[P]> : Prisma.GetScalarType<T[P], AggregateEvent[P]>;
};
export type EventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithAggregationInput | Prisma.EventOrderByWithAggregationInput[];
    by: Prisma.EventScalarFieldEnum[] | Prisma.EventScalarFieldEnum;
    having?: Prisma.EventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventCountAggregateInputType | true;
    _avg?: EventAvgAggregateInputType;
    _sum?: EventSumAggregateInputType;
    _min?: EventMinAggregateInputType;
    _max?: EventMaxAggregateInputType;
};
export type EventGroupByOutputType = {
    id: string;
    setId: string;
    type: $Enums.EventType;
    nPoint: number | null;
    createdAt: Date;
    _count: EventCountAggregateOutputType | null;
    _avg: EventAvgAggregateOutputType | null;
    _sum: EventSumAggregateOutputType | null;
    _min: EventMinAggregateOutputType | null;
    _max: EventMaxAggregateOutputType | null;
};
export type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EventGroupByOutputType[P]>;
}>>;
export type EventWhereInput = {
    AND?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    OR?: Prisma.EventWhereInput[];
    NOT?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    id?: Prisma.UuidFilter<"Event"> | string;
    setId?: Prisma.UuidFilter<"Event"> | string;
    type?: Prisma.EnumEventTypeFilter<"Event"> | $Enums.EventType;
    nPoint?: Prisma.IntNullableFilter<"Event"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    set?: Prisma.XOR<Prisma.SetScalarRelationFilter, Prisma.SetWhereInput>;
    substitution?: Prisma.XOR<Prisma.SubstitutionNullableScalarRelationFilter, Prisma.SubstitutionWhereInput> | null;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardListRelationFilter;
    timeline?: Prisma.LiveTimelineListRelationFilter;
};
export type EventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    setId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    nPoint?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    set?: Prisma.SetOrderByWithRelationInput;
    substitution?: Prisma.SubstitutionOrderByWithRelationInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardOrderByRelationAggregateInput;
    timeline?: Prisma.LiveTimelineOrderByRelationAggregateInput;
};
export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    OR?: Prisma.EventWhereInput[];
    NOT?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    setId?: Prisma.UuidFilter<"Event"> | string;
    type?: Prisma.EnumEventTypeFilter<"Event"> | $Enums.EventType;
    nPoint?: Prisma.IntNullableFilter<"Event"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    set?: Prisma.XOR<Prisma.SetScalarRelationFilter, Prisma.SetWhereInput>;
    substitution?: Prisma.XOR<Prisma.SubstitutionNullableScalarRelationFilter, Prisma.SubstitutionWhereInput> | null;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardListRelationFilter;
    timeline?: Prisma.LiveTimelineListRelationFilter;
}, "id">;
export type EventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    setId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    nPoint?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.EventCountOrderByAggregateInput;
    _avg?: Prisma.EventAvgOrderByAggregateInput;
    _max?: Prisma.EventMaxOrderByAggregateInput;
    _min?: Prisma.EventMinOrderByAggregateInput;
    _sum?: Prisma.EventSumOrderByAggregateInput;
};
export type EventScalarWhereWithAggregatesInput = {
    AND?: Prisma.EventScalarWhereWithAggregatesInput | Prisma.EventScalarWhereWithAggregatesInput[];
    OR?: Prisma.EventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EventScalarWhereWithAggregatesInput | Prisma.EventScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Event"> | string;
    setId?: Prisma.UuidWithAggregatesFilter<"Event"> | string;
    type?: Prisma.EnumEventTypeWithAggregatesFilter<"Event"> | $Enums.EventType;
    nPoint?: Prisma.IntNullableWithAggregatesFilter<"Event"> | number | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Event"> | Date | string;
};
export type EventCreateInput = {
    id?: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
    set: Prisma.SetCreateNestedOneWithoutEventsInput;
    substitution?: Prisma.SubstitutionCreateNestedOneWithoutEventInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardCreateNestedManyWithoutLastEventInput;
    timeline?: Prisma.LiveTimelineCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateInput = {
    id?: string;
    setId: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
    substitution?: Prisma.SubstitutionUncheckedCreateNestedOneWithoutEventInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUncheckedCreateNestedManyWithoutLastEventInput;
    timeline?: Prisma.LiveTimelineUncheckedCreateNestedManyWithoutEventInput;
};
export type EventUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    set?: Prisma.SetUpdateOneRequiredWithoutEventsNestedInput;
    substitution?: Prisma.SubstitutionUpdateOneWithoutEventNestedInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUpdateManyWithoutLastEventNestedInput;
    timeline?: Prisma.LiveTimelineUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    setId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    substitution?: Prisma.SubstitutionUncheckedUpdateOneWithoutEventNestedInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUncheckedUpdateManyWithoutLastEventNestedInput;
    timeline?: Prisma.LiveTimelineUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventCreateManyInput = {
    id?: string;
    setId: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
};
export type EventUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    setId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventListRelationFilter = {
    every?: Prisma.EventWhereInput;
    some?: Prisma.EventWhereInput;
    none?: Prisma.EventWhereInput;
};
export type EventOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    setId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    nPoint?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventAvgOrderByAggregateInput = {
    nPoint?: Prisma.SortOrder;
};
export type EventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    setId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    nPoint?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    setId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    nPoint?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventSumOrderByAggregateInput = {
    nPoint?: Prisma.SortOrder;
};
export type EventScalarRelationFilter = {
    is?: Prisma.EventWhereInput;
    isNot?: Prisma.EventWhereInput;
};
export type EventNullableScalarRelationFilter = {
    is?: Prisma.EventWhereInput | null;
    isNot?: Prisma.EventWhereInput | null;
};
export type EventCreateNestedManyWithoutSetInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutSetInput, Prisma.EventUncheckedCreateWithoutSetInput> | Prisma.EventCreateWithoutSetInput[] | Prisma.EventUncheckedCreateWithoutSetInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutSetInput | Prisma.EventCreateOrConnectWithoutSetInput[];
    createMany?: Prisma.EventCreateManySetInputEnvelope;
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
};
export type EventUncheckedCreateNestedManyWithoutSetInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutSetInput, Prisma.EventUncheckedCreateWithoutSetInput> | Prisma.EventCreateWithoutSetInput[] | Prisma.EventUncheckedCreateWithoutSetInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutSetInput | Prisma.EventCreateOrConnectWithoutSetInput[];
    createMany?: Prisma.EventCreateManySetInputEnvelope;
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
};
export type EventUpdateManyWithoutSetNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutSetInput, Prisma.EventUncheckedCreateWithoutSetInput> | Prisma.EventCreateWithoutSetInput[] | Prisma.EventUncheckedCreateWithoutSetInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutSetInput | Prisma.EventCreateOrConnectWithoutSetInput[];
    upsert?: Prisma.EventUpsertWithWhereUniqueWithoutSetInput | Prisma.EventUpsertWithWhereUniqueWithoutSetInput[];
    createMany?: Prisma.EventCreateManySetInputEnvelope;
    set?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    disconnect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    delete?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    update?: Prisma.EventUpdateWithWhereUniqueWithoutSetInput | Prisma.EventUpdateWithWhereUniqueWithoutSetInput[];
    updateMany?: Prisma.EventUpdateManyWithWhereWithoutSetInput | Prisma.EventUpdateManyWithWhereWithoutSetInput[];
    deleteMany?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
};
export type EventUncheckedUpdateManyWithoutSetNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutSetInput, Prisma.EventUncheckedCreateWithoutSetInput> | Prisma.EventCreateWithoutSetInput[] | Prisma.EventUncheckedCreateWithoutSetInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutSetInput | Prisma.EventCreateOrConnectWithoutSetInput[];
    upsert?: Prisma.EventUpsertWithWhereUniqueWithoutSetInput | Prisma.EventUpsertWithWhereUniqueWithoutSetInput[];
    createMany?: Prisma.EventCreateManySetInputEnvelope;
    set?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    disconnect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    delete?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    update?: Prisma.EventUpdateWithWhereUniqueWithoutSetInput | Prisma.EventUpdateWithWhereUniqueWithoutSetInput[];
    updateMany?: Prisma.EventUpdateManyWithWhereWithoutSetInput | Prisma.EventUpdateManyWithWhereWithoutSetInput[];
    deleteMany?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
};
export type EnumEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.EventType;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type EventCreateNestedOneWithoutSubstitutionInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutSubstitutionInput, Prisma.EventUncheckedCreateWithoutSubstitutionInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutSubstitutionInput;
    connect?: Prisma.EventWhereUniqueInput;
};
export type EventUpdateOneRequiredWithoutSubstitutionNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutSubstitutionInput, Prisma.EventUncheckedCreateWithoutSubstitutionInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutSubstitutionInput;
    upsert?: Prisma.EventUpsertWithoutSubstitutionInput;
    connect?: Prisma.EventWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EventUpdateToOneWithWhereWithoutSubstitutionInput, Prisma.EventUpdateWithoutSubstitutionInput>, Prisma.EventUncheckedUpdateWithoutSubstitutionInput>;
};
export type EventCreateNestedOneWithoutScoreboardsAsLastEventInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutScoreboardsAsLastEventInput, Prisma.EventUncheckedCreateWithoutScoreboardsAsLastEventInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutScoreboardsAsLastEventInput;
    connect?: Prisma.EventWhereUniqueInput;
};
export type EventUpdateOneWithoutScoreboardsAsLastEventNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutScoreboardsAsLastEventInput, Prisma.EventUncheckedCreateWithoutScoreboardsAsLastEventInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutScoreboardsAsLastEventInput;
    upsert?: Prisma.EventUpsertWithoutScoreboardsAsLastEventInput;
    disconnect?: Prisma.EventWhereInput | boolean;
    delete?: Prisma.EventWhereInput | boolean;
    connect?: Prisma.EventWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EventUpdateToOneWithWhereWithoutScoreboardsAsLastEventInput, Prisma.EventUpdateWithoutScoreboardsAsLastEventInput>, Prisma.EventUncheckedUpdateWithoutScoreboardsAsLastEventInput>;
};
export type EventCreateNestedOneWithoutTimelineInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutTimelineInput, Prisma.EventUncheckedCreateWithoutTimelineInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutTimelineInput;
    connect?: Prisma.EventWhereUniqueInput;
};
export type EventUpdateOneRequiredWithoutTimelineNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutTimelineInput, Prisma.EventUncheckedCreateWithoutTimelineInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutTimelineInput;
    upsert?: Prisma.EventUpsertWithoutTimelineInput;
    connect?: Prisma.EventWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EventUpdateToOneWithWhereWithoutTimelineInput, Prisma.EventUpdateWithoutTimelineInput>, Prisma.EventUncheckedUpdateWithoutTimelineInput>;
};
export type EventCreateWithoutSetInput = {
    id?: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
    substitution?: Prisma.SubstitutionCreateNestedOneWithoutEventInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardCreateNestedManyWithoutLastEventInput;
    timeline?: Prisma.LiveTimelineCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateWithoutSetInput = {
    id?: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
    substitution?: Prisma.SubstitutionUncheckedCreateNestedOneWithoutEventInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUncheckedCreateNestedManyWithoutLastEventInput;
    timeline?: Prisma.LiveTimelineUncheckedCreateNestedManyWithoutEventInput;
};
export type EventCreateOrConnectWithoutSetInput = {
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateWithoutSetInput, Prisma.EventUncheckedCreateWithoutSetInput>;
};
export type EventCreateManySetInputEnvelope = {
    data: Prisma.EventCreateManySetInput | Prisma.EventCreateManySetInput[];
    skipDuplicates?: boolean;
};
export type EventUpsertWithWhereUniqueWithoutSetInput = {
    where: Prisma.EventWhereUniqueInput;
    update: Prisma.XOR<Prisma.EventUpdateWithoutSetInput, Prisma.EventUncheckedUpdateWithoutSetInput>;
    create: Prisma.XOR<Prisma.EventCreateWithoutSetInput, Prisma.EventUncheckedCreateWithoutSetInput>;
};
export type EventUpdateWithWhereUniqueWithoutSetInput = {
    where: Prisma.EventWhereUniqueInput;
    data: Prisma.XOR<Prisma.EventUpdateWithoutSetInput, Prisma.EventUncheckedUpdateWithoutSetInput>;
};
export type EventUpdateManyWithWhereWithoutSetInput = {
    where: Prisma.EventScalarWhereInput;
    data: Prisma.XOR<Prisma.EventUpdateManyMutationInput, Prisma.EventUncheckedUpdateManyWithoutSetInput>;
};
export type EventScalarWhereInput = {
    AND?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
    OR?: Prisma.EventScalarWhereInput[];
    NOT?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
    id?: Prisma.UuidFilter<"Event"> | string;
    setId?: Prisma.UuidFilter<"Event"> | string;
    type?: Prisma.EnumEventTypeFilter<"Event"> | $Enums.EventType;
    nPoint?: Prisma.IntNullableFilter<"Event"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
};
export type EventCreateWithoutSubstitutionInput = {
    id?: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
    set: Prisma.SetCreateNestedOneWithoutEventsInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardCreateNestedManyWithoutLastEventInput;
    timeline?: Prisma.LiveTimelineCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateWithoutSubstitutionInput = {
    id?: string;
    setId: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUncheckedCreateNestedManyWithoutLastEventInput;
    timeline?: Prisma.LiveTimelineUncheckedCreateNestedManyWithoutEventInput;
};
export type EventCreateOrConnectWithoutSubstitutionInput = {
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateWithoutSubstitutionInput, Prisma.EventUncheckedCreateWithoutSubstitutionInput>;
};
export type EventUpsertWithoutSubstitutionInput = {
    update: Prisma.XOR<Prisma.EventUpdateWithoutSubstitutionInput, Prisma.EventUncheckedUpdateWithoutSubstitutionInput>;
    create: Prisma.XOR<Prisma.EventCreateWithoutSubstitutionInput, Prisma.EventUncheckedCreateWithoutSubstitutionInput>;
    where?: Prisma.EventWhereInput;
};
export type EventUpdateToOneWithWhereWithoutSubstitutionInput = {
    where?: Prisma.EventWhereInput;
    data: Prisma.XOR<Prisma.EventUpdateWithoutSubstitutionInput, Prisma.EventUncheckedUpdateWithoutSubstitutionInput>;
};
export type EventUpdateWithoutSubstitutionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    set?: Prisma.SetUpdateOneRequiredWithoutEventsNestedInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUpdateManyWithoutLastEventNestedInput;
    timeline?: Prisma.LiveTimelineUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateWithoutSubstitutionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    setId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUncheckedUpdateManyWithoutLastEventNestedInput;
    timeline?: Prisma.LiveTimelineUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventCreateWithoutScoreboardsAsLastEventInput = {
    id?: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
    set: Prisma.SetCreateNestedOneWithoutEventsInput;
    substitution?: Prisma.SubstitutionCreateNestedOneWithoutEventInput;
    timeline?: Prisma.LiveTimelineCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateWithoutScoreboardsAsLastEventInput = {
    id?: string;
    setId: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
    substitution?: Prisma.SubstitutionUncheckedCreateNestedOneWithoutEventInput;
    timeline?: Prisma.LiveTimelineUncheckedCreateNestedManyWithoutEventInput;
};
export type EventCreateOrConnectWithoutScoreboardsAsLastEventInput = {
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateWithoutScoreboardsAsLastEventInput, Prisma.EventUncheckedCreateWithoutScoreboardsAsLastEventInput>;
};
export type EventUpsertWithoutScoreboardsAsLastEventInput = {
    update: Prisma.XOR<Prisma.EventUpdateWithoutScoreboardsAsLastEventInput, Prisma.EventUncheckedUpdateWithoutScoreboardsAsLastEventInput>;
    create: Prisma.XOR<Prisma.EventCreateWithoutScoreboardsAsLastEventInput, Prisma.EventUncheckedCreateWithoutScoreboardsAsLastEventInput>;
    where?: Prisma.EventWhereInput;
};
export type EventUpdateToOneWithWhereWithoutScoreboardsAsLastEventInput = {
    where?: Prisma.EventWhereInput;
    data: Prisma.XOR<Prisma.EventUpdateWithoutScoreboardsAsLastEventInput, Prisma.EventUncheckedUpdateWithoutScoreboardsAsLastEventInput>;
};
export type EventUpdateWithoutScoreboardsAsLastEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    set?: Prisma.SetUpdateOneRequiredWithoutEventsNestedInput;
    substitution?: Prisma.SubstitutionUpdateOneWithoutEventNestedInput;
    timeline?: Prisma.LiveTimelineUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateWithoutScoreboardsAsLastEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    setId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    substitution?: Prisma.SubstitutionUncheckedUpdateOneWithoutEventNestedInput;
    timeline?: Prisma.LiveTimelineUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventCreateWithoutTimelineInput = {
    id?: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
    set: Prisma.SetCreateNestedOneWithoutEventsInput;
    substitution?: Prisma.SubstitutionCreateNestedOneWithoutEventInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardCreateNestedManyWithoutLastEventInput;
};
export type EventUncheckedCreateWithoutTimelineInput = {
    id?: string;
    setId: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
    substitution?: Prisma.SubstitutionUncheckedCreateNestedOneWithoutEventInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUncheckedCreateNestedManyWithoutLastEventInput;
};
export type EventCreateOrConnectWithoutTimelineInput = {
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateWithoutTimelineInput, Prisma.EventUncheckedCreateWithoutTimelineInput>;
};
export type EventUpsertWithoutTimelineInput = {
    update: Prisma.XOR<Prisma.EventUpdateWithoutTimelineInput, Prisma.EventUncheckedUpdateWithoutTimelineInput>;
    create: Prisma.XOR<Prisma.EventCreateWithoutTimelineInput, Prisma.EventUncheckedCreateWithoutTimelineInput>;
    where?: Prisma.EventWhereInput;
};
export type EventUpdateToOneWithWhereWithoutTimelineInput = {
    where?: Prisma.EventWhereInput;
    data: Prisma.XOR<Prisma.EventUpdateWithoutTimelineInput, Prisma.EventUncheckedUpdateWithoutTimelineInput>;
};
export type EventUpdateWithoutTimelineInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    set?: Prisma.SetUpdateOneRequiredWithoutEventsNestedInput;
    substitution?: Prisma.SubstitutionUpdateOneWithoutEventNestedInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUpdateManyWithoutLastEventNestedInput;
};
export type EventUncheckedUpdateWithoutTimelineInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    setId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    substitution?: Prisma.SubstitutionUncheckedUpdateOneWithoutEventNestedInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUncheckedUpdateManyWithoutLastEventNestedInput;
};
export type EventCreateManySetInput = {
    id?: string;
    type: $Enums.EventType;
    nPoint?: number | null;
    createdAt?: Date | string;
};
export type EventUpdateWithoutSetInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    substitution?: Prisma.SubstitutionUpdateOneWithoutEventNestedInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUpdateManyWithoutLastEventNestedInput;
    timeline?: Prisma.LiveTimelineUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateWithoutSetInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    substitution?: Prisma.SubstitutionUncheckedUpdateOneWithoutEventNestedInput;
    scoreboardsAsLastEvent?: Prisma.LiveScoreboardUncheckedUpdateManyWithoutLastEventNestedInput;
    timeline?: Prisma.LiveTimelineUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateManyWithoutSetInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumEventTypeFieldUpdateOperationsInput | $Enums.EventType;
    nPoint?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventCountOutputType = {
    scoreboardsAsLastEvent: number;
    timeline: number;
};
export type EventCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    scoreboardsAsLastEvent?: boolean | EventCountOutputTypeCountScoreboardsAsLastEventArgs;
    timeline?: boolean | EventCountOutputTypeCountTimelineArgs;
};
export type EventCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventCountOutputTypeSelect<ExtArgs> | null;
};
export type EventCountOutputTypeCountScoreboardsAsLastEventArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveScoreboardWhereInput;
};
export type EventCountOutputTypeCountTimelineArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LiveTimelineWhereInput;
};
export type EventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    setId?: boolean;
    type?: boolean;
    nPoint?: boolean;
    createdAt?: boolean;
    set?: boolean | Prisma.SetDefaultArgs<ExtArgs>;
    substitution?: boolean | Prisma.Event$substitutionArgs<ExtArgs>;
    scoreboardsAsLastEvent?: boolean | Prisma.Event$scoreboardsAsLastEventArgs<ExtArgs>;
    timeline?: boolean | Prisma.Event$timelineArgs<ExtArgs>;
    _count?: boolean | Prisma.EventCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["event"]>;
export type EventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    setId?: boolean;
    type?: boolean;
    nPoint?: boolean;
    createdAt?: boolean;
    set?: boolean | Prisma.SetDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["event"]>;
export type EventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    setId?: boolean;
    type?: boolean;
    nPoint?: boolean;
    createdAt?: boolean;
    set?: boolean | Prisma.SetDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["event"]>;
export type EventSelectScalar = {
    id?: boolean;
    setId?: boolean;
    type?: boolean;
    nPoint?: boolean;
    createdAt?: boolean;
};
export type EventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "setId" | "type" | "nPoint" | "createdAt", ExtArgs["result"]["event"]>;
export type EventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    set?: boolean | Prisma.SetDefaultArgs<ExtArgs>;
    substitution?: boolean | Prisma.Event$substitutionArgs<ExtArgs>;
    scoreboardsAsLastEvent?: boolean | Prisma.Event$scoreboardsAsLastEventArgs<ExtArgs>;
    timeline?: boolean | Prisma.Event$timelineArgs<ExtArgs>;
    _count?: boolean | Prisma.EventCountOutputTypeDefaultArgs<ExtArgs>;
};
export type EventIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    set?: boolean | Prisma.SetDefaultArgs<ExtArgs>;
};
export type EventIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    set?: boolean | Prisma.SetDefaultArgs<ExtArgs>;
};
export type $EventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Event";
    objects: {
        set: Prisma.$SetPayload<ExtArgs>;
        substitution: Prisma.$SubstitutionPayload<ExtArgs> | null;
        scoreboardsAsLastEvent: Prisma.$LiveScoreboardPayload<ExtArgs>[];
        timeline: Prisma.$LiveTimelinePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        setId: string;
        type: $Enums.EventType;
        nPoint: number | null;
        createdAt: Date;
    }, ExtArgs["result"]["event"]>;
    composites: {};
};
export type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EventPayload, S>;
export type EventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EventCountAggregateInputType | true;
};
export interface EventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Event'];
        meta: {
            name: 'Event';
        };
    };
    findUnique<T extends EventFindUniqueArgs>(args: Prisma.SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EventFindFirstArgs>(args?: Prisma.SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EventFindManyArgs>(args?: Prisma.SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EventCreateArgs>(args: Prisma.SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EventCreateManyArgs>(args?: Prisma.SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EventDeleteArgs>(args: Prisma.SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EventUpdateArgs>(args: Prisma.SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EventDeleteManyArgs>(args?: Prisma.SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EventUpdateManyArgs>(args: Prisma.SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EventUpsertArgs>(args: Prisma.SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EventCountArgs>(args?: Prisma.Subset<T, EventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EventCountAggregateOutputType> : number>;
    aggregate<T extends EventAggregateArgs>(args: Prisma.Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>;
    groupBy<T extends EventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EventGroupByArgs['orderBy'];
    } : {
        orderBy?: EventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EventFieldRefs;
}
export interface Prisma__EventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    set<T extends Prisma.SetDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SetDefaultArgs<ExtArgs>>): Prisma.Prisma__SetClient<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    substitution<T extends Prisma.Event$substitutionArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Event$substitutionArgs<ExtArgs>>): Prisma.Prisma__SubstitutionClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    scoreboardsAsLastEvent<T extends Prisma.Event$scoreboardsAsLastEventArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Event$scoreboardsAsLastEventArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveScoreboardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    timeline<T extends Prisma.Event$timelineArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Event$timelineArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LiveTimelinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EventFieldRefs {
    readonly id: Prisma.FieldRef<"Event", 'String'>;
    readonly setId: Prisma.FieldRef<"Event", 'String'>;
    readonly type: Prisma.FieldRef<"Event", 'EventType'>;
    readonly nPoint: Prisma.FieldRef<"Event", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Event", 'DateTime'>;
}
export type EventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
};
export type EventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
};
export type EventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventScalarFieldEnum | Prisma.EventScalarFieldEnum[];
};
export type EventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventScalarFieldEnum | Prisma.EventScalarFieldEnum[];
};
export type EventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventScalarFieldEnum | Prisma.EventScalarFieldEnum[];
};
export type EventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventCreateInput, Prisma.EventUncheckedCreateInput>;
};
export type EventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EventCreateManyInput | Prisma.EventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    data: Prisma.EventCreateManyInput | Prisma.EventCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EventIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventUpdateInput, Prisma.EventUncheckedUpdateInput>;
    where: Prisma.EventWhereUniqueInput;
};
export type EventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EventUpdateManyMutationInput, Prisma.EventUncheckedUpdateManyInput>;
    where?: Prisma.EventWhereInput;
    limit?: number;
};
export type EventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventUpdateManyMutationInput, Prisma.EventUncheckedUpdateManyInput>;
    where?: Prisma.EventWhereInput;
    limit?: number;
    include?: Prisma.EventIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateInput, Prisma.EventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EventUpdateInput, Prisma.EventUncheckedUpdateInput>;
};
export type EventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
};
export type EventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
    limit?: number;
};
export type Event$substitutionArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionInclude<ExtArgs> | null;
    where?: Prisma.SubstitutionWhereInput;
};
export type Event$scoreboardsAsLastEventArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Event$timelineArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
};

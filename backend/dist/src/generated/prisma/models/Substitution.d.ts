import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SubstitutionModel = runtime.Types.Result.DefaultSelection<Prisma.$SubstitutionPayload>;
export type AggregateSubstitution = {
    _count: SubstitutionCountAggregateOutputType | null;
    _min: SubstitutionMinAggregateOutputType | null;
    _max: SubstitutionMaxAggregateOutputType | null;
};
export type SubstitutionMinAggregateOutputType = {
    id: string | null;
    eventId: string | null;
    playerEntersId: string | null;
    playerLeavesId: string | null;
};
export type SubstitutionMaxAggregateOutputType = {
    id: string | null;
    eventId: string | null;
    playerEntersId: string | null;
    playerLeavesId: string | null;
};
export type SubstitutionCountAggregateOutputType = {
    id: number;
    eventId: number;
    playerEntersId: number;
    playerLeavesId: number;
    _all: number;
};
export type SubstitutionMinAggregateInputType = {
    id?: true;
    eventId?: true;
    playerEntersId?: true;
    playerLeavesId?: true;
};
export type SubstitutionMaxAggregateInputType = {
    id?: true;
    eventId?: true;
    playerEntersId?: true;
    playerLeavesId?: true;
};
export type SubstitutionCountAggregateInputType = {
    id?: true;
    eventId?: true;
    playerEntersId?: true;
    playerLeavesId?: true;
    _all?: true;
};
export type SubstitutionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubstitutionWhereInput;
    orderBy?: Prisma.SubstitutionOrderByWithRelationInput | Prisma.SubstitutionOrderByWithRelationInput[];
    cursor?: Prisma.SubstitutionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SubstitutionCountAggregateInputType;
    _min?: SubstitutionMinAggregateInputType;
    _max?: SubstitutionMaxAggregateInputType;
};
export type GetSubstitutionAggregateType<T extends SubstitutionAggregateArgs> = {
    [P in keyof T & keyof AggregateSubstitution]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubstitution[P]> : Prisma.GetScalarType<T[P], AggregateSubstitution[P]>;
};
export type SubstitutionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubstitutionWhereInput;
    orderBy?: Prisma.SubstitutionOrderByWithAggregationInput | Prisma.SubstitutionOrderByWithAggregationInput[];
    by: Prisma.SubstitutionScalarFieldEnum[] | Prisma.SubstitutionScalarFieldEnum;
    having?: Prisma.SubstitutionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubstitutionCountAggregateInputType | true;
    _min?: SubstitutionMinAggregateInputType;
    _max?: SubstitutionMaxAggregateInputType;
};
export type SubstitutionGroupByOutputType = {
    id: string;
    eventId: string;
    playerEntersId: string;
    playerLeavesId: string;
    _count: SubstitutionCountAggregateOutputType | null;
    _min: SubstitutionMinAggregateOutputType | null;
    _max: SubstitutionMaxAggregateOutputType | null;
};
export type GetSubstitutionGroupByPayload<T extends SubstitutionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubstitutionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubstitutionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubstitutionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubstitutionGroupByOutputType[P]>;
}>>;
export type SubstitutionWhereInput = {
    AND?: Prisma.SubstitutionWhereInput | Prisma.SubstitutionWhereInput[];
    OR?: Prisma.SubstitutionWhereInput[];
    NOT?: Prisma.SubstitutionWhereInput | Prisma.SubstitutionWhereInput[];
    id?: Prisma.UuidFilter<"Substitution"> | string;
    eventId?: Prisma.UuidFilter<"Substitution"> | string;
    playerEntersId?: Prisma.UuidFilter<"Substitution"> | string;
    playerLeavesId?: Prisma.UuidFilter<"Substitution"> | string;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
    playerEnters?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
    playerLeaves?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
};
export type SubstitutionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    playerEntersId?: Prisma.SortOrder;
    playerLeavesId?: Prisma.SortOrder;
    event?: Prisma.EventOrderByWithRelationInput;
    playerEnters?: Prisma.PlayerOrderByWithRelationInput;
    playerLeaves?: Prisma.PlayerOrderByWithRelationInput;
};
export type SubstitutionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    eventId?: string;
    AND?: Prisma.SubstitutionWhereInput | Prisma.SubstitutionWhereInput[];
    OR?: Prisma.SubstitutionWhereInput[];
    NOT?: Prisma.SubstitutionWhereInput | Prisma.SubstitutionWhereInput[];
    playerEntersId?: Prisma.UuidFilter<"Substitution"> | string;
    playerLeavesId?: Prisma.UuidFilter<"Substitution"> | string;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
    playerEnters?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
    playerLeaves?: Prisma.XOR<Prisma.PlayerScalarRelationFilter, Prisma.PlayerWhereInput>;
}, "id" | "eventId">;
export type SubstitutionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    playerEntersId?: Prisma.SortOrder;
    playerLeavesId?: Prisma.SortOrder;
    _count?: Prisma.SubstitutionCountOrderByAggregateInput;
    _max?: Prisma.SubstitutionMaxOrderByAggregateInput;
    _min?: Prisma.SubstitutionMinOrderByAggregateInput;
};
export type SubstitutionScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubstitutionScalarWhereWithAggregatesInput | Prisma.SubstitutionScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubstitutionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubstitutionScalarWhereWithAggregatesInput | Prisma.SubstitutionScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Substitution"> | string;
    eventId?: Prisma.UuidWithAggregatesFilter<"Substitution"> | string;
    playerEntersId?: Prisma.UuidWithAggregatesFilter<"Substitution"> | string;
    playerLeavesId?: Prisma.UuidWithAggregatesFilter<"Substitution"> | string;
};
export type SubstitutionCreateInput = {
    id?: string;
    event: Prisma.EventCreateNestedOneWithoutSubstitutionInput;
    playerEnters: Prisma.PlayerCreateNestedOneWithoutSubstitutionsAsEnterInput;
    playerLeaves: Prisma.PlayerCreateNestedOneWithoutSubstitutionsAsLeaveInput;
};
export type SubstitutionUncheckedCreateInput = {
    id?: string;
    eventId: string;
    playerEntersId: string;
    playerLeavesId: string;
};
export type SubstitutionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    event?: Prisma.EventUpdateOneRequiredWithoutSubstitutionNestedInput;
    playerEnters?: Prisma.PlayerUpdateOneRequiredWithoutSubstitutionsAsEnterNestedInput;
    playerLeaves?: Prisma.PlayerUpdateOneRequiredWithoutSubstitutionsAsLeaveNestedInput;
};
export type SubstitutionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    playerEntersId?: Prisma.StringFieldUpdateOperationsInput | string;
    playerLeavesId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionCreateManyInput = {
    id?: string;
    eventId: string;
    playerEntersId: string;
    playerLeavesId: string;
};
export type SubstitutionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    playerEntersId?: Prisma.StringFieldUpdateOperationsInput | string;
    playerLeavesId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionListRelationFilter = {
    every?: Prisma.SubstitutionWhereInput;
    some?: Prisma.SubstitutionWhereInput;
    none?: Prisma.SubstitutionWhereInput;
};
export type SubstitutionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SubstitutionNullableScalarRelationFilter = {
    is?: Prisma.SubstitutionWhereInput | null;
    isNot?: Prisma.SubstitutionWhereInput | null;
};
export type SubstitutionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    playerEntersId?: Prisma.SortOrder;
    playerLeavesId?: Prisma.SortOrder;
};
export type SubstitutionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    playerEntersId?: Prisma.SortOrder;
    playerLeavesId?: Prisma.SortOrder;
};
export type SubstitutionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    playerEntersId?: Prisma.SortOrder;
    playerLeavesId?: Prisma.SortOrder;
};
export type SubstitutionCreateNestedManyWithoutPlayerEntersInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerEntersInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerEntersInput> | Prisma.SubstitutionCreateWithoutPlayerEntersInput[] | Prisma.SubstitutionUncheckedCreateWithoutPlayerEntersInput[];
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutPlayerEntersInput | Prisma.SubstitutionCreateOrConnectWithoutPlayerEntersInput[];
    createMany?: Prisma.SubstitutionCreateManyPlayerEntersInputEnvelope;
    connect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
};
export type SubstitutionCreateNestedManyWithoutPlayerLeavesInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerLeavesInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerLeavesInput> | Prisma.SubstitutionCreateWithoutPlayerLeavesInput[] | Prisma.SubstitutionUncheckedCreateWithoutPlayerLeavesInput[];
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutPlayerLeavesInput | Prisma.SubstitutionCreateOrConnectWithoutPlayerLeavesInput[];
    createMany?: Prisma.SubstitutionCreateManyPlayerLeavesInputEnvelope;
    connect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
};
export type SubstitutionUncheckedCreateNestedManyWithoutPlayerEntersInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerEntersInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerEntersInput> | Prisma.SubstitutionCreateWithoutPlayerEntersInput[] | Prisma.SubstitutionUncheckedCreateWithoutPlayerEntersInput[];
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutPlayerEntersInput | Prisma.SubstitutionCreateOrConnectWithoutPlayerEntersInput[];
    createMany?: Prisma.SubstitutionCreateManyPlayerEntersInputEnvelope;
    connect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
};
export type SubstitutionUncheckedCreateNestedManyWithoutPlayerLeavesInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerLeavesInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerLeavesInput> | Prisma.SubstitutionCreateWithoutPlayerLeavesInput[] | Prisma.SubstitutionUncheckedCreateWithoutPlayerLeavesInput[];
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutPlayerLeavesInput | Prisma.SubstitutionCreateOrConnectWithoutPlayerLeavesInput[];
    createMany?: Prisma.SubstitutionCreateManyPlayerLeavesInputEnvelope;
    connect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
};
export type SubstitutionUpdateManyWithoutPlayerEntersNestedInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerEntersInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerEntersInput> | Prisma.SubstitutionCreateWithoutPlayerEntersInput[] | Prisma.SubstitutionUncheckedCreateWithoutPlayerEntersInput[];
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutPlayerEntersInput | Prisma.SubstitutionCreateOrConnectWithoutPlayerEntersInput[];
    upsert?: Prisma.SubstitutionUpsertWithWhereUniqueWithoutPlayerEntersInput | Prisma.SubstitutionUpsertWithWhereUniqueWithoutPlayerEntersInput[];
    createMany?: Prisma.SubstitutionCreateManyPlayerEntersInputEnvelope;
    set?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    disconnect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    delete?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    connect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    update?: Prisma.SubstitutionUpdateWithWhereUniqueWithoutPlayerEntersInput | Prisma.SubstitutionUpdateWithWhereUniqueWithoutPlayerEntersInput[];
    updateMany?: Prisma.SubstitutionUpdateManyWithWhereWithoutPlayerEntersInput | Prisma.SubstitutionUpdateManyWithWhereWithoutPlayerEntersInput[];
    deleteMany?: Prisma.SubstitutionScalarWhereInput | Prisma.SubstitutionScalarWhereInput[];
};
export type SubstitutionUpdateManyWithoutPlayerLeavesNestedInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerLeavesInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerLeavesInput> | Prisma.SubstitutionCreateWithoutPlayerLeavesInput[] | Prisma.SubstitutionUncheckedCreateWithoutPlayerLeavesInput[];
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutPlayerLeavesInput | Prisma.SubstitutionCreateOrConnectWithoutPlayerLeavesInput[];
    upsert?: Prisma.SubstitutionUpsertWithWhereUniqueWithoutPlayerLeavesInput | Prisma.SubstitutionUpsertWithWhereUniqueWithoutPlayerLeavesInput[];
    createMany?: Prisma.SubstitutionCreateManyPlayerLeavesInputEnvelope;
    set?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    disconnect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    delete?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    connect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    update?: Prisma.SubstitutionUpdateWithWhereUniqueWithoutPlayerLeavesInput | Prisma.SubstitutionUpdateWithWhereUniqueWithoutPlayerLeavesInput[];
    updateMany?: Prisma.SubstitutionUpdateManyWithWhereWithoutPlayerLeavesInput | Prisma.SubstitutionUpdateManyWithWhereWithoutPlayerLeavesInput[];
    deleteMany?: Prisma.SubstitutionScalarWhereInput | Prisma.SubstitutionScalarWhereInput[];
};
export type SubstitutionUncheckedUpdateManyWithoutPlayerEntersNestedInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerEntersInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerEntersInput> | Prisma.SubstitutionCreateWithoutPlayerEntersInput[] | Prisma.SubstitutionUncheckedCreateWithoutPlayerEntersInput[];
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutPlayerEntersInput | Prisma.SubstitutionCreateOrConnectWithoutPlayerEntersInput[];
    upsert?: Prisma.SubstitutionUpsertWithWhereUniqueWithoutPlayerEntersInput | Prisma.SubstitutionUpsertWithWhereUniqueWithoutPlayerEntersInput[];
    createMany?: Prisma.SubstitutionCreateManyPlayerEntersInputEnvelope;
    set?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    disconnect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    delete?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    connect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    update?: Prisma.SubstitutionUpdateWithWhereUniqueWithoutPlayerEntersInput | Prisma.SubstitutionUpdateWithWhereUniqueWithoutPlayerEntersInput[];
    updateMany?: Prisma.SubstitutionUpdateManyWithWhereWithoutPlayerEntersInput | Prisma.SubstitutionUpdateManyWithWhereWithoutPlayerEntersInput[];
    deleteMany?: Prisma.SubstitutionScalarWhereInput | Prisma.SubstitutionScalarWhereInput[];
};
export type SubstitutionUncheckedUpdateManyWithoutPlayerLeavesNestedInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerLeavesInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerLeavesInput> | Prisma.SubstitutionCreateWithoutPlayerLeavesInput[] | Prisma.SubstitutionUncheckedCreateWithoutPlayerLeavesInput[];
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutPlayerLeavesInput | Prisma.SubstitutionCreateOrConnectWithoutPlayerLeavesInput[];
    upsert?: Prisma.SubstitutionUpsertWithWhereUniqueWithoutPlayerLeavesInput | Prisma.SubstitutionUpsertWithWhereUniqueWithoutPlayerLeavesInput[];
    createMany?: Prisma.SubstitutionCreateManyPlayerLeavesInputEnvelope;
    set?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    disconnect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    delete?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    connect?: Prisma.SubstitutionWhereUniqueInput | Prisma.SubstitutionWhereUniqueInput[];
    update?: Prisma.SubstitutionUpdateWithWhereUniqueWithoutPlayerLeavesInput | Prisma.SubstitutionUpdateWithWhereUniqueWithoutPlayerLeavesInput[];
    updateMany?: Prisma.SubstitutionUpdateManyWithWhereWithoutPlayerLeavesInput | Prisma.SubstitutionUpdateManyWithWhereWithoutPlayerLeavesInput[];
    deleteMany?: Prisma.SubstitutionScalarWhereInput | Prisma.SubstitutionScalarWhereInput[];
};
export type SubstitutionCreateNestedOneWithoutEventInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutEventInput, Prisma.SubstitutionUncheckedCreateWithoutEventInput>;
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutEventInput;
    connect?: Prisma.SubstitutionWhereUniqueInput;
};
export type SubstitutionUncheckedCreateNestedOneWithoutEventInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutEventInput, Prisma.SubstitutionUncheckedCreateWithoutEventInput>;
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutEventInput;
    connect?: Prisma.SubstitutionWhereUniqueInput;
};
export type SubstitutionUpdateOneWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutEventInput, Prisma.SubstitutionUncheckedCreateWithoutEventInput>;
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutEventInput;
    upsert?: Prisma.SubstitutionUpsertWithoutEventInput;
    disconnect?: Prisma.SubstitutionWhereInput | boolean;
    delete?: Prisma.SubstitutionWhereInput | boolean;
    connect?: Prisma.SubstitutionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SubstitutionUpdateToOneWithWhereWithoutEventInput, Prisma.SubstitutionUpdateWithoutEventInput>, Prisma.SubstitutionUncheckedUpdateWithoutEventInput>;
};
export type SubstitutionUncheckedUpdateOneWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.SubstitutionCreateWithoutEventInput, Prisma.SubstitutionUncheckedCreateWithoutEventInput>;
    connectOrCreate?: Prisma.SubstitutionCreateOrConnectWithoutEventInput;
    upsert?: Prisma.SubstitutionUpsertWithoutEventInput;
    disconnect?: Prisma.SubstitutionWhereInput | boolean;
    delete?: Prisma.SubstitutionWhereInput | boolean;
    connect?: Prisma.SubstitutionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SubstitutionUpdateToOneWithWhereWithoutEventInput, Prisma.SubstitutionUpdateWithoutEventInput>, Prisma.SubstitutionUncheckedUpdateWithoutEventInput>;
};
export type SubstitutionCreateWithoutPlayerEntersInput = {
    id?: string;
    event: Prisma.EventCreateNestedOneWithoutSubstitutionInput;
    playerLeaves: Prisma.PlayerCreateNestedOneWithoutSubstitutionsAsLeaveInput;
};
export type SubstitutionUncheckedCreateWithoutPlayerEntersInput = {
    id?: string;
    eventId: string;
    playerLeavesId: string;
};
export type SubstitutionCreateOrConnectWithoutPlayerEntersInput = {
    where: Prisma.SubstitutionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerEntersInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerEntersInput>;
};
export type SubstitutionCreateManyPlayerEntersInputEnvelope = {
    data: Prisma.SubstitutionCreateManyPlayerEntersInput | Prisma.SubstitutionCreateManyPlayerEntersInput[];
    skipDuplicates?: boolean;
};
export type SubstitutionCreateWithoutPlayerLeavesInput = {
    id?: string;
    event: Prisma.EventCreateNestedOneWithoutSubstitutionInput;
    playerEnters: Prisma.PlayerCreateNestedOneWithoutSubstitutionsAsEnterInput;
};
export type SubstitutionUncheckedCreateWithoutPlayerLeavesInput = {
    id?: string;
    eventId: string;
    playerEntersId: string;
};
export type SubstitutionCreateOrConnectWithoutPlayerLeavesInput = {
    where: Prisma.SubstitutionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerLeavesInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerLeavesInput>;
};
export type SubstitutionCreateManyPlayerLeavesInputEnvelope = {
    data: Prisma.SubstitutionCreateManyPlayerLeavesInput | Prisma.SubstitutionCreateManyPlayerLeavesInput[];
    skipDuplicates?: boolean;
};
export type SubstitutionUpsertWithWhereUniqueWithoutPlayerEntersInput = {
    where: Prisma.SubstitutionWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubstitutionUpdateWithoutPlayerEntersInput, Prisma.SubstitutionUncheckedUpdateWithoutPlayerEntersInput>;
    create: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerEntersInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerEntersInput>;
};
export type SubstitutionUpdateWithWhereUniqueWithoutPlayerEntersInput = {
    where: Prisma.SubstitutionWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubstitutionUpdateWithoutPlayerEntersInput, Prisma.SubstitutionUncheckedUpdateWithoutPlayerEntersInput>;
};
export type SubstitutionUpdateManyWithWhereWithoutPlayerEntersInput = {
    where: Prisma.SubstitutionScalarWhereInput;
    data: Prisma.XOR<Prisma.SubstitutionUpdateManyMutationInput, Prisma.SubstitutionUncheckedUpdateManyWithoutPlayerEntersInput>;
};
export type SubstitutionScalarWhereInput = {
    AND?: Prisma.SubstitutionScalarWhereInput | Prisma.SubstitutionScalarWhereInput[];
    OR?: Prisma.SubstitutionScalarWhereInput[];
    NOT?: Prisma.SubstitutionScalarWhereInput | Prisma.SubstitutionScalarWhereInput[];
    id?: Prisma.UuidFilter<"Substitution"> | string;
    eventId?: Prisma.UuidFilter<"Substitution"> | string;
    playerEntersId?: Prisma.UuidFilter<"Substitution"> | string;
    playerLeavesId?: Prisma.UuidFilter<"Substitution"> | string;
};
export type SubstitutionUpsertWithWhereUniqueWithoutPlayerLeavesInput = {
    where: Prisma.SubstitutionWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubstitutionUpdateWithoutPlayerLeavesInput, Prisma.SubstitutionUncheckedUpdateWithoutPlayerLeavesInput>;
    create: Prisma.XOR<Prisma.SubstitutionCreateWithoutPlayerLeavesInput, Prisma.SubstitutionUncheckedCreateWithoutPlayerLeavesInput>;
};
export type SubstitutionUpdateWithWhereUniqueWithoutPlayerLeavesInput = {
    where: Prisma.SubstitutionWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubstitutionUpdateWithoutPlayerLeavesInput, Prisma.SubstitutionUncheckedUpdateWithoutPlayerLeavesInput>;
};
export type SubstitutionUpdateManyWithWhereWithoutPlayerLeavesInput = {
    where: Prisma.SubstitutionScalarWhereInput;
    data: Prisma.XOR<Prisma.SubstitutionUpdateManyMutationInput, Prisma.SubstitutionUncheckedUpdateManyWithoutPlayerLeavesInput>;
};
export type SubstitutionCreateWithoutEventInput = {
    id?: string;
    playerEnters: Prisma.PlayerCreateNestedOneWithoutSubstitutionsAsEnterInput;
    playerLeaves: Prisma.PlayerCreateNestedOneWithoutSubstitutionsAsLeaveInput;
};
export type SubstitutionUncheckedCreateWithoutEventInput = {
    id?: string;
    playerEntersId: string;
    playerLeavesId: string;
};
export type SubstitutionCreateOrConnectWithoutEventInput = {
    where: Prisma.SubstitutionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubstitutionCreateWithoutEventInput, Prisma.SubstitutionUncheckedCreateWithoutEventInput>;
};
export type SubstitutionUpsertWithoutEventInput = {
    update: Prisma.XOR<Prisma.SubstitutionUpdateWithoutEventInput, Prisma.SubstitutionUncheckedUpdateWithoutEventInput>;
    create: Prisma.XOR<Prisma.SubstitutionCreateWithoutEventInput, Prisma.SubstitutionUncheckedCreateWithoutEventInput>;
    where?: Prisma.SubstitutionWhereInput;
};
export type SubstitutionUpdateToOneWithWhereWithoutEventInput = {
    where?: Prisma.SubstitutionWhereInput;
    data: Prisma.XOR<Prisma.SubstitutionUpdateWithoutEventInput, Prisma.SubstitutionUncheckedUpdateWithoutEventInput>;
};
export type SubstitutionUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    playerEnters?: Prisma.PlayerUpdateOneRequiredWithoutSubstitutionsAsEnterNestedInput;
    playerLeaves?: Prisma.PlayerUpdateOneRequiredWithoutSubstitutionsAsLeaveNestedInput;
};
export type SubstitutionUncheckedUpdateWithoutEventInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    playerEntersId?: Prisma.StringFieldUpdateOperationsInput | string;
    playerLeavesId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionCreateManyPlayerEntersInput = {
    id?: string;
    eventId: string;
    playerLeavesId: string;
};
export type SubstitutionCreateManyPlayerLeavesInput = {
    id?: string;
    eventId: string;
    playerEntersId: string;
};
export type SubstitutionUpdateWithoutPlayerEntersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    event?: Prisma.EventUpdateOneRequiredWithoutSubstitutionNestedInput;
    playerLeaves?: Prisma.PlayerUpdateOneRequiredWithoutSubstitutionsAsLeaveNestedInput;
};
export type SubstitutionUncheckedUpdateWithoutPlayerEntersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    playerLeavesId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionUncheckedUpdateManyWithoutPlayerEntersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    playerLeavesId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionUpdateWithoutPlayerLeavesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    event?: Prisma.EventUpdateOneRequiredWithoutSubstitutionNestedInput;
    playerEnters?: Prisma.PlayerUpdateOneRequiredWithoutSubstitutionsAsEnterNestedInput;
};
export type SubstitutionUncheckedUpdateWithoutPlayerLeavesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    playerEntersId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionUncheckedUpdateManyWithoutPlayerLeavesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    eventId?: Prisma.StringFieldUpdateOperationsInput | string;
    playerEntersId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SubstitutionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    playerEntersId?: boolean;
    playerLeavesId?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    playerEnters?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
    playerLeaves?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["substitution"]>;
export type SubstitutionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    playerEntersId?: boolean;
    playerLeavesId?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    playerEnters?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
    playerLeaves?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["substitution"]>;
export type SubstitutionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    playerEntersId?: boolean;
    playerLeavesId?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    playerEnters?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
    playerLeaves?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["substitution"]>;
export type SubstitutionSelectScalar = {
    id?: boolean;
    eventId?: boolean;
    playerEntersId?: boolean;
    playerLeavesId?: boolean;
};
export type SubstitutionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "eventId" | "playerEntersId" | "playerLeavesId", ExtArgs["result"]["substitution"]>;
export type SubstitutionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    playerEnters?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
    playerLeaves?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
};
export type SubstitutionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    playerEnters?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
    playerLeaves?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
};
export type SubstitutionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    playerEnters?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
    playerLeaves?: boolean | Prisma.PlayerDefaultArgs<ExtArgs>;
};
export type $SubstitutionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Substitution";
    objects: {
        event: Prisma.$EventPayload<ExtArgs>;
        playerEnters: Prisma.$PlayerPayload<ExtArgs>;
        playerLeaves: Prisma.$PlayerPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        eventId: string;
        playerEntersId: string;
        playerLeavesId: string;
    }, ExtArgs["result"]["substitution"]>;
    composites: {};
};
export type SubstitutionGetPayload<S extends boolean | null | undefined | SubstitutionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload, S>;
export type SubstitutionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubstitutionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubstitutionCountAggregateInputType | true;
};
export interface SubstitutionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Substitution'];
        meta: {
            name: 'Substitution';
        };
    };
    findUnique<T extends SubstitutionFindUniqueArgs>(args: Prisma.SelectSubset<T, SubstitutionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubstitutionClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SubstitutionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubstitutionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubstitutionClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SubstitutionFindFirstArgs>(args?: Prisma.SelectSubset<T, SubstitutionFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubstitutionClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SubstitutionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubstitutionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubstitutionClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SubstitutionFindManyArgs>(args?: Prisma.SelectSubset<T, SubstitutionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SubstitutionCreateArgs>(args: Prisma.SelectSubset<T, SubstitutionCreateArgs<ExtArgs>>): Prisma.Prisma__SubstitutionClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SubstitutionCreateManyArgs>(args?: Prisma.SelectSubset<T, SubstitutionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SubstitutionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SubstitutionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SubstitutionDeleteArgs>(args: Prisma.SelectSubset<T, SubstitutionDeleteArgs<ExtArgs>>): Prisma.Prisma__SubstitutionClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SubstitutionUpdateArgs>(args: Prisma.SelectSubset<T, SubstitutionUpdateArgs<ExtArgs>>): Prisma.Prisma__SubstitutionClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SubstitutionDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubstitutionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SubstitutionUpdateManyArgs>(args: Prisma.SelectSubset<T, SubstitutionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SubstitutionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SubstitutionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SubstitutionUpsertArgs>(args: Prisma.SelectSubset<T, SubstitutionUpsertArgs<ExtArgs>>): Prisma.Prisma__SubstitutionClient<runtime.Types.Result.GetResult<Prisma.$SubstitutionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SubstitutionCountArgs>(args?: Prisma.Subset<T, SubstitutionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubstitutionCountAggregateOutputType> : number>;
    aggregate<T extends SubstitutionAggregateArgs>(args: Prisma.Subset<T, SubstitutionAggregateArgs>): Prisma.PrismaPromise<GetSubstitutionAggregateType<T>>;
    groupBy<T extends SubstitutionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubstitutionGroupByArgs['orderBy'];
    } : {
        orderBy?: SubstitutionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubstitutionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubstitutionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SubstitutionFieldRefs;
}
export interface Prisma__SubstitutionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    event<T extends Prisma.EventDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventDefaultArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    playerEnters<T extends Prisma.PlayerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PlayerDefaultArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    playerLeaves<T extends Prisma.PlayerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PlayerDefaultArgs<ExtArgs>>): Prisma.Prisma__PlayerClient<runtime.Types.Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SubstitutionFieldRefs {
    readonly id: Prisma.FieldRef<"Substitution", 'String'>;
    readonly eventId: Prisma.FieldRef<"Substitution", 'String'>;
    readonly playerEntersId: Prisma.FieldRef<"Substitution", 'String'>;
    readonly playerLeavesId: Prisma.FieldRef<"Substitution", 'String'>;
}
export type SubstitutionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionInclude<ExtArgs> | null;
    where: Prisma.SubstitutionWhereUniqueInput;
};
export type SubstitutionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionInclude<ExtArgs> | null;
    where: Prisma.SubstitutionWhereUniqueInput;
};
export type SubstitutionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SubstitutionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SubstitutionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SubstitutionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubstitutionCreateInput, Prisma.SubstitutionUncheckedCreateInput>;
};
export type SubstitutionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SubstitutionCreateManyInput | Prisma.SubstitutionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubstitutionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    data: Prisma.SubstitutionCreateManyInput | Prisma.SubstitutionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SubstitutionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SubstitutionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubstitutionUpdateInput, Prisma.SubstitutionUncheckedUpdateInput>;
    where: Prisma.SubstitutionWhereUniqueInput;
};
export type SubstitutionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SubstitutionUpdateManyMutationInput, Prisma.SubstitutionUncheckedUpdateManyInput>;
    where?: Prisma.SubstitutionWhereInput;
    limit?: number;
};
export type SubstitutionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubstitutionUpdateManyMutationInput, Prisma.SubstitutionUncheckedUpdateManyInput>;
    where?: Prisma.SubstitutionWhereInput;
    limit?: number;
    include?: Prisma.SubstitutionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SubstitutionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionInclude<ExtArgs> | null;
    where: Prisma.SubstitutionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubstitutionCreateInput, Prisma.SubstitutionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SubstitutionUpdateInput, Prisma.SubstitutionUncheckedUpdateInput>;
};
export type SubstitutionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionInclude<ExtArgs> | null;
    where: Prisma.SubstitutionWhereUniqueInput;
};
export type SubstitutionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubstitutionWhereInput;
    limit?: number;
};
export type SubstitutionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubstitutionSelect<ExtArgs> | null;
    omit?: Prisma.SubstitutionOmit<ExtArgs> | null;
    include?: Prisma.SubstitutionInclude<ExtArgs> | null;
};

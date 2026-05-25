import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SetModel = runtime.Types.Result.DefaultSelection<Prisma.$SetPayload>;
export type AggregateSet = {
    _count: SetCountAggregateOutputType | null;
    _avg: SetAvgAggregateOutputType | null;
    _sum: SetSumAggregateOutputType | null;
    _min: SetMinAggregateOutputType | null;
    _max: SetMaxAggregateOutputType | null;
};
export type SetAvgAggregateOutputType = {
    numSet: number | null;
};
export type SetSumAggregateOutputType = {
    numSet: number | null;
};
export type SetMinAggregateOutputType = {
    id: string | null;
    matchId: string | null;
    numSet: number | null;
};
export type SetMaxAggregateOutputType = {
    id: string | null;
    matchId: string | null;
    numSet: number | null;
};
export type SetCountAggregateOutputType = {
    id: number;
    matchId: number;
    numSet: number;
    _all: number;
};
export type SetAvgAggregateInputType = {
    numSet?: true;
};
export type SetSumAggregateInputType = {
    numSet?: true;
};
export type SetMinAggregateInputType = {
    id?: true;
    matchId?: true;
    numSet?: true;
};
export type SetMaxAggregateInputType = {
    id?: true;
    matchId?: true;
    numSet?: true;
};
export type SetCountAggregateInputType = {
    id?: true;
    matchId?: true;
    numSet?: true;
    _all?: true;
};
export type SetAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SetWhereInput;
    orderBy?: Prisma.SetOrderByWithRelationInput | Prisma.SetOrderByWithRelationInput[];
    cursor?: Prisma.SetWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SetCountAggregateInputType;
    _avg?: SetAvgAggregateInputType;
    _sum?: SetSumAggregateInputType;
    _min?: SetMinAggregateInputType;
    _max?: SetMaxAggregateInputType;
};
export type GetSetAggregateType<T extends SetAggregateArgs> = {
    [P in keyof T & keyof AggregateSet]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSet[P]> : Prisma.GetScalarType<T[P], AggregateSet[P]>;
};
export type SetGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SetWhereInput;
    orderBy?: Prisma.SetOrderByWithAggregationInput | Prisma.SetOrderByWithAggregationInput[];
    by: Prisma.SetScalarFieldEnum[] | Prisma.SetScalarFieldEnum;
    having?: Prisma.SetScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SetCountAggregateInputType | true;
    _avg?: SetAvgAggregateInputType;
    _sum?: SetSumAggregateInputType;
    _min?: SetMinAggregateInputType;
    _max?: SetMaxAggregateInputType;
};
export type SetGroupByOutputType = {
    id: string;
    matchId: string;
    numSet: number;
    _count: SetCountAggregateOutputType | null;
    _avg: SetAvgAggregateOutputType | null;
    _sum: SetSumAggregateOutputType | null;
    _min: SetMinAggregateOutputType | null;
    _max: SetMaxAggregateOutputType | null;
};
export type GetSetGroupByPayload<T extends SetGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SetGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SetGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SetGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SetGroupByOutputType[P]>;
}>>;
export type SetWhereInput = {
    AND?: Prisma.SetWhereInput | Prisma.SetWhereInput[];
    OR?: Prisma.SetWhereInput[];
    NOT?: Prisma.SetWhereInput | Prisma.SetWhereInput[];
    id?: Prisma.UuidFilter<"Set"> | string;
    matchId?: Prisma.UuidFilter<"Set"> | string;
    numSet?: Prisma.IntFilter<"Set"> | number;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
    events?: Prisma.EventListRelationFilter;
};
export type SetOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    matchId?: Prisma.SortOrder;
    numSet?: Prisma.SortOrder;
    match?: Prisma.MatchOrderByWithRelationInput;
    events?: Prisma.EventOrderByRelationAggregateInput;
};
export type SetWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    matchId_numSet?: Prisma.SetMatchIdNumSetCompoundUniqueInput;
    AND?: Prisma.SetWhereInput | Prisma.SetWhereInput[];
    OR?: Prisma.SetWhereInput[];
    NOT?: Prisma.SetWhereInput | Prisma.SetWhereInput[];
    matchId?: Prisma.UuidFilter<"Set"> | string;
    numSet?: Prisma.IntFilter<"Set"> | number;
    match?: Prisma.XOR<Prisma.MatchScalarRelationFilter, Prisma.MatchWhereInput>;
    events?: Prisma.EventListRelationFilter;
}, "id" | "matchId_numSet">;
export type SetOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    matchId?: Prisma.SortOrder;
    numSet?: Prisma.SortOrder;
    _count?: Prisma.SetCountOrderByAggregateInput;
    _avg?: Prisma.SetAvgOrderByAggregateInput;
    _max?: Prisma.SetMaxOrderByAggregateInput;
    _min?: Prisma.SetMinOrderByAggregateInput;
    _sum?: Prisma.SetSumOrderByAggregateInput;
};
export type SetScalarWhereWithAggregatesInput = {
    AND?: Prisma.SetScalarWhereWithAggregatesInput | Prisma.SetScalarWhereWithAggregatesInput[];
    OR?: Prisma.SetScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SetScalarWhereWithAggregatesInput | Prisma.SetScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Set"> | string;
    matchId?: Prisma.UuidWithAggregatesFilter<"Set"> | string;
    numSet?: Prisma.IntWithAggregatesFilter<"Set"> | number;
};
export type SetCreateInput = {
    id?: string;
    numSet: number;
    match: Prisma.MatchCreateNestedOneWithoutSetsInput;
    events?: Prisma.EventCreateNestedManyWithoutSetInput;
};
export type SetUncheckedCreateInput = {
    id?: string;
    matchId: string;
    numSet: number;
    events?: Prisma.EventUncheckedCreateNestedManyWithoutSetInput;
};
export type SetUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    numSet?: Prisma.IntFieldUpdateOperationsInput | number;
    match?: Prisma.MatchUpdateOneRequiredWithoutSetsNestedInput;
    events?: Prisma.EventUpdateManyWithoutSetNestedInput;
};
export type SetUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    matchId?: Prisma.StringFieldUpdateOperationsInput | string;
    numSet?: Prisma.IntFieldUpdateOperationsInput | number;
    events?: Prisma.EventUncheckedUpdateManyWithoutSetNestedInput;
};
export type SetCreateManyInput = {
    id?: string;
    matchId: string;
    numSet: number;
};
export type SetUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    numSet?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SetUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    matchId?: Prisma.StringFieldUpdateOperationsInput | string;
    numSet?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SetListRelationFilter = {
    every?: Prisma.SetWhereInput;
    some?: Prisma.SetWhereInput;
    none?: Prisma.SetWhereInput;
};
export type SetOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SetMatchIdNumSetCompoundUniqueInput = {
    matchId: string;
    numSet: number;
};
export type SetCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    matchId?: Prisma.SortOrder;
    numSet?: Prisma.SortOrder;
};
export type SetAvgOrderByAggregateInput = {
    numSet?: Prisma.SortOrder;
};
export type SetMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    matchId?: Prisma.SortOrder;
    numSet?: Prisma.SortOrder;
};
export type SetMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    matchId?: Prisma.SortOrder;
    numSet?: Prisma.SortOrder;
};
export type SetSumOrderByAggregateInput = {
    numSet?: Prisma.SortOrder;
};
export type SetScalarRelationFilter = {
    is?: Prisma.SetWhereInput;
    isNot?: Prisma.SetWhereInput;
};
export type SetCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.SetCreateWithoutMatchInput, Prisma.SetUncheckedCreateWithoutMatchInput> | Prisma.SetCreateWithoutMatchInput[] | Prisma.SetUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.SetCreateOrConnectWithoutMatchInput | Prisma.SetCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.SetCreateManyMatchInputEnvelope;
    connect?: Prisma.SetWhereUniqueInput | Prisma.SetWhereUniqueInput[];
};
export type SetUncheckedCreateNestedManyWithoutMatchInput = {
    create?: Prisma.XOR<Prisma.SetCreateWithoutMatchInput, Prisma.SetUncheckedCreateWithoutMatchInput> | Prisma.SetCreateWithoutMatchInput[] | Prisma.SetUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.SetCreateOrConnectWithoutMatchInput | Prisma.SetCreateOrConnectWithoutMatchInput[];
    createMany?: Prisma.SetCreateManyMatchInputEnvelope;
    connect?: Prisma.SetWhereUniqueInput | Prisma.SetWhereUniqueInput[];
};
export type SetUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.SetCreateWithoutMatchInput, Prisma.SetUncheckedCreateWithoutMatchInput> | Prisma.SetCreateWithoutMatchInput[] | Prisma.SetUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.SetCreateOrConnectWithoutMatchInput | Prisma.SetCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.SetUpsertWithWhereUniqueWithoutMatchInput | Prisma.SetUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.SetCreateManyMatchInputEnvelope;
    set?: Prisma.SetWhereUniqueInput | Prisma.SetWhereUniqueInput[];
    disconnect?: Prisma.SetWhereUniqueInput | Prisma.SetWhereUniqueInput[];
    delete?: Prisma.SetWhereUniqueInput | Prisma.SetWhereUniqueInput[];
    connect?: Prisma.SetWhereUniqueInput | Prisma.SetWhereUniqueInput[];
    update?: Prisma.SetUpdateWithWhereUniqueWithoutMatchInput | Prisma.SetUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.SetUpdateManyWithWhereWithoutMatchInput | Prisma.SetUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.SetScalarWhereInput | Prisma.SetScalarWhereInput[];
};
export type SetUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: Prisma.XOR<Prisma.SetCreateWithoutMatchInput, Prisma.SetUncheckedCreateWithoutMatchInput> | Prisma.SetCreateWithoutMatchInput[] | Prisma.SetUncheckedCreateWithoutMatchInput[];
    connectOrCreate?: Prisma.SetCreateOrConnectWithoutMatchInput | Prisma.SetCreateOrConnectWithoutMatchInput[];
    upsert?: Prisma.SetUpsertWithWhereUniqueWithoutMatchInput | Prisma.SetUpsertWithWhereUniqueWithoutMatchInput[];
    createMany?: Prisma.SetCreateManyMatchInputEnvelope;
    set?: Prisma.SetWhereUniqueInput | Prisma.SetWhereUniqueInput[];
    disconnect?: Prisma.SetWhereUniqueInput | Prisma.SetWhereUniqueInput[];
    delete?: Prisma.SetWhereUniqueInput | Prisma.SetWhereUniqueInput[];
    connect?: Prisma.SetWhereUniqueInput | Prisma.SetWhereUniqueInput[];
    update?: Prisma.SetUpdateWithWhereUniqueWithoutMatchInput | Prisma.SetUpdateWithWhereUniqueWithoutMatchInput[];
    updateMany?: Prisma.SetUpdateManyWithWhereWithoutMatchInput | Prisma.SetUpdateManyWithWhereWithoutMatchInput[];
    deleteMany?: Prisma.SetScalarWhereInput | Prisma.SetScalarWhereInput[];
};
export type SetCreateNestedOneWithoutEventsInput = {
    create?: Prisma.XOR<Prisma.SetCreateWithoutEventsInput, Prisma.SetUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.SetCreateOrConnectWithoutEventsInput;
    connect?: Prisma.SetWhereUniqueInput;
};
export type SetUpdateOneRequiredWithoutEventsNestedInput = {
    create?: Prisma.XOR<Prisma.SetCreateWithoutEventsInput, Prisma.SetUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.SetCreateOrConnectWithoutEventsInput;
    upsert?: Prisma.SetUpsertWithoutEventsInput;
    connect?: Prisma.SetWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SetUpdateToOneWithWhereWithoutEventsInput, Prisma.SetUpdateWithoutEventsInput>, Prisma.SetUncheckedUpdateWithoutEventsInput>;
};
export type SetCreateWithoutMatchInput = {
    id?: string;
    numSet: number;
    events?: Prisma.EventCreateNestedManyWithoutSetInput;
};
export type SetUncheckedCreateWithoutMatchInput = {
    id?: string;
    numSet: number;
    events?: Prisma.EventUncheckedCreateNestedManyWithoutSetInput;
};
export type SetCreateOrConnectWithoutMatchInput = {
    where: Prisma.SetWhereUniqueInput;
    create: Prisma.XOR<Prisma.SetCreateWithoutMatchInput, Prisma.SetUncheckedCreateWithoutMatchInput>;
};
export type SetCreateManyMatchInputEnvelope = {
    data: Prisma.SetCreateManyMatchInput | Prisma.SetCreateManyMatchInput[];
    skipDuplicates?: boolean;
};
export type SetUpsertWithWhereUniqueWithoutMatchInput = {
    where: Prisma.SetWhereUniqueInput;
    update: Prisma.XOR<Prisma.SetUpdateWithoutMatchInput, Prisma.SetUncheckedUpdateWithoutMatchInput>;
    create: Prisma.XOR<Prisma.SetCreateWithoutMatchInput, Prisma.SetUncheckedCreateWithoutMatchInput>;
};
export type SetUpdateWithWhereUniqueWithoutMatchInput = {
    where: Prisma.SetWhereUniqueInput;
    data: Prisma.XOR<Prisma.SetUpdateWithoutMatchInput, Prisma.SetUncheckedUpdateWithoutMatchInput>;
};
export type SetUpdateManyWithWhereWithoutMatchInput = {
    where: Prisma.SetScalarWhereInput;
    data: Prisma.XOR<Prisma.SetUpdateManyMutationInput, Prisma.SetUncheckedUpdateManyWithoutMatchInput>;
};
export type SetScalarWhereInput = {
    AND?: Prisma.SetScalarWhereInput | Prisma.SetScalarWhereInput[];
    OR?: Prisma.SetScalarWhereInput[];
    NOT?: Prisma.SetScalarWhereInput | Prisma.SetScalarWhereInput[];
    id?: Prisma.UuidFilter<"Set"> | string;
    matchId?: Prisma.UuidFilter<"Set"> | string;
    numSet?: Prisma.IntFilter<"Set"> | number;
};
export type SetCreateWithoutEventsInput = {
    id?: string;
    numSet: number;
    match: Prisma.MatchCreateNestedOneWithoutSetsInput;
};
export type SetUncheckedCreateWithoutEventsInput = {
    id?: string;
    matchId: string;
    numSet: number;
};
export type SetCreateOrConnectWithoutEventsInput = {
    where: Prisma.SetWhereUniqueInput;
    create: Prisma.XOR<Prisma.SetCreateWithoutEventsInput, Prisma.SetUncheckedCreateWithoutEventsInput>;
};
export type SetUpsertWithoutEventsInput = {
    update: Prisma.XOR<Prisma.SetUpdateWithoutEventsInput, Prisma.SetUncheckedUpdateWithoutEventsInput>;
    create: Prisma.XOR<Prisma.SetCreateWithoutEventsInput, Prisma.SetUncheckedCreateWithoutEventsInput>;
    where?: Prisma.SetWhereInput;
};
export type SetUpdateToOneWithWhereWithoutEventsInput = {
    where?: Prisma.SetWhereInput;
    data: Prisma.XOR<Prisma.SetUpdateWithoutEventsInput, Prisma.SetUncheckedUpdateWithoutEventsInput>;
};
export type SetUpdateWithoutEventsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    numSet?: Prisma.IntFieldUpdateOperationsInput | number;
    match?: Prisma.MatchUpdateOneRequiredWithoutSetsNestedInput;
};
export type SetUncheckedUpdateWithoutEventsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    matchId?: Prisma.StringFieldUpdateOperationsInput | string;
    numSet?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SetCreateManyMatchInput = {
    id?: string;
    numSet: number;
};
export type SetUpdateWithoutMatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    numSet?: Prisma.IntFieldUpdateOperationsInput | number;
    events?: Prisma.EventUpdateManyWithoutSetNestedInput;
};
export type SetUncheckedUpdateWithoutMatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    numSet?: Prisma.IntFieldUpdateOperationsInput | number;
    events?: Prisma.EventUncheckedUpdateManyWithoutSetNestedInput;
};
export type SetUncheckedUpdateManyWithoutMatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    numSet?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type SetCountOutputType = {
    events: number;
};
export type SetCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    events?: boolean | SetCountOutputTypeCountEventsArgs;
};
export type SetCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SetCountOutputTypeSelect<ExtArgs> | null;
};
export type SetCountOutputTypeCountEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
};
export type SetSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    matchId?: boolean;
    numSet?: boolean;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    events?: boolean | Prisma.Set$eventsArgs<ExtArgs>;
    _count?: boolean | Prisma.SetCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["set"]>;
export type SetSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    matchId?: boolean;
    numSet?: boolean;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["set"]>;
export type SetSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    matchId?: boolean;
    numSet?: boolean;
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["set"]>;
export type SetSelectScalar = {
    id?: boolean;
    matchId?: boolean;
    numSet?: boolean;
};
export type SetOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "matchId" | "numSet", ExtArgs["result"]["set"]>;
export type SetInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
    events?: boolean | Prisma.Set$eventsArgs<ExtArgs>;
    _count?: boolean | Prisma.SetCountOutputTypeDefaultArgs<ExtArgs>;
};
export type SetIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
};
export type SetIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    match?: boolean | Prisma.MatchDefaultArgs<ExtArgs>;
};
export type $SetPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Set";
    objects: {
        match: Prisma.$MatchPayload<ExtArgs>;
        events: Prisma.$EventPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        matchId: string;
        numSet: number;
    }, ExtArgs["result"]["set"]>;
    composites: {};
};
export type SetGetPayload<S extends boolean | null | undefined | SetDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SetPayload, S>;
export type SetCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SetCountAggregateInputType | true;
};
export interface SetDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Set'];
        meta: {
            name: 'Set';
        };
    };
    findUnique<T extends SetFindUniqueArgs>(args: Prisma.SelectSubset<T, SetFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SetClient<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SetFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SetFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SetClient<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SetFindFirstArgs>(args?: Prisma.SelectSubset<T, SetFindFirstArgs<ExtArgs>>): Prisma.Prisma__SetClient<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SetFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SetFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SetClient<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SetFindManyArgs>(args?: Prisma.SelectSubset<T, SetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SetCreateArgs>(args: Prisma.SelectSubset<T, SetCreateArgs<ExtArgs>>): Prisma.Prisma__SetClient<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SetCreateManyArgs>(args?: Prisma.SelectSubset<T, SetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SetCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SetDeleteArgs>(args: Prisma.SelectSubset<T, SetDeleteArgs<ExtArgs>>): Prisma.Prisma__SetClient<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SetUpdateArgs>(args: Prisma.SelectSubset<T, SetUpdateArgs<ExtArgs>>): Prisma.Prisma__SetClient<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SetDeleteManyArgs>(args?: Prisma.SelectSubset<T, SetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SetUpdateManyArgs>(args: Prisma.SelectSubset<T, SetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SetUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SetUpsertArgs>(args: Prisma.SelectSubset<T, SetUpsertArgs<ExtArgs>>): Prisma.Prisma__SetClient<runtime.Types.Result.GetResult<Prisma.$SetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SetCountArgs>(args?: Prisma.Subset<T, SetCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SetCountAggregateOutputType> : number>;
    aggregate<T extends SetAggregateArgs>(args: Prisma.Subset<T, SetAggregateArgs>): Prisma.PrismaPromise<GetSetAggregateType<T>>;
    groupBy<T extends SetGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SetGroupByArgs['orderBy'];
    } : {
        orderBy?: SetGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SetFieldRefs;
}
export interface Prisma__SetClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    match<T extends Prisma.MatchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MatchDefaultArgs<ExtArgs>>): Prisma.Prisma__MatchClient<runtime.Types.Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    events<T extends Prisma.Set$eventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Set$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SetFieldRefs {
    readonly id: Prisma.FieldRef<"Set", 'String'>;
    readonly matchId: Prisma.FieldRef<"Set", 'String'>;
    readonly numSet: Prisma.FieldRef<"Set", 'Int'>;
}
export type SetFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SetSelect<ExtArgs> | null;
    omit?: Prisma.SetOmit<ExtArgs> | null;
    include?: Prisma.SetInclude<ExtArgs> | null;
    where: Prisma.SetWhereUniqueInput;
};
export type SetFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SetSelect<ExtArgs> | null;
    omit?: Prisma.SetOmit<ExtArgs> | null;
    include?: Prisma.SetInclude<ExtArgs> | null;
    where: Prisma.SetWhereUniqueInput;
};
export type SetFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SetFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SetFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SetCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SetSelect<ExtArgs> | null;
    omit?: Prisma.SetOmit<ExtArgs> | null;
    include?: Prisma.SetInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SetCreateInput, Prisma.SetUncheckedCreateInput>;
};
export type SetCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SetCreateManyInput | Prisma.SetCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SetCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SetSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SetOmit<ExtArgs> | null;
    data: Prisma.SetCreateManyInput | Prisma.SetCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SetIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SetUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SetSelect<ExtArgs> | null;
    omit?: Prisma.SetOmit<ExtArgs> | null;
    include?: Prisma.SetInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SetUpdateInput, Prisma.SetUncheckedUpdateInput>;
    where: Prisma.SetWhereUniqueInput;
};
export type SetUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SetUpdateManyMutationInput, Prisma.SetUncheckedUpdateManyInput>;
    where?: Prisma.SetWhereInput;
    limit?: number;
};
export type SetUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SetSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SetOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SetUpdateManyMutationInput, Prisma.SetUncheckedUpdateManyInput>;
    where?: Prisma.SetWhereInput;
    limit?: number;
    include?: Prisma.SetIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SetUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SetSelect<ExtArgs> | null;
    omit?: Prisma.SetOmit<ExtArgs> | null;
    include?: Prisma.SetInclude<ExtArgs> | null;
    where: Prisma.SetWhereUniqueInput;
    create: Prisma.XOR<Prisma.SetCreateInput, Prisma.SetUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SetUpdateInput, Prisma.SetUncheckedUpdateInput>;
};
export type SetDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SetSelect<ExtArgs> | null;
    omit?: Prisma.SetOmit<ExtArgs> | null;
    include?: Prisma.SetInclude<ExtArgs> | null;
    where: Prisma.SetWhereUniqueInput;
};
export type SetDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SetWhereInput;
    limit?: number;
};
export type Set$eventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SetDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SetSelect<ExtArgs> | null;
    omit?: Prisma.SetOmit<ExtArgs> | null;
    include?: Prisma.SetInclude<ExtArgs> | null;
};

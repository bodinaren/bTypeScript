import { BaseIterator, IteratorResult } from "./iterator";
import * as Util from "../../util";
import { Linq } from "../linq";
export declare class GroupByIterator<TSource, TKey> extends BaseIterator<TSource> {
    private keySelector;
    private _previousKeys;
    private _isPipelineExecuted;
    constructor(source: TSource[] | BaseIterator<TSource>, keySelector: Util.ISelector<TSource, TKey>);
    next(): IteratorResult<IGrouping<TKey, TSource>>;
    private toArray();
}
export declare function groupByProto<TKey>(this: Linq<any>, keySelector: Util.ISelector<any, TKey> | string): Linq<IGrouping<TKey, any>>;
/**
 * Groups the elements of a sequence according to a specified key selector function.
 * @param keySelector A function to extract the key for each element.
 */
export declare function groupByStatic<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string): IGrouping<TKey, TSource>[];
export interface IGrouping<TKey, TValue> {
    key: TKey;
    values: TValue[];
}

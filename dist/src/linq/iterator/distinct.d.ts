import * as Util from "../../util";
import { BaseIterator, IteratorResult } from "./iterator";
import { Linq } from "../linq";
export declare class DistinctIterator<TSource> extends BaseIterator<TSource> {
    private comparer;
    private _previousItems;
    constructor(source: TSource[] | BaseIterator<TSource>, comparer?: Util.IEqualityComparer<any>);
    next(): IteratorResult<TSource>;
}
/**
 * Get a list of unique items that exists one or more times in the dataset.
 */
export declare function distinctProto<TSource>(this: Linq<TSource>, comparer?: Util.IEqualityComparer<TSource>): Linq<TSource>;
/**
 * Get a list of unique items that exists one or more times in any of the datasets.
 * @param source The datasets to be get distinct items from.
 */
export declare function distinctStatic<TSource>(source: TSource[] | Linq<TSource>, comparer?: Util.IEqualityComparer<TSource>): TSource[];

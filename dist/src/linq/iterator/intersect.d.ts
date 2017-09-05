import * as Util from "../../util";
import { BaseIterator, IteratorResult } from "./iterator";
import { Linq } from "../linq";
export declare class IntersectIterator<TSource> extends BaseIterator<TSource> {
    private comparer;
    private other;
    private otherItems;
    constructor(source: TSource[] | BaseIterator<TSource>, other: TSource[] | BaseIterator<TSource>, comparer?: Util.IEqualityComparer<TSource>);
    next(): IteratorResult<TSource>;
}
/**
 * Get a list of items that only exists in one of the datasets.
 * @param other The other dataset.
 */
export declare function intersectProto<TSource>(this: Linq<TSource>, other: TSource[] | Linq<TSource>, comparer?: Util.IEqualityComparer<TSource>): Linq<TSource>;
/**
 * Get a list of items that exists in all datasets.
 * @param a The first dataset.
 * @param b The second dataset to be compared to.
 * @param more If you have even more dataset to compare to.
 */
export declare function intersectStatic<TSource>(source: TSource[] | Linq<TSource>, other: TSource[] | Linq<TSource>, comparer?: Util.IEqualityComparer<TSource>): TSource[];

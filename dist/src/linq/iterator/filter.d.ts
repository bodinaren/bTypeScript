import { BaseIterator, IteratorResult } from "./iterator";
import * as Util from "../../util";
import { Linq } from "../linq";
export declare class FilterIterator<TSource> extends BaseIterator<TSource> {
    private callback;
    constructor(source: TSource[] | BaseIterator<TSource>, callback?: Util.IPredicate<TSource>);
    next(): IteratorResult<TSource>;
}
/**
 * Filters a sequence of values based on a predicate.
 * @param predicate A function to test each element for a condition.
 */
export declare function filterProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<TSource>): Linq<TSource>;
/**
 * Filters a sequence of values based on a predicate.
 * @param predicate A function to test each element for a condition.
 */
export declare function filterStatic<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[];

import { BaseIterator, IteratorResult } from "./iterator";
import * as Util from "../../util";
import { Linq } from "../linq";
export declare class TakeWhileIterator<TSource> extends BaseIterator<TSource> {
    private predicate;
    constructor(source: TSource[] | BaseIterator<TSource>, predicate?: Util.IPredicate<TSource>);
    next(): IteratorResult<TSource>;
}
/**
 * Returns elements from a sequence as long as a specified condition is true.
 * @param predicate A function to test each element for a condition.
 */
export declare function takeWhileProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<any>): Linq<TSource>;
/**
 * Returns elements from a sequence as long as a specified condition is true.
 * @param predicate A function to test each element for a condition.
 */
export declare function takeWhileStatic<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[];

import { BaseIterator, IteratorResult } from "./iterator";
import * as Util from "../../util";
import { Linq } from "../linq";
export declare class SkipWhileIterator<TSource> extends BaseIterator<TSource> {
    private predicate;
    private done;
    constructor(source: TSource[] | BaseIterator<TSource>, predicate?: Util.IPredicate<TSource>);
    next(): IteratorResult<TSource>;
}
/**
 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
 * @param predicate A function to test each element for a condition.
 */
export declare function skipWhileProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<any>): Linq<TSource>;
/**
 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
 * @param predicate A function to test each element for a condition.
 */
export declare function skipWhileStatic<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[];

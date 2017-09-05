import { BaseIterator, IteratorResult } from "./iterator";
import { Linq } from "../linq";
export declare class SkipIterator<TSource> extends BaseIterator<TSource> {
    private count;
    private counter;
    constructor(source: TSource[] | BaseIterator<TSource>, count: number);
    next(): IteratorResult<TSource>;
}
/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 * @param count The number of elements to skip before returning the remaining elements.
 */
export declare function skipProto<TSource>(this: Linq<TSource>, count: number): Linq<TSource>;
/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 * @param count The number of elements to skip before returning the remaining elements.
 */
export declare function skipStatic<TSource>(source: TSource[], count: number): TSource[];

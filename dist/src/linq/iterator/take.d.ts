import { BaseIterator, IteratorResult } from "./iterator";
import { Linq } from "../linq";
export declare class TakeIterator<TSource> extends BaseIterator<TSource> {
    private count;
    private _counter;
    constructor(source: TSource[] | BaseIterator<TSource>, count: number);
    next(): IteratorResult<TSource>;
}
/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @param count The number of elements to return.
 */
export declare function takeProto<TSource>(this: Linq<TSource>, count: number): Linq<TSource>;
/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @param count The number of elements to return.
 */
export declare function takeStatic<TSource>(source: TSource[], count: number): TSource[];

import { BaseIterator, IteratorResult } from "./iterator";
import { Linq } from "../linq";
export declare class MapIterator<TSource, TResult> extends BaseIterator<TSource> {
    private callback;
    constructor(source: TSource[] | BaseIterator<TSource>, callback: (item: TSource, idx: number) => TResult);
    next(): IteratorResult<TResult>;
}
export declare function mapProto<TResult>(this: Linq<any>, callback: (item: any, idx: number) => TResult): Linq<TResult>;
/**
 * Creates a new sequence with the results of calling a provided function on every element in this array.
 * @param callback Function that produces an element of the new sequence
 */
export declare function mapStatic<TSource, TResult>(source: TSource[], callback: (item: TSource, idx: number) => TResult): TResult[];

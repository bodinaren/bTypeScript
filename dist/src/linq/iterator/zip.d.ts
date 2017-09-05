import { BaseIterator, IteratorResult } from "./iterator";
import { Linq } from "../linq";
export declare class ZipIterator<TFirst, TSecond, TResult> extends BaseIterator<TFirst> {
    private other;
    private callback;
    constructor(source: TFirst[] | BaseIterator<TFirst>, other: TSecond[], callback: (a: TFirst, b: TSecond, idx: number) => TResult);
    next(): IteratorResult<TResult>;
}
export declare function zipProto<TOther, TResult>(this: Linq<any>, other: TOther[], callback: (a: any, b: TOther, idx: number) => TResult): Linq<TResult>;
/**
 * Merges items from the first sequence with the item at the corresponding index in the second sequence to
 * create a new sequence with the results of calling a provided function on every pair of items.
 * The zip will stop as soon as either of the sequences hits an undefined value.
 * @param other The second sequence to zip with
 * @param callback Function that produces an element of the new sequence
 */
export declare function zipStatic<TFirst, TSecond, TResult>(source: TFirst[], other: TSecond[], callback: (a: TFirst, b: TSecond, idx: number) => TResult): TResult[];

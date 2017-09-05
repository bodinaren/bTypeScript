import * as Util from "../../util";
import {BaseIterator, IteratorResult} from "./iterator";
import {Linq} from "../linq";

export class ZipIterator<TFirst, TSecond, TResult> extends BaseIterator<TFirst> {

    constructor(
        source: TFirst[] | BaseIterator<TFirst>,
        private other: TSecond[],
        private callback: (a: TFirst, b: TSecond, idx: number) => TResult
    ) {
        super(source);
    }

    next(): IteratorResult<TResult> {
        let item = super.next();
        if (!item.done) {
            let o = this.other[this._idx];
            if (!Util.isUndefined(o)) {
                return {
                    value: this.callback(item.value, o, this._idx),
                    done: false
                };
            }
        }

        return {
            value: undefined,
            done: true
        };
    }
}

function zip<TFirst, TSecond, TResult>(source: TFirst[] | BaseIterator<TFirst>, other: TSecond[], callback: (a: TFirst, b: TSecond, idx: number) => TResult): ZipIterator<TFirst, TSecond, TResult> {
    return new ZipIterator<TFirst, TSecond, TResult>(source, other, callback);
}

export function zipProto<TOther, TResult>(this: Linq<any>, other: TOther[], callback: (a: any, b: TOther, idx: number) => TResult): Linq<TResult>;
/**
 * Merges items from the first sequence with the item at the corresponding index in the second sequence to
 * create a new sequence with the results of calling a provided function on every pair of items.
 * The zip will stop as soon as either of the sequences hits an undefined value.
 * @param other The second sequence to zip with
 * @param callback Function that produces an element of the new sequence
 */
export function zipProto<TSource, TOther, TResult>(this: Linq<TSource>, other: TOther[], callback: (a: TSource, b: TOther, idx: number) => TResult): Linq<TResult> {
    return this.lift(zip, other, callback);
}

/**
 * Merges items from the first sequence with the item at the corresponding index in the second sequence to
 * create a new sequence with the results of calling a provided function on every pair of items.
 * The zip will stop as soon as either of the sequences hits an undefined value.
 * @param other The second sequence to zip with
 * @param callback Function that produces an element of the new sequence
 */
export function zipStatic<TFirst, TSecond, TResult>(source: TFirst[], other: TSecond[], callback: (a: TFirst, b: TSecond, idx: number) => TResult): TResult[] {
    // TODO: Write static zip function without instantiating a new Linq object
    return new Linq<TFirst>(source).zip<TSecond, TResult>(other, callback).toArray<TResult>();
}

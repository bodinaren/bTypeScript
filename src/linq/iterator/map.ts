import * as Util from "../../util";
import {BaseIterator, IteratorResult} from "./iterator";
import {Linq} from "../linq";

export class MapIterator<TSource, TResult> extends BaseIterator<TSource> {

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private callback: (item: TSource, idx: number) => TResult
    ) {
        super(source);
    }

    next(): IteratorResult<TResult> {
        let item = super.next();
        return (!Util.isUndefined(item.value))
            ? { value: this.callback(item.value, this._idx), done: false }
            : { value: undefined, done: true };
    }
}


function map<TSource, TResult>(source: TSource[] | BaseIterator<TSource>, callback: (item: TSource, idx: number) => TResult): MapIterator<TSource, TResult> {
    return new MapIterator<TSource, TResult>(source, callback);
}


export function mapProto<TResult>(this: Linq<any>, callback: (item: any, idx: number) => TResult): Linq<TResult>;

/**
 * Creates a new sequence with the results of calling a provided function on every element in this array.
 * @param callback Function that produces an element of the new sequence
 */
export function mapProto<TSource, TResult>(this: Linq<TSource>, callback: (item: TSource, idx: number) => TResult): Linq<TResult> {
    return this.lift(map, callback);
}

/**
 * Creates a new sequence with the results of calling a provided function on every element in this array.
 * @param callback Function that produces an element of the new sequence
 */
export function mapStatic<TSource, TResult>(source: TSource[], callback: (item: TSource, idx: number) => TResult): TResult[] {
    return source.map(callback);
}

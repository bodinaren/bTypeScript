import {BaseIterator, IteratorResult} from "./iterator/iterator";
import {MapIterator} from "./iterator/map";
import * as Util from "../util";

export class Linq<TSource> /*implements Iterable<any>*/ {
    public _source: BaseIterator<TSource>; // TODO: Figure out a way to not have it public (used in OrderByIterator)

    constructor(source: TSource[] | BaseIterator<TSource>) {
        this._source = (source instanceof BaseIterator)
            ? source
            : new MapIterator<TSource, TSource>(source, (item) => item);
    }

    lift(iterator: (source: any[] | BaseIterator<any>, ...args: any[]) => BaseIterator<TSource>, ...args: any[]): Linq<any> {
        return new Linq<any>(iterator(this._source, ...args));
    }

    /**
     * Inverts the order of the elements in a sequence.
     * This simply iterates the items from the end, and as such has no additional performance cost.
     */
    reverse(): Linq<TSource> {
        this._source.reverse();
        return this;
    }

    /**
     * Executes the pipeline and return the resulting array.
     */
    toArray<TResult>(): TResult[] {

        let res: IteratorResult<TResult>,
            arr = [];

        if (Util.isArray(this._source)) {
            arr = Util.cast<Array<TResult>>(this._source).slice();
        } else {
            while (!(res = this._source.next()).done) {
                arr.push(res.value);
            }
        }

        return arr;
    }

    // [Symbol.iterator]() {
    //     let idx = 0;
    //     return {
    //         next(): BaseIteratorResult<any> {
    //             let res;
    //             if (Util.isArray(this._source)) {
    //                 res = Util.cast<Array<any>>(this._source)[idx++];
    //             } else {
    //                 do {
    //                     res = this._source.next();
    //                 } while (!Util.isUndefined(res));
    //                 idx++;
    //             }
    //             if (res) {
    //                 return {
    //                     done: false,
    //                     value: res,
    //                 };
    //             } else {
    //                 return {
    //                     done: true,
    //                     value: undefined,
    //                 };
    //             }
    //         }
    //     };
    // }
}

export function LQ<TSource>(source: TSource[]) {
    return new Linq<TSource>(source);
}

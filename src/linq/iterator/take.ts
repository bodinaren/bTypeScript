import {BaseIterator, IteratorResult} from "./iterator";
import {Linq} from "../linq";

export class TakeIterator<TSource> extends BaseIterator<TSource> {
private _counter: number = 0;

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private count: number
    ) {
        super(source);
    }

    next(): IteratorResult<TSource> {
        if (this._counter < this.count) {
            this._counter++;
            return super.next();
        }
        return {
            value: undefined,
            done: true
        };
    }
}

function take<TSource>(source: TSource[] | BaseIterator<TSource>, count: number): TakeIterator<TSource> {
    return new TakeIterator<TSource>(source, count);
}

/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @param count The number of elements to return.
 */
export function takeProto<TSource>(this: Linq<TSource>, count: number): Linq<TSource> {
    return this.lift(take, count);
}

/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @param count The number of elements to return.
 */
export function takeStatic<TSource>(source: TSource[], count: number): TSource[] {
    return source.slice(0, count);
    // return new Linq(source).skip(count).toArray();
}

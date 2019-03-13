import {BaseIterator, IteratorResult} from "./iterator";
import {Linq} from "../linq";

export class SkipIterator<TSource> extends BaseIterator<TSource> {

    private counter = 0;

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private count: number
    ) {
        super(source);
    }

    next(): IteratorResult<TSource> {
        for (; this.counter < this.count; this.counter++) super.next();

        return super.next();
    }
}

function skip<TSource>(source: TSource[] | BaseIterator<TSource>, count: number): SkipIterator<TSource> {
    return new SkipIterator<TSource>(source, count);
}

/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 * @param count The number of elements to skip before returning the remaining elements.
 */
export function skipProto<TSource>(this: Linq<TSource>, count: number): Linq<TSource> {
    return this.lift(skip, count);
}

/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 * @param count The number of elements to skip before returning the remaining elements.
 */
export function skipStatic<TSource>(source: TSource[], count: number): TSource[] {
    return source.slice(count);
    // return new Linq(source).skip(count).toArray();
}

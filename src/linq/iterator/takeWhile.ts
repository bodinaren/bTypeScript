import {BaseIterator, IteratorResult} from "./iterator";
import * as Util from "../../util";
import {Linq} from "../linq";

export class TakeWhileIterator<TSource> extends BaseIterator<TSource> {

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private predicate: Util.IPredicate<TSource> = Util.defaultPredicate
    ) {
        super(source);
    }

    next(): IteratorResult<TSource> {
        let n = super.next();

        if (!n.done && !!this.predicate(n.value, this._idx)) {
            return {
                value: n.value,
                done: false
            };
        }

        return {
            value: undefined,
            done: true
        };
    }
}

function takeWhile<TSource>(source: TSource[] | BaseIterator<TSource>, predicate: Util.IPredicate<TSource>): TakeWhileIterator<TSource> {
    return new TakeWhileIterator<TSource>(source, predicate);
}

/**
 * Returns elements from a sequence as long as a specified condition is true.
 * @param predicate A function to test each element for a condition.
 */
export function takeWhileProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<any>): Linq<TSource> {
    return this.lift(takeWhile, predicate);
}

/**
 * Returns elements from a sequence as long as a specified condition is true.
 * @param predicate A function to test each element for a condition.
 */
export function takeWhileStatic<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[] {
    return new Linq<TSource>(source).takeWhile(predicate).toArray<TSource>();
}

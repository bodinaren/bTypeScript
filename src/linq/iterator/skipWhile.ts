import {BaseIterator, IteratorResult} from "./iterator";
import * as Util from "../../util";
import {Linq} from "../linq";

export class SkipWhileIterator<TSource> extends BaseIterator<TSource> {
    private done: boolean = false;

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private predicate: Util.IPredicate<TSource> = Util.defaultPredicate
    ) {
        super(source);
    }

    next(): IteratorResult<TSource> {
        let item: IteratorResult<TSource>;
        do {
            item = super.next();
        } while (!this.done && !Util.isUndefined(item.value) && this.predicate(item.value, this._idx));

        this.done = true;
        return item;
    }
}

function skipWhile<TSource>(source: TSource[] | BaseIterator<TSource>, predicate: Util.IPredicate<TSource>): SkipWhileIterator<TSource> {
    return new SkipWhileIterator<TSource>(source, predicate);
}

/**
 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
 * @param predicate A function to test each element for a condition.
 */
export function skipWhileProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<any>): Linq<TSource> {
    return this.lift(skipWhile, predicate);
}

/**
 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
 * @param predicate A function to test each element for a condition.
 */
export function skipWhileStatic<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[] {
    return new Linq<TSource>(source).skipWhile(predicate).toArray<TSource>();
}

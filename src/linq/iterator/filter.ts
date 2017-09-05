import {BaseIterator, IteratorResult} from "./iterator";
import * as Util from "../../util";
import {Linq} from "../linq";

export class FilterIterator<TSource> extends BaseIterator<TSource> {

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private callback: Util.IPredicate<TSource> = Util.defaultPredicate
    ) {
        super(source);
    }

    next(): IteratorResult<TSource> {
        let item: IteratorResult<TSource>;

        while (!(item = super.next()).done) {
            if (this.callback(item.value, this._idx)) break;
        }

        return item;
    }
}

function filter<TSource>(source: TSource[] | BaseIterator<TSource>, predicate: Util.IPredicate<TSource>): FilterIterator<TSource> {
    return new FilterIterator<TSource>(source, predicate);
}

/**
 * Filters a sequence of values based on a predicate.
 * @param predicate A function to test each element for a condition.
 */
export function filterProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<TSource>): Linq<TSource> {
    return this.lift(filter, predicate);
}

/**
 * Filters a sequence of values based on a predicate.
 * @param predicate A function to test each element for a condition.
 */
export function filterStatic<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[] {
    return source.filter(predicate);
}

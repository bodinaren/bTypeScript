import {BaseIterator, IteratorResult} from "./iterator";
import {FilterIterator} from "./filter";
import * as Util from "../../util";
import {Linq} from "../linq";
import {makeValuePredicate} from "../makeValuePredicate";

export class JoinIterator<TOuter, TInner, TKey, TResult> extends BaseIterator<TOuter> {
    private _outerItem: IteratorResult<TOuter>;
    private _currentInnerSelection: FilterIterator<TInner>;
    private _counter = 0;

    constructor(
        outer: TOuter[] | BaseIterator<TOuter>,
        private inner: TInner[] | BaseIterator<TInner>,
        private outerKeySelector: Util.ISelector<TOuter, TKey>,
        private innerKeySelector: Util.ISelector<TInner, TKey>,
        private resultSelector: (outer: TOuter, inner: TInner) => TResult
    ) {
        super(outer);
    }

    next(): IteratorResult<TResult> {
        let innerItem: IteratorResult<TInner>;

        if (this._currentInnerSelection) {
            // We're doing the second loop of the same key.
            innerItem = this._currentInnerSelection.next();

            // We know we have received at least one item from this key before, so not receiving one now is not wrong.
            // It just means it was only a single inner item with this key, so we let it continue if below condition is not met.
            if (!Util.isUndefined(innerItem.value)) {
                this._counter++;
                return {
                    value: this.resultSelector(this._outerItem.value, innerItem.value),
                    done: false
                };
            }
        }

        do {
            this._outerItem = super.next();
            if (this._outerItem.done) return { value: undefined, done: true };

            if (!Util.isUndefined(this._outerItem.value)) {
                let outerKey = this.outerKeySelector(this._outerItem.value);

                this._currentInnerSelection = new FilterIterator(this.inner, x => outerKey === this.innerKeySelector(x));

                innerItem = this._currentInnerSelection.next();
            }

        } while (Util.isUndefined(innerItem.value));

        this._counter++;

        return {
            value: this.resultSelector(this._outerItem.value, innerItem.value),
            done: this._outerItem.done
        };
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

function join<TOuter, TInner, TKey, TResult>(
    outer: TOuter[] | BaseIterator<TOuter>,
    inner: TInner[],
    outerKeySelector: Util.ISelector<TOuter, TKey>,
    innerKeySelector: Util.ISelector<TInner, TKey>,
    resultSelector: (outer: TOuter, inner: TInner) => TResult
): JoinIterator<TOuter, TInner, TKey, TResult> {
    return new JoinIterator<TOuter, TInner, TKey, TResult>(outer, inner, outerKeySelector, innerKeySelector, resultSelector);
}

export function joinProto<TInner, TKey, TResult>(
    inner: TInner[],
    outerKeySelector: Util.ISelector<any, TKey> | string,
    innerKeySelector: Util.ISelector<TInner, TKey> | string,
    resultSelector: (outer: any, inner: TInner) => TResult
): Linq<TResult>;

/**
 * Correlates the elements of two sequences based on matching keys.
 * @param inner The sequence to join to the first sequence.
 * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
 * @param innerKeySelector A function to extract the join key from each element of the second sequence.
 * @param resultSelector A function to create a result element from two matching elements.
 */
export function joinProto<TSource, TInner, TKey, TResult>(
    inner: TInner[],
    outerKeySelector: Util.ISelector<TSource, TKey> | string,
    innerKeySelector: Util.ISelector<TInner, TKey> | string,
    resultSelector: (outer: TSource, inner: TInner) => TResult
): Linq<TResult> {

    let outerPred = makeValuePredicate(outerKeySelector),
        innerPred = makeValuePredicate(innerKeySelector);

    return this.lift(join, inner, outerPred, innerPred, resultSelector);
}

/**
 * Correlates the elements of two sequences based on matching keys.
 * @param outer The first sequence to join.
 * @param inner The sequence to join to the first sequence.
 * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
 * @param innerKeySelector A function to extract the join key from each element of the second sequence.
 * @param resultSelector A function to create a result element from two matching elements.
 */
export function joinStatic<TOuter, TInner, TKey, TResult>(
    outer: TOuter[],
    inner: TInner[],
    outerKeySelector: Util.ISelector<TOuter, TKey> | string,
    innerKeySelector: Util.ISelector<TInner, TKey> | string,
    resultSelector: (outer: TOuter, inner: TInner) => TResult
): TResult[] {
    // TODO: Write static join function without instantiating a new Linq object
    return new Linq(outer).join(inner, outerKeySelector, innerKeySelector, resultSelector).toArray<TResult>();
}

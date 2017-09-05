import { BaseIterator, IteratorResult } from "./iterator";
import * as Util from "../../util";
import { Linq } from "../linq";
export declare class JoinIterator<TOuter, TInner, TKey, TResult> extends BaseIterator<TOuter> {
    private inner;
    private outerKeySelector;
    private innerKeySelector;
    private resultSelector;
    private _outerItem;
    private _currentInnerSelection;
    private _counter;
    constructor(outer: TOuter[] | BaseIterator<TOuter>, inner: TInner[] | BaseIterator<TInner>, outerKeySelector: Util.ISelector<TOuter, TKey>, innerKeySelector: Util.ISelector<TInner, TKey>, resultSelector: (outer: TOuter, inner: TInner) => TResult);
    next(): IteratorResult<TResult>;
}
/**
 * Filters a sequence of values based on a predicate.
 * @param predicate A function to test each element for a condition.
 */
export declare function filterProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<TSource>): Linq<TSource>;
/**
 * Filters a sequence of values based on a predicate.
 * @param predicate A function to test each element for a condition.
 */
export declare function filterStatic<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[];
export declare function joinProto<TInner, TKey, TResult>(inner: TInner[], outerKeySelector: Util.ISelector<any, TKey> | string, innerKeySelector: Util.ISelector<TInner, TKey> | string, resultSelector: (outer: any, inner: TInner) => TResult): Linq<TResult>;
/**
 * Correlates the elements of two sequences based on matching keys.
 * @param outer The first sequence to join.
 * @param inner The sequence to join to the first sequence.
 * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
 * @param innerKeySelector A function to extract the join key from each element of the second sequence.
 * @param resultSelector A function to create a result element from two matching elements.
 */
export declare function joinStatic<TOuter, TInner, TKey, TResult>(outer: TOuter[], inner: TInner[], outerKeySelector: Util.ISelector<TOuter, TKey> | string, innerKeySelector: Util.ISelector<TInner, TKey> | string, resultSelector: (outer: TOuter, inner: TInner) => TResult): TResult[];

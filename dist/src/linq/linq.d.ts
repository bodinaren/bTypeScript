import { BaseIterator, IGrouping } from "./";
import * as Util from "../util";
export default class Linq<TSource> {
    protected _source: BaseIterator<TSource>;
    constructor(source: TSource[] | BaseIterator<TSource>);
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    map<TResult>(callback: (item: TSource, idx: number) => TResult): Linq<TResult>;
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    static map<TSource, TResult>(source: TSource[], callback: (item: TSource, idx: number) => TResult): TResult[];
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    filter(predicate: Util.IPredicate<TSource>): Linq<TSource>;
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    static filter<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[];
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    where(predicate: Util.IPredicate<TSource>): Linq<TSource>;
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    static where<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[];
    /**
     * Inverts the order of the elements in a sequence.
     */
    reverse(): Linq<TSource>;
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    take(count: number): Linq<TSource>;
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    static take<TSource>(source: TSource[], count: number): TSource[];
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    takeWhile(predicate: Util.IPredicate<TSource>): Linq<TSource>;
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    static takeWhile<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[];
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    skip(count: number): Linq<TSource>;
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    static skip<TSource>(source: TSource[], count: number): TSource[];
    /**
     * Merges items from the first sequence with the item at the corresponding index in the second sequence to
     * create a new sequence with the results of calling a provided function on every pair of items.
     * The zip will stop as soon as either of the sequences hits an undefined value.
     * @param other The second sequence to zip with
     * @param callback Function that produces an element of the new sequence
     */
    zip<TOther, TResult>(other: TOther[], callback: (a: any, b: TOther, idx: number) => TResult): Linq<TResult>;
    /**
     * Merges items from the first sequence with the item at the corresponding index in the second sequence to
     * create a new sequence with the results of calling a provided function on every pair of items.
     * The zip will stop as soon as either of the sequences hits an undefined value.
     * @param other The second sequence to zip with
     * @param callback Function that produces an element of the new sequence
     */
    static zip<TSource, TOther, TResult>(source: TSource[], other: TOther[], callback: (a: TSource, b: TOther, idx: number) => TResult): TResult[];
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    skipWhile(predicate: Util.IPredicate<TSource>): Linq<TSource>;
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    static skipWhile<TSource>(source: TSource[], predicate: Util.IPredicate<any>): TSource[];
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    orderBy<TKey>(keySelector: Util.ISelector<TSource, TKey> | string, comparer?: Util.IComparer<TKey>): OrderedLinq<TSource, TKey>;
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    static orderBy<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string, comparer?: Util.IComparer<TKey>): TSource[];
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    orderByDesc<TKey>(keySelector: Util.ISelector<TSource, TKey> | string, comparer?: Util.IComparer<TKey>): OrderedLinq<TSource, TKey>;
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    static orderByDesc<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string, comparer?: Util.IComparer<TKey>): TSource[];
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    sum(selector?: Util.ISelector<TSource, number>): number;
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    static sum<TSource>(source: TSource[], selector?: Util.ISelector<TSource, number>): number;
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    average(selector?: Util.ISelector<TSource, number>): number;
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    static average<TSource>(source: TSource[], selector?: Util.ISelector<TSource, number>): number;
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @alias average
     * @param selector
     */
    avg(selector?: Util.ISelector<TSource, number>): number;
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @alias average
     * @param selector
     */
    static avg<TSource>(source: TSource[], selector?: Util.ISelector<TSource, number>): number;
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    min(selector?: Util.ISelector<TSource, number>): number;
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    static min<TSource>(source: TSource[], selector?: Util.ISelector<TSource, number>): number;
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    max(selector?: Util.ISelector<TSource, number>): number;
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    static max<TSource>(source: TSource[], selector?: Util.ISelector<TSource, number>): number;
    /**
     * Determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
     * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
     */
    any(predicate: Util.IPredicate<TSource>, invert?: boolean): boolean;
    /**
     * Determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
     * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
     */
    static any<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert?: boolean): boolean;
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @param invert If true, determines whether none elements of a sequence satisfy a condition.
     */
    all(predicate: Util.IPredicate<TSource>, invert?: boolean): boolean;
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @param invert If true, determines whether none elements of a sequence satisfy a condition.
     */
    static all<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert?: boolean): boolean;
    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error.
     */
    single(predicate: Util.IPredicate<TSource>): TSource;
    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error
     */
    static single<TSource>(source: TSource[], predicate: (predicate) => boolean): TSource;
    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    first(predicate?: Util.IPredicate<TSource>): any;
    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    static first<TSource>(source: TSource[], predicate?: Util.IPredicate<TSource>): TSource;
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    last(predicate?: Util.IPredicate<TSource>): TSource;
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    static last<TSource>(source: TSource[], predicate?: Util.IPredicate<TSource>): TSource;
    /**
     * Get a list of items that exists in all datasets.
     * @param a The first dataset.
     * @param b The second dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    static intersect<TSource>(source: TSource[] | Linq<TSource>, other: TSource[] | Linq<TSource>, comparer?: Util.IEqualityComparer<TSource>): TSource[];
    /**
     * Get a list of items that exists in all datasets.
     * @param other The other dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    intersect(other: TSource[], comparer?: Util.IEqualityComparer<TSource>): Linq<TSource>;
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param a The first dataset.
     * @param b The second dataset.
     */
    static except<TSource>(source: TSource[] | Linq<TSource>, other: TSource[] | Linq<TSource>, comparer?: Util.IEqualityComparer<TSource>): TSource[];
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param other The other dataset.
     */
    except(other: TSource[], comparer?: Util.IEqualityComparer<TSource>): Linq<TSource>;
    /**
     * Get a list of unique items that exists one or more times in any of the datasets.
     * @param source The datasets to be get distinct items from.
     */
    static distinct<TSource>(source: TSource[] | Linq<TSource>, comparer?: Util.IEqualityComparer<TSource>): TSource[];
    /**
     * Get a list of unique items that exists one or more times in the dataset.
     */
    distinct(comparer?: Util.IEqualityComparer<TSource>): Linq<TSource>;
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    groupBy<TKey>(keySelector: Util.ISelector<TSource, TKey> | string): Linq<IGrouping<TKey, TSource>>;
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    static groupBy<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string): IGrouping<TKey, TSource>[];
    /**
     * Correlates the elements of two sequences based on matching keys.
     * @param inner The sequence to join to the first sequence.
     * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
     * @param innerKeySelector A function to extract the join key from each element of the second sequence.
     * @param resultSelector A function to create a result element from two matching elements.
     */
    join<TInner, TKey, TResult>(inner: TInner[], outerKeySelector: Util.ISelector<TSource, TKey> | string, innerKeySelector: Util.ISelector<TInner, TKey> | string, resultSelector: (outer: TSource, inner: TInner) => TResult): Linq<TResult>;
    /**
     * Correlates the elements of two sequences based on matching keys.
     * @param outer The first sequence to join.
     * @param inner The sequence to join to the first sequence.
     * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
     * @param innerKeySelector A function to extract the join key from each element of the second sequence.
     * @param resultSelector A function to create a result element from two matching elements.
     */
    static join<TOuter, TInner, TKey, TResult>(outer: TOuter[], inner: TInner[], outerKeySelector: Util.ISelector<TOuter, TKey> | string, innerKeySelector: Util.ISelector<TInner, TKey> | string, resultSelector: (outer: TOuter, inner: TInner) => TResult): TResult[];
    /**
     * Executes the pipeline and return the resulting array.
     */
    toArray<TResult>(): TResult[];
    private contains(a);
}
export declare function LQ<TSource>(source: TSource[]): Linq<TSource>;
export declare class OrderedLinq<TSource, TKey> extends Linq<TSource> {
    constructor(source: TSource[] | BaseIterator<TSource>);
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenBy(keySelector: Util.ISelector<TSource, TKey> | string, comparer?: Util.IComparer<TKey>): OrderedLinq<TSource, TKey>;
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenByDesc(keySelector: Util.ISelector<TSource, TKey> | string, comparer?: Util.IComparer<TKey>): OrderedLinq<TSource, TKey>;
}

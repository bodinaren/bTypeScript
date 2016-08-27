import Iterator from "./iterator";
import * as Util from "../util";
export default class Linq {
    protected _source: Iterator;
    constructor(source: any[] | Iterator);
    _makeValuePredicate(predicate: any): (predicate) => any;
    _makeBoolPredicate(predicate: any): (predicate) => boolean;
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    map(callback: (item: any, idx: number) => any): Linq;
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    static map<T, U>(source: T[], callback: (item: any, idx: number) => U): U[];
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    filter(predicate: (value, index) => boolean): Linq;
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    static filter<T>(source: T[], predicate: (value, index) => boolean): T[];
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    where(predicate: (predicate) => boolean): Linq;
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    static where<T>(source: T[], predicate: (predicate) => boolean): T[];
    /**
     * Inverts the order of the elements in a sequence.
     */
    reverse(): Linq;
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    take(count: number): Linq;
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    static take<T>(source: T[], count: number): T[];
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    takeWhile(predicate?: Util.IPredicate<any>): Linq;
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    static takeWhile<T>(source: T[], predicate?: Util.IPredicate<any>): T[];
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    skip(count: number): Linq;
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    static skip<T>(source: T[], count: number): T[];
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    skipWhile(predicate?: Util.IPredicate<any>): Linq;
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    static skipWhile<T>(source: T[], predicate?: Util.IPredicate<any>): T[];
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    orderBy(keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): OrderedLinq;
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    static orderBy<T>(source: T[], keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): T[];
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    orderByDesc(keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): OrderedLinq;
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    static orderByDesc<T>(source: T[], keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): T[];
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    sum(selector?: Util.ISelector<any, number>): number;
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    static sum(source: any[], selector?: Util.ISelector<any, number>): number;
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    average(selector?: Util.ISelector<any, number>): number;
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @alias average
     * @param selector
     */
    avg(selector?: Util.ISelector<any, number>): number;
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    static average(source: any[], selector?: Util.ISelector<any, number>): number;
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @alias average
     * @param selector
     */
    static avg(source: any[], selector?: Util.ISelector<any, number>): number;
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    min(selector?: Util.ISelector<any, number>): number;
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    static min(source: any[], selector?: Util.ISelector<any, number>): number;
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    max(selector?: Util.ISelector<any, number>): number;
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    static max(source: any[], selector?: Util.ISelector<any, number>): number;
    /**
     * Determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
     * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
     */
    any(predicate: (predicate) => boolean, invert?: boolean): boolean;
    /**
     * Determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
     * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
     */
    static any(source: any[], predicate: (predicate) => boolean, invert?: boolean): boolean;
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @param invert If true, determines whether none elements of a sequence satisfy a condition.
     */
    all(predicate: (predicate) => boolean, invert?: boolean): boolean;
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @param invert If true, determines whether none elements of a sequence satisfy a condition.
     */
    static all(source: any[], predicate: (predicate) => boolean, invert?: boolean): boolean;
    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error.
     */
    single<T>(predicate: (predicate) => boolean): T;
    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error
     */
    static single<T>(source: T[], predicate: (predicate) => boolean): T;
    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    first(predicate?: (predicate) => boolean): any;
    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    static first(source: any[], predicate?: (predicate) => boolean): any;
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    last(predicate?: (predicate) => boolean): any;
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    static last(source: any[], predicate?: (predicate) => boolean): any;
    /**
     * Get a list of items that exists in all datasets.
     * @param a The first dataset.
     * @param b The second dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    static intersect(a: any[] | Linq, b: any[] | Linq, ...more: Array<any[] | Linq>): any[];
    /**
     * Get a list of items that exists in all datasets.
     * @param other The other dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    intersect(other: any[] | Linq, ...more: Array<any[] | Linq>): Linq;
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param a The first dataset.
     * @param b The second dataset.
     * @param more If you have even more dataset to compare to.
     */
    static except(a: any[] | Linq, b: any[] | Linq, ...more: Array<any[] | Linq>): any[];
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param other The other dataset.
     * @param more If you have even more dataset to compare to.
     */
    except(other: any[] | Linq, ...more: Array<any[] | Linq>): Linq;
    /**
     * Get a list of unique items that exists one or more times in any of the datasets.
     * @param datasets The other datasets to be get distinct items from.
     */
    static distinct(...datasets: Array<any[] | Linq>): any[];
    /**
     * Get a list of unique items that exists one or more times in the datasets.
     */
    distinct(): Linq;
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    groupBy(keySelector: Util.ISelector<any, any> | string): Linq;
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    static groupBy(source: any[], keySelector: Util.ISelector<any, any> | string): IGrouping[];
    /**
     * Executes the pipeline and return the resulting array.
     */
    toArray(): any[];
    /**
     * Executes the pipeline and execute callback on each item in the resulting array.
     * Same as doing .toArray().forEach(callback);
     * @param callback {Util.ILoopFunction<any>} forEach is cancelled as soon as it returns false
     * @return {boolean} Weither the callback was executed on all items or not.
     */
    forEach(callback: Util.ILoopFunction<any>): boolean;
    private contains(a);
}
export declare function LQ(source: any[]): Linq;
export interface IGrouping {
    key: any;
    values: any[];
}
export declare class OrderedLinq extends Linq {
    constructor(source: any[] | Iterator);
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenBy(keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): OrderedLinq;
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenByDesc(keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): OrderedLinq;
}

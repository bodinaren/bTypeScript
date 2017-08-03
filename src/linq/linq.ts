import {
    BaseIterator,
    IteratorResult,
    FilterIterator,
    MapIterator,
    OrderIterator,
    SkipIterator,
    SkipWhileIterator,
    TakeIterator,
    TakeWhileIterator,
    ZipIterator,
    JoinIterator,
    GroupByIterator,
    ExceptIterator,
    IntersectIterator,
    DistinctIterator,
    IGrouping
} from "./";
import * as Util from "../util";

export default class Linq<TSource> /*implements Iterable<any>*/ {
    protected _source: BaseIterator<TSource>;

    constructor(source: TSource[] | BaseIterator<TSource>) {
        this._source = (source instanceof BaseIterator)
            ? source
            : new MapIterator<TSource, TSource>(source, (item) => item);
    }

    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    map<TResult>(callback: (item: TSource, idx: number) => TResult): Linq<TResult> {
        return new Linq<TResult>(new MapIterator<TSource, TResult>(this._source, callback));

        // try { return new Linq(new MapIterator(this._source, callback)); }
        // catch (ex) { throw this._errorHandler(ex) }
    }
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    static map<TSource, TResult>(source: TSource[], callback: (item: TSource, idx: number) => TResult): TResult[] {
        return source.map(callback);
    }

    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    filter(predicate: Util.IPredicate<TSource>): Linq<TSource> {
        return new Linq<TSource>(new FilterIterator<TSource>(this._source, predicate));
    }
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    static filter<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[] {
        return source.filter(predicate);
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
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    take(count: number): Linq<TSource> {
        return new Linq<TSource>(new TakeIterator<TSource>(this._source, count));
    }
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    static take<TSource>(source: TSource[], count: number): TSource[] {
        return source.slice(0, count);
        // return new Linq<TSource>(source).take(count).toArray();
    }

    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    takeWhile(predicate: Util.IPredicate<TSource>): Linq<TSource> {
        return new Linq<TSource>(new TakeWhileIterator<TSource>(this._source, predicate));
    }
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    static takeWhile<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>): TSource[] {
        return new Linq<TSource>(source).takeWhile(predicate).toArray<TSource>();
    }

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    skip(count: number): Linq<TSource> {
        return new Linq<TSource>(new SkipIterator<TSource>(this._source, count));
    }
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    static skip<TSource>(source: TSource[], count: number): TSource[] {
        return source.slice(count);
        // return new Linq(source).skip(count).toArray();
    }

    /**
     * Merges items from the first sequence with the item at the corresponding index in the second sequence to
     * create a new sequence with the results of calling a provided function on every pair of items.
     * The zip will stop as soon as either of the sequences hits an undefined value.
     * @param other The second sequence to zip with
     * @param callback Function that produces an element of the new sequence
     */
    zip<TOther, TResult>(other: TOther[], callback: (a: any, b: TOther, idx: number) => TResult): Linq<TResult> {
        return new Linq<TResult>(new ZipIterator<TSource, TOther, TResult>(this._source, other, callback));
    }
    /**
     * Merges items from the first sequence with the item at the corresponding index in the second sequence to
     * create a new sequence with the results of calling a provided function on every pair of items.
     * The zip will stop as soon as either of the sequences hits an undefined value.
     * @param other The second sequence to zip with
     * @param callback Function that produces an element of the new sequence
     */
    static zip<TSource, TOther, TResult>(source: TSource[], other: TOther[], callback: (a: TSource, b: TOther, idx: number) => TResult): TResult[] {
        // TODO: Write static zip function without instantiating a new Linq object
        return new Linq<TSource>(source).zip<TOther, TResult>(other, callback).toArray<TResult>();
    }

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    skipWhile(predicate: Util.IPredicate<TSource>): Linq<TSource> {
        return new Linq<TSource>(new SkipWhileIterator(this._source, predicate));
    }
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    static skipWhile<TSource>(source: TSource[], predicate: Util.IPredicate<any>): TSource[] {
        // TODO: Write static skipWhile function without instantiating a new Linq object
        return new Linq<TSource>(source).skipWhile(predicate).toArray<TSource>();
    }

    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    orderBy<TKey>(keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): OrderedLinq<TSource, TKey> {
        let selectorFn = _makeValuePredicate(keySelector);
        return new OrderedLinq<TSource, TKey>(new OrderIterator<TSource, TKey>(this._source, selectorFn, comparer, false));
    }
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    static orderBy<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): TSource[] {
        // TODO: Write static orderBy function without instantiating a new Linq object
        return new Linq<TSource>(source).orderBy<TKey>(keySelector, comparer).toArray<TSource>();
    }

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    orderByDesc<TKey>(keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): OrderedLinq<TSource, TKey> {
        let selectorFn = _makeValuePredicate(keySelector);
        return new OrderedLinq<TSource, TKey>(new OrderIterator<TSource, TKey>(this._source, selectorFn, comparer, true));
    }
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    static orderByDesc<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): TSource[] {
        // TODO: Write static orderByDesc function without instantiating a new Linq object
        return new Linq<TSource>(source).orderByDesc<TKey>(keySelector, comparer).toArray<TSource>();
    }

    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    sum(selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
        return Linq.sum(this.toArray<TSource>(), selector);
    }
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    static sum<TSource>(source: TSource[], selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
        let i, sum = 0;
        for (i = 0; i < source.length; i++) {
            sum += selector(source[i]);
        }
        return sum;
    }

    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    average(selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
        return Linq.average(this.toArray<TSource>(), selector);
    }
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    static average<TSource>(source: TSource[], selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
        let i, total = 0;
        for (i = 0; i < source.length; i++) {
            total += selector(source[i]);
        }
        return total / source.length;
    }

    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    min(selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
        return Linq.min(this.toArray<TSource>(), selector);
    }
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    static min<TSource>(source: TSource[], selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
        return Math.min.apply(undefined, source.map(selector));
    }

    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    max(selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
        return Linq.max(this.toArray<TSource>(), selector);
    }
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    static max<TSource>(source: TSource[], selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
        return Math.max.apply(undefined, source.map(selector));
    }

    /**
     * Determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
     * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
     */
    any(predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
        return typeof this.first(x => !!predicate(x) !== invert) !== "undefined";
    }
    /**
     * Determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
     * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
     */
    static any<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
        return source.some(x => !!predicate(x) !== invert);
    }

    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @param invert If true, determines whether none elements of a sequence satisfy a condition.
     */
    all(predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
        return !(this.any(predicate, !invert));
    }
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @param invert If true, determines whether none elements of a sequence satisfy a condition.
     */
    static all<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
        return source.every(x => !!predicate(x) !== invert);
    }

    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error.
     */
    single(predicate: Util.IPredicate<TSource>): TSource {
        let arr = this.filter(predicate).take(2).toArray<TSource>();
        if (arr.length == 0) throw new Error("The sequence is empty.");
        if (arr.length == 2) throw new Error("The sequence contains more than one element.");
        if (arr.length == 1) return arr[0];
    }
    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error
     */
    static single<TSource>(source: TSource[], predicate: (predicate) => boolean): TSource {
        // TODO: Write static single function without instantiating a new Linq object
        return new Linq<TSource>(source).single(predicate);
    }

    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    first(predicate: Util.IPredicate<TSource> = Util.defaultPredicate): any {
        let arr = this.filter(predicate).take(1).toArray();
        if (arr.length == 1) return arr[0];
        else return undefined;
    }
    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    static first<TSource>(source: TSource[], predicate?: Util.IPredicate<TSource>): TSource {
        // TODO: Write static first function without instantiating a new Linq object
        if (!source || source.length === 0) return undefined;
        if (!predicate) return source[0];
        return new Linq(source).first(predicate);
    }

    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    last(predicate: Util.IPredicate<TSource> = Util.defaultPredicate): TSource {
        return this.reverse().first(predicate);
    }
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    static last<TSource>(source: TSource[], predicate?: Util.IPredicate<TSource>): TSource {
        // TODO: Write static last function without instantiating a new Linq object
        if (!source || source.length === 0) return undefined;
        if (!predicate) return source[source.length - 1];
        return new Linq<TSource>(source).last(predicate);
    }

    /**
     * Get a list of items that exists in all datasets.
     * @param other The other dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    intersect(other: TSource[], comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): Linq<TSource> {
        return new Linq<TSource>(new IntersectIterator<TSource>(this._source, other, comparer));
    }
    /**
     * Get a list of items that exists in all datasets.
     * @param a The first dataset.
     * @param b The second dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    static intersect<TSource>(source: TSource[] | Linq<TSource>, other: TSource[] | Linq<TSource>, comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): TSource[] {

        let a: TSource[] = (source instanceof Linq) ? source.toArray<TSource>() : source,
            b: TSource[] = (other instanceof Linq) ? other.toArray<TSource>() : other;

        let result = [];

        a.forEach(x => {
            if (b.some(y => comparer(x, y))) result.push(x);
        });

        return result;

        // let lists: Array<any[]> = [], result = [];

        // let list = (a instanceof Linq) ? a.toArray() : a;
        // lists.push((b instanceof Linq) ? b.toArray() : b);
        // more.forEach((dataset) => {
        //     lists.push((dataset instanceof Linq) ? dataset.toArray() : dataset);
        // });

        // list.forEach(item => {
        //     let exists = lists.every(other => {
        //         if (!other.some(x => x === item)) return false;
        //         return true;
        //     });
        //     if (exists) result.push(item);
        // });

        // return result;
    }

    /**
     * Get a list of items that only exists in one of the datasets.
     * @param other The other dataset.
     */
    except(other: TSource[], comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): Linq<TSource> {
        return new Linq<TSource>(new ExceptIterator<TSource>(this._source, other, comparer));
    }
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param a The first dataset.
     * @param b The second dataset.
     */
    static except<TSource>(source: TSource[] | Linq<TSource>, other: TSource[] | Linq<TSource>, comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): TSource[] {

        let a: TSource[] = (source instanceof Linq) ? source.toArray<TSource>() : source,
            b: TSource[] = (other instanceof Linq) ? other.toArray<TSource>() : other;

        let result = [];

        a.forEach(x => {
            if (!b.some(y => comparer(x, y))) result.push(x);
        });

        return result;

        // lists.push((a instanceof Linq) ? a.toArray() : a);
        // lists.push((b instanceof Linq) ? b.toArray() : b);

        // let lists: Array<any[]> = [], result = [];

        // lists.push((a instanceof Linq) ? a.toArray() : a);
        // lists.push((b instanceof Linq) ? b.toArray() : b);
        // more.forEach(dataset => {
        //     lists.push((dataset instanceof Linq) ? dataset.toArray() : dataset);
        // });

        // lists.forEach(list => {
        //     list.forEach(item => {
        //         let exists = lists.some(other => {
        //             if (list === other) return;
        //             if (other.some(x =>  x === item)) return true;
        //         });
        //         if (!exists) result.push(item);
        //     });
        // });

        // return result;
    }

    /**
     * Get a list of unique items that exists one or more times in the dataset.
     */
    distinct(comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): Linq<TSource> {
        return new Linq<TSource>(new DistinctIterator<TSource>(this._source, comparer));
    }
    /**
     * Get a list of unique items that exists one or more times in any of the datasets.
     * @param source The datasets to be get distinct items from.
     */
    static distinct<TSource>(source: TSource[] | Linq<TSource>, comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): TSource[] {

        let a: TSource[] = (source instanceof Linq) ? source.toArray<TSource>() : source;

        let result = [];

        a.forEach(x => {
            if (!result.some(y => comparer(x, y))) result.push(x);
            // if (result.indexOf(x) === -1) 
        });

        return result;

        // let lists: Array<Linq> = [], result = [];

        // datasets.forEach(dataset => {
        //     lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast<any[]>(dataset)));
        // });

        // lists.forEach(list => {
        //     list.toArray().forEach(item => {
        //         if (result.indexOf(item) == -1)
        //             result.push(item);
        //     });
        // });

        // return result;
    }

    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    groupBy<TKey>(keySelector: Util.ISelector<TSource, TKey> | string): Linq<IGrouping<TKey, TSource>> {
        let pred = _makeValuePredicate(keySelector);

        return new Linq<IGrouping<TKey, TSource>>(new GroupByIterator<TSource, TKey>(this._source, pred));
    }
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    static groupBy<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string): IGrouping<TKey, TSource>[] {

        let i,
            arr: IGrouping<TKey, TSource>[] = [],
            pred = _makeValuePredicate(keySelector),
            group: IGrouping<TKey, TSource>,
            groupValue: any;

        for (i = 0; i < source.length; i++) {

            groupValue = pred(source[i]);
            group = new Linq(arr).first((x: IGrouping<TKey, TSource>) => x.key == groupValue);

            if (!group) {
                group = {
                    key: groupValue,
                    values: []
                };
                arr.push(group);
            }

            group.values.push(source[i]);
        }

        return arr;
    }

    /**
     * Correlates the elements of two sequences based on matching keys.
     * @param inner The sequence to join to the first sequence.
     * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
     * @param innerKeySelector A function to extract the join key from each element of the second sequence.
     * @param resultSelector A function to create a result element from two matching elements.
     */
    join<TInner, TKey, TResult>(inner: TInner[],
         outerKeySelector: Util.ISelector<TSource, TKey> | string,
         innerKeySelector: Util.ISelector<TInner, TKey> | string,
         resultSelector: (outer: TSource, inner: TInner) => TResult): Linq<TResult> {

        let outerPred = _makeValuePredicate(outerKeySelector),
            innerPred = _makeValuePredicate(innerKeySelector);

        return new Linq<TResult>(new JoinIterator<TSource, TInner, TKey, TResult>(this._source, inner, outerPred, innerPred, resultSelector));
    }
    /**
     * Correlates the elements of two sequences based on matching keys.
     * @param outer The first sequence to join.
     * @param inner The sequence to join to the first sequence.
     * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
     * @param innerKeySelector A function to extract the join key from each element of the second sequence.
     * @param resultSelector A function to create a result element from two matching elements.
     */
    static join<TOuter, TInner, TKey, TResult>(outer: TOuter[],
                   inner: TInner[],
                   outerKeySelector: Util.ISelector<TOuter, TKey> | string,
                   innerKeySelector: Util.ISelector<TInner, TKey> | string,
                   resultSelector: (outer: TOuter, inner: TInner) => TResult): TResult[] {
        // TODO: Write static join function without instantiating a new Linq object
        return new Linq(outer).join(inner, outerKeySelector, innerKeySelector, resultSelector).toArray<TResult>();
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


    /* Helper functions */
    private contains(a: any) {
        let result;
        this.toArray().some(item => {
            if (item === a) {
                result = item;
                return true;
            }
        });
        return typeof result !== "undefined";
    }

}

export function LQ<TSource>(source: TSource[]) {
    return new Linq<TSource>(source);
}

export class OrderedLinq<TSource, TKey> extends Linq<TSource> {
    constructor(source: TSource[] | BaseIterator<TSource>) {
        super(source);
    }

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenBy(keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): OrderedLinq<TSource, TKey> {
        let selectorFn = _makeValuePredicate(keySelector);
        let orderIterator: OrderIterator<TSource, TKey> = this._source.getIteratorFromPipeline(OrderIterator);
        orderIterator.thenBy(selectorFn, comparer, false);
        return this;
    }

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenByDesc(keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): OrderedLinq<TSource, TKey> {
        let selectorFn = _makeValuePredicate(keySelector);
        let orderIterator: OrderIterator<TSource, TKey> = this._source.getIteratorFromPipeline(OrderIterator);
        orderIterator.thenBy(selectorFn, comparer, true);
        return this;
    }
}

function _makeValuePredicate(predicate): (predicate) => any {
    if (Util.isString(predicate)) {
        let field = predicate;
        predicate = ((x) => x[field]);

    } else if (Util.isUndefined(predicate)) {
        predicate = (() => true);
    }
    return predicate;
}

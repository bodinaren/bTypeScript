import Iterator from "./iterator";
import FilterIterator from "./filter";
import MapIterator from "./map";
import OrderIterator from "./order";
import SkipIterator from "./skip";
import SkipWhileIterator from "./skipWhile";
import TakeIterator from "./take";
import TakeWhileIterator from "./takeWhile";
import LinqOrdered from "./linqOrdered";
import * as Util from "../util";

export default class Linq {
    protected _source: Iterator;

    constructor(source: any[] | Iterator) {
        this._source = (source instanceof Iterator)
            ? source
            : new MapIterator(source, (item) => item);
    }

    _makeValuePredicate(predicate): (predicate) => any {
        if (Util.isString(predicate)) {
            let field = predicate;
            predicate = ((x) => x[field]);

        } else if (Util.isUndefined(predicate)) {
            predicate = (() => true);
        }
        return predicate;
    }

    _makeBoolPredicate(predicate): (predicate) => boolean {
        if (Util.isString(predicate)) {
            let field = predicate;
            predicate = ((x) => x[field] === true);

        } else if (Util.isUndefined(predicate)) {
            predicate = (() => true);
        }
        return predicate;
    }

    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    map(callback: (item: any, idx: number) => any): Linq {
        return new Linq(new MapIterator(this._source, callback));
    }

    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    filter(predicate: (predicate) => boolean): Linq {
        return new Linq(new FilterIterator(this._source, predicate));
    }
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    where(predicate: (predicate) => boolean): Linq {
        return this.filter(predicate);
    }

    /**
     * Inverts the order of the elements in a sequence.
     */
    reverse(): Linq {
        this._source.reverse();
        return this;
    }

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    take(count: number): Linq {
        return new Linq(new TakeIterator(this._source, count));
    }

    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    takeWhile(predicate: Util.IPredicate<any> = Util.defaultPredicate) {
        return new Linq(new TakeWhileIterator(this._source, predicate));
    }

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    skip(count: number): Linq {
        return new Linq(new SkipIterator(this._source, count));
    }

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    skipWhile(predicate: Util.IPredicate<any> = Util.defaultPredicate) {
        return new Linq(new SkipWhileIterator(this._source, predicate));
    }

    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    orderBy(keySelector: Util.ISelector<any, any> | string, comparer: Util.IComparer<any> = Util.defaultComparer): LinqOrdered {
        let selectorFn = this._makeValuePredicate(keySelector);
        return new LinqOrdered(new OrderIterator(this._source, selectorFn, comparer, false));
    }

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    orderByDesc(keySelector: Util.ISelector<any, any> | string, comparer: Util.IComparer<any> = Util.defaultComparer): LinqOrdered {
        let selectorFn = this._makeValuePredicate(keySelector);
        return new LinqOrdered(new OrderIterator(this._source, selectorFn, comparer, true));
    }

    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    sum(selector: Util.ISelector<any, number> = Util.defaultSelector): number {
        let i, sum = 0, arr = this.toArray();
        for (i = 0; i < arr.length; i++) {
            sum += selector(arr[i]);
        }
        return sum;
    }

    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    average(selector: Util.ISelector<any, number> = Util.defaultSelector): number {
        let i, total = 0, arr = this.toArray();
        for (i = 0; i < arr.length; i++) {
            total += selector(arr[i]);
        }
        return total / arr.length;
    }

    /**
     * Determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
     * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
     */
    any(predicate: (predicate) => boolean, invert: boolean = false): boolean {
        predicate = this._makeBoolPredicate(predicate);

        let i, arr = this.toArray();
        if (arr.length == 0) return false;
        for (i = 0; i < arr.length; i++) {
            if (predicate(arr[i]) !== invert) {
                return true;
            }
        }
        return false;
    }

    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @param invert If true, determines whether none elements of a sequence satisfy a condition.
     */
    all(predicate: (predicate) => boolean, invert: boolean = false): boolean {
        return !(this.any(predicate, !invert));
    }

    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws The input sequence contains more than one element.
     */
    single(predicate: (predicate) => boolean): any {
        let arr = this.filter(predicate).take(2).toArray();
        if (arr.length == 2) throw "The input sequence contains more than one element.";
        if (arr.length == 1) return arr[0];
        else return undefined;
    }

    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    first(predicate: (predicate) => boolean = (() => true)): any {
        let arr = this.filter(predicate).take(1).toArray();
        if (arr.length == 1) return arr[0];
        else return undefined;
    }
    
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    last(predicate: (predicate) => boolean = (() => true)): any {
        return this.reverse().first(predicate);
    }
    
    /**
     * Get a list of items that exists in all datasets.
     * @param a The first dataset.
     * @param b The second dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    static intersect(a: any[] | Linq, b: any[] | Linq, ...more: Array<any[] | Linq>): any[] {
        let lists = [], result = [];

        let list = (a instanceof Linq) ? a : new Linq(Util.cast<any[]>(a));
        lists.push((b instanceof Linq) ? b : new Linq(Util.cast<any[]>(b)));
        more.forEach(dataset => {
            lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast<any[]>(dataset)));
        });

        list.forEach(item => {
            let exists = true;
            lists.forEach(other => {
                if (!other.contains(item)) return (exists = false);
            });
            if (exists) result.push(item);
        });

        return result;
    }
    /**
     * Get a list of items that exists in all datasets.
     * @param other The other dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    intersect(other: any[] | Linq, ...more: Array<any[] | Linq>): Linq {
        return new Linq(Linq.intersect(this, other, more));
    }

    /**
     * Get a list of items that only exists in one of the datasets.
     * @param a The first dataset.
     * @param b The second dataset.
     * @param more If you have even more dataset to compare to.
     */
    static except(a: any[] | Linq, b: any[] | Linq, ...more: Array<any[] | Linq>): any[] {
        let lists = [], result = [];

        lists.push((a instanceof Linq) ? a : new Linq(Util.cast<any[]>(a)));
        lists.push((b instanceof Linq) ? b : new Linq(Util.cast<any[]>(b)));
        more.forEach(dataset => {
            lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast<any[]>(dataset)));
        });

        lists.forEach(list => {
            list.forEach(item => {
                let exists = false;
                lists.forEach(other => {
                    if (list === other) return;
                    if (other.contains(item)) exists = true;
                });
                if (!exists) result.push(item);
            });
        });

        return result;
    }
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param other The other dataset.
     * @param more If you have even more dataset to compare to.
     */
    except(other: any[] | Linq, ...more: Array<any[] | Linq>): Linq {
        return new Linq(Linq.intersect(this, more));
    }

    /**
     * Get a list of unique items that exists one or more times in any of the datasets.
     * @param datasets The other datasets to be get distinct items from.
     */
    static distinct(...datasets: Array<any[] | Linq>): any[] {
        let lists = [], result = [];

        datasets.forEach(dataset => {
            lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast<any[]>(dataset)));
        });

        lists.forEach(list => {
            list.forEach(item => {
                if (result.indexOf(item) == -1)
                    result.push(item);
            });
        });

        return result;
    }
    /**
     * Get a list of unique items that exists one or more times in the datasets.
     */
    distinct(): Linq {
        return new Linq(Linq.distinct(this));
    }

    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    groupBy(keySelector: Util.ISelector<any, any> | string): Linq {
        let i,
            arr = [],
            original = this.toArray(),
            pred = this._makeValuePredicate(keySelector);

        for (i = 0; i < original.length; i++) {

            let groupValue = pred(original[i]),
                group = new Linq(arr).single(x => x.key == groupValue);

            if (!group) {
                group = {
                    key: groupValue,
                    values: []
                };
                arr.push(group);
            }

            group.values.push(original[i]);
        }

        return new Linq(arr);
    }
    
    /**
     * Executes the pipeline and return the resulting array.
     */
    toArray(): any[] {
        let res, arr = [];

        if (Util.isArray(this._source)) {
            arr = Util.cast<Array<any>>(this._source).slice();
        } else {
            do {
                res = this._source.next();
                if (!Util.isUndefined(res)) arr.push(res);
            } while (!Util.isUndefined(res));
        }

        return arr;
    }

    /* Helper functions */
    private contains(a: any) {
        let result;
        this.forEach(item => {
            if (item === a) {
                result = item;
                return false;
            }
        });
        return !!result;
    }

    private forEach(callback: Util.ILoopFunction<any>): void {
        let arr = this.toArray();
        for (let i = 0; i < arr.length; i++) {
            if (callback(arr[i], i) === false) return;
        }
    }

}
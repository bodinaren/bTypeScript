"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
var Util = require("../util");
var Linq = (function () {
    function Linq(source) {
        this._source = (source instanceof _1.BaseIterator)
            ? source
            : new _1.MapIterator(source, function (item) { return item; });
    }
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    Linq.prototype.map = function (callback) {
        return new Linq(new _1.MapIterator(this._source, callback));
        // try { return new Linq(new MapIterator(this._source, callback)); }
        // catch (ex) { throw this._errorHandler(ex) }
    };
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    Linq.map = function (source, callback) {
        return source.map(callback);
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.filter = function (predicate) {
        return new Linq(new _1.FilterIterator(this._source, predicate));
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.filter = function (source, predicate) {
        return source.filter(predicate);
    };
    /**
     * Inverts the order of the elements in a sequence.
     * This simply iterates the items from the end, and as such has no additional performance cost.
     */
    Linq.prototype.reverse = function () {
        this._source.reverse();
        return this;
    };
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    Linq.prototype.take = function (count) {
        return new Linq(new _1.TakeIterator(this._source, count));
    };
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    Linq.take = function (source, count) {
        return source.slice(0, count);
        // return new Linq<TSource>(source).take(count).toArray();
    };
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.takeWhile = function (predicate) {
        return new Linq(new _1.TakeWhileIterator(this._source, predicate));
    };
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    Linq.takeWhile = function (source, predicate) {
        return new Linq(source).takeWhile(predicate).toArray();
    };
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    Linq.prototype.skip = function (count) {
        return new Linq(new _1.SkipIterator(this._source, count));
    };
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    Linq.skip = function (source, count) {
        return source.slice(count);
        // return new Linq(source).skip(count).toArray();
    };
    /**
     * Merges items from the first sequence with the item at the corresponding index in the second sequence to
     * create a new sequence with the results of calling a provided function on every pair of items.
     * The zip will stop as soon as either of the sequences hits an undefined value.
     * @param other The second sequence to zip with
     * @param callback Function that produces an element of the new sequence
     */
    Linq.prototype.zip = function (other, callback) {
        return new Linq(new _1.ZipIterator(this._source, other, callback));
    };
    /**
     * Merges items from the first sequence with the item at the corresponding index in the second sequence to
     * create a new sequence with the results of calling a provided function on every pair of items.
     * The zip will stop as soon as either of the sequences hits an undefined value.
     * @param other The second sequence to zip with
     * @param callback Function that produces an element of the new sequence
     */
    Linq.zip = function (source, other, callback) {
        // TODO: Write static zip function without instantiating a new Linq object
        return new Linq(source).zip(other, callback).toArray();
    };
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.skipWhile = function (predicate) {
        return new Linq(new _1.SkipWhileIterator(this._source, predicate));
    };
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    Linq.skipWhile = function (source, predicate) {
        // TODO: Write static skipWhile function without instantiating a new Linq object
        return new Linq(source).skipWhile(predicate).toArray();
    };
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.prototype.orderBy = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = (keySelector) ? _makeValuePredicate(keySelector) : Util.defaultSelector;
        return new OrderedLinq(new _1.OrderIterator(this._source, selectorFn, comparer, false));
    };
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.orderBy = function (source, keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        // TODO: Write static orderBy function without instantiating a new Linq object
        return new Linq(source).orderBy(keySelector, comparer).toArray();
    };
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.prototype.orderByDesc = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = (keySelector) ? _makeValuePredicate(keySelector) : Util.defaultSelector;
        return new OrderedLinq(new _1.OrderIterator(this._source, selectorFn, comparer, true));
    };
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.orderByDesc = function (source, keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        // TODO: Write static orderByDesc function without instantiating a new Linq object
        return new Linq(source).orderByDesc(keySelector, comparer).toArray();
    };
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    Linq.prototype.sum = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Linq.sum(this.toArray(), selector);
    };
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    Linq.sum = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        var i, sum = 0;
        for (i = 0; i < source.length; i++) {
            sum += selector(source[i]);
        }
        return sum;
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.average = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Linq.average(this.toArray(), selector);
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.average = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        var i, total = 0;
        for (i = 0; i < source.length; i++) {
            total += selector(source[i]);
        }
        return total / source.length;
    };
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.min = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Linq.min(this.toArray(), selector);
    };
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.min = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Math.min.apply(undefined, source.map(selector));
    };
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.max = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Linq.max(this.toArray(), selector);
    };
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.max = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Math.max.apply(undefined, source.map(selector));
    };
    /**
     * Determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
     * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
     */
    Linq.prototype.any = function (predicate, invert) {
        if (invert === void 0) { invert = false; }
        return typeof this.first(function (x) { return !!predicate(x) !== invert; }) !== "undefined";
    };
    /**
     * Determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
     * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
     */
    Linq.any = function (source, predicate, invert) {
        if (invert === void 0) { invert = false; }
        return source.some(function (x) { return !!predicate(x) !== invert; });
    };
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @param invert If true, determines whether none elements of a sequence satisfy a condition.
     */
    Linq.prototype.all = function (predicate, invert) {
        if (invert === void 0) { invert = false; }
        return !(this.any(predicate, !invert));
    };
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @param invert If true, determines whether none elements of a sequence satisfy a condition.
     */
    Linq.all = function (source, predicate, invert) {
        if (invert === void 0) { invert = false; }
        return source.every(function (x) { return !!predicate(x) !== invert; });
    };
    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error.
     */
    Linq.prototype.single = function (predicate) {
        var arr = this.filter(predicate).take(2).toArray();
        if (arr.length == 0)
            throw new Error("The sequence is empty.");
        if (arr.length == 2)
            throw new Error("The sequence contains more than one element.");
        if (arr.length == 1)
            return arr[0];
    };
    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error
     */
    Linq.single = function (source, predicate) {
        // TODO: Write static single function without instantiating a new Linq object
        return new Linq(source).single(predicate);
    };
    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    Linq.prototype.first = function (predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        var arr = this.filter(predicate).take(1).toArray();
        if (arr.length == 1)
            return arr[0];
        else
            return undefined;
    };
    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    Linq.first = function (source, predicate) {
        // TODO: Write static first function without instantiating a new Linq object
        if (!source || source.length === 0)
            return undefined;
        if (!predicate)
            return source[0];
        return new Linq(source).first(predicate);
    };
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    Linq.prototype.last = function (predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return this.reverse().first(predicate);
    };
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    Linq.last = function (source, predicate) {
        // TODO: Write static last function without instantiating a new Linq object
        if (!source || source.length === 0)
            return undefined;
        if (!predicate)
            return source[source.length - 1];
        return new Linq(source).last(predicate);
    };
    /**
     * Get a list of items that exists in all datasets.
     * @param other The other dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    Linq.prototype.intersect = function (other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        return new Linq(new _1.IntersectIterator(this._source, other, comparer));
    };
    /**
     * Get a list of items that exists in all datasets.
     * @param a The first dataset.
     * @param b The second dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    Linq.intersect = function (source, other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var a = (source instanceof Linq) ? source.toArray() : source, b = (other instanceof Linq) ? other.toArray() : other;
        var result = [];
        a.forEach(function (x) {
            if (b.some(function (y) { return comparer(x, y); }))
                result.push(x);
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
    };
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param other The other dataset.
     */
    Linq.prototype.except = function (other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        return new Linq(new _1.ExceptIterator(this._source, other, comparer));
    };
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param a The first dataset.
     * @param b The second dataset.
     */
    Linq.except = function (source, other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var a = (source instanceof Linq) ? source.toArray() : source, b = (other instanceof Linq) ? other.toArray() : other;
        var result = [];
        a.forEach(function (x) {
            if (!b.some(function (y) { return comparer(x, y); }))
                result.push(x);
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
    };
    /**
     * Get a list of unique items that exists one or more times in the dataset.
     */
    Linq.prototype.distinct = function (comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        return new Linq(new _1.DistinctIterator(this._source, comparer));
    };
    /**
     * Get a list of unique items that exists one or more times in any of the datasets.
     * @param source The datasets to be get distinct items from.
     */
    Linq.distinct = function (source, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var a = (source instanceof Linq) ? source.toArray() : source;
        var result = [];
        a.forEach(function (x) {
            if (!result.some(function (y) { return comparer(x, y); }))
                result.push(x);
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
    };
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    Linq.prototype.groupBy = function (keySelector) {
        var pred = _makeValuePredicate(keySelector);
        return new Linq(new _1.GroupByIterator(this._source, pred));
    };
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    Linq.groupBy = function (source, keySelector) {
        var i, arr = [], pred = _makeValuePredicate(keySelector), group, groupValue;
        for (i = 0; i < source.length; i++) {
            groupValue = pred(source[i]);
            group = new Linq(arr).first(function (x) { return x.key == groupValue; });
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
    };
    /**
     * Correlates the elements of two sequences based on matching keys.
     * @param inner The sequence to join to the first sequence.
     * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
     * @param innerKeySelector A function to extract the join key from each element of the second sequence.
     * @param resultSelector A function to create a result element from two matching elements.
     */
    Linq.prototype.join = function (inner, outerKeySelector, innerKeySelector, resultSelector) {
        var outerPred = _makeValuePredicate(outerKeySelector), innerPred = _makeValuePredicate(innerKeySelector);
        return new Linq(new _1.JoinIterator(this._source, inner, outerPred, innerPred, resultSelector));
    };
    /**
     * Correlates the elements of two sequences based on matching keys.
     * @param outer The first sequence to join.
     * @param inner The sequence to join to the first sequence.
     * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
     * @param innerKeySelector A function to extract the join key from each element of the second sequence.
     * @param resultSelector A function to create a result element from two matching elements.
     */
    Linq.join = function (outer, inner, outerKeySelector, innerKeySelector, resultSelector) {
        // TODO: Write static join function without instantiating a new Linq object
        return new Linq(outer).join(inner, outerKeySelector, innerKeySelector, resultSelector).toArray();
    };
    /**
     * Executes the pipeline and return the resulting array.
     */
    Linq.prototype.toArray = function () {
        var res, arr = [];
        if (Util.isArray(this._source)) {
            arr = Util.cast(this._source).slice();
        }
        else {
            while (!(res = this._source.next()).done) {
                arr.push(res.value);
            }
        }
        return arr;
    };
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
    Linq.prototype.contains = function (a) {
        var result;
        this.toArray().some(function (item) {
            if (item === a) {
                result = item;
                return true;
            }
        });
        return typeof result !== "undefined";
    };
    return Linq;
}());
exports.default = Linq;
function LQ(source) {
    return new Linq(source);
}
exports.LQ = LQ;
var OrderedLinq = (function (_super) {
    __extends(OrderedLinq, _super);
    function OrderedLinq(source) {
        return _super.call(this, source) || this;
    }
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    OrderedLinq.prototype.thenBy = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = (keySelector) ? _makeValuePredicate(keySelector) : Util.defaultSelector;
        var orderIterator = this._source.getIteratorFromPipeline(_1.OrderIterator);
        orderIterator.thenBy(selectorFn, comparer, false);
        return this;
    };
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    OrderedLinq.prototype.thenByDesc = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = (keySelector) ? _makeValuePredicate(keySelector) : Util.defaultSelector;
        var orderIterator = this._source.getIteratorFromPipeline(_1.OrderIterator);
        orderIterator.thenBy(selectorFn, comparer, true);
        return this;
    };
    return OrderedLinq;
}(Linq));
exports.OrderedLinq = OrderedLinq;
function _makeValuePredicate(predicate) {
    if (Util.isString(predicate)) {
        var field_1 = predicate;
        predicate = (function (x) { return x[field_1]; });
    }
    else if (Util.isUndefined(predicate)) {
        predicate = (function () { return true; });
    }
    return predicate;
}
//# sourceMappingURL=linq.js.map
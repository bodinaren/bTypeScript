"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iterator_1 = require("./iterator");
var filter_1 = require("./filter");
var map_1 = require("./map");
var order_1 = require("./order");
var skip_1 = require("./skip");
var skipWhile_1 = require("./skipWhile");
var take_1 = require("./take");
var takeWhile_1 = require("./takeWhile");
var Util = require("../util");
var Linq = (function () {
    function Linq(source) {
        this._source = (source instanceof iterator_1.default)
            ? source
            : new map_1.default(source, function (item) { return item; });
    }
    Linq.prototype._makeValuePredicate = function (predicate) {
        if (Util.isString(predicate)) {
            var field_1 = predicate;
            predicate = (function (x) { return x[field_1]; });
        }
        else if (Util.isUndefined(predicate)) {
            predicate = (function () { return true; });
        }
        return predicate;
    };
    Linq.prototype._makeBoolPredicate = function (predicate) {
        if (Util.isString(predicate)) {
            var field_2 = predicate;
            predicate = (function (x) { return x[field_2] === true; });
        }
        else if (Util.isUndefined(predicate)) {
            predicate = (function () { return true; });
        }
        return predicate;
    };
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    Linq.prototype.map = function (callback) {
        return new Linq(new map_1.default(this._source, callback));
    };
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    Linq.map = function (source, callback) {
        return new Linq(source).map(callback).toArray();
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.filter = function (predicate) {
        return new Linq(new filter_1.default(this._source, predicate));
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.filter = function (source, predicate) {
        return new Linq(source).filter(predicate).toArray();
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.where = function (predicate) {
        return this.filter(predicate);
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.where = function (source, predicate) {
        return Linq.filter(source, predicate);
    };
    /**
     * Inverts the order of the elements in a sequence.
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
        return new Linq(new take_1.default(this._source, count));
    };
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    Linq.take = function (source, count) {
        return new Linq(source).take(count).toArray();
    };
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.takeWhile = function (predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(new takeWhile_1.default(this._source, predicate));
    };
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    Linq.takeWhile = function (source, predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(source).takeWhile(predicate).toArray();
    };
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    Linq.prototype.skip = function (count) {
        return new Linq(new skip_1.default(this._source, count));
    };
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    Linq.skip = function (source, count) {
        return new Linq(source).skip(count).toArray();
    };
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.skipWhile = function (predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(new skipWhile_1.default(this._source, predicate));
    };
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    Linq.skipWhile = function (source, predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(source).skipWhile(predicate).toArray();
    };
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.prototype.orderBy = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = this._makeValuePredicate(keySelector);
        return new OrderedLinq(new order_1.default(this._source, selectorFn, comparer, false));
    };
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.orderBy = function (source, keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        return new Linq(source).orderBy(keySelector, comparer).toArray();
    };
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.prototype.orderByDesc = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = this._makeValuePredicate(keySelector);
        return new OrderedLinq(new order_1.default(this._source, selectorFn, comparer, true));
    };
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.orderByDesc = function (source, keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        return new Linq(source).orderByDesc(keySelector, comparer).toArray();
    };
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    Linq.prototype.sum = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        var i, sum = 0, arr = this.toArray();
        for (i = 0; i < arr.length; i++) {
            sum += selector(arr[i]);
        }
        return sum;
    };
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    Linq.sum = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).sum(selector);
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.average = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        var i, total = 0, arr = this.toArray();
        for (i = 0; i < arr.length; i++) {
            total += selector(arr[i]);
        }
        return total / arr.length;
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @alias average
     * @param selector
     */
    Linq.prototype.avg = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return this.average(selector);
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.average = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).average(selector);
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @alias average
     * @param selector
     */
    Linq.avg = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Linq.average(source, selector);
    };
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.min = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Math.min.apply(undefined, this.toArray().map(selector));
    };
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.min = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).min(selector);
    };
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.max = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Math.max.apply(undefined, this.toArray().map(selector));
    };
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.max = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).max(selector);
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
        return new Linq(source).any(predicate, invert);
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
        return new Linq(source).all(predicate, invert);
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
            throw new Error("The input sequence contains more than one element.");
        if (arr.length == 1)
            return arr[0];
        else
            return undefined;
    };
    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error
     */
    Linq.single = function (source, predicate) {
        return new Linq(source).single(predicate);
    };
    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    Linq.prototype.first = function (predicate) {
        if (predicate === void 0) { predicate = (function () { return true; }); }
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
        if (predicate === void 0) { predicate = (function () { return true; }); }
        return new Linq(source).first(predicate);
    };
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    Linq.prototype.last = function (predicate) {
        if (predicate === void 0) { predicate = (function () { return true; }); }
        return this.reverse().first(predicate);
    };
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    Linq.last = function (source, predicate) {
        if (predicate === void 0) { predicate = (function () { return true; }); }
        return new Linq(source).last(predicate);
    };
    /**
     * Get a list of items that exists in all datasets.
     * @param a The first dataset.
     * @param b The second dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    Linq.intersect = function (a, b) {
        var more = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            more[_i - 2] = arguments[_i];
        }
        var lists = [], result = [];
        var list = (a instanceof Linq) ? a : new Linq(Util.cast(a));
        lists.push((b instanceof Linq) ? b : new Linq(Util.cast(b)));
        more.forEach(function (dataset) {
            lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast(dataset)));
        });
        list.forEach(function (item) {
            var exists = true;
            lists.forEach(function (other) {
                if (!other.contains(item))
                    return (exists = false);
            });
            if (exists)
                result.push(item);
        });
        return result;
    };
    /**
     * Get a list of items that exists in all datasets.
     * @param other The other dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    Linq.prototype.intersect = function (other) {
        var more = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            more[_i - 1] = arguments[_i];
        }
        return new Linq(Linq.intersect.apply(Linq, [this, other].concat(more)));
    };
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param a The first dataset.
     * @param b The second dataset.
     * @param more If you have even more dataset to compare to.
     */
    Linq.except = function (a, b) {
        var more = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            more[_i - 2] = arguments[_i];
        }
        var lists = [], result = [];
        lists.push((a instanceof Linq) ? a : new Linq(Util.cast(a)));
        lists.push((b instanceof Linq) ? b : new Linq(Util.cast(b)));
        more.forEach(function (dataset) {
            lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast(dataset)));
        });
        lists.forEach(function (list) {
            list.forEach(function (item) {
                var exists = false;
                lists.forEach(function (other) {
                    if (list === other)
                        return;
                    if (other.contains(item))
                        (exists = true);
                });
                if (!exists)
                    result.push(item);
            });
        });
        return result;
    };
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param other The other dataset.
     * @param more If you have even more dataset to compare to.
     */
    Linq.prototype.except = function (other) {
        var more = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            more[_i - 1] = arguments[_i];
        }
        return new Linq(Linq.except.apply(Linq, [this, other].concat(more)));
    };
    /**
     * Get a list of unique items that exists one or more times in any of the datasets.
     * @param datasets The other datasets to be get distinct items from.
     */
    Linq.distinct = function () {
        var datasets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            datasets[_i - 0] = arguments[_i];
        }
        var lists = [], result = [];
        datasets.forEach(function (dataset) {
            lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast(dataset)));
        });
        lists.forEach(function (list) {
            list.forEach(function (item) {
                if (result.indexOf(item) == -1)
                    result.push(item);
            });
        });
        return result;
    };
    /**
     * Get a list of unique items that exists one or more times in the datasets.
     */
    Linq.prototype.distinct = function () {
        return new Linq(Linq.distinct(this));
    };
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    Linq.prototype.groupBy = function (keySelector) {
        var i, arr = [], original = this.toArray(), pred = this._makeValuePredicate(keySelector), group, groupValue;
        for (i = 0; i < original.length; i++) {
            groupValue = pred(original[i]);
            group = new Linq(arr).first(function (x) { return x.key == groupValue; });
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
    };
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    Linq.groupBy = function (source, keySelector) {
        return new Linq(source).groupBy(keySelector).toArray();
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
            do {
                res = this._source.next();
                if (!Util.isUndefined(res))
                    arr.push(res);
            } while (!Util.isUndefined(res));
        }
        return arr;
    };
    /**
     * Executes the pipeline and execute callback on each item in the resulting array.
     * Same as doing .toArray().forEach(callback);
     * @param callback {Util.ILoopFunction<any>} forEach is cancelled as soon as it returns false
     * @return {boolean} Weither the callback was executed on all items or not.
     */
    Linq.prototype.forEach = function (callback) {
        var arr = this.toArray();
        for (var i = 0; i < arr.length; i++) {
            if (callback(arr[i], i) === false)
                return false;
        }
        return true;
    };
    /* Helper functions */
    Linq.prototype.contains = function (a) {
        var result;
        this.forEach(function (item) {
            if (item === a) {
                result = item;
                return false;
            }
        });
        return typeof result !== "undefined";
    };
    return Linq;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Linq;
function LQ(source) {
    return new Linq(source);
}
exports.LQ = LQ;
var OrderedLinq = (function (_super) {
    __extends(OrderedLinq, _super);
    function OrderedLinq(source) {
        _super.call(this, source);
    }
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    OrderedLinq.prototype.thenBy = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = this._makeValuePredicate(keySelector);
        var orderIterator = this._source.getIteratorFromPipeline(order_1.default);
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
        var selectorFn = this._makeValuePredicate(keySelector);
        var orderIterator = this._source.getIteratorFromPipeline(order_1.default);
        orderIterator.thenBy(selectorFn, comparer, true);
        return this;
    };
    return OrderedLinq;
}(Linq));
exports.OrderedLinq = OrderedLinq;
//# sourceMappingURL=linq.js.map
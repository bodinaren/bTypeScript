(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./iterator", "./filter", "./map", "./order", "./skip", "./skipWhile", "./take", "./takeWhile", "./linqOrdered", "../util"], factory);
    }
})(function (require, exports) {
    "use strict";
    var iterator_1 = require("./iterator");
    var filter_1 = require("./filter");
    var map_1 = require("./map");
    var order_1 = require("./order");
    var skip_1 = require("./skip");
    var skipWhile_1 = require("./skipWhile");
    var take_1 = require("./take");
    var takeWhile_1 = require("./takeWhile");
    var linqOrdered_1 = require("./linqOrdered");
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
        Linq.prototype.map = function (callback) {
            return new Linq(new map_1.default(this._source, callback));
        };
        Linq.prototype.filter = function (predicate) {
            return new Linq(new filter_1.default(this._source, predicate));
        };
        Linq.prototype.where = function (predicate) {
            return this.filter(predicate);
        };
        Linq.prototype.reverse = function () {
            this._source.reverse();
            return this;
        };
        Linq.prototype.take = function (count) {
            return new Linq(new take_1.default(this._source, count));
        };
        Linq.prototype.takeWhile = function (predicate) {
            if (predicate === void 0) { predicate = Util.defaultPredicate; }
            return new Linq(new takeWhile_1.default(this._source, predicate));
        };
        Linq.prototype.skip = function (count) {
            return new Linq(new skip_1.default(this._source, count));
        };
        Linq.prototype.skipWhile = function (predicate) {
            if (predicate === void 0) { predicate = Util.defaultPredicate; }
            return new Linq(new skipWhile_1.default(this._source, predicate));
        };
        Linq.prototype.orderBy = function (keySelector, comparer) {
            if (comparer === void 0) { comparer = Util.defaultComparer; }
            var selectorFn = this._makeValuePredicate(keySelector);
            return new linqOrdered_1.default(new order_1.default(this._source, selectorFn, comparer, false));
        };
        Linq.prototype.orderByDesc = function (keySelector, comparer) {
            if (comparer === void 0) { comparer = Util.defaultComparer; }
            var selectorFn = this._makeValuePredicate(keySelector);
            return new linqOrdered_1.default(new order_1.default(this._source, selectorFn, comparer, true));
        };
        Linq.prototype.sum = function (selector) {
            if (selector === void 0) { selector = Util.defaultSelector; }
            var i, sum = 0, arr = this.toArray();
            for (i = 0; i < arr.length; i++) {
                sum += selector(arr[i]);
            }
            return sum;
        };
        Linq.prototype.average = function (selector) {
            if (selector === void 0) { selector = Util.defaultSelector; }
            var i, total = 0, arr = this.toArray();
            for (i = 0; i < arr.length; i++) {
                total += selector(arr[i]);
            }
            return total / arr.length;
        };
        Linq.prototype.any = function (predicate, invert) {
            if (invert === void 0) { invert = false; }
            predicate = this._makeBoolPredicate(predicate);
            var i, arr = this.toArray();
            if (arr.length == 0)
                return false;
            for (i = 0; i < arr.length; i++) {
                if (predicate(arr[i]) !== invert) {
                    return true;
                }
            }
            return false;
        };
        Linq.prototype.all = function (predicate, invert) {
            if (invert === void 0) { invert = false; }
            return !(this.any(predicate, !invert));
        };
        Linq.prototype.single = function (predicate) {
            var arr = this.filter(predicate).take(2).toArray();
            if (arr.length == 2)
                throw "The input sequence contains more than one element.";
            if (arr.length == 1)
                return arr[0];
            else
                return undefined;
        };
        Linq.prototype.first = function (predicate) {
            if (predicate === void 0) { predicate = (function () { return true; }); }
            var arr = this.filter(predicate).take(1).toArray();
            if (arr.length == 1)
                return arr[0];
            else
                return undefined;
        };
        Linq.prototype.last = function (predicate) {
            if (predicate === void 0) { predicate = (function () { return true; }); }
            return this.reverse().first(predicate);
        };
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
        Linq.prototype.intersect = function (other) {
            var more = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                more[_i - 1] = arguments[_i];
            }
            return new Linq(Linq.intersect(this, other, more));
        };
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
                            exists = true;
                    });
                    if (!exists)
                        result.push(item);
                });
            });
            return result;
        };
        Linq.prototype.except = function (other) {
            var more = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                more[_i - 1] = arguments[_i];
            }
            return new Linq(Linq.intersect(this, more));
        };
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
        Linq.prototype.distinct = function () {
            return new Linq(Linq.distinct(this));
        };
        Linq.prototype.groupBy = function (keySelector) {
            var i, arr = [], original = this.toArray(), pred = this._makeValuePredicate(keySelector);
            var _loop_1 = function() {
                var groupValue = pred(original[i]), group = new Linq(arr).single(function (x) { return x.key == groupValue; });
                if (!group) {
                    group = {
                        key: groupValue,
                        values: []
                    };
                    arr.push(group);
                }
                group.values.push(original[i]);
            };
            for (i = 0; i < original.length; i++) {
                _loop_1();
            }
            return new Linq(arr);
        };
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
        Linq.prototype.contains = function (a) {
            var result;
            this.forEach(function (item) {
                if (item === a) {
                    result = item;
                    return false;
                }
            });
            return !!result;
        };
        Linq.prototype.forEach = function (callback) {
            var arr = this.toArray();
            for (var i = 0; i < arr.length; i++) {
                if (callback(arr[i], i) === false)
                    return;
            }
        };
        return Linq;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Linq;
});
//# sourceMappingURL=linq.js.map
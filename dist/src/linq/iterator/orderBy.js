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
var iterator_1 = require("./iterator");
var Util = require("../../util");
var linq_1 = require("../linq");
var makeValuePredicate_1 = require("../makeValuePredicate");
var OrderByIterator = (function (_super) {
    __extends(OrderByIterator, _super);
    function OrderByIterator(source, keySelector, comparer, descending) {
        if (keySelector === void 0) { keySelector = Util.defaultSelector; }
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        if (descending === void 0) { descending = false; }
        var _this = _super.call(this, source) || this;
        _this.descending = descending;
        _this._isOrdered = false;
        _this._orders = [new LinqOrder(keySelector, comparer, descending)];
        _this._buffers = true;
        return _this;
    }
    OrderByIterator.prototype.next = function () {
        var _this = this;
        if (!this._isOrdered) {
            var arr = [], item = void 0;
            // can't someone else do this? e.g. FilterIterator?
            do {
                item = _super.prototype.next.call(this);
                if (!Util.isUndefined(item.value))
                    arr.push(item.value);
            } while (!item.done);
            this._source = arr.sort(function (a, b) {
                var i = 0, rs;
                do {
                    rs = _this._orders[i++].compare(a, b);
                } while (rs === 0 && i < _this._orders.length);
                return rs;
            });
            this._isOrdered = true;
            _super.prototype.reset.call(this);
        }
        return _super.prototype.next.call(this);
    };
    OrderByIterator.prototype.thenBy = function (keySelector, comparer, descending) {
        if (keySelector === void 0) { keySelector = Util.defaultSelector; }
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        if (descending === void 0) { descending = false; }
        this._orders.push(new LinqOrder(keySelector, comparer, descending));
    };
    return OrderByIterator;
}(iterator_1.BaseIterator));
exports.OrderByIterator = OrderByIterator;
function orderBy(source, keySelector, comparer) {
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    var selectorFn = (keySelector) ? makeValuePredicate_1.makeValuePredicate(keySelector) : Util.defaultSelector;
    return new OrderByIterator(source, selectorFn, comparer, false);
}
function orderByDesc(source, keySelector, comparer) {
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    var selectorFn = (keySelector) ? makeValuePredicate_1.makeValuePredicate(keySelector) : Util.defaultSelector;
    return new OrderByIterator(source, selectorFn, comparer, true);
}
/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
function orderByProto(keySelector, comparer) {
    // TODO: Haven't gotten the intellisense to show Linq<TSource> as the result of this function, it shows Linq<any>.
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    return new OrderedLinq(orderBy(this._source, keySelector, comparer));
}
exports.orderByProto = orderByProto;
/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
function orderByStatic(source, keySelector, comparer) {
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    return new linq_1.Linq(source).orderBy(keySelector, comparer).toArray();
}
exports.orderByStatic = orderByStatic;
/**
 * Sorts the elements of a sequence in descending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
function orderByDescProto(keySelector, comparer) {
    // TODO: Haven't gotten the intellisense to show Linq<TSource> as the result of this function, it shows Linq<any>.
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    return new OrderedLinq(orderByDesc(this._source, keySelector, comparer));
}
exports.orderByDescProto = orderByDescProto;
/**
 * Sorts the elements of a sequence in descending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
function orderByDescStatic(source, keySelector, comparer) {
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    return new linq_1.Linq(source).orderByDesc(keySelector, comparer).toArray();
}
exports.orderByDescStatic = orderByDescStatic;
var LinqOrder = (function () {
    function LinqOrder(keySelector, comparer, descending) {
        if (keySelector === void 0) { keySelector = Util.defaultSelector; }
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        if (descending === void 0) { descending = false; }
        this._keySelector = keySelector;
        this._comparer = comparer;
        this._descending = descending;
    }
    LinqOrder.prototype.compare = function (a, b) {
        return (this._descending ? -1 : 1) * this._comparer(this._keySelector(a), this._keySelector(b));
    };
    return LinqOrder;
}());
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
        var selectorFn = (keySelector) ? makeValuePredicate_1.makeValuePredicate(keySelector) : Util.defaultSelector;
        var orderIterator = this._source.getIteratorFromPipeline(OrderByIterator);
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
        var selectorFn = (keySelector) ? makeValuePredicate_1.makeValuePredicate(keySelector) : Util.defaultSelector;
        var orderIterator = this._source.getIteratorFromPipeline(OrderByIterator);
        orderIterator.thenBy(selectorFn, comparer, true);
        return this;
    };
    return OrderedLinq;
}(linq_1.Linq));
exports.OrderedLinq = OrderedLinq;
//# sourceMappingURL=orderBy.js.map
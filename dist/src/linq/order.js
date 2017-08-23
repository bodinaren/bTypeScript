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
var Util = require("../util");
var OrderIterator = (function (_super) {
    __extends(OrderIterator, _super);
    function OrderIterator(source, keySelector, comparer, descending) {
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
    OrderIterator.prototype.next = function () {
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
    OrderIterator.prototype.thenBy = function (keySelector, comparer, descending) {
        if (keySelector === void 0) { keySelector = Util.defaultSelector; }
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        if (descending === void 0) { descending = false; }
        this._orders.push(new LinqOrder(keySelector, comparer, descending));
    };
    return OrderIterator;
}(iterator_1.default));
exports.default = OrderIterator;
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
//# sourceMappingURL=order.js.map
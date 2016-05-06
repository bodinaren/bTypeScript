var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./linq", "./order", "../util"], factory);
    }
})(function (require, exports) {
    "use strict";
    var linq_1 = require("./linq");
    var order_1 = require("./order");
    var Util = require("../util");
    var LinqOrdered = (function (_super) {
        __extends(LinqOrdered, _super);
        function LinqOrdered(source) {
            _super.call(this, source);
        }
        LinqOrdered.prototype.thenBy = function (keySelector, comparer) {
            if (comparer === void 0) { comparer = Util.defaultComparer; }
            var selectorFn = this._makeValuePredicate(keySelector);
            var orderIterator = this._source.getIteratorFromPipeline(order_1.default);
            orderIterator.thenBy(selectorFn, comparer, false);
            return this;
        };
        LinqOrdered.prototype.thenByDesc = function (keySelector, comparer) {
            if (comparer === void 0) { comparer = Util.defaultComparer; }
            var selectorFn = this._makeValuePredicate(keySelector);
            var orderIterator = this._source.getIteratorFromPipeline(order_1.default);
            orderIterator.thenBy(selectorFn, comparer, true);
            return this;
        };
        return LinqOrdered;
    }(linq_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LinqOrdered;
});
//# sourceMappingURL=linqOrdered.js.map
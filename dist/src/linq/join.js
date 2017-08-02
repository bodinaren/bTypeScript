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
var filter_1 = require("./filter");
var Util = require("../util");
var JoinIterator = (function (_super) {
    __extends(JoinIterator, _super);
    function JoinIterator(outer, inner, outerKeySelector, innerKeySelector, resultSelector) {
        var _this = _super.call(this, outer) || this;
        _this.inner = inner;
        _this.outerKeySelector = outerKeySelector;
        _this.innerKeySelector = innerKeySelector;
        _this.resultSelector = resultSelector;
        _this._counter = 0;
        return _this;
    }
    JoinIterator.prototype.next = function () {
        var _this = this;
        var innerItem;
        if (this._currentInnerSelection) {
            // We're doing the second loop of the same key.
            innerItem = this._currentInnerSelection.next();
            // We know we have received at least one item from this key before, so not receiving one now is not wrong.
            // It just means it was only a single inner item with this key, so we let it continue if below condition is not met.
            if (!Util.isUndefined(innerItem.value)) {
                this._counter++;
                return {
                    value: this.resultSelector(this._outerItem.value, innerItem.value),
                    done: false
                };
            }
        }
        var _loop_1 = function () {
            this_1._outerItem = _super.prototype.next.call(this_1);
            if (this_1._outerItem.done)
                return { value: { value: undefined, done: true } };
            if (!Util.isUndefined(this_1._outerItem.value)) {
                var outerKey_1 = this_1.outerKeySelector(this_1._outerItem.value);
                this_1._currentInnerSelection = new filter_1.default(this_1.inner, function (x) { return outerKey_1 === _this.innerKeySelector(x); });
                innerItem = this_1._currentInnerSelection.next();
            }
        };
        var this_1 = this;
        do {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        } while (Util.isUndefined(innerItem.value));
        this._counter++;
        return {
            value: this.resultSelector(this._outerItem.value, innerItem.value),
            done: this._outerItem.done
        };
    };
    return JoinIterator;
}(iterator_1.default));
exports.default = JoinIterator;
//# sourceMappingURL=join.js.map
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var filter_1 = require("./filter");
var Util = require("../../util");
var GroupJoinIterator = /** @class */ (function (_super) {
    __extends(GroupJoinIterator, _super);
    function GroupJoinIterator(outer, inner, outerKeySelector, innerKeySelector, resultSelector) {
        var _this = _super.call(this, outer) || this;
        _this.inner = inner;
        _this.outerKeySelector = outerKeySelector;
        _this.innerKeySelector = innerKeySelector;
        _this.resultSelector = resultSelector;
        return _this;
    }
    GroupJoinIterator.prototype.next = function () {
        var _this = this;
        var outerItem;
        var innerItem;
        do {
            outerItem = _super.prototype.next.call(this);
            if (outerItem.done)
                return { value: undefined, done: true };
        } while (Util.isUndefined(outerItem.value));
        var outerKey = this.outerKeySelector(outerItem.value);
        var innerSelection = new filter_1.FilterIterator(this.inner, function (x, idx) { return outerKey === _this.innerKeySelector(x); });
        var innerArray = [];
        while (!(innerItem = innerSelection.next()).done) {
            innerArray.push(innerItem.value);
        }
        return {
            value: this.resultSelector(outerItem.value, innerArray),
            done: outerItem.done
        };
    };
    return GroupJoinIterator;
}(iterator_1.BaseIterator));
exports.GroupJoinIterator = GroupJoinIterator;
//# sourceMappingURL=groupJoin.js.map
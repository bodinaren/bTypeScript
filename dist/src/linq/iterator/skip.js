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
var SkipIterator = (function (_super) {
    __extends(SkipIterator, _super);
    function SkipIterator(source, count) {
        var _this = _super.call(this, source) || this;
        _this.count = count;
        _this.counter = 0;
        return _this;
    }
    SkipIterator.prototype.next = function () {
        for (; this.counter < this.count; this.counter++)
            _super.prototype.next.call(this);
        return _super.prototype.next.call(this);
    };
    return SkipIterator;
}(iterator_1.BaseIterator));
exports.SkipIterator = SkipIterator;
function skip(source, count) {
    return new SkipIterator(source, count);
}
/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 * @param count The number of elements to skip before returning the remaining elements.
 */
function skipProto(count) {
    return this.lift(skip, count);
}
exports.skipProto = skipProto;
/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 * @param count The number of elements to skip before returning the remaining elements.
 */
function skipStatic(source, count) {
    return source.slice(count);
    // return new Linq(source).skip(count).toArray();
}
exports.skipStatic = skipStatic;
//# sourceMappingURL=skip.js.map
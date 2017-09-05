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
var TakeIterator = (function (_super) {
    __extends(TakeIterator, _super);
    function TakeIterator(source, count) {
        var _this = _super.call(this, source) || this;
        _this.count = count;
        _this._counter = 0;
        return _this;
    }
    TakeIterator.prototype.next = function () {
        if (this._counter < this.count) {
            this._counter++;
            return _super.prototype.next.call(this);
        }
        return {
            value: undefined,
            done: true
        };
    };
    return TakeIterator;
}(iterator_1.BaseIterator));
exports.TakeIterator = TakeIterator;
function take(source, count) {
    return new TakeIterator(source, count);
}
/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @param count The number of elements to return.
 */
function takeProto(count) {
    return this.lift(take, count);
}
exports.takeProto = takeProto;
/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @param count The number of elements to return.
 */
function takeStatic(source, count) {
    return source.slice(0, count);
    // return new Linq(source).skip(count).toArray();
}
exports.takeStatic = takeStatic;
//# sourceMappingURL=take.js.map
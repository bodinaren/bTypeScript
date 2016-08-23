"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iterator_1 = require("./iterator");
var Util = require("../util");
var SkipWhileIterator = (function (_super) {
    __extends(SkipWhileIterator, _super);
    function SkipWhileIterator(source, _predicate) {
        if (_predicate === void 0) { _predicate = Util.defaultPredicate; }
        _super.call(this, source);
        this._done = false;
        this._predicate = _predicate;
    }
    SkipWhileIterator.prototype.next = function () {
        var item;
        do {
            item = this._next();
        } while (!this._done && this._predicate(item, this._idx));
        this._done = true;
        return item;
    };
    return SkipWhileIterator;
}(iterator_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkipWhileIterator;
//# sourceMappingURL=skipWhile.js.map
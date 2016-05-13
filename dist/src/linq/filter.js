"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iterator_1 = require("./iterator");
var Util = require("../util");
var FilterIterator = (function (_super) {
    __extends(FilterIterator, _super);
    function FilterIterator(source, callback) {
        _super.call(this, source);
        this._callback = callback;
    }
    FilterIterator.prototype.next = function () {
        var item;
        do {
            item = this._next();
            if (Util.isUndefined(item))
                break;
            if (true === this._callback(item))
                break;
        } while (item);
        return item;
    };
    return FilterIterator;
}(iterator_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FilterIterator;
//# sourceMappingURL=filter.js.map
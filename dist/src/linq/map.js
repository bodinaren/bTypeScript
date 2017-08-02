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
var Util = require("../util");
var iterator_1 = require("./iterator");
var MapIterator = (function (_super) {
    __extends(MapIterator, _super);
    function MapIterator(source, callback) {
        var _this = _super.call(this, source) || this;
        _this.callback = callback;
        return _this;
    }
    MapIterator.prototype.next = function () {
        var item = _super.prototype.next.call(this);
        return (!Util.isUndefined(item.value))
            ? { value: this.callback(item.value, this._idx), done: false }
            : { value: undefined, done: true };
    };
    return MapIterator;
}(iterator_1.default));
exports.default = MapIterator;
//# sourceMappingURL=map.js.map
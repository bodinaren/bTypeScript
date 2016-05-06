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
        define(["require", "exports", "../util", "./iterator"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Util = require("../util");
    var iterator_1 = require("./iterator");
    var LinqMapIterator = (function (_super) {
        __extends(LinqMapIterator, _super);
        function LinqMapIterator(source, callback) {
            _super.call(this, source);
            this._callback = callback;
        }
        LinqMapIterator.prototype.next = function () {
            var item = this._next();
            return (!Util.isUndefined(item))
                ? this._callback(item, this._idx)
                : undefined;
        };
        return LinqMapIterator;
    }(iterator_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LinqMapIterator;
});
//# sourceMappingURL=map.js.map
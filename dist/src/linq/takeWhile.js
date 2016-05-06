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
        define(["require", "exports", "./iterator", "../util"], factory);
    }
})(function (require, exports) {
    "use strict";
    var iterator_1 = require("./iterator");
    var Util = require("../util");
    var TakeWhileIterator = (function (_super) {
        __extends(TakeWhileIterator, _super);
        function TakeWhileIterator(source, _predicate) {
            if (_predicate === void 0) { _predicate = Util.defaultPredicate; }
            _super.call(this, source);
            this._predicate = _predicate;
        }
        TakeWhileIterator.prototype.next = function () {
            var n = this._next();
            if (this._predicate(n)) {
                return n;
            }
        };
        return TakeWhileIterator;
    }(iterator_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TakeWhileIterator;
});
//# sourceMappingURL=takeWhile.js.map
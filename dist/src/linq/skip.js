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
        define(["require", "exports", "./iterator"], factory);
    }
})(function (require, exports) {
    "use strict";
    var iterator_1 = require("./iterator");
    var SkipIterator = (function (_super) {
        __extends(SkipIterator, _super);
        function SkipIterator(source, count) {
            _super.call(this, source);
            this._counter = 0;
            this._count = count;
        }
        SkipIterator.prototype.next = function () {
            for (; this._counter < this._count; this._counter++) {
                this._next();
            }
            return this._next();
        };
        return SkipIterator;
    }(iterator_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SkipIterator;
});
//# sourceMappingURL=skip.js.map
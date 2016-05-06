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
    var TakeIterator = (function (_super) {
        __extends(TakeIterator, _super);
        function TakeIterator(source, count) {
            _super.call(this, source);
            this._counter = 0;
            this._count = count;
        }
        TakeIterator.prototype.next = function () {
            if (this._counter < this._count) {
                this._counter++;
                return this._next();
            }
        };
        return TakeIterator;
    }(iterator_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TakeIterator;
});
//# sourceMappingURL=take.js.map
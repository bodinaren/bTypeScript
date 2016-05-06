(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Iterator = (function () {
        function Iterator(source) {
            this._idx = -1;
            this._buffers = false;
            this._reversed = false;
            this._source = source;
        }
        Iterator.prototype.getIteratorFromPipeline = function (type) {
            if (this instanceof type)
                return this;
            var source = this;
            while (!((source = source._source) instanceof type)) {
            }
            return source;
        };
        Iterator.prototype._next = function () {
            var n = undefined;
            if (this._source instanceof Iterator) {
                return this._source.next();
            }
            else {
                if (this._reversed) {
                    if (this._idx < this._source.length) {
                        n = this._source[this._source.length - 1 - (++this._idx)];
                    }
                }
                else {
                    if (this._idx < this._source.length) {
                        n = this._source[++this._idx];
                    }
                }
            }
            if (this._idx == this._source.length) {
                this._idx = -1;
            }
            return n;
        };
        Iterator.prototype.next = function () { };
        Iterator.prototype.reverse = function () { this._reversed = !this._reversed; };
        return Iterator;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Iterator;
});
//# sourceMappingURL=iterator.js.map
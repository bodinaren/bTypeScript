"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseIterator = (function () {
    function BaseIterator(source) {
        this._idx = -1;
        this._buffers = false;
        this._reversed = false;
        this._done = false;
        this._source = source;
    }
    BaseIterator.prototype.getIteratorFromPipeline = function (type) {
        if (this instanceof type)
            return this;
        var source = this;
        while (!((source = source._source) instanceof type)) {
        }
        return source;
    };
    BaseIterator.prototype.next = function () {
        var n = undefined;
        if (this._source instanceof BaseIterator) {
            var next = this._source.next();
            this._idx++;
            return next;
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
        if (this._idx >= this._source.length) {
            // this._idx = -1; // we finished, reset the counter
            this._done = true;
        }
        return {
            value: n,
            done: this._done
        };
    };
    BaseIterator.prototype.reverse = function () { this._reversed = !this._reversed; };
    BaseIterator.prototype.reset = function () {
        this._idx = -1;
        this._done = false;
    };
    return BaseIterator;
}());
exports.BaseIterator = BaseIterator;
//# sourceMappingURL=iterator.js.map
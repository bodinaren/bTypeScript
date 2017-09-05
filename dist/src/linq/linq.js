"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator/iterator");
var map_1 = require("./iterator/map");
var Util = require("../util");
var Linq = (function () {
    function Linq(source) {
        this._source = (source instanceof iterator_1.BaseIterator)
            ? source
            : new map_1.MapIterator(source, function (item) { return item; });
    }
    Linq.prototype.lift = function (iterator) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Linq(iterator.apply(void 0, [this._source].concat(args)));
    };
    /**
     * Inverts the order of the elements in a sequence.
     * This simply iterates the items from the end, and as such has no additional performance cost.
     */
    Linq.prototype.reverse = function () {
        this._source.reverse();
        return this;
    };
    /**
     * Executes the pipeline and return the resulting array.
     */
    Linq.prototype.toArray = function () {
        var res, arr = [];
        if (Util.isArray(this._source)) {
            arr = Util.cast(this._source).slice();
        }
        else {
            while (!(res = this._source.next()).done) {
                arr.push(res.value);
            }
        }
        return arr;
    };
    return Linq;
}());
exports.Linq = Linq;
function LQ(source) {
    return new Linq(source);
}
exports.LQ = LQ;
//# sourceMappingURL=linq.js.map
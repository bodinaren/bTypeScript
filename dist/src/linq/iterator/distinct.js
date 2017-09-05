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
var Util = require("../../util");
var iterator_1 = require("./iterator");
var linq_1 = require("../linq");
var DistinctIterator = (function (_super) {
    __extends(DistinctIterator, _super);
    function DistinctIterator(source, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var _this = _super.call(this, source) || this;
        _this.comparer = comparer;
        _this._previousItems = [];
        return _this;
    }
    DistinctIterator.prototype.next = function () {
        var _this = this;
        var rs;
        while (!(rs = _super.prototype.next.call(this)).done) {
            if (!this._previousItems.some(function (x) { return _this.comparer(x, rs.value); })) {
                this._previousItems.push(rs.value);
                return rs;
            }
        }
        return {
            value: undefined,
            done: true
        };
    };
    return DistinctIterator;
}(iterator_1.BaseIterator));
exports.DistinctIterator = DistinctIterator;
function distinct(source, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    return new DistinctIterator(source, comparer);
}
/**
 * Get a list of unique items that exists one or more times in the dataset.
 */
function distinctProto(comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    return this.lift(distinct, comparer);
}
exports.distinctProto = distinctProto;
/**
 * Get a list of unique items that exists one or more times in any of the datasets.
 * @param source The datasets to be get distinct items from.
 */
function distinctStatic(source, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    var a = (source instanceof linq_1.Linq) ? source.toArray() : source;
    var result = [];
    a.forEach(function (x) {
        if (!result.some(function (y) { return comparer(x, y); }))
            result.push(x);
        // if (result.indexOf(x) === -1) 
    });
    return result;
    // let lists: Array<Linq> = [], result = [];
    // datasets.forEach(dataset => {
    //     lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast<any[]>(dataset)));
    // });
    // lists.forEach(list => {
    //     list.toArray().forEach(item => {
    //         if (result.indexOf(item) == -1)
    //             result.push(item);
    //     });
    // });
    // return result;
}
exports.distinctStatic = distinctStatic;
//# sourceMappingURL=distinct.js.map
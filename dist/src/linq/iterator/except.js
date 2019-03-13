"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var ExceptIterator = /** @class */ (function (_super) {
    __extends(ExceptIterator, _super);
    function ExceptIterator(source, other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var _this = _super.call(this, source) || this;
        _this.comparer = comparer;
        if (other instanceof iterator_1.BaseIterator) {
            _this.other = other;
        }
        else {
            _this.other = new iterator_1.BaseIterator(other);
        }
        return _this;
    }
    ExceptIterator.prototype.next = function () {
        var _this = this;
        var rs;
        if (!this.otherItems) {
            this.otherItems = [];
            while (!(rs = this.other.next()).done) {
                this.otherItems.push(rs.value);
            }
        }
        while (!(rs = _super.prototype.next.call(this)).done) {
            if (!this.otherItems.some(function (x) { return _this.comparer(rs.value, x); })) {
                return rs;
            }
        }
        return {
            value: undefined,
            done: true
        };
    };
    return ExceptIterator;
}(iterator_1.BaseIterator));
exports.ExceptIterator = ExceptIterator;
function except(source, other, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    return new ExceptIterator(source, other, comparer);
}
/**
 * Get a list of items that only exists in one of the datasets.
 * @param other The other dataset.
 */
function exceptProto(other, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    return this.lift(except, other, comparer);
}
exports.exceptProto = exceptProto;
/**
 * Get a list of items that only exists in one of the datasets.
 * @param a The first dataset.
 * @param b The second dataset.
 */
function exceptStatic(source, other, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    var a = (source instanceof linq_1.Linq) ? source.toArray() : source, b = (other instanceof linq_1.Linq) ? other.toArray() : other;
    var result = [];
    a.forEach(function (x) {
        if (!b.some(function (y) { return comparer(x, y); }))
            result.push(x);
    });
    return result;
    // lists.push((a instanceof Linq) ? a.toArray() : a);
    // lists.push((b instanceof Linq) ? b.toArray() : b);
    // let lists: Array<any[]> = [], result = [];
    // lists.push((a instanceof Linq) ? a.toArray() : a);
    // lists.push((b instanceof Linq) ? b.toArray() : b);
    // more.forEach(dataset => {
    //     lists.push((dataset instanceof Linq) ? dataset.toArray() : dataset);
    // });
    // lists.forEach(list => {
    //     list.forEach(item => {
    //         let exists = lists.some(other => {
    //             if (list === other) return;
    //             if (other.some(x =>  x === item)) return true;
    //         });
    //         if (!exists) result.push(item);
    //     });
    // });
    // return result;
}
exports.exceptStatic = exceptStatic;
//# sourceMappingURL=except.js.map
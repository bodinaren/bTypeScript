"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
/**
 * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector A transform function to apply to each element.
 */
function sumProto(selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return sumStatic(this.toArray(), selector);
}
exports.sumProto = sumProto;
/**
 * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector A transform function to apply to each element.
 */
function sumStatic(source, selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    var i, sum = 0;
    for (i = 0; i < source.length; i++) {
        sum += selector(source[i]);
    }
    return sum;
}
exports.sumStatic = sumStatic;
//# sourceMappingURL=sum.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
/**
 * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function minProto(selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return minStatic(this.toArray(), selector);
}
exports.minProto = minProto;
/**
 * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function minStatic(source, selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return Math.min.apply(Math, source.map(selector));
}
exports.minStatic = minStatic;
//# sourceMappingURL=min.js.map
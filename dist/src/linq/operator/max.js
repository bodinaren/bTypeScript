"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
/**
 * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function maxProto(selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return maxStatic(this.toArray(), selector);
}
exports.maxProto = maxProto;
/**
 * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function maxStatic(source, selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return Math.max.apply(Math, source.map(selector));
}
exports.maxStatic = maxStatic;
//# sourceMappingURL=max.js.map
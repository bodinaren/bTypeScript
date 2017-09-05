"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
/**
 * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function averageProto(selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return averageStatic(this.toArray(), selector);
}
exports.averageProto = averageProto;
/**
 * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function averageStatic(source, selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    var i, total = 0;
    for (i = 0; i < source.length; i++) {
        total += selector(source[i]);
    }
    return total / source.length;
}
exports.averageStatic = averageStatic;
//# sourceMappingURL=average.js.map
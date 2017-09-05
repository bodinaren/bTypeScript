"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
require("../add/first");
/**
 * Returns the last matching item in the array.
 * @param predicate
 */
function lastProto(predicate) {
    if (predicate === void 0) { predicate = Util.defaultPredicate; }
    return this.reverse().first(predicate);
}
exports.lastProto = lastProto;
/**
 * Returns the last matching item in the array.
 * @param predicate
 */
function lastStatic(source, predicate) {
    if (!source || source.length === 0)
        return undefined;
    if (!predicate)
        return source[source.length - 1];
    for (var i = source.length - 1; i >= 0; i--) {
        if (predicate(source[i])) {
            return source[i];
        }
    }
    return undefined;
}
exports.lastStatic = lastStatic;
//# sourceMappingURL=last.js.map
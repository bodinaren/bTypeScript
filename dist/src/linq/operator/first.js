"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
require("../add/filter");
require("../add/take");
/**
 * Returns the first matching item in the array.
 * @param predicate
 */
function firstProto(predicate) {
    if (predicate === void 0) { predicate = Util.defaultPredicate; }
    var arr = this.filter(predicate).take(1).toArray();
    if (arr.length == 1)
        return arr[0];
    else
        return undefined;
}
exports.firstProto = firstProto;
/**
 * Returns the first matching item in the array.
 * @param predicate
 */
function firstStatic(source, predicate) {
    if (!source || source.length === 0)
        return undefined;
    if (!predicate)
        return source[0];
    var rs = undefined;
    for (var i = 0; i < source.length; i++) {
        if (predicate(source[i])) {
            return source[i];
        }
    }
    return undefined;
}
exports.firstStatic = firstStatic;
//# sourceMappingURL=first.js.map
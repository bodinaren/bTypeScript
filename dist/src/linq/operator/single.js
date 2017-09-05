"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../add/filter");
require("../add/take");
/**
 * Returns the matching item in the array. If there are zero or several matches an exception will be thrown
 * @param predicate
 * @throws Error.
 */
function singleProto(predicate) {
    var arr = this.filter(predicate).take(2).toArray();
    if (arr.length == 0)
        throw new Error("The sequence is empty.");
    if (arr.length == 2)
        throw new Error("The sequence contains more than one element.");
    if (arr.length == 1)
        return arr[0];
}
exports.singleProto = singleProto;
/**
 * Returns the matching item in the array. If there are zero or several matches an exception will be thrown
 * @param predicate
 * @throws Error
 */
function singleStatic(source, predicate) {
    if (!source || source.length === 0)
        return undefined;
    if (!predicate)
        return source[0];
    var rs = undefined;
    for (var i = 0; i < source.length; i++) {
        if (predicate(source[i])) {
            if (rs)
                throw new Error("The sequence contains more than one element.");
            rs = source[i];
        }
    }
    if (!rs)
        throw new Error("The sequence is empty.");
    return rs;
}
exports.singleStatic = singleStatic;
//# sourceMappingURL=single.js.map
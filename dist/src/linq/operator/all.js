"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../add/any");
/**
 * Determines whether all elements of a sequence satisfy a condition.
 * @param predicate A function to test each element for a condition.
 * @param invert If true, determines whether none elements of a sequence satisfy a condition.
 */
function allProto(predicate, invert) {
    if (invert === void 0) { invert = false; }
    return !(this.any(predicate, !invert));
}
exports.allProto = allProto;
/**
 * Determines whether all elements of a sequence satisfy a condition.
 * @param predicate A function to test each element for a condition.
 * @param invert If true, determines whether none elements of a sequence satisfy a condition.
 */
function allStatic(source, predicate, invert) {
    if (invert === void 0) { invert = false; }
    return source.every(function (x) { return !!predicate(x) !== invert; });
}
exports.allStatic = allStatic;
// /**
//  * Determines whether all elements of a sequence satisfy a condition.
//  * @param predicate A function to test each element for a condition.
//  * @param invert If true, determines whether none elements of a sequence satisfy a condition.
//  */
// all(predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
//     return !(this.any(predicate, !invert));
// }
// /**
//  * Determines whether all elements of a sequence satisfy a condition.
//  * @param predicate A function to test each element for a condition.
//  * @param invert If true, determines whether none elements of a sequence satisfy a condition.
//  */
// static all<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
//     return source.every(x => !!predicate(x) !== invert);
// }
//# sourceMappingURL=all.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../add/first");
/**
 * Determines whether any element of a sequence satisfies a condition.
 * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
 * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
 */
function anyProto(predicate, invert) {
    if (invert === void 0) { invert = false; }
    return typeof this.first(function (x) { return !!predicate(x) !== invert; }) !== "undefined";
}
exports.anyProto = anyProto;
/**
 * Determines whether any element of a sequence satisfies a condition.
 * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
 * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
 */
function anyStatic(source, predicate, invert) {
    if (invert === void 0) { invert = false; }
    return source.some(function (x) { return !!predicate(x) !== invert; });
}
exports.anyStatic = anyStatic;
// /**
//  * Determines whether any element of a sequence satisfies a condition.
//  * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
//  * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
//  */
// any(predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
//     return typeof this.first(x => !!predicate(x) !== invert) !== "undefined";
// }
// /**
//  * Determines whether any element of a sequence satisfies a condition.
//  * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
//  * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
//  */
// static any<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
//     return source.some(x => !!predicate(x) !== invert);
// }
//# sourceMappingURL=any.js.map
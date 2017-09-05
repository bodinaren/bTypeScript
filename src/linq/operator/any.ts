import * as Util from "../../util";
import {Linq} from "../linq";
import "../add/first";

/**
 * Determines whether any element of a sequence satisfies a condition.
 * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
 * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
 */
export function anyProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
    return typeof this.first(x => !!predicate(x) !== invert) !== "undefined";
}
/**
 * Determines whether any element of a sequence satisfies a condition.
 * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
 * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
 */
export function anyStatic<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
    return source.some(x => !!predicate(x) !== invert);
}


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

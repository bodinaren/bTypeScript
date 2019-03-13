import * as Util from "../../util";
import {Linq} from "../linq";
import "../add/any";

/**
 * Determines whether all elements of a sequence satisfy a condition.
 * @param predicate A function to test each element for a condition.
 * @param invert If true, determines whether none elements of a sequence satisfy a condition.
 */
export function allProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
    return !(this.any(predicate, !invert));
}
/**
 * Determines whether all elements of a sequence satisfy a condition.
 * @param predicate A function to test each element for a condition.
 * @param invert If true, determines whether none elements of a sequence satisfy a condition.
 */
export function allStatic<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
    return source.every(x => !!predicate(x) !== invert);
}



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

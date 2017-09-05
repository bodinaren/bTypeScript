import * as Util from "../../util";
import { Linq } from "../linq";
import "../add/any";
/**
 * Determines whether all elements of a sequence satisfy a condition.
 * @param predicate A function to test each element for a condition.
 * @param invert If true, determines whether none elements of a sequence satisfy a condition.
 */
export declare function allProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<TSource>, invert?: boolean): boolean;
/**
 * Determines whether all elements of a sequence satisfy a condition.
 * @param predicate A function to test each element for a condition.
 * @param invert If true, determines whether none elements of a sequence satisfy a condition.
 */
export declare function allStatic<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert?: boolean): boolean;

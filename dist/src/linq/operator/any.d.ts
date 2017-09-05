import * as Util from "../../util";
import { Linq } from "../linq";
import "../add/first";
/**
 * Determines whether any element of a sequence satisfies a condition.
 * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
 * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
 */
export declare function anyProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<TSource>, invert?: boolean): boolean;
/**
 * Determines whether any element of a sequence satisfies a condition.
 * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
 * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
 */
export declare function anyStatic<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert?: boolean): boolean;

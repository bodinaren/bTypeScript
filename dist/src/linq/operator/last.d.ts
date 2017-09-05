import * as Util from "../../util";
import { Linq } from "../linq";
import "../add/first";
/**
 * Returns the last matching item in the array.
 * @param predicate
 */
export declare function lastProto<TSource>(this: Linq<TSource>, predicate?: Util.IPredicate<TSource>): TSource;
/**
 * Returns the last matching item in the array.
 * @param predicate
 */
export declare function lastStatic<TSource>(source: TSource[], predicate?: Util.IPredicate<TSource>): TSource;

import * as Util from "../../util";
import { Linq } from "../linq";
import "../add/filter";
import "../add/take";
/**
 * Returns the first matching item in the array.
 * @param predicate
 */
export declare function firstProto<TSource>(this: Linq<TSource>, predicate?: Util.IPredicate<TSource>): any;
/**
 * Returns the first matching item in the array.
 * @param predicate
 */
export declare function firstStatic<TSource>(source: TSource[], predicate?: Util.IPredicate<TSource>): TSource;

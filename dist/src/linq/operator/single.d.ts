import * as Util from "../../util";
import { Linq } from "../linq";
import "../add/filter";
import "../add/take";
/**
 * Returns the matching item in the array. If there are zero or several matches an exception will be thrown
 * @param predicate
 * @throws Error.
 */
export declare function singleProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<TSource>): TSource;
/**
 * Returns the matching item in the array. If there are zero or several matches an exception will be thrown
 * @param predicate
 * @throws Error
 */
export declare function singleStatic<TSource>(source: TSource[], predicate: (predicate: any) => boolean): TSource;

import * as Util from "../../util";
import { Linq } from "../linq";
/**
 * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
export declare function maxProto<TSource>(this: Linq<TSource>, selector?: Util.ISelector<TSource, number>): number;
/**
 * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
export declare function maxStatic<TSource>(source: TSource[], selector?: Util.ISelector<TSource, number>): number;

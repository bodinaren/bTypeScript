import * as Util from "../../util";
import { Linq } from "../linq";
/**
 * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
export declare function minProto<TSource>(this: Linq<TSource>, selector?: Util.ISelector<TSource, number>): number;
/**
 * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
export declare function minStatic<TSource>(source: TSource[], selector?: Util.ISelector<TSource, number>): number;

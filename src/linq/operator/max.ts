import * as Util from "../../util";
import {Linq} from "../linq";

/**
 * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
export function maxProto<TSource>(this: Linq<TSource>, selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
    return maxStatic(this.toArray<TSource>(), selector);
}

/**
 * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
export function maxStatic<TSource>(source: TSource[], selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
    return Math.max.apply(Math, source.map(selector));
}

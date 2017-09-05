import * as Util from "../../util";
import {Linq} from "../linq";

/**
 * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
export function minProto<TSource>(this: Linq<TSource>, selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
    return minStatic(this.toArray<TSource>(), selector);
}

/**
 * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
export function minStatic<TSource>(source: TSource[], selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
    return Math.min.apply(Math, source.map(selector));
}

import * as Util from "../../util";
import {Linq} from "../linq";

/**
 * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector A transform function to apply to each element.
 */
export function sumProto<TSource>(this: Linq<TSource>, selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
    return sumStatic(this.toArray<TSource>(), selector);
}

/**
 * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector A transform function to apply to each element.
 */
export function sumStatic<TSource>(source: TSource[], selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
    return source.reduce((sum, item) => sum + selector(item), 0);
}

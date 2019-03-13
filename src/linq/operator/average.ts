import * as Util from "../../util";
import {Linq} from "../linq";

/**
 * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
export function averageProto<TSource>(this: Linq<TSource>, selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
    return averageStatic(this.toArray<TSource>(), selector);
}
/**
 * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
export function averageStatic<TSource>(source: TSource[], selector: Util.ISelector<TSource, number> = Util.defaultSelector): number {
    let i, total = 0;
    for (i = 0; i < source.length; i++) {
        total += selector(source[i]);
    }
    return total / source.length;
}

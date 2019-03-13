import * as Util from "../../util";
import {Linq} from "../linq";
import "../add/first";

/**
 * Returns the last matching item in the array.
 * @param predicate
 */
export function lastProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<TSource> = Util.defaultPredicate): TSource {
    return this.reverse().first(predicate);
}
/**
 * Returns the last matching item in the array.
 * @param predicate
 */
export function lastStatic<TSource>(source: TSource[], predicate?: Util.IPredicate<TSource>): TSource {
    if (!source || source.length === 0) return undefined;
    if (!predicate) return source[source.length - 1];

    for (let i = source.length - 1; i >= 0; i--) {
        if (predicate(source[i])) {
            return source[i];
        }
    }

    return undefined;
}

import * as Util from "../../util";
import {Linq} from "../linq";
import "../add/filter";
import "../add/take";

/**
 * Returns the first matching item in the array.
 * @param predicate
 */
export function firstProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<TSource> = Util.defaultPredicate): any {
    let arr = this.filter(predicate).take(1).toArray();
    if (arr.length == 1) return arr[0];
    else return undefined;
}

/**
 * Returns the first matching item in the array.
 * @param predicate
 */
export function firstStatic<TSource>(source: TSource[], predicate?: Util.IPredicate<TSource>): TSource {
    if (!source || source.length === 0) return undefined;
    if (!predicate) return source[0];

    let rs = undefined;
    for (let i = 0; i < source.length; i++) {
        if (predicate(source[i])) {
            return source[i];
        }
    }

    return undefined;
}

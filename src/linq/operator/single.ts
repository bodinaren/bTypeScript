import * as Util from "../../util";
import {Linq} from "../linq";
import "../add/filter";
import "../add/take";

/**
 * Returns the matching item in the array. If there are zero or several matches an exception will be thrown
 * @param predicate
 * @throws Error.
 */
export function singleProto<TSource>(this: Linq<TSource>, predicate: Util.IPredicate<TSource>): TSource {
    let arr = this.filter(predicate).take(2).toArray<TSource>();
    if (arr.length == 0) throw new Error("The sequence is empty.");
    if (arr.length == 2) throw new Error("The sequence contains more than one element.");
    if (arr.length == 1) return arr[0];
}
/**
 * Returns the matching item in the array. If there are zero or several matches an exception will be thrown
 * @param predicate
 * @throws Error
 */
export function singleStatic<TSource>(source: TSource[], predicate: (predicate) => boolean): TSource {
    if (!source || source.length === 0) return undefined;
    if (!predicate) return source[0];

    let rs = undefined;
    for (let i = 0; i < source.length; i++) {
        if (predicate(source[i])) {
            if (rs) throw new Error("The sequence contains more than one element.");

            rs = source[i];
        }
    }

    if (!rs) throw new Error("The sequence is empty.");

    return rs;
}

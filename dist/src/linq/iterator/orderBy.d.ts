import { BaseIterator, IteratorResult } from "./iterator";
import * as Util from "../../util";
import { Linq } from "../linq";
export declare class OrderByIterator<TSource, TKey> extends BaseIterator<TSource> {
    private descending;
    private _orders;
    private _isOrdered;
    constructor(source: TSource[] | BaseIterator<TSource>, keySelector?: Util.ISelector<TSource, TKey>, comparer?: Util.IComparer<TKey>, descending?: boolean);
    next(): IteratorResult<TSource>;
    thenBy(keySelector?: Util.ISelector<TSource, TKey>, comparer?: Util.IComparer<TKey>, descending?: boolean): void;
}
export declare function orderByProto<TKey>(this: Linq<any>, keySelector: Util.ISelector<any, TKey> | string, comparer?: Util.IComparer<TKey>): OrderedLinq<any, TKey>;
/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
export declare function orderByStatic<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string, comparer?: Util.IComparer<TKey>): TSource[];
export declare function orderByDescProto<TKey>(this: Linq<any>, keySelector: Util.ISelector<any, TKey> | string, comparer?: Util.IComparer<TKey>): OrderedLinq<any, TKey>;
/**
 * Sorts the elements of a sequence in descending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
export declare function orderByDescStatic<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string, comparer?: Util.IComparer<TKey>): TSource[];
export declare class OrderedLinq<TSource, TKey> extends Linq<TSource> {
    constructor(source: TSource[] | BaseIterator<TSource>);
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenBy(keySelector: Util.ISelector<TSource, TKey> | string, comparer?: Util.IComparer<TKey>): OrderedLinq<TSource, TKey>;
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenByDesc(keySelector: Util.ISelector<TSource, TKey> | string, comparer?: Util.IComparer<TKey>): OrderedLinq<TSource, TKey>;
}

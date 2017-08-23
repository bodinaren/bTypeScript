import BaseIterator, { IteratorResult } from "./iterator";
import * as Util from "../util";
export default class OrderIterator<TSource, TKey> extends BaseIterator<TSource> {
    private descending;
    private _orders;
    private _isOrdered;
    constructor(source: TSource[] | BaseIterator<TSource>, keySelector?: Util.ISelector<TSource, TKey>, comparer?: Util.IComparer<TKey>, descending?: boolean);
    next(): IteratorResult<TSource>;
    thenBy(keySelector?: Util.ISelector<TSource, TKey>, comparer?: Util.IComparer<TKey>, descending?: boolean): void;
}

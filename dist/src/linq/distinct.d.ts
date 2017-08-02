import * as Util from "../util";
import BaseIterator, { IteratorResult } from "./iterator";
export default class DistinctIterator<TSource> extends BaseIterator<TSource> {
    private comparer;
    private _previousItems;
    constructor(source: TSource[] | BaseIterator<TSource>, comparer?: Util.IEqualityComparer<any>);
    next(): IteratorResult<TSource>;
}

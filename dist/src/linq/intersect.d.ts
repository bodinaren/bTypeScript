import * as Util from "../util";
import BaseIterator, { IteratorResult } from "./iterator";
export default class IntersectIterator<TSource> extends BaseIterator<TSource> {
    private comparer;
    private other;
    private otherItems;
    constructor(source: TSource[] | BaseIterator<TSource>, other: TSource[] | BaseIterator<TSource>, comparer?: Util.IEqualityComparer<TSource>);
    next(): IteratorResult<TSource>;
}

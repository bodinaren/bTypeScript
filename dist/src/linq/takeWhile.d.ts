import BaseIterator, { IteratorResult } from "./iterator";
import * as Util from "../util";
export default class TakeWhileIterator<TSource> extends BaseIterator<TSource> {
    private predicate;
    constructor(source: TSource[] | BaseIterator<TSource>, predicate?: Util.IPredicate<TSource>);
    next(): IteratorResult<TSource>;
}

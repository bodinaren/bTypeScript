import BaseIterator, { IteratorResult } from "./iterator";
import * as Util from "../util";
export default class SkipWhileIterator<TSource> extends BaseIterator<TSource> {
    private predicate;
    private done;
    constructor(source: TSource[] | BaseIterator<TSource>, predicate?: Util.IPredicate<TSource>);
    next(): IteratorResult<TSource>;
}

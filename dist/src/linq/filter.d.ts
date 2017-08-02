import BaseIterator, { IteratorResult } from "./iterator";
import * as Util from "../util";
export default class FilterIterator<TSource> extends BaseIterator<TSource> {
    private callback;
    constructor(source: TSource[] | BaseIterator<TSource>, callback?: Util.IPredicate<TSource>);
    next(): IteratorResult<TSource>;
}

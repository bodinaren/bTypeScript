import BaseIterator, { IteratorResult } from "./iterator";
export default class SkipIterator<TSource> extends BaseIterator<TSource> {
    private count;
    private counter;
    constructor(source: TSource[] | BaseIterator<TSource>, count: number);
    next(): IteratorResult<TSource>;
}

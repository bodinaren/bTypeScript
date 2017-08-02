import BaseIterator, { IteratorResult } from "./iterator";
export default class TakeIterator<TSource> extends BaseIterator<TSource> {
    private count;
    private _counter;
    constructor(source: TSource[] | BaseIterator<TSource>, count: number);
    next(): IteratorResult<TSource>;
}

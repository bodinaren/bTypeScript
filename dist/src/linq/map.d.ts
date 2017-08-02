import BaseIterator, { IteratorResult } from "./iterator";
export default class MapIterator<TSource, TResult> extends BaseIterator<TSource> {
    private callback;
    constructor(source: TSource[] | BaseIterator<TSource>, callback: (item: TSource, idx: number) => TResult);
    next(): IteratorResult<TResult>;
}

import BaseIterator, { IteratorResult } from "./iterator";
export default class ZipIterator<TFirst, TSecond, TResult> extends BaseIterator<TFirst> {
    private other;
    private callback;
    constructor(source: TFirst[] | BaseIterator<TFirst>, other: TSecond[], callback: (a: TFirst, b: TSecond, idx: number) => TResult);
    next(): IteratorResult<TResult>;
}

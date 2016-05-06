import Iterator from "./iterator";
export default class SkipIterator extends Iterator {
    private _count;
    private _counter;
    constructor(source: any[] | Iterator, count: number);
    next(): any;
}

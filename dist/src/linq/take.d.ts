import Iterator from "./iterator";
export default class TakeIterator extends Iterator {
    private _count;
    private _counter;
    constructor(source: any[] | Iterator, count: number);
    next(): any;
}

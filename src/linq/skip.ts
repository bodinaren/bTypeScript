import Iterator from "./iterator";

export default class SkipIterator extends Iterator {
    private _count: number;
    private _counter: number = 0;

    constructor(source: any[] | Iterator, count: number) {
        super(source);
        this._count = count;
    }

    next(): any {
        for (; this._counter < this._count; this._counter++) {
            this._next();
        }
        return this._next();
    }
}

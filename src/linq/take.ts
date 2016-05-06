import Iterator from "./iterator";

export default class TakeIterator extends Iterator {
    private _count: number;
    private _counter: number = 0;
    
    constructor(source: any[] | Iterator, count: number) {
        super(source);
        this._count = count;
    }

    next(): any {
        if (this._counter < this._count) {
            this._counter++;
            return this._next();
        }
    }
}
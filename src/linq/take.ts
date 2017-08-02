import BaseIterator, {IteratorResult} from "./iterator";

export default class TakeIterator<TSource> extends BaseIterator<TSource> {
private _counter: number = 0;

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private count: number
    ) {
        super(source);
    }

    next(): IteratorResult<TSource> {
        if (this._counter < this.count) {
            this._counter++;
            return super.next();
        }
        return {
            value: undefined,
            done: true
        };
    }
}

export class BaseIterator<TSource> implements Iterator<TSource> {
    protected _source: any;
    protected _idx: number = -1;
    protected _buffers: boolean = false;
    protected _reversed: boolean = false;
    protected _done: boolean = false;

    constructor(
        source: any[] | BaseIterator<TSource>
    ) {
        this._source = source;
    }

    getIteratorFromPipeline(type: any): any {
        if (this instanceof type) return this;
        let source = this;
        while (!((source = source._source) instanceof type)) {
        }
        return source;
    }

    next(): IteratorResult<any> {
        let n: TSource = undefined;
        if (this._source instanceof BaseIterator) {
            let next: IteratorResult<TSource> = this._source.next();
            this._idx++;
            return next;
        } else {
            if (this._reversed) {
                if (this._idx < this._source.length) {
                    n = this._source[this._source.length - 1 - (++this._idx)];
                }
            } else {
                if (this._idx < this._source.length) {
                    n = this._source[++this._idx];
                }
            }
        }

        if (this._idx >= this._source.length) {
            // this._idx = -1; // we finished, reset the counter
            this._done = true;
        }
        return {
            value: n,
            done: this._done
        };
    }

    reverse() { this._reversed = !this._reversed; }

    protected reset() {
        this._idx = -1;
        this._done = false;
    }
}

export interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}

export interface IteratorResult<T> {
    done: boolean;
    value?: T;
}

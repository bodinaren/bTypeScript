export default class Iterator {
    protected _source: any;
    protected _idx: number = -1;
    protected _buffers: boolean = false;
    protected _reversed: boolean = false;

    constructor(source: any[] | Iterator) {
        this._source = source;
    }
    
    getIteratorFromPipeline(type: any): any {
        if (this instanceof type) return this;
        let source = this;
        while (!((source = source._source) instanceof type)) {
        }
        return source;
    }
    
    protected _next(): any {
        let n: any = undefined;
        if (this._source instanceof Iterator) {
            return this._source.next();
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
        if (this._idx == this._source.length) {
            this._idx = -1; // we finished, reset the counter
        }
        return n;
    }

    next(): any { }

    reverse() { this._reversed = !this._reversed; }
}
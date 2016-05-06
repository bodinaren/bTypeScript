export default class Iterator {
    protected _source: any;
    protected _idx: number;
    protected _buffers: boolean;
    protected _reversed: boolean;
    constructor(source: any[] | Iterator);
    getIteratorFromPipeline(type: any): any;
    protected _next(): any;
    next(): any;
    reverse(): void;
}

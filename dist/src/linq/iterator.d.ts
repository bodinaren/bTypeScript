export default class BaseIterator<TSource> implements Iterator<TSource> {
    protected _source: any;
    protected _idx: number;
    protected _buffers: boolean;
    protected _reversed: boolean;
    protected _done: boolean;
    constructor(source: any[] | BaseIterator<TSource>);
    getIteratorFromPipeline(type: any): any;
    next(): IteratorResult<any>;
    reverse(): void;
    protected reset(): void;
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

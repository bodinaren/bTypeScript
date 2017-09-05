import { BaseIterator } from "./iterator/iterator";
export declare class Linq<TSource> {
    _source: BaseIterator<TSource>;
    constructor(source: TSource[] | BaseIterator<TSource>);
    lift(iterator: (source: any[] | BaseIterator<any>, ...args: any[]) => BaseIterator<TSource>, ...args: any[]): Linq<any>;
    /**
     * Inverts the order of the elements in a sequence.
     * This simply iterates the items from the end, and as such has no additional performance cost.
     */
    reverse(): Linq<TSource>;
    /**
     * Executes the pipeline and return the resulting array.
     */
    toArray<TResult>(): TResult[];
}
export declare function LQ<TSource>(source: TSource[]): Linq<TSource>;

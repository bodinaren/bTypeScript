/**
 * A Stack works by first in, first out.
 */
export default class Queue<T> {
    private _list;
    /** Get the number of items in the queue */
    readonly length: number;
    /**
     * @param items T[] Items to start filling the stack with.
     */
    constructor(items?: T[]);
    /**
     * Adds an item to the end of the queue.
     */
    enqueue(val: T): number;
    /**
     * Gets and remove an item from the head of the queue.
     */
    dequeue(): T;
}

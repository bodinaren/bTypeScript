import {LinkedList} from "./linkedList";

/**
 * A Stack works by first in, first out.
 */
export class Queue<T> {
    private _list: LinkedList<T>;

    /** Get the number of items in the queue */
    get length(): number { return this._list.length; }

    /**
     * @param items T[] Items to start filling the stack with.
     */
    constructor(items?: T[]) {
        this._list = new LinkedList<T>(items);
    }

    /**
     * Adds an item to the end of the queue.
     */
    enqueue(val: T): number {
        this._list.insert(val);
        return this._list.length;
    }

    /**
     * Gets and remove an item from the head of the queue.
     */
    dequeue(): T {
        let item = this._list.get(0);
        this._list.removeAt(0);
        return item;
    }
}

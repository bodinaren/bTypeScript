import LinkedList from "./linkedList";

/**
 * A Stack works by last in, first out.
 */
export default class Stack<T> {

    private _list: LinkedList<T>;

    /** Get the number of items in the stack */
    get length(): number { return this._list.length; }

    /**
     * @param items T[] Items to start filling the stack with.
     */
    constructor(items?: T[]) {
        this._list = new LinkedList<T>(items);
    }

    /**
     * Adds an item to the top of the stack.
     */
    push(item: T): number {
        this._list.insertAt(0, item);
        return this._list.length;
    }

    /**
     * Get and remove an item from the top of the stack.
     */
    pop(): T {
        let item = this.peek();
        this._list.removeAt(0);
        return item;
    }

    /**
     * Get an item from the top of the stack without removing it.
     */
    peek(): T {
        return this._list.get(0);
    }

    /**
     * Clear the stack
     */
    clear() {
        this._list.clear();
    }
}

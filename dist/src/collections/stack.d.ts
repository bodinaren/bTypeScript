/**
 * A Stack works by last in, first out.
 */
export default class Stack<T> {
    private _list;
    /** Get the number of items in the stack */
    readonly length: number;
    /**
     * @param items T[] Items to start filling the stack with.
     */
    constructor(items?: T[]);
    /**
     * Adds an item to the top of the stack.
     */
    push(item: T): number;
    /**
     * Get and remove an item from the top of the stack.
     */
    pop(): T;
    /**
     * Get an item from the top of the stack without removing it.
     */
    peek(): T;
    /**
     * Clear the stack
     */
    clear(): void;
}

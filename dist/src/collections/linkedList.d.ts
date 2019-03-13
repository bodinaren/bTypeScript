/**
 * Represent a doubly-linked list in which you can add and remove items.
 */
export default class LinkedList<T> {
    private _first;
    private _last;
    length: number;
    /**
     * @param items T[] Items to start filling the stack with.
     */
    constructor(items?: T[]);
    private _getNode;
    /**
     * Get an item at a certain position.
     */
    get(at: number): T;
    /**
     * Insert an item at the end of the list.
     */
    insert(item: T): number;
    /**
     * Insert an item at a certain position in the list.
     */
    insertAt(at: number, item: T): number;
    /**
     * Remove an item from a certain position in the list.
     */
    removeAt(at: number): number;
    /**
     * Clears the list.
     */
    clear(): void;
}

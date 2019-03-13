/**
 * Represent a doubly-linked list in which you can add and remove items.
 */
export class LinkedList<T> {

    private _first: LinkedListNode<T>;
    private _last: LinkedListNode<T>;

    length: number = 0;

    /**
     * @param items T[] Items to start filling the stack with.
     */
    constructor(items?: T[]) {
        if (items) items.forEach(x => { this.insert(x); });
    }

    private _getNode(at: number): LinkedListNode<T> {
        if (this.length === 0) return undefined;
        else if (at == 0) return this._first;
        else if (at > this.length) return this._last;

        let i, node: LinkedListNode<T>;

        if (at < this.length / 2) {
            // if fetching from first half of list, start from the beginning
            node = this._first;

            for (i = 0; i < at; i++) {
                node = node.next;
            }
        } else {
            // if fetching from last half of list, start from the end
            node = this._last;
            for (i = this.length - 1; i > at; i--) {
                node = node.prev;
            }
        }

        return node;
    }

    /**
     * Get an item at a certain position.
     */
    get(at: number): T {
        let node = this._getNode(at);
        if (node) return node.val;
    }

    /**
     * Insert an item at the end of the list.
     */
    insert(item: T): number {
        let node = new LinkedListNode(item);

        if (!this._first) {
            this._first = this._last = node;
        } else {
            node.prev = this._last;
            this._last.next = node;
            this._last = node;
        }

        return ++this.length;
    }

    /**
     * Insert an item at a certain position in the list.
     */
    insertAt(at: number, item: T): number {
        if (at >= this.length) return this.insert(item);

        let node = new LinkedListNode(item),
            next = this._getNode(at),
            prev = next.prev;

        if (prev) prev.next = node;
        next.prev = node;
        node.prev = prev;
        node.next = next;

        if (at === 0) this._first = node;

        return ++this.length;
    }

    /**
     * Remove an item from a certain position in the list.
     */
    removeAt(at: number): number {
        if (this.length === 0) return 0;

        let node = this._getNode(at);

        if (this.length === 1) {
            // only 1 item left to remove.
            this._first = this._last = undefined;

        } else if (node === this._first) {
            // removing the first item.
            node.next.prev = undefined;
            this._first = node.next;

        } else if (node === this._last) {
            // removing the last item.
            node.prev.next = undefined;
            this._last = node.prev;

        } else {
            // removing item in the middle of the list
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }

        return --this.length;
    }

    /**
     * Clears the list.
     */
    clear() {
        this._first = this._last = undefined;
        this.length = 0;
    }

    //protected removeAndGetAt(at: number): LinkedListNode {
    //    let item = this._getNode(at);
    //    this.removeAt(at);
    //    return item;
    //}
}

class LinkedListNode<T> {
    prev: LinkedListNode<T>;
    next: LinkedListNode<T>;
    val: T;

    constructor(val: T) {
        this.val = val;
    }
}

import * as Util from "../util";

export default class LinkedList<T> {

    private _first: LinkedListNode;
    private _last: LinkedListNode;

    length: number = 0;

    private _getNode(at: number): LinkedListNode {
        if (this.length === 0) return undefined;
        else if (at == 0) return this._first;
        else if (at > this.length) return this._last;

        let i, item: LinkedListNode;

        if (at < this.length / 2) {
            // if fetching from first half of list, start from the beginning
            item = this._first;

            for (i = 0; i < at; i++) {
                item = item.next;
            }
        } else {
            // if fetching from last half of list, start from the end
            item = this._last;
            for (i = this.length - 1; i > at; i--) {
                item = item.prev;
            }
        }

        return item;
    }

    get(at: number): T {
        let node = this._getNode(at);
        if (node) return node.val;
    }

    insert(val: any): number {
        let item = new LinkedListNode(val);

        if (!this._first) {
            this._first = this._last = item;
        } else {
            item.prev = this._last;
            this._last.next = item;
            this._last = item;
        }

        return ++this.length;
    }

    insertAt(at: number, val: any): number {
        if (at >= this.length) return this.insert(val);

        let item = new LinkedListNode(val),
            next = this._getNode(at),
            prev = next.prev;

        if (prev) prev.next = item;
        next.prev = item;
        item.prev = prev;
        item.next = next;

        if (at === 0) this._first = item;

        return ++this.length;
    }

    removeAt(at: number): number {
        if (this.length === 0) return 0;

        let item = this._getNode(at);

        if (this.length === 1) {
            // only 1 item left to remove.
            this._first = this._last = undefined;

        } else if (item === this._first) {
            // removing the first item.
            item.next.prev = undefined;
            this._first = item.next;

        } else if (item === this._last) {
            // removing the last item.
            item.next = undefined;
            item.prev.next = item;

        } else {
            // removing item in the middle of the list
            item.prev.next = item.next;
            item.next.prev = item.prev;
        }

        return --this.length;
    }

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

class LinkedListNode {
    prev: LinkedListNode;
    next: LinkedListNode;
    val: any;

    constructor(val: any) {
        this.val = val;
    }
}

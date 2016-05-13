import LinkedList from "./linkedList";

export default class Stack<T> {

    private _list: LinkedList<T>;

    length: number;

    constructor() {
        this._list = new LinkedList<T>();
    }

    push(val: T): number {
        this._list.insertAt(0, val);
        return this.length = this._list.length;
    }

    pop(): T {
        let item = this.peek();
        this.length = this._list.removeAt(0);
        return item;
    }

    peek(): T {
        return this._list.get(0);
    }
}

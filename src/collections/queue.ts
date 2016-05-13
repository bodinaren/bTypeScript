import LinkedList from "./linkedList";

export default class Queue<T> {
    private _list: LinkedList<T>;

    length: number = 0;

    constructor() {
        this._list = new LinkedList<T>();
    }

    enqueue(val: T): number {
        this._list.insert(val);
        return this.length = this._list.length;
    }

    dequeue(): T {
        let item = this._list.get(0);
        this.length = this._list.removeAt(0);
        return item;
    }
}

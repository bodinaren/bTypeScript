export default class Queue<T> {
    private _list;
    length: number;
    constructor();
    enqueue(val: T): number;
    dequeue(): T;
}

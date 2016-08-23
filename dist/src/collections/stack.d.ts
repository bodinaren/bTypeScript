export default class Stack<T> {
    private _list;
    length: number;
    constructor();
    push(val: T): number;
    pop(): T;
    peek(): T;
    clear(): void;
}

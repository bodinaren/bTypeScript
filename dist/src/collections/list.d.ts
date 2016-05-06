import * as Util from "../util";
export default class List<T> {
    _source: T[];
    length: number;
    constructor(source?: T[]);
    toArray(): T[];
    add(item: T): List<T>;
    addRange(collection: T[] | List<T>): List<T>;
    asReadOnly(): List<T>;
    forEach(callback: Util.ILoopFunction<T>): void;
    indexOf(item: T, index?: number, count?: number): number;
    lastIndexOf(item: T, index?: number, count?: number): number;
    insert(index: number, item: T): List<T>;
    insertRange(index: number, collection: T[] | List<T>): List<T>;
    get(index: number): T;
    set(index: number, item: T): void;
    remove(item: T): List<T>;
    removeAll(predicate?: Util.IPredicate<T>): List<T>;
    removeAt(index: number): List<T>;
    removeRange(index: number, count: number): List<T>;
    clear(): List<T>;
    count(predicate?: Util.IPredicate<T>): number;
    reverse(index?: number, count?: number): List<T>;
    static range(start: number, count: number): number[];
}

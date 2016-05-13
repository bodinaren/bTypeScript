import Iterator from "./iterator";
import * as Util from "../util";
export default class OrderIterator extends Iterator {
    private _orders;
    private _descending;
    private _isOrdered;
    constructor(source: any[] | Iterator, keySelector: (x) => any, comparer?: Util.IComparer<any>, descending?: boolean);
    next(): any;
    thenBy(keySelector: (x) => any, comparer?: Util.IComparer<any>, descending?: boolean): void;
}

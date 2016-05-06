import Iterator from "./iterator";
export default class FilterIterator extends Iterator {
    private _callback;
    constructor(source: any[] | Iterator, callback: (predicate) => any);
    next(): any;
}

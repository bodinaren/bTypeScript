import Iterator from "./iterator";
export default class LinqMapIterator extends Iterator {
    private _callback;
    constructor(source: any[] | Iterator, callback: (item: any, idx: number) => any);
    next(): any;
}

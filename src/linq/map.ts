import * as Util from "../util";
import Iterator from "./iterator";

export default class LinqMapIterator extends Iterator {
    private _callback: (item: any, idx: number) => any;

    constructor(source: any[] | Iterator, callback: (item: any, idx: number) => any) {
        super(source);
        this._callback = callback;
    }

    next(): any {
        let item = this._next();
        return (!Util.isUndefined(item))
            ? this._callback(item, this._idx)
            : undefined;
    }
}

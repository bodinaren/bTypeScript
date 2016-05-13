import Iterator from "./iterator";
import * as Util from "../util";

export default class FilterIterator extends Iterator {
    private _callback: (predicate) => any;

    constructor(source: any[] | Iterator, callback: (predicate) => any) {
        super(source);
        this._callback = callback;
    }

    next(): any {
        let item;

        do {
            item = this._next();
            if (Util.isUndefined(item)) break;

            if (true === this._callback(item)) break;
        } while (item);

        return item;
    }
}

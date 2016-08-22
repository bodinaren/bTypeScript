import Iterator from "./iterator";
import * as Util from "../util";

export default class FilterIterator extends Iterator {
    private _callback: Util.IPredicate<any>;

    constructor(source: any[] | Iterator, callback: Util.IPredicate<any> = Util.defaultPredicate) {
        super(source);
        this._callback = callback;
    }

    next(): any {
        let item;

        do {
            item = this._next();
            if (Util.isUndefined(item)) break;

            if (this._callback(item, this._idx)) break;
        } while (!Util.isUndefined(item));

        return item;
    }
}

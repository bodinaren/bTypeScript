import Iterator from "./iterator";
import * as Util from "../util";

export default class TakeWhileIterator extends Iterator {
    private _predicate: Util.IPredicate<any>;

    constructor(source: any[] | Iterator, predicate: Util.IPredicate<any> = Util.defaultPredicate) {
        super(source);
        this._predicate = predicate;
    }

    next(): any {
        let n = this._next();
        if (!!this._predicate(n, this._idx)) {
            return n;
        }
    }
}

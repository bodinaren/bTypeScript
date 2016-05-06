import Iterator from "./iterator";
import * as Util from "../util";

export default class SkipWhileIterator extends Iterator {
    private _predicate: Util.IPredicate<any>;
    private _done: boolean = false;
    
    constructor(source: any[] | Iterator, _predicate: Util.IPredicate<any> = Util.defaultPredicate) {
        super(source);
        this._predicate = _predicate;
    }

    next(): any {
        let item;
        do {
            item = this._next();
        } while (!this._done && this._predicate(item)) 

        this._done = true;
        return item;
    }
}
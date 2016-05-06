import Iterator from "./iterator";
import * as Util from "../util";
export default class SkipWhileIterator extends Iterator {
    private _predicate;
    private _done;
    constructor(source: any[] | Iterator, _predicate?: Util.IPredicate<any>);
    next(): any;
}

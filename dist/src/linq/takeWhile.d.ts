import Iterator from "./iterator";
import * as Util from "../util";
export default class TakeWhileIterator extends Iterator {
    private _predicate;
    constructor(source: any[] | Iterator, _predicate?: Util.IPredicate<any>);
    next(): any;
}

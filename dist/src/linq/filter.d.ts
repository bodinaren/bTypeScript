import Iterator from "./iterator";
import * as Util from "../util";
export default class FilterIterator extends Iterator {
    private _callback;
    constructor(source: any[] | Iterator, callback?: Util.IPredicate<any>);
    next(): any;
}

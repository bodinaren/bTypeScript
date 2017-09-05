import { BaseIterator, IteratorResult } from "./iterator";
import * as Util from "../../util";
export declare class GroupJoinIterator<TOuter, TInner, TKey, TResult> extends BaseIterator<TOuter> {
    private inner;
    private outerKeySelector;
    private innerKeySelector;
    private resultSelector;
    constructor(outer: TOuter[] | BaseIterator<TOuter>, inner: TInner[] | BaseIterator<TInner>, outerKeySelector: Util.ISelector<TOuter, TKey>, innerKeySelector: Util.ISelector<TInner, TKey>, resultSelector: (outer: TOuter, inner: TInner[]) => TResult);
    next(): IteratorResult<TResult>;
}

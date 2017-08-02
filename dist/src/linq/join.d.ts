import BaseIterator, { IteratorResult } from "./iterator";
import * as Util from "../util";
export default class JoinIterator<TOuter, TInner, TKey, TResult> extends BaseIterator<TOuter> {
    private inner;
    private outerKeySelector;
    private innerKeySelector;
    private resultSelector;
    private _outerItem;
    private _currentInnerSelection;
    private _counter;
    constructor(outer: TOuter[] | BaseIterator<TOuter>, inner: TInner[] | BaseIterator<TInner>, outerKeySelector: Util.ISelector<TOuter, TKey>, innerKeySelector: Util.ISelector<TInner, TKey>, resultSelector: (outer: TOuter, inner: TInner) => TResult);
    next(): IteratorResult<TResult>;
}

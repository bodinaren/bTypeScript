import {BaseIterator, IteratorResult} from "./iterator";
import {FilterIterator} from "./filter";
import * as Util from "../../util";

export class GroupJoinIterator<TOuter, TInner, TKey, TResult> extends BaseIterator<TOuter> {

    constructor(
        outer: TOuter[] | BaseIterator<TOuter>,
        private inner: TInner[] | BaseIterator<TInner>,
        private outerKeySelector: Util.ISelector<TOuter, TKey>,
        private innerKeySelector: Util.ISelector<TInner, TKey>,
        private resultSelector: (outer: TOuter, inner: TInner[]) => TResult
    ) {
        super(outer);
    }

    next(): IteratorResult<TResult> {
        let outerItem: IteratorResult<TOuter>;
        let innerItem: IteratorResult<TInner>;

        do {
            outerItem = super.next();
            if (outerItem.done) return { value: undefined, done: true };
        } while (Util.isUndefined(outerItem.value));

        let outerKey = this.outerKeySelector(outerItem.value);

        let innerSelection = new FilterIterator<TInner>(this.inner, (x, idx) => outerKey === this.innerKeySelector(x));
        let innerArray = [];

        while (!(innerItem = innerSelection.next()).done) {
            innerArray.push(innerItem.value);
        }

        return {
            value: this.resultSelector(outerItem.value, innerArray),
            done: outerItem.done
        };
    }
}

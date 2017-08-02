import BaseIterator, {IteratorResult} from "./iterator";
import FilterIterator from "./filter";
import * as Util from "../util";

export default class JoinIterator<TOuter, TInner, TKey, TResult> extends BaseIterator<TOuter> {
    private _outerItem: IteratorResult<TOuter>;
    private _currentInnerSelection: FilterIterator<TInner>;
    private _counter = 0;

    constructor(
        outer: TOuter[] | BaseIterator<TOuter>,
        private inner: TInner[] | BaseIterator<TInner>,
        private outerKeySelector: Util.ISelector<TOuter, TKey>,
        private innerKeySelector: Util.ISelector<TInner, TKey>,
        private resultSelector: (outer: TOuter, inner: TInner) => TResult
    ) {
        super(outer);
    }

    next(): IteratorResult<TResult> {
        let innerItem: IteratorResult<TInner>;

        if (this._currentInnerSelection) {
            // We're doing the second loop of the same key.
            innerItem = this._currentInnerSelection.next();

            // We know we have received at least one item from this key before, so not receiving one now is not wrong.
            // It just means it was only a single inner item with this key, so we let it continue if below condition is not met.
            if (!Util.isUndefined(innerItem.value)) {
                this._counter++;
                return {
                    value: this.resultSelector(this._outerItem.value, innerItem.value),
                    done: false
                };
            }
        }

        do {
            this._outerItem = super.next();
            if (this._outerItem.done) return { value: undefined, done: true };

            if (!Util.isUndefined(this._outerItem.value)) {
                let outerKey = this.outerKeySelector(this._outerItem.value);

                this._currentInnerSelection = new FilterIterator(this.inner, x => outerKey === this.innerKeySelector(x));

                innerItem = this._currentInnerSelection.next();
            }

        } while (Util.isUndefined(innerItem.value));

        this._counter++;

        return {
            value: this.resultSelector(this._outerItem.value, innerItem.value),
            done: this._outerItem.done
        };
    }
}

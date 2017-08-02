import BaseIterator, {IteratorResult} from "./iterator";
import * as Util from "../util";

export default class OrderIterator<TSource, TKey> extends BaseIterator<TSource> {
    private _orders: LinqOrder<TSource, TKey>[];
    private _isOrdered: boolean = false;

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        keySelector: Util.ISelector<TSource, TKey>,
        comparer: Util.IComparer<TKey> = Util.defaultComparer,
        private descending: boolean = false
    ) {
        super(source);
        this._orders = [new LinqOrder(keySelector, comparer, descending)];
        this._buffers = true;
    }

    next(): IteratorResult<TSource> {
        if (!this._isOrdered) {
            let arr = [], item;

            // can't someone else do this? e.g. FilterIterator?
            do {
                item = super.next();
                if (!Util.isUndefined(item.value)) arr.push(item.value);
            } while (!item.done);

            this._source = arr.sort((a, b) => {
                let i = 0, rs;
                do {
                    rs = this._orders[i++].compare(a, b);
                } while (rs === 0 && i < this._orders.length);
                return rs;
            });

            this._isOrdered = true;
            super.reset();
        }
        return super.next();
    }

    thenBy(keySelector: (x) => any, comparer: Util.IComparer<TKey> = Util.defaultComparer, descending: boolean = false) {
        this._orders.push(new LinqOrder(keySelector, comparer, descending));
    }
}

class LinqOrder<TSource, TKey> {
    private _keySelector: Util.ISelector<TSource, TKey>;
    private _comparer: Util.IComparer<TKey>;
    private _descending: boolean;

    constructor(keySelector: Util.ISelector<TSource, TKey>, comparer: Util.IComparer<TKey> = Util.defaultComparer, descending: boolean = false) {
        this._keySelector = keySelector;
        this._comparer = comparer;
        this._descending = descending;
    }

    compare(a, b): number {
        return (this._descending ? -1 : 1) * this._comparer(this._keySelector(a), this._keySelector(b));
    }
}

import {BaseIterator, IteratorResult} from "./iterator";
import * as Util from "../../util";
import {Linq} from "../linq";
import {makeValuePredicate} from "../makeValuePredicate";

export class OrderByIterator<TSource, TKey> extends BaseIterator<TSource> {
    private _orders: LinqOrder<TSource, TKey>[];
    private _isOrdered: boolean = false;

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        keySelector: Util.ISelector<TSource, TKey> = Util.defaultSelector,
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

    thenBy(
        keySelector: Util.ISelector<TSource, TKey> = Util.defaultSelector,
        comparer: Util.IComparer<TKey> = Util.defaultComparer,
        descending: boolean = false
    ) {
        this._orders.push(new LinqOrder<TSource, TKey>(keySelector, comparer, descending));
    }
}


function orderBy<TSource, TKey>(source: TSource[] | BaseIterator<TSource>, keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): OrderByIterator<TSource, TKey> {
    let selectorFn = (keySelector) ? makeValuePredicate(keySelector) : Util.defaultSelector;
    return new OrderByIterator<TSource, TKey>(source, selectorFn, comparer, false);
}

function orderByDesc<TSource, TKey>(source: TSource[] | BaseIterator<TSource>, keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): OrderByIterator<TSource, TKey> {
    let selectorFn = (keySelector) ? makeValuePredicate(keySelector) : Util.defaultSelector;
    return new OrderByIterator<TSource, TKey>(source, selectorFn, comparer, true);
}


export function orderByProto<TKey>(this: Linq<any>, keySelector: Util.ISelector<any, TKey> | string, comparer?: Util.IComparer<TKey>): OrderedLinq<any, TKey>;
/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
export function orderByProto<TSource, TKey>(this: Linq<TSource>, keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): OrderedLinq<TSource, TKey> {
    // TODO: Haven't gotten the intellisense to show Linq<TSource> as the result of this function, it shows Linq<any>.

    return new OrderedLinq<TSource, TKey>(orderBy(this._source, keySelector, comparer));
}

/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
export function orderByStatic<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): TSource[] {
    return new Linq<TSource>(source).orderBy<TKey>(keySelector, comparer).toArray<TSource>();
}



export function orderByDescProto<TKey>(this: Linq<any>, keySelector: Util.ISelector<any, TKey> | string, comparer?: Util.IComparer<TKey>): OrderedLinq<any, TKey>;
/**
 * Sorts the elements of a sequence in descending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
export function orderByDescProto<TSource, TKey>(this: Linq<TSource>, keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): OrderedLinq<TSource, TKey> {
    // TODO: Haven't gotten the intellisense to show Linq<TSource> as the result of this function, it shows Linq<any>.

    return new OrderedLinq<TSource, TKey>(orderByDesc(this._source, keySelector, comparer));
}

/**
 * Sorts the elements of a sequence in descending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
export function orderByDescStatic<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): TSource[] {
    return new Linq<TSource>(source).orderByDesc<TKey>(keySelector, comparer).toArray<TSource>();
}





class LinqOrder<TSource, TKey> {
    private _keySelector: Util.ISelector<TSource, TKey>;
    private _comparer: Util.IComparer<TKey>;
    private _descending: boolean;

    constructor(
        keySelector: Util.ISelector<TSource, TKey> = Util.defaultSelector,
        comparer: Util.IComparer<TKey> = Util.defaultComparer,
        descending: boolean = false
    ) {
        this._keySelector = keySelector;
        this._comparer = comparer;
        this._descending = descending;
    }

    compare(a, b): number {
        return (this._descending ? -1 : 1) * this._comparer(this._keySelector(a), this._keySelector(b));
    }
}

export class OrderedLinq<TSource, TKey> extends Linq<TSource> {
    constructor(source: TSource[] | BaseIterator<TSource>) {
        super(source);
    }

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenBy(keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): OrderedLinq<TSource, TKey> {
        let selectorFn = (keySelector) ? makeValuePredicate(keySelector) : Util.defaultSelector;
        let orderIterator: OrderByIterator<TSource, TKey> = this._source.getIteratorFromPipeline(OrderByIterator);
        orderIterator.thenBy(selectorFn, comparer, false);
        return this;
    }

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenByDesc(keySelector: Util.ISelector<TSource, TKey> | string, comparer: Util.IComparer<TKey> = Util.defaultComparer): OrderedLinq<TSource, TKey> {
        let selectorFn = (keySelector) ? makeValuePredicate(keySelector) : Util.defaultSelector;
        let orderIterator: OrderByIterator<TSource, TKey> = this._source.getIteratorFromPipeline(OrderByIterator);
        orderIterator.thenBy(selectorFn, comparer, true);
        return this;
    }
}

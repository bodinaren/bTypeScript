import Linq from "./linq";
import Iterator from "./iterator";
import OrderIterator from "./order";
import * as Util from "../util";

export default class LinqOrdered extends Linq {
    constructor(source: any[] | Iterator) {
        super(source);
    }

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenBy(keySelector: Util.ISelector<any, any> | string, comparer: Util.IComparer<any> = Util.defaultComparer): LinqOrdered {
        let selectorFn = this._makeValuePredicate(keySelector);
        let orderIterator: OrderIterator = this._source.getIteratorFromPipeline(OrderIterator);
        orderIterator.thenBy(selectorFn, comparer, false);
        return this;
    }

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    thenByDesc(keySelector: Util.ISelector<any, any> | string, comparer: Util.IComparer<any> = Util.defaultComparer): LinqOrdered {
        let selectorFn = this._makeValuePredicate(keySelector);
        let orderIterator: OrderIterator = this._source.getIteratorFromPipeline(OrderIterator);
        orderIterator.thenBy(selectorFn, comparer, true);
        return this;
    }
}
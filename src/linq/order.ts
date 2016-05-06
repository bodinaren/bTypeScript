import Iterator from "./iterator";
import * as Util from "../util";

export default class OrderIterator extends Iterator {
    private _orders: LinqOrder[];
    private _descending: boolean;
    
    constructor(source: any[] | Iterator, keySelector: (x) => any, comparer: Util.IComparer<any> = Util.defaultComparer, descending: boolean = false) {
        super(source);
        this._orders = [new LinqOrder(keySelector, comparer, descending)];
        this._descending = descending;
        this._buffers = true;
    }
    
    next(): any {
        if (this._source instanceof Iterator) {
            let arr = [], item;

            do {
                item = this._next();
                if (item) arr.push(item);
            } while (item);
            
            this._source = arr.sort((a, b) => {
                let i = 0, rs;
                do {
                    rs = this._orders[i++].compare(a, b);
                } while (rs === 0);
                return rs;
            });
        }
        return this._next();
    }

    thenBy(keySelector: (x) => any, comparer: Util.IComparer<any> = Util.defaultComparer, descending: boolean = false) {
        this._orders.push(new LinqOrder(keySelector, comparer, descending));
    }
}

class LinqOrder {
    private _keySelector: Util.ISelector<any, any>;
    private _comparer: Util.IComparer<any>;
    private _descending: boolean;

    constructor(keySelector: Util.ISelector<any, any>, comparer: Util.IComparer<any>, descending: boolean = false) {
        this._keySelector = keySelector;
        this._comparer = comparer;
        this._descending = descending;
    }

    compare(a, b): number {
        return (this._descending ? -1 : 1) * this._comparer(this._keySelector(a), this._keySelector(b));
    }
}
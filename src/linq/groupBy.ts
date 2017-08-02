import BaseIterator, {IteratorResult} from "./iterator";
import FilterIterator from "./filter";
import * as Util from "../util";

export default class GroupByIterator<TSource, TKey> extends BaseIterator<TSource> {

    private _previousKeys = [];
    private _isPipelineExecuted = false;

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private keySelector: Util.ISelector<TSource, TKey>
    ) {
        super(source);
    }

    next(): IteratorResult<IGrouping<TKey, TSource>> {
        // TODO: Currently this will use FilterIterator on the whole source once per key. Can we improve this?

        /* TODO: Because we send in this._source into the FilterIterator, if this._source is an iterator, we finish it,
         * making it not look for the next key on the second call to this function.
         * We probably need to create a lookup table of some sort.
         */

        if (!this._isPipelineExecuted) {
            this._source = this.toArray();
            super.reset();
            this._isPipelineExecuted = true;
        }

        let item: IteratorResult<any>,
            key: any;

        do {
            item = super.next();

            if (item.done) return item;
            if (Util.isUndefined(item.value)) continue;

            key = this.keySelector(item.value);

        } while (this._previousKeys.indexOf(key) > -1 || Util.isUndefined(item.value));

        this._previousKeys.push(key);

        let filter = new FilterIterator<TSource>(this._source, (x, idx) => this.keySelector(x) === key);
        let groupItem, values = [];
        while (!Util.isUndefined(groupItem = filter.next().value)) {
            values.push(groupItem);
        }

        return {
            value: {
                key: key,
                values: values
            },
            done: item.done
        };
    }

    private toArray(): any[] {
        let n: IteratorResult<any>,
            result = [];

        while (!(n = super.next()).done)
            result.push(n.value);

        return result;
    }
}

export interface IGrouping<TKey, TValue> {
    key: TKey;
    values: TValue[];
}

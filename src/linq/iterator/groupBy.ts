import {BaseIterator, IteratorResult} from "./iterator";
import {FilterIterator} from "./filter";
import * as Util from "../../util";
import {Linq} from "../linq";
import {makeValuePredicate} from "../makeValuePredicate";

export class GroupByIterator<TSource, TKey> extends BaseIterator<TSource> {

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


function groupBy<TSource, TKey>(source: TSource[] | BaseIterator<TSource>, keySelector: Util.ISelector<TSource, TKey> | string) {
    let pred = makeValuePredicate(keySelector);

    return new GroupByIterator<TSource, TKey>(source, pred);
}

export function groupByProto<TKey>(this: Linq<any>, keySelector: Util.ISelector<any, TKey> | string): Linq<IGrouping<TKey, any>>;
/**
 * Groups the elements of a sequence according to a specified key selector function.
 * @param keySelector A function to extract the key for each element.
 */
export function groupByProto<TSource, TKey>(this: Linq<TSource>, keySelector: Util.ISelector<TSource, TKey> | string): Linq<IGrouping<TKey, TSource>> {
    let pred = makeValuePredicate(keySelector);

    return this.lift(groupBy, pred);
}
/**
 * Groups the elements of a sequence according to a specified key selector function.
 * @param keySelector A function to extract the key for each element.
 */
export function groupByStatic<TSource, TKey>(source: TSource[], keySelector: Util.ISelector<TSource, TKey> | string): IGrouping<TKey, TSource>[] {

    let i,
        arr: IGrouping<TKey, TSource>[] = [],
        pred = makeValuePredicate(keySelector),
        group: IGrouping<TKey, TSource>,
        groupValue: any;

    for (i = 0; i < source.length; i++) {

        groupValue = pred(source[i]);
        group = new Linq(arr).first((x: IGrouping<TKey, TSource>) => x.key == groupValue);

        if (!group) {
            group = {
                key: groupValue,
                values: []
            };
            arr.push(group);
        }

        group.values.push(source[i]);
    }

    return arr;
}


export interface IGrouping<TKey, TValue> {
    key: TKey;
    values: TValue[];
}

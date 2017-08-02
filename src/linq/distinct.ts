import * as Util from "../util";
import BaseIterator, {IteratorResult} from "./iterator";

export default class DistinctIterator<TSource> extends BaseIterator<TSource> {

    private _previousItems: TSource[] = [];

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private comparer: Util.IEqualityComparer<any> = Util.defaultEqualityComparer
    ) {
        super(source);
    }

    next(): IteratorResult<TSource> {
        let rs: IteratorResult<TSource>;

        while (!(rs = super.next()).done) {
            if (!this._previousItems.some(x => this.comparer(x, rs.value))) {
                this._previousItems.push(rs.value);
                return rs;
            }
        }

        return {
            value: undefined,
            done: true
        };
    }
}

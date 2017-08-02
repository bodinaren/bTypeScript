import * as Util from "../util";
import BaseIterator, {IteratorResult} from "./iterator";

export default class IntersectIterator<TSource> extends BaseIterator<TSource> {

    private other: BaseIterator<TSource>;
    private otherItems: any[];

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        other: TSource[] | BaseIterator<TSource>,
        private comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer
    ) {
        super(source);

        if (other instanceof BaseIterator) {
            this.other = other;
        } else {
            this.other = new BaseIterator(other);
        }
    }

    next(): IteratorResult<TSource> {
        let rs: IteratorResult<TSource>;

        if (!this.otherItems) {
            this.otherItems = [];

            while (!(rs = this.other.next()).done) {
                this.otherItems.push(rs.value);
            }
        }

        while (!(rs = super.next()).done) {
            if (this.otherItems.some(x => this.comparer(rs.value, x))) {
                return rs;
            }
        }

        return {
            value: undefined,
            done: true
        };
    }
}

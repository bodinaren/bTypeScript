import * as Util from "../../util";
import {BaseIterator, IteratorResult} from "./iterator";
import {Linq} from "../linq";

export class IntersectIterator<TSource> extends BaseIterator<TSource> {

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



function intersect<TSource>(source: TSource[] | BaseIterator<TSource>, other: TSource[], comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): IntersectIterator<TSource> {
    return new IntersectIterator<TSource>(source, other, comparer);
}


/**
 * Get a list of items that only exists in one of the datasets.
 * @param other The other dataset.
 */
export function intersectProto<TSource>(this: Linq<TSource>, other: TSource[] | Linq<TSource>, comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): Linq<TSource> {
    return this.lift(intersect, other, comparer);
}

    /**
     * Get a list of items that exists in all datasets.
     * @param a The first dataset.
     * @param b The second dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
export function intersectStatic<TSource>(source: TSource[] | Linq<TSource>, other: TSource[] | Linq<TSource>, comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): TSource[] {

    let a: TSource[] = (source instanceof Linq) ? source.toArray<TSource>() : <TSource[]>source,
        b: TSource[] = (other instanceof Linq) ? other.toArray<TSource>() : <TSource[]>other;

    let result = [];

    a.forEach(x => {
        if (b.some(y => comparer(x, y))) result.push(x);
    });

    return result;

    // let lists: Array<any[]> = [], result = [];

    // let list = (a instanceof Linq) ? a.toArray() : a;
    // lists.push((b instanceof Linq) ? b.toArray() : b);
    // more.forEach((dataset) => {
    //     lists.push((dataset instanceof Linq) ? dataset.toArray() : dataset);
    // });

    // list.forEach(item => {
    //     let exists = lists.every(other => {
    //         if (!other.some(x => x === item)) return false;
    //         return true;
    //     });
    //     if (exists) result.push(item);
    // });

    // return result;
}

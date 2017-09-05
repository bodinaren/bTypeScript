import * as Util from "../../util";
import {BaseIterator, IteratorResult} from "./iterator";
import {Linq} from "../linq";

export class ExceptIterator<TSource> extends BaseIterator<TSource> {

    private other: BaseIterator<TSource>;
    private otherItems: TSource[];

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        other: TSource[] | BaseIterator<TSource>,
        private comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer
    ) {
        super(source);

        if (other instanceof BaseIterator) {
            this.other = other;
        } else {
            this.other = new BaseIterator<TSource>(other);
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
            if (!this.otherItems.some(x => this.comparer(rs.value, x))) {
                return rs;
            }
        }

        return {
            value: undefined,
            done: true
        };
    }
}


function except<TSource>(source: TSource[] | BaseIterator<TSource>, other: TSource[], comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): ExceptIterator<TSource> {
    return new ExceptIterator<TSource>(source, other, comparer);
}


/**
 * Get a list of items that only exists in one of the datasets.
 * @param other The other dataset.
 */
export function exceptProto<TSource>(this: Linq<TSource>, other: TSource[], comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): Linq<TSource> {
    return this.lift(except, other, comparer);
}

/**
 * Get a list of items that only exists in one of the datasets.
 * @param a The first dataset.
 * @param b The second dataset.
 */
export function exceptStatic<TSource>(source: TSource[] | Linq<TSource>, other: TSource[], comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): TSource[] {

    let a: TSource[] = (source instanceof Linq) ? source.toArray<TSource>() : source,
        b: TSource[] = (other instanceof Linq) ? other.toArray<TSource>() : other;

    let result = [];

    a.forEach(x => {
        if (!b.some(y => comparer(x, y))) result.push(x);
    });

    return result;

    // lists.push((a instanceof Linq) ? a.toArray() : a);
    // lists.push((b instanceof Linq) ? b.toArray() : b);

    // let lists: Array<any[]> = [], result = [];

    // lists.push((a instanceof Linq) ? a.toArray() : a);
    // lists.push((b instanceof Linq) ? b.toArray() : b);
    // more.forEach(dataset => {
    //     lists.push((dataset instanceof Linq) ? dataset.toArray() : dataset);
    // });

    // lists.forEach(list => {
    //     list.forEach(item => {
    //         let exists = lists.some(other => {
    //             if (list === other) return;
    //             if (other.some(x =>  x === item)) return true;
    //         });
    //         if (!exists) result.push(item);
    //     });
    // });

    // return result;
}

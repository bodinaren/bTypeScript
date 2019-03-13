import * as Util from "../../util";
import {BaseIterator, IteratorResult} from "./iterator";
import {Linq} from "../linq";

export class DistinctIterator<TSource> extends BaseIterator<TSource> {

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


function distinct<TSource>(source: TSource[] | BaseIterator<TSource>, comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): DistinctIterator<TSource> {
    return new DistinctIterator<TSource>(source, comparer);
}


/**
 * Get a list of unique items that exists one or more times in the dataset.
 */
export function distinctProto<TSource>(this: Linq<TSource>, comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): Linq<TSource> {
    return this.lift(distinct, comparer);
}

/**
 * Get a list of unique items that exists one or more times in any of the datasets.
 * @param source The datasets to be get distinct items from.
 */
export function distinctStatic<TSource>(source: TSource[] | Linq<TSource>, comparer: Util.IEqualityComparer<TSource> = Util.defaultEqualityComparer): TSource[] {

    let a: TSource[] = (source instanceof Linq) ? source.toArray<TSource>() : source;

    let result = [];

    a.forEach(x => {
        if (!result.some(y => comparer(x, y))) result.push(x);
        // if (result.indexOf(x) === -1)
    });

    return result;

    // let lists: Array<Linq> = [], result = [];

    // datasets.forEach(dataset => {
    //     lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast<any[]>(dataset)));
    // });

    // lists.forEach(list => {
    //     list.toArray().forEach(item => {
    //         if (result.indexOf(item) == -1)
    //             result.push(item);
    //     });
    // });

    // return result;
}

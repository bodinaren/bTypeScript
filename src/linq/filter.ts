import BaseIterator, {IteratorResult} from "./iterator";
import * as Util from "../util";

export default class FilterIterator<TSource> extends BaseIterator<TSource> {

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private callback: Util.IPredicate<TSource> = Util.defaultPredicate
    ) {
        super(source);
    }

    next(): IteratorResult<TSource> {
        let item: IteratorResult<TSource>;

        while (!(item = super.next()).done) {
            if (this.callback(item.value, this._idx)) break;
        }

        return item;
    }
}

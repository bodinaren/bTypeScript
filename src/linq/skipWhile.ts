import BaseIterator, {IteratorResult} from "./iterator";
import * as Util from "../util";

export default class SkipWhileIterator<TSource> extends BaseIterator<TSource> {
    private done: boolean = false;

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private predicate: Util.IPredicate<TSource> = Util.defaultPredicate
    ) {
        super(source);
    }

    next(): IteratorResult<TSource> {
        let item: IteratorResult<TSource>;
        do {
            item = super.next();
        } while (!this.done && !Util.isUndefined(item.value) && this.predicate(item.value, this._idx));

        this.done = true;
        return item;
    }
}

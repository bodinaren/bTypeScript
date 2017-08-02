import BaseIterator, {IteratorResult} from "./iterator";
import * as Util from "../util";

export default class TakeWhileIterator<TSource> extends BaseIterator<TSource> {

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private predicate: Util.IPredicate<TSource> = Util.defaultPredicate
    ) {
        super(source);
    }

    next(): IteratorResult<TSource> {
        let n = super.next();

        if (!n.done && !!this.predicate(n.value, this._idx)) {
            return {
                value: n.value,
                done: false
            };
        }

        return {
            value: undefined,
            done: true
        };
    }
}

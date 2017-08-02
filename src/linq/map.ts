import * as Util from "../util";
import BaseIterator, {IteratorResult} from "./iterator";

export default class MapIterator<TSource, TResult> extends BaseIterator<TSource> {

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private callback: (item: TSource, idx: number) => TResult
    ) {
        super(source);
    }

    next(): IteratorResult<TResult> {
        let item = super.next();
        return (!Util.isUndefined(item.value))
            ? { value: this.callback(item.value, this._idx), done: false }
            : { value: undefined, done: true };
    }
}

import * as Util from "../util";
import BaseIterator, {IteratorResult} from "./iterator";

export default class ZipIterator<TFirst, TSecond, TResult> extends BaseIterator<TFirst> {

    constructor(
        source: TFirst[] | BaseIterator<TFirst>,
        private other: TSecond[],
        private callback: (a: TFirst, b: TSecond, idx: number) => TResult
    ) {
        super(source);
    }

    next(): IteratorResult<TResult> {
        let item = super.next();
        if (!item.done) {
            let o = this.other[this._idx];
            if (!Util.isUndefined(o)) {
                return {
                    value: this.callback(item.value, o, this._idx),
                    done: false
                };
            }
        }

        return {
            value: undefined,
            done: true
        };
    }
}

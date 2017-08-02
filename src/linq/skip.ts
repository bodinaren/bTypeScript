import BaseIterator, {IteratorResult} from "./iterator";

export default class SkipIterator<TSource> extends BaseIterator<TSource> {

    private counter = 0;

    constructor(
        source: TSource[] | BaseIterator<TSource>,
        private count: number
    ) {
        super(source);
    }

    next(): IteratorResult<TSource> {
        for (; this.counter < this.count; this.counter++) super.next();

        return super.next();
    }
}

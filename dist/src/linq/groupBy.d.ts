import BaseIterator, { IteratorResult } from "./iterator";
import * as Util from "../util";
export default class GroupByIterator<TSource, TKey> extends BaseIterator<TSource> {
    private keySelector;
    private _previousKeys;
    private _isPipelineExecuted;
    constructor(source: TSource[] | BaseIterator<TSource>, keySelector: Util.ISelector<TSource, TKey>);
    next(): IteratorResult<IGrouping<TKey, TSource>>;
    private toArray();
}
export interface IGrouping<TKey, TValue> {
    key: TKey;
    values: TValue[];
}

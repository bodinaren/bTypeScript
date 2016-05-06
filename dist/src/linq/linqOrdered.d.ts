import Linq from "./linq";
import Iterator from "./iterator";
import * as Util from "../util";
export default class LinqOrdered extends Linq {
    constructor(source: any[] | Iterator);
    thenBy(keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): LinqOrdered;
    thenByDesc(keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): LinqOrdered;
}

import Iterator from "./iterator";
import * as Util from "../util";
export default class Linq {
    protected _source: Iterator;
    constructor(source: any[] | Iterator);
    _makeValuePredicate(predicate: any): (predicate) => any;
    _makeBoolPredicate(predicate: any): (predicate) => boolean;
    map(callback: (item: any, idx: number) => any): Linq;
    static map<T, U>(source: T[], callback: (item: any, idx: number) => U): U[];
    filter(predicate: (value, index) => boolean): Linq;
    static filter<T>(source: T[], predicate: (value, index) => boolean): T[];
    where(predicate: (predicate) => boolean): Linq;
    static where<T>(source: T[], predicate: (predicate) => boolean): T[];
    reverse(): Linq;
    take(count: number): Linq;
    static take<T>(source: T[], count: number): T[];
    takeWhile(predicate?: Util.IPredicate<any>): Linq;
    static takeWhile<T>(source: T[], predicate?: Util.IPredicate<any>): T[];
    skip(count: number): Linq;
    static skip<T>(source: T[], count: number): T[];
    skipWhile(predicate?: Util.IPredicate<any>): Linq;
    static skipWhile<T>(source: T[], predicate?: Util.IPredicate<any>): T[];
    orderBy(keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): OrderedLinq;
    static orderBy<T>(source: T[], keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): T[];
    orderByDesc(keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): OrderedLinq;
    static orderByDesc<T>(source: T[], keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): T[];
    sum(selector?: Util.ISelector<any, number>): number;
    static sum(source: any[], selector?: Util.ISelector<any, number>): number;
    average(selector?: Util.ISelector<any, number>): number;
    avg(selector?: Util.ISelector<any, number>): number;
    static average(source: any[], selector?: Util.ISelector<any, number>): number;
    static avg(source: any[], selector?: Util.ISelector<any, number>): number;
    min(selector?: Util.ISelector<any, number>): number;
    static min(source: any[], selector?: Util.ISelector<any, number>): number;
    max(selector?: Util.ISelector<any, number>): number;
    static max(source: any[], selector?: Util.ISelector<any, number>): number;
    any(predicate: (predicate) => boolean, invert?: boolean): boolean;
    static any(source: any[], predicate: (predicate) => boolean, invert?: boolean): boolean;
    all(predicate: (predicate) => boolean, invert?: boolean): boolean;
    static all(source: any[], predicate: (predicate) => boolean, invert?: boolean): boolean;
    single<T>(predicate: (predicate) => boolean): T;
    static single<T>(source: T[], predicate: (predicate) => boolean): T;
    first(predicate?: (predicate) => boolean): any;
    static first(source: any[], predicate?: (predicate) => boolean): any;
    last(predicate?: (predicate) => boolean): any;
    static last(source: any[], predicate?: (predicate) => boolean): any;
    static intersect(a: any[] | Linq, b: any[] | Linq, ...more: Array<any[] | Linq>): any[];
    intersect(other: any[] | Linq, ...more: Array<any[] | Linq>): Linq;
    static except(a: any[] | Linq, b: any[] | Linq, ...more: Array<any[] | Linq>): any[];
    except(other: any[] | Linq, ...more: Array<any[] | Linq>): Linq;
    static distinct(...datasets: Array<any[] | Linq>): any[];
    distinct(): Linq;
    groupBy(keySelector: Util.ISelector<any, any> | string): Linq;
    static groupBy(source: any[], keySelector: Util.ISelector<any, any> | string): IGrouping[];
    toArray(): any[];
    forEach(callback: Util.ILoopFunction<any>): boolean;
    private contains(a);
}
export declare function LQ(source: any[]): Linq;
export interface IGrouping {
    key: any;
    values: any[];
}
export declare class OrderedLinq extends Linq {
    constructor(source: any[] | Iterator);
    thenBy(keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): OrderedLinq;
    thenByDesc(keySelector: Util.ISelector<any, any> | string, comparer?: Util.IComparer<any>): OrderedLinq;
}

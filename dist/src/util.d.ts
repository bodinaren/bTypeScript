export interface ILoopFunction<T> {
    (a: T, idx?: number): boolean | void;
}
export interface ISelector<T, U> {
    (a: T): U;
}
export declare function defaultSelector<T, U>(a: T): U;
export interface IComparer<T> {
    (a: T, b: T): number;
}
export declare function defaultComparer<T>(a: T, b: T): number;
export interface IEqualityComparer<T> {
    (a: T, b: T): boolean;
}
export declare function defaultEqualityComparer<T>(a: T, b: T): boolean;
export interface IPredicate<T> {
    (a: T): boolean;
}
export declare function defaultPredicate<T>(a: T): boolean;
export declare function cast<T>(a: any): T;
export declare function toString(value: any): string;
export declare function isUndefined(value: any): boolean;
export declare function isString(value: any): boolean;
export declare function isNumber(value: any): boolean;
export declare function isFunction(value: any): boolean;
export declare function isArray(value: any): boolean;
export declare function isDate(value: any): boolean;

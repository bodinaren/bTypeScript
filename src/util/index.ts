export interface ILoopFunction<T> { (a: T, idx?: number): boolean | void; }

export interface ISelector<T, U> { (a: T): U; }
export function defaultSelector<T, U>(a: T): U {
    return cast<U>(a);
}

export interface IComparer<T> { (a: T, b: T): number; }
export function defaultComparer<T>(a: T, b: T): number {
    if (a < b) return -1;
    else if (a > b) return 1;
    else return 0;
}

export interface IEqualityComparer<T> { (a: T, b: T): boolean; }
export function defaultEqualityComparer<T>(a: T, b: T): boolean {
    return a === b;
}

export interface IPredicate<T> { (value: T, index?: number): boolean; }
export function defaultPredicate<T>(value: T, index?: number): boolean {
    return true;
}

export function cast<T>(a: any): T {
    return a;
}

export function toString(value: any): string {
    return Object.prototype.toString.call(value);
}

export function isUndefined(value: any): boolean {
    return typeof value === "undefined";
}

export function isString(value: any): boolean {
    return toString(value) === "[object String]";
}

export function isNumber(value: any): boolean {
    return toString(value) === "[object Number]";
}

export function isFunction(value: any): boolean {
    return toString(value) === "[object Function]";
}

export function isArray(value: any): boolean {
    return Array.isArray(value);
}

export function isDate(value: any): boolean {
    return toString(value) === "[object Date]";
}

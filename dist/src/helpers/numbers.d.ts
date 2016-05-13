export default function Numbers(num: number): NumbersHelper;
export declare class NumbersHelper {
    num: number;
    constructor(num: number);
    between(lower?: number, upper?: number): boolean;
    static between(num: number, lower?: number, upper?: number): boolean;
    in(numbers: number[]): boolean;
    static in(num: number, numbers: number[]): boolean;
    toFixed(precision: any): number;
    static toFixed(num: number, precision: any): number;
}

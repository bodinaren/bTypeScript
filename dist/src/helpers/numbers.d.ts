export default function Numbers(number: number): NumbersHelper;
export declare class NumbersHelper {
    number: number;
    constructor(number: number);
    between(lower?: number, upper?: number): boolean;
    in(numbers: number[]): boolean;
    toFixed(precision: any): number;
}

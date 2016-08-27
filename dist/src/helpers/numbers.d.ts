/**
 * Shorthand function to create a NumbersHelper object.
 * @param number The number on which to perform the various functions.
 */
export default function Numbers(num: number): NumbersHelper;
export declare class NumbersHelper {
    num: number;
    /**
     * Creates a NumbersHelper object.
     * @param number The number on which to perform the various functions.
     */
    constructor(num: number);
    /**
     * Returns weither the number is in between two numbers.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    between(lower?: number, upper?: number): boolean;
    /**
     * Returns weither a number is in between two numbers.
     * @param number The number which to compare with.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    static between(num: number, lower?: number, upper?: number): boolean;
    /**
     * Returns weither the number is in an array.
     * @param numbers The array of numbers to compare with.
     */
    in(numbers: number[]): boolean;
    /**
     * Returns weither a number is in an array.
     * @param number The number which to compare with.
     * @param numbers The array of numbers to compare with.
     */
    static in(num: number, numbers: number[]): boolean;
    /**
     * Safely round numbers in JS without hitting imprecisions of floating-point arithmetics
     * Kindly borrowed from AngularJS: https://github.com/angular/angular.js/blob/g3_v1_3/src/ng/filter/filters.js#L173
     * @param precision How many decimals the number should have.
     */
    toFixed(precision: any): number;
    /**
     * Safely round numbers in JS without hitting imprecisions of floating-point arithmetics
     * Kindly borrowed from AngularJS: https://github.com/angular/angular.js/blob/g3_v1_3/src/ng/filter/filters.js#L173
     * @param precision How many decimals the number should have.
     */
    static toFixed(num: number, precision: any): number;
}

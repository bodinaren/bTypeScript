import * as util from "../util";

/**
 * Shorthand function to create a NumbersHelper object.
 * @param number The number on which to perform the various functions.
 */
export default function Numbers(number: number): NumbersHelper { return new NumbersHelper(number); }
export class NumbersHelper {
    number: number;

    /**
     * Creates a NumbersHelper object.
     * @param number The number on which to perform the various functions.
     */
    constructor(number: number) {
        this.number = number;
    }

    /**
     * Returns weither the number is in between two numbers.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    between(lower?: number, upper?: number): boolean {
        return NumbersHelper.between(this.number, lower, upper);
    }
    /**
     * Returns weither a number is in between two numbers.
     * @param number The number which to compare with.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    static between(number: number, lower?: number, upper?: number): boolean {
        if (util.isUndefined(lower)) lower = Number.MIN_VALUE;
        if (util.isUndefined(upper)) upper = Number.MAX_VALUE;
        return (lower <= number && number <= upper);
    }

    /**
     * Returns weither the number is in an array.
     * @param numbers The array of numbers to compare with.
     */
    in(numbers: number[]): boolean {
        return NumbersHelper.in(this.number, numbers);
    }
    /**
     * Returns weither a number is in an array.
     * @param number The number which to compare with.
     * @param numbers The array of numbers to compare with.
     */
    static in(number: number, numbers: number[]): boolean {
        for (let i = 0; i < numbers.length; i++) {
            if (numbers[i] == number) return true;
        }
        return false;
    }

    /**
     * Safely round numbers in JS without hitting imprecisions of floating-point arithmetics
     * Kindly borrowed from AngularJS: https://github.com/angular/angular.js/blob/g3_v1_3/src/ng/filter/filters.js#L173
     * @param precision How many decimals the number should have.
     */
    toFixed(precision) {
        return NumbersHelper.toFixed(this.number, precision);
    }
    /**
     * Safely round numbers in JS without hitting imprecisions of floating-point arithmetics
     * Kindly borrowed from AngularJS: https://github.com/angular/angular.js/blob/g3_v1_3/src/ng/filter/filters.js#L173
     * @param precision How many decimals the number should have.
     */
    static toFixed(number: number, precision) {
        return +(Math.round(+(number.toString() + 'e' + precision)).toString() + 'e' + -precision);
    }
}
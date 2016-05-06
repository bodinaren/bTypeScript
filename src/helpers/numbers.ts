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
     * Returns weither the number is in between the two numbers.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    between(lower?: number, upper?: number): boolean {
        if (util.isUndefined(lower)) lower = Number.MIN_VALUE;
        if (util.isUndefined(upper)) upper = Number.MAX_VALUE;
        
        return (lower <= this.number && this.number <= upper);
    }

    /**
     * Returns weither the number is in the array.
     * @param numbers The array of numbers to compare with.
     */
    in(numbers: number[]): boolean {
        for (let i = 0; i < numbers.length; i++) {
            if (numbers[i] == this.number) return true;
        }
        return false;
    }
    
    /**
     * safely round numbers in JS without hitting imprecisions of floating-point arithmetics
     * stolen from AngularJS: https://github.com/angular/angular.js/blob/g3_v1_3/src/ng/filter/filters.js#L173
     * @param precision How many decimals the number should have.
     */
    toFixed(precision) {
        return +(Math.round(+(this.number.toString() + 'e' + precision)).toString() + 'e' + -precision);
    }
}
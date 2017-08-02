"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
/**
 * Shorthand function to create a NumbersHelper object.
 * @param number The number on which to perform the various functions.
 */
function Numbers(num) { return new NumbersHelper(num); }
exports.default = Numbers;
var NumbersHelper = (function () {
    /**
     * Creates a NumbersHelper object.
     * @param number The number on which to perform the various functions.
     */
    function NumbersHelper(num) {
        this.num = num;
    }
    /**
     * Returns weither the number is in between two numbers.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    NumbersHelper.prototype.between = function (lower, upper) {
        return NumbersHelper.between(this.num, lower, upper);
    };
    /**
     * Returns weither a number is in between two numbers.
     * @param number The number which to compare with.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    NumbersHelper.between = function (num, lower, upper) {
        if (util.isUndefined(lower))
            lower = Number.MIN_VALUE;
        if (util.isUndefined(upper))
            upper = Number.MAX_VALUE;
        return (lower <= num && num <= upper);
    };
    /**
     * Returns weither the number is in an array.
     * @param numbers The array of numbers to compare with.
     */
    NumbersHelper.prototype.in = function (numbers) {
        return NumbersHelper.in(this.num, numbers);
    };
    /**
     * Returns weither a number is in an array.
     * @param number The number which to compare with.
     * @param numbers The array of numbers to compare with.
     */
    NumbersHelper.in = function (num, numbers) {
        for (var i = 0; i < numbers.length; i++) {
            if (numbers[i] == num)
                return true;
        }
        return false;
    };
    /**
     * Safely round numbers in JS without hitting imprecisions of floating-point arithmetics
     * Kindly borrowed from AngularJS: https://github.com/angular/angular.js/blob/g3_v1_3/src/ng/filter/filters.js#L173
     * @param precision How many decimals the number should have.
     */
    NumbersHelper.prototype.toFixed = function (precision) {
        return NumbersHelper.toFixed(this.num, precision);
    };
    /**
     * Safely round numbers in JS without hitting imprecisions of floating-point arithmetics
     * Kindly borrowed from AngularJS: https://github.com/angular/angular.js/blob/g3_v1_3/src/ng/filter/filters.js#L173
     * @param precision How many decimals the number should have.
     */
    NumbersHelper.toFixed = function (num, precision) {
        return +(Math.round(+(num.toString() + "e" + precision)).toString() + "e" + -precision);
    };
    return NumbersHelper;
}());
exports.NumbersHelper = NumbersHelper;
//# sourceMappingURL=numbers.js.map
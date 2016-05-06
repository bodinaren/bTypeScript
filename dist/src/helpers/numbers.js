(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../util"], factory);
    }
})(function (require, exports) {
    "use strict";
    var util = require("../util");
    function Numbers(number) { return new NumbersHelper(number); }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Numbers;
    var NumbersHelper = (function () {
        function NumbersHelper(number) {
            this.number = number;
        }
        NumbersHelper.prototype.between = function (lower, upper) {
            return NumbersHelper.between(this.number, lower, upper);
        };
        NumbersHelper.between = function (number, lower, upper) {
            if (util.isUndefined(lower))
                lower = Number.MIN_VALUE;
            if (util.isUndefined(upper))
                upper = Number.MAX_VALUE;
            return (lower <= number && number <= upper);
        };
        NumbersHelper.prototype.in = function (numbers) {
            return NumbersHelper.in(this.number, numbers);
        };
        NumbersHelper.in = function (number, numbers) {
            for (var i = 0; i < numbers.length; i++) {
                if (numbers[i] == number)
                    return true;
            }
            return false;
        };
        NumbersHelper.prototype.toFixed = function (precision) {
            return NumbersHelper.toFixed(this.number, precision);
        };
        NumbersHelper.toFixed = function (number, precision) {
            return +(Math.round(+(number.toString() + 'e' + precision)).toString() + 'e' + -precision);
        };
        return NumbersHelper;
    }());
    exports.NumbersHelper = NumbersHelper;
});
//# sourceMappingURL=numbers.js.map
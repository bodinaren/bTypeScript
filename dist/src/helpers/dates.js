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
    function Dates(date) { return new DatesHelper(date); }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Dates;
    var DatesHelper = (function () {
        function DatesHelper(date) {
            this.date = date;
        }
        DatesHelper.toDate = function (date) {
            if (util.isUndefined(date))
                return new Date();
            if (util.isString(date))
                date = Date.parse(date);
            if (util.isNumber(date))
                date = new Date(date);
            return date;
        };
        DatesHelper.prototype.between = function (lower, upper) {
            return DatesHelper.between(this.date, lower, upper);
        };
        DatesHelper.between = function (date, lower, upper) {
            if (util.isUndefined(lower))
                lower = new Date();
            if (util.isUndefined(upper))
                upper = new Date(9999999999999);
            return (lower <= date && date <= upper);
        };
        DatesHelper.prototype.addYears = function (years) { return this.addMonths(years * 12); };
        DatesHelper.prototype.addMonths = function (months) {
            this.date.setMonth(this.date.getMonth() + months);
            return this;
        };
        DatesHelper.prototype.addWeeks = function (week) { return this.addDays(week * 7); };
        DatesHelper.prototype.addDays = function (days) { return this.addHours(days * 24); };
        DatesHelper.prototype.addHours = function (hours) { return this.addMinutes(hours * 60); };
        DatesHelper.prototype.addMinutes = function (minutes) { return this.addSeconds(minutes * 60); };
        DatesHelper.prototype.addSeconds = function (seconds) { return this.addMilliseconds(seconds * 1000); };
        DatesHelper.prototype.addMilliseconds = function (milliseconds) {
            this.date.setMilliseconds(this.date.getMilliseconds() + milliseconds);
            return this;
        };
        return DatesHelper;
    }());
    exports.DatesHelper = DatesHelper;
});
//# sourceMappingURL=dates.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../util");
/**
 * Shorthand function to create a DatesHelper object.
 * @param number The date on which to perform the various functions.
 */
function Dates(date) { return new DatesHelper(date); }
exports.default = Dates;
var DatesHelper = (function () {
    function DatesHelper(date) {
        this.date = date;
    }
    DatesHelper.toDate = function (date) {
        if (Util.isUndefined(date))
            return new Date();
        if (Util.isString(date))
            date = Date.parse(date);
        if (Util.isNumber(date))
            date = new Date(date);
        return date;
    };
    /**
     * Returns weither the date is in between two numbers.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    DatesHelper.prototype.between = function (lower, upper) {
        return DatesHelper.between(this.date, lower, upper);
    };
    /**
     * Returns weither a date is in between two numbers.
     * @param date The date which to compare with.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    DatesHelper.between = function (date, lower, upper) {
        if (Util.isUndefined(lower))
            lower = new Date(0);
        if (Util.isUndefined(upper))
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
    DatesHelper.prototype.isToday = function () {
        return this.date.toDateString() === new Date().toDateString();
    };
    DatesHelper.prototype.toMidnight = function () {
        this.date.setHours(0);
        this.date.setMinutes(0);
        this.date.setSeconds(0);
        this.date.setMilliseconds(0);
        return this;
    };
    DatesHelper.addYears = function (date, years) { return new DatesHelper(date).addYears(years).date; };
    DatesHelper.addMonths = function (date, months) { return new DatesHelper(date).addMonths(months).date; };
    DatesHelper.addWeeks = function (date, week) { return new DatesHelper(date).addWeeks(week).date; };
    DatesHelper.addDays = function (date, days) { return new DatesHelper(date).addDays(days).date; };
    DatesHelper.addHours = function (date, hours) { return new DatesHelper(date).addHours(hours).date; };
    DatesHelper.addMinutes = function (date, minutes) { return new DatesHelper(date).addMinutes(minutes).date; };
    DatesHelper.addSeconds = function (date, seconds) { return new DatesHelper(date).addSeconds(seconds).date; };
    DatesHelper.addMilliseconds = function (date, milliseconds) { return new DatesHelper(date).addMilliseconds(milliseconds).date; };
    DatesHelper.isToday = function (date) { return new DatesHelper(date).isToday(); };
    DatesHelper.getMidnight = function (date) { return new DatesHelper(date).toMidnight().date; };
    return DatesHelper;
}());
exports.DatesHelper = DatesHelper;
//# sourceMappingURL=dates.js.map
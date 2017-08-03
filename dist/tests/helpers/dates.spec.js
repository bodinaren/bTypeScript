"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dates_1 = require("../../src/helpers/dates");
var chai_1 = require("chai");
describe("Dates", function () {
    it("toDate", function () {
        chai_1.expect(dates_1.DatesHelper.toDate(undefined) instanceof Date).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.toDate(new Date("2016-01-01T00:00:00+01:00")) instanceof Date).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.toDate("2016-01-01T00:00:00+01:00") instanceof Date).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.toDate(1461429137000) instanceof Date).to.eql(true);
    });
    it("between", function () {
        var d = new Date(1500000000000), before = new Date(1000000000000), after = new Date(2000000000000);
        chai_1.expect(dates_1.default(d).between(undefined, undefined)).to.eql(true);
        chai_1.expect(dates_1.default(d).between(before, after)).to.eql(true);
        chai_1.expect(dates_1.default(d).between(d, after)).to.eql(true);
        chai_1.expect(dates_1.default(d).between(before, d)).to.eql(true);
        chai_1.expect(dates_1.default(before).between(before, after)).to.eql(true);
        chai_1.expect(dates_1.default(after).between(before, after)).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.between(d, undefined, undefined)).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.between(d, before, after)).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.between(d, d, after)).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.between(d, before, d)).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.between(before, before, after)).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.between(after, before, after)).to.eql(true);
    });
    it("addYears", function () {
        // test with 4 years to make sure we get exactly 1 leap year, no more, no less.
        chai_1.expect(dates_1.default(new Date(1500000000000)).addYears(4).date).to.eql(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
        //static
        chai_1.expect(dates_1.DatesHelper.addYears(new Date(1500000000000), 4)).to.eql(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
    });
    it("addMonths", function () {
        //we only need static here, the non-static is already tested by "addYears"
        chai_1.expect(dates_1.DatesHelper.addMonths(new Date(1500000000000), 4 * 12)).to.eql(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
    });
    it("addWeeks", function () {
        chai_1.expect(dates_1.default(new Date(1500000000000)).addWeeks(1).date).to.eql(new Date(1500000000000 + 7 * 24 * 60 * 60 * 1000));
        chai_1.expect(dates_1.DatesHelper.addWeeks(new Date(1500000000000), 1)).to.eql(new Date(1500000000000 + 7 * 24 * 60 * 60 * 1000));
    });
    it("addDays", function () {
        //we only need static here, the non-static is already tested by "addWeeks"
        chai_1.expect(dates_1.DatesHelper.addDays(new Date(1500000000000), 7)).to.eql(new Date(1500000000000 + 7 * 24 * 60 * 60 * 1000));
    });
    it("addHours", function () {
        //we only need static here, the non-static is already tested by "addWeeks"
        chai_1.expect(dates_1.DatesHelper.addHours(new Date(1500000000000), 24)).to.eql(new Date(1500000000000 + 24 * 60 * 60 * 1000));
    });
    it("addMinutes", function () {
        //we only need static here, the non-static is already tested by "addWeeks"
        chai_1.expect(dates_1.DatesHelper.addMinutes(new Date(1500000000000), 60)).to.eql(new Date(1500000000000 + 60 * 60 * 1000));
    });
    it("addSeconds", function () {
        //we only need static here, the non-static is already tested by "addWeeks"
        chai_1.expect(dates_1.DatesHelper.addSeconds(new Date(1500000000000), 60)).to.eql(new Date(1500000000000 + 60 * 1000));
    });
    it("addMilliseconds", function () {
        //we only need static here, the non-static is already tested by "addWeeks"
        chai_1.expect(dates_1.DatesHelper.addMilliseconds(new Date(1500000000000), 1000)).to.eql(new Date(1500000000000 + 1000));
    });
    it("isToday", function () {
        chai_1.expect(dates_1.default(new Date(1500000000000)).isToday()).to.eql(false);
        chai_1.expect(dates_1.default(new Date()).isToday()).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.isToday(new Date(1500000000000))).to.eql(false);
        chai_1.expect(dates_1.DatesHelper.isToday(new Date())).to.eql(true);
    });
    it("toMidnight", function () {
        var d = dates_1.default(new Date(1500000000000)).toMidnight().date;
        chai_1.expect(d.getHours()).to.eql(0);
        chai_1.expect(d.getMinutes()).to.eql(0);
        chai_1.expect(d.getSeconds()).to.eql(0);
        chai_1.expect(d.getMilliseconds()).to.eql(0);
        d = dates_1.DatesHelper.toMidnight(new Date(1500000000000));
        chai_1.expect(d.getHours()).to.eql(0);
        chai_1.expect(d.getMinutes()).to.eql(0);
        chai_1.expect(d.getSeconds()).to.eql(0);
        chai_1.expect(d.getMilliseconds()).to.eql(0);
    });
});
//# sourceMappingURL=dates.spec.js.map
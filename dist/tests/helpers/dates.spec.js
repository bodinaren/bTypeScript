"use strict";
var dates_1 = require("../../src/helpers/dates");
var chai_1 = require('chai');
describe("Dates", function () {
    it("toDate", function () {
        chai_1.expect(dates_1.DatesHelper.toDate(new Date("2016-01-01T00:00:00+01:00")) instanceof Date).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.toDate("2016-01-01T00:00:00+01:00") instanceof Date).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.toDate(1461429137000) instanceof Date).to.eql(true);
    });
    it("between", function () {
        var d = new Date(1500000000000), before = new Date(1000000000000), after = new Date(2000000000000);
        chai_1.expect(dates_1.default(d).between(before, after)).to.eql(true);
        chai_1.expect(dates_1.default(d).between(d, after)).to.eql(true);
        chai_1.expect(dates_1.default(d).between(before, d)).to.eql(true);
        chai_1.expect(dates_1.default(before).between(before, after)).to.eql(true);
        chai_1.expect(dates_1.default(after).between(before, after)).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.between(d, before, after)).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.between(d, d, after)).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.between(d, before, d)).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.between(before, before, after)).to.eql(true);
        chai_1.expect(dates_1.DatesHelper.between(after, before, after)).to.eql(true);
    });
    it("addWeeks", function () {
        var d = new Date(1500000000000);
        chai_1.expect(dates_1.default(d).addWeeks(1).date).to.eql(new Date(1500000000000 + 7 * 24 * 60 * 60 * 1000));
        d = new Date(1500000000000);
        chai_1.expect(dates_1.default(d).addYears(4).date).to.eql(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
    });
    it("addYears", function () {
        var d = new Date(1500000000000);
        chai_1.expect(dates_1.default(d).addYears(4).date).to.eql(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
    });
});
//# sourceMappingURL=dates.spec.js.map
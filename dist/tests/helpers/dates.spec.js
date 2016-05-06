(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../src/helpers/dates"], factory);
    }
})(function (require, exports) {
    "use strict";
    var dates_1 = require("../../src/helpers/dates");
    describe("Dates", function () {
        it("toDate", function () {
            expect(dates_1.DatesHelper.toDate(new Date("2016-01-01T00:00:00+01:00")) instanceof Date).toEqual(true);
            expect(dates_1.DatesHelper.toDate("2016-01-01T00:00:00+01:00") instanceof Date).toEqual(true);
            expect(dates_1.DatesHelper.toDate(1461429137000) instanceof Date).toEqual(true);
        });
        it("between", function () {
            var d = new Date(1500000000000), before = new Date(1000000000000), after = new Date(2000000000000);
            expect(dates_1.default(d).between(before, after)).toEqual(true);
            expect(dates_1.default(d).between(d, after)).toEqual(true);
            expect(dates_1.default(d).between(before, d)).toEqual(true);
            expect(dates_1.default(before).between(before, after)).toEqual(true);
            expect(dates_1.default(after).between(before, after)).toEqual(true);
            expect(dates_1.DatesHelper.between(d, before, after)).toEqual(true);
            expect(dates_1.DatesHelper.between(d, d, after)).toEqual(true);
            expect(dates_1.DatesHelper.between(d, before, d)).toEqual(true);
            expect(dates_1.DatesHelper.between(before, before, after)).toEqual(true);
            expect(dates_1.DatesHelper.between(after, before, after)).toEqual(true);
        });
        it("addWeeks", function () {
            var d = new Date(1500000000000);
            expect(dates_1.default(d).addWeeks(1).date).toEqual(new Date(1500000000000 + 7 * 24 * 60 * 60 * 1000));
            d = new Date(1500000000000);
            expect(dates_1.default(d).addYears(4).date).toEqual(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
        });
        it("addYears", function () {
            var d = new Date(1500000000000);
            expect(dates_1.default(d).addYears(4).date).toEqual(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
        });
    });
});
//# sourceMappingURL=dates.spec.js.map
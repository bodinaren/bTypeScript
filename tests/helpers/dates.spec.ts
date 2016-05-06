/// <reference path="../../typings/main.d.ts" />

import Dates, {DatesHelper} from "../../src/helpers/dates";

describe("Dates", () => {
    it("toDate", () => {
        expect(DatesHelper.toDate(new Date("2016-01-01T00:00:00+01:00")) instanceof Date).toEqual(true);
        expect(DatesHelper.toDate("2016-01-01T00:00:00+01:00") instanceof Date).toEqual(true);
        expect(DatesHelper.toDate(1461429137000) instanceof Date).toEqual(true);
    });

    it("between", () => {
        var d = new Date(1500000000000),
            before = new Date(1000000000000),
            after = new Date(2000000000000)

        expect(Dates(d).between(before, after)).toEqual(true);
        expect(Dates(d).between(d, after)).toEqual(true);
        expect(Dates(d).between(before, d)).toEqual(true);
        expect(Dates(before).between(before, after)).toEqual(true);
        expect(Dates(after).between(before, after)).toEqual(true);

        expect(DatesHelper.between(d, before, after)).toEqual(true);
        expect(DatesHelper.between(d, d, after)).toEqual(true);
        expect(DatesHelper.between(d, before, d)).toEqual(true);
        expect(DatesHelper.between(before, before, after)).toEqual(true);
        expect(DatesHelper.between(after, before, after)).toEqual(true);
    });

    it("addWeeks", () => {
        var d = new Date(1500000000000);
        expect(Dates(d).addWeeks(1).date).toEqual(new Date(1500000000000 + 7 * 24 * 60 * 60 * 1000));

        d = new Date(1500000000000);
        // test with 4 years to make sure we get exactly 1 leap year, no more, no less.
        expect(Dates(d).addYears(4).date).toEqual(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
    });

    it("addYears", () => {
        var d = new Date(1500000000000);
        // test with 4 years to make sure we get exactly 1 leap year, no more, no less.
        expect(Dates(d).addYears(4).date).toEqual(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
    });
});
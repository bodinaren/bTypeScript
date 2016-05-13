/// <reference path="../../typings/main.d.ts" />

import Dates, {DatesHelper} from "../../src/helpers/dates";
import {expect} from 'chai';

describe("Dates", function() {
    it("toDate", function() {
        expect(DatesHelper.toDate(new Date("2016-01-01T00:00:00+01:00")) instanceof Date).to.eql(true);
        expect(DatesHelper.toDate("2016-01-01T00:00:00+01:00") instanceof Date).to.eql(true);
        expect(DatesHelper.toDate(1461429137000) instanceof Date).to.eql(true);
    });

    it("between", function() {
        var d = new Date(1500000000000),
            before = new Date(1000000000000),
            after = new Date(2000000000000)

        expect(Dates(d).between(before, after)).to.eql(true);
        expect(Dates(d).between(d, after)).to.eql(true);
        expect(Dates(d).between(before, d)).to.eql(true);
        expect(Dates(before).between(before, after)).to.eql(true);
        expect(Dates(after).between(before, after)).to.eql(true);

        expect(DatesHelper.between(d, before, after)).to.eql(true);
        expect(DatesHelper.between(d, d, after)).to.eql(true);
        expect(DatesHelper.between(d, before, d)).to.eql(true);
        expect(DatesHelper.between(before, before, after)).to.eql(true);
        expect(DatesHelper.between(after, before, after)).to.eql(true);
    });

    it("addWeeks", function() {
        var d = new Date(1500000000000);
        expect(Dates(d).addWeeks(1).date).to.eql(new Date(1500000000000 + 7 * 24 * 60 * 60 * 1000));

        d = new Date(1500000000000);
        // test with 4 years to make sure we get exactly 1 leap year, no more, no less.
        expect(Dates(d).addYears(4).date).to.eql(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
    });

    it("addYears", function() {
        var d = new Date(1500000000000);
        // test with 4 years to make sure we get exactly 1 leap year, no more, no less.
        expect(Dates(d).addYears(4).date).to.eql(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
    });
});
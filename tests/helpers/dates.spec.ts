import Dates, {DatesHelper} from "../../src/helpers/dates";
import {expect} from 'chai';

describe("Dates", function() {
    it("toDate", function() {
        expect(DatesHelper.toDate(undefined) instanceof Date).to.eql(true);
        expect(DatesHelper.toDate(new Date("2016-01-01T00:00:00+01:00")) instanceof Date).to.eql(true);
        expect(DatesHelper.toDate("2016-01-01T00:00:00+01:00") instanceof Date).to.eql(true);
        expect(DatesHelper.toDate(1461429137000) instanceof Date).to.eql(true);
    });

    it("between", function() {
        var d = new Date(1500000000000),
            before = new Date(1000000000000),
            after = new Date(2000000000000)

        expect(Dates(d).between(undefined, undefined)).to.eql(true);
        expect(Dates(d).between(before, after)).to.eql(true);
        expect(Dates(d).between(d, after)).to.eql(true);
        expect(Dates(d).between(before, d)).to.eql(true);
        expect(Dates(before).between(before, after)).to.eql(true);
        expect(Dates(after).between(before, after)).to.eql(true);

        expect(DatesHelper.between(d, undefined, undefined)).to.eql(true);
        expect(DatesHelper.between(d, before, after)).to.eql(true);
        expect(DatesHelper.between(d, d, after)).to.eql(true);
        expect(DatesHelper.between(d, before, d)).to.eql(true);
        expect(DatesHelper.between(before, before, after)).to.eql(true);
        expect(DatesHelper.between(after, before, after)).to.eql(true);
    });

    it("addYears", function() {
        // test with 4 years to make sure we get exactly 1 leap year, no more, no less.
        expect(Dates(new Date(1500000000000)).addYears(4).date).to.eql(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
        
        //static
        expect(DatesHelper.addYears(new Date(1500000000000), 4)).to.eql(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
    });

    it("addMonths", function() {
        //we only need static here, the non-static is already tested by "addYears"
        expect(DatesHelper.addMonths(new Date(1500000000000), 4 * 12)).to.eql(new Date(1500000000000 + (365 + 365 + 365 + 366) * 24 * 60 * 60 * 1000));
    });

    it("addWeeks", function() {
        expect(Dates(new Date(1500000000000)).addWeeks(1).date).to.eql(new Date(1500000000000 + 7 * 24 * 60 * 60 * 1000));
        expect(DatesHelper.addWeeks(new Date(1500000000000), 1)).to.eql(new Date(1500000000000 + 7 * 24 * 60 * 60 * 1000));
    });

    it("addDays", function() {
        //we only need static here, the non-static is already tested by "addWeeks"
        expect(DatesHelper.addDays(new Date(1500000000000), 7)).to.eql(new Date(1500000000000 + 7 * 24 * 60 * 60 * 1000));
    });

    it("addHours", function() {
        //we only need static here, the non-static is already tested by "addWeeks"
        expect(DatesHelper.addHours(new Date(1500000000000), 24)).to.eql(new Date(1500000000000 + 24 * 60 * 60 * 1000));
    });

    it("addMinutes", function() {
        //we only need static here, the non-static is already tested by "addWeeks"
        expect(DatesHelper.addMinutes(new Date(1500000000000), 60)).to.eql(new Date(1500000000000 + 60 * 60 * 1000));
    });

    it("addSeconds", function() {
        //we only need static here, the non-static is already tested by "addWeeks"
        expect(DatesHelper.addSeconds(new Date(1500000000000), 60)).to.eql(new Date(1500000000000 + 60 * 1000));
    });

    it("addMilliseconds", function() {
        //we only need static here, the non-static is already tested by "addWeeks"
        expect(DatesHelper.addMilliseconds(new Date(1500000000000), 1000)).to.eql(new Date(1500000000000 + 1000));
    });

    it("isToday", function () {
        expect(Dates(new Date(1500000000000)).isToday()).to.eql(false);
        expect(Dates(new Date()).isToday()).to.eql(true);
        
        expect(DatesHelper.isToday(new Date(1500000000000))).to.eql(false);
        expect(DatesHelper.isToday(new Date())).to.eql(true);
    });

    it("toMidnight", function () {
        var d = Dates(new Date(1500000000000)).toMidnight().date;

        expect(d.getHours()).to.eql(0);
        expect(d.getMinutes()).to.eql(0);
        expect(d.getSeconds()).to.eql(0);
        expect(d.getMilliseconds()).to.eql(0);
        
        d = DatesHelper.toMidnight(new Date(1500000000000));

        expect(d.getHours()).to.eql(0);
        expect(d.getMinutes()).to.eql(0);
        expect(d.getSeconds()).to.eql(0);
        expect(d.getMilliseconds()).to.eql(0);
    });
});
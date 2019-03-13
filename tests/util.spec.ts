import * as Util from "../src/util/index";
import {expect} from "chai";

describe("Util", function() {
    let x;

    it("isUndefined", function() {
        expect(Util.isUndefined(x)).to.eql(true);
        expect(Util.isUndefined(null)).to.eql(false);
        expect(Util.isUndefined(undefined)).to.eql(true);
        expect(Util.isUndefined(() => { })).to.eql(false);
        expect(Util.isUndefined([])).to.eql(false);
        expect(Util.isUndefined({})).to.eql(false);
        expect(Util.isUndefined("")).to.eql(false);
        expect(Util.isUndefined(0)).to.eql(false);
        expect(Util.isUndefined(new Date("2016-01-01T00:00:00+01:00"))).to.eql(false);
    });

    it("isString", function() {
        expect(Util.isString(x)).to.eql(false);
        expect(Util.isString(null)).to.eql(false);
        expect(Util.isString(undefined)).to.eql(false);
        expect(Util.isString(() => { })).to.eql(false);
        expect(Util.isString([])).to.eql(false);
        expect(Util.isString({})).to.eql(false);
        expect(Util.isString("")).to.eql(true);
        expect(Util.isString(0)).to.eql(false);
        expect(Util.isString(new Date("2016-01-01T00:00:00+01:00"))).to.eql(false);

        expect(Util.isString("z")).to.eql(true);
        expect(Util.isString(new String("a"))).to.eql(true);
    });

    it("isNumber", function() {
        expect(Util.isNumber(x)).to.eql(false);
        expect(Util.isNumber(null)).to.eql(false);
        expect(Util.isNumber(undefined)).to.eql(false);
        expect(Util.isNumber(() => { })).to.eql(false);
        expect(Util.isNumber([])).to.eql(false);
        expect(Util.isNumber({})).to.eql(false);
        expect(Util.isNumber("")).to.eql(false);
        expect(Util.isNumber(0)).to.eql(true);
        expect(Util.isNumber(new Date("2016-01-01T00:00:00+01:00"))).to.eql(false);

        expect(Util.isNumber(new Number(0))).to.eql(true);
    });

    it("isFunction", function() {
        expect(Util.isFunction(x)).to.eql(false);
        expect(Util.isFunction(null)).to.eql(false);
        expect(Util.isFunction(undefined)).to.eql(false);
        expect(Util.isFunction(() => { })).to.eql(true);
        expect(Util.isFunction([])).to.eql(false);
        expect(Util.isFunction({})).to.eql(false);
        expect(Util.isFunction("")).to.eql(false);
        expect(Util.isFunction(0)).to.eql(false);
        expect(Util.isFunction(new Date("2016-01-01T00:00:00+01:00"))).to.eql(false);
    });

    it("isArray", function() {
        expect(Util.isArray(x)).to.eql(false);
        expect(Util.isArray(null)).to.eql(false);
        expect(Util.isArray(undefined)).to.eql(false);
        expect(Util.isArray(() => { })).to.eql(false);
        expect(Util.isArray([])).to.eql(true);
        expect(Util.isArray({})).to.eql(false);
        expect(Util.isArray("")).to.eql(false);
        expect(Util.isArray(0)).to.eql(false);
        expect(Util.isArray(new Date("2016-01-01T00:00:00+01:00"))).to.eql(false);

        expect(Util.isArray(new Array())).to.eql(true);
    });

    it("isDate", function() {
        expect(Util.isDate(x)).to.eql(false);
        expect(Util.isDate(null)).to.eql(false);
        expect(Util.isDate(undefined)).to.eql(false);
        expect(Util.isDate(() => { })).to.eql(false);
        expect(Util.isDate([])).to.eql(false);
        expect(Util.isDate({})).to.eql(false);
        expect(Util.isDate("")).to.eql(false);
        expect(Util.isDate(0)).to.eql(false);
        expect(Util.isDate(new Date("2016-01-01T00:00:00+01:00"))).to.eql(true);

        expect(Util.isDate(Date.parse("2016-01-01T00:00:00+01:00"))).to.eql(false);
        expect(Util.isDate("2016-01-01T00:00:00+01:00")).to.eql(false);
    });

    it("defaultSelector", function() {
        expect(Util.defaultSelector(0)).to.eql(0);
        expect(Util.defaultSelector(1)).to.eql(1);
    });

    it("defaultComparer", function() {
        expect(Util.defaultComparer(1, 3)).to.eql(-1);
        expect(Util.defaultComparer(1, 2)).to.eql(-1);
        expect(Util.defaultComparer(1, 1)).to.eql(0);
        expect(Util.defaultComparer(2, 1)).to.eql(1);
        expect(Util.defaultComparer(3, 1)).to.eql(1);
    });

    it("defaultEqualityComparer", function() {
        expect(Util.defaultEqualityComparer(1, 2)).to.eql(false);
        expect(Util.defaultEqualityComparer(1, 1)).to.eql(true);
        expect(Util.defaultEqualityComparer(2, 1)).to.eql(false);
        expect(Util.defaultEqualityComparer(undefined, null)).to.eql(false);
        expect(Util.defaultEqualityComparer(true, false)).to.eql(false);
        expect(Util.defaultEqualityComparer(true, true)).to.eql(true);
    });

    it("defaultPredicate", function() {
        expect(Util.defaultPredicate(0)).to.eql(true);
        expect(Util.defaultPredicate(1)).to.eql(true);
        expect(Util.defaultPredicate(false)).to.eql(true);
        expect(Util.defaultPredicate(undefined)).to.eql(true);
    });
});

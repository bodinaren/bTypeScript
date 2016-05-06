/// <reference path="../typings/main.d.ts" />

import * as Util from "../src/util";

describe("Util", () => {
    var x;

    it("isUndefined", () => {
        expect(Util.isUndefined(x)).toEqual(true);
        expect(Util.isUndefined(null)).toEqual(false);
        expect(Util.isUndefined(undefined)).toEqual(true);
        expect(Util.isUndefined(() => { })).toEqual(false);
        expect(Util.isUndefined([])).toEqual(false);
        expect(Util.isUndefined({})).toEqual(false);
        expect(Util.isUndefined("")).toEqual(false);
        expect(Util.isUndefined(0)).toEqual(false);
        expect(Util.isUndefined(new Date("2016-01-01T00:00:00+01:00"))).toEqual(false);
    });

    it("isString", () => {
        expect(Util.isString(x)).toEqual(false);
        expect(Util.isString(null)).toEqual(false);
        expect(Util.isString(undefined)).toEqual(false);
        expect(Util.isString(() => { })).toEqual(false);
        expect(Util.isString([])).toEqual(false);
        expect(Util.isString({})).toEqual(false);
        expect(Util.isString("")).toEqual(true);
        expect(Util.isString(0)).toEqual(false);
        expect(Util.isString(new Date("2016-01-01T00:00:00+01:00"))).toEqual(false);

        expect(Util.isString("z")).toEqual(true);
        expect(Util.isString(new String("a"))).toEqual(true);
    });

    it("isNumber", () => {
        expect(Util.isNumber(x)).toEqual(false);
        expect(Util.isNumber(null)).toEqual(false);
        expect(Util.isNumber(undefined)).toEqual(false);
        expect(Util.isNumber(() => { })).toEqual(false);
        expect(Util.isNumber([])).toEqual(false);
        expect(Util.isNumber({})).toEqual(false);
        expect(Util.isNumber("")).toEqual(false);
        expect(Util.isNumber(0)).toEqual(true);
        expect(Util.isNumber(new Date("2016-01-01T00:00:00+01:00"))).toEqual(false);
        
        expect(Util.isNumber(new Number(0))).toEqual(true);
    });

    it("isFunction", () => {
        expect(Util.isFunction(x)).toEqual(false);
        expect(Util.isFunction(null)).toEqual(false);
        expect(Util.isFunction(undefined)).toEqual(false);
        expect(Util.isFunction(() => { })).toEqual(true);
        expect(Util.isFunction([])).toEqual(false);
        expect(Util.isFunction({})).toEqual(false);
        expect(Util.isFunction("")).toEqual(false);
        expect(Util.isFunction(0)).toEqual(false);
        expect(Util.isFunction(new Date("2016-01-01T00:00:00+01:00"))).toEqual(false);
    });

    it("isArray", () => {
        expect(Util.isArray(x)).toEqual(false);
        expect(Util.isArray(null)).toEqual(false);
        expect(Util.isArray(undefined)).toEqual(false);
        expect(Util.isArray(() => { })).toEqual(false);
        expect(Util.isArray([])).toEqual(true);
        expect(Util.isArray({})).toEqual(false);
        expect(Util.isArray("")).toEqual(false);
        expect(Util.isArray(0)).toEqual(false);
        expect(Util.isArray(new Date("2016-01-01T00:00:00+01:00"))).toEqual(false);

        expect(Util.isArray(new Array())).toEqual(true);
    });

    it("isDate", () => {
        expect(Util.isDate(x)).toEqual(false);
        expect(Util.isDate(null)).toEqual(false);
        expect(Util.isDate(undefined)).toEqual(false);
        expect(Util.isDate(() => { })).toEqual(false);
        expect(Util.isDate([])).toEqual(false);
        expect(Util.isDate({})).toEqual(false);
        expect(Util.isDate("")).toEqual(false);
        expect(Util.isDate(0)).toEqual(false);
        expect(Util.isDate(new Date("2016-01-01T00:00:00+01:00"))).toEqual(true);

        expect(Util.isDate(Date.parse("2016-01-01T00:00:00+01:00"))).toEqual(false);
        expect(Util.isDate("2016-01-01T00:00:00+01:00")).toEqual(false);
    });

    it("defaultSelector", () => {
        expect(Util.defaultSelector(0)).toEqual(0);
        expect(Util.defaultSelector(1)).toEqual(1);
    });

    it("defaultComparer", () => {
        expect(Util.defaultComparer(1, 3)).toEqual(-1);
        expect(Util.defaultComparer(1, 2)).toEqual(-1);
        expect(Util.defaultComparer(1, 1)).toEqual(0);
        expect(Util.defaultComparer(2, 1)).toEqual(1);
        expect(Util.defaultComparer(3, 1)).toEqual(1);
    });

    it("defaultEqualityComparer", () => {
        expect(Util.defaultEqualityComparer(1, 2)).toEqual(false);
        expect(Util.defaultEqualityComparer(1, 1)).toEqual(true);
        expect(Util.defaultEqualityComparer(2, 1)).toEqual(false);
        expect(Util.defaultEqualityComparer(undefined, null)).toEqual(false);
        expect(Util.defaultEqualityComparer(true, false)).toEqual(false);
        expect(Util.defaultEqualityComparer(true, true)).toEqual(true);
    });

    it("defaultPredicate", () => {
        expect(Util.defaultPredicate(0)).toEqual(true);
        expect(Util.defaultPredicate(1)).toEqual(true);
        expect(Util.defaultPredicate(false)).toEqual(true);
        expect(Util.defaultPredicate(undefined)).toEqual(true);
    });
});
"use strict";
var Util = require("../src/util");
var chai_1 = require('chai');
describe("Util", function () {
    var x;
    it("isUndefined", function () {
        chai_1.expect(Util.isUndefined(x)).to.eql(true);
        chai_1.expect(Util.isUndefined(null)).to.eql(false);
        chai_1.expect(Util.isUndefined(undefined)).to.eql(true);
        chai_1.expect(Util.isUndefined(function () { })).to.eql(false);
        chai_1.expect(Util.isUndefined([])).to.eql(false);
        chai_1.expect(Util.isUndefined({})).to.eql(false);
        chai_1.expect(Util.isUndefined("")).to.eql(false);
        chai_1.expect(Util.isUndefined(0)).to.eql(false);
        chai_1.expect(Util.isUndefined(new Date("2016-01-01T00:00:00+01:00"))).to.eql(false);
    });
    it("isString", function () {
        chai_1.expect(Util.isString(x)).to.eql(false);
        chai_1.expect(Util.isString(null)).to.eql(false);
        chai_1.expect(Util.isString(undefined)).to.eql(false);
        chai_1.expect(Util.isString(function () { })).to.eql(false);
        chai_1.expect(Util.isString([])).to.eql(false);
        chai_1.expect(Util.isString({})).to.eql(false);
        chai_1.expect(Util.isString("")).to.eql(true);
        chai_1.expect(Util.isString(0)).to.eql(false);
        chai_1.expect(Util.isString(new Date("2016-01-01T00:00:00+01:00"))).to.eql(false);
        chai_1.expect(Util.isString("z")).to.eql(true);
        chai_1.expect(Util.isString(new String("a"))).to.eql(true);
    });
    it("isNumber", function () {
        chai_1.expect(Util.isNumber(x)).to.eql(false);
        chai_1.expect(Util.isNumber(null)).to.eql(false);
        chai_1.expect(Util.isNumber(undefined)).to.eql(false);
        chai_1.expect(Util.isNumber(function () { })).to.eql(false);
        chai_1.expect(Util.isNumber([])).to.eql(false);
        chai_1.expect(Util.isNumber({})).to.eql(false);
        chai_1.expect(Util.isNumber("")).to.eql(false);
        chai_1.expect(Util.isNumber(0)).to.eql(true);
        chai_1.expect(Util.isNumber(new Date("2016-01-01T00:00:00+01:00"))).to.eql(false);
        chai_1.expect(Util.isNumber(new Number(0))).to.eql(true);
    });
    it("isFunction", function () {
        chai_1.expect(Util.isFunction(x)).to.eql(false);
        chai_1.expect(Util.isFunction(null)).to.eql(false);
        chai_1.expect(Util.isFunction(undefined)).to.eql(false);
        chai_1.expect(Util.isFunction(function () { })).to.eql(true);
        chai_1.expect(Util.isFunction([])).to.eql(false);
        chai_1.expect(Util.isFunction({})).to.eql(false);
        chai_1.expect(Util.isFunction("")).to.eql(false);
        chai_1.expect(Util.isFunction(0)).to.eql(false);
        chai_1.expect(Util.isFunction(new Date("2016-01-01T00:00:00+01:00"))).to.eql(false);
    });
    it("isArray", function () {
        chai_1.expect(Util.isArray(x)).to.eql(false);
        chai_1.expect(Util.isArray(null)).to.eql(false);
        chai_1.expect(Util.isArray(undefined)).to.eql(false);
        chai_1.expect(Util.isArray(function () { })).to.eql(false);
        chai_1.expect(Util.isArray([])).to.eql(true);
        chai_1.expect(Util.isArray({})).to.eql(false);
        chai_1.expect(Util.isArray("")).to.eql(false);
        chai_1.expect(Util.isArray(0)).to.eql(false);
        chai_1.expect(Util.isArray(new Date("2016-01-01T00:00:00+01:00"))).to.eql(false);
        chai_1.expect(Util.isArray(new Array())).to.eql(true);
    });
    it("isDate", function () {
        chai_1.expect(Util.isDate(x)).to.eql(false);
        chai_1.expect(Util.isDate(null)).to.eql(false);
        chai_1.expect(Util.isDate(undefined)).to.eql(false);
        chai_1.expect(Util.isDate(function () { })).to.eql(false);
        chai_1.expect(Util.isDate([])).to.eql(false);
        chai_1.expect(Util.isDate({})).to.eql(false);
        chai_1.expect(Util.isDate("")).to.eql(false);
        chai_1.expect(Util.isDate(0)).to.eql(false);
        chai_1.expect(Util.isDate(new Date("2016-01-01T00:00:00+01:00"))).to.eql(true);
        chai_1.expect(Util.isDate(Date.parse("2016-01-01T00:00:00+01:00"))).to.eql(false);
        chai_1.expect(Util.isDate("2016-01-01T00:00:00+01:00")).to.eql(false);
    });
    it("defaultSelector", function () {
        chai_1.expect(Util.defaultSelector(0)).to.eql(0);
        chai_1.expect(Util.defaultSelector(1)).to.eql(1);
    });
    it("defaultComparer", function () {
        chai_1.expect(Util.defaultComparer(1, 3)).to.eql(-1);
        chai_1.expect(Util.defaultComparer(1, 2)).to.eql(-1);
        chai_1.expect(Util.defaultComparer(1, 1)).to.eql(0);
        chai_1.expect(Util.defaultComparer(2, 1)).to.eql(1);
        chai_1.expect(Util.defaultComparer(3, 1)).to.eql(1);
    });
    it("defaultEqualityComparer", function () {
        chai_1.expect(Util.defaultEqualityComparer(1, 2)).to.eql(false);
        chai_1.expect(Util.defaultEqualityComparer(1, 1)).to.eql(true);
        chai_1.expect(Util.defaultEqualityComparer(2, 1)).to.eql(false);
        chai_1.expect(Util.defaultEqualityComparer(undefined, null)).to.eql(false);
        chai_1.expect(Util.defaultEqualityComparer(true, false)).to.eql(false);
        chai_1.expect(Util.defaultEqualityComparer(true, true)).to.eql(true);
    });
    it("defaultPredicate", function () {
        chai_1.expect(Util.defaultPredicate(0)).to.eql(true);
        chai_1.expect(Util.defaultPredicate(1)).to.eql(true);
        chai_1.expect(Util.defaultPredicate(false)).to.eql(true);
        chai_1.expect(Util.defaultPredicate(undefined)).to.eql(true);
    });
});
//# sourceMappingURL=util.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var numbers_1 = require("../../src/helpers/numbers");
var chai_1 = require("chai");
describe("Numbers", function () {
    it("in", function () {
        chai_1.expect(numbers_1.default(4).in([1, 2, 3, 4, 5, 6])).to.eql(true);
        chai_1.expect(numbers_1.default(7).in([1, 2, 3, 4, 5, 6])).to.eql(false);
        chai_1.expect(numbers_1.NumbersHelper.in(4, [1, 2, 3, 4, 5, 6])).to.eql(true);
        chai_1.expect(numbers_1.NumbersHelper.in(7, [1, 2, 3, 4, 5, 6])).to.eql(false);
    });
    it("between", function () {
        chai_1.expect(numbers_1.default(0).between(1, 3)).to.eql(false);
        chai_1.expect(numbers_1.default(1).between(1, 3)).to.eql(true);
        chai_1.expect(numbers_1.default(2).between(1, 3)).to.eql(true);
        chai_1.expect(numbers_1.default(3).between(1, 3)).to.eql(true);
        chai_1.expect(numbers_1.default(4).between(1, 3)).to.eql(false);
        chai_1.expect(numbers_1.default(4).between(1)).to.eql(true);
        chai_1.expect(numbers_1.default(4).between(5)).to.eql(false);
        chai_1.expect(numbers_1.default(4).between()).to.eql(true);
        chai_1.expect(numbers_1.NumbersHelper.between(0, 1, 3)).to.eql(false);
        chai_1.expect(numbers_1.NumbersHelper.between(1, 1, 3)).to.eql(true);
        chai_1.expect(numbers_1.NumbersHelper.between(2, 1, 3)).to.eql(true);
        chai_1.expect(numbers_1.NumbersHelper.between(3, 1, 3)).to.eql(true);
        chai_1.expect(numbers_1.NumbersHelper.between(4, 1, 3)).to.eql(false);
        chai_1.expect(numbers_1.NumbersHelper.between(4, 1)).to.eql(true);
        chai_1.expect(numbers_1.NumbersHelper.between(4, 5)).to.eql(false);
        chai_1.expect(numbers_1.NumbersHelper.between(4)).to.eql(true);
    });
});
//# sourceMappingURL=numbers.spec.js.map
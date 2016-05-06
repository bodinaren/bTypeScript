(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../src/helpers/numbers"], factory);
    }
})(function (require, exports) {
    "use strict";
    var numbers_1 = require("../../src/helpers/numbers");
    describe("Numbers", function () {
        it("in", function () {
            expect(numbers_1.default(4).in([1, 2, 3, 4, 5, 6])).toEqual(true);
            expect(numbers_1.default(7).in([1, 2, 3, 4, 5, 6])).toEqual(false);
        });
        it("between", function () {
            expect(numbers_1.default(0).between(1, 3)).toEqual(false);
            expect(numbers_1.default(1).between(1, 3)).toEqual(true);
            expect(numbers_1.default(2).between(1, 3)).toEqual(true);
            expect(numbers_1.default(3).between(1, 3)).toEqual(true);
            expect(numbers_1.default(4).between(1, 3)).toEqual(false);
            expect(numbers_1.default(4).between(1)).toEqual(true);
            expect(numbers_1.default(4).between(5)).toEqual(false);
            expect(numbers_1.default(4).between()).toEqual(true);
        });
    });
});
//# sourceMappingURL=numbers.spec.js.map
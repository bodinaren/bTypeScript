(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../src/collections/stack"], factory);
    }
})(function (require, exports) {
    "use strict";
    var stack_1 = require("../../src/collections/stack");
    describe("Stack", function () {
        it("push", function () {
            var list = new stack_1.default();
            expect(list.push(6)).toEqual(1);
            expect(list.push(7)).toEqual(2);
            expect(list.push(8)).toEqual(3);
            expect(list.push(9)).toEqual(4);
            expect(list.length).toEqual(4);
        });
        it("pop", function () {
            var list = new stack_1.default();
            list.push(6);
            list.push(7);
            list.push(8);
            list.push(9);
            expect(list.pop()).toEqual(9);
            expect(list.pop()).toEqual(8);
            expect(list.pop()).toEqual(7);
            expect(list.pop()).toEqual(6);
            expect(list.length).toEqual(0);
        });
        it("peek", function () {
            var list = new stack_1.default();
            list.push(6);
            list.push(7);
            list.push(8);
            list.push(9);
            expect(list.peek()).toEqual(9);
            expect(list.length).toEqual(4);
        });
    });
});
//# sourceMappingURL=stack.spec.js.map
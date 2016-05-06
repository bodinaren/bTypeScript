(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../src/collections/linkedList"], factory);
    }
})(function (require, exports) {
    "use strict";
    var linkedList_1 = require("../../src/collections/linkedList");
    describe("LinkedList", function () {
        it("insert", function () {
            var list = new linkedList_1.default();
            expect(list.insert(6)).toEqual(1);
            expect(list.insert(7)).toEqual(2);
            expect(list.insert(8)).toEqual(3);
            expect(list.insert(9)).toEqual(4);
        });
        it("get", function () {
            var list = new linkedList_1.default();
            expect(list.get(0)).toEqual(undefined);
            list.insert(6);
            list.insert(7);
            list.insert(8);
            list.insert(9);
            expect(list.get(0)).toEqual(6);
            expect(list.get(1)).toEqual(7);
            expect(list.get(2)).toEqual(8);
            expect(list.get(3)).toEqual(9);
        });
        it("insertAt", function () {
            var list = new linkedList_1.default();
            expect(list.insertAt(2, 6)).toEqual(1);
            expect(list.insertAt(2, 7)).toEqual(2);
            expect(list.insertAt(2, 8)).toEqual(3);
            expect(list.insertAt(2, 9)).toEqual(4);
            expect(list.get(0)).toEqual(6);
            expect(list.get(1)).toEqual(7);
            expect(list.get(2)).toEqual(9);
            expect(list.get(3)).toEqual(8);
        });
        it("removeAt", function () {
            var list = new linkedList_1.default();
            list.insert(6);
            list.insert(7);
            list.insert(8);
            list.insert(9);
            expect(list.removeAt(1)).toEqual(3);
            expect(list.get(0)).toEqual(6);
            expect(list.get(1)).toEqual(8);
            expect(list.get(2)).toEqual(9);
        });
    });
});
//# sourceMappingURL=linkedList.spec.js.map
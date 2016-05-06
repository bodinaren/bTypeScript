(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../src/collections/list"], factory);
    }
})(function (require, exports) {
    "use strict";
    var list_1 = require("../../src/collections/list");
    describe("List", function () {
        it("toArray", function () {
            var arr = [1, 2, 3, 4, 5];
            expect(new list_1.default(arr).toArray()).toEqual([1, 2, 3, 4, 5]);
        });
        it("add", function () {
            var x = new list_1.default();
            x.add(1).add(2).add(3);
            expect(x.toArray()).toEqual([1, 2, 3]);
        });
        it("addRange", function () {
            var x = new list_1.default([1, 2, 3]);
            x.addRange([4, 5, 6]);
            expect(x.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
        });
        it("asReadOnly", function () {
            var x = new list_1.default([1, 2, 3]).asReadOnly();
            expect(x.count.bind(x, function (y) { return y == 1; })).not.toThrow();
            expect(x.add.bind(x)).toThrow();
        });
        it("indexOf", function () {
            var x = new list_1.default([1, 2, 3, 2, 1]);
            expect(x.indexOf(2)).toEqual(1);
            expect(x.indexOf(2, 1)).toEqual(1);
            expect(x.indexOf(2, 1, 2)).toEqual(1);
            expect(x.indexOf(2, 4)).toEqual(-1);
            expect(x.indexOf(2, 2, 1)).toEqual(-1);
        });
        it("lastIndexOf", function () {
            var x = new list_1.default([1, 2, 3, 2, 1]);
            expect(x.lastIndexOf(2)).toEqual(3);
            expect(x.lastIndexOf(2, 3)).toEqual(3);
            expect(x.lastIndexOf(2, 3, 2)).toEqual(3);
            expect(x.lastIndexOf(2, 0)).toEqual(-1);
            expect(x.lastIndexOf(2, 2, 1)).toEqual(-1);
        });
        it("insert", function () {
            var x = new list_1.default();
            x.insert(0, 1).insert(0, 2).insert(0, 3);
            expect(x.toArray()).toEqual([3, 2, 1]);
        });
        it("insertRange", function () {
            var x = new list_1.default([1, 2, 3]);
            x.insertRange(1, [4, 5, 6]);
            expect(x.toArray()).toEqual([1, 4, 5, 6, 2, 3]);
        });
        it("get/set", function () {
            var x = new list_1.default([1, 2, 3]);
            expect(x.get(2)).toEqual(3);
            x.set(2, 4);
            expect(x.get(2)).toEqual(4);
            expect(x.set.bind(x, 4, 5)).toThrow();
        });
        it("length", function () {
            var x = new list_1.default().add(1);
            expect(x.length).toEqual(1);
            x.insert(0, 1);
            expect(x.length).toEqual(2);
        });
        it("remove", function () {
            var x = new list_1.default([1, 2, 3, 2, 1]).remove(1);
            expect(x.toArray()).toEqual([2, 3, 2, 1]);
        });
        it("removeAt", function () {
            var x = new list_1.default([1, 2, 3, 2, 1]).removeAt(1);
            expect(x.toArray()).toEqual([1, 3, 2, 1]);
        });
        it("removeAll", function () {
            var x = new list_1.default([1, 2, 3, 2, 1]).removeAll(function (x) { return x == 1; });
            expect(x.toArray()).toEqual([2, 3, 2]);
        });
        it("removeRange", function () {
            var x = new list_1.default([1, 2, 3, 4, 5]).removeRange(1, 3);
            expect(x.toArray()).toEqual([1, 5]);
        });
        it("clear", function () {
            var x = new list_1.default([1, 2, 3, 2, 1]).clear();
            expect(x.length).toEqual(0);
        });
        it("reverse", function () {
            var x = new list_1.default([1, 2, 3, 4, 5]);
            x.reverse();
            expect(x.toArray()).toEqual([5, 4, 3, 2, 1]);
            x.reverse(1);
            expect(x.toArray()).toEqual([5, 1, 2, 3, 4]);
            x.reverse(1, 3);
            expect(x.toArray()).toEqual([5, 3, 2, 1, 4]);
        });
    });
});
//# sourceMappingURL=list.spec.js.map
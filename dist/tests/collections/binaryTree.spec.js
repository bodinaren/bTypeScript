(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../src/collections/binaryTree"], factory);
    }
})(function (require, exports) {
    "use strict";
    var binaryTree_1 = require("../../src/collections/binaryTree");
    describe("BinaryTree", function () {
        var defaultTree;
        beforeEach(function () {
            defaultTree = new binaryTree_1.default();
            defaultTree.insert(4);
            defaultTree.insert(2);
            defaultTree.insert(6);
            defaultTree.insert(1);
            defaultTree.insert(3);
            defaultTree.insert(5);
            defaultTree.insert(7);
        });
        it("length", function () {
            expect(defaultTree.length).toEqual(7);
        });
        it("contains", function () {
            expect(defaultTree.contains(3)).toEqual(true);
        });
        it("forEach", function () {
            var sum = 0;
            defaultTree.forEach(function (item) { sum += item; });
            expect(sum).toEqual(28);
            sum = 0;
            defaultTree.forEach(function (item) {
                sum += item;
                if (item == 5)
                    return false;
            });
            expect(sum).toEqual(15);
        });
        it("toArray", function () {
            var arr = defaultTree.toArray();
            expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7]);
        });
        it("preorderTraversal", function () {
            var arr = [];
            defaultTree.preorderTraversal(function (item) { arr.push(item); });
            expect(arr).toEqual([4, 2, 1, 3, 6, 5, 7]);
            arr = [];
            defaultTree.preorderTraversal(function (item) {
                arr.push(item);
                if (item == 5)
                    return false;
            });
            expect(arr).toEqual([4, 2, 1, 3, 6, 5]);
        });
        it("inorderTraversal", function () {
            var arr = [];
            defaultTree.inorderTraversal(function (item) { arr.push(item); });
            expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7]);
            arr = [];
            defaultTree.inorderTraversal(function (item) {
                arr.push(item);
                if (item == 5)
                    return false;
            });
            expect(arr).toEqual([1, 2, 3, 4, 5]);
        });
        it("postorderTraversal", function () {
            var arr = [];
            defaultTree.postorderTraversal(function (item) { arr.push(item); });
            expect(arr).toEqual([1, 3, 2, 5, 7, 6, 4]);
            arr = [];
            defaultTree.postorderTraversal(function (item) {
                arr.push(item);
                if (item == 5)
                    return false;
            });
            expect(arr).toEqual([1, 3, 2, 5]);
        });
        it("levelTraversal", function () {
            var arr = [];
            defaultTree.levelTraversal(function (item) { arr.push(item); });
            expect(arr).toEqual([4, 2, 6, 1, 3, 5, 7]);
            arr = [];
            defaultTree.levelTraversal(function (item) {
                arr.push(item);
                if (item == 5)
                    return false;
            });
            expect(arr).toEqual([4, 2, 6, 1, 3, 5]);
        });
        describe("remove", function () {
            it("leaf", function () {
                var arr = [];
                defaultTree.remove(1);
                defaultTree.preorderTraversal(function (item) { arr.push(item); });
                expect(arr).toEqual([4, 2, 3, 6, 5, 7]);
                arr = [];
                defaultTree.remove(7);
                defaultTree.preorderTraversal(function (item) { arr.push(item); });
                expect(arr).toEqual([4, 2, 3, 6, 5]);
            });
            it("root in perfect tree", function () {
                var arr = [];
                defaultTree.remove(4);
                defaultTree.preorderTraversal(function (item) { arr.push(item); });
                expect(arr).toEqual([6, 2, 1, 3, 7, 5]);
            });
        });
        it("min", function () {
            expect(defaultTree.min()).toEqual(1);
        });
        it("max", function () {
            expect(defaultTree.max()).toEqual(7);
        });
        it("depth", function () {
            var emptyTree = new binaryTree_1.default(), shallowTree = new binaryTree_1.default();
            shallowTree.insert(1);
            expect(defaultTree.depth()).toEqual(2);
            expect(emptyTree.depth()).toEqual(-1);
            expect(shallowTree.depth()).toEqual(0);
        });
    });
});
//# sourceMappingURL=binaryTree.spec.js.map
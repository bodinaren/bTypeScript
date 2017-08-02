"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var binaryTree_1 = require("../../src/collections/binaryTree");
var chai_1 = require("chai");
describe("BinaryTree", function () {
    var defaultTree;
    beforeEach(function () {
        defaultTree = new binaryTree_1.default();
        // defaultTree.insert(4);
        // defaultTree.insert(2);
        // defaultTree.insert(6);
        // defaultTree.insert(1);
        // defaultTree.insert(3);
        // defaultTree.insert(5);
        // defaultTree.insert(7);
        defaultTree.insertRange([4, 2, 6, 1, 3, 5, 7]);
        //      __4__
        //     /     \
        //    2       6
        //   / \     / \
        //  1   3   5   7
    });
    it("length", function () {
        chai_1.expect(defaultTree.length).to.eql(7);
    });
    it("prevent duplicates", function () {
        // no two same numbers can exist in a binary tree, so this 4 should not actually be inserted
        defaultTree.insert(4);
        chai_1.expect(defaultTree.length).to.eql(7);
    });
    it("contains", function () {
        chai_1.expect(defaultTree.contains(3)).to.eql(true);
    });
    //it("remove", function() {
    //    expect(defaultTree.contains(3)).to.eql(true);
    //});
    it("forEach", function () {
        var sum = 0;
        defaultTree.forEach(function (item) { sum += item; });
        chai_1.expect(sum).to.eql(28);
        sum = 0;
        defaultTree.forEach(function (item) {
            sum += item;
            if (item == 5)
                return false;
        });
        chai_1.expect(sum).to.eql(15);
    });
    it("toArray", function () {
        var arr = defaultTree.toArray();
        chai_1.expect(arr).to.eql([1, 2, 3, 4, 5, 6, 7]);
    });
    it("preorderTraversal", function () {
        var arr = [];
        defaultTree.preorderTraversal(function (item) { arr.push(item); });
        chai_1.expect(arr).to.eql([4, 2, 1, 3, 6, 5, 7]);
        arr = [];
        defaultTree.preorderTraversal(function (item) {
            arr.push(item);
            if (item == 5)
                return false;
        });
        chai_1.expect(arr).to.eql([4, 2, 1, 3, 6, 5]);
    });
    it("inorderTraversal", function () {
        var arr = [];
        defaultTree.inorderTraversal(function (item) { arr.push(item); });
        chai_1.expect(arr).to.eql([1, 2, 3, 4, 5, 6, 7]);
        arr = [];
        defaultTree.inorderTraversal(function (item) {
            arr.push(item);
            if (item == 5)
                return false;
        });
        chai_1.expect(arr).to.eql([1, 2, 3, 4, 5]);
    });
    it("postorderTraversal", function () {
        var arr = [];
        defaultTree.postorderTraversal(function (item) { arr.push(item); });
        chai_1.expect(arr).to.eql([1, 3, 2, 5, 7, 6, 4]);
        arr = [];
        defaultTree.postorderTraversal(function (item) {
            arr.push(item);
            if (item == 5)
                return false;
        });
        chai_1.expect(arr).to.eql([1, 3, 2, 5]);
    });
    it("levelTraversal", function () {
        var arr = [];
        defaultTree.levelTraversal(function (item) { arr.push(item); });
        chai_1.expect(arr).to.eql([4, 2, 6, 1, 3, 5, 7]);
        arr = [];
        defaultTree.levelTraversal(function (item) {
            arr.push(item);
            if (item == 5)
                return false;
        });
        chai_1.expect(arr).to.eql([4, 2, 6, 1, 3, 5]);
    });
    describe("remove", function () {
        it("leaf", function () {
            var arr = [];
            defaultTree.remove(1); // remove a left child
            defaultTree.preorderTraversal(function (item) { arr.push(item); });
            chai_1.expect(arr).to.eql([4, 2, 3, 6, 5, 7]);
            arr = [];
            defaultTree.remove(7); // remove a right child
            defaultTree.preorderTraversal(function (item) { arr.push(item); });
            chai_1.expect(arr).to.eql([4, 2, 3, 6, 5]);
        });
        it("root in perfect tree", function () {
            var arr = [];
            defaultTree.remove(4);
            defaultTree.preorderTraversal(function (item) { arr.push(item); });
            chai_1.expect(arr).to.eql([6, 2, 1, 3, 7, 5]);
        });
        it("root is leaf", function () {
            var tree = new binaryTree_1.default();
            tree.insert(4);
            var arr = [];
            tree.remove(4);
            tree.preorderTraversal(function (item) { arr.push(item); });
            chai_1.expect(arr).to.eql([]);
        });
        //it("root in non-perfect tree", function() {
        //    var arr = [];
        //    defaultTree.remove(7); // make non-perfect tree.
        //    defaultTree.remove(4);
        //    defaultTree.preorderTraversal(item => { arr.push(item) });
        //    expect(arr).to.eql([6, 2, 1, 3, 5]);
        //});
        //it("child in perfect tree", function() {
        //    var arr = [];
        //    defaultTree.remove(4);
        //    defaultTree.preorderTraversal(item => { arr.push(item) });
        //    expect(arr).to.eql([6, 2, 1, 3, 7, 5]);
        //});
    });
    it("min", function () {
        chai_1.expect(defaultTree.min()).to.eql(1);
    });
    it("max", function () {
        chai_1.expect(defaultTree.max()).to.eql(7);
    });
    it("depth", function () {
        var emptyTree = new binaryTree_1.default(), shallowTree = new binaryTree_1.default();
        shallowTree.insert(1);
        chai_1.expect(defaultTree.depth()).to.eql(2);
        chai_1.expect(emptyTree.depth()).to.eql(-1);
        chai_1.expect(shallowTree.depth()).to.eql(0);
    });
});
//# sourceMappingURL=binaryTree.spec.js.map
/// <reference path="../../typings/main.d.ts" />
"use strict";
var linkedList_1 = require("../../src/collections/linkedList");
var chai_1 = require('chai');
describe("LinkedList", function () {
    it("insert", function () {
        var list = new linkedList_1.default();
        chai_1.expect(list.insert(6)).to.eql(1);
        chai_1.expect(list.insert(7)).to.eql(2);
        chai_1.expect(list.insert(8)).to.eql(3);
        chai_1.expect(list.insert(9)).to.eql(4);
    });
    it("get", function () {
        var list = new linkedList_1.default();
        chai_1.expect(list.get(0)).to.eql(undefined);
        list.insert(6);
        list.insert(7);
        list.insert(8);
        list.insert(9);
        chai_1.expect(list.get(0)).to.eql(6);
        chai_1.expect(list.get(1)).to.eql(7);
        chai_1.expect(list.get(2)).to.eql(8);
        chai_1.expect(list.get(3)).to.eql(9);
    });
    it("insertAt", function () {
        var list = new linkedList_1.default();
        chai_1.expect(list.insertAt(2, 6)).to.eql(1);
        chai_1.expect(list.insertAt(2, 7)).to.eql(2);
        chai_1.expect(list.insertAt(2, 8)).to.eql(3);
        chai_1.expect(list.insertAt(2, 9)).to.eql(4);
        chai_1.expect(list.get(0)).to.eql(6);
        chai_1.expect(list.get(1)).to.eql(7);
        chai_1.expect(list.get(2)).to.eql(9);
        chai_1.expect(list.get(3)).to.eql(8);
    });
    it("removeAt", function () {
        var list = new linkedList_1.default();
        list.insert(6);
        list.insert(7);
        list.insert(8);
        list.insert(9);
        chai_1.expect(list.removeAt(1)).to.eql(3);
        chai_1.expect(list.get(0)).to.eql(6);
        chai_1.expect(list.get(1)).to.eql(8);
        chai_1.expect(list.get(2)).to.eql(9);
    });
});
//# sourceMappingURL=linkedList.spec.js.map
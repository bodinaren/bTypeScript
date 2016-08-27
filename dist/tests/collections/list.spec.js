/// <reference path="../../typings/main.d.ts" />
"use strict";
var list_1 = require("../../src/collections/list");
var chai_1 = require('chai');
describe("List", function () {
    it("toArray", function () {
        var arr = [1, 2, 3, 4, 5];
        chai_1.expect(new list_1.default(arr).toArray()).to.eql([1, 2, 3, 4, 5]);
    });
    it("add", function () {
        var x = new list_1.default();
        x.add(1).add(2).add(3);
        chai_1.expect(x.toArray()).to.eql([1, 2, 3]);
    });
    it("addRange", function () {
        var x = new list_1.default([1, 2, 3]);
        x.addRange([4, 5, 6]);
        chai_1.expect(x.toArray()).to.eql([1, 2, 3, 4, 5, 6]);
    });
    it("asReadOnly", function () {
        var x = new list_1.default([1, 2, 3]).asReadOnly(), fn1 = x.count.bind(x, function (y) { return y == 1; }), fn2 = x.add.bind(x);
        chai_1.expect(fn1).not.to.throw();
        chai_1.expect(fn2).to.throw();
    });
    it("indexOf", function () {
        var x = new list_1.default([1, 2, 3, 2, 1]);
        chai_1.expect(x.indexOf(2)).to.eql(1);
        chai_1.expect(x.indexOf(2, 1)).to.eql(1);
        chai_1.expect(x.indexOf(2, 1, 2)).to.eql(1);
        chai_1.expect(x.indexOf(2, 4)).to.eql(-1);
        chai_1.expect(x.indexOf(2, 2, 1)).to.eql(-1);
    });
    it("lastIndexOf", function () {
        var x = new list_1.default([1, 2, 3, 2, 1]);
        chai_1.expect(x.lastIndexOf(2)).to.eql(3);
        chai_1.expect(x.lastIndexOf(2, 3)).to.eql(3);
        chai_1.expect(x.lastIndexOf(2, 3, 2)).to.eql(3);
        chai_1.expect(x.lastIndexOf(2, 0)).to.eql(-1);
        chai_1.expect(x.lastIndexOf(2, 2, 1)).to.eql(-1);
    });
    it("insert", function () {
        var x = new list_1.default();
        x.insert(0, 1).insert(0, 2).insert(0, 3);
        chai_1.expect(x.toArray()).to.eql([3, 2, 1]);
    });
    it("insertRange", function () {
        var x = new list_1.default([1, 2, 3]);
        x.insertRange(1, [4, 5, 6]);
        chai_1.expect(x.toArray()).to.eql([1, 4, 5, 6, 2, 3]);
    });
    it("get/set", function () {
        var x = new list_1.default([1, 2, 3]);
        chai_1.expect(x.get(2)).to.eql(3);
        x.set(2, 4);
        chai_1.expect(x.get(2)).to.eql(4);
        x.set.bind(x, 4, 5);
        chai_1.expect(x.set).to.throw();
    });
    it("length", function () {
        var x = new list_1.default().add(1);
        chai_1.expect(x.length).to.eql(1);
        x.insert(0, 1);
        chai_1.expect(x.length).to.eql(2);
    });
    it("remove", function () {
        var x = new list_1.default([1, 2, 3, 2, 1]).remove(1);
        chai_1.expect(x.toArray()).to.eql([2, 3, 2, 1]);
    });
    it("removeAt", function () {
        var x = new list_1.default([1, 2, 3, 2, 1]).removeAt(1);
        chai_1.expect(x.toArray()).to.eql([1, 3, 2, 1]);
    });
    it("removeAll", function () {
        var x = new list_1.default([1, 2, 3, 2, 1]).removeAll(function (x) { return x == 1; });
        chai_1.expect(x.toArray()).to.eql([2, 3, 2]);
    });
    it("removeRange", function () {
        var x = new list_1.default([1, 2, 3, 4, 5]).removeRange(1, 3);
        chai_1.expect(x.toArray()).to.eql([1, 5]);
    });
    it("clear", function () {
        var x = new list_1.default([1, 2, 3, 2, 1]).clear();
        chai_1.expect(x.length).to.eql(0);
    });
    //it("count", function() {
    //    var x = new List([1, 2, 3, 2, 1]);
    //    expect(x.count()).to.eql(5);
    //    expect(x.count(x => x == 1)).to.eql(2);
    //    expect(x.count(x => x == 3)).to.eql(1);
    //});
    it("reverse", function () {
        var x = new list_1.default([1, 2, 3, 4, 5]);
        x.reverse();
        chai_1.expect(x.toArray()).to.eql([5, 4, 3, 2, 1]);
        x.reverse(1);
        chai_1.expect(x.toArray()).to.eql([5, 1, 2, 3, 4]);
        x.reverse(1, 3);
        chai_1.expect(x.toArray()).to.eql([5, 3, 2, 1, 4]);
    });
    it("range", function () {
        chai_1.expect(list_1.default.range(1, 5).toArray()).to.eql([1, 2, 3, 4, 5]);
        chai_1.expect(list_1.default.range(5, 5).toArray()).to.eql([5, 6, 7, 8, 9]);
    });
});
//# sourceMappingURL=list.spec.js.map
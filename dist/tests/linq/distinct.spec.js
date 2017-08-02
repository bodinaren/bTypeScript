"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var linq_1 = require("../../src/linq");
var TestItems = require("./testitems");
describe("ExceptIterator", function () {
    it("default comparer", function () {
        var x = [1, 2, 3, 2, 1];
        var iterator = new linq_1.DistinctIterator(x);
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql(1, "1st should be 1");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2nd should NOT be done");
        chai_1.expect(n.value).to.eql(2, "2nd should be 2");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "3rd should NOT be done");
        chai_1.expect(n.value).to.eql(3, "3rd should be 3");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "4th should be done");
        chai_1.expect(n.value).to.equal(undefined, "4th should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
    describe("with comparer", function () {
        var fn = function (x, y) { return x.last === y.last; };
        var iterator = new linq_1.DistinctIterator(TestItems.objects, fn);
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.kalle, "1st should be kalle:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2md should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.musse, "2nd should be musse:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "3rd should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.långben, "3rd should be långben:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "4th should be done");
        chai_1.expect(n.value).to.equal(undefined, "4th should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
//# sourceMappingURL=distinct.spec.js.map
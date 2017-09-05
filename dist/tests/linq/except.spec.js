"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var iterator_1 = require("../../src/linq/iterator/iterator");
var except_1 = require("../../src/linq/iterator/except");
var TestItems = require("./testitems");
describe("ExceptIterator", function () {
    it("default comparer", function () {
        var x = [0, 1, 2, 3], y = [2, 3, 4, 5];
        var iterator = new except_1.ExceptIterator(x, y);
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql(0, "1st should be 0");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2nd should NOT be done");
        chai_1.expect(n.value).to.eql(1, "2nd should be 1");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "3rd should be done");
        chai_1.expect(n.value).to.equal(undefined, "3rd should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
    it("with comparer", function () {
        var fn = function (x, y) { return x.last === y.last; };
        var x = TestItems.objects.slice(0, 3), y = TestItems.objects.slice(2);
        var iterator = new except_1.ExceptIterator(x, y, fn);
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.musse, "1st should be musse:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "2nd should be done");
        chai_1.expect(n.value).to.equal(undefined, "2nd should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
    it("default another iterator", function () {
        var x = [0, 1, 2, 3], y = [2, 3, 4, 5];
        var iterator = new except_1.ExceptIterator(x, new iterator_1.BaseIterator(y));
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql(0, "1st should be 0");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2nd should NOT be done");
        chai_1.expect(n.value).to.eql(1, "2nd should be 1");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "3rd should be done");
        chai_1.expect(n.value).to.equal(undefined, "3rd should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
//# sourceMappingURL=except.spec.js.map
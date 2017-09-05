"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var zip_1 = require("../../src/linq/iterator/zip");
var TestItems = require("./testitems");
describe("ZipIterator", function () {
    it("Full array when arrays are equal length", function () {
        var iterator = new zip_1.ZipIterator(TestItems.strings, TestItems.objects, function (str, obj) {
            return { first: str, last: obj.last };
        });
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.kalle, "1st should be kalle:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2nd should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.musse, "2nd should be musse:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "3rd should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.långben, "3rd should be långben:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "4th should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.mimmi, "4th should be mimmi:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "5th should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.joakim, "5th should be joakim:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "6th should be done");
        chai_1.expect(n.value).to.equal(undefined, "6th should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
    it("Stops when 'source' runs out of items", function () {
        var iterator = new zip_1.ZipIterator(TestItems.strings.slice(0, 2), TestItems.objects, function (str, obj) {
            return { first: str, last: obj.last };
        });
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.kalle, "1st should be kalle:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2nd should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.musse, "2nd should be musse:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "3rd should be done");
        chai_1.expect(n.value).to.equal(undefined, "3rd should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
    it("Stops when 'other' runs out of items", function () {
        var iterator = new zip_1.ZipIterator(TestItems.strings, TestItems.objects.slice(0, 2), function (str, obj) {
            return { first: str, last: obj.last };
        });
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.kalle, "1st should be kalle:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2nd should NOT be done");
        chai_1.expect(n.value).to.eql(TestItems.musse, "2nd should be musse:");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "3rd should be done");
        chai_1.expect(n.value).to.equal(undefined, "3rd should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
//# sourceMappingURL=zip.spec.js.map
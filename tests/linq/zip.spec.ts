import {expect} from 'chai';
import {IteratorResult} from "../../src/linq/iterator/iterator";
import {ZipIterator} from "../../src/linq/iterator/zip";
import * as TestItems from "./testitems";

describe("ZipIterator", function() {
    it("Full array when arrays are equal length", function () {
        var iterator = new ZipIterator(TestItems.strings, TestItems.objects, (str, obj) => {
            return { first: str, last: obj.last }
        });
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(TestItems.kalle, "1st should be kalle:");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(TestItems.musse, "2nd should be musse:");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql(TestItems.långben, "3rd should be långben:");

        n = iterator.next();
        expect(n.done).to.equal(false, "4th should NOT be done");
        expect(n.value).to.eql(TestItems.mimmi, "4th should be mimmi:");

        n = iterator.next();
        expect(n.done).to.equal(false, "5th should NOT be done");
        expect(n.value).to.eql(TestItems.joakim, "5th should be joakim:");

        n = iterator.next();
        expect(n.done).to.equal(true, "6th should be done");
        expect(n.value).to.equal(undefined, "6th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("Stops when 'source' runs out of items", function () {
        var iterator = new ZipIterator(TestItems.strings.slice(0, 2), TestItems.objects, (str, obj) => {
            return { first: str, last: obj.last }
        });
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(TestItems.kalle, "1st should be kalle:");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(TestItems.musse, "2nd should be musse:");

        n = iterator.next();
        expect(n.done).to.equal(true, "3rd should be done");
        expect(n.value).to.equal(undefined, "3rd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("Stops when 'other' runs out of items", function () {
        var iterator = new ZipIterator(TestItems.strings, TestItems.objects.slice(0, 2), (str, obj) => {
            return { first: str, last: obj.last }
        });
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(TestItems.kalle, "1st should be kalle:");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(TestItems.musse, "2nd should be musse:");

        n = iterator.next();
        expect(n.done).to.equal(true, "3rd should be done");
        expect(n.value).to.equal(undefined, "3rd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});

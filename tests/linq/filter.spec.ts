import {expect} from 'chai';
import {FilterIterator, IteratorResult} from "../../src/linq";
import * as TestItems from "./testitems";

describe("FilterIterator", function() {
    it("Last name anka,", function () {
        var iterator = new FilterIterator(TestItems.objects, x => x.last == "anka");
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(TestItems.kalle, "3rd should be kalle:");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(TestItems.mimmi, "3rd should be mimmi:");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql(TestItems.joakim, "3rd should be joakim:");

        n = iterator.next();
        expect(n.done).to.equal(true, "4th should be done");
        expect(n.value).to.equal(undefined, "4th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "1st should be undefined");
    });
    
    it("default comparer,", function () {
        var iterator = new FilterIterator(TestItems.objects);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(TestItems.kalle, "3rd should be kalle:");

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
        expect(n.value).to.equal(undefined, "1st should be undefined");
    });
});

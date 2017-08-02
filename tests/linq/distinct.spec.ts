import {expect} from 'chai';
import {DistinctIterator, IteratorResult} from "../../src/linq";
import * as TestItems from "./testitems";

describe("ExceptIterator", function() {
    it("default comparer", function () {

        var x = [1, 2, 3, 2, 1];

        var iterator = new DistinctIterator(x);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(1, "1st should be 1");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(2, "2nd should be 2");
        
        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql(3, "3rd should be 3");
        
        n = iterator.next();
        expect(n.done).to.equal(true, "4th should be done");
        expect(n.value).to.equal(undefined, "4th should be undefined");
        
        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    describe("with comparer", function () {
        var fn = function (x, y) { return x.last === y.last };

        var iterator = new DistinctIterator(TestItems.objects, fn);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(TestItems.kalle, "1st should be kalle:");
        
        n = iterator.next();
        expect(n.done).to.equal(false, "2md should NOT be done");
        expect(n.value).to.eql(TestItems.musse, "2nd should be musse:");
        
        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql(TestItems.långben, "3rd should be långben:");
        
        n = iterator.next();
        expect(n.done).to.equal(true, "4th should be done");
        expect(n.value).to.equal(undefined, "4th should be undefined");
        
        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});

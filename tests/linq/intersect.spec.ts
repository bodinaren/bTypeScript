import {expect} from 'chai';
import {BaseIterator, IteratorResult} from "../../src/linq/iterator/iterator";
import {IntersectIterator} from "../../src/linq/iterator/intersect";
import * as TestItems from "./testitems";

describe("IntersectIterator", function() {
    it("default comparer", function () {

        var x = [0, 1, 2, 3],
            y = [2, 3, 4, 5]

        var iterator = new IntersectIterator(x, y);
        var n: IteratorResult<any>;
    
        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(2, "1st should be 2");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(3, "2nd should be 3");

        n = iterator.next();
        expect(n.done).to.equal(true, "3rd should be done");
        expect(n.value).to.equal(undefined, "3rd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("with comparer", function () {
        var fn = function (x, y) { return x.last === y.last };

        var x = TestItems.objects.slice(0, 3),
            y = TestItems.objects.slice(2);

        var iterator = new IntersectIterator(x, y, fn);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(TestItems.kalle, "1st should be kalle:");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(TestItems.långben, "2nd should be långben:");

        n = iterator.next();
        expect(n.done).to.equal(true, "3rd should be done");
        expect(n.value).to.equal(undefined, "3rd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("default another iterator", function () {

        var x = [0, 1, 2, 3],
            y = [2, 3, 4, 5]

        var iterator = new IntersectIterator(x, new BaseIterator(y));
        var n: IteratorResult<any>;
    
        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(2, "1st should be 2");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(3, "2nd should be 3");

        n = iterator.next();
        expect(n.done).to.equal(true, "3rd should be done");
        expect(n.value).to.equal(undefined, "3rd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});

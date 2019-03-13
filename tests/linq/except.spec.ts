import {expect} from 'chai';
import {BaseIterator, IteratorResult} from "../../src/linq/iterator/iterator";
import {ExceptIterator} from "../../src/linq/iterator/except";
import * as TestItems from "./testitems";

describe("ExceptIterator", function() {
    it("default comparer", function () {

        var x = [0, 1, 2, 3],
            y = [2, 3, 4, 5]

        var iterator = new ExceptIterator(x, y);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(0, "1st should be 0");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(1, "2nd should be 1");

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

        var iterator = new ExceptIterator(x, y, fn);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(TestItems.musse, "1st should be musse:");

        n = iterator.next();
        expect(n.done).to.equal(true, "2nd should be done");
        expect(n.value).to.equal(undefined, "2nd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
    
    it("default another iterator", function () {
        var x = [0, 1, 2, 3],
            y = [2, 3, 4, 5]

        var iterator = new ExceptIterator(x, new BaseIterator(y));
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(0, "1st should be 0");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(1, "2nd should be 1");

        n = iterator.next();
        expect(n.done).to.equal(true, "3rd should be done");
        expect(n.value).to.equal(undefined, "3rd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});

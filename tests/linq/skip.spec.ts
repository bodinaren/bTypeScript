import {expect} from 'chai';
import {IteratorResult} from "../../src/linq/iterator/iterator";
import {SkipIterator} from "../../src/linq/iterator/skip";
import * as TestItems from "./testitems";

describe("SkipIterator", function() {
    it("skip 2,", function () {
        var iterator = new SkipIterator(TestItems.numbers, 7);
        var n: IteratorResult<any>;
        
        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(5, "1st should be 5");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(3, "2nd should be 3");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql(1, "3rd should be 1");

        n = iterator.next();
        expect(n.done).to.equal(true, "4th should be done");
        expect(n.value).to.equal(undefined, "4th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
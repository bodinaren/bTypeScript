import {expect} from 'chai';
import {SkipWhileIterator, IteratorResult} from "../../src/linq";
import * as TestItems from "./testitems";

describe("SkipWhileIterator", function () {
    it("with predicate", function() {
        var iterator = new SkipWhileIterator(TestItems.numbers, x => x != 7);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(7, "1st should be 7");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(5, "2nd should be 5");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql(3, "3rd should be 3");

        n = iterator.next();
        expect(n.done).to.equal(false, "4th should NOT be done");
        expect(n.value).to.eql(1, "4th should be 1");

        n = iterator.next();
        expect(n.done).to.equal(true, "5th should be done");
        expect(n.value).to.equal(undefined, "5th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("without predicate", function() {
        var iterator = new SkipWhileIterator(TestItems.numbers);
        var n: IteratorResult<any>;
        
        n = iterator.next();
        expect(n.done).to.equal(true, "1st should be done");
        expect(n.value).to.equal(undefined, "1st should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
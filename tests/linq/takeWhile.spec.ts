import {expect} from 'chai';
import {IteratorResult} from "../../src/linq/iterator/iterator";
import {TakeWhileIterator} from "../../src/linq/iterator/takeWhile";
import * as TestItems from "./testitems";

describe("TakeWhileIterator", function () {
    it("with predicate,", function() {
        var iterator = new TakeWhileIterator(TestItems.numbers, x => x < 6);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(0, "1st should be 0");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(2, "2nd should be 2");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql(4, "3rd should be 4");

        n = iterator.next();
        expect(n.done).to.equal(true, "4th should be done");
        expect(n.value).to.equal(undefined, "4th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("without predicate", function() {
        var iterator = new TakeWhileIterator(TestItems.numbers);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(0, "1st should be 0");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(2, "2nd should be 2");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql(4, "3rd should be 4");

        n = iterator.next();
        expect(n.done).to.equal(false, "4th should NOT be done");
        expect(n.value).to.eql(6, "4th should be 6");

        n = iterator.next();
        expect(n.done).to.equal(false, "5th should NOT be done");
        expect(n.value).to.eql(8, "5th should be 8");

        n = iterator.next();
        expect(n.done).to.equal(false, "6th should NOT be done");
        expect(n.value).to.eql(9, "1st should be 9");

        n = iterator.next();
        expect(n.done).to.equal(false, "7th should NOT be done");
        expect(n.value).to.eql(7, "2nd should be 7");

        n = iterator.next();
        expect(n.done).to.equal(false, "8th should NOT be done");
        expect(n.value).to.eql(5, "3rd should be 5");

        n = iterator.next();
        expect(n.done).to.equal(false, "9th should NOT be done");
        expect(n.value).to.eql(3, "4th should be 3");

        n = iterator.next();
        expect(n.done).to.equal(false, "10th should NOT be done");
        expect(n.value).to.eql(1, "5th should be 1");

        n = iterator.next();
        expect(n.done).to.equal(true, "11th should be done");
        expect(n.value).to.equal(undefined, "11th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("don't break on undefined,", function() {
        var numbers = TestItems.numbers.slice();
        numbers.splice(2, 0, undefined);

        var iterator = new TakeWhileIterator(numbers, x => x < 8 || typeof x === "undefined");
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(0, "1st should be 0");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(2, "2nd should be 2");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql(undefined, "3rd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(false, "4th should NOT be done");
        expect(n.value).to.eql(4, "4th should be 4");

        n = iterator.next();
        expect(n.done).to.equal(false, "5th should NOT be done");
        expect(n.value).to.eql(6, "5th should be 6");

        n = iterator.next();
        expect(n.done).to.equal(true, "6th should be done");
        expect(n.value).to.equal(undefined, "6th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
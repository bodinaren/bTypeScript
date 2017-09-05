import {expect} from 'chai';
import {IteratorResult} from "../../src/linq/iterator/iterator";
import {TakeIterator} from "../../src/linq/iterator/take";
import * as TestItems from "./testitems";

describe("TakeIterator", function() {
    it("take 2,", function () {
        var iterator = new TakeIterator(TestItems.numbers, 2);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql(0, "1st should be 0");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql(2, "2nd should be 2");

        n = iterator.next();
        expect(n.done).to.equal(true, "3rd should be done");
        expect(n.value).to.equal(undefined, "3rd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
import {expect} from 'chai';
import {MapIterator, IteratorResult} from "../../src/linq";
import * as TestItems from "./testitems";

describe("MapIterator", function() {
    it("First letter of names", function () {
        var iterator = new MapIterator(TestItems.strings, x => x[0]);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql("k", "1st should be 'k'");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql("m", "2nd should be 'm'");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql("l", "3rd should be 'l'");

        n = iterator.next();
        expect(n.done).to.equal(false, "4th should NOT be done");
        expect(n.value).to.eql("m", "4th should be 'm'");

        n = iterator.next();
        expect(n.done).to.equal(false, "5th should NOT be done");
        expect(n.value).to.eql("j", "5th should be 'j'");

        n = iterator.next();
        expect(n.done).to.equal(true, "6th should be done");
        expect(n.value).to.equal(undefined, "6th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});

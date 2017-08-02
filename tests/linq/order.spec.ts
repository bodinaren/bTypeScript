import {expect} from 'chai';
import {OrderIterator, IteratorResult} from "../../src/linq";
import * as Util from "../../src/util";
import * as TestItems from "./testitems";

describe("OrderIterator", function() {
    describe("OrderBy", function () {
        it("ascending firstname,", function() {
            var iterator = new OrderIterator(TestItems.objects, x => x.first);
            var n: IteratorResult<any>;

            n = iterator.next();
            expect(n.done).to.equal(false, "1st should NOT be done");
            expect(n.value).to.eql(TestItems.joakim, "1st should be joakim:");

            n = iterator.next();
            expect(n.done).to.equal(false, "2nd should NOT be done");
            expect(n.value).to.eql(TestItems.kalle, "2nd should be kalle:");

            n = iterator.next();
            expect(n.done).to.equal(false, "3rd should NOT be done");
            expect(n.value).to.eql(TestItems.långben, "3rd should be långben:");

            n = iterator.next();
            expect(n.done).to.equal(false, "4th should NOT be done");
            expect(n.value).to.eql(TestItems.mimmi, "4th should be mimmi:");

            n = iterator.next();
            expect(n.done).to.equal(false, "5th should NOT be done");
            expect(n.value).to.eql(TestItems.musse, "5th should be musse:");

            n = iterator.next();
            expect(n.done).to.equal(true, "6th should be done");
            expect(n.value).to.equal(undefined, "6th should be undefined");

            n = iterator.next();
            expect(n.done).to.equal(true, "consecutive should be done");
            expect(n.value).to.equal(undefined, "consecutive should be undefined");
        });
        
        it("descending firstname,", function() {
            var iterator = new OrderIterator(TestItems.objects, x => x.first, Util.defaultComparer, true);
            var n: IteratorResult<any>;

            n = iterator.next();
            expect(n.done).to.equal(false, "1st should NOT be done");
            expect(n.value).to.eql(TestItems.musse, "1st should be musse:");

            n = iterator.next();
            expect(n.done).to.equal(false, "2nd should NOT be done");
            expect(n.value).to.eql(TestItems.mimmi, "2nd should be mimmi:");

            n = iterator.next();
            expect(n.done).to.equal(false, "3rd should NOT be done");
            expect(n.value).to.eql(TestItems.långben, "3rd should be långben:");

            n = iterator.next();
            expect(n.done).to.equal(false, "4th should NOT be done");
            expect(n.value).to.eql(TestItems.kalle, "4th should be kalle:");

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
    });

    describe("ThenBy", function () {
        it("ascending lastname - descending firstname,", function() {
            var iterator = new OrderIterator(TestItems.objects, x => x.last);
            iterator.thenBy(x => x.first, Util.defaultComparer, true);
            var n: IteratorResult<any>;

            n = iterator.next();
            expect(n.done).to.equal(false, "1st should NOT be done");
            expect(n.value).to.eql(TestItems.mimmi, "1st should be mimmi:");

            n = iterator.next();
            expect(n.done).to.equal(false, "2nd should NOT be done");
            expect(n.value).to.eql(TestItems.kalle, "2nd should be kalle:");

            n = iterator.next();
            expect(n.done).to.equal(false, "3rd should NOT be done");
            expect(n.value).to.eql(TestItems.joakim, "3rd should be joakim:");

            n = iterator.next();
            expect(n.done).to.equal(false, "4th should NOT be done");
            expect(n.value).to.eql(TestItems.långben, "4th should be långben:");

            n = iterator.next();
            expect(n.done).to.equal(false, "5th should NOT be done");
            expect(n.value).to.eql(TestItems.musse, "5th should be musse:");

            n = iterator.next();
            expect(n.done).to.equal(true, "6th should be done");
            expect(n.value).to.equal(undefined, "6th should be undefined");

            n = iterator.next();
            expect(n.done).to.equal(true, "consecutive should be done");
            expect(n.value).to.equal(undefined, "consecutive should be undefined");
        });
        
        it("descending lastname - ascending firstname,", function() {
            var iterator = new OrderIterator(TestItems.objects, x => x.last[0], Util.defaultComparer, true);
            iterator.thenBy(x => x.first);
            var n: IteratorResult<any>;

            n = iterator.next();
            expect(n.done).to.equal(false, "1st should NOT be done");
            expect(n.value).to.eql(TestItems.musse, "1st should be musse:");

            n = iterator.next();
            expect(n.done).to.equal(false, "2nd should NOT be done");
            expect(n.value).to.eql(TestItems.långben, "2nd should be långben:");

            n = iterator.next();
            expect(n.done).to.equal(false, "3rd should NOT be done");
            expect(n.value).to.eql(TestItems.joakim, "3rd should be joakim:");

            n = iterator.next();
            expect(n.done).to.equal(false, "4th should NOT be done");
            expect(n.value).to.eql(TestItems.kalle, "4th should be kalle:");

            n = iterator.next();
            expect(n.done).to.equal(false, "5th should NOT be done");
            expect(n.value).to.eql(TestItems.mimmi, "5th should be mimmi:");

            n = iterator.next();
            expect(n.done).to.equal(true, "6th should be done");
            expect(n.value).to.equal(undefined, "6th should be undefined");

            n = iterator.next();
            expect(n.done).to.equal(true, "consecutive should be done");
            expect(n.value).to.equal(undefined, "consecutive should be undefined");
        });
    });
});
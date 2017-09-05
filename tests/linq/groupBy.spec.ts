import {expect} from 'chai';
import {IteratorResult} from "../../src/linq/iterator/iterator";
import {GroupByIterator} from "../../src/linq/iterator/groupBy";

describe("GroupByIterator", function() {
    it("groups items", function () {
        var groupByArr = [
            { key: 1, value: 1 },
            { key: 2, value: 3 },
            { key: 1, value: 2 },
            { key: 3, value: 5 },
            { key: 2, value: 4 }
        ];

        var iterator = new GroupByIterator(groupByArr, x => x.key);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql({
            key: 1,
            values: [
                { key: 1, value: 1 },
                { key: 1, value: 2 }
            ]
        }, "key 1 should have items with values 1 and 2");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql({
            key: 2,
            values: [
                { key: 2, value: 3 },
                { key: 2, value: 4 }
            ]
        }, "key 2 should have items with values 3 and 4");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql({
            key: 3,
            values: [
                { key: 3, value: 5 }
            ]
        }, "key 3 should have items with value 5");

        n = iterator.next();
        expect(n.done).to.equal(true, "4th should be done");
        expect(n.value).to.equal(undefined, "4th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("skips undefined items", function () {
        var groupByArr = [
            { key: 1, value: 1 },
            { key: 2, value: 3 },
            undefined,
            { key: 3, value: 5 },
            { key: 2, value: 4 }
        ];

        var iterator = new GroupByIterator(groupByArr, x => x && x.key);
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql({
            key: 1,
            values: [
                { key: 1, value: 1 }
            ]
        }, "key 1 should have items with value 1");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql({
            key: 2,
            values: [
                { key: 2, value: 3 },
                { key: 2, value: 4 }
            ]
        }, "key 2 should have items with values 3 and 4");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql({
            key: 3,
            values: [
                { key: 3, value: 5 }
            ]
        }, "key 3 should have items with value 5");

        n = iterator.next();
        expect(n.done).to.equal(true, "4th should be done");
        expect(n.value).to.equal(undefined, "4th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
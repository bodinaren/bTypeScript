"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var linq_1 = require("../../src/linq");
describe("GroupByIterator", function () {
    it("groups items", function () {
        var groupByArr = [
            { key: 1, value: 1 },
            { key: 2, value: 3 },
            { key: 1, value: 2 },
            { key: 3, value: 5 },
            { key: 2, value: 4 }
        ];
        var iterator = new linq_1.GroupByIterator(groupByArr, function (x) { return x.key; });
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql({
            key: 1,
            values: [
                { key: 1, value: 1 },
                { key: 1, value: 2 }
            ]
        }, "key 1 should have items with values 1 and 2");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2nd should NOT be done");
        chai_1.expect(n.value).to.eql({
            key: 2,
            values: [
                { key: 2, value: 3 },
                { key: 2, value: 4 }
            ]
        }, "key 2 should have items with values 3 and 4");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "3rd should NOT be done");
        chai_1.expect(n.value).to.eql({
            key: 3,
            values: [
                { key: 3, value: 5 }
            ]
        }, "key 3 should have items with value 5");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "4th should be done");
        chai_1.expect(n.value).to.equal(undefined, "4th should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
    it("skips undefined items", function () {
        var groupByArr = [
            { key: 1, value: 1 },
            { key: 2, value: 3 },
            undefined,
            { key: 3, value: 5 },
            { key: 2, value: 4 }
        ];
        var iterator = new linq_1.GroupByIterator(groupByArr, function (x) { return x && x.key; });
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql({
            key: 1,
            values: [
                { key: 1, value: 1 }
            ]
        }, "key 1 should have items with value 1");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2nd should NOT be done");
        chai_1.expect(n.value).to.eql({
            key: 2,
            values: [
                { key: 2, value: 3 },
                { key: 2, value: 4 }
            ]
        }, "key 2 should have items with values 3 and 4");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "3rd should NOT be done");
        chai_1.expect(n.value).to.eql({
            key: 3,
            values: [
                { key: 3, value: 5 }
            ]
        }, "key 3 should have items with value 5");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "4th should be done");
        chai_1.expect(n.value).to.equal(undefined, "4th should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
//# sourceMappingURL=groupBy.spec.js.map
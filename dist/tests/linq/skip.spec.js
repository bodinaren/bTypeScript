"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var linq_1 = require("../../src/linq");
var TestItems = require("./testitems");
describe("SkipIterator", function () {
    it("skip 2,", function () {
        var iterator = new linq_1.SkipIterator(TestItems.numbers, 7);
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql(5, "1st should be 5");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2nd should NOT be done");
        chai_1.expect(n.value).to.eql(3, "2nd should be 3");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "3rd should NOT be done");
        chai_1.expect(n.value).to.eql(1, "3rd should be 1");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "4th should be done");
        chai_1.expect(n.value).to.equal(undefined, "4th should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
//# sourceMappingURL=skip.spec.js.map
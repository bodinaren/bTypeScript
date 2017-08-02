"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var linq_1 = require("../../src/linq");
var TestItems = require("./testitems");
describe("TakeIterator", function () {
    it("take 2,", function () {
        var iterator = new linq_1.TakeIterator(TestItems.numbers, 2);
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql(0, "1st should be 0");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2nd should NOT be done");
        chai_1.expect(n.value).to.eql(2, "2nd should be 2");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "3rd should be done");
        chai_1.expect(n.value).to.equal(undefined, "3rd should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
//# sourceMappingURL=take.spec.js.map
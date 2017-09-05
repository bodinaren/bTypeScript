"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var map_1 = require("../../src/linq/iterator/map");
var TestItems = require("./testitems");
describe("MapIterator", function () {
    it("First letter of names", function () {
        var iterator = new map_1.MapIterator(TestItems.strings, function (x) { return x[0]; });
        var n;
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "1st should NOT be done");
        chai_1.expect(n.value).to.eql("k", "1st should be 'k'");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "2nd should NOT be done");
        chai_1.expect(n.value).to.eql("m", "2nd should be 'm'");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "3rd should NOT be done");
        chai_1.expect(n.value).to.eql("l", "3rd should be 'l'");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "4th should NOT be done");
        chai_1.expect(n.value).to.eql("m", "4th should be 'm'");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(false, "5th should NOT be done");
        chai_1.expect(n.value).to.eql("j", "5th should be 'j'");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "6th should be done");
        chai_1.expect(n.value).to.equal(undefined, "6th should be undefined");
        n = iterator.next();
        chai_1.expect(n.done).to.equal(true, "consecutive should be done");
        chai_1.expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
//# sourceMappingURL=map.spec.js.map
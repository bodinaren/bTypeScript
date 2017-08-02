"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queue_1 = require("../../src/collections/queue");
var chai_1 = require("chai");
describe("Queue", function () {
    it("enqueue", function () {
        var list = new queue_1.default();
        chai_1.expect(list.enqueue(6)).to.eql(1);
        chai_1.expect(list.enqueue(7)).to.eql(2);
        chai_1.expect(list.enqueue(8)).to.eql(3);
        chai_1.expect(list.enqueue(9)).to.eql(4);
        chai_1.expect(list.length).to.eql(4);
    });
    it("dequeue", function () {
        var list = new queue_1.default();
        list.enqueue(6);
        list.enqueue(7);
        list.enqueue(8);
        list.enqueue(9);
        chai_1.expect(list.dequeue()).to.eql(6);
        chai_1.expect(list.dequeue()).to.eql(7);
        chai_1.expect(list.dequeue()).to.eql(8);
        chai_1.expect(list.dequeue()).to.eql(9);
        chai_1.expect(list.length).to.eql(0);
    });
});
//# sourceMappingURL=queue.spec.js.map
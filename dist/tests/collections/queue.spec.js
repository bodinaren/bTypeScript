(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../src/collections/queue"], factory);
    }
})(function (require, exports) {
    "use strict";
    var queue_1 = require("../../src/collections/queue");
    describe("Queue", function () {
        it("enqueue", function () {
            var list = new queue_1.default();
            expect(list.enqueue(6)).toEqual(1);
            expect(list.enqueue(7)).toEqual(2);
            expect(list.enqueue(8)).toEqual(3);
            expect(list.enqueue(9)).toEqual(4);
        });
        it("dequeue", function () {
            var list = new queue_1.default();
            list.enqueue(6);
            list.enqueue(7);
            list.enqueue(8);
            list.enqueue(9);
            expect(list.dequeue()).toEqual(6);
            expect(list.dequeue()).toEqual(7);
            expect(list.dequeue()).toEqual(8);
            expect(list.dequeue()).toEqual(9);
        });
    });
});
//# sourceMappingURL=queue.spec.js.map
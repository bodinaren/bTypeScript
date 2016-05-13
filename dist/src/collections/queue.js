"use strict";
var linkedList_1 = require("./linkedList");
var Queue = (function () {
    function Queue() {
        this.length = 0;
        this._list = new linkedList_1.default();
    }
    Queue.prototype.enqueue = function (val) {
        this._list.insert(val);
        return this.length = this._list.length;
    };
    Queue.prototype.dequeue = function () {
        var item = this._list.get(0);
        this.length = this._list.removeAt(0);
        return item;
    };
    return Queue;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Queue;
//# sourceMappingURL=queue.js.map
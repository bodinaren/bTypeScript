(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var LinkedList = (function () {
        function LinkedList() {
            this.length = 0;
        }
        LinkedList.prototype._getNode = function (at) {
            if (this.length === 0)
                return undefined;
            else if (at == 0)
                return this._first;
            else if (at > this.length)
                return this._last;
            var i, item;
            if (at < this.length / 2) {
                item = this._first;
                for (i = 0; i < at; i++) {
                    item = item.next;
                }
            }
            else {
                item = this._last;
                for (i = this.length - 1; i > at; i--) {
                    item = item.prev;
                }
            }
            return item;
        };
        LinkedList.prototype.get = function (at) {
            var node = this._getNode(at);
            if (node)
                return node.val;
        };
        LinkedList.prototype.insert = function (val) {
            var item = new LinkedListNode(val);
            if (!this._first) {
                this._first = this._last = item;
            }
            else {
                item.prev = this._last;
                this._last.next = item;
                this._last = item;
            }
            return ++this.length;
        };
        LinkedList.prototype.insertAt = function (at, val) {
            if (at >= this.length)
                return this.insert(val);
            var item = new LinkedListNode(val), next = this._getNode(at), prev = next.prev;
            if (prev)
                prev.next = item;
            next.prev = item;
            item.prev = prev;
            item.next = next;
            if (at === 0)
                this._first = item;
            return ++this.length;
        };
        LinkedList.prototype.removeAt = function (at) {
            if (this.length === 0)
                return 0;
            var item = this._getNode(at);
            if (this.length === 1) {
                this._first = this._last = undefined;
            }
            else if (item === this._first) {
                item.next.prev = undefined;
                this._first = item.next;
            }
            else if (item === this._last) {
                item.next = undefined;
                item.prev.next = item;
            }
            else {
                item.prev.next = item.next;
                item.next.prev = item.prev;
            }
            return --this.length;
        };
        return LinkedList;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LinkedList;
    var LinkedListNode = (function () {
        function LinkedListNode(val) {
            this.val = val;
        }
        return LinkedListNode;
    }());
});
//# sourceMappingURL=linkedList.js.map
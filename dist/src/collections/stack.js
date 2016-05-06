(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./linkedList"], factory);
    }
})(function (require, exports) {
    "use strict";
    var linkedList_1 = require("./linkedList");
    var Stack = (function () {
        function Stack() {
            this._list = new linkedList_1.default();
        }
        Stack.prototype.push = function (val) {
            this._list.insertAt(0, val);
            return this.length = this._list.length;
        };
        Stack.prototype.pop = function () {
            var item = this.peek();
            this.length = this._list.removeAt(0);
            return item;
        };
        Stack.prototype.peek = function () {
            return this._list.get(0);
        };
        return Stack;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Stack;
});
//# sourceMappingURL=stack.js.map
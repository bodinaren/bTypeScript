(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./collections/list", "./collections/linkedList", "./collections/stack", "./collections/queue", "./collections/binaryTree"], factory);
    }
})(function (require, exports) {
    "use strict";
    var list_1 = require("./collections/list");
    exports.List = list_1.default;
    var linkedList_1 = require("./collections/linkedList");
    exports.LinkedList = linkedList_1.default;
    var stack_1 = require("./collections/stack");
    exports.Stack = stack_1.default;
    var queue_1 = require("./collections/queue");
    exports.Queue = queue_1.default;
    var binaryTree_1 = require("./collections/binaryTree");
    exports.BinaryTree = binaryTree_1.default;
});
//# sourceMappingURL=collections.js.map
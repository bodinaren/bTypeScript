(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../util", "./queue"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Util = require("../util");
    var queue_1 = require("./queue");
    var BinaryTree = (function () {
        function BinaryTree(compareFunction) {
            this.length = 0;
            this._compare = compareFunction || Util.defaultComparer;
        }
        BinaryTree.prototype.insert = function (item) { return this.insertAux(this._root, new TreeNode(item)); };
        BinaryTree.prototype.insertRange = function (items) {
            var _this = this;
            items.forEach(function (item) { _this.insert(item); });
        };
        BinaryTree.prototype.insertAux = function (tree, node) {
            if (!this._root) {
                this._root = node;
                this.length++;
                return true;
            }
            var comp = this._compare(node.value, tree.value);
            if (comp < 0) {
                if (tree.left) {
                    this.insertAux(tree.left, node);
                }
                else {
                    tree.left = node;
                    node.parent = tree;
                    this.length++;
                }
                return true;
            }
            else if (comp > 0) {
                if (tree.right) {
                    this.insertAux(tree.right, node);
                }
                else {
                    tree.right = node;
                    node.parent = tree;
                    this.length++;
                }
                return true;
            }
            return false;
        };
        BinaryTree.prototype.remove = function (item) {
            var node = this._search(this._root, item);
            if (node && node.isEmpty()) {
                if (node.value < node.parent.value)
                    delete node.parent.left;
                else
                    delete node.parent.right;
                delete node.parent;
            }
            else if (node) {
                var right = node;
                while (right.right) {
                    right = right.right;
                }
                if (right.left) {
                    right = right.left;
                }
                else {
                    while (right.value !== node.value) {
                        right.left = right.parent.left;
                        right.left.parent = right;
                        if (right.parent.value === node.value)
                            break;
                        right = right.parent;
                    }
                }
                right.parent = node.parent;
                node.left = node.right = node.parent = undefined;
                if (node === this._root) {
                    this._root = right;
                    delete this._root.parent;
                }
            }
            return false;
        };
        BinaryTree.prototype.contains = function (item) {
            return !!this._search(this._root, item);
        };
        BinaryTree.prototype.forEach = function (callback) {
            this.inorderTraversal(callback);
        };
        BinaryTree.prototype.toArray = function () {
            var arr = [];
            this.forEach(function (item) { arr.push(item); });
            return arr;
        };
        BinaryTree.prototype.preorderTraversal = function (callback) { this.preorderTraversalAux(this._root, callback, { stop: false }); };
        BinaryTree.prototype.preorderTraversalAux = function (tree, callback, signal) {
            if (!tree || signal.stop)
                return;
            signal.stop = (callback(tree.value) === false);
            if (signal.stop)
                return;
            this.preorderTraversalAux(tree.left, callback, signal);
            if (signal.stop)
                return;
            this.preorderTraversalAux(tree.right, callback, signal);
        };
        BinaryTree.prototype.inorderTraversal = function (callback) { this.inorderTraversalAux(this._root, callback, { stop: false }); };
        BinaryTree.prototype.inorderTraversalAux = function (tree, callback, signal) {
            if (!tree || signal.stop)
                return;
            this.inorderTraversalAux(tree.left, callback, signal);
            if (signal.stop)
                return;
            signal.stop = (callback(tree.value) === false);
            if (signal.stop)
                return;
            this.inorderTraversalAux(tree.right, callback, signal);
        };
        BinaryTree.prototype.postorderTraversal = function (callback) { this.postorderTraversalAux(this._root, callback, { stop: false }); };
        BinaryTree.prototype.postorderTraversalAux = function (tree, callback, signal) {
            if (!tree || signal.stop)
                return;
            this.postorderTraversalAux(tree.left, callback, signal);
            if (signal.stop)
                return;
            this.postorderTraversalAux(tree.right, callback, signal);
            if (signal.stop)
                return;
            signal.stop = (callback(tree.value) === false);
        };
        BinaryTree.prototype.levelTraversal = function (callback) { this.levelTraversalAux(this._root, callback, { stop: false }); };
        BinaryTree.prototype.levelTraversalAux = function (tree, callback, signal) {
            var queue = new queue_1.default();
            if (tree)
                queue.enqueue(tree);
            while (!Util.isUndefined(tree = queue.dequeue())) {
                signal.stop = signal.stop || (callback(tree.value) === false);
                if (signal.stop)
                    return;
                if (tree.left)
                    queue.enqueue(tree.left);
                if (tree.right)
                    queue.enqueue(tree.right);
            }
        };
        BinaryTree.prototype.min = function () {
            var min = this.minAux(this._root);
            if (min)
                return min.value;
        };
        BinaryTree.prototype.minAux = function (tree) {
            if (tree.left)
                return this.minAux(tree.left);
            else
                return tree;
        };
        BinaryTree.prototype.max = function () {
            var max = this.maxAux(this._root);
            if (max)
                return max.value;
        };
        BinaryTree.prototype.maxAux = function (tree) {
            if (tree.right)
                return this.maxAux(tree.right);
            else
                return tree;
        };
        BinaryTree.prototype.depth = function () { return this.depthAux(this._root); };
        BinaryTree.prototype.depthAux = function (tree) {
            if (!tree)
                return -1;
            return Math.max(this.depthAux(tree.left), this.depthAux(tree.right)) + 1;
        };
        BinaryTree.prototype._search = function (tree, item) {
            if (Util.isUndefined(tree))
                return undefined;
            var comp = this._compare(item, tree.value);
            if (comp < 0) {
                tree = this._search(tree.left, item);
            }
            else if (comp > 0) {
                tree = this._search(tree.right, item);
            }
            return tree;
        };
        return BinaryTree;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BinaryTree;
    var TreeNode = (function () {
        function TreeNode(value) {
            this.value = value;
        }
        TreeNode.prototype.isEmpty = function () { return !this.left && !this.right; };
        return TreeNode;
    }());
});
//# sourceMappingURL=binaryTree.js.map
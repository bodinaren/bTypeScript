(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.listComponent = f()
    }
})(function() {
        var define, module, exports;
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Collections":[function(require,module,exports){
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

},{"./collections/binaryTree":1,"./collections/linkedList":2,"./collections/list":3,"./collections/queue":4,"./collections/stack":5}],"Helpers":[function(require,module,exports){
"use strict";
var numbers_1 = require("./helpers/numbers");
exports.Numbers = numbers_1.default;
exports.NumbersHelper = numbers_1.NumbersHelper;
var strings_1 = require("./helpers/strings");
exports.Strings = strings_1.default;
exports.StringsHelper = strings_1.StringsHelper;
var dates_1 = require("./helpers/dates");
exports.Dates = dates_1.default;
exports.DatesHelper = dates_1.DatesHelper;

},{"./helpers/dates":6,"./helpers/numbers":7,"./helpers/strings":8}],"Linq":[function(require,module,exports){
"use strict";
var iterator_1 = require("./linq/iterator");
exports.Iterator = iterator_1.default;
var filter_1 = require("./linq/filter");
exports.FilterIterator = filter_1.default;
var map_1 = require("./linq/map");
exports.MapIterator = map_1.default;
var order_1 = require("./linq/order");
exports.OrderIterator = order_1.default;
var skip_1 = require("./linq/skip");
exports.SkipIterator = skip_1.default;
var skipWhile_1 = require("./linq/skipWhile");
exports.SkipWhileIterator = skipWhile_1.default;
var take_1 = require("./linq/take");
exports.TakeIterator = take_1.default;
var takeWhile_1 = require("./linq/takeWhile");
exports.TakeWhileIterator = takeWhile_1.default;
var linq_1 = require("./linq/linq");
exports.Linq = linq_1.default;
exports.LQ = linq_1.LQ;
exports.OrderedLinq = linq_1.OrderedLinq;

},{"./linq/filter":9,"./linq/iterator":10,"./linq/linq":11,"./linq/map":12,"./linq/order":13,"./linq/skip":14,"./linq/skipWhile":15,"./linq/take":16,"./linq/takeWhile":17}],1:[function(require,module,exports){
"use strict";
var Util = require("../util");
var queue_1 = require("./queue");
var BinaryTree = (function () {
    function BinaryTree(compareFunction) {
        this.length = 0;
        this._compare = compareFunction || Util.defaultComparer;
    }
    /**
     * Insert an item into the tree.
     * @param item
     * @returns boolean Return false if the item already exists.
     */
    BinaryTree.prototype.insert = function (item) { return this.insertAux(this._root, new TreeNode(item)); };
    /**
     * Insert a range of items into the tree.
     * @param item
     */
    BinaryTree.prototype.insertRange = function (items) {
        var _this = this;
        items.forEach(function (item) { _this.insert(item); });
    };
    /**
     * Insert an item into the tree.
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param node The node we wish to insert
     */
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
            } // Get right most item.
            if (right.left) {
                right = right.left; // If the right most item has a left, use that instead.
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
    /**
     * Check if the tree contains a given item.
     * @param item
     * @returns True if the item exists in the tree.
     */
    BinaryTree.prototype.contains = function (item) {
        return !!this._search(this._root, item);
    };
    /**
     * Execute callback for each item.
     * @param callback What should we do when we get there.
     * @see inorderTraversal
     */
    BinaryTree.prototype.forEach = function (callback) {
        this.inorderTraversal(callback);
    };
    /**
     * Make into an (ordered) array.
     */
    BinaryTree.prototype.toArray = function () {
        var arr = [];
        this.forEach(function (item) { arr.push(item); });
        return arr;
    };
    /**
     * Traverse the tree and execute callback when entering (passing on the left side of) an item.
     * @param callback What should we do when we get there.
     */
    BinaryTree.prototype.preorderTraversal = function (callback) { this.preorderTraversalAux(this._root, callback, { stop: false }); };
    /**
     * Traverse the tree and execute callback when entering (passing on the left side of) an item.
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
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
    /**
     * Traverse the tree and execute callback when passing (pass under the item) an item
     * @param callback What should we do when we get there.
     */
    BinaryTree.prototype.inorderTraversal = function (callback) { this.inorderTraversalAux(this._root, callback, { stop: false }); };
    /**
     * Traverse the tree and execute callback when passing (pass under the item) an item
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
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
    /**
     * Traverse the tree and execute callback when leaving (passing on the right side of) an item
     * @param callback What should we do when we get there.
     */
    BinaryTree.prototype.postorderTraversal = function (callback) { this.postorderTraversalAux(this._root, callback, { stop: false }); };
    /**
     * Traverse the tree and execute callback when passing (pass under the item) an item
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
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
    /**
     * Traverse the tree one level at a time and execute callback on each an item
     * @param callback What should we do when we get there.
     */
    BinaryTree.prototype.levelTraversal = function (callback) { this.levelTraversalAux(this._root, callback, { stop: false }); };
    /**
     * Traverse the tree one level at a time and execute callback on each an item
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
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
    /**
     * Get the minimum value in the tree.
     */
    BinaryTree.prototype.min = function () {
        var min = this.minAux(this._root);
        if (min)
            return min.value;
    };
    /**
     * Get the minimum value in the tree.
     * @private
     * @param tree Which TreeNode we're traversing.
     */
    BinaryTree.prototype.minAux = function (tree) {
        if (tree.left)
            return this.minAux(tree.left);
        else
            return tree;
    };
    /**
     * Get the maximum value in the tree.
     */
    BinaryTree.prototype.max = function () {
        var max = this.maxAux(this._root);
        if (max)
            return max.value;
    };
    /**
     * Get the maximum value in the tree.
     * @private
     * @param tree Which TreeNode we're traversing.
     */
    BinaryTree.prototype.maxAux = function (tree) {
        if (tree.right)
            return this.maxAux(tree.right);
        else
            return tree;
    };
    /**
     * Get the depth of a tree.
     * -1 = Empty
     * 0 = Only root
     */
    BinaryTree.prototype.depth = function () { return this.depthAux(this._root); };
    /**
     * Get the minimum value in the tree.
     * -1 = Empty
     * 0 = Only root
     * @private
     * @param tree Which TreeNode we're traversing.
     */
    BinaryTree.prototype.depthAux = function (tree) {
        if (!tree)
            return -1;
        return Math.max(this.depthAux(tree.left), this.depthAux(tree.right)) + 1;
    };
    /**
     * Search the tree for a specific item.
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param item
     */
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
    /**
     * If the node has neither a right or left child.
     */
    TreeNode.prototype.isEmpty = function () { return !this.left && !this.right; };
    return TreeNode;
}());

},{"../util":18,"./queue":4}],2:[function(require,module,exports){
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
            // if fetching from first half of list, start from the beginning
            item = this._first;
            for (i = 0; i < at; i++) {
                item = item.next;
            }
        }
        else {
            // if fetching from last half of list, start from the end
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
            // only 1 item left to remove.
            this._first = this._last = undefined;
        }
        else if (item === this._first) {
            // removing the first item.
            item.next.prev = undefined;
            this._first = item.next;
        }
        else if (item === this._last) {
            // removing the last item.
            item.next = undefined;
            item.prev.next = item;
        }
        else {
            // removing item in the middle of the list
            item.prev.next = item.next;
            item.next.prev = item.prev;
        }
        return --this.length;
    };
    LinkedList.prototype.clear = function () {
        this._first = this._last = undefined;
        this.length = 0;
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

},{}],3:[function(require,module,exports){
"use strict";
var Util = require("../util");
var List = (function () {
    /**
     * Creates a new list object.
     * Utilizes a normal array behind the scenes and native functions whenever possible,
     * but with functions known for a List.
     * @param source The source array from which to create the list.
     */
    function List(source) {
        this._source = source || [];
    }
    Object.defineProperty(List.prototype, "length", {
        get: function () { return this._source.length; },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the list as a array.
     */
    List.prototype.toArray = function () {
        return this._source;
    };
    /**
     * Adds an object to the end of the list.
     * @param item The object to be added to the end of the list.
     */
    List.prototype.add = function (item) {
        this._source.push(item);
        return this;
    };
    List.add = function (source, item) {
        return new List(source).add(item).toArray();
    };
    /**
     * Adds the elements of the specified collection to the end of the list.
     * @param collection The collection whose elements should be added to the end of the list.
     */
    List.prototype.addRange = function (collection) {
        var items = (collection instanceof List) ? collection.toArray() : collection;
        Array.prototype.push.apply(this._source, items);
        return this;
    };
    List.addRange = function (source, collection) {
        return new List(source).addRange(collection).toArray();
    };
    /**
     * Returns a new read only instance of the list.
     */
    List.prototype.asReadOnly = function () {
        return new List(Object.freeze(this._source.slice()));
    };
    /**
     * Performs the specified action on each element of the list.
     * @param callback The callback to execute on each element of the list.
     */
    List.prototype.forEach = function (callback) {
        this._source.forEach(callback);
    };
    List.forEach = function (source, callback) {
        new List(source).forEach(callback);
    };
    /**
     * Searches for the specified object and returns the zero-based index of the first occurrence within the specified range of elements in the list.
     * @param item The object to locate in the list.
     * @param index The zero-based starting index of the search.
     * @param count The number of elements in the section to search.
     */
    List.prototype.indexOf = function (item, index, count) {
        if (index === void 0) { index = 0; }
        if (count === void 0) { count = this.length; }
        var idx = this._source.indexOf(item, index);
        if (idx > count - index + 1)
            return -1;
        return idx;
    };
    List.indexOf = function (source, item, index, count) {
        if (index === void 0) { index = 0; }
        if (count === void 0) { count = source.length; }
        return new List(source).indexOf(item, index, count);
    };
    /**
     * Searches for the specified object and returns the zero-based index of the last occurrence within the range of elements in the list.
     * @param item The object to locate in the list.
     * @param index The zero-based starting index of the backward search.
     * @param count The number of elements in the section to search.
     */
    List.prototype.lastIndexOf = function (item, index, count) {
        if (index === void 0) { index = this.length - 1; }
        if (count === void 0) { count = this.length; }
        var idx = this._source.lastIndexOf(item, index);
        if (idx < index + 1 - count)
            return -1;
        return idx;
    };
    List.lastIndexOf = function (source, item, index, count) {
        if (index === void 0) { index = this.length - 1; }
        if (count === void 0) { count = this.length; }
        return new List(source).lastIndexOf(item, index, count);
    };
    /**
     * Inserts an element into the list at the specified index.
     * @param index The zero-based index at which item should be inserted.
     * @param item The object to insert.
     */
    List.prototype.insert = function (index, item) {
        this._source.splice(index, 0, item);
        return this;
    };
    List.insert = function (source, index, item) {
        return new List(source).insert(index, item).toArray();
    };
    /**
     * Inserts the elements of a collection into the list at the specified index.
     * @param index The zero-based index at which the new elements should be inserted.
     * @param collection The collection whose elements should be inserted into the list.
     */
    List.prototype.insertRange = function (index, collection) {
        var items = (collection instanceof List) ? collection.toArray() : collection;
        Array.prototype.splice.apply(this._source, new Array(index, 0).concat(items));
        return this;
    };
    List.insertRange = function (source, index, collection) {
        return new List(source).insertRange(index, collection).toArray();
    };
    /**
     * Gets the element at the specified index.
     * @param index Gets the element at the specified index.
     */
    List.prototype.get = function (index) {
        return this._source[index];
    };
    /**
     * Sets the element at the specified index.
     * @param index Sets the element at the specified index.
     * @param item The object to set at the specified index.
     */
    List.prototype.set = function (index, item) {
        if (index > this.length)
            throw new Error("Index was out of range. Must be non-negative and less than the size of the collection.");
        else
            this._source[index] = item;
    };
    /**
     * Removes the first occurrence of a specific object from the List(Of T).
     * @param item The object to remove from the List(Of T).
     */
    List.prototype.remove = function (item) {
        return this.removeAt(this._source.indexOf(item));
    };
    List.remove = function (source, item) {
        return new List(source).remove(item).toArray();
    };
    /**
     * Removes all the elements that match the conditions defined by the specified predicate.
     * @param predicate The predicate delegate that defines the conditions of the elements to remove.
     */
    List.prototype.removeAll = function (predicate) {
        if (!predicate) {
            this._source.splice(0); // splice rather than returning an empty array let's us keep the reference
        }
        else {
            var i = void 0;
            for (i = 0; i < this.length; i++) {
                if (predicate(this._source[i], i)) {
                    this._source.splice(i, 1);
                    i--;
                }
            }
        }
        return this;
    };
    List.removeAll = function (source, predicate) {
        return new List(source).removeAll(predicate).toArray();
    };
    /**
     * Removes the element at the specified index of the list.
     * @param index The zero-based index of the element to remove.
     */
    List.prototype.removeAt = function (index) {
        this._source.splice(index, 1);
        return this;
    };
    /**
     * Removes the element at the specified index of the list.
     * @param index The zero-based index of the element to remove.
     */
    List.removeAt = function (source, index) {
        return new List(source).removeAt(index).toArray();
    };
    /**
     * Removes a range of elements from the list.
     * @param index The zero-based starting index of the range of elements to remove.
     * @param count The number of elements to remove.
     */
    List.prototype.removeRange = function (index, count) {
        this._source.splice(index, count + index - 1);
        return this;
    };
    List.removeRange = function (source, index, count) {
        return new List(source).removeRange(index, count).toArray();
    };
    /**
     * Removes all elements from the list.
     */
    List.prototype.clear = function () {
        this.removeAll();
        return this;
    };
    List.clear = function (source) {
        return new List(source).clear().toArray();
    };
    /**
     * Returns a number that represents how many elements in the specified sequence satisfy a condition.
     * If predicate is omitted, the full size of the list will be returned.
     * @param predicate A function to test each element for a condition.
     */
    List.prototype.count = function (predicate) {
        if (!predicate)
            return this._source.length;
        var sum = 0;
        this._source.forEach(function (item) {
            if (predicate(item))
                sum++;
        });
        return sum;
    };
    List.count = function (source, predicate) {
        return new List(source).count(predicate);
    };
    /**
     * Reverses the order of the elements in the specified range.
     * If index and count is omitted the entire list will be reversed.
     * @param index The zero-based starting index of the range to reverse.
     * @param count The number of elements in the range to reverse. If not provided it will default to end of the list.
     */
    List.prototype.reverse = function (index, count) {
        if ((Util.isUndefined(index) && Util.isUndefined(count)) || (index === 0 && count >= this.length)) {
            // reverse the entire list
            this._source.reverse();
        }
        else {
            if (Util.isUndefined(count))
                count = this.length;
            var arr = this._source.splice(index, count + index - 1);
            arr.reverse();
            this.insertRange(index, arr);
        }
        return this;
    };
    List.reverse = function (source, index, count) {
        return new List(source).reverse(index, count).toArray();
    };
    List.range = function (start, count) {
        var arr = [];
        for (var i = start; i < start + count; i++)
            arr.push(i);
        return new List(arr);
    };
    return List;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = List;

},{"../util":18}],4:[function(require,module,exports){
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

},{"./linkedList":2}],5:[function(require,module,exports){
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
    Stack.prototype.clear = function () {
        this._list.clear();
    };
    return Stack;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Stack;

},{"./linkedList":2}],6:[function(require,module,exports){
"use strict";
var util = require("../util");
/**
 * Shorthand function to create a DatesHelper object.
 * @param number The date on which to perform the various functions.
 */
function Dates(date) { return new DatesHelper(date); }
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dates;
var DatesHelper = (function () {
    function DatesHelper(date) {
        this.date = date;
    }
    DatesHelper.toDate = function (date) {
        if (util.isUndefined(date))
            return new Date();
        if (util.isString(date))
            date = Date.parse(date);
        if (util.isNumber(date))
            date = new Date(date);
        return date;
    };
    /**
     * Returns weither the date is in between two numbers.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    DatesHelper.prototype.between = function (lower, upper) {
        return DatesHelper.between(this.date, lower, upper);
    };
    /**
     * Returns weither a date is in between two numbers.
     * @param date The date which to compare with.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    DatesHelper.between = function (date, lower, upper) {
        if (util.isUndefined(lower))
            lower = new Date();
        if (util.isUndefined(upper))
            upper = new Date(9999999999999);
        return (lower <= date && date <= upper);
    };
    DatesHelper.prototype.addYears = function (years) { return this.addMonths(years * 12); };
    DatesHelper.prototype.addMonths = function (months) {
        this.date.setMonth(this.date.getMonth() + months);
        return this;
    };
    DatesHelper.prototype.addWeeks = function (week) { return this.addDays(week * 7); };
    DatesHelper.prototype.addDays = function (days) { return this.addHours(days * 24); };
    DatesHelper.prototype.addHours = function (hours) { return this.addMinutes(hours * 60); };
    DatesHelper.prototype.addMinutes = function (minutes) { return this.addSeconds(minutes * 60); };
    DatesHelper.prototype.addSeconds = function (seconds) { return this.addMilliseconds(seconds * 1000); };
    DatesHelper.prototype.addMilliseconds = function (milliseconds) {
        this.date.setMilliseconds(this.date.getMilliseconds() + milliseconds);
        return this;
    };
    DatesHelper.addYears = function (date, years) { return new DatesHelper(date).addYears(years).date; };
    DatesHelper.addMonths = function (date, months) { return new DatesHelper(date).addMonths(months).date; };
    DatesHelper.addWeeks = function (date, week) { return new DatesHelper(date).addWeeks(week).date; };
    DatesHelper.addDays = function (date, days) { return new DatesHelper(date).addDays(days).date; };
    DatesHelper.addHours = function (date, hours) { return new DatesHelper(date).addHours(hours).date; };
    DatesHelper.addMinutes = function (date, minutes) { return new DatesHelper(date).addMinutes(minutes).date; };
    DatesHelper.addSeconds = function (date, seconds) { return new DatesHelper(date).addSeconds(seconds).date; };
    DatesHelper.addMilliseconds = function (date, milliseconds) { return new DatesHelper(date).addMilliseconds(milliseconds).date; };
    return DatesHelper;
}());
exports.DatesHelper = DatesHelper;

},{"../util":18}],7:[function(require,module,exports){
"use strict";
var util = require("../util");
/**
 * Shorthand function to create a NumbersHelper object.
 * @param number The number on which to perform the various functions.
 */
function Numbers(num) { return new NumbersHelper(num); }
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Numbers;
var NumbersHelper = (function () {
    /**
     * Creates a NumbersHelper object.
     * @param number The number on which to perform the various functions.
     */
    function NumbersHelper(num) {
        this.num = num;
    }
    /**
     * Returns weither the number is in between two numbers.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    NumbersHelper.prototype.between = function (lower, upper) {
        return NumbersHelper.between(this.num, lower, upper);
    };
    /**
     * Returns weither a number is in between two numbers.
     * @param number The number which to compare with.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    NumbersHelper.between = function (num, lower, upper) {
        if (util.isUndefined(lower))
            lower = Number.MIN_VALUE;
        if (util.isUndefined(upper))
            upper = Number.MAX_VALUE;
        return (lower <= num && num <= upper);
    };
    /**
     * Returns weither the number is in an array.
     * @param numbers The array of numbers to compare with.
     */
    NumbersHelper.prototype.in = function (numbers) {
        return NumbersHelper.in(this.num, numbers);
    };
    /**
     * Returns weither a number is in an array.
     * @param number The number which to compare with.
     * @param numbers The array of numbers to compare with.
     */
    NumbersHelper.in = function (num, numbers) {
        for (var i = 0; i < numbers.length; i++) {
            if (numbers[i] == num)
                return true;
        }
        return false;
    };
    /**
     * Safely round numbers in JS without hitting imprecisions of floating-point arithmetics
     * Kindly borrowed from AngularJS: https://github.com/angular/angular.js/blob/g3_v1_3/src/ng/filter/filters.js#L173
     * @param precision How many decimals the number should have.
     */
    NumbersHelper.prototype.toFixed = function (precision) {
        return NumbersHelper.toFixed(this.num, precision);
    };
    /**
     * Safely round numbers in JS without hitting imprecisions of floating-point arithmetics
     * Kindly borrowed from AngularJS: https://github.com/angular/angular.js/blob/g3_v1_3/src/ng/filter/filters.js#L173
     * @param precision How many decimals the number should have.
     */
    NumbersHelper.toFixed = function (num, precision) {
        return +(Math.round(+(num.toString() + "e" + precision)).toString() + "e" + -precision);
    };
    return NumbersHelper;
}());
exports.NumbersHelper = NumbersHelper;

},{"../util":18}],8:[function(require,module,exports){
"use strict";
/**
 * Shorthand function to create a StringsHelper object.
 * @param number The string on which to perform the various functions.
 */
function Strings(str) { return new StringsHelper(str); }
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Strings;
var StringsHelper = (function () {
    /**
     * Creates a StringsHelper object.
     * @param str The string on which to perform the various functions.
     */
    function StringsHelper(str) {
        this.str = str;
    }
    StringsHelper.prototype.format = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return StringsHelper.format.apply(undefined, [this.str].concat(args));
    };
    StringsHelper.format = function (str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var i = 0; i < args.length; i++) {
            var regex = new RegExp("\\{" + i + "\\}", "g");
            str = str.replace(regex, args[i]);
        }
        return str;
    };
    return StringsHelper;
}());
exports.StringsHelper = StringsHelper;

},{}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iterator_1 = require("./iterator");
var Util = require("../util");
var FilterIterator = (function (_super) {
    __extends(FilterIterator, _super);
    function FilterIterator(source, callback) {
        if (callback === void 0) { callback = Util.defaultPredicate; }
        _super.call(this, source);
        this._callback = callback;
    }
    FilterIterator.prototype.next = function () {
        var item;
        do {
            item = this._next();
            if (Util.isUndefined(item))
                break;
            if (this._callback(item, this._idx))
                break;
        } while (!Util.isUndefined(item));
        return item;
    };
    return FilterIterator;
}(iterator_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FilterIterator;

},{"../util":18,"./iterator":10}],10:[function(require,module,exports){
"use strict";
var Iterator = (function () {
    function Iterator(source) {
        this._idx = -1;
        this._buffers = false;
        this._reversed = false;
        this._source = source;
    }
    Iterator.prototype.getIteratorFromPipeline = function (type) {
        if (this instanceof type)
            return this;
        var source = this;
        while (!((source = source._source) instanceof type)) {
        }
        return source;
    };
    Iterator.prototype._next = function () {
        var n = undefined;
        if (this._source instanceof Iterator) {
            return this._source.next();
        }
        else {
            if (this._reversed) {
                if (this._idx < this._source.length) {
                    n = this._source[this._source.length - 1 - (++this._idx)];
                }
            }
            else {
                if (this._idx < this._source.length) {
                    n = this._source[++this._idx];
                }
            }
        }
        if (this._idx == this._source.length) {
            this._idx = -1; // we finished, reset the counter
        }
        return n;
    };
    Iterator.prototype.next = function () { };
    Iterator.prototype.reverse = function () { this._reversed = !this._reversed; };
    return Iterator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Iterator;

},{}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iterator_1 = require("./iterator");
var filter_1 = require("./filter");
var map_1 = require("./map");
var order_1 = require("./order");
var skip_1 = require("./skip");
var skipWhile_1 = require("./skipWhile");
var take_1 = require("./take");
var takeWhile_1 = require("./takeWhile");
var Util = require("../util");
var Linq = (function () {
    function Linq(source) {
        this._source = (source instanceof iterator_1.default)
            ? source
            : new map_1.default(source, function (item) { return item; });
    }
    Linq.prototype._makeValuePredicate = function (predicate) {
        if (Util.isString(predicate)) {
            var field_1 = predicate;
            predicate = (function (x) { return x[field_1]; });
        }
        else if (Util.isUndefined(predicate)) {
            predicate = (function () { return true; });
        }
        return predicate;
    };
    Linq.prototype._makeBoolPredicate = function (predicate) {
        if (Util.isString(predicate)) {
            var field_2 = predicate;
            predicate = (function (x) { return x[field_2] === true; });
        }
        else if (Util.isUndefined(predicate)) {
            predicate = (function () { return true; });
        }
        return predicate;
    };
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    Linq.prototype.map = function (callback) {
        return new Linq(new map_1.default(this._source, callback));
    };
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    Linq.map = function (source, callback) {
        return new Linq(source).map(callback).toArray();
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.filter = function (predicate) {
        return new Linq(new filter_1.default(this._source, predicate));
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.filter = function (source, predicate) {
        return new Linq(source).filter(predicate).toArray();
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.where = function (predicate) {
        return this.filter(predicate);
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.where = function (source, predicate) {
        return Linq.filter(source, predicate);
    };
    /**
     * Inverts the order of the elements in a sequence.
     */
    Linq.prototype.reverse = function () {
        this._source.reverse();
        return this;
    };
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    Linq.prototype.take = function (count) {
        return new Linq(new take_1.default(this._source, count));
    };
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    Linq.take = function (source, count) {
        return new Linq(source).take(count).toArray();
    };
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.takeWhile = function (predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(new takeWhile_1.default(this._source, predicate));
    };
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    Linq.takeWhile = function (source, predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(source).takeWhile(predicate).toArray();
    };
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    Linq.prototype.skip = function (count) {
        return new Linq(new skip_1.default(this._source, count));
    };
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    Linq.skip = function (source, count) {
        return new Linq(source).skip(count).toArray();
    };
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.skipWhile = function (predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(new skipWhile_1.default(this._source, predicate));
    };
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    Linq.skipWhile = function (source, predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(source).skipWhile(predicate).toArray();
    };
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.prototype.orderBy = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = this._makeValuePredicate(keySelector);
        return new OrderedLinq(new order_1.default(this._source, selectorFn, comparer, false));
    };
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.orderBy = function (source, keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        return new Linq(source).orderBy(keySelector, comparer).toArray();
    };
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.prototype.orderByDesc = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = this._makeValuePredicate(keySelector);
        return new OrderedLinq(new order_1.default(this._source, selectorFn, comparer, true));
    };
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.orderByDesc = function (source, keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        return new Linq(source).orderByDesc(keySelector, comparer).toArray();
    };
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    Linq.prototype.sum = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        var i, sum = 0, arr = this.toArray();
        for (i = 0; i < arr.length; i++) {
            sum += selector(arr[i]);
        }
        return sum;
    };
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    Linq.sum = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).sum(selector);
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.average = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        var i, total = 0, arr = this.toArray();
        for (i = 0; i < arr.length; i++) {
            total += selector(arr[i]);
        }
        return total / arr.length;
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @alias average
     * @param selector
     */
    Linq.prototype.avg = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return this.average(selector);
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.average = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).average(selector);
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @alias average
     * @param selector
     */
    Linq.avg = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Linq.average(source, selector);
    };
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.min = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Math.min.apply(undefined, this.toArray().map(selector));
    };
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.min = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).min(selector);
    };
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.max = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Math.max.apply(undefined, this.toArray().map(selector));
    };
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.max = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).max(selector);
    };
    /**
     * Determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
     * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
     */
    Linq.prototype.any = function (predicate, invert) {
        if (invert === void 0) { invert = false; }
        return typeof this.first(function (x) { return !!predicate(x) !== invert; }) !== "undefined";
    };
    /**
     * Determines whether any element of a sequence satisfies a condition.
     * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
     * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
     */
    Linq.any = function (source, predicate, invert) {
        if (invert === void 0) { invert = false; }
        return new Linq(source).any(predicate, invert);
    };
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @param invert If true, determines whether none elements of a sequence satisfy a condition.
     */
    Linq.prototype.all = function (predicate, invert) {
        if (invert === void 0) { invert = false; }
        return !(this.any(predicate, !invert));
    };
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param predicate A function to test each element for a condition.
     * @param invert If true, determines whether none elements of a sequence satisfy a condition.
     */
    Linq.all = function (source, predicate, invert) {
        if (invert === void 0) { invert = false; }
        return new Linq(source).all(predicate, invert);
    };
    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error.
     */
    Linq.prototype.single = function (predicate) {
        var arr = this.filter(predicate).take(2).toArray();
        if (arr.length == 0)
            throw new Error("The sequence is empty.");
        if (arr.length == 2)
            throw new Error("The input sequence contains more than one element.");
        if (arr.length == 1)
            return arr[0];
        else
            return undefined;
    };
    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error
     */
    Linq.single = function (source, predicate) {
        return new Linq(source).single(predicate);
    };
    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    Linq.prototype.first = function (predicate) {
        if (predicate === void 0) { predicate = (function () { return true; }); }
        var arr = this.filter(predicate).take(1).toArray();
        if (arr.length == 1)
            return arr[0];
        else
            return undefined;
    };
    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    Linq.first = function (source, predicate) {
        if (predicate === void 0) { predicate = (function () { return true; }); }
        return new Linq(source).first(predicate);
    };
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    Linq.prototype.last = function (predicate) {
        if (predicate === void 0) { predicate = (function () { return true; }); }
        return this.reverse().first(predicate);
    };
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    Linq.last = function (source, predicate) {
        if (predicate === void 0) { predicate = (function () { return true; }); }
        return new Linq(source).last(predicate);
    };
    /**
     * Get a list of items that exists in all datasets.
     * @param a The first dataset.
     * @param b The second dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    Linq.intersect = function (a, b) {
        var more = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            more[_i - 2] = arguments[_i];
        }
        var lists = [], result = [];
        var list = (a instanceof Linq) ? a : new Linq(Util.cast(a));
        lists.push((b instanceof Linq) ? b : new Linq(Util.cast(b)));
        more.forEach(function (dataset) {
            lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast(dataset)));
        });
        list.forEach(function (item) {
            var exists = true;
            lists.forEach(function (other) {
                if (!other.contains(item))
                    return (exists = false);
            });
            if (exists)
                result.push(item);
        });
        return result;
    };
    /**
     * Get a list of items that exists in all datasets.
     * @param other The other dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    Linq.prototype.intersect = function (other) {
        var more = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            more[_i - 1] = arguments[_i];
        }
        return new Linq(Linq.intersect.apply(Linq, [this, other].concat(more)));
    };
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param a The first dataset.
     * @param b The second dataset.
     * @param more If you have even more dataset to compare to.
     */
    Linq.except = function (a, b) {
        var more = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            more[_i - 2] = arguments[_i];
        }
        var lists = [], result = [];
        lists.push((a instanceof Linq) ? a : new Linq(Util.cast(a)));
        lists.push((b instanceof Linq) ? b : new Linq(Util.cast(b)));
        more.forEach(function (dataset) {
            lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast(dataset)));
        });
        lists.forEach(function (list) {
            list.forEach(function (item) {
                var exists = false;
                lists.forEach(function (other) {
                    if (list === other)
                        return;
                    if (other.contains(item))
                        (exists = true);
                });
                if (!exists)
                    result.push(item);
            });
        });
        return result;
    };
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param other The other dataset.
     * @param more If you have even more dataset to compare to.
     */
    Linq.prototype.except = function (other) {
        var more = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            more[_i - 1] = arguments[_i];
        }
        return new Linq(Linq.except.apply(Linq, [this, other].concat(more)));
    };
    /**
     * Get a list of unique items that exists one or more times in any of the datasets.
     * @param datasets The other datasets to be get distinct items from.
     */
    Linq.distinct = function () {
        var datasets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            datasets[_i - 0] = arguments[_i];
        }
        var lists = [], result = [];
        datasets.forEach(function (dataset) {
            lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast(dataset)));
        });
        lists.forEach(function (list) {
            list.forEach(function (item) {
                if (result.indexOf(item) == -1)
                    result.push(item);
            });
        });
        return result;
    };
    /**
     * Get a list of unique items that exists one or more times in the datasets.
     */
    Linq.prototype.distinct = function () {
        return new Linq(Linq.distinct(this));
    };
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    Linq.prototype.groupBy = function (keySelector) {
        var i, arr = [], original = this.toArray(), pred = this._makeValuePredicate(keySelector), group, groupValue;
        for (i = 0; i < original.length; i++) {
            groupValue = pred(original[i]);
            group = new Linq(arr).first(function (x) { return x.key == groupValue; });
            if (!group) {
                group = {
                    key: groupValue,
                    values: []
                };
                arr.push(group);
            }
            group.values.push(original[i]);
        }
        return new Linq(arr);
    };
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    Linq.groupBy = function (source, keySelector) {
        return new Linq(source).groupBy(keySelector).toArray();
    };
    /**
     * Executes the pipeline and return the resulting array.
     */
    Linq.prototype.toArray = function () {
        var res, arr = [];
        if (Util.isArray(this._source)) {
            arr = Util.cast(this._source).slice();
        }
        else {
            do {
                res = this._source.next();
                if (!Util.isUndefined(res))
                    arr.push(res);
            } while (!Util.isUndefined(res));
        }
        return arr;
    };
    /**
     * Executes the pipeline and execute callback on each item in the resulting array.
     * Same as doing .toArray().forEach(callback);
     * @param callback {Util.ILoopFunction<any>} forEach is cancelled as soon as it returns false
     * @return {boolean} Weither the callback was executed on all items or not.
     */
    Linq.prototype.forEach = function (callback) {
        var arr = this.toArray();
        for (var i = 0; i < arr.length; i++) {
            if (callback(arr[i], i) === false)
                return false;
        }
        return true;
    };
    /* Helper functions */
    Linq.prototype.contains = function (a) {
        var result;
        this.forEach(function (item) {
            if (item === a) {
                result = item;
                return false;
            }
        });
        return typeof result !== "undefined";
    };
    return Linq;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Linq;
function LQ(source) {
    return new Linq(source);
}
exports.LQ = LQ;
var OrderedLinq = (function (_super) {
    __extends(OrderedLinq, _super);
    function OrderedLinq(source) {
        _super.call(this, source);
    }
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    OrderedLinq.prototype.thenBy = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = this._makeValuePredicate(keySelector);
        var orderIterator = this._source.getIteratorFromPipeline(order_1.default);
        orderIterator.thenBy(selectorFn, comparer, false);
        return this;
    };
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    OrderedLinq.prototype.thenByDesc = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = this._makeValuePredicate(keySelector);
        var orderIterator = this._source.getIteratorFromPipeline(order_1.default);
        orderIterator.thenBy(selectorFn, comparer, true);
        return this;
    };
    return OrderedLinq;
}(Linq));
exports.OrderedLinq = OrderedLinq;

},{"../util":18,"./filter":9,"./iterator":10,"./map":12,"./order":13,"./skip":14,"./skipWhile":15,"./take":16,"./takeWhile":17}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Util = require("../util");
var iterator_1 = require("./iterator");
var LinqMapIterator = (function (_super) {
    __extends(LinqMapIterator, _super);
    function LinqMapIterator(source, callback) {
        _super.call(this, source);
        this._callback = callback;
    }
    LinqMapIterator.prototype.next = function () {
        var item = this._next();
        return (!Util.isUndefined(item))
            ? this._callback(item, this._idx)
            : undefined;
    };
    return LinqMapIterator;
}(iterator_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinqMapIterator;

},{"../util":18,"./iterator":10}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iterator_1 = require("./iterator");
var Util = require("../util");
var OrderIterator = (function (_super) {
    __extends(OrderIterator, _super);
    function OrderIterator(source, keySelector, comparer, descending) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        if (descending === void 0) { descending = false; }
        _super.call(this, source);
        this._isOrdered = false;
        this._orders = [new LinqOrder(keySelector, comparer, descending)];
        this._descending = descending;
        this._buffers = true;
    }
    OrderIterator.prototype.next = function () {
        var _this = this;
        if (!this._isOrdered) {
            var arr = [], item = void 0;
            // can't someone else do this? e.g. FilterIterator?
            do {
                item = this._next();
                if (!Util.isUndefined(item))
                    arr.push(item);
            } while (!Util.isUndefined(item));
            this._source = arr.sort(function (a, b) {
                var i = 0, rs;
                do {
                    rs = _this._orders[i++].compare(a, b);
                } while (rs === 0 && i < _this._orders.length);
                return rs;
            });
            this._isOrdered = true;
        }
        return this._next();
    };
    OrderIterator.prototype.thenBy = function (keySelector, comparer, descending) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        if (descending === void 0) { descending = false; }
        this._orders.push(new LinqOrder(keySelector, comparer, descending));
    };
    return OrderIterator;
}(iterator_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OrderIterator;
var LinqOrder = (function () {
    function LinqOrder(keySelector, comparer, descending) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        if (descending === void 0) { descending = false; }
        this._keySelector = keySelector;
        this._comparer = comparer;
        this._descending = descending;
    }
    LinqOrder.prototype.compare = function (a, b) {
        return (this._descending ? -1 : 1) * this._comparer(this._keySelector(a), this._keySelector(b));
    };
    return LinqOrder;
}());

},{"../util":18,"./iterator":10}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iterator_1 = require("./iterator");
var SkipIterator = (function (_super) {
    __extends(SkipIterator, _super);
    function SkipIterator(source, count) {
        _super.call(this, source);
        this._counter = 0;
        this._count = count;
    }
    SkipIterator.prototype.next = function () {
        for (; this._counter < this._count; this._counter++) {
            this._next();
        }
        return this._next();
    };
    return SkipIterator;
}(iterator_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkipIterator;

},{"./iterator":10}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iterator_1 = require("./iterator");
var Util = require("../util");
var SkipWhileIterator = (function (_super) {
    __extends(SkipWhileIterator, _super);
    function SkipWhileIterator(source, _predicate) {
        if (_predicate === void 0) { _predicate = Util.defaultPredicate; }
        _super.call(this, source);
        this._done = false;
        this._predicate = _predicate;
    }
    SkipWhileIterator.prototype.next = function () {
        var item;
        do {
            item = this._next();
        } while (!this._done && this._predicate(item, this._idx));
        this._done = true;
        return item;
    };
    return SkipWhileIterator;
}(iterator_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkipWhileIterator;

},{"../util":18,"./iterator":10}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iterator_1 = require("./iterator");
var TakeIterator = (function (_super) {
    __extends(TakeIterator, _super);
    function TakeIterator(source, count) {
        _super.call(this, source);
        this._counter = 0;
        this._count = count;
    }
    TakeIterator.prototype.next = function () {
        if (this._counter < this._count) {
            this._counter++;
            return this._next();
        }
    };
    return TakeIterator;
}(iterator_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TakeIterator;

},{"./iterator":10}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iterator_1 = require("./iterator");
var Util = require("../util");
var TakeWhileIterator = (function (_super) {
    __extends(TakeWhileIterator, _super);
    function TakeWhileIterator(source, predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        _super.call(this, source);
        this._predicate = predicate;
    }
    TakeWhileIterator.prototype.next = function () {
        var n = this._next();
        if (!!this._predicate(n, this._idx)) {
            return n;
        }
    };
    return TakeWhileIterator;
}(iterator_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TakeWhileIterator;

},{"../util":18,"./iterator":10}],18:[function(require,module,exports){
"use strict";
function defaultSelector(a) {
    return cast(a);
}
exports.defaultSelector = defaultSelector;
function defaultComparer(a, b) {
    if (a < b)
        return -1;
    else if (a > b)
        return 1;
    else
        return 0;
}
exports.defaultComparer = defaultComparer;
function defaultEqualityComparer(a, b) {
    return a === b;
}
exports.defaultEqualityComparer = defaultEqualityComparer;
function defaultPredicate(value, index) {
    return true;
}
exports.defaultPredicate = defaultPredicate;
function cast(a) {
    return a;
}
exports.cast = cast;
function toString(value) {
    return Object.prototype.toString.call(value);
}
exports.toString = toString;
function isUndefined(value) {
    return typeof value === "undefined";
}
exports.isUndefined = isUndefined;
function isString(value) {
    return toString(value) === "[object String]";
}
exports.isString = isString;
function isNumber(value) {
    return toString(value) === "[object Number]";
}
exports.isNumber = isNumber;
function isFunction(value) {
    return toString(value) === "[object Function]";
}
exports.isFunction = isFunction;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function isDate(value) {
    return toString(value) === "[object Date]";
}
exports.isDate = isDate;

},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMuanMiLCJkaXN0L3NyYy9saW5xLmpzIiwiZGlzdC9zcmMvY29sbGVjdGlvbnMvYmluYXJ5VHJlZS5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL2xpbmtlZExpc3QuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9saXN0LmpzIiwiZGlzdC9zcmMvY29sbGVjdGlvbnMvcXVldWUuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9zdGFjay5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvZGF0ZXMuanMiLCJkaXN0L3NyYy9oZWxwZXJzL251bWJlcnMuanMiLCJkaXN0L3NyYy9oZWxwZXJzL3N0cmluZ3MuanMiLCJkaXN0L3NyYy9saW5xL2ZpbHRlci5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IuanMiLCJkaXN0L3NyYy9saW5xL2xpbnEuanMiLCJkaXN0L3NyYy9saW5xL21hcC5qcyIsImRpc3Qvc3JjL2xpbnEvb3JkZXIuanMiLCJkaXN0L3NyYy9saW5xL3NraXAuanMiLCJkaXN0L3NyYy9saW5xL3NraXBXaGlsZS5qcyIsImRpc3Qvc3JjL2xpbnEvdGFrZS5qcyIsImRpc3Qvc3JjL2xpbnEvdGFrZVdoaWxlLmpzIiwiZGlzdC9zcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGxpc3RfMSA9IHJlcXVpcmUoXCIuL2NvbGxlY3Rpb25zL2xpc3RcIik7XHJcbmV4cG9ydHMuTGlzdCA9IGxpc3RfMS5kZWZhdWx0O1xyXG52YXIgbGlua2VkTGlzdF8xID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbnMvbGlua2VkTGlzdFwiKTtcclxuZXhwb3J0cy5MaW5rZWRMaXN0ID0gbGlua2VkTGlzdF8xLmRlZmF1bHQ7XHJcbnZhciBzdGFja18xID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbnMvc3RhY2tcIik7XHJcbmV4cG9ydHMuU3RhY2sgPSBzdGFja18xLmRlZmF1bHQ7XHJcbnZhciBxdWV1ZV8xID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbnMvcXVldWVcIik7XHJcbmV4cG9ydHMuUXVldWUgPSBxdWV1ZV8xLmRlZmF1bHQ7XHJcbnZhciBiaW5hcnlUcmVlXzEgPSByZXF1aXJlKFwiLi9jb2xsZWN0aW9ucy9iaW5hcnlUcmVlXCIpO1xyXG5leHBvcnRzLkJpbmFyeVRyZWUgPSBiaW5hcnlUcmVlXzEuZGVmYXVsdDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29sbGVjdGlvbnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBudW1iZXJzXzEgPSByZXF1aXJlKFwiLi9oZWxwZXJzL251bWJlcnNcIik7XHJcbmV4cG9ydHMuTnVtYmVycyA9IG51bWJlcnNfMS5kZWZhdWx0O1xyXG5leHBvcnRzLk51bWJlcnNIZWxwZXIgPSBudW1iZXJzXzEuTnVtYmVyc0hlbHBlcjtcclxudmFyIHN0cmluZ3NfMSA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvc3RyaW5nc1wiKTtcclxuZXhwb3J0cy5TdHJpbmdzID0gc3RyaW5nc18xLmRlZmF1bHQ7XHJcbmV4cG9ydHMuU3RyaW5nc0hlbHBlciA9IHN0cmluZ3NfMS5TdHJpbmdzSGVscGVyO1xyXG52YXIgZGF0ZXNfMSA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvZGF0ZXNcIik7XHJcbmV4cG9ydHMuRGF0ZXMgPSBkYXRlc18xLmRlZmF1bHQ7XHJcbmV4cG9ydHMuRGF0ZXNIZWxwZXIgPSBkYXRlc18xLkRhdGVzSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1oZWxwZXJzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2xpbnEvaXRlcmF0b3JcIik7XHJcbmV4cG9ydHMuSXRlcmF0b3IgPSBpdGVyYXRvcl8xLmRlZmF1bHQ7XHJcbnZhciBmaWx0ZXJfMSA9IHJlcXVpcmUoXCIuL2xpbnEvZmlsdGVyXCIpO1xyXG5leHBvcnRzLkZpbHRlckl0ZXJhdG9yID0gZmlsdGVyXzEuZGVmYXVsdDtcclxudmFyIG1hcF8xID0gcmVxdWlyZShcIi4vbGlucS9tYXBcIik7XHJcbmV4cG9ydHMuTWFwSXRlcmF0b3IgPSBtYXBfMS5kZWZhdWx0O1xyXG52YXIgb3JkZXJfMSA9IHJlcXVpcmUoXCIuL2xpbnEvb3JkZXJcIik7XHJcbmV4cG9ydHMuT3JkZXJJdGVyYXRvciA9IG9yZGVyXzEuZGVmYXVsdDtcclxudmFyIHNraXBfMSA9IHJlcXVpcmUoXCIuL2xpbnEvc2tpcFwiKTtcclxuZXhwb3J0cy5Ta2lwSXRlcmF0b3IgPSBza2lwXzEuZGVmYXVsdDtcclxudmFyIHNraXBXaGlsZV8xID0gcmVxdWlyZShcIi4vbGlucS9za2lwV2hpbGVcIik7XHJcbmV4cG9ydHMuU2tpcFdoaWxlSXRlcmF0b3IgPSBza2lwV2hpbGVfMS5kZWZhdWx0O1xyXG52YXIgdGFrZV8xID0gcmVxdWlyZShcIi4vbGlucS90YWtlXCIpO1xyXG5leHBvcnRzLlRha2VJdGVyYXRvciA9IHRha2VfMS5kZWZhdWx0O1xyXG52YXIgdGFrZVdoaWxlXzEgPSByZXF1aXJlKFwiLi9saW5xL3Rha2VXaGlsZVwiKTtcclxuZXhwb3J0cy5UYWtlV2hpbGVJdGVyYXRvciA9IHRha2VXaGlsZV8xLmRlZmF1bHQ7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi9saW5xL2xpbnFcIik7XHJcbmV4cG9ydHMuTGlucSA9IGxpbnFfMS5kZWZhdWx0O1xyXG5leHBvcnRzLkxRID0gbGlucV8xLkxRO1xyXG5leHBvcnRzLk9yZGVyZWRMaW5xID0gbGlucV8xLk9yZGVyZWRMaW5xO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5xLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgcXVldWVfMSA9IHJlcXVpcmUoXCIuL3F1ZXVlXCIpO1xyXG52YXIgQmluYXJ5VHJlZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBCaW5hcnlUcmVlKGNvbXBhcmVGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9jb21wYXJlID0gY29tcGFyZUZ1bmN0aW9uIHx8IFV0aWwuZGVmYXVsdENvbXBhcmVyO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYW4gaXRlbSBpbnRvIHRoZSB0cmVlLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gUmV0dXJuIGZhbHNlIGlmIHRoZSBpdGVtIGFscmVhZHkgZXhpc3RzLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gdGhpcy5pbnNlcnRBdXgodGhpcy5fcm9vdCwgbmV3IFRyZWVOb2RlKGl0ZW0pKTsgfTtcclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0IGEgcmFuZ2Ugb2YgaXRlbXMgaW50byB0aGUgdHJlZS5cclxuICAgICAqIEBwYXJhbSBpdGVtXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmluc2VydFJhbmdlID0gZnVuY3Rpb24gKGl0ZW1zKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IF90aGlzLmluc2VydChpdGVtKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYW4gaXRlbSBpbnRvIHRoZSB0cmVlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB3ZSB3aXNoIHRvIGluc2VydFxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbnNlcnRBdXggPSBmdW5jdGlvbiAodHJlZSwgbm9kZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yb290ID0gbm9kZTtcclxuICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb21wID0gdGhpcy5fY29tcGFyZShub2RlLnZhbHVlLCB0cmVlLnZhbHVlKTtcclxuICAgICAgICBpZiAoY29tcCA8IDApIHtcclxuICAgICAgICAgICAgaWYgKHRyZWUubGVmdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRBdXgodHJlZS5sZWZ0LCBub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyZWUubGVmdCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHRyZWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb21wID4gMCkge1xyXG4gICAgICAgICAgICBpZiAodHJlZS5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRBdXgodHJlZS5yaWdodCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlLnJpZ2h0ID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdHJlZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fc2VhcmNoKHRoaXMuX3Jvb3QsIGl0ZW0pO1xyXG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnZhbHVlIDwgbm9kZS5wYXJlbnQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnQubGVmdDtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIG5vZGUucGFyZW50LnJpZ2h0O1xyXG4gICAgICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gbm9kZTtcclxuICAgICAgICAgICAgd2hpbGUgKHJpZ2h0LnJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0LnJpZ2h0O1xyXG4gICAgICAgICAgICB9IC8vIEdldCByaWdodCBtb3N0IGl0ZW0uXHJcbiAgICAgICAgICAgIGlmIChyaWdodC5sZWZ0KSB7XHJcbiAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0LmxlZnQ7IC8vIElmIHRoZSByaWdodCBtb3N0IGl0ZW0gaGFzIGEgbGVmdCwgdXNlIHRoYXQgaW5zdGVhZC5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChyaWdodC52YWx1ZSAhPT0gbm9kZS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0LmxlZnQgPSByaWdodC5wYXJlbnQubGVmdDtcclxuICAgICAgICAgICAgICAgICAgICByaWdodC5sZWZ0LnBhcmVudCA9IHJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyaWdodC5wYXJlbnQudmFsdWUgPT09IG5vZGUudmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gcmlnaHQucGFyZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJpZ2h0LnBhcmVudCA9IG5vZGUucGFyZW50O1xyXG4gICAgICAgICAgICBub2RlLmxlZnQgPSBub2RlLnJpZ2h0ID0gbm9kZS5wYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmIChub2RlID09PSB0aGlzLl9yb290KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290ID0gcmlnaHQ7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcm9vdC5wYXJlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgdGhlIHRyZWUgY29udGFpbnMgYSBnaXZlbiBpdGVtLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGl0ZW0gZXhpc3RzIGluIHRoZSB0cmVlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fc2VhcmNoKHRoaXMuX3Jvb3QsIGl0ZW0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZSBjYWxsYmFjayBmb3IgZWFjaCBpdGVtLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICogQHNlZSBpbm9yZGVyVHJhdmVyc2FsXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWwoY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogTWFrZSBpbnRvIGFuIChvcmRlcmVkKSBhcnJheS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IGFyci5wdXNoKGl0ZW0pOyB9KTtcclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgd2hlbiBlbnRlcmluZyAocGFzc2luZyBvbiB0aGUgbGVmdCBzaWRlIG9mKSBhbiBpdGVtLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5wcmVvcmRlclRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykgeyB0aGlzLnByZW9yZGVyVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayB3aGVuIGVudGVyaW5nIChwYXNzaW5nIG9uIHRoZSBsZWZ0IHNpZGUgb2YpIGFuIGl0ZW0uXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqIEBwYXJhbSBzaWduYWwgT2JqZWN0IChzbyBpdCdzIGEgcmVmZXJlbmNlKSB0aGF0IHdlIHVzZSB0byBrbm93IHdoZW4gdGhlIGNhbGxiYWNrIHJldHVybmVkIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5wcmVvcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uICh0cmVlLCBjYWxsYmFjaywgc2lnbmFsKSB7XHJcbiAgICAgICAgaWYgKCF0cmVlIHx8IHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgc2lnbmFsLnN0b3AgPSAoY2FsbGJhY2sodHJlZS52YWx1ZSkgPT09IGZhbHNlKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByZW9yZGVyVHJhdmVyc2FsQXV4KHRyZWUubGVmdCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcmVvcmRlclRyYXZlcnNhbEF1eCh0cmVlLnJpZ2h0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlIHRoZSB0cmVlIGFuZCBleGVjdXRlIGNhbGxiYWNrIHdoZW4gcGFzc2luZyAocGFzcyB1bmRlciB0aGUgaXRlbSkgYW4gaXRlbVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbm9yZGVyVHJhdmVyc2FsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7IHRoaXMuaW5vcmRlclRyYXZlcnNhbEF1eCh0aGlzLl9yb290LCBjYWxsYmFjaywgeyBzdG9wOiBmYWxzZSB9KTsgfTtcclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgd2hlbiBwYXNzaW5nIChwYXNzIHVuZGVyIHRoZSBpdGVtKSBhbiBpdGVtXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqIEBwYXJhbSBzaWduYWwgT2JqZWN0IChzbyBpdCdzIGEgcmVmZXJlbmNlKSB0aGF0IHdlIHVzZSB0byBrbm93IHdoZW4gdGhlIGNhbGxiYWNrIHJldHVybmVkIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbm9yZGVyVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICBpZiAoIXRyZWUgfHwgc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5sZWZ0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBzaWduYWwuc3RvcCA9IChjYWxsYmFjayh0cmVlLnZhbHVlKSA9PT0gZmFsc2UpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaW5vcmRlclRyYXZlcnNhbEF1eCh0cmVlLnJpZ2h0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlIHRoZSB0cmVlIGFuZCBleGVjdXRlIGNhbGxiYWNrIHdoZW4gbGVhdmluZyAocGFzc2luZyBvbiB0aGUgcmlnaHQgc2lkZSBvZikgYW4gaXRlbVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5wb3N0b3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5wb3N0b3JkZXJUcmF2ZXJzYWxBdXgodGhpcy5fcm9vdCwgY2FsbGJhY2ssIHsgc3RvcDogZmFsc2UgfSk7IH07XHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlIHRoZSB0cmVlIGFuZCBleGVjdXRlIGNhbGxiYWNrIHdoZW4gcGFzc2luZyAocGFzcyB1bmRlciB0aGUgaXRlbSkgYW4gaXRlbVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgV2hhdCBzaG91bGQgd2UgZG8gd2hlbiB3ZSBnZXQgdGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gc2lnbmFsIE9iamVjdCAoc28gaXQncyBhIHJlZmVyZW5jZSkgdGhhdCB3ZSB1c2UgdG8ga25vdyB3aGVuIHRoZSBjYWxsYmFjayByZXR1cm5lZCBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucG9zdG9yZGVyVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICBpZiAoIXRyZWUgfHwgc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnBvc3RvcmRlclRyYXZlcnNhbEF1eCh0cmVlLmxlZnQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KHRyZWUucmlnaHQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHNpZ25hbC5zdG9wID0gKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBvbmUgbGV2ZWwgYXQgYSB0aW1lIGFuZCBleGVjdXRlIGNhbGxiYWNrIG9uIGVhY2ggYW4gaXRlbVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5sZXZlbFRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykgeyB0aGlzLmxldmVsVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBvbmUgbGV2ZWwgYXQgYSB0aW1lIGFuZCBleGVjdXRlIGNhbGxiYWNrIG9uIGVhY2ggYW4gaXRlbVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgV2hhdCBzaG91bGQgd2UgZG8gd2hlbiB3ZSBnZXQgdGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gc2lnbmFsIE9iamVjdCAoc28gaXQncyBhIHJlZmVyZW5jZSkgdGhhdCB3ZSB1c2UgdG8ga25vdyB3aGVuIHRoZSBjYWxsYmFjayByZXR1cm5lZCBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubGV2ZWxUcmF2ZXJzYWxBdXggPSBmdW5jdGlvbiAodHJlZSwgY2FsbGJhY2ssIHNpZ25hbCkge1xyXG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBxdWV1ZV8xLmRlZmF1bHQoKTtcclxuICAgICAgICBpZiAodHJlZSlcclxuICAgICAgICAgICAgcXVldWUuZW5xdWV1ZSh0cmVlKTtcclxuICAgICAgICB3aGlsZSAoIVV0aWwuaXNVbmRlZmluZWQodHJlZSA9IHF1ZXVlLmRlcXVldWUoKSkpIHtcclxuICAgICAgICAgICAgc2lnbmFsLnN0b3AgPSBzaWduYWwuc3RvcCB8fCAoY2FsbGJhY2sodHJlZS52YWx1ZSkgPT09IGZhbHNlKTtcclxuICAgICAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodHJlZS5sZWZ0KVxyXG4gICAgICAgICAgICAgICAgcXVldWUuZW5xdWV1ZSh0cmVlLmxlZnQpO1xyXG4gICAgICAgICAgICBpZiAodHJlZS5yaWdodClcclxuICAgICAgICAgICAgICAgIHF1ZXVlLmVucXVldWUodHJlZS5yaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtaW5pbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1pbiA9IHRoaXMubWluQXV4KHRoaXMuX3Jvb3QpO1xyXG4gICAgICAgIGlmIChtaW4pXHJcbiAgICAgICAgICAgIHJldHVybiBtaW4udmFsdWU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG1pbmltdW0gdmFsdWUgaW4gdGhlIHRyZWUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubWluQXV4ID0gZnVuY3Rpb24gKHRyZWUpIHtcclxuICAgICAgICBpZiAodHJlZS5sZWZ0KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5taW5BdXgodHJlZS5sZWZ0KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0cmVlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtYXhpbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1heCA9IHRoaXMubWF4QXV4KHRoaXMuX3Jvb3QpO1xyXG4gICAgICAgIGlmIChtYXgpXHJcbiAgICAgICAgICAgIHJldHVybiBtYXgudmFsdWU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG1heGltdW0gdmFsdWUgaW4gdGhlIHRyZWUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubWF4QXV4ID0gZnVuY3Rpb24gKHRyZWUpIHtcclxuICAgICAgICBpZiAodHJlZS5yaWdodClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF4QXV4KHRyZWUucmlnaHQpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRyZWU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIGRlcHRoIG9mIGEgdHJlZS5cclxuICAgICAqIC0xID0gRW1wdHlcclxuICAgICAqIDAgPSBPbmx5IHJvb3RcclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuZGVwdGggPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLmRlcHRoQXV4KHRoaXMuX3Jvb3QpOyB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG1pbmltdW0gdmFsdWUgaW4gdGhlIHRyZWUuXHJcbiAgICAgKiAtMSA9IEVtcHR5XHJcbiAgICAgKiAwID0gT25seSByb290XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuZGVwdGhBdXggPSBmdW5jdGlvbiAodHJlZSkge1xyXG4gICAgICAgIGlmICghdHJlZSlcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLmRlcHRoQXV4KHRyZWUubGVmdCksIHRoaXMuZGVwdGhBdXgodHJlZS5yaWdodCkpICsgMTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNlYXJjaCB0aGUgdHJlZSBmb3IgYSBzcGVjaWZpYyBpdGVtLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gaXRlbVxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5fc2VhcmNoID0gZnVuY3Rpb24gKHRyZWUsIGl0ZW0pIHtcclxuICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZCh0cmVlKSlcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgY29tcCA9IHRoaXMuX2NvbXBhcmUoaXRlbSwgdHJlZS52YWx1ZSk7XHJcbiAgICAgICAgaWYgKGNvbXAgPCAwKSB7XHJcbiAgICAgICAgICAgIHRyZWUgPSB0aGlzLl9zZWFyY2godHJlZS5sZWZ0LCBpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY29tcCA+IDApIHtcclxuICAgICAgICAgICAgdHJlZSA9IHRoaXMuX3NlYXJjaCh0cmVlLnJpZ2h0LCBpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRyZWU7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEJpbmFyeVRyZWU7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gQmluYXJ5VHJlZTtcclxudmFyIFRyZWVOb2RlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFRyZWVOb2RlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiB0aGUgbm9kZSBoYXMgbmVpdGhlciBhIHJpZ2h0IG9yIGxlZnQgY2hpbGQuXHJcbiAgICAgKi9cclxuICAgIFRyZWVOb2RlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gIXRoaXMubGVmdCAmJiAhdGhpcy5yaWdodDsgfTtcclxuICAgIHJldHVybiBUcmVlTm9kZTtcclxufSgpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmluYXJ5VHJlZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIExpbmtlZExpc3QgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGlua2VkTGlzdCgpIHtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5fZ2V0Tm9kZSA9IGZ1bmN0aW9uIChhdCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBlbHNlIGlmIChhdCA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmlyc3Q7XHJcbiAgICAgICAgZWxzZSBpZiAoYXQgPiB0aGlzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3Q7XHJcbiAgICAgICAgdmFyIGksIGl0ZW07XHJcbiAgICAgICAgaWYgKGF0IDwgdGhpcy5sZW5ndGggLyAyKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIGZldGNoaW5nIGZyb20gZmlyc3QgaGFsZiBvZiBsaXN0LCBzdGFydCBmcm9tIHRoZSBiZWdpbm5pbmdcclxuICAgICAgICAgICAgaXRlbSA9IHRoaXMuX2ZpcnN0O1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW0ubmV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gaWYgZmV0Y2hpbmcgZnJvbSBsYXN0IGhhbGYgb2YgbGlzdCwgc3RhcnQgZnJvbSB0aGUgZW5kXHJcbiAgICAgICAgICAgIGl0ZW0gPSB0aGlzLl9sYXN0O1xyXG4gICAgICAgICAgICBmb3IgKGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPiBhdDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gaXRlbS5wcmV2O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfTtcclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChhdCkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fZ2V0Tm9kZShhdCk7XHJcbiAgICAgICAgaWYgKG5vZGUpXHJcbiAgICAgICAgICAgIHJldHVybiBub2RlLnZhbDtcclxuICAgIH07XHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSBuZXcgTGlua2VkTGlzdE5vZGUodmFsKTtcclxuICAgICAgICBpZiAoIXRoaXMuX2ZpcnN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0ID0gdGhpcy5fbGFzdCA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpdGVtLnByZXYgPSB0aGlzLl9sYXN0O1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0Lm5leHQgPSBpdGVtO1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0ID0gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICsrdGhpcy5sZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuaW5zZXJ0QXQgPSBmdW5jdGlvbiAoYXQsIHZhbCkge1xyXG4gICAgICAgIGlmIChhdCA+PSB0aGlzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0KHZhbCk7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSBuZXcgTGlua2VkTGlzdE5vZGUodmFsKSwgbmV4dCA9IHRoaXMuX2dldE5vZGUoYXQpLCBwcmV2ID0gbmV4dC5wcmV2O1xyXG4gICAgICAgIGlmIChwcmV2KVxyXG4gICAgICAgICAgICBwcmV2Lm5leHQgPSBpdGVtO1xyXG4gICAgICAgIG5leHQucHJldiA9IGl0ZW07XHJcbiAgICAgICAgaXRlbS5wcmV2ID0gcHJldjtcclxuICAgICAgICBpdGVtLm5leHQgPSBuZXh0O1xyXG4gICAgICAgIGlmIChhdCA9PT0gMClcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSBpdGVtO1xyXG4gICAgICAgIHJldHVybiArK3RoaXMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLnJlbW92ZUF0ID0gZnVuY3Rpb24gKGF0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2dldE5vZGUoYXQpO1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAvLyBvbmx5IDEgaXRlbSBsZWZ0IHRvIHJlbW92ZS5cclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLl9sYXN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpdGVtID09PSB0aGlzLl9maXJzdCkge1xyXG4gICAgICAgICAgICAvLyByZW1vdmluZyB0aGUgZmlyc3QgaXRlbS5cclxuICAgICAgICAgICAgaXRlbS5uZXh0LnByZXYgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0ID0gaXRlbS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpdGVtID09PSB0aGlzLl9sYXN0KSB7XHJcbiAgICAgICAgICAgIC8vIHJlbW92aW5nIHRoZSBsYXN0IGl0ZW0uXHJcbiAgICAgICAgICAgIGl0ZW0ubmV4dCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaXRlbS5wcmV2Lm5leHQgPSBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcmVtb3ZpbmcgaXRlbSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBsaXN0XHJcbiAgICAgICAgICAgIGl0ZW0ucHJldi5uZXh0ID0gaXRlbS5uZXh0O1xyXG4gICAgICAgICAgICBpdGVtLm5leHQucHJldiA9IGl0ZW0ucHJldjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0tdGhpcy5sZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLl9sYXN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlua2VkTGlzdDtcclxufSgpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBMaW5rZWRMaXN0O1xyXG52YXIgTGlua2VkTGlzdE5vZGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGlua2VkTGlzdE5vZGUodmFsKSB7XHJcbiAgICAgICAgdGhpcy52YWwgPSB2YWw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gTGlua2VkTGlzdE5vZGU7XHJcbn0oKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmtlZExpc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBMaXN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG5ldyBsaXN0IG9iamVjdC5cclxuICAgICAqIFV0aWxpemVzIGEgbm9ybWFsIGFycmF5IGJlaGluZCB0aGUgc2NlbmVzIGFuZCBuYXRpdmUgZnVuY3Rpb25zIHdoZW5ldmVyIHBvc3NpYmxlLFxyXG4gICAgICogYnV0IHdpdGggZnVuY3Rpb25zIGtub3duIGZvciBhIExpc3QuXHJcbiAgICAgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2UgYXJyYXkgZnJvbSB3aGljaCB0byBjcmVhdGUgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIExpc3Qoc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlIHx8IFtdO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KExpc3QucHJvdG90eXBlLCBcImxlbmd0aFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9zb3VyY2UubGVuZ3RoOyB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBsaXN0IGFzIGEgYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gb2JqZWN0IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIGJlIGFkZGVkIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnB1c2goaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5hZGQgPSBmdW5jdGlvbiAoc291cmNlLCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuYWRkKGl0ZW0pLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGVjaWZpZWQgY29sbGVjdGlvbiB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gd2hvc2UgZWxlbWVudHMgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmFkZFJhbmdlID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24pIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSAoY29sbGVjdGlvbiBpbnN0YW5jZW9mIExpc3QpID8gY29sbGVjdGlvbi50b0FycmF5KCkgOiBjb2xsZWN0aW9uO1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMuX3NvdXJjZSwgaXRlbXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QuYWRkUmFuZ2UgPSBmdW5jdGlvbiAoc291cmNlLCBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuYWRkUmFuZ2UoY29sbGVjdGlvbikudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIG5ldyByZWFkIG9ubHkgaW5zdGFuY2Ugb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmFzUmVhZE9ubHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KE9iamVjdC5mcmVlemUodGhpcy5fc291cmNlLnNsaWNlKCkpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIHRoZSBzcGVjaWZpZWQgYWN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UuZm9yRWFjaChjYWxsYmFjayk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5mb3JFYWNoID0gZnVuY3Rpb24gKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBuZXcgTGlzdChzb3VyY2UpLmZvckVhY2goY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU2VhcmNoZXMgZm9yIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGFuZCByZXR1cm5zIHRoZSB6ZXJvLWJhc2VkIGluZGV4IG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIHdpdGhpbiB0aGUgc3BlY2lmaWVkIHJhbmdlIG9mIGVsZW1lbnRzIGluIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGl0ZW0gVGhlIG9iamVjdCB0byBsb2NhdGUgaW4gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHNlYXJjaC5cclxuICAgICAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBzZWN0aW9uIHRvIHNlYXJjaC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIChpdGVtLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHZvaWQgMCkgeyBpbmRleCA9IDA7IH1cclxuICAgICAgICBpZiAoY291bnQgPT09IHZvaWQgMCkgeyBjb3VudCA9IHRoaXMubGVuZ3RoOyB9XHJcbiAgICAgICAgdmFyIGlkeCA9IHRoaXMuX3NvdXJjZS5pbmRleE9mKGl0ZW0sIGluZGV4KTtcclxuICAgICAgICBpZiAoaWR4ID4gY291bnQgLSBpbmRleCArIDEpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gaWR4O1xyXG4gICAgfTtcclxuICAgIExpc3QuaW5kZXhPZiA9IGZ1bmN0aW9uIChzb3VyY2UsIGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gMDsgfVxyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gc291cmNlLmxlbmd0aDsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmluZGV4T2YoaXRlbSwgaW5kZXgsIGNvdW50KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNlYXJjaGVzIGZvciB0aGUgc3BlY2lmaWVkIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgemVyby1iYXNlZCBpbmRleCBvZiB0aGUgbGFzdCBvY2N1cnJlbmNlIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgZWxlbWVudHMgaW4gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBzdGFydGluZyBpbmRleCBvZiB0aGUgYmFja3dhcmQgc2VhcmNoLlxyXG4gICAgICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIHNlY3Rpb24gdG8gc2VhcmNoLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIChpdGVtLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHZvaWQgMCkgeyBpbmRleCA9IHRoaXMubGVuZ3RoIC0gMTsgfVxyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gdGhpcy5sZW5ndGg7IH1cclxuICAgICAgICB2YXIgaWR4ID0gdGhpcy5fc291cmNlLmxhc3RJbmRleE9mKGl0ZW0sIGluZGV4KTtcclxuICAgICAgICBpZiAoaWR4IDwgaW5kZXggKyAxIC0gY291bnQpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gaWR4O1xyXG4gICAgfTtcclxuICAgIExpc3QubGFzdEluZGV4T2YgPSBmdW5jdGlvbiAoc291cmNlLCBpdGVtLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHZvaWQgMCkgeyBpbmRleCA9IHRoaXMubGVuZ3RoIC0gMTsgfVxyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gdGhpcy5sZW5ndGg7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5sYXN0SW5kZXhPZihpdGVtLCBpbmRleCwgY291bnQpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0cyBhbiBlbGVtZW50IGludG8gdGhlIGxpc3QgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBpbmRleCBhdCB3aGljaCBpdGVtIHNob3VsZCBiZSBpbnNlcnRlZC5cclxuICAgICAqIEBwYXJhbSBpdGVtIFRoZSBvYmplY3QgdG8gaW5zZXJ0LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0Lmluc2VydCA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuaW5zZXJ0KGluZGV4LCBpdGVtKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnRzIHRoZSBlbGVtZW50cyBvZiBhIGNvbGxlY3Rpb24gaW50byB0aGUgbGlzdCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxyXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSB6ZXJvLWJhc2VkIGluZGV4IGF0IHdoaWNoIHRoZSBuZXcgZWxlbWVudHMgc2hvdWxkIGJlIGluc2VydGVkLlxyXG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gd2hvc2UgZWxlbWVudHMgc2hvdWxkIGJlIGluc2VydGVkIGludG8gdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmluc2VydFJhbmdlID0gZnVuY3Rpb24gKGluZGV4LCBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gKGNvbGxlY3Rpb24gaW5zdGFuY2VvZiBMaXN0KSA/IGNvbGxlY3Rpb24udG9BcnJheSgpIDogY29sbGVjdGlvbjtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMuX3NvdXJjZSwgbmV3IEFycmF5KGluZGV4LCAwKS5jb25jYXQoaXRlbXMpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0Lmluc2VydFJhbmdlID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5pbnNlcnRSYW5nZShpbmRleCwgY29sbGVjdGlvbikudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxyXG4gICAgICogQHBhcmFtIGluZGV4IEdldHMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZVtpbmRleF07XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggU2V0cyB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxyXG4gICAgICogQHBhcmFtIGl0ZW0gVGhlIG9iamVjdCB0byBzZXQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gdGhpcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluZGV4IHdhcyBvdXQgb2YgcmFuZ2UuIE11c3QgYmUgbm9uLW5lZ2F0aXZlIGFuZCBsZXNzIHRoYW4gdGhlIHNpemUgb2YgdGhlIGNvbGxlY3Rpb24uXCIpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlW2luZGV4XSA9IGl0ZW07XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGEgc3BlY2lmaWMgb2JqZWN0IGZyb20gdGhlIExpc3QoT2bigIJUKS5cclxuICAgICAqIEBwYXJhbSBpdGVtIFRoZSBvYmplY3QgdG8gcmVtb3ZlIGZyb20gdGhlIExpc3QoT2bigIJUKS5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVBdCh0aGlzLl9zb3VyY2UuaW5kZXhPZihpdGVtKSk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZW1vdmUgPSBmdW5jdGlvbiAoc291cmNlLCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlKGl0ZW0pLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIHRoZSBlbGVtZW50cyB0aGF0IG1hdGNoIHRoZSBjb25kaXRpb25zIGRlZmluZWQgYnkgdGhlIHNwZWNpZmllZCBwcmVkaWNhdGUuXHJcbiAgICAgKiBAcGFyYW0gcHJlZGljYXRlIFRoZSBwcmVkaWNhdGUgZGVsZWdhdGUgdGhhdCBkZWZpbmVzIHRoZSBjb25kaXRpb25zIG9mIHRoZSBlbGVtZW50cyB0byByZW1vdmUuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZUFsbCA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAoIXByZWRpY2F0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKDApOyAvLyBzcGxpY2UgcmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIGVtcHR5IGFycmF5IGxldCdzIHVzIGtlZXAgdGhlIHJlZmVyZW5jZVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGkgPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJlZGljYXRlKHRoaXMuX3NvdXJjZVtpXSwgaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnJlbW92ZUFsbCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLnJlbW92ZUFsbChwcmVkaWNhdGUpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleCBvZiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBpbmRleCBvZiB0aGUgZWxlbWVudCB0byByZW1vdmUuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZUF0ID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXggb2YgdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgaW5kZXggb2YgdGhlIGVsZW1lbnQgdG8gcmVtb3ZlLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnJlbW92ZUF0ID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZW1vdmVBdChpbmRleCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhIHJhbmdlIG9mIGVsZW1lbnRzIGZyb20gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHJhbmdlIG9mIGVsZW1lbnRzIHRvIHJlbW92ZS5cclxuICAgICAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHJlbW92ZS5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmVtb3ZlUmFuZ2UgPSBmdW5jdGlvbiAoaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgY291bnQgKyBpbmRleCAtIDEpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QucmVtb3ZlUmFuZ2UgPSBmdW5jdGlvbiAoc291cmNlLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZW1vdmVSYW5nZShpbmRleCwgY291bnQpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIGVsZW1lbnRzIGZyb20gdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5jbGVhciA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5jbGVhcigpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBudW1iZXIgdGhhdCByZXByZXNlbnRzIGhvdyBtYW55IGVsZW1lbnRzIGluIHRoZSBzcGVjaWZpZWQgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuICAgICAqIElmIHByZWRpY2F0ZSBpcyBvbWl0dGVkLCB0aGUgZnVsbCBzaXplIG9mIHRoZSBsaXN0IHdpbGwgYmUgcmV0dXJuZWQuXHJcbiAgICAgKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5jb3VudCA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAoIXByZWRpY2F0ZSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZS5sZW5ndGg7XHJcbiAgICAgICAgdmFyIHN1bSA9IDA7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSlcclxuICAgICAgICAgICAgICAgIHN1bSsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICB9O1xyXG4gICAgTGlzdC5jb3VudCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmNvdW50KHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXZlcnNlcyB0aGUgb3JkZXIgb2YgdGhlIGVsZW1lbnRzIGluIHRoZSBzcGVjaWZpZWQgcmFuZ2UuXHJcbiAgICAgKiBJZiBpbmRleCBhbmQgY291bnQgaXMgb21pdHRlZCB0aGUgZW50aXJlIGxpc3Qgd2lsbCBiZSByZXZlcnNlZC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBzdGFydGluZyBpbmRleCBvZiB0aGUgcmFuZ2UgdG8gcmV2ZXJzZS5cclxuICAgICAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSByYW5nZSB0byByZXZlcnNlLiBJZiBub3QgcHJvdmlkZWQgaXQgd2lsbCBkZWZhdWx0IHRvIGVuZCBvZiB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uIChpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoKFV0aWwuaXNVbmRlZmluZWQoaW5kZXgpICYmIFV0aWwuaXNVbmRlZmluZWQoY291bnQpKSB8fCAoaW5kZXggPT09IDAgJiYgY291bnQgPj0gdGhpcy5sZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIC8vIHJldmVyc2UgdGhlIGVudGlyZSBsaXN0XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZS5yZXZlcnNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChjb3VudCkpXHJcbiAgICAgICAgICAgICAgICBjb3VudCA9IHRoaXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgY291bnQgKyBpbmRleCAtIDEpO1xyXG4gICAgICAgICAgICBhcnIucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmluc2VydFJhbmdlKGluZGV4LCBhcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnJldmVyc2UgPSBmdW5jdGlvbiAoc291cmNlLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZXZlcnNlKGluZGV4LCBjb3VudCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucmFuZ2UgPSBmdW5jdGlvbiAoc3RhcnQsIGNvdW50KSB7XHJcbiAgICAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IHN0YXJ0ICsgY291bnQ7IGkrKylcclxuICAgICAgICAgICAgYXJyLnB1c2goaSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KGFycik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpc3Q7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGlzdDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGxpbmtlZExpc3RfMSA9IHJlcXVpcmUoXCIuL2xpbmtlZExpc3RcIik7XHJcbnZhciBRdWV1ZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBRdWV1ZSgpIHtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IG5ldyBsaW5rZWRMaXN0XzEuZGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgUXVldWUucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5pbnNlcnQodmFsKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGggPSB0aGlzLl9saXN0Lmxlbmd0aDtcclxuICAgIH07XHJcbiAgICBRdWV1ZS5wcm90b3R5cGUuZGVxdWV1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2xpc3QuZ2V0KDApO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5fbGlzdC5yZW1vdmVBdCgwKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUXVldWU7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gUXVldWU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXF1ZXVlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgbGlua2VkTGlzdF8xID0gcmVxdWlyZShcIi4vbGlua2VkTGlzdFwiKTtcclxudmFyIFN0YWNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFN0YWNrKCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSBuZXcgbGlua2VkTGlzdF8xLmRlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIFN0YWNrLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QuaW5zZXJ0QXQoMCwgdmFsKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGggPSB0aGlzLl9saXN0Lmxlbmd0aDtcclxuICAgIH07XHJcbiAgICBTdGFjay5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5wZWVrKCk7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLl9saXN0LnJlbW92ZUF0KDApO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfTtcclxuICAgIFN0YWNrLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0LmdldCgwKTtcclxuICAgIH07XHJcbiAgICBTdGFjay5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5jbGVhcigpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTdGFjaztcclxufSgpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBTdGFjaztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhY2suanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbi8qKlxyXG4gKiBTaG9ydGhhbmQgZnVuY3Rpb24gdG8gY3JlYXRlIGEgRGF0ZXNIZWxwZXIgb2JqZWN0LlxyXG4gKiBAcGFyYW0gbnVtYmVyIFRoZSBkYXRlIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gKi9cclxuZnVuY3Rpb24gRGF0ZXMoZGF0ZSkgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpOyB9XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRGF0ZXM7XHJcbnZhciBEYXRlc0hlbHBlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBEYXRlc0hlbHBlcihkYXRlKSB7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZTtcclxuICAgIH1cclxuICAgIERhdGVzSGVscGVyLnRvRGF0ZSA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoZGF0ZSkpXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGlmICh1dGlsLmlzU3RyaW5nKGRhdGUpKVxyXG4gICAgICAgICAgICBkYXRlID0gRGF0ZS5wYXJzZShkYXRlKTtcclxuICAgICAgICBpZiAodXRpbC5pc051bWJlcihkYXRlKSlcclxuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3ZWl0aGVyIHRoZSBkYXRlIGlzIGluIGJldHdlZW4gdHdvIG51bWJlcnMuXHJcbiAgICAgKiBAcGFyYW0gbG93ZXIgVGhlIGxvd2VyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqIEBwYXJhbSB1cHBlciBUaGUgdXBwZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICovXHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYmV0d2VlbiA9IGZ1bmN0aW9uIChsb3dlciwgdXBwZXIpIHtcclxuICAgICAgICByZXR1cm4gRGF0ZXNIZWxwZXIuYmV0d2Vlbih0aGlzLmRhdGUsIGxvd2VyLCB1cHBlcik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdlaXRoZXIgYSBkYXRlIGlzIGluIGJldHdlZW4gdHdvIG51bWJlcnMuXHJcbiAgICAgKiBAcGFyYW0gZGF0ZSBUaGUgZGF0ZSB3aGljaCB0byBjb21wYXJlIHdpdGguXHJcbiAgICAgKiBAcGFyYW0gbG93ZXIgVGhlIGxvd2VyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqIEBwYXJhbSB1cHBlciBUaGUgdXBwZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICovXHJcbiAgICBEYXRlc0hlbHBlci5iZXR3ZWVuID0gZnVuY3Rpb24gKGRhdGUsIGxvd2VyLCB1cHBlcikge1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGxvd2VyKSlcclxuICAgICAgICAgICAgbG93ZXIgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKHVwcGVyKSlcclxuICAgICAgICAgICAgdXBwZXIgPSBuZXcgRGF0ZSg5OTk5OTk5OTk5OTk5KTtcclxuICAgICAgICByZXR1cm4gKGxvd2VyIDw9IGRhdGUgJiYgZGF0ZSA8PSB1cHBlcik7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZFllYXJzID0gZnVuY3Rpb24gKHllYXJzKSB7IHJldHVybiB0aGlzLmFkZE1vbnRocyh5ZWFycyAqIDEyKTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRNb250aHMgPSBmdW5jdGlvbiAobW9udGhzKSB7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNldE1vbnRoKHRoaXMuZGF0ZS5nZXRNb250aCgpICsgbW9udGhzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkV2Vla3MgPSBmdW5jdGlvbiAod2VlaykgeyByZXR1cm4gdGhpcy5hZGREYXlzKHdlZWsgKiA3KTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGREYXlzID0gZnVuY3Rpb24gKGRheXMpIHsgcmV0dXJuIHRoaXMuYWRkSG91cnMoZGF5cyAqIDI0KTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRIb3VycyA9IGZ1bmN0aW9uIChob3VycykgeyByZXR1cm4gdGhpcy5hZGRNaW51dGVzKGhvdXJzICogNjApOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZE1pbnV0ZXMgPSBmdW5jdGlvbiAobWludXRlcykgeyByZXR1cm4gdGhpcy5hZGRTZWNvbmRzKG1pbnV0ZXMgKiA2MCk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkU2Vjb25kcyA9IGZ1bmN0aW9uIChzZWNvbmRzKSB7IHJldHVybiB0aGlzLmFkZE1pbGxpc2Vjb25kcyhzZWNvbmRzICogMTAwMCk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkTWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKG1pbGxpc2Vjb25kcykge1xyXG4gICAgICAgIHRoaXMuZGF0ZS5zZXRNaWxsaXNlY29uZHModGhpcy5kYXRlLmdldE1pbGxpc2Vjb25kcygpICsgbWlsbGlzZWNvbmRzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRZZWFycyA9IGZ1bmN0aW9uIChkYXRlLCB5ZWFycykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZFllYXJzKHllYXJzKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkTW9udGhzID0gZnVuY3Rpb24gKGRhdGUsIG1vbnRocykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZE1vbnRocyhtb250aHMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRXZWVrcyA9IGZ1bmN0aW9uIChkYXRlLCB3ZWVrKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkV2Vla3Mod2VlaykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZERheXMgPSBmdW5jdGlvbiAoZGF0ZSwgZGF5cykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZERheXMoZGF5cykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZEhvdXJzID0gZnVuY3Rpb24gKGRhdGUsIGhvdXJzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkSG91cnMoaG91cnMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRNaW51dGVzID0gZnVuY3Rpb24gKGRhdGUsIG1pbnV0ZXMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRNaW51dGVzKG1pbnV0ZXMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRTZWNvbmRzID0gZnVuY3Rpb24gKGRhdGUsIHNlY29uZHMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRTZWNvbmRzKHNlY29uZHMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRNaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAoZGF0ZSwgbWlsbGlzZWNvbmRzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkTWlsbGlzZWNvbmRzKG1pbGxpc2Vjb25kcykuZGF0ZTsgfTtcclxuICAgIHJldHVybiBEYXRlc0hlbHBlcjtcclxufSgpKTtcclxuZXhwb3J0cy5EYXRlc0hlbHBlciA9IERhdGVzSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRlcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxuLyoqXHJcbiAqIFNob3J0aGFuZCBmdW5jdGlvbiB0byBjcmVhdGUgYSBOdW1iZXJzSGVscGVyIG9iamVjdC5cclxuICogQHBhcmFtIG51bWJlciBUaGUgbnVtYmVyIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gKi9cclxuZnVuY3Rpb24gTnVtYmVycyhudW0pIHsgcmV0dXJuIG5ldyBOdW1iZXJzSGVscGVyKG51bSk7IH1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBOdW1iZXJzO1xyXG52YXIgTnVtYmVyc0hlbHBlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBOdW1iZXJzSGVscGVyIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBudW1iZXIgVGhlIG51bWJlciBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gTnVtYmVyc0hlbHBlcihudW0pIHtcclxuICAgICAgICB0aGlzLm51bSA9IG51bTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3ZWl0aGVyIHRoZSBudW1iZXIgaXMgaW4gYmV0d2VlbiB0d28gbnVtYmVycy5cclxuICAgICAqIEBwYXJhbSBsb3dlciBUaGUgbG93ZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICogQHBhcmFtIHVwcGVyIFRoZSB1cHBlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKi9cclxuICAgIE51bWJlcnNIZWxwZXIucHJvdG90eXBlLmJldHdlZW4gPSBmdW5jdGlvbiAobG93ZXIsIHVwcGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcnNIZWxwZXIuYmV0d2Vlbih0aGlzLm51bSwgbG93ZXIsIHVwcGVyKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2VpdGhlciBhIG51bWJlciBpcyBpbiBiZXR3ZWVuIHR3byBudW1iZXJzLlxyXG4gICAgICogQHBhcmFtIG51bWJlciBUaGUgbnVtYmVyIHdoaWNoIHRvIGNvbXBhcmUgd2l0aC5cclxuICAgICAqIEBwYXJhbSBsb3dlciBUaGUgbG93ZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICogQHBhcmFtIHVwcGVyIFRoZSB1cHBlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKi9cclxuICAgIE51bWJlcnNIZWxwZXIuYmV0d2VlbiA9IGZ1bmN0aW9uIChudW0sIGxvd2VyLCB1cHBlcikge1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGxvd2VyKSlcclxuICAgICAgICAgICAgbG93ZXIgPSBOdW1iZXIuTUlOX1ZBTFVFO1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKHVwcGVyKSlcclxuICAgICAgICAgICAgdXBwZXIgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIHJldHVybiAobG93ZXIgPD0gbnVtICYmIG51bSA8PSB1cHBlcik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdlaXRoZXIgdGhlIG51bWJlciBpcyBpbiBhbiBhcnJheS5cclxuICAgICAqIEBwYXJhbSBudW1iZXJzIFRoZSBhcnJheSBvZiBudW1iZXJzIHRvIGNvbXBhcmUgd2l0aC5cclxuICAgICAqL1xyXG4gICAgTnVtYmVyc0hlbHBlci5wcm90b3R5cGUuaW4gPSBmdW5jdGlvbiAobnVtYmVycykge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXJzSGVscGVyLmluKHRoaXMubnVtLCBudW1iZXJzKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2VpdGhlciBhIG51bWJlciBpcyBpbiBhbiBhcnJheS5cclxuICAgICAqIEBwYXJhbSBudW1iZXIgVGhlIG51bWJlciB3aGljaCB0byBjb21wYXJlIHdpdGguXHJcbiAgICAgKiBAcGFyYW0gbnVtYmVycyBUaGUgYXJyYXkgb2YgbnVtYmVycyB0byBjb21wYXJlIHdpdGguXHJcbiAgICAgKi9cclxuICAgIE51bWJlcnNIZWxwZXIuaW4gPSBmdW5jdGlvbiAobnVtLCBudW1iZXJzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1iZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChudW1iZXJzW2ldID09IG51bSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTYWZlbHkgcm91bmQgbnVtYmVycyBpbiBKUyB3aXRob3V0IGhpdHRpbmcgaW1wcmVjaXNpb25zIG9mIGZsb2F0aW5nLXBvaW50IGFyaXRobWV0aWNzXHJcbiAgICAgKiBLaW5kbHkgYm9ycm93ZWQgZnJvbSBBbmd1bGFySlM6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvYmxvYi9nM192MV8zL3NyYy9uZy9maWx0ZXIvZmlsdGVycy5qcyNMMTczXHJcbiAgICAgKiBAcGFyYW0gcHJlY2lzaW9uIEhvdyBtYW55IGRlY2ltYWxzIHRoZSBudW1iZXIgc2hvdWxkIGhhdmUuXHJcbiAgICAgKi9cclxuICAgIE51bWJlcnNIZWxwZXIucHJvdG90eXBlLnRvRml4ZWQgPSBmdW5jdGlvbiAocHJlY2lzaW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcnNIZWxwZXIudG9GaXhlZCh0aGlzLm51bSwgcHJlY2lzaW9uKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNhZmVseSByb3VuZCBudW1iZXJzIGluIEpTIHdpdGhvdXQgaGl0dGluZyBpbXByZWNpc2lvbnMgb2YgZmxvYXRpbmctcG9pbnQgYXJpdGhtZXRpY3NcclxuICAgICAqIEtpbmRseSBib3Jyb3dlZCBmcm9tIEFuZ3VsYXJKUzogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9ibG9iL2czX3YxXzMvc3JjL25nL2ZpbHRlci9maWx0ZXJzLmpzI0wxNzNcclxuICAgICAqIEBwYXJhbSBwcmVjaXNpb24gSG93IG1hbnkgZGVjaW1hbHMgdGhlIG51bWJlciBzaG91bGQgaGF2ZS5cclxuICAgICAqL1xyXG4gICAgTnVtYmVyc0hlbHBlci50b0ZpeGVkID0gZnVuY3Rpb24gKG51bSwgcHJlY2lzaW9uKSB7XHJcbiAgICAgICAgcmV0dXJuICsoTWF0aC5yb3VuZCgrKG51bS50b1N0cmluZygpICsgXCJlXCIgKyBwcmVjaXNpb24pKS50b1N0cmluZygpICsgXCJlXCIgKyAtcHJlY2lzaW9uKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTnVtYmVyc0hlbHBlcjtcclxufSgpKTtcclxuZXhwb3J0cy5OdW1iZXJzSGVscGVyID0gTnVtYmVyc0hlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bnVtYmVycy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuLyoqXHJcbiAqIFNob3J0aGFuZCBmdW5jdGlvbiB0byBjcmVhdGUgYSBTdHJpbmdzSGVscGVyIG9iamVjdC5cclxuICogQHBhcmFtIG51bWJlciBUaGUgc3RyaW5nIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gKi9cclxuZnVuY3Rpb24gU3RyaW5ncyhzdHIpIHsgcmV0dXJuIG5ldyBTdHJpbmdzSGVscGVyKHN0cik7IH1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBTdHJpbmdzO1xyXG52YXIgU3RyaW5nc0hlbHBlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBTdHJpbmdzSGVscGVyIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBzdHIgVGhlIHN0cmluZyBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gU3RyaW5nc0hlbHBlcihzdHIpIHtcclxuICAgICAgICB0aGlzLnN0ciA9IHN0cjtcclxuICAgIH1cclxuICAgIFN0cmluZ3NIZWxwZXIucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFyZ3NbX2kgLSAwXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBTdHJpbmdzSGVscGVyLmZvcm1hdC5hcHBseSh1bmRlZmluZWQsIFt0aGlzLnN0cl0uY29uY2F0KGFyZ3MpKTtcclxuICAgIH07XHJcbiAgICBTdHJpbmdzSGVscGVyLmZvcm1hdCA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiXFxcXHtcIiArIGkgKyBcIlxcXFx9XCIsIFwiZ1wiKTtcclxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocmVnZXgsIGFyZ3NbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTdHJpbmdzSGVscGVyO1xyXG59KCkpO1xyXG5leHBvcnRzLlN0cmluZ3NIZWxwZXIgPSBTdHJpbmdzSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdHJpbmdzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgRmlsdGVySXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEZpbHRlckl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gRmlsdGVySXRlcmF0b3Ioc291cmNlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChjYWxsYmFjayA9PT0gdm9pZCAwKSB7IGNhbGxiYWNrID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG4gICAgRmlsdGVySXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGl0ZW07XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBpdGVtID0gdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChpdGVtKSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY2FsbGJhY2soaXRlbSwgdGhpcy5faWR4KSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH0gd2hpbGUgKCFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0pKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRmlsdGVySXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRmlsdGVySXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIEl0ZXJhdG9yID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEl0ZXJhdG9yKHNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuX2lkeCA9IC0xO1xyXG4gICAgICAgIHRoaXMuX2J1ZmZlcnMgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9yZXZlcnNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgIH1cclxuICAgIEl0ZXJhdG9yLnByb3RvdHlwZS5nZXRJdGVyYXRvckZyb21QaXBlbGluZSA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiB0eXBlKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB2YXIgc291cmNlID0gdGhpcztcclxuICAgICAgICB3aGlsZSAoISgoc291cmNlID0gc291cmNlLl9zb3VyY2UpIGluc3RhbmNlb2YgdHlwZSkpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcclxuICAgIH07XHJcbiAgICBJdGVyYXRvci5wcm90b3R5cGUuX25leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG4gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NvdXJjZSBpbnN0YW5jZW9mIEl0ZXJhdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2UubmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JldmVyc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faWR4IDwgdGhpcy5fc291cmNlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG4gPSB0aGlzLl9zb3VyY2VbdGhpcy5fc291cmNlLmxlbmd0aCAtIDEgLSAoKyt0aGlzLl9pZHgpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pZHggPCB0aGlzLl9zb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbiA9IHRoaXMuX3NvdXJjZVsrK3RoaXMuX2lkeF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkeCA9PSB0aGlzLl9zb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lkeCA9IC0xOyAvLyB3ZSBmaW5pc2hlZCwgcmVzZXQgdGhlIGNvdW50ZXJcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9O1xyXG4gICAgSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7IH07XHJcbiAgICBJdGVyYXRvci5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fcmV2ZXJzZWQgPSAhdGhpcy5fcmV2ZXJzZWQ7IH07XHJcbiAgICByZXR1cm4gSXRlcmF0b3I7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWl0ZXJhdG9yLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgZmlsdGVyXzEgPSByZXF1aXJlKFwiLi9maWx0ZXJcIik7XHJcbnZhciBtYXBfMSA9IHJlcXVpcmUoXCIuL21hcFwiKTtcclxudmFyIG9yZGVyXzEgPSByZXF1aXJlKFwiLi9vcmRlclwiKTtcclxudmFyIHNraXBfMSA9IHJlcXVpcmUoXCIuL3NraXBcIik7XHJcbnZhciBza2lwV2hpbGVfMSA9IHJlcXVpcmUoXCIuL3NraXBXaGlsZVwiKTtcclxudmFyIHRha2VfMSA9IHJlcXVpcmUoXCIuL3Rha2VcIik7XHJcbnZhciB0YWtlV2hpbGVfMSA9IHJlcXVpcmUoXCIuL3Rha2VXaGlsZVwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIExpbnEgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGlucShzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSAoc291cmNlIGluc3RhbmNlb2YgaXRlcmF0b3JfMS5kZWZhdWx0KVxyXG4gICAgICAgICAgICA/IHNvdXJjZVxyXG4gICAgICAgICAgICA6IG5ldyBtYXBfMS5kZWZhdWx0KHNvdXJjZSwgZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGl0ZW07IH0pO1xyXG4gICAgfVxyXG4gICAgTGlucS5wcm90b3R5cGUuX21ha2VWYWx1ZVByZWRpY2F0ZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAoVXRpbC5pc1N0cmluZyhwcmVkaWNhdGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWVsZF8xID0gcHJlZGljYXRlO1xyXG4gICAgICAgICAgICBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHhbZmllbGRfMV07IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChVdGlsLmlzVW5kZWZpbmVkKHByZWRpY2F0ZSkpIHtcclxuICAgICAgICAgICAgcHJlZGljYXRlID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJlZGljYXRlO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLl9tYWtlQm9vbFByZWRpY2F0ZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAoVXRpbC5pc1N0cmluZyhwcmVkaWNhdGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWVsZF8yID0gcHJlZGljYXRlO1xyXG4gICAgICAgICAgICBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHhbZmllbGRfMl0gPT09IHRydWU7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChVdGlsLmlzVW5kZWZpbmVkKHByZWRpY2F0ZSkpIHtcclxuICAgICAgICAgICAgcHJlZGljYXRlID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJlZGljYXRlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG5ldyBzZXF1ZW5jZSB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeSBlbGVtZW50IGluIHRoaXMgYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhbiBlbGVtZW50IG9mIHRoZSBuZXcgc2VxdWVuY2VcclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyBtYXBfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgY2FsbGJhY2spKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBuZXcgc2VxdWVuY2Ugd2l0aCB0aGUgcmVzdWx0cyBvZiBjYWxsaW5nIGEgcHJvdmlkZWQgZnVuY3Rpb24gb24gZXZlcnkgZWxlbWVudCBpbiB0aGlzIGFycmF5LlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIEZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgYW4gZWxlbWVudCBvZiB0aGUgbmV3IHNlcXVlbmNlXHJcbiAgICAgKi9cclxuICAgIExpbnEubWFwID0gZnVuY3Rpb24gKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5tYXAoY2FsbGJhY2spLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEZpbHRlcnMgYSBzZXF1ZW5jZSBvZiB2YWx1ZXMgYmFzZWQgb24gYSBwcmVkaWNhdGUuXHJcbiAgICAgKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyBmaWx0ZXJfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgcHJlZGljYXRlKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBGaWx0ZXJzIGEgc2VxdWVuY2Ugb2YgdmFsdWVzIGJhc2VkIG9uIGEgcHJlZGljYXRlLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqL1xyXG4gICAgTGlucS5maWx0ZXIgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5maWx0ZXIocHJlZGljYXRlKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBGaWx0ZXJzIGEgc2VxdWVuY2Ugb2YgdmFsdWVzIGJhc2VkIG9uIGEgcHJlZGljYXRlLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUud2hlcmUgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyKHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBGaWx0ZXJzIGEgc2VxdWVuY2Ugb2YgdmFsdWVzIGJhc2VkIG9uIGEgcHJlZGljYXRlLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqL1xyXG4gICAgTGlucS53aGVyZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBMaW5xLmZpbHRlcihzb3VyY2UsIHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZlcnRzIHRoZSBvcmRlciBvZiB0aGUgZWxlbWVudHMgaW4gYSBzZXF1ZW5jZS5cclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UucmV2ZXJzZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIHNwZWNpZmllZCBudW1iZXIgb2YgY29udGlndW91cyBlbGVtZW50cyBmcm9tIHRoZSBzdGFydCBvZiBhIHNlcXVlbmNlLlxyXG4gICAgICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gcmV0dXJuLlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS50YWtlID0gZnVuY3Rpb24gKGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyB0YWtlXzEuZGVmYXVsdCh0aGlzLl9zb3VyY2UsIGNvdW50KSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3BlY2lmaWVkIG51bWJlciBvZiBjb250aWd1b3VzIGVsZW1lbnRzIGZyb20gdGhlIHN0YXJ0IG9mIGEgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZXR1cm4uXHJcbiAgICAgKi9cclxuICAgIExpbnEudGFrZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkudGFrZShjb3VudCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBlbGVtZW50cyBmcm9tIGEgc2VxdWVuY2UgYXMgbG9uZyBhcyBhIHNwZWNpZmllZCBjb25kaXRpb24gaXMgdHJ1ZS5cclxuICAgICAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLnRha2VXaGlsZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyB0YWtlV2hpbGVfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgcHJlZGljYXRlKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGVsZW1lbnRzIGZyb20gYSBzZXF1ZW5jZSBhcyBsb25nIGFzIGEgc3BlY2lmaWVkIGNvbmRpdGlvbiBpcyB0cnVlLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqL1xyXG4gICAgTGlucS50YWtlV2hpbGUgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkudGFrZVdoaWxlKHByZWRpY2F0ZSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQnlwYXNzZXMgYSBzcGVjaWZpZWQgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGEgc2VxdWVuY2UgYW5kIHRoZW4gcmV0dXJucyB0aGUgcmVtYWluaW5nIGVsZW1lbnRzLlxyXG4gICAgICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gc2tpcCBiZWZvcmUgcmV0dXJuaW5nIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLnNraXAgPSBmdW5jdGlvbiAoY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IHNraXBfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgY291bnQpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEJ5cGFzc2VzIGEgc3BlY2lmaWVkIG51bWJlciBvZiBlbGVtZW50cyBpbiBhIHNlcXVlbmNlIGFuZCB0aGVuIHJldHVybnMgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cclxuICAgICAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNraXAgYmVmb3JlIHJldHVybmluZyB0aGUgcmVtYWluaW5nIGVsZW1lbnRzLlxyXG4gICAgICovXHJcbiAgICBMaW5xLnNraXAgPSBmdW5jdGlvbiAoc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnNraXAoY291bnQpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEJ5cGFzc2VzIGVsZW1lbnRzIGluIGEgc2VxdWVuY2UgYXMgbG9uZyBhcyBhIHNwZWNpZmllZCBjb25kaXRpb24gaXMgdHJ1ZSBhbmQgdGhlbiByZXR1cm5zIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXHJcbiAgICAgKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5za2lwV2hpbGUgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShuZXcgc2tpcFdoaWxlXzEuZGVmYXVsdCh0aGlzLl9zb3VyY2UsIHByZWRpY2F0ZSkpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQnlwYXNzZXMgZWxlbWVudHMgaW4gYSBzZXF1ZW5jZSBhcyBsb25nIGFzIGEgc3BlY2lmaWVkIGNvbmRpdGlvbiBpcyB0cnVlIGFuZCB0aGVuIHJldHVybnMgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cclxuICAgICAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAgICAgKi9cclxuICAgIExpbnEuc2tpcFdoaWxlID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnNraXBXaGlsZShwcmVkaWNhdGUpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNvcnRzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGluIGFzY2VuZGluZyBvcmRlciBieSB1c2luZyBhIHNwZWNpZmllZCBjb21wYXJlci5cclxuICAgICAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgYSBrZXkgZnJvbSBhbiBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIGNvbXBhcmVyIEFuIElDb21wYXJlcjxhbnk+IHRvIGNvbXBhcmUga2V5cy5cclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUub3JkZXJCeSA9IGZ1bmN0aW9uIChrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yRm4gPSB0aGlzLl9tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpO1xyXG4gICAgICAgIHJldHVybiBuZXcgT3JkZXJlZExpbnEobmV3IG9yZGVyXzEuZGVmYXVsdCh0aGlzLl9zb3VyY2UsIHNlbGVjdG9yRm4sIGNvbXBhcmVyLCBmYWxzZSkpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU29ydHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgaW4gYXNjZW5kaW5nIG9yZGVyIGJ5IHVzaW5nIGEgc3BlY2lmaWVkIGNvbXBhcmVyLlxyXG4gICAgICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCBhIGtleSBmcm9tIGFuIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gICAgICovXHJcbiAgICBMaW5xLm9yZGVyQnkgPSBmdW5jdGlvbiAoc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkub3JkZXJCeShrZXlTZWxlY3RvciwgY29tcGFyZXIpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNvcnRzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAgICAgKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IGEga2V5IGZyb20gYW4gZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSBjb21wYXJlciBBbiBJQ29tcGFyZXI8YW55PiB0byBjb21wYXJlIGtleXMuXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLm9yZGVyQnlEZXNjID0gZnVuY3Rpb24gKGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICB2YXIgc2VsZWN0b3JGbiA9IHRoaXMuX21ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3Rvcik7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBPcmRlcmVkTGlucShuZXcgb3JkZXJfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgc2VsZWN0b3JGbiwgY29tcGFyZXIsIHRydWUpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNvcnRzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAgICAgKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IGEga2V5IGZyb20gYW4gZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSBjb21wYXJlciBBbiBJQ29tcGFyZXI8YW55PiB0byBjb21wYXJlIGtleXMuXHJcbiAgICAgKi9cclxuICAgIExpbnEub3JkZXJCeURlc2MgPSBmdW5jdGlvbiAoc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkub3JkZXJCeURlc2Moa2V5U2VsZWN0b3IsIGNvbXBhcmVyKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wdXRlcyB0aGUgc3VtIG9mIHRoZSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gICAgICogQHBhcmFtIHNlbGVjdG9yIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZWxlbWVudC5cclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUuc3VtID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHZhciBpLCBzdW0gPSAwLCBhcnIgPSB0aGlzLnRvQXJyYXkoKTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN1bSArPSBzZWxlY3RvcihhcnJbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ29tcHV0ZXMgdGhlIHN1bSBvZiB0aGUgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICAgICAqIEBwYXJhbSBzZWxlY3RvciBBIHRyYW5zZm9ybSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIExpbnEuc3VtID0gZnVuY3Rpb24gKHNvdXJjZSwgc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuc3VtKHNlbGVjdG9yKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENvbXB1dGVzIHRoZSBhdmVyYWdlIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICAgICAqIEBwYXJhbSBzZWxlY3RvclxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5hdmVyYWdlID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHZhciBpLCB0b3RhbCA9IDAsIGFyciA9IHRoaXMudG9BcnJheSgpO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdG90YWwgKz0gc2VsZWN0b3IoYXJyW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvdGFsIC8gYXJyLmxlbmd0aDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENvbXB1dGVzIHRoZSBhdmVyYWdlIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICAgICAqIEBhbGlhcyBhdmVyYWdlXHJcbiAgICAgKiBAcGFyYW0gc2VsZWN0b3JcclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUuYXZnID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmF2ZXJhZ2Uoc2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ29tcHV0ZXMgdGhlIGF2ZXJhZ2Ugb2YgYSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gICAgICogQHBhcmFtIHNlbGVjdG9yXHJcbiAgICAgKi9cclxuICAgIExpbnEuYXZlcmFnZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLmF2ZXJhZ2Uoc2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ29tcHV0ZXMgdGhlIGF2ZXJhZ2Ugb2YgYSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gICAgICogQGFsaWFzIGF2ZXJhZ2VcclxuICAgICAqIEBwYXJhbSBzZWxlY3RvclxyXG4gICAgICovXHJcbiAgICBMaW5xLmF2ZyA9IGZ1bmN0aW9uIChzb3VyY2UsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiBMaW5xLmF2ZXJhZ2Uoc291cmNlLCBzZWxlY3Rvcik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wdXRlcyB0aGUgbWluaW11bSBvZiBhIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gc2VsZWN0b3JcclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbi5hcHBseSh1bmRlZmluZWQsIHRoaXMudG9BcnJheSgpLm1hcChzZWxlY3RvcikpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ29tcHV0ZXMgdGhlIG1pbmltdW0gb2YgYSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gICAgICogQHBhcmFtIHNlbGVjdG9yXHJcbiAgICAgKi9cclxuICAgIExpbnEubWluID0gZnVuY3Rpb24gKHNvdXJjZSwgc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkubWluKHNlbGVjdG9yKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENvbXB1dGVzIHRoZSBtYXhpbXVtIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICAgICAqIEBwYXJhbSBzZWxlY3RvclxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KHVuZGVmaW5lZCwgdGhpcy50b0FycmF5KCkubWFwKHNlbGVjdG9yKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wdXRlcyB0aGUgbWF4aW11bSBvZiBhIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gc2VsZWN0b3JcclxuICAgICAqL1xyXG4gICAgTGlucS5tYXggPSBmdW5jdGlvbiAoc291cmNlLCBzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5tYXgoc2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2Ugc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi4gSWYgbm90IHByb3ZpZGVkLCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNlcXVlbmNlIGNvbnRhaW5zIGFueSBlbGVtZW50cy5cclxuICAgICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2UgZG9lcyBub3Qgc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5hbnkgPSBmdW5jdGlvbiAocHJlZGljYXRlLCBpbnZlcnQpIHtcclxuICAgICAgICBpZiAoaW52ZXJ0ID09PSB2b2lkIDApIHsgaW52ZXJ0ID0gZmFsc2U7IH1cclxuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaXMuZmlyc3QoZnVuY3Rpb24gKHgpIHsgcmV0dXJuICEhcHJlZGljYXRlKHgpICE9PSBpbnZlcnQ7IH0pICE9PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2Ugc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi4gSWYgbm90IHByb3ZpZGVkLCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNlcXVlbmNlIGNvbnRhaW5zIGFueSBlbGVtZW50cy5cclxuICAgICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2UgZG9lcyBub3Qgc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5xLmFueSA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICAgICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuYW55KHByZWRpY2F0ZSwgaW52ZXJ0KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbGwgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIG5vbmUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5hbGwgPSBmdW5jdGlvbiAocHJlZGljYXRlLCBpbnZlcnQpIHtcclxuICAgICAgICBpZiAoaW52ZXJ0ID09PSB2b2lkIDApIHsgaW52ZXJ0ID0gZmFsc2U7IH1cclxuICAgICAgICByZXR1cm4gISh0aGlzLmFueShwcmVkaWNhdGUsICFpbnZlcnQpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbGwgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIG5vbmUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5xLmFsbCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICAgICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuYWxsKHByZWRpY2F0ZSwgaW52ZXJ0KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1hdGNoaW5nIGl0ZW0gaW4gdGhlIGFycmF5LiBJZiB0aGVyZSBhcmUgc2V2ZXJhbCBtYXRjaGVzIGFuIGV4Y2VwdGlvbiB3aWxsIGJlIHRocm93blxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gICAgICogQHRocm93cyBFcnJvci5cclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUuc2luZ2xlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHZhciBhcnIgPSB0aGlzLmZpbHRlcihwcmVkaWNhdGUpLnRha2UoMikudG9BcnJheSgpO1xyXG4gICAgICAgIGlmIChhcnIubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBzZXF1ZW5jZSBpcyBlbXB0eS5cIik7XHJcbiAgICAgICAgaWYgKGFyci5sZW5ndGggPT0gMilcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGlucHV0IHNlcXVlbmNlIGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgZWxlbWVudC5cIik7XHJcbiAgICAgICAgaWYgKGFyci5sZW5ndGggPT0gMSlcclxuICAgICAgICAgICAgcmV0dXJuIGFyclswXTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXRjaGluZyBpdGVtIGluIHRoZSBhcnJheS4gSWYgdGhlcmUgYXJlIHNldmVyYWwgbWF0Y2hlcyBhbiBleGNlcHRpb24gd2lsbCBiZSB0aHJvd25cclxuICAgICAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICAgICAqIEB0aHJvd3MgRXJyb3JcclxuICAgICAqL1xyXG4gICAgTGlucS5zaW5nbGUgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5zaW5nbGUocHJlZGljYXRlKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGZpcnN0IG1hdGNoaW5nIGl0ZW0gaW4gdGhlIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5maXJzdCA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pOyB9XHJcbiAgICAgICAgdmFyIGFyciA9IHRoaXMuZmlsdGVyKHByZWRpY2F0ZSkudGFrZSgxKS50b0FycmF5KCk7XHJcbiAgICAgICAgaWYgKGFyci5sZW5ndGggPT0gMSlcclxuICAgICAgICAgICAgcmV0dXJuIGFyclswXTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBtYXRjaGluZyBpdGVtIGluIHRoZSBhcnJheS5cclxuICAgICAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICAgICAqL1xyXG4gICAgTGlucS5maXJzdCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfSk7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5maXJzdChwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbGFzdCBtYXRjaGluZyBpdGVtIGluIHRoZSBhcnJheS5cclxuICAgICAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUubGFzdCA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pOyB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpLmZpcnN0KHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBsYXN0IG1hdGNoaW5nIGl0ZW0gaW4gdGhlIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gICAgICovXHJcbiAgICBMaW5xLmxhc3QgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkubGFzdChwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgbGlzdCBvZiBpdGVtcyB0aGF0IGV4aXN0cyBpbiBhbGwgZGF0YXNldHMuXHJcbiAgICAgKiBAcGFyYW0gYSBUaGUgZmlyc3QgZGF0YXNldC5cclxuICAgICAqIEBwYXJhbSBiIFRoZSBzZWNvbmQgZGF0YXNldCB0byBiZSBjb21wYXJlZCB0by5cclxuICAgICAqIEBwYXJhbSBtb3JlIElmIHlvdSBoYXZlIGV2ZW4gbW9yZSBkYXRhc2V0IHRvIGNvbXBhcmUgdG8uXHJcbiAgICAgKi9cclxuICAgIExpbnEuaW50ZXJzZWN0ID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICB2YXIgbW9yZSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIG1vcmVbX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsaXN0cyA9IFtdLCByZXN1bHQgPSBbXTtcclxuICAgICAgICB2YXIgbGlzdCA9IChhIGluc3RhbmNlb2YgTGlucSkgPyBhIDogbmV3IExpbnEoVXRpbC5jYXN0KGEpKTtcclxuICAgICAgICBsaXN0cy5wdXNoKChiIGluc3RhbmNlb2YgTGlucSkgPyBiIDogbmV3IExpbnEoVXRpbC5jYXN0KGIpKSk7XHJcbiAgICAgICAgbW9yZS5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhc2V0KSB7XHJcbiAgICAgICAgICAgIGxpc3RzLnB1c2goKGRhdGFzZXQgaW5zdGFuY2VvZiBMaW5xKSA/IGRhdGFzZXQgOiBuZXcgTGlucShVdGlsLmNhc3QoZGF0YXNldCkpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIGV4aXN0cyA9IHRydWU7XHJcbiAgICAgICAgICAgIGxpc3RzLmZvckVhY2goZnVuY3Rpb24gKG90aGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW90aGVyLmNvbnRhaW5zKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoZXhpc3RzID0gZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKGV4aXN0cylcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBsaXN0IG9mIGl0ZW1zIHRoYXQgZXhpc3RzIGluIGFsbCBkYXRhc2V0cy5cclxuICAgICAqIEBwYXJhbSBvdGhlciBUaGUgb3RoZXIgZGF0YXNldCB0byBiZSBjb21wYXJlZCB0by5cclxuICAgICAqIEBwYXJhbSBtb3JlIElmIHlvdSBoYXZlIGV2ZW4gbW9yZSBkYXRhc2V0IHRvIGNvbXBhcmUgdG8uXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLmludGVyc2VjdCA9IGZ1bmN0aW9uIChvdGhlcikge1xyXG4gICAgICAgIHZhciBtb3JlID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgbW9yZVtfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKExpbnEuaW50ZXJzZWN0LmFwcGx5KExpbnEsIFt0aGlzLCBvdGhlcl0uY29uY2F0KG1vcmUpKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBsaXN0IG9mIGl0ZW1zIHRoYXQgb25seSBleGlzdHMgaW4gb25lIG9mIHRoZSBkYXRhc2V0cy5cclxuICAgICAqIEBwYXJhbSBhIFRoZSBmaXJzdCBkYXRhc2V0LlxyXG4gICAgICogQHBhcmFtIGIgVGhlIHNlY29uZCBkYXRhc2V0LlxyXG4gICAgICogQHBhcmFtIG1vcmUgSWYgeW91IGhhdmUgZXZlbiBtb3JlIGRhdGFzZXQgdG8gY29tcGFyZSB0by5cclxuICAgICAqL1xyXG4gICAgTGlucS5leGNlcHQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciBtb3JlID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgbW9yZVtfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxpc3RzID0gW10sIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGxpc3RzLnB1c2goKGEgaW5zdGFuY2VvZiBMaW5xKSA/IGEgOiBuZXcgTGlucShVdGlsLmNhc3QoYSkpKTtcclxuICAgICAgICBsaXN0cy5wdXNoKChiIGluc3RhbmNlb2YgTGlucSkgPyBiIDogbmV3IExpbnEoVXRpbC5jYXN0KGIpKSk7XHJcbiAgICAgICAgbW9yZS5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhc2V0KSB7XHJcbiAgICAgICAgICAgIGxpc3RzLnB1c2goKGRhdGFzZXQgaW5zdGFuY2VvZiBMaW5xKSA/IGRhdGFzZXQgOiBuZXcgTGlucShVdGlsLmNhc3QoZGF0YXNldCkpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBsaXN0cy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0KSB7XHJcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGV4aXN0cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgbGlzdHMuZm9yRWFjaChmdW5jdGlvbiAob3RoZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdCA9PT0gb3RoZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXIuY29udGFpbnMoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChleGlzdHMgPSB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFleGlzdHMpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBsaXN0IG9mIGl0ZW1zIHRoYXQgb25seSBleGlzdHMgaW4gb25lIG9mIHRoZSBkYXRhc2V0cy5cclxuICAgICAqIEBwYXJhbSBvdGhlciBUaGUgb3RoZXIgZGF0YXNldC5cclxuICAgICAqIEBwYXJhbSBtb3JlIElmIHlvdSBoYXZlIGV2ZW4gbW9yZSBkYXRhc2V0IHRvIGNvbXBhcmUgdG8uXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLmV4Y2VwdCA9IGZ1bmN0aW9uIChvdGhlcikge1xyXG4gICAgICAgIHZhciBtb3JlID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgbW9yZVtfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKExpbnEuZXhjZXB0LmFwcGx5KExpbnEsIFt0aGlzLCBvdGhlcl0uY29uY2F0KG1vcmUpKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBsaXN0IG9mIHVuaXF1ZSBpdGVtcyB0aGF0IGV4aXN0cyBvbmUgb3IgbW9yZSB0aW1lcyBpbiBhbnkgb2YgdGhlIGRhdGFzZXRzLlxyXG4gICAgICogQHBhcmFtIGRhdGFzZXRzIFRoZSBvdGhlciBkYXRhc2V0cyB0byBiZSBnZXQgZGlzdGluY3QgaXRlbXMgZnJvbS5cclxuICAgICAqL1xyXG4gICAgTGlucS5kaXN0aW5jdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGF0YXNldHMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBkYXRhc2V0c1tfaSAtIDBdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxpc3RzID0gW10sIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGRhdGFzZXRzLmZvckVhY2goZnVuY3Rpb24gKGRhdGFzZXQpIHtcclxuICAgICAgICAgICAgbGlzdHMucHVzaCgoZGF0YXNldCBpbnN0YW5jZW9mIExpbnEpID8gZGF0YXNldCA6IG5ldyBMaW5xKFV0aWwuY2FzdChkYXRhc2V0KSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxpc3RzLmZvckVhY2goZnVuY3Rpb24gKGxpc3QpIHtcclxuICAgICAgICAgICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmluZGV4T2YoaXRlbSkgPT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBsaXN0IG9mIHVuaXF1ZSBpdGVtcyB0aGF0IGV4aXN0cyBvbmUgb3IgbW9yZSB0aW1lcyBpbiB0aGUgZGF0YXNldHMuXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLmRpc3RpbmN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShMaW5xLmRpc3RpbmN0KHRoaXMpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdyb3VwcyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBhY2NvcmRpbmcgdG8gYSBzcGVjaWZpZWQga2V5IHNlbGVjdG9yIGZ1bmN0aW9uLlxyXG4gICAgICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCB0aGUga2V5IGZvciBlYWNoIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLmdyb3VwQnkgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgaSwgYXJyID0gW10sIG9yaWdpbmFsID0gdGhpcy50b0FycmF5KCksIHByZWQgPSB0aGlzLl9tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpLCBncm91cCwgZ3JvdXBWYWx1ZTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb3JpZ2luYWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ3JvdXBWYWx1ZSA9IHByZWQob3JpZ2luYWxbaV0pO1xyXG4gICAgICAgICAgICBncm91cCA9IG5ldyBMaW5xKGFycikuZmlyc3QoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHgua2V5ID09IGdyb3VwVmFsdWU7IH0pO1xyXG4gICAgICAgICAgICBpZiAoIWdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IGdyb3VwVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBbXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKGdyb3VwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBncm91cC52YWx1ZXMucHVzaChvcmlnaW5hbFtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShhcnIpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR3JvdXBzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGFjY29yZGluZyB0byBhIHNwZWNpZmllZCBrZXkgc2VsZWN0b3IgZnVuY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IHRoZSBrZXkgZm9yIGVhY2ggZWxlbWVudC5cclxuICAgICAqL1xyXG4gICAgTGlucS5ncm91cEJ5ID0gZnVuY3Rpb24gKHNvdXJjZSwga2V5U2VsZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5ncm91cEJ5KGtleVNlbGVjdG9yKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlcyB0aGUgcGlwZWxpbmUgYW5kIHJldHVybiB0aGUgcmVzdWx0aW5nIGFycmF5LlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByZXMsIGFyciA9IFtdO1xyXG4gICAgICAgIGlmIChVdGlsLmlzQXJyYXkodGhpcy5fc291cmNlKSkge1xyXG4gICAgICAgICAgICBhcnIgPSBVdGlsLmNhc3QodGhpcy5fc291cmNlKS5zbGljZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgcmVzID0gdGhpcy5fc291cmNlLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIGlmICghVXRpbC5pc1VuZGVmaW5lZChyZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKHJlcyk7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKCFVdGlsLmlzVW5kZWZpbmVkKHJlcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZXMgdGhlIHBpcGVsaW5lIGFuZCBleGVjdXRlIGNhbGxiYWNrIG9uIGVhY2ggaXRlbSBpbiB0aGUgcmVzdWx0aW5nIGFycmF5LlxyXG4gICAgICogU2FtZSBhcyBkb2luZyAudG9BcnJheSgpLmZvckVhY2goY2FsbGJhY2spO1xyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHtVdGlsLklMb29wRnVuY3Rpb248YW55Pn0gZm9yRWFjaCBpcyBjYW5jZWxsZWQgYXMgc29vbiBhcyBpdCByZXR1cm5zIGZhbHNlXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBXZWl0aGVyIHRoZSBjYWxsYmFjayB3YXMgZXhlY3V0ZWQgb24gYWxsIGl0ZW1zIG9yIG5vdC5cclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBhcnIgPSB0aGlzLnRvQXJyYXkoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2soYXJyW2ldLCBpKSA9PT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuICAgIC8qIEhlbHBlciBmdW5jdGlvbnMgKi9cclxuICAgIExpbnEucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICB2YXIgcmVzdWx0O1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gYSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ICE9PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaW5xO1xyXG59KCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IExpbnE7XHJcbmZ1bmN0aW9uIExRKHNvdXJjZSkge1xyXG4gICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSk7XHJcbn1cclxuZXhwb3J0cy5MUSA9IExRO1xyXG52YXIgT3JkZXJlZExpbnEgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKE9yZGVyZWRMaW5xLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gT3JkZXJlZExpbnEoc291cmNlKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU29ydHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgaW4gZGVzY2VuZGluZyBvcmRlciBieSB1c2luZyBhIHNwZWNpZmllZCBjb21wYXJlci5cclxuICAgICAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgYSBrZXkgZnJvbSBhbiBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIGNvbXBhcmVyIEFuIElDb21wYXJlcjxhbnk+IHRvIGNvbXBhcmUga2V5cy5cclxuICAgICAqL1xyXG4gICAgT3JkZXJlZExpbnEucHJvdG90eXBlLnRoZW5CeSA9IGZ1bmN0aW9uIChrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yRm4gPSB0aGlzLl9tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpO1xyXG4gICAgICAgIHZhciBvcmRlckl0ZXJhdG9yID0gdGhpcy5fc291cmNlLmdldEl0ZXJhdG9yRnJvbVBpcGVsaW5lKG9yZGVyXzEuZGVmYXVsdCk7XHJcbiAgICAgICAgb3JkZXJJdGVyYXRvci50aGVuQnkoc2VsZWN0b3JGbiwgY29tcGFyZXIsIGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNvcnRzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAgICAgKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IGEga2V5IGZyb20gYW4gZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSBjb21wYXJlciBBbiBJQ29tcGFyZXI8YW55PiB0byBjb21wYXJlIGtleXMuXHJcbiAgICAgKi9cclxuICAgIE9yZGVyZWRMaW5xLnByb3RvdHlwZS50aGVuQnlEZXNjID0gZnVuY3Rpb24gKGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICB2YXIgc2VsZWN0b3JGbiA9IHRoaXMuX21ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3Rvcik7XHJcbiAgICAgICAgdmFyIG9yZGVySXRlcmF0b3IgPSB0aGlzLl9zb3VyY2UuZ2V0SXRlcmF0b3JGcm9tUGlwZWxpbmUob3JkZXJfMS5kZWZhdWx0KTtcclxuICAgICAgICBvcmRlckl0ZXJhdG9yLnRoZW5CeShzZWxlY3RvckZuLCBjb21wYXJlciwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE9yZGVyZWRMaW5xO1xyXG59KExpbnEpKTtcclxuZXhwb3J0cy5PcmRlcmVkTGlucSA9IE9yZGVyZWRMaW5xO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5xLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgTGlucU1hcEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhMaW5xTWFwSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBMaW5xTWFwSXRlcmF0b3Ioc291cmNlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIH1cclxuICAgIExpbnFNYXBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX25leHQoKTtcclxuICAgICAgICByZXR1cm4gKCFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0pKVxyXG4gICAgICAgICAgICA/IHRoaXMuX2NhbGxiYWNrKGl0ZW0sIHRoaXMuX2lkeClcclxuICAgICAgICAgICAgOiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpbnFNYXBJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBMaW5xTWFwSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIE9yZGVySXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKE9yZGVySXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBPcmRlckl0ZXJhdG9yKHNvdXJjZSwga2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIGlmIChkZXNjZW5kaW5nID09PSB2b2lkIDApIHsgZGVzY2VuZGluZyA9IGZhbHNlOyB9XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgICAgICB0aGlzLl9pc09yZGVyZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9vcmRlcnMgPSBbbmV3IExpbnFPcmRlcihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpXTtcclxuICAgICAgICB0aGlzLl9kZXNjZW5kaW5nID0gZGVzY2VuZGluZztcclxuICAgICAgICB0aGlzLl9idWZmZXJzID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIE9yZGVySXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoIXRoaXMuX2lzT3JkZXJlZCkge1xyXG4gICAgICAgICAgICB2YXIgYXJyID0gW10sIGl0ZW0gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIC8vIGNhbid0IHNvbWVvbmUgZWxzZSBkbyB0aGlzPyBlLmcuIEZpbHRlckl0ZXJhdG9yP1xyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9IHdoaWxlICghVXRpbC5pc1VuZGVmaW5lZChpdGVtKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IGFyci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaSA9IDAsIHJzO1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJzID0gX3RoaXMuX29yZGVyc1tpKytdLmNvbXBhcmUoYSwgYik7XHJcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChycyA9PT0gMCAmJiBpIDwgX3RoaXMuX29yZGVycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5faXNPcmRlcmVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25leHQoKTtcclxuICAgIH07XHJcbiAgICBPcmRlckl0ZXJhdG9yLnByb3RvdHlwZS50aGVuQnkgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIGlmIChkZXNjZW5kaW5nID09PSB2b2lkIDApIHsgZGVzY2VuZGluZyA9IGZhbHNlOyB9XHJcbiAgICAgICAgdGhpcy5fb3JkZXJzLnB1c2gobmV3IExpbnFPcmRlcihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gT3JkZXJJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBPcmRlckl0ZXJhdG9yO1xyXG52YXIgTGlucU9yZGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpbnFPcmRlcihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgaWYgKGRlc2NlbmRpbmcgPT09IHZvaWQgMCkgeyBkZXNjZW5kaW5nID0gZmFsc2U7IH1cclxuICAgICAgICB0aGlzLl9rZXlTZWxlY3RvciA9IGtleVNlbGVjdG9yO1xyXG4gICAgICAgIHRoaXMuX2NvbXBhcmVyID0gY29tcGFyZXI7XHJcbiAgICAgICAgdGhpcy5fZGVzY2VuZGluZyA9IGRlc2NlbmRpbmc7XHJcbiAgICB9XHJcbiAgICBMaW5xT3JkZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fZGVzY2VuZGluZyA/IC0xIDogMSkgKiB0aGlzLl9jb21wYXJlcih0aGlzLl9rZXlTZWxlY3RvcihhKSwgdGhpcy5fa2V5U2VsZWN0b3IoYikpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaW5xT3JkZXI7XHJcbn0oKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9yZGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgU2tpcEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhTa2lwSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBTa2lwSXRlcmF0b3Ioc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5fY291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5fY291bnQgPSBjb3VudDtcclxuICAgIH1cclxuICAgIFNraXBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKDsgdGhpcy5fY291bnRlciA8IHRoaXMuX2NvdW50OyB0aGlzLl9jb3VudGVyKyspIHtcclxuICAgICAgICAgICAgdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fbmV4dCgpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTa2lwSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gU2tpcEl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgU2tpcFdoaWxlSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFNraXBXaGlsZUl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gU2tpcFdoaWxlSXRlcmF0b3Ioc291cmNlLCBfcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKF9wcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBfcHJlZGljYXRlID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgICAgICB0aGlzLl9kb25lID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcHJlZGljYXRlID0gX3ByZWRpY2F0ZTtcclxuICAgIH1cclxuICAgIFNraXBXaGlsZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgaXRlbSA9IHRoaXMuX25leHQoKTtcclxuICAgICAgICB9IHdoaWxlICghdGhpcy5fZG9uZSAmJiB0aGlzLl9wcmVkaWNhdGUoaXRlbSwgdGhpcy5faWR4KSk7XHJcbiAgICAgICAgdGhpcy5fZG9uZSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNraXBXaGlsZUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFNraXBXaGlsZUl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwV2hpbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBUYWtlSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFRha2VJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFRha2VJdGVyYXRvcihzb3VyY2UsIGNvdW50KSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgICAgICB0aGlzLl9jb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLl9jb3VudCA9IGNvdW50O1xyXG4gICAgfVxyXG4gICAgVGFrZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb3VudGVyIDwgdGhpcy5fY291bnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY291bnRlcisrO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gVGFrZUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFRha2VJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIFRha2VXaGlsZUl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhUYWtlV2hpbGVJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFRha2VXaGlsZUl0ZXJhdG9yKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5fcHJlZGljYXRlID0gcHJlZGljYXRlO1xyXG4gICAgfVxyXG4gICAgVGFrZVdoaWxlSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG4gPSB0aGlzLl9uZXh0KCk7XHJcbiAgICAgICAgaWYgKCEhdGhpcy5fcHJlZGljYXRlKG4sIHRoaXMuX2lkeCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG47XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBUYWtlV2hpbGVJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBUYWtlV2hpbGVJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZVdoaWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBkZWZhdWx0U2VsZWN0b3IoYSkge1xyXG4gICAgcmV0dXJuIGNhc3QoYSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0U2VsZWN0b3IgPSBkZWZhdWx0U2VsZWN0b3I7XHJcbmZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlcihhLCBiKSB7XHJcbiAgICBpZiAoYSA8IGIpXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgZWxzZSBpZiAoYSA+IGIpXHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0Q29tcGFyZXIgPSBkZWZhdWx0Q29tcGFyZXI7XHJcbmZ1bmN0aW9uIGRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyKGEsIGIpIHtcclxuICAgIHJldHVybiBhID09PSBiO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXIgPSBkZWZhdWx0RXF1YWxpdHlDb21wYXJlcjtcclxuZnVuY3Rpb24gZGVmYXVsdFByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdFByZWRpY2F0ZSA9IGRlZmF1bHRQcmVkaWNhdGU7XHJcbmZ1bmN0aW9uIGNhc3QoYSkge1xyXG4gICAgcmV0dXJuIGE7XHJcbn1cclxuZXhwb3J0cy5jYXN0ID0gY2FzdDtcclxuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xyXG59XHJcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcclxuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcclxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCI7XHJcbn1cclxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xyXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcclxufVxyXG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XHJcbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xyXG59XHJcbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcclxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xyXG59XHJcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XHJcbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcclxufVxyXG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xyXG5mdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBEYXRlXVwiO1xyXG59XHJcbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlsLmpzLm1hcCJdfQ==
;
return {
'Collections': require('Collections'),
'Helpers': require('Helpers'),
'Linq': require('Linq')
};
});
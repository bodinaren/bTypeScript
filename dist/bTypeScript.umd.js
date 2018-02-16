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
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../util");
var queue_1 = require("./queue");
var BinaryTree = (function () {
    function BinaryTree(selectorFunction) {
        this.length = 0;
        this._selector = selectorFunction || Util.defaultSelector;
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
        var comp = Util.defaultComparer(this._selector(node.value), this._selector(tree.value));
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
            if (node === this._root) {
                delete this._root;
                return true;
            }
            if (node.value < node.parent.value)
                delete node.parent.left;
            else
                delete node.parent.right;
            delete node.parent;
            return true;
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
        if (tree.value === item)
            return tree;
        var comp = Util.defaultComparer(this._selector(item), this._selector(tree.value));
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
exports.TreeNode = TreeNode;

},{"../util":57,"./queue":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represent a doubly-linked list in which you can add and remove items.
 */
var LinkedList = (function () {
    /**
     * @param items T[] Items to start filling the stack with.
     */
    function LinkedList(items) {
        var _this = this;
        this.length = 0;
        if (items)
            items.forEach(function (x) { _this.insert(x); });
    }
    LinkedList.prototype._getNode = function (at) {
        if (this.length === 0)
            return undefined;
        else if (at == 0)
            return this._first;
        else if (at > this.length)
            return this._last;
        var i, node;
        if (at < this.length / 2) {
            // if fetching from first half of list, start from the beginning
            node = this._first;
            for (i = 0; i < at; i++) {
                node = node.next;
            }
        }
        else {
            // if fetching from last half of list, start from the end
            node = this._last;
            for (i = this.length - 1; i > at; i--) {
                node = node.prev;
            }
        }
        return node;
    };
    /**
     * Get an item at a certain position.
     */
    LinkedList.prototype.get = function (at) {
        var node = this._getNode(at);
        if (node)
            return node.val;
    };
    /**
     * Insert an item at the end of the list.
     */
    LinkedList.prototype.insert = function (item) {
        var node = new LinkedListNode(item);
        if (!this._first) {
            this._first = this._last = node;
        }
        else {
            node.prev = this._last;
            this._last.next = node;
            this._last = node;
        }
        return ++this.length;
    };
    /**
     * Insert an item at a certain position in the list.
     */
    LinkedList.prototype.insertAt = function (at, item) {
        if (at >= this.length)
            return this.insert(item);
        var node = new LinkedListNode(item), next = this._getNode(at), prev = next.prev;
        if (prev)
            prev.next = node;
        next.prev = node;
        node.prev = prev;
        node.next = next;
        if (at === 0)
            this._first = node;
        return ++this.length;
    };
    /**
     * Remove an item from a certain position in the list.
     */
    LinkedList.prototype.removeAt = function (at) {
        if (this.length === 0)
            return 0;
        var node = this._getNode(at);
        if (this.length === 1) {
            // only 1 item left to remove.
            this._first = this._last = undefined;
        }
        else if (node === this._first) {
            // removing the first item.
            node.next.prev = undefined;
            this._first = node.next;
        }
        else if (node === this._last) {
            // removing the last item.
            node.prev.next = undefined;
            this._last = node.prev;
        }
        else {
            // removing item in the middle of the list
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }
        return --this.length;
    };
    /**
     * Clears the list.
     */
    LinkedList.prototype.clear = function () {
        this._first = this._last = undefined;
        this.length = 0;
    };
    return LinkedList;
}());
exports.default = LinkedList;
var LinkedListNode = (function () {
    function LinkedListNode(val) {
        this.val = val;
    }
    return LinkedListNode;
}());

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    // /**
    //  * Returns a new read only instance of the list.
    //  */
    // asReadOnly(): List<T> {
    //     return new List(Object.freeze(this._source.slice()));
    // }
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
        if (index === void 0) { index = source.length - 1; }
        if (count === void 0) { count = source.length; }
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
exports.default = List;

},{"../util":57}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linkedList_1 = require("./linkedList");
/**
 * A Stack works by first in, first out.
 */
var Queue = (function () {
    /**
     * @param items T[] Items to start filling the stack with.
     */
    function Queue(items) {
        this._list = new linkedList_1.default(items);
    }
    Object.defineProperty(Queue.prototype, "length", {
        /** Get the number of items in the queue */
        get: function () { return this._list.length; },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * Adds an item to the end of the queue.
     */
    Queue.prototype.enqueue = function (val) {
        this._list.insert(val);
        return this._list.length;
    };
    /**
     * Gets and remove an item from the head of the queue.
     */
    Queue.prototype.dequeue = function () {
        var item = this._list.get(0);
        this._list.removeAt(0);
        return item;
    };
    return Queue;
}());
exports.default = Queue;

},{"./linkedList":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linkedList_1 = require("./linkedList");
/**
 * A Stack works by last in, first out.
 */
var Stack = (function () {
    /**
     * @param items T[] Items to start filling the stack with.
     */
    function Stack(items) {
        this._list = new linkedList_1.default(items);
    }
    Object.defineProperty(Stack.prototype, "length", {
        /** Get the number of items in the stack */
        get: function () { return this._list.length; },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * Adds an item to the top of the stack.
     */
    Stack.prototype.push = function (item) {
        this._list.insertAt(0, item);
        return this._list.length;
    };
    /**
     * Get and remove an item from the top of the stack.
     */
    Stack.prototype.pop = function () {
        var item = this.peek();
        this._list.removeAt(0);
        return item;
    };
    /**
     * Get an item from the top of the stack without removing it.
     */
    Stack.prototype.peek = function () {
        return this._list.get(0);
    };
    /**
     * Clear the stack
     */
    Stack.prototype.clear = function () {
        this._list.clear();
    };
    return Stack;
}());
exports.default = Stack;

},{"./linkedList":2}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../util");
/**
 * Shorthand function to create a DatesHelper object.
 * @param number The date on which to perform the various functions.
 */
function Dates(date) { return new DatesHelper(date); }
exports.default = Dates;
var DatesHelper = (function () {
    function DatesHelper(date) {
        this.date = date;
    }
    DatesHelper.toDate = function (date) {
        if (Util.isUndefined(date))
            return new Date();
        if (Util.isString(date))
            date = Date.parse(date);
        if (Util.isNumber(date))
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
        if (Util.isUndefined(lower))
            lower = new Date(0);
        if (Util.isUndefined(upper))
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
    DatesHelper.prototype.isToday = function () {
        return this.date.toDateString() === new Date().toDateString();
    };
    DatesHelper.prototype.toMidnight = function () {
        this.date.setHours(0);
        this.date.setMinutes(0);
        this.date.setSeconds(0);
        this.date.setMilliseconds(0);
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
    DatesHelper.isToday = function (date) { return new DatesHelper(date).isToday(); };
    DatesHelper.toMidnight = function (date) { return new DatesHelper(date).toMidnight().date; };
    return DatesHelper;
}());
exports.DatesHelper = DatesHelper;

},{"../util":57}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
/**
 * Shorthand function to create a NumbersHelper object.
 * @param number The number on which to perform the various functions.
 */
function Numbers(num) { return new NumbersHelper(num); }
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

},{"../util":57}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Shorthand function to create a StringsHelper object.
 * @param number The string on which to perform the various functions.
 */
function Strings(str) { return new StringsHelper(str); }
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
            args[_i] = arguments[_i];
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
Object.defineProperty(exports, "__esModule", { value: true });
// import "../linq/add/zip";
/**
 * Shorthand function to create a UrlHelper object.
 * @param url The URL on which to perform the various functions.
 */
function Url(url) {
    if (url === void 0) { url = location.href; }
    return new UrlHelper(url);
}
exports.default = Url;
var UrlHelper = (function () {
    /**
     * Creates a UrlHelper object.
     * @param url The URL on which to perform the various functions.
     */
    function UrlHelper(url) {
        if (url === void 0) { url = location.href; }
        this.url = url;
    }
    /**
     * Get the value of a query in the URL.
     * @param param The name of the query to get.
     */
    UrlHelper.prototype.search = function (param) {
        return UrlHelper.search(param, this.url);
    };
    /**
     * Get the value of a query in the URL.
     * @param url The URL from which to get the query.
     * @param param The name of the query to get.
     */
    UrlHelper.search = function (param, url) {
        if (url === void 0) { url = location.href; }
        param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + param + "=([^&#]*)", "i"), results = regex.exec(url || location.search);
        return !results ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    return UrlHelper;
}());
exports.UrlHelper = UrlHelper;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var all_1 = require("../operator/all");
linq_1.Linq.prototype.all = all_1.allProto;
linq_1.Linq.all = all_1.allStatic;

},{"../linq":46,"../operator/all":48}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var any_1 = require("../operator/any");
linq_1.Linq.prototype.any = any_1.anyProto;
linq_1.Linq.any = any_1.anyStatic;

},{"../linq":46,"../operator/any":49}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var average_1 = require("../operator/average");
linq_1.Linq.prototype.average = average_1.averageProto;
linq_1.Linq.average = average_1.averageStatic;

},{"../linq":46,"../operator/average":50}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var distinct_1 = require("../iterator/distinct");
linq_1.Linq.prototype.distinct = distinct_1.distinctProto;
linq_1.Linq.distinct = distinct_1.distinctStatic;

},{"../iterator/distinct":32,"../linq":46}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var except_1 = require("../iterator/except");
linq_1.Linq.prototype.except = except_1.exceptProto;
linq_1.Linq.except = except_1.exceptStatic;

},{"../iterator/except":33,"../linq":46}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var filter_1 = require("../iterator/filter");
linq_1.Linq.prototype.filter = filter_1.filterProto;
linq_1.Linq.filter = filter_1.filterStatic;

},{"../iterator/filter":34,"../linq":46}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var first_1 = require("../operator/first");
linq_1.Linq.prototype.first = first_1.firstProto;
linq_1.Linq.first = first_1.firstStatic;

},{"../linq":46,"../operator/first":51}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var groupBy_1 = require("../iterator/groupBy");
linq_1.Linq.prototype.groupBy = groupBy_1.groupByProto;
linq_1.Linq.groupBy = groupBy_1.groupByStatic;

},{"../iterator/groupBy":35,"../linq":46}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var intersect_1 = require("../iterator/intersect");
linq_1.Linq.prototype.intersect = intersect_1.intersectProto;
linq_1.Linq.intersect = intersect_1.intersectStatic;

},{"../iterator/intersect":36,"../linq":46}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var join_1 = require("../iterator/join");
linq_1.Linq.prototype.join = join_1.joinProto;
linq_1.Linq.join = join_1.joinStatic;

},{"../iterator/join":38,"../linq":46}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var last_1 = require("../operator/last");
linq_1.Linq.prototype.last = last_1.lastProto;
linq_1.Linq.last = last_1.lastStatic;

},{"../linq":46,"../operator/last":52}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var map_1 = require("../iterator/map");
linq_1.Linq.prototype.map = map_1.mapProto;
linq_1.Linq.map = map_1.mapStatic;

},{"../iterator/map":39,"../linq":46}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var max_1 = require("../operator/max");
linq_1.Linq.prototype.max = max_1.maxProto;
linq_1.Linq.max = max_1.maxStatic;

},{"../linq":46,"../operator/max":53}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var min_1 = require("../operator/min");
linq_1.Linq.prototype.min = min_1.minProto;
linq_1.Linq.min = min_1.minStatic;

},{"../linq":46,"../operator/min":54}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var orderBy_1 = require("../iterator/orderBy");
linq_1.Linq.prototype.orderBy = orderBy_1.orderByProto;
linq_1.Linq.prototype.orderByDesc = orderBy_1.orderByDescProto;
linq_1.Linq.orderBy = orderBy_1.orderByStatic;
linq_1.Linq.orderByDesc = orderBy_1.orderByDescStatic;

},{"../iterator/orderBy":40,"../linq":46}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var single_1 = require("../operator/single");
linq_1.Linq.prototype.single = single_1.singleProto;
linq_1.Linq.single = single_1.singleStatic;

},{"../linq":46,"../operator/single":55}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var skip_1 = require("../iterator/skip");
linq_1.Linq.prototype.skip = skip_1.skipProto;
linq_1.Linq.skip = skip_1.skipStatic;

},{"../iterator/skip":41,"../linq":46}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var skipWhile_1 = require("../iterator/skipWhile");
linq_1.Linq.prototype.skipWhile = skipWhile_1.skipWhileProto;
linq_1.Linq.skipWhile = skipWhile_1.skipWhileStatic;

},{"../iterator/skipWhile":42,"../linq":46}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var sum_1 = require("../operator/sum");
linq_1.Linq.prototype.sum = sum_1.sumProto;
linq_1.Linq.sum = sum_1.sumStatic;

},{"../linq":46,"../operator/sum":56}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var take_1 = require("../iterator/take");
linq_1.Linq.prototype.take = take_1.takeProto;
linq_1.Linq.take = take_1.takeStatic;

},{"../iterator/take":43,"../linq":46}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var takeWhile_1 = require("../iterator/takeWhile");
linq_1.Linq.prototype.takeWhile = takeWhile_1.takeWhileProto;
linq_1.Linq.takeWhile = takeWhile_1.takeWhileStatic;

},{"../iterator/takeWhile":44,"../linq":46}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var zip_1 = require("../iterator/zip");
linq_1.Linq.prototype.zip = zip_1.zipProto;
linq_1.Linq.zip = zip_1.zipStatic;

},{"../iterator/zip":45,"../linq":46}],32:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
var iterator_1 = require("./iterator");
var linq_1 = require("../linq");
var DistinctIterator = (function (_super) {
    __extends(DistinctIterator, _super);
    function DistinctIterator(source, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var _this = _super.call(this, source) || this;
        _this.comparer = comparer;
        _this._previousItems = [];
        return _this;
    }
    DistinctIterator.prototype.next = function () {
        var _this = this;
        var rs;
        while (!(rs = _super.prototype.next.call(this)).done) {
            if (!this._previousItems.some(function (x) { return _this.comparer(x, rs.value); })) {
                this._previousItems.push(rs.value);
                return rs;
            }
        }
        return {
            value: undefined,
            done: true
        };
    };
    return DistinctIterator;
}(iterator_1.BaseIterator));
exports.DistinctIterator = DistinctIterator;
function distinct(source, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    return new DistinctIterator(source, comparer);
}
/**
 * Get a list of unique items that exists one or more times in the dataset.
 */
function distinctProto(comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    return this.lift(distinct, comparer);
}
exports.distinctProto = distinctProto;
/**
 * Get a list of unique items that exists one or more times in any of the datasets.
 * @param source The datasets to be get distinct items from.
 */
function distinctStatic(source, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    var a = (source instanceof linq_1.Linq) ? source.toArray() : source;
    var result = [];
    a.forEach(function (x) {
        if (!result.some(function (y) { return comparer(x, y); }))
            result.push(x);
        // if (result.indexOf(x) === -1) 
    });
    return result;
    // let lists: Array<Linq> = [], result = [];
    // datasets.forEach(dataset => {
    //     lists.push((dataset instanceof Linq) ? dataset : new Linq(Util.cast<any[]>(dataset)));
    // });
    // lists.forEach(list => {
    //     list.toArray().forEach(item => {
    //         if (result.indexOf(item) == -1)
    //             result.push(item);
    //     });
    // });
    // return result;
}
exports.distinctStatic = distinctStatic;

},{"../../util":57,"../linq":46,"./iterator":37}],33:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
var iterator_1 = require("./iterator");
var linq_1 = require("../linq");
var ExceptIterator = (function (_super) {
    __extends(ExceptIterator, _super);
    function ExceptIterator(source, other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var _this = _super.call(this, source) || this;
        _this.comparer = comparer;
        if (other instanceof iterator_1.BaseIterator) {
            _this.other = other;
        }
        else {
            _this.other = new iterator_1.BaseIterator(other);
        }
        return _this;
    }
    ExceptIterator.prototype.next = function () {
        var _this = this;
        var rs;
        if (!this.otherItems) {
            this.otherItems = [];
            while (!(rs = this.other.next()).done) {
                this.otherItems.push(rs.value);
            }
        }
        while (!(rs = _super.prototype.next.call(this)).done) {
            if (!this.otherItems.some(function (x) { return _this.comparer(rs.value, x); })) {
                return rs;
            }
        }
        return {
            value: undefined,
            done: true
        };
    };
    return ExceptIterator;
}(iterator_1.BaseIterator));
exports.ExceptIterator = ExceptIterator;
function except(source, other, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    return new ExceptIterator(source, other, comparer);
}
/**
 * Get a list of items that only exists in one of the datasets.
 * @param other The other dataset.
 */
function exceptProto(other, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    return this.lift(except, other, comparer);
}
exports.exceptProto = exceptProto;
/**
 * Get a list of items that only exists in one of the datasets.
 * @param a The first dataset.
 * @param b The second dataset.
 */
function exceptStatic(source, other, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    var a = (source instanceof linq_1.Linq) ? source.toArray() : source, b = (other instanceof linq_1.Linq) ? other.toArray() : other;
    var result = [];
    a.forEach(function (x) {
        if (!b.some(function (y) { return comparer(x, y); }))
            result.push(x);
    });
    return result;
    // lists.push((a instanceof Linq) ? a.toArray() : a);
    // lists.push((b instanceof Linq) ? b.toArray() : b);
    // let lists: Array<any[]> = [], result = [];
    // lists.push((a instanceof Linq) ? a.toArray() : a);
    // lists.push((b instanceof Linq) ? b.toArray() : b);
    // more.forEach(dataset => {
    //     lists.push((dataset instanceof Linq) ? dataset.toArray() : dataset);
    // });
    // lists.forEach(list => {
    //     list.forEach(item => {
    //         let exists = lists.some(other => {
    //             if (list === other) return;
    //             if (other.some(x =>  x === item)) return true;
    //         });
    //         if (!exists) result.push(item);
    //     });
    // });
    // return result;
}
exports.exceptStatic = exceptStatic;

},{"../../util":57,"../linq":46,"./iterator":37}],34:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var Util = require("../../util");
var FilterIterator = (function (_super) {
    __extends(FilterIterator, _super);
    function FilterIterator(source, callback) {
        if (callback === void 0) { callback = Util.defaultPredicate; }
        var _this = _super.call(this, source) || this;
        _this.callback = callback;
        return _this;
    }
    FilterIterator.prototype.next = function () {
        var item;
        while (!(item = _super.prototype.next.call(this)).done) {
            if (this.callback(item.value, this._idx))
                break;
        }
        return item;
    };
    return FilterIterator;
}(iterator_1.BaseIterator));
exports.FilterIterator = FilterIterator;
function filter(source, predicate) {
    return new FilterIterator(source, predicate);
}
/**
 * Filters a sequence of values based on a predicate.
 * @param predicate A function to test each element for a condition.
 */
function filterProto(predicate) {
    return this.lift(filter, predicate);
}
exports.filterProto = filterProto;
/**
 * Filters a sequence of values based on a predicate.
 * @param predicate A function to test each element for a condition.
 */
function filterStatic(source, predicate) {
    return source.filter(predicate);
}
exports.filterStatic = filterStatic;

},{"../../util":57,"./iterator":37}],35:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var filter_1 = require("./filter");
var Util = require("../../util");
var linq_1 = require("../linq");
require("../add/first");
var makeValuePredicate_1 = require("../makeValuePredicate");
var GroupByIterator = (function (_super) {
    __extends(GroupByIterator, _super);
    function GroupByIterator(source, keySelector) {
        var _this = _super.call(this, source) || this;
        _this.keySelector = keySelector;
        _this._previousKeys = [];
        _this._isPipelineExecuted = false;
        return _this;
    }
    GroupByIterator.prototype.next = function () {
        // TODO: Currently this will use FilterIterator on the whole source once per key. Can we improve this?
        var _this = this;
        /* TODO: Because we send in this._source into the FilterIterator, if this._source is an iterator, we finish it,
         * making it not look for the next key on the second call to this function.
         * We probably need to create a lookup table of some sort.
         */
        if (!this._isPipelineExecuted) {
            this._source = this.toArray();
            _super.prototype.reset.call(this);
            this._isPipelineExecuted = true;
        }
        var item, key;
        do {
            item = _super.prototype.next.call(this);
            if (item.done)
                return item;
            if (Util.isUndefined(item.value))
                continue;
            key = this.keySelector(item.value);
        } while (this._previousKeys.indexOf(key) > -1 || Util.isUndefined(item.value));
        this._previousKeys.push(key);
        var filter = new filter_1.FilterIterator(this._source, function (x, idx) { return _this.keySelector(x) === key; });
        var groupItem, values = [];
        while (!Util.isUndefined(groupItem = filter.next().value)) {
            values.push(groupItem);
        }
        return {
            value: {
                key: key,
                values: values
            },
            done: item.done
        };
    };
    GroupByIterator.prototype.toArray = function () {
        var n, result = [];
        while (!(n = _super.prototype.next.call(this)).done)
            result.push(n.value);
        return result;
    };
    return GroupByIterator;
}(iterator_1.BaseIterator));
exports.GroupByIterator = GroupByIterator;
function groupBy(source, keySelector) {
    var pred = makeValuePredicate_1.makeValuePredicate(keySelector);
    return new GroupByIterator(source, pred);
}
/**
 * Groups the elements of a sequence according to a specified key selector function.
 * @param keySelector A function to extract the key for each element.
 */
function groupByProto(keySelector) {
    var pred = makeValuePredicate_1.makeValuePredicate(keySelector);
    return this.lift(groupBy, pred);
}
exports.groupByProto = groupByProto;
/**
 * Groups the elements of a sequence according to a specified key selector function.
 * @param keySelector A function to extract the key for each element.
 */
function groupByStatic(source, keySelector) {
    var i, arr = [], pred = makeValuePredicate_1.makeValuePredicate(keySelector), group, groupValue;
    for (i = 0; i < source.length; i++) {
        groupValue = pred(source[i]);
        group = new linq_1.Linq(arr).first(function (x) { return x.key == groupValue; });
        if (!group) {
            group = {
                key: groupValue,
                values: []
            };
            arr.push(group);
        }
        group.values.push(source[i]);
    }
    return arr;
}
exports.groupByStatic = groupByStatic;

},{"../../util":57,"../add/first":16,"../linq":46,"../makeValuePredicate":47,"./filter":34,"./iterator":37}],36:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
var iterator_1 = require("./iterator");
var linq_1 = require("../linq");
var IntersectIterator = (function (_super) {
    __extends(IntersectIterator, _super);
    function IntersectIterator(source, other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var _this = _super.call(this, source) || this;
        _this.comparer = comparer;
        if (other instanceof iterator_1.BaseIterator) {
            _this.other = other;
        }
        else {
            _this.other = new iterator_1.BaseIterator(other);
        }
        return _this;
    }
    IntersectIterator.prototype.next = function () {
        var _this = this;
        var rs;
        if (!this.otherItems) {
            this.otherItems = [];
            while (!(rs = this.other.next()).done) {
                this.otherItems.push(rs.value);
            }
        }
        while (!(rs = _super.prototype.next.call(this)).done) {
            if (this.otherItems.some(function (x) { return _this.comparer(rs.value, x); })) {
                return rs;
            }
        }
        return {
            value: undefined,
            done: true
        };
    };
    return IntersectIterator;
}(iterator_1.BaseIterator));
exports.IntersectIterator = IntersectIterator;
function intersect(source, other, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    return new IntersectIterator(source, other, comparer);
}
/**
 * Get a list of items that only exists in one of the datasets.
 * @param other The other dataset.
 */
function intersectProto(other, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    return this.lift(intersect, other, comparer);
}
exports.intersectProto = intersectProto;
/**
 * Get a list of items that exists in all datasets.
 * @param a The first dataset.
 * @param b The second dataset to be compared to.
 * @param more If you have even more dataset to compare to.
 */
function intersectStatic(source, other, comparer) {
    if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
    var a = (source instanceof linq_1.Linq) ? source.toArray() : source, b = (other instanceof linq_1.Linq) ? other.toArray() : other;
    var result = [];
    a.forEach(function (x) {
        if (b.some(function (y) { return comparer(x, y); }))
            result.push(x);
    });
    return result;
    // let lists: Array<any[]> = [], result = [];
    // let list = (a instanceof Linq) ? a.toArray() : a;
    // lists.push((b instanceof Linq) ? b.toArray() : b);
    // more.forEach((dataset) => {
    //     lists.push((dataset instanceof Linq) ? dataset.toArray() : dataset);
    // });
    // list.forEach(item => {
    //     let exists = lists.every(other => {
    //         if (!other.some(x => x === item)) return false;
    //         return true;
    //     });
    //     if (exists) result.push(item);
    // });
    // return result;
}
exports.intersectStatic = intersectStatic;

},{"../../util":57,"../linq":46,"./iterator":37}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseIterator = (function () {
    function BaseIterator(source) {
        this._idx = -1;
        this._buffers = false;
        this._reversed = false;
        this._done = false;
        this._source = source;
    }
    BaseIterator.prototype.getIteratorFromPipeline = function (type) {
        if (this instanceof type)
            return this;
        var source = this;
        while (!((source = source._source) instanceof type)) {
        }
        return source;
    };
    BaseIterator.prototype.next = function () {
        var n = undefined;
        if (this._source instanceof BaseIterator) {
            var next = this._source.next();
            this._idx++;
            return next;
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
        if (this._idx >= this._source.length) {
            // this._idx = -1; // we finished, reset the counter
            this._done = true;
        }
        return {
            value: n,
            done: this._done
        };
    };
    BaseIterator.prototype.reverse = function () { this._reversed = !this._reversed; };
    BaseIterator.prototype.reset = function () {
        this._idx = -1;
        this._done = false;
    };
    return BaseIterator;
}());
exports.BaseIterator = BaseIterator;

},{}],38:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var filter_1 = require("./filter");
var Util = require("../../util");
var linq_1 = require("../linq");
var makeValuePredicate_1 = require("../makeValuePredicate");
var JoinIterator = (function (_super) {
    __extends(JoinIterator, _super);
    function JoinIterator(outer, inner, outerKeySelector, innerKeySelector, resultSelector) {
        var _this = _super.call(this, outer) || this;
        _this.inner = inner;
        _this.outerKeySelector = outerKeySelector;
        _this.innerKeySelector = innerKeySelector;
        _this.resultSelector = resultSelector;
        _this._counter = 0;
        return _this;
    }
    JoinIterator.prototype.next = function () {
        var _this = this;
        var innerItem;
        if (this._currentInnerSelection) {
            // We're doing the second loop of the same key.
            innerItem = this._currentInnerSelection.next();
            // We know we have received at least one item from this key before, so not receiving one now is not wrong.
            // It just means it was only a single inner item with this key, so we let it continue if below condition is not met.
            if (!Util.isUndefined(innerItem.value)) {
                this._counter++;
                return {
                    value: this.resultSelector(this._outerItem.value, innerItem.value),
                    done: false
                };
            }
        }
        var _loop_1 = function () {
            this_1._outerItem = _super.prototype.next.call(this_1);
            if (this_1._outerItem.done)
                return { value: { value: undefined, done: true } };
            if (!Util.isUndefined(this_1._outerItem.value)) {
                var outerKey_1 = this_1.outerKeySelector(this_1._outerItem.value);
                this_1._currentInnerSelection = new filter_1.FilterIterator(this_1.inner, function (x) { return outerKey_1 === _this.innerKeySelector(x); });
                innerItem = this_1._currentInnerSelection.next();
            }
        };
        var this_1 = this;
        do {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        } while (Util.isUndefined(innerItem.value));
        this._counter++;
        return {
            value: this.resultSelector(this._outerItem.value, innerItem.value),
            done: this._outerItem.done
        };
    };
    return JoinIterator;
}(iterator_1.BaseIterator));
exports.JoinIterator = JoinIterator;
function filter(source, predicate) {
    return new filter_1.FilterIterator(source, predicate);
}
/**
 * Filters a sequence of values based on a predicate.
 * @param predicate A function to test each element for a condition.
 */
function filterProto(predicate) {
    return this.lift(filter, predicate);
}
exports.filterProto = filterProto;
/**
 * Filters a sequence of values based on a predicate.
 * @param predicate A function to test each element for a condition.
 */
function filterStatic(source, predicate) {
    return source.filter(predicate);
}
exports.filterStatic = filterStatic;
function join(outer, inner, outerKeySelector, innerKeySelector, resultSelector) {
    return new JoinIterator(outer, inner, outerKeySelector, innerKeySelector, resultSelector);
}
/**
 * Correlates the elements of two sequences based on matching keys.
 * @param inner The sequence to join to the first sequence.
 * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
 * @param innerKeySelector A function to extract the join key from each element of the second sequence.
 * @param resultSelector A function to create a result element from two matching elements.
 */
function joinProto(inner, outerKeySelector, innerKeySelector, resultSelector) {
    var outerPred = makeValuePredicate_1.makeValuePredicate(outerKeySelector), innerPred = makeValuePredicate_1.makeValuePredicate(innerKeySelector);
    return this.lift(join, inner, outerPred, innerPred, resultSelector);
}
exports.joinProto = joinProto;
/**
 * Correlates the elements of two sequences based on matching keys.
 * @param outer The first sequence to join.
 * @param inner The sequence to join to the first sequence.
 * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
 * @param innerKeySelector A function to extract the join key from each element of the second sequence.
 * @param resultSelector A function to create a result element from two matching elements.
 */
function joinStatic(outer, inner, outerKeySelector, innerKeySelector, resultSelector) {
    // TODO: Write static join function without instantiating a new Linq object
    return new linq_1.Linq(outer).join(inner, outerKeySelector, innerKeySelector, resultSelector).toArray();
}
exports.joinStatic = joinStatic;

},{"../../util":57,"../linq":46,"../makeValuePredicate":47,"./filter":34,"./iterator":37}],39:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
var iterator_1 = require("./iterator");
var MapIterator = (function (_super) {
    __extends(MapIterator, _super);
    function MapIterator(source, callback) {
        var _this = _super.call(this, source) || this;
        _this.callback = callback;
        return _this;
    }
    MapIterator.prototype.next = function () {
        var item = _super.prototype.next.call(this);
        return (!Util.isUndefined(item.value))
            ? { value: this.callback(item.value, this._idx), done: false }
            : { value: undefined, done: true };
    };
    return MapIterator;
}(iterator_1.BaseIterator));
exports.MapIterator = MapIterator;
function map(source, callback) {
    return new MapIterator(source, callback);
}
/**
 * Creates a new sequence with the results of calling a provided function on every element in this array.
 * @param callback Function that produces an element of the new sequence
 */
function mapProto(callback) {
    return this.lift(map, callback);
}
exports.mapProto = mapProto;
/**
 * Creates a new sequence with the results of calling a provided function on every element in this array.
 * @param callback Function that produces an element of the new sequence
 */
function mapStatic(source, callback) {
    return source.map(callback);
}
exports.mapStatic = mapStatic;

},{"../../util":57,"./iterator":37}],40:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var Util = require("../../util");
var linq_1 = require("../linq");
var makeValuePredicate_1 = require("../makeValuePredicate");
var OrderByIterator = (function (_super) {
    __extends(OrderByIterator, _super);
    function OrderByIterator(source, keySelector, comparer, descending) {
        if (keySelector === void 0) { keySelector = Util.defaultSelector; }
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        if (descending === void 0) { descending = false; }
        var _this = _super.call(this, source) || this;
        _this.descending = descending;
        _this._isOrdered = false;
        _this._orders = [new LinqOrder(keySelector, comparer, descending)];
        _this._buffers = true;
        return _this;
    }
    OrderByIterator.prototype.next = function () {
        var _this = this;
        if (!this._isOrdered) {
            var arr = [], item = void 0;
            // can't someone else do this? e.g. FilterIterator?
            do {
                item = _super.prototype.next.call(this);
                if (!Util.isUndefined(item.value))
                    arr.push(item.value);
            } while (!item.done);
            this._source = arr.sort(function (a, b) {
                var i = 0, rs;
                do {
                    rs = _this._orders[i++].compare(a, b);
                } while (rs === 0 && i < _this._orders.length);
                return rs;
            });
            this._isOrdered = true;
            _super.prototype.reset.call(this);
        }
        return _super.prototype.next.call(this);
    };
    OrderByIterator.prototype.thenBy = function (keySelector, comparer, descending) {
        if (keySelector === void 0) { keySelector = Util.defaultSelector; }
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        if (descending === void 0) { descending = false; }
        this._orders.push(new LinqOrder(keySelector, comparer, descending));
    };
    return OrderByIterator;
}(iterator_1.BaseIterator));
exports.OrderByIterator = OrderByIterator;
function orderBy(source, keySelector, comparer) {
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    var selectorFn = (keySelector) ? makeValuePredicate_1.makeValuePredicate(keySelector) : Util.defaultSelector;
    return new OrderByIterator(source, selectorFn, comparer, false);
}
function orderByDesc(source, keySelector, comparer) {
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    var selectorFn = (keySelector) ? makeValuePredicate_1.makeValuePredicate(keySelector) : Util.defaultSelector;
    return new OrderByIterator(source, selectorFn, comparer, true);
}
/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
function orderByProto(keySelector, comparer) {
    // TODO: Haven't gotten the intellisense to show Linq<TSource> as the result of this function, it shows Linq<any>.
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    return new OrderedLinq(orderBy(this._source, keySelector, comparer));
}
exports.orderByProto = orderByProto;
/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
function orderByStatic(source, keySelector, comparer) {
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    return new linq_1.Linq(source).orderBy(keySelector, comparer).toArray();
}
exports.orderByStatic = orderByStatic;
/**
 * Sorts the elements of a sequence in descending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
function orderByDescProto(keySelector, comparer) {
    // TODO: Haven't gotten the intellisense to show Linq<TSource> as the result of this function, it shows Linq<any>.
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    return new OrderedLinq(orderByDesc(this._source, keySelector, comparer));
}
exports.orderByDescProto = orderByDescProto;
/**
 * Sorts the elements of a sequence in descending order by using a specified comparer.
 * @param keySelector A function to extract a key from an element.
 * @param comparer An IComparer<any> to compare keys.
 */
function orderByDescStatic(source, keySelector, comparer) {
    if (comparer === void 0) { comparer = Util.defaultComparer; }
    return new linq_1.Linq(source).orderByDesc(keySelector, comparer).toArray();
}
exports.orderByDescStatic = orderByDescStatic;
var LinqOrder = (function () {
    function LinqOrder(keySelector, comparer, descending) {
        if (keySelector === void 0) { keySelector = Util.defaultSelector; }
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
var OrderedLinq = (function (_super) {
    __extends(OrderedLinq, _super);
    function OrderedLinq(source) {
        return _super.call(this, source) || this;
    }
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    OrderedLinq.prototype.thenBy = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = (keySelector) ? makeValuePredicate_1.makeValuePredicate(keySelector) : Util.defaultSelector;
        var orderIterator = this._source.getIteratorFromPipeline(OrderByIterator);
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
        var selectorFn = (keySelector) ? makeValuePredicate_1.makeValuePredicate(keySelector) : Util.defaultSelector;
        var orderIterator = this._source.getIteratorFromPipeline(OrderByIterator);
        orderIterator.thenBy(selectorFn, comparer, true);
        return this;
    };
    return OrderedLinq;
}(linq_1.Linq));
exports.OrderedLinq = OrderedLinq;

},{"../../util":57,"../linq":46,"../makeValuePredicate":47,"./iterator":37}],41:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var SkipIterator = (function (_super) {
    __extends(SkipIterator, _super);
    function SkipIterator(source, count) {
        var _this = _super.call(this, source) || this;
        _this.count = count;
        _this.counter = 0;
        return _this;
    }
    SkipIterator.prototype.next = function () {
        for (; this.counter < this.count; this.counter++)
            _super.prototype.next.call(this);
        return _super.prototype.next.call(this);
    };
    return SkipIterator;
}(iterator_1.BaseIterator));
exports.SkipIterator = SkipIterator;
function skip(source, count) {
    return new SkipIterator(source, count);
}
/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 * @param count The number of elements to skip before returning the remaining elements.
 */
function skipProto(count) {
    return this.lift(skip, count);
}
exports.skipProto = skipProto;
/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 * @param count The number of elements to skip before returning the remaining elements.
 */
function skipStatic(source, count) {
    return source.slice(count);
    // return new Linq(source).skip(count).toArray();
}
exports.skipStatic = skipStatic;

},{"./iterator":37}],42:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var Util = require("../../util");
var linq_1 = require("../linq");
var SkipWhileIterator = (function (_super) {
    __extends(SkipWhileIterator, _super);
    function SkipWhileIterator(source, predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        var _this = _super.call(this, source) || this;
        _this.predicate = predicate;
        _this.done = false;
        return _this;
    }
    SkipWhileIterator.prototype.next = function () {
        var item;
        do {
            item = _super.prototype.next.call(this);
        } while (!this.done && !Util.isUndefined(item.value) && this.predicate(item.value, this._idx));
        this.done = true;
        return item;
    };
    return SkipWhileIterator;
}(iterator_1.BaseIterator));
exports.SkipWhileIterator = SkipWhileIterator;
function skipWhile(source, predicate) {
    return new SkipWhileIterator(source, predicate);
}
/**
 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
 * @param predicate A function to test each element for a condition.
 */
function skipWhileProto(predicate) {
    return this.lift(skipWhile, predicate);
}
exports.skipWhileProto = skipWhileProto;
/**
 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
 * @param predicate A function to test each element for a condition.
 */
function skipWhileStatic(source, predicate) {
    return new linq_1.Linq(source).skipWhile(predicate).toArray();
}
exports.skipWhileStatic = skipWhileStatic;

},{"../../util":57,"../linq":46,"./iterator":37}],43:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var TakeIterator = (function (_super) {
    __extends(TakeIterator, _super);
    function TakeIterator(source, count) {
        var _this = _super.call(this, source) || this;
        _this.count = count;
        _this._counter = 0;
        return _this;
    }
    TakeIterator.prototype.next = function () {
        if (this._counter < this.count) {
            this._counter++;
            return _super.prototype.next.call(this);
        }
        return {
            value: undefined,
            done: true
        };
    };
    return TakeIterator;
}(iterator_1.BaseIterator));
exports.TakeIterator = TakeIterator;
function take(source, count) {
    return new TakeIterator(source, count);
}
/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @param count The number of elements to return.
 */
function takeProto(count) {
    return this.lift(take, count);
}
exports.takeProto = takeProto;
/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @param count The number of elements to return.
 */
function takeStatic(source, count) {
    return source.slice(0, count);
    // return new Linq(source).skip(count).toArray();
}
exports.takeStatic = takeStatic;

},{"./iterator":37}],44:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var Util = require("../../util");
var linq_1 = require("../linq");
var TakeWhileIterator = (function (_super) {
    __extends(TakeWhileIterator, _super);
    function TakeWhileIterator(source, predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        var _this = _super.call(this, source) || this;
        _this.predicate = predicate;
        return _this;
    }
    TakeWhileIterator.prototype.next = function () {
        var n = _super.prototype.next.call(this);
        if (!n.done && !!this.predicate(n.value, this._idx)) {
            return {
                value: n.value,
                done: false
            };
        }
        return {
            value: undefined,
            done: true
        };
    };
    return TakeWhileIterator;
}(iterator_1.BaseIterator));
exports.TakeWhileIterator = TakeWhileIterator;
function takeWhile(source, predicate) {
    return new TakeWhileIterator(source, predicate);
}
/**
 * Returns elements from a sequence as long as a specified condition is true.
 * @param predicate A function to test each element for a condition.
 */
function takeWhileProto(predicate) {
    return this.lift(takeWhile, predicate);
}
exports.takeWhileProto = takeWhileProto;
/**
 * Returns elements from a sequence as long as a specified condition is true.
 * @param predicate A function to test each element for a condition.
 */
function takeWhileStatic(source, predicate) {
    return new linq_1.Linq(source).takeWhile(predicate).toArray();
}
exports.takeWhileStatic = takeWhileStatic;

},{"../../util":57,"../linq":46,"./iterator":37}],45:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
var iterator_1 = require("./iterator");
var linq_1 = require("../linq");
var ZipIterator = (function (_super) {
    __extends(ZipIterator, _super);
    function ZipIterator(source, other, callback) {
        var _this = _super.call(this, source) || this;
        _this.other = other;
        _this.callback = callback;
        return _this;
    }
    ZipIterator.prototype.next = function () {
        var item = _super.prototype.next.call(this);
        if (!item.done) {
            var o = this.other[this._idx];
            if (!Util.isUndefined(o)) {
                return {
                    value: this.callback(item.value, o, this._idx),
                    done: false
                };
            }
        }
        return {
            value: undefined,
            done: true
        };
    };
    return ZipIterator;
}(iterator_1.BaseIterator));
exports.ZipIterator = ZipIterator;
function zip(source, other, callback) {
    return new ZipIterator(source, other, callback);
}
/**
 * Merges items from the first sequence with the item at the corresponding index in the second sequence to
 * create a new sequence with the results of calling a provided function on every pair of items.
 * The zip will stop as soon as either of the sequences hits an undefined value.
 * @param other The second sequence to zip with
 * @param callback Function that produces an element of the new sequence
 */
function zipProto(other, callback) {
    return this.lift(zip, other, callback);
}
exports.zipProto = zipProto;
/**
 * Merges items from the first sequence with the item at the corresponding index in the second sequence to
 * create a new sequence with the results of calling a provided function on every pair of items.
 * The zip will stop as soon as either of the sequences hits an undefined value.
 * @param other The second sequence to zip with
 * @param callback Function that produces an element of the new sequence
 */
function zipStatic(source, other, callback) {
    // TODO: Write static zip function without instantiating a new Linq object
    return new linq_1.Linq(source).zip(other, callback).toArray();
}
exports.zipStatic = zipStatic;

},{"../../util":57,"../linq":46,"./iterator":37}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator/iterator");
var map_1 = require("./iterator/map");
var Util = require("../util");
var Linq = (function () {
    function Linq(source) {
        this._source = (source instanceof iterator_1.BaseIterator)
            ? source
            : new map_1.MapIterator(source, function (item) { return item; });
    }
    Linq.prototype.lift = function (iterator) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Linq(iterator.apply(void 0, [this._source].concat(args)));
    };
    /**
     * Inverts the order of the elements in a sequence.
     * This simply iterates the items from the end, and as such has no additional performance cost.
     */
    Linq.prototype.reverse = function () {
        this._source.reverse();
        return this;
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
            while (!(res = this._source.next()).done) {
                arr.push(res.value);
            }
        }
        return arr;
    };
    return Linq;
}());
exports.Linq = Linq;
function LQ(source) {
    return new Linq(source);
}
exports.LQ = LQ;

},{"../util":57,"./iterator/iterator":37,"./iterator/map":39}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../util");
function makeValuePredicate(predicate) {
    if (Util.isString(predicate)) {
        var field_1 = predicate;
        predicate = (function (x) { return x[field_1]; });
    }
    else if (Util.isUndefined(predicate)) {
        predicate = (function () { return true; });
    }
    return predicate;
}
exports.makeValuePredicate = makeValuePredicate;

},{"../util":57}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../add/any");
/**
 * Determines whether all elements of a sequence satisfy a condition.
 * @param predicate A function to test each element for a condition.
 * @param invert If true, determines whether none elements of a sequence satisfy a condition.
 */
function allProto(predicate, invert) {
    if (invert === void 0) { invert = false; }
    return !(this.any(predicate, !invert));
}
exports.allProto = allProto;
/**
 * Determines whether all elements of a sequence satisfy a condition.
 * @param predicate A function to test each element for a condition.
 * @param invert If true, determines whether none elements of a sequence satisfy a condition.
 */
function allStatic(source, predicate, invert) {
    if (invert === void 0) { invert = false; }
    return source.every(function (x) { return !!predicate(x) !== invert; });
}
exports.allStatic = allStatic;
// /**
//  * Determines whether all elements of a sequence satisfy a condition.
//  * @param predicate A function to test each element for a condition.
//  * @param invert If true, determines whether none elements of a sequence satisfy a condition.
//  */
// all(predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
//     return !(this.any(predicate, !invert));
// }
// /**
//  * Determines whether all elements of a sequence satisfy a condition.
//  * @param predicate A function to test each element for a condition.
//  * @param invert If true, determines whether none elements of a sequence satisfy a condition.
//  */
// static all<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
//     return source.every(x => !!predicate(x) !== invert);
// }

},{"../add/any":11}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../add/first");
/**
 * Determines whether any element of a sequence satisfies a condition.
 * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
 * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
 */
function anyProto(predicate, invert) {
    if (invert === void 0) { invert = false; }
    return typeof this.first(function (x) { return !!predicate(x) !== invert; }) !== "undefined";
}
exports.anyProto = anyProto;
/**
 * Determines whether any element of a sequence satisfies a condition.
 * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
 * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
 */
function anyStatic(source, predicate, invert) {
    if (invert === void 0) { invert = false; }
    return source.some(function (x) { return !!predicate(x) !== invert; });
}
exports.anyStatic = anyStatic;
// /**
//  * Determines whether any element of a sequence satisfies a condition.
//  * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
//  * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
//  */
// any(predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
//     return typeof this.first(x => !!predicate(x) !== invert) !== "undefined";
// }
// /**
//  * Determines whether any element of a sequence satisfies a condition.
//  * @param predicate A function to test each element for a condition. If not provided, determines whether the sequence contains any elements.
//  * @param invert If true, determines whether any element of a sequence does not satisfies a condition.
//  */
// static any<TSource>(source: TSource[], predicate: Util.IPredicate<TSource>, invert: boolean = false): boolean {
//     return source.some(x => !!predicate(x) !== invert);
// }

},{"../add/first":16}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
/**
 * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function averageProto(selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return averageStatic(this.toArray(), selector);
}
exports.averageProto = averageProto;
/**
 * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function averageStatic(source, selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    var i, total = 0;
    for (i = 0; i < source.length; i++) {
        total += selector(source[i]);
    }
    return total / source.length;
}
exports.averageStatic = averageStatic;

},{"../../util":57}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
require("../add/filter");
require("../add/take");
/**
 * Returns the first matching item in the array.
 * @param predicate
 */
function firstProto(predicate) {
    if (predicate === void 0) { predicate = Util.defaultPredicate; }
    var arr = this.filter(predicate).take(1).toArray();
    if (arr.length == 1)
        return arr[0];
    else
        return undefined;
}
exports.firstProto = firstProto;
/**
 * Returns the first matching item in the array.
 * @param predicate
 */
function firstStatic(source, predicate) {
    if (!source || source.length === 0)
        return undefined;
    if (!predicate)
        return source[0];
    var rs = undefined;
    for (var i = 0; i < source.length; i++) {
        if (predicate(source[i])) {
            return source[i];
        }
    }
    return undefined;
}
exports.firstStatic = firstStatic;

},{"../../util":57,"../add/filter":15,"../add/take":29}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
require("../add/first");
/**
 * Returns the last matching item in the array.
 * @param predicate
 */
function lastProto(predicate) {
    if (predicate === void 0) { predicate = Util.defaultPredicate; }
    return this.reverse().first(predicate);
}
exports.lastProto = lastProto;
/**
 * Returns the last matching item in the array.
 * @param predicate
 */
function lastStatic(source, predicate) {
    if (!source || source.length === 0)
        return undefined;
    if (!predicate)
        return source[source.length - 1];
    for (var i = source.length - 1; i >= 0; i--) {
        if (predicate(source[i])) {
            return source[i];
        }
    }
    return undefined;
}
exports.lastStatic = lastStatic;

},{"../../util":57,"../add/first":16}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
/**
 * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function maxProto(selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return maxStatic(this.toArray(), selector);
}
exports.maxProto = maxProto;
/**
 * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function maxStatic(source, selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return Math.max.apply(Math, source.map(selector));
}
exports.maxStatic = maxStatic;

},{"../../util":57}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
/**
 * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function minProto(selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return minStatic(this.toArray(), selector);
}
exports.minProto = minProto;
/**
 * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector
 */
function minStatic(source, selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return Math.min.apply(Math, source.map(selector));
}
exports.minStatic = minStatic;

},{"../../util":57}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../add/filter");
require("../add/take");
/**
 * Returns the matching item in the array. If there are zero or several matches an exception will be thrown
 * @param predicate
 * @throws Error.
 */
function singleProto(predicate) {
    var arr = this.filter(predicate).take(2).toArray();
    if (arr.length == 0)
        throw new Error("The sequence is empty.");
    if (arr.length == 2)
        throw new Error("The sequence contains more than one element.");
    if (arr.length == 1)
        return arr[0];
}
exports.singleProto = singleProto;
/**
 * Returns the matching item in the array. If there are zero or several matches an exception will be thrown
 * @param predicate
 * @throws Error
 */
function singleStatic(source, predicate) {
    if (!source || source.length === 0)
        return undefined;
    if (!predicate)
        return source[0];
    var rs = undefined;
    for (var i = 0; i < source.length; i++) {
        if (predicate(source[i])) {
            if (rs)
                throw new Error("The sequence contains more than one element.");
            rs = source[i];
        }
    }
    if (!rs)
        throw new Error("The sequence is empty.");
    return rs;
}
exports.singleStatic = singleStatic;

},{"../add/filter":15,"../add/take":29}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
/**
 * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector A transform function to apply to each element.
 */
function sumProto(selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    return sumStatic(this.toArray(), selector);
}
exports.sumProto = sumProto;
/**
 * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
 * @param selector A transform function to apply to each element.
 */
function sumStatic(source, selector) {
    if (selector === void 0) { selector = Util.defaultSelector; }
    var i, sum = 0;
    for (i = 0; i < source.length; i++) {
        sum += selector(source[i]);
    }
    return sum;
}
exports.sumStatic = sumStatic;

},{"../../util":57}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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

},{}],"Collections":[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var list_1 = require("./list");
exports.List = list_1.default;
var linkedList_1 = require("./linkedList");
exports.LinkedList = linkedList_1.default;
var stack_1 = require("./stack");
exports.Stack = stack_1.default;
var queue_1 = require("./queue");
exports.Queue = queue_1.default;
var binaryTree_1 = require("./binaryTree");
exports.BinaryTree = binaryTree_1.default;

},{"./binaryTree":1,"./linkedList":2,"./list":3,"./queue":4,"./stack":5}],"Helpers":[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var numbers_1 = require("./numbers");
exports.Numbers = numbers_1.default;
exports.NumbersHelper = numbers_1.NumbersHelper;
var strings_1 = require("./strings");
exports.Strings = strings_1.default;
exports.StringsHelper = strings_1.StringsHelper;
var dates_1 = require("./dates");
exports.Dates = dates_1.default;
exports.DatesHelper = dates_1.DatesHelper;
var url_1 = require("./url");
exports.Url = url_1.default;
exports.UrlHelper = url_1.UrlHelper;

},{"./dates":6,"./numbers":7,"./strings":8,"./url":9}],"Linq":[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var orderBy_1 = require("./iterator/orderBy");
exports.OrderedLinq = orderBy_1.OrderedLinq;
var linq_1 = require("./linq");
exports.Linq = linq_1.Linq;
exports.LQ = linq_1.LQ;
// Iterators
require("./add/distinct");
require("./add/except");
require("./add/filter");
require("./add/groupBy");
require("./add/intersect");
require("./add/join");
require("./add/map");
require("./add/orderBy");
require("./add/skip");
require("./add/skipWhile");
require("./add/take");
require("./add/takeWhile");
require("./add/zip");
// Operators
require("./add/all");
require("./add/any");
require("./add/average");
require("./add/first");
require("./add/last");
require("./add/max");
require("./add/min");
require("./add/single");
require("./add/sum");

},{"./add/all":10,"./add/any":11,"./add/average":12,"./add/distinct":13,"./add/except":14,"./add/filter":15,"./add/first":16,"./add/groupBy":17,"./add/intersect":18,"./add/join":19,"./add/last":20,"./add/map":21,"./add/max":22,"./add/min":23,"./add/orderBy":24,"./add/single":25,"./add/skip":26,"./add/skipWhile":27,"./add/sum":28,"./add/take":29,"./add/takeWhile":30,"./add/zip":31,"./iterator/orderBy":40,"./linq":46}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9iaW5hcnlUcmVlLmpzIiwiZGlzdC9zcmMvY29sbGVjdGlvbnMvbGlua2VkTGlzdC5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL2xpc3QuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9xdWV1ZS5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL3N0YWNrLmpzIiwiZGlzdC9zcmMvaGVscGVycy9kYXRlcy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvbnVtYmVycy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvc3RyaW5ncy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvdXJsLmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvYWxsLmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvYW55LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvYXZlcmFnZS5qcyIsImRpc3Qvc3JjL2xpbnEvYWRkL2Rpc3RpbmN0LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvZXhjZXB0LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvZmlsdGVyLmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvZmlyc3QuanMiLCJkaXN0L3NyYy9saW5xL2FkZC9ncm91cEJ5LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvaW50ZXJzZWN0LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvam9pbi5qcyIsImRpc3Qvc3JjL2xpbnEvYWRkL2xhc3QuanMiLCJkaXN0L3NyYy9saW5xL2FkZC9tYXAuanMiLCJkaXN0L3NyYy9saW5xL2FkZC9tYXguanMiLCJkaXN0L3NyYy9saW5xL2FkZC9taW4uanMiLCJkaXN0L3NyYy9saW5xL2FkZC9vcmRlckJ5LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvc2luZ2xlLmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvc2tpcC5qcyIsImRpc3Qvc3JjL2xpbnEvYWRkL3NraXBXaGlsZS5qcyIsImRpc3Qvc3JjL2xpbnEvYWRkL3N1bS5qcyIsImRpc3Qvc3JjL2xpbnEvYWRkL3Rha2UuanMiLCJkaXN0L3NyYy9saW5xL2FkZC90YWtlV2hpbGUuanMiLCJkaXN0L3NyYy9saW5xL2FkZC96aXAuanMiLCJkaXN0L3NyYy9saW5xL2l0ZXJhdG9yL2Rpc3RpbmN0LmpzIiwiZGlzdC9zcmMvbGlucS9pdGVyYXRvci9leGNlcHQuanMiLCJkaXN0L3NyYy9saW5xL2l0ZXJhdG9yL2ZpbHRlci5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IvZ3JvdXBCeS5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IvaW50ZXJzZWN0LmpzIiwiZGlzdC9zcmMvbGlucS9pdGVyYXRvci9pdGVyYXRvci5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3Ivam9pbi5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IvbWFwLmpzIiwiZGlzdC9zcmMvbGlucS9pdGVyYXRvci9vcmRlckJ5LmpzIiwiZGlzdC9zcmMvbGlucS9pdGVyYXRvci9za2lwLmpzIiwiZGlzdC9zcmMvbGlucS9pdGVyYXRvci9za2lwV2hpbGUuanMiLCJkaXN0L3NyYy9saW5xL2l0ZXJhdG9yL3Rha2UuanMiLCJkaXN0L3NyYy9saW5xL2l0ZXJhdG9yL3Rha2VXaGlsZS5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IvemlwLmpzIiwiZGlzdC9zcmMvbGlucS9saW5xLmpzIiwiZGlzdC9zcmMvbGlucS9tYWtlVmFsdWVQcmVkaWNhdGUuanMiLCJkaXN0L3NyYy9saW5xL29wZXJhdG9yL2FsbC5qcyIsImRpc3Qvc3JjL2xpbnEvb3BlcmF0b3IvYW55LmpzIiwiZGlzdC9zcmMvbGlucS9vcGVyYXRvci9hdmVyYWdlLmpzIiwiZGlzdC9zcmMvbGlucS9vcGVyYXRvci9maXJzdC5qcyIsImRpc3Qvc3JjL2xpbnEvb3BlcmF0b3IvbGFzdC5qcyIsImRpc3Qvc3JjL2xpbnEvb3BlcmF0b3IvbWF4LmpzIiwiZGlzdC9zcmMvbGlucS9vcGVyYXRvci9taW4uanMiLCJkaXN0L3NyYy9saW5xL29wZXJhdG9yL3NpbmdsZS5qcyIsImRpc3Qvc3JjL2xpbnEvb3BlcmF0b3Ivc3VtLmpzIiwiZGlzdC9zcmMvdXRpbC9pbmRleC5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL2luZGV4LmpzIiwiZGlzdC9zcmMvaGVscGVycy9pbmRleC5qcyIsImRpc3Qvc3JjL2xpbnEvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBxdWV1ZV8xID0gcmVxdWlyZShcIi4vcXVldWVcIik7XHJcbnZhciBCaW5hcnlUcmVlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEJpbmFyeVRyZWUoc2VsZWN0b3JGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9zZWxlY3RvciA9IHNlbGVjdG9yRnVuY3Rpb24gfHwgVXRpbC5kZWZhdWx0U2VsZWN0b3I7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEluc2VydCBhbiBpdGVtIGludG8gdGhlIHRyZWUuXHJcbiAgICAgKiBAcGFyYW0gaXRlbVxyXG4gICAgICogQHJldHVybnMgYm9vbGVhbiBSZXR1cm4gZmFsc2UgaWYgdGhlIGl0ZW0gYWxyZWFkeSBleGlzdHMuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiB0aGlzLmluc2VydEF1eCh0aGlzLl9yb290LCBuZXcgVHJlZU5vZGUoaXRlbSkpOyB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYSByYW5nZSBvZiBpdGVtcyBpbnRvIHRoZSB0cmVlLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuaW5zZXJ0UmFuZ2UgPSBmdW5jdGlvbiAoaXRlbXMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHsgX3RoaXMuaW5zZXJ0KGl0ZW0pOyB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEluc2VydCBhbiBpdGVtIGludG8gdGhlIHRyZWUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqIEBwYXJhbSBub2RlIFRoZSBub2RlIHdlIHdpc2ggdG8gaW5zZXJ0XHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmluc2VydEF1eCA9IGZ1bmN0aW9uICh0cmVlLCBub2RlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9yb290KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSBub2RlO1xyXG4gICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbXAgPSBVdGlsLmRlZmF1bHRDb21wYXJlcih0aGlzLl9zZWxlY3Rvcihub2RlLnZhbHVlKSwgdGhpcy5fc2VsZWN0b3IodHJlZS52YWx1ZSkpO1xyXG4gICAgICAgIGlmIChjb21wIDwgMCkge1xyXG4gICAgICAgICAgICBpZiAodHJlZS5sZWZ0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluc2VydEF1eCh0cmVlLmxlZnQsIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJlZS5sZWZ0ID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdHJlZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNvbXAgPiAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0cmVlLnJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluc2VydEF1eCh0cmVlLnJpZ2h0LCBub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyZWUucmlnaHQgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSB0cmVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9zZWFyY2godGhpcy5fcm9vdCwgaXRlbSk7XHJcbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgaWYgKG5vZGUgPT09IHRoaXMuX3Jvb3QpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9yb290O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vZGUudmFsdWUgPCBub2RlLnBhcmVudC52YWx1ZSlcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLnBhcmVudC5sZWZ0O1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnQucmlnaHQ7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBub2RlLnBhcmVudDtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gbm9kZTtcclxuICAgICAgICAgICAgd2hpbGUgKHJpZ2h0LnJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0LnJpZ2h0O1xyXG4gICAgICAgICAgICB9IC8vIEdldCByaWdodCBtb3N0IGl0ZW0uXHJcbiAgICAgICAgICAgIGlmIChyaWdodC5sZWZ0KSB7XHJcbiAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0LmxlZnQ7IC8vIElmIHRoZSByaWdodCBtb3N0IGl0ZW0gaGFzIGEgbGVmdCwgdXNlIHRoYXQgaW5zdGVhZC5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChyaWdodC52YWx1ZSAhPT0gbm9kZS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0LmxlZnQgPSByaWdodC5wYXJlbnQubGVmdDtcclxuICAgICAgICAgICAgICAgICAgICByaWdodC5sZWZ0LnBhcmVudCA9IHJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyaWdodC5wYXJlbnQudmFsdWUgPT09IG5vZGUudmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gcmlnaHQucGFyZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJpZ2h0LnBhcmVudCA9IG5vZGUucGFyZW50O1xyXG4gICAgICAgICAgICBub2RlLmxlZnQgPSBub2RlLnJpZ2h0ID0gbm9kZS5wYXJlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmIChub2RlID09PSB0aGlzLl9yb290KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yb290ID0gcmlnaHQ7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcm9vdC5wYXJlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgdGhlIHRyZWUgY29udGFpbnMgYSBnaXZlbiBpdGVtLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGl0ZW0gZXhpc3RzIGluIHRoZSB0cmVlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fc2VhcmNoKHRoaXMuX3Jvb3QsIGl0ZW0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZSBjYWxsYmFjayBmb3IgZWFjaCBpdGVtLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICogQHNlZSBpbm9yZGVyVHJhdmVyc2FsXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWwoY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogTWFrZSBpbnRvIGFuIChvcmRlcmVkKSBhcnJheS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IGFyci5wdXNoKGl0ZW0pOyB9KTtcclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgd2hlbiBlbnRlcmluZyAocGFzc2luZyBvbiB0aGUgbGVmdCBzaWRlIG9mKSBhbiBpdGVtLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5wcmVvcmRlclRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykgeyB0aGlzLnByZW9yZGVyVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayB3aGVuIGVudGVyaW5nIChwYXNzaW5nIG9uIHRoZSBsZWZ0IHNpZGUgb2YpIGFuIGl0ZW0uXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqIEBwYXJhbSBzaWduYWwgT2JqZWN0IChzbyBpdCdzIGEgcmVmZXJlbmNlKSB0aGF0IHdlIHVzZSB0byBrbm93IHdoZW4gdGhlIGNhbGxiYWNrIHJldHVybmVkIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5wcmVvcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uICh0cmVlLCBjYWxsYmFjaywgc2lnbmFsKSB7XHJcbiAgICAgICAgaWYgKCF0cmVlIHx8IHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgc2lnbmFsLnN0b3AgPSAoY2FsbGJhY2sodHJlZS52YWx1ZSkgPT09IGZhbHNlKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByZW9yZGVyVHJhdmVyc2FsQXV4KHRyZWUubGVmdCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcmVvcmRlclRyYXZlcnNhbEF1eCh0cmVlLnJpZ2h0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlIHRoZSB0cmVlIGFuZCBleGVjdXRlIGNhbGxiYWNrIHdoZW4gcGFzc2luZyAocGFzcyB1bmRlciB0aGUgaXRlbSkgYW4gaXRlbVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbm9yZGVyVHJhdmVyc2FsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7IHRoaXMuaW5vcmRlclRyYXZlcnNhbEF1eCh0aGlzLl9yb290LCBjYWxsYmFjaywgeyBzdG9wOiBmYWxzZSB9KTsgfTtcclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgd2hlbiBwYXNzaW5nIChwYXNzIHVuZGVyIHRoZSBpdGVtKSBhbiBpdGVtXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqIEBwYXJhbSBzaWduYWwgT2JqZWN0IChzbyBpdCdzIGEgcmVmZXJlbmNlKSB0aGF0IHdlIHVzZSB0byBrbm93IHdoZW4gdGhlIGNhbGxiYWNrIHJldHVybmVkIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbm9yZGVyVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICBpZiAoIXRyZWUgfHwgc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5sZWZ0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBzaWduYWwuc3RvcCA9IChjYWxsYmFjayh0cmVlLnZhbHVlKSA9PT0gZmFsc2UpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaW5vcmRlclRyYXZlcnNhbEF1eCh0cmVlLnJpZ2h0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlIHRoZSB0cmVlIGFuZCBleGVjdXRlIGNhbGxiYWNrIHdoZW4gbGVhdmluZyAocGFzc2luZyBvbiB0aGUgcmlnaHQgc2lkZSBvZikgYW4gaXRlbVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5wb3N0b3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5wb3N0b3JkZXJUcmF2ZXJzYWxBdXgodGhpcy5fcm9vdCwgY2FsbGJhY2ssIHsgc3RvcDogZmFsc2UgfSk7IH07XHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlIHRoZSB0cmVlIGFuZCBleGVjdXRlIGNhbGxiYWNrIHdoZW4gcGFzc2luZyAocGFzcyB1bmRlciB0aGUgaXRlbSkgYW4gaXRlbVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgV2hhdCBzaG91bGQgd2UgZG8gd2hlbiB3ZSBnZXQgdGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gc2lnbmFsIE9iamVjdCAoc28gaXQncyBhIHJlZmVyZW5jZSkgdGhhdCB3ZSB1c2UgdG8ga25vdyB3aGVuIHRoZSBjYWxsYmFjayByZXR1cm5lZCBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucG9zdG9yZGVyVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICBpZiAoIXRyZWUgfHwgc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnBvc3RvcmRlclRyYXZlcnNhbEF1eCh0cmVlLmxlZnQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KHRyZWUucmlnaHQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHNpZ25hbC5zdG9wID0gKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBvbmUgbGV2ZWwgYXQgYSB0aW1lIGFuZCBleGVjdXRlIGNhbGxiYWNrIG9uIGVhY2ggYW4gaXRlbVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5sZXZlbFRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykgeyB0aGlzLmxldmVsVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBvbmUgbGV2ZWwgYXQgYSB0aW1lIGFuZCBleGVjdXRlIGNhbGxiYWNrIG9uIGVhY2ggYW4gaXRlbVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgV2hhdCBzaG91bGQgd2UgZG8gd2hlbiB3ZSBnZXQgdGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gc2lnbmFsIE9iamVjdCAoc28gaXQncyBhIHJlZmVyZW5jZSkgdGhhdCB3ZSB1c2UgdG8ga25vdyB3aGVuIHRoZSBjYWxsYmFjayByZXR1cm5lZCBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubGV2ZWxUcmF2ZXJzYWxBdXggPSBmdW5jdGlvbiAodHJlZSwgY2FsbGJhY2ssIHNpZ25hbCkge1xyXG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBxdWV1ZV8xLmRlZmF1bHQoKTtcclxuICAgICAgICBpZiAodHJlZSlcclxuICAgICAgICAgICAgcXVldWUuZW5xdWV1ZSh0cmVlKTtcclxuICAgICAgICB3aGlsZSAoIVV0aWwuaXNVbmRlZmluZWQodHJlZSA9IHF1ZXVlLmRlcXVldWUoKSkpIHtcclxuICAgICAgICAgICAgc2lnbmFsLnN0b3AgPSBzaWduYWwuc3RvcCB8fCAoY2FsbGJhY2sodHJlZS52YWx1ZSkgPT09IGZhbHNlKTtcclxuICAgICAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodHJlZS5sZWZ0KVxyXG4gICAgICAgICAgICAgICAgcXVldWUuZW5xdWV1ZSh0cmVlLmxlZnQpO1xyXG4gICAgICAgICAgICBpZiAodHJlZS5yaWdodClcclxuICAgICAgICAgICAgICAgIHF1ZXVlLmVucXVldWUodHJlZS5yaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtaW5pbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1pbiA9IHRoaXMubWluQXV4KHRoaXMuX3Jvb3QpO1xyXG4gICAgICAgIGlmIChtaW4pXHJcbiAgICAgICAgICAgIHJldHVybiBtaW4udmFsdWU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG1pbmltdW0gdmFsdWUgaW4gdGhlIHRyZWUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubWluQXV4ID0gZnVuY3Rpb24gKHRyZWUpIHtcclxuICAgICAgICBpZiAodHJlZS5sZWZ0KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5taW5BdXgodHJlZS5sZWZ0KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0cmVlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtYXhpbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1heCA9IHRoaXMubWF4QXV4KHRoaXMuX3Jvb3QpO1xyXG4gICAgICAgIGlmIChtYXgpXHJcbiAgICAgICAgICAgIHJldHVybiBtYXgudmFsdWU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG1heGltdW0gdmFsdWUgaW4gdGhlIHRyZWUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubWF4QXV4ID0gZnVuY3Rpb24gKHRyZWUpIHtcclxuICAgICAgICBpZiAodHJlZS5yaWdodClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF4QXV4KHRyZWUucmlnaHQpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRyZWU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIGRlcHRoIG9mIGEgdHJlZS5cclxuICAgICAqIC0xID0gRW1wdHlcclxuICAgICAqIDAgPSBPbmx5IHJvb3RcclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuZGVwdGggPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLmRlcHRoQXV4KHRoaXMuX3Jvb3QpOyB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG1pbmltdW0gdmFsdWUgaW4gdGhlIHRyZWUuXHJcbiAgICAgKiAtMSA9IEVtcHR5XHJcbiAgICAgKiAwID0gT25seSByb290XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuZGVwdGhBdXggPSBmdW5jdGlvbiAodHJlZSkge1xyXG4gICAgICAgIGlmICghdHJlZSlcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLmRlcHRoQXV4KHRyZWUubGVmdCksIHRoaXMuZGVwdGhBdXgodHJlZS5yaWdodCkpICsgMTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNlYXJjaCB0aGUgdHJlZSBmb3IgYSBzcGVjaWZpYyBpdGVtLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gaXRlbVxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5fc2VhcmNoID0gZnVuY3Rpb24gKHRyZWUsIGl0ZW0pIHtcclxuICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZCh0cmVlKSlcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAodHJlZS52YWx1ZSA9PT0gaXRlbSlcclxuICAgICAgICAgICAgcmV0dXJuIHRyZWU7XHJcbiAgICAgICAgdmFyIGNvbXAgPSBVdGlsLmRlZmF1bHRDb21wYXJlcih0aGlzLl9zZWxlY3RvcihpdGVtKSwgdGhpcy5fc2VsZWN0b3IodHJlZS52YWx1ZSkpO1xyXG4gICAgICAgIGlmIChjb21wIDwgMCkge1xyXG4gICAgICAgICAgICB0cmVlID0gdGhpcy5fc2VhcmNoKHRyZWUubGVmdCwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNvbXAgPiAwKSB7XHJcbiAgICAgICAgICAgIHRyZWUgPSB0aGlzLl9zZWFyY2godHJlZS5yaWdodCwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cmVlO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBCaW5hcnlUcmVlO1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBCaW5hcnlUcmVlO1xyXG52YXIgVHJlZU5vZGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVHJlZU5vZGUodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIElmIHRoZSBub2RlIGhhcyBuZWl0aGVyIGEgcmlnaHQgb3IgbGVmdCBjaGlsZC5cclxuICAgICAqL1xyXG4gICAgVHJlZU5vZGUucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAhdGhpcy5sZWZ0ICYmICF0aGlzLnJpZ2h0OyB9O1xyXG4gICAgcmV0dXJuIFRyZWVOb2RlO1xyXG59KCkpO1xyXG5leHBvcnRzLlRyZWVOb2RlID0gVHJlZU5vZGU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJpbmFyeVRyZWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIFJlcHJlc2VudCBhIGRvdWJseS1saW5rZWQgbGlzdCBpbiB3aGljaCB5b3UgY2FuIGFkZCBhbmQgcmVtb3ZlIGl0ZW1zLlxyXG4gKi9cclxudmFyIExpbmtlZExpc3QgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gaXRlbXMgVFtdIEl0ZW1zIHRvIHN0YXJ0IGZpbGxpbmcgdGhlIHN0YWNrIHdpdGguXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIExpbmtlZExpc3QoaXRlbXMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcclxuICAgICAgICBpZiAoaXRlbXMpXHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKHgpIHsgX3RoaXMuaW5zZXJ0KHgpOyB9KTtcclxuICAgIH1cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLl9nZXROb2RlID0gZnVuY3Rpb24gKGF0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIGVsc2UgaWYgKGF0ID09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9maXJzdDtcclxuICAgICAgICBlbHNlIGlmIChhdCA+IHRoaXMubGVuZ3RoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGFzdDtcclxuICAgICAgICB2YXIgaSwgbm9kZTtcclxuICAgICAgICBpZiAoYXQgPCB0aGlzLmxlbmd0aCAvIDIpIHtcclxuICAgICAgICAgICAgLy8gaWYgZmV0Y2hpbmcgZnJvbSBmaXJzdCBoYWxmIG9mIGxpc3QsIHN0YXJ0IGZyb20gdGhlIGJlZ2lubmluZ1xyXG4gICAgICAgICAgICBub2RlID0gdGhpcy5fZmlyc3Q7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhdDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBpZiBmZXRjaGluZyBmcm9tIGxhc3QgaGFsZiBvZiBsaXN0LCBzdGFydCBmcm9tIHRoZSBlbmRcclxuICAgICAgICAgICAgbm9kZSA9IHRoaXMuX2xhc3Q7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+IGF0OyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLnByZXY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYW4gaXRlbSBhdCBhIGNlcnRhaW4gcG9zaXRpb24uXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChhdCkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fZ2V0Tm9kZShhdCk7XHJcbiAgICAgICAgaWYgKG5vZGUpXHJcbiAgICAgICAgICAgIHJldHVybiBub2RlLnZhbDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEluc2VydCBhbiBpdGVtIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBuZXcgTGlua2VkTGlzdE5vZGUoaXRlbSk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9maXJzdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9maXJzdCA9IHRoaXMuX2xhc3QgPSBub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZS5wcmV2ID0gdGhpcy5fbGFzdDtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdC5uZXh0ID0gbm9kZTtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdCA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiArK3RoaXMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0IGFuIGl0ZW0gYXQgYSBjZXJ0YWluIHBvc2l0aW9uIGluIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5pbnNlcnRBdCA9IGZ1bmN0aW9uIChhdCwgaXRlbSkge1xyXG4gICAgICAgIGlmIChhdCA+PSB0aGlzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0KGl0ZW0pO1xyXG4gICAgICAgIHZhciBub2RlID0gbmV3IExpbmtlZExpc3ROb2RlKGl0ZW0pLCBuZXh0ID0gdGhpcy5fZ2V0Tm9kZShhdCksIHByZXYgPSBuZXh0LnByZXY7XHJcbiAgICAgICAgaWYgKHByZXYpXHJcbiAgICAgICAgICAgIHByZXYubmV4dCA9IG5vZGU7XHJcbiAgICAgICAgbmV4dC5wcmV2ID0gbm9kZTtcclxuICAgICAgICBub2RlLnByZXYgPSBwcmV2O1xyXG4gICAgICAgIG5vZGUubmV4dCA9IG5leHQ7XHJcbiAgICAgICAgaWYgKGF0ID09PSAwKVxyXG4gICAgICAgICAgICB0aGlzLl9maXJzdCA9IG5vZGU7XHJcbiAgICAgICAgcmV0dXJuICsrdGhpcy5sZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYW4gaXRlbSBmcm9tIGEgY2VydGFpbiBwb3NpdGlvbiBpbiB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUucmVtb3ZlQXQgPSBmdW5jdGlvbiAoYXQpIHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fZ2V0Tm9kZShhdCk7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIC8vIG9ubHkgMSBpdGVtIGxlZnQgdG8gcmVtb3ZlLlxyXG4gICAgICAgICAgICB0aGlzLl9maXJzdCA9IHRoaXMuX2xhc3QgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5vZGUgPT09IHRoaXMuX2ZpcnN0KSB7XHJcbiAgICAgICAgICAgIC8vIHJlbW92aW5nIHRoZSBmaXJzdCBpdGVtLlxyXG4gICAgICAgICAgICBub2RlLm5leHQucHJldiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5vZGUgPT09IHRoaXMuX2xhc3QpIHtcclxuICAgICAgICAgICAgLy8gcmVtb3ZpbmcgdGhlIGxhc3QgaXRlbS5cclxuICAgICAgICAgICAgbm9kZS5wcmV2Lm5leHQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3QgPSBub2RlLnByZXY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyByZW1vdmluZyBpdGVtIGluIHRoZSBtaWRkbGUgb2YgdGhlIGxpc3RcclxuICAgICAgICAgICAgbm9kZS5wcmV2Lm5leHQgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgICAgIG5vZGUubmV4dC5wcmV2ID0gbm9kZS5wcmV2O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gLS10aGlzLmxlbmd0aDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENsZWFycyB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLl9sYXN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlua2VkTGlzdDtcclxufSgpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGlua2VkTGlzdDtcclxudmFyIExpbmtlZExpc3ROb2RlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpbmtlZExpc3ROb2RlKHZhbCkge1xyXG4gICAgICAgIHRoaXMudmFsID0gdmFsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIExpbmtlZExpc3ROb2RlO1xyXG59KCkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5rZWRMaXN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBMaXN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG5ldyBsaXN0IG9iamVjdC5cclxuICAgICAqIFV0aWxpemVzIGEgbm9ybWFsIGFycmF5IGJlaGluZCB0aGUgc2NlbmVzIGFuZCBuYXRpdmUgZnVuY3Rpb25zIHdoZW5ldmVyIHBvc3NpYmxlLFxyXG4gICAgICogYnV0IHdpdGggZnVuY3Rpb25zIGtub3duIGZvciBhIExpc3QuXHJcbiAgICAgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2UgYXJyYXkgZnJvbSB3aGljaCB0byBjcmVhdGUgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIExpc3Qoc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlIHx8IFtdO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KExpc3QucHJvdG90eXBlLCBcImxlbmd0aFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9zb3VyY2UubGVuZ3RoOyB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBsaXN0IGFzIGEgYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gb2JqZWN0IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIGJlIGFkZGVkIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnB1c2goaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5hZGQgPSBmdW5jdGlvbiAoc291cmNlLCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuYWRkKGl0ZW0pLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgdGhlIGVsZW1lbnRzIG9mIHRoZSBzcGVjaWZpZWQgY29sbGVjdGlvbiB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gd2hvc2UgZWxlbWVudHMgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmFkZFJhbmdlID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24pIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSAoY29sbGVjdGlvbiBpbnN0YW5jZW9mIExpc3QpID8gY29sbGVjdGlvbi50b0FycmF5KCkgOiBjb2xsZWN0aW9uO1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMuX3NvdXJjZSwgaXRlbXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QuYWRkUmFuZ2UgPSBmdW5jdGlvbiAoc291cmNlLCBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuYWRkUmFuZ2UoY29sbGVjdGlvbikudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIC8vIC8qKlxyXG4gICAgLy8gICogUmV0dXJucyBhIG5ldyByZWFkIG9ubHkgaW5zdGFuY2Ugb2YgdGhlIGxpc3QuXHJcbiAgICAvLyAgKi9cclxuICAgIC8vIGFzUmVhZE9ubHkoKTogTGlzdDxUPiB7XHJcbiAgICAvLyAgICAgcmV0dXJuIG5ldyBMaXN0KE9iamVjdC5mcmVlemUodGhpcy5fc291cmNlLnNsaWNlKCkpKTtcclxuICAgIC8vIH1cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgdGhlIHNwZWNpZmllZCBhY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5mb3JFYWNoKGNhbGxiYWNrKTtcclxuICAgIH07XHJcbiAgICBMaXN0LmZvckVhY2ggPSBmdW5jdGlvbiAoc291cmNlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIG5ldyBMaXN0KHNvdXJjZSkuZm9yRWFjaChjYWxsYmFjayk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZWFyY2hlcyBmb3IgdGhlIHNwZWNpZmllZCBvYmplY3QgYW5kIHJldHVybnMgdGhlIHplcm8tYmFzZWQgaW5kZXggb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugd2l0aGluIHRoZSBzcGVjaWZpZWQgcmFuZ2Ugb2YgZWxlbWVudHMgaW4gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBzdGFydGluZyBpbmRleCBvZiB0aGUgc2VhcmNoLlxyXG4gICAgICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIHNlY3Rpb24gdG8gc2VhcmNoLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gKGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gMDsgfVxyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gdGhpcy5sZW5ndGg7IH1cclxuICAgICAgICB2YXIgaWR4ID0gdGhpcy5fc291cmNlLmluZGV4T2YoaXRlbSwgaW5kZXgpO1xyXG4gICAgICAgIGlmIChpZHggPiBjb3VudCAtIGluZGV4ICsgMSlcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiBpZHg7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5pbmRleE9mID0gZnVuY3Rpb24gKHNvdXJjZSwgaXRlbSwgaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSB2b2lkIDApIHsgaW5kZXggPSAwOyB9XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSBzb3VyY2UubGVuZ3RoOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuaW5kZXhPZihpdGVtLCBpbmRleCwgY291bnQpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU2VhcmNoZXMgZm9yIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGFuZCByZXR1cm5zIHRoZSB6ZXJvLWJhc2VkIGluZGV4IG9mIHRoZSBsYXN0IG9jY3VycmVuY2Ugd2l0aGluIHRoZSByYW5nZSBvZiBlbGVtZW50cyBpbiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBpdGVtIFRoZSBvYmplY3QgdG8gbG9jYXRlIGluIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSB6ZXJvLWJhc2VkIHN0YXJ0aW5nIGluZGV4IG9mIHRoZSBiYWNrd2FyZCBzZWFyY2guXHJcbiAgICAgKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgc2VjdGlvbiB0byBzZWFyY2guXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gKGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gdGhpcy5sZW5ndGggLSAxOyB9XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSB0aGlzLmxlbmd0aDsgfVxyXG4gICAgICAgIHZhciBpZHggPSB0aGlzLl9zb3VyY2UubGFzdEluZGV4T2YoaXRlbSwgaW5kZXgpO1xyXG4gICAgICAgIGlmIChpZHggPCBpbmRleCArIDEgLSBjb3VudClcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiBpZHg7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIChzb3VyY2UsIGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gc291cmNlLmxlbmd0aCAtIDE7IH1cclxuICAgICAgICBpZiAoY291bnQgPT09IHZvaWQgMCkgeyBjb3VudCA9IHNvdXJjZS5sZW5ndGg7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5sYXN0SW5kZXhPZihpdGVtLCBpbmRleCwgY291bnQpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0cyBhbiBlbGVtZW50IGludG8gdGhlIGxpc3QgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBpbmRleCBhdCB3aGljaCBpdGVtIHNob3VsZCBiZSBpbnNlcnRlZC5cclxuICAgICAqIEBwYXJhbSBpdGVtIFRoZSBvYmplY3QgdG8gaW5zZXJ0LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0Lmluc2VydCA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuaW5zZXJ0KGluZGV4LCBpdGVtKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnRzIHRoZSBlbGVtZW50cyBvZiBhIGNvbGxlY3Rpb24gaW50byB0aGUgbGlzdCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxyXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSB6ZXJvLWJhc2VkIGluZGV4IGF0IHdoaWNoIHRoZSBuZXcgZWxlbWVudHMgc2hvdWxkIGJlIGluc2VydGVkLlxyXG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gd2hvc2UgZWxlbWVudHMgc2hvdWxkIGJlIGluc2VydGVkIGludG8gdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmluc2VydFJhbmdlID0gZnVuY3Rpb24gKGluZGV4LCBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gKGNvbGxlY3Rpb24gaW5zdGFuY2VvZiBMaXN0KSA/IGNvbGxlY3Rpb24udG9BcnJheSgpIDogY29sbGVjdGlvbjtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMuX3NvdXJjZSwgbmV3IEFycmF5KGluZGV4LCAwKS5jb25jYXQoaXRlbXMpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0Lmluc2VydFJhbmdlID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5pbnNlcnRSYW5nZShpbmRleCwgY29sbGVjdGlvbikudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxyXG4gICAgICogQHBhcmFtIGluZGV4IEdldHMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZVtpbmRleF07XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggU2V0cyB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxyXG4gICAgICogQHBhcmFtIGl0ZW0gVGhlIG9iamVjdCB0byBzZXQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gdGhpcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluZGV4IHdhcyBvdXQgb2YgcmFuZ2UuIE11c3QgYmUgbm9uLW5lZ2F0aXZlIGFuZCBsZXNzIHRoYW4gdGhlIHNpemUgb2YgdGhlIGNvbGxlY3Rpb24uXCIpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlW2luZGV4XSA9IGl0ZW07XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGEgc3BlY2lmaWMgb2JqZWN0IGZyb20gdGhlIExpc3QoT2bigIJUKS5cclxuICAgICAqIEBwYXJhbSBpdGVtIFRoZSBvYmplY3QgdG8gcmVtb3ZlIGZyb20gdGhlIExpc3QoT2bigIJUKS5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVBdCh0aGlzLl9zb3VyY2UuaW5kZXhPZihpdGVtKSk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZW1vdmUgPSBmdW5jdGlvbiAoc291cmNlLCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlKGl0ZW0pLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIHRoZSBlbGVtZW50cyB0aGF0IG1hdGNoIHRoZSBjb25kaXRpb25zIGRlZmluZWQgYnkgdGhlIHNwZWNpZmllZCBwcmVkaWNhdGUuXHJcbiAgICAgKiBAcGFyYW0gcHJlZGljYXRlIFRoZSBwcmVkaWNhdGUgZGVsZWdhdGUgdGhhdCBkZWZpbmVzIHRoZSBjb25kaXRpb25zIG9mIHRoZSBlbGVtZW50cyB0byByZW1vdmUuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZUFsbCA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAoIXByZWRpY2F0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKDApOyAvLyBzcGxpY2UgcmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIGVtcHR5IGFycmF5IGxldCdzIHVzIGtlZXAgdGhlIHJlZmVyZW5jZVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGkgPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJlZGljYXRlKHRoaXMuX3NvdXJjZVtpXSwgaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGktLTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnJlbW92ZUFsbCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLnJlbW92ZUFsbChwcmVkaWNhdGUpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleCBvZiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBpbmRleCBvZiB0aGUgZWxlbWVudCB0byByZW1vdmUuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZUF0ID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXggb2YgdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgaW5kZXggb2YgdGhlIGVsZW1lbnQgdG8gcmVtb3ZlLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnJlbW92ZUF0ID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZW1vdmVBdChpbmRleCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhIHJhbmdlIG9mIGVsZW1lbnRzIGZyb20gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHJhbmdlIG9mIGVsZW1lbnRzIHRvIHJlbW92ZS5cclxuICAgICAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHJlbW92ZS5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmVtb3ZlUmFuZ2UgPSBmdW5jdGlvbiAoaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgY291bnQgKyBpbmRleCAtIDEpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QucmVtb3ZlUmFuZ2UgPSBmdW5jdGlvbiAoc291cmNlLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZW1vdmVSYW5nZShpbmRleCwgY291bnQpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIGVsZW1lbnRzIGZyb20gdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5jbGVhciA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5jbGVhcigpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBudW1iZXIgdGhhdCByZXByZXNlbnRzIGhvdyBtYW55IGVsZW1lbnRzIGluIHRoZSBzcGVjaWZpZWQgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuICAgICAqIElmIHByZWRpY2F0ZSBpcyBvbWl0dGVkLCB0aGUgZnVsbCBzaXplIG9mIHRoZSBsaXN0IHdpbGwgYmUgcmV0dXJuZWQuXHJcbiAgICAgKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5jb3VudCA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAoIXByZWRpY2F0ZSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZS5sZW5ndGg7XHJcbiAgICAgICAgdmFyIHN1bSA9IDA7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSlcclxuICAgICAgICAgICAgICAgIHN1bSsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICB9O1xyXG4gICAgTGlzdC5jb3VudCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmNvdW50KHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXZlcnNlcyB0aGUgb3JkZXIgb2YgdGhlIGVsZW1lbnRzIGluIHRoZSBzcGVjaWZpZWQgcmFuZ2UuXHJcbiAgICAgKiBJZiBpbmRleCBhbmQgY291bnQgaXMgb21pdHRlZCB0aGUgZW50aXJlIGxpc3Qgd2lsbCBiZSByZXZlcnNlZC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBzdGFydGluZyBpbmRleCBvZiB0aGUgcmFuZ2UgdG8gcmV2ZXJzZS5cclxuICAgICAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSByYW5nZSB0byByZXZlcnNlLiBJZiBub3QgcHJvdmlkZWQgaXQgd2lsbCBkZWZhdWx0IHRvIGVuZCBvZiB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uIChpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoKFV0aWwuaXNVbmRlZmluZWQoaW5kZXgpICYmIFV0aWwuaXNVbmRlZmluZWQoY291bnQpKSB8fCAoaW5kZXggPT09IDAgJiYgY291bnQgPj0gdGhpcy5sZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIC8vIHJldmVyc2UgdGhlIGVudGlyZSBsaXN0XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZS5yZXZlcnNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChjb3VudCkpXHJcbiAgICAgICAgICAgICAgICBjb3VudCA9IHRoaXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgY291bnQgKyBpbmRleCAtIDEpO1xyXG4gICAgICAgICAgICBhcnIucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmluc2VydFJhbmdlKGluZGV4LCBhcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnJldmVyc2UgPSBmdW5jdGlvbiAoc291cmNlLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZXZlcnNlKGluZGV4LCBjb3VudCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucmFuZ2UgPSBmdW5jdGlvbiAoc3RhcnQsIGNvdW50KSB7XHJcbiAgICAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IHN0YXJ0ICsgY291bnQ7IGkrKylcclxuICAgICAgICAgICAgYXJyLnB1c2goaSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KGFycik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpc3Q7XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IExpc3Q7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbmtlZExpc3RfMSA9IHJlcXVpcmUoXCIuL2xpbmtlZExpc3RcIik7XHJcbi8qKlxyXG4gKiBBIFN0YWNrIHdvcmtzIGJ5IGZpcnN0IGluLCBmaXJzdCBvdXQuXHJcbiAqL1xyXG52YXIgUXVldWUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gaXRlbXMgVFtdIEl0ZW1zIHRvIHN0YXJ0IGZpbGxpbmcgdGhlIHN0YWNrIHdpdGguXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFF1ZXVlKGl0ZW1zKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IG5ldyBsaW5rZWRMaXN0XzEuZGVmYXVsdChpdGVtcyk7XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUXVldWUucHJvdG90eXBlLCBcImxlbmd0aFwiLCB7XHJcbiAgICAgICAgLyoqIEdldCB0aGUgbnVtYmVyIG9mIGl0ZW1zIGluIHRoZSBxdWV1ZSAqL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fbGlzdC5sZW5ndGg7IH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgO1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGFuIGl0ZW0gdG8gdGhlIGVuZCBvZiB0aGUgcXVldWUuXHJcbiAgICAgKi9cclxuICAgIFF1ZXVlLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QuaW5zZXJ0KHZhbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3QubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyBhbmQgcmVtb3ZlIGFuIGl0ZW0gZnJvbSB0aGUgaGVhZCBvZiB0aGUgcXVldWUuXHJcbiAgICAgKi9cclxuICAgIFF1ZXVlLnByb3RvdHlwZS5kZXF1ZXVlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5fbGlzdC5nZXQoMCk7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5yZW1vdmVBdCgwKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUXVldWU7XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFF1ZXVlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1xdWV1ZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlua2VkTGlzdF8xID0gcmVxdWlyZShcIi4vbGlua2VkTGlzdFwiKTtcclxuLyoqXHJcbiAqIEEgU3RhY2sgd29ya3MgYnkgbGFzdCBpbiwgZmlyc3Qgb3V0LlxyXG4gKi9cclxudmFyIFN0YWNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGl0ZW1zIFRbXSBJdGVtcyB0byBzdGFydCBmaWxsaW5nIHRoZSBzdGFjayB3aXRoLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBTdGFjayhpdGVtcykge1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSBuZXcgbGlua2VkTGlzdF8xLmRlZmF1bHQoaXRlbXMpO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YWNrLnByb3RvdHlwZSwgXCJsZW5ndGhcIiwge1xyXG4gICAgICAgIC8qKiBHZXQgdGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGUgc3RhY2sgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2xpc3QubGVuZ3RoOyB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIDtcclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhbiBpdGVtIHRvIHRoZSB0b3Agb2YgdGhlIHN0YWNrLlxyXG4gICAgICovXHJcbiAgICBTdGFjay5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5pbnNlcnRBdCgwLCBpdGVtKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdC5sZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYW5kIHJlbW92ZSBhbiBpdGVtIGZyb20gdGhlIHRvcCBvZiB0aGUgc3RhY2suXHJcbiAgICAgKi9cclxuICAgIFN0YWNrLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLnBlZWsoKTtcclxuICAgICAgICB0aGlzLl9saXN0LnJlbW92ZUF0KDApO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFuIGl0ZW0gZnJvbSB0aGUgdG9wIG9mIHRoZSBzdGFjayB3aXRob3V0IHJlbW92aW5nIGl0LlxyXG4gICAgICovXHJcbiAgICBTdGFjay5wcm90b3R5cGUucGVlayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdC5nZXQoMCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgc3RhY2tcclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QuY2xlYXIoKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU3RhY2s7XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFN0YWNrO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdGFjay5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG4vKipcclxuICogU2hvcnRoYW5kIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIERhdGVzSGVscGVyIG9iamVjdC5cclxuICogQHBhcmFtIG51bWJlciBUaGUgZGF0ZSBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICovXHJcbmZ1bmN0aW9uIERhdGVzKGRhdGUpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKTsgfVxyXG5leHBvcnRzLmRlZmF1bHQgPSBEYXRlcztcclxudmFyIERhdGVzSGVscGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIERhdGVzSGVscGVyKGRhdGUpIHtcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlO1xyXG4gICAgfVxyXG4gICAgRGF0ZXNIZWxwZXIudG9EYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChkYXRlKSlcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XHJcbiAgICAgICAgaWYgKFV0aWwuaXNTdHJpbmcoZGF0ZSkpXHJcbiAgICAgICAgICAgIGRhdGUgPSBEYXRlLnBhcnNlKGRhdGUpO1xyXG4gICAgICAgIGlmIChVdGlsLmlzTnVtYmVyKGRhdGUpKVxyXG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdlaXRoZXIgdGhlIGRhdGUgaXMgaW4gYmV0d2VlbiB0d28gbnVtYmVycy5cclxuICAgICAqIEBwYXJhbSBsb3dlciBUaGUgbG93ZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICogQHBhcmFtIHVwcGVyIFRoZSB1cHBlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKi9cclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5iZXR3ZWVuID0gZnVuY3Rpb24gKGxvd2VyLCB1cHBlcikge1xyXG4gICAgICAgIHJldHVybiBEYXRlc0hlbHBlci5iZXR3ZWVuKHRoaXMuZGF0ZSwgbG93ZXIsIHVwcGVyKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2VpdGhlciBhIGRhdGUgaXMgaW4gYmV0d2VlbiB0d28gbnVtYmVycy5cclxuICAgICAqIEBwYXJhbSBkYXRlIFRoZSBkYXRlIHdoaWNoIHRvIGNvbXBhcmUgd2l0aC5cclxuICAgICAqIEBwYXJhbSBsb3dlciBUaGUgbG93ZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICogQHBhcmFtIHVwcGVyIFRoZSB1cHBlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKi9cclxuICAgIERhdGVzSGVscGVyLmJldHdlZW4gPSBmdW5jdGlvbiAoZGF0ZSwgbG93ZXIsIHVwcGVyKSB7XHJcbiAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQobG93ZXIpKVxyXG4gICAgICAgICAgICBsb3dlciA9IG5ldyBEYXRlKDApO1xyXG4gICAgICAgIGlmIChVdGlsLmlzVW5kZWZpbmVkKHVwcGVyKSlcclxuICAgICAgICAgICAgdXBwZXIgPSBuZXcgRGF0ZSg5OTk5OTk5OTk5OTk5KTtcclxuICAgICAgICByZXR1cm4gKGxvd2VyIDw9IGRhdGUgJiYgZGF0ZSA8PSB1cHBlcik7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZFllYXJzID0gZnVuY3Rpb24gKHllYXJzKSB7IHJldHVybiB0aGlzLmFkZE1vbnRocyh5ZWFycyAqIDEyKTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRNb250aHMgPSBmdW5jdGlvbiAobW9udGhzKSB7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNldE1vbnRoKHRoaXMuZGF0ZS5nZXRNb250aCgpICsgbW9udGhzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkV2Vla3MgPSBmdW5jdGlvbiAod2VlaykgeyByZXR1cm4gdGhpcy5hZGREYXlzKHdlZWsgKiA3KTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGREYXlzID0gZnVuY3Rpb24gKGRheXMpIHsgcmV0dXJuIHRoaXMuYWRkSG91cnMoZGF5cyAqIDI0KTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRIb3VycyA9IGZ1bmN0aW9uIChob3VycykgeyByZXR1cm4gdGhpcy5hZGRNaW51dGVzKGhvdXJzICogNjApOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZE1pbnV0ZXMgPSBmdW5jdGlvbiAobWludXRlcykgeyByZXR1cm4gdGhpcy5hZGRTZWNvbmRzKG1pbnV0ZXMgKiA2MCk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkU2Vjb25kcyA9IGZ1bmN0aW9uIChzZWNvbmRzKSB7IHJldHVybiB0aGlzLmFkZE1pbGxpc2Vjb25kcyhzZWNvbmRzICogMTAwMCk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkTWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKG1pbGxpc2Vjb25kcykge1xyXG4gICAgICAgIHRoaXMuZGF0ZS5zZXRNaWxsaXNlY29uZHModGhpcy5kYXRlLmdldE1pbGxpc2Vjb25kcygpICsgbWlsbGlzZWNvbmRzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuaXNUb2RheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRlLnRvRGF0ZVN0cmluZygpID09PSBuZXcgRGF0ZSgpLnRvRGF0ZVN0cmluZygpO1xyXG4gICAgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS50b01pZG5pZ2h0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZGF0ZS5zZXRIb3VycygwKTtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0TWludXRlcygwKTtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0U2Vjb25kcygwKTtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZFllYXJzID0gZnVuY3Rpb24gKGRhdGUsIHllYXJzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkWWVhcnMoeWVhcnMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRNb250aHMgPSBmdW5jdGlvbiAoZGF0ZSwgbW9udGhzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkTW9udGhzKG1vbnRocykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZFdlZWtzID0gZnVuY3Rpb24gKGRhdGUsIHdlZWspIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRXZWVrcyh3ZWVrKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkRGF5cyA9IGZ1bmN0aW9uIChkYXRlLCBkYXlzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkRGF5cyhkYXlzKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkSG91cnMgPSBmdW5jdGlvbiAoZGF0ZSwgaG91cnMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRIb3Vycyhob3VycykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZE1pbnV0ZXMgPSBmdW5jdGlvbiAoZGF0ZSwgbWludXRlcykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZE1pbnV0ZXMobWludXRlcykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZFNlY29uZHMgPSBmdW5jdGlvbiAoZGF0ZSwgc2Vjb25kcykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZFNlY29uZHMoc2Vjb25kcykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZE1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uIChkYXRlLCBtaWxsaXNlY29uZHMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRNaWxsaXNlY29uZHMobWlsbGlzZWNvbmRzKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuaXNUb2RheSA9IGZ1bmN0aW9uIChkYXRlKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuaXNUb2RheSgpOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIudG9NaWRuaWdodCA9IGZ1bmN0aW9uIChkYXRlKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkudG9NaWRuaWdodCgpLmRhdGU7IH07XHJcbiAgICByZXR1cm4gRGF0ZXNIZWxwZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuRGF0ZXNIZWxwZXIgPSBEYXRlc0hlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0ZXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxuLyoqXHJcbiAqIFNob3J0aGFuZCBmdW5jdGlvbiB0byBjcmVhdGUgYSBOdW1iZXJzSGVscGVyIG9iamVjdC5cclxuICogQHBhcmFtIG51bWJlciBUaGUgbnVtYmVyIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gKi9cclxuZnVuY3Rpb24gTnVtYmVycyhudW0pIHsgcmV0dXJuIG5ldyBOdW1iZXJzSGVscGVyKG51bSk7IH1cclxuZXhwb3J0cy5kZWZhdWx0ID0gTnVtYmVycztcclxudmFyIE51bWJlcnNIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgTnVtYmVyc0hlbHBlciBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gbnVtYmVyIFRoZSBudW1iZXIgb24gd2hpY2ggdG8gcGVyZm9ybSB0aGUgdmFyaW91cyBmdW5jdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIE51bWJlcnNIZWxwZXIobnVtKSB7XHJcbiAgICAgICAgdGhpcy5udW0gPSBudW07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2VpdGhlciB0aGUgbnVtYmVyIGlzIGluIGJldHdlZW4gdHdvIG51bWJlcnMuXHJcbiAgICAgKiBAcGFyYW0gbG93ZXIgVGhlIGxvd2VyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqIEBwYXJhbSB1cHBlciBUaGUgdXBwZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICovXHJcbiAgICBOdW1iZXJzSGVscGVyLnByb3RvdHlwZS5iZXR3ZWVuID0gZnVuY3Rpb24gKGxvd2VyLCB1cHBlcikge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXJzSGVscGVyLmJldHdlZW4odGhpcy5udW0sIGxvd2VyLCB1cHBlcik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdlaXRoZXIgYSBudW1iZXIgaXMgaW4gYmV0d2VlbiB0d28gbnVtYmVycy5cclxuICAgICAqIEBwYXJhbSBudW1iZXIgVGhlIG51bWJlciB3aGljaCB0byBjb21wYXJlIHdpdGguXHJcbiAgICAgKiBAcGFyYW0gbG93ZXIgVGhlIGxvd2VyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqIEBwYXJhbSB1cHBlciBUaGUgdXBwZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICovXHJcbiAgICBOdW1iZXJzSGVscGVyLmJldHdlZW4gPSBmdW5jdGlvbiAobnVtLCBsb3dlciwgdXBwZXIpIHtcclxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChsb3dlcikpXHJcbiAgICAgICAgICAgIGxvd2VyID0gTnVtYmVyLk1JTl9WQUxVRTtcclxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZCh1cHBlcikpXHJcbiAgICAgICAgICAgIHVwcGVyID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgICByZXR1cm4gKGxvd2VyIDw9IG51bSAmJiBudW0gPD0gdXBwZXIpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3ZWl0aGVyIHRoZSBudW1iZXIgaXMgaW4gYW4gYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0gbnVtYmVycyBUaGUgYXJyYXkgb2YgbnVtYmVycyB0byBjb21wYXJlIHdpdGguXHJcbiAgICAgKi9cclxuICAgIE51bWJlcnNIZWxwZXIucHJvdG90eXBlLmluID0gZnVuY3Rpb24gKG51bWJlcnMpIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyc0hlbHBlci5pbih0aGlzLm51bSwgbnVtYmVycyk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdlaXRoZXIgYSBudW1iZXIgaXMgaW4gYW4gYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0gbnVtYmVyIFRoZSBudW1iZXIgd2hpY2ggdG8gY29tcGFyZSB3aXRoLlxyXG4gICAgICogQHBhcmFtIG51bWJlcnMgVGhlIGFycmF5IG9mIG51bWJlcnMgdG8gY29tcGFyZSB3aXRoLlxyXG4gICAgICovXHJcbiAgICBOdW1iZXJzSGVscGVyLmluID0gZnVuY3Rpb24gKG51bSwgbnVtYmVycykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobnVtYmVyc1tpXSA9PSBudW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU2FmZWx5IHJvdW5kIG51bWJlcnMgaW4gSlMgd2l0aG91dCBoaXR0aW5nIGltcHJlY2lzaW9ucyBvZiBmbG9hdGluZy1wb2ludCBhcml0aG1ldGljc1xyXG4gICAgICogS2luZGx5IGJvcnJvd2VkIGZyb20gQW5ndWxhckpTOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvZzNfdjFfMy9zcmMvbmcvZmlsdGVyL2ZpbHRlcnMuanMjTDE3M1xyXG4gICAgICogQHBhcmFtIHByZWNpc2lvbiBIb3cgbWFueSBkZWNpbWFscyB0aGUgbnVtYmVyIHNob3VsZCBoYXZlLlxyXG4gICAgICovXHJcbiAgICBOdW1iZXJzSGVscGVyLnByb3RvdHlwZS50b0ZpeGVkID0gZnVuY3Rpb24gKHByZWNpc2lvbikge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXJzSGVscGVyLnRvRml4ZWQodGhpcy5udW0sIHByZWNpc2lvbik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTYWZlbHkgcm91bmQgbnVtYmVycyBpbiBKUyB3aXRob3V0IGhpdHRpbmcgaW1wcmVjaXNpb25zIG9mIGZsb2F0aW5nLXBvaW50IGFyaXRobWV0aWNzXHJcbiAgICAgKiBLaW5kbHkgYm9ycm93ZWQgZnJvbSBBbmd1bGFySlM6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvYmxvYi9nM192MV8zL3NyYy9uZy9maWx0ZXIvZmlsdGVycy5qcyNMMTczXHJcbiAgICAgKiBAcGFyYW0gcHJlY2lzaW9uIEhvdyBtYW55IGRlY2ltYWxzIHRoZSBudW1iZXIgc2hvdWxkIGhhdmUuXHJcbiAgICAgKi9cclxuICAgIE51bWJlcnNIZWxwZXIudG9GaXhlZCA9IGZ1bmN0aW9uIChudW0sIHByZWNpc2lvbikge1xyXG4gICAgICAgIHJldHVybiArKE1hdGgucm91bmQoKyhudW0udG9TdHJpbmcoKSArIFwiZVwiICsgcHJlY2lzaW9uKSkudG9TdHJpbmcoKSArIFwiZVwiICsgLXByZWNpc2lvbik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE51bWJlcnNIZWxwZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuTnVtYmVyc0hlbHBlciA9IE51bWJlcnNIZWxwZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW51bWJlcnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIFNob3J0aGFuZCBmdW5jdGlvbiB0byBjcmVhdGUgYSBTdHJpbmdzSGVscGVyIG9iamVjdC5cclxuICogQHBhcmFtIG51bWJlciBUaGUgc3RyaW5nIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gKi9cclxuZnVuY3Rpb24gU3RyaW5ncyhzdHIpIHsgcmV0dXJuIG5ldyBTdHJpbmdzSGVscGVyKHN0cik7IH1cclxuZXhwb3J0cy5kZWZhdWx0ID0gU3RyaW5ncztcclxudmFyIFN0cmluZ3NIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgU3RyaW5nc0hlbHBlciBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gc3RyIFRoZSBzdHJpbmcgb24gd2hpY2ggdG8gcGVyZm9ybSB0aGUgdmFyaW91cyBmdW5jdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFN0cmluZ3NIZWxwZXIoc3RyKSB7XHJcbiAgICAgICAgdGhpcy5zdHIgPSBzdHI7XHJcbiAgICB9XHJcbiAgICBTdHJpbmdzSGVscGVyLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBTdHJpbmdzSGVscGVyLmZvcm1hdC5hcHBseSh1bmRlZmluZWQsIFt0aGlzLnN0cl0uY29uY2F0KGFyZ3MpKTtcclxuICAgIH07XHJcbiAgICBTdHJpbmdzSGVscGVyLmZvcm1hdCA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiXFxcXHtcIiArIGkgKyBcIlxcXFx9XCIsIFwiZ1wiKTtcclxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocmVnZXgsIGFyZ3NbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTdHJpbmdzSGVscGVyO1xyXG59KCkpO1xyXG5leHBvcnRzLlN0cmluZ3NIZWxwZXIgPSBTdHJpbmdzSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdHJpbmdzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8vIGltcG9ydCBcIi4uL2xpbnEvYWRkL3ppcFwiO1xyXG4vKipcclxuICogU2hvcnRoYW5kIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIFVybEhlbHBlciBvYmplY3QuXHJcbiAqIEBwYXJhbSB1cmwgVGhlIFVSTCBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICovXHJcbmZ1bmN0aW9uIFVybCh1cmwpIHtcclxuICAgIGlmICh1cmwgPT09IHZvaWQgMCkgeyB1cmwgPSBsb2NhdGlvbi5ocmVmOyB9XHJcbiAgICByZXR1cm4gbmV3IFVybEhlbHBlcih1cmwpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFVybDtcclxudmFyIFVybEhlbHBlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBVcmxIZWxwZXIgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHVybCBUaGUgVVJMIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBVcmxIZWxwZXIodXJsKSB7XHJcbiAgICAgICAgaWYgKHVybCA9PT0gdm9pZCAwKSB7IHVybCA9IGxvY2F0aW9uLmhyZWY7IH1cclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiBhIHF1ZXJ5IGluIHRoZSBVUkwuXHJcbiAgICAgKiBAcGFyYW0gcGFyYW0gVGhlIG5hbWUgb2YgdGhlIHF1ZXJ5IHRvIGdldC5cclxuICAgICAqL1xyXG4gICAgVXJsSGVscGVyLnByb3RvdHlwZS5zZWFyY2ggPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICByZXR1cm4gVXJsSGVscGVyLnNlYXJjaChwYXJhbSwgdGhpcy51cmwpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiBhIHF1ZXJ5IGluIHRoZSBVUkwuXHJcbiAgICAgKiBAcGFyYW0gdXJsIFRoZSBVUkwgZnJvbSB3aGljaCB0byBnZXQgdGhlIHF1ZXJ5LlxyXG4gICAgICogQHBhcmFtIHBhcmFtIFRoZSBuYW1lIG9mIHRoZSBxdWVyeSB0byBnZXQuXHJcbiAgICAgKi9cclxuICAgIFVybEhlbHBlci5zZWFyY2ggPSBmdW5jdGlvbiAocGFyYW0sIHVybCkge1xyXG4gICAgICAgIGlmICh1cmwgPT09IHZvaWQgMCkgeyB1cmwgPSBsb2NhdGlvbi5ocmVmOyB9XHJcbiAgICAgICAgcGFyYW0gPSBwYXJhbS5yZXBsYWNlKC9bXFxbXS8sIFwiXFxcXFtcIikucmVwbGFjZSgvW1xcXV0vLCBcIlxcXFxdXCIpO1xyXG4gICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbXFxcXD8mXVwiICsgcGFyYW0gKyBcIj0oW14mI10qKVwiLCBcImlcIiksIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCB8fCBsb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgICAgIHJldHVybiAhcmVzdWx0cyA/IFwiXCIgOiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVXJsSGVscGVyO1xyXG59KCkpO1xyXG5leHBvcnRzLlVybEhlbHBlciA9IFVybEhlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXJsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIGFsbF8xID0gcmVxdWlyZShcIi4uL29wZXJhdG9yL2FsbFwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLmFsbCA9IGFsbF8xLmFsbFByb3RvO1xyXG5saW5xXzEuTGlucS5hbGwgPSBhbGxfMS5hbGxTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFsbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBhbnlfMSA9IHJlcXVpcmUoXCIuLi9vcGVyYXRvci9hbnlcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5hbnkgPSBhbnlfMS5hbnlQcm90bztcclxubGlucV8xLkxpbnEuYW55ID0gYW55XzEuYW55U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgYXZlcmFnZV8xID0gcmVxdWlyZShcIi4uL29wZXJhdG9yL2F2ZXJhZ2VcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5hdmVyYWdlID0gYXZlcmFnZV8xLmF2ZXJhZ2VQcm90bztcclxubGlucV8xLkxpbnEuYXZlcmFnZSA9IGF2ZXJhZ2VfMS5hdmVyYWdlU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdmVyYWdlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIGRpc3RpbmN0XzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3IvZGlzdGluY3RcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5kaXN0aW5jdCA9IGRpc3RpbmN0XzEuZGlzdGluY3RQcm90bztcclxubGlucV8xLkxpbnEuZGlzdGluY3QgPSBkaXN0aW5jdF8xLmRpc3RpbmN0U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaXN0aW5jdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBleGNlcHRfMSA9IHJlcXVpcmUoXCIuLi9pdGVyYXRvci9leGNlcHRcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5leGNlcHQgPSBleGNlcHRfMS5leGNlcHRQcm90bztcclxubGlucV8xLkxpbnEuZXhjZXB0ID0gZXhjZXB0XzEuZXhjZXB0U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1leGNlcHQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgZmlsdGVyXzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3IvZmlsdGVyXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuZmlsdGVyID0gZmlsdGVyXzEuZmlsdGVyUHJvdG87XHJcbmxpbnFfMS5MaW5xLmZpbHRlciA9IGZpbHRlcl8xLmZpbHRlclN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIGZpcnN0XzEgPSByZXF1aXJlKFwiLi4vb3BlcmF0b3IvZmlyc3RcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5maXJzdCA9IGZpcnN0XzEuZmlyc3RQcm90bztcclxubGlucV8xLkxpbnEuZmlyc3QgPSBmaXJzdF8xLmZpcnN0U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1maXJzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBncm91cEJ5XzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3IvZ3JvdXBCeVwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLmdyb3VwQnkgPSBncm91cEJ5XzEuZ3JvdXBCeVByb3RvO1xyXG5saW5xXzEuTGlucS5ncm91cEJ5ID0gZ3JvdXBCeV8xLmdyb3VwQnlTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdyb3VwQnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgaW50ZXJzZWN0XzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3IvaW50ZXJzZWN0XCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuaW50ZXJzZWN0ID0gaW50ZXJzZWN0XzEuaW50ZXJzZWN0UHJvdG87XHJcbmxpbnFfMS5MaW5xLmludGVyc2VjdCA9IGludGVyc2VjdF8xLmludGVyc2VjdFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW50ZXJzZWN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIGpvaW5fMSA9IHJlcXVpcmUoXCIuLi9pdGVyYXRvci9qb2luXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuam9pbiA9IGpvaW5fMS5qb2luUHJvdG87XHJcbmxpbnFfMS5MaW5xLmpvaW4gPSBqb2luXzEuam9pblN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9am9pbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBsYXN0XzEgPSByZXF1aXJlKFwiLi4vb3BlcmF0b3IvbGFzdFwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLmxhc3QgPSBsYXN0XzEubGFzdFByb3RvO1xyXG5saW5xXzEuTGlucS5sYXN0ID0gbGFzdF8xLmxhc3RTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxhc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgbWFwXzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3IvbWFwXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUubWFwID0gbWFwXzEubWFwUHJvdG87XHJcbmxpbnFfMS5MaW5xLm1hcCA9IG1hcF8xLm1hcFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIG1heF8xID0gcmVxdWlyZShcIi4uL29wZXJhdG9yL21heFwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLm1heCA9IG1heF8xLm1heFByb3RvO1xyXG5saW5xXzEuTGlucS5tYXggPSBtYXhfMS5tYXhTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1heC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBtaW5fMSA9IHJlcXVpcmUoXCIuLi9vcGVyYXRvci9taW5cIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5taW4gPSBtaW5fMS5taW5Qcm90bztcclxubGlucV8xLkxpbnEubWluID0gbWluXzEubWluU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1taW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgb3JkZXJCeV8xID0gcmVxdWlyZShcIi4uL2l0ZXJhdG9yL29yZGVyQnlcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5vcmRlckJ5ID0gb3JkZXJCeV8xLm9yZGVyQnlQcm90bztcclxubGlucV8xLkxpbnEucHJvdG90eXBlLm9yZGVyQnlEZXNjID0gb3JkZXJCeV8xLm9yZGVyQnlEZXNjUHJvdG87XHJcbmxpbnFfMS5MaW5xLm9yZGVyQnkgPSBvcmRlckJ5XzEub3JkZXJCeVN0YXRpYztcclxubGlucV8xLkxpbnEub3JkZXJCeURlc2MgPSBvcmRlckJ5XzEub3JkZXJCeURlc2NTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9yZGVyQnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgc2luZ2xlXzEgPSByZXF1aXJlKFwiLi4vb3BlcmF0b3Ivc2luZ2xlXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuc2luZ2xlID0gc2luZ2xlXzEuc2luZ2xlUHJvdG87XHJcbmxpbnFfMS5MaW5xLnNpbmdsZSA9IHNpbmdsZV8xLnNpbmdsZVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2luZ2xlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIHNraXBfMSA9IHJlcXVpcmUoXCIuLi9pdGVyYXRvci9za2lwXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuc2tpcCA9IHNraXBfMS5za2lwUHJvdG87XHJcbmxpbnFfMS5MaW5xLnNraXAgPSBza2lwXzEuc2tpcFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBza2lwV2hpbGVfMSA9IHJlcXVpcmUoXCIuLi9pdGVyYXRvci9za2lwV2hpbGVcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5za2lwV2hpbGUgPSBza2lwV2hpbGVfMS5za2lwV2hpbGVQcm90bztcclxubGlucV8xLkxpbnEuc2tpcFdoaWxlID0gc2tpcFdoaWxlXzEuc2tpcFdoaWxlU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwV2hpbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgc3VtXzEgPSByZXF1aXJlKFwiLi4vb3BlcmF0b3Ivc3VtXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuc3VtID0gc3VtXzEuc3VtUHJvdG87XHJcbmxpbnFfMS5MaW5xLnN1bSA9IHN1bV8xLnN1bVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3VtLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIHRha2VfMSA9IHJlcXVpcmUoXCIuLi9pdGVyYXRvci90YWtlXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUudGFrZSA9IHRha2VfMS50YWtlUHJvdG87XHJcbmxpbnFfMS5MaW5xLnRha2UgPSB0YWtlXzEudGFrZVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciB0YWtlV2hpbGVfMSA9IHJlcXVpcmUoXCIuLi9pdGVyYXRvci90YWtlV2hpbGVcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS50YWtlV2hpbGUgPSB0YWtlV2hpbGVfMS50YWtlV2hpbGVQcm90bztcclxubGlucV8xLkxpbnEudGFrZVdoaWxlID0gdGFrZVdoaWxlXzEudGFrZVdoaWxlU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YWtlV2hpbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgemlwXzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3IvemlwXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuemlwID0gemlwXzEuemlwUHJvdG87XHJcbmxpbnFfMS5MaW5xLnppcCA9IHppcF8xLnppcFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9emlwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBEaXN0aW5jdEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhEaXN0aW5jdEl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gRGlzdGluY3RJdGVyYXRvcihzb3VyY2UsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmNvbXBhcmVyID0gY29tcGFyZXI7XHJcbiAgICAgICAgX3RoaXMuX3ByZXZpb3VzSXRlbXMgPSBbXTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBEaXN0aW5jdEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJzO1xyXG4gICAgICAgIHdoaWxlICghKHJzID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcykpLmRvbmUpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9wcmV2aW91c0l0ZW1zLnNvbWUoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIF90aGlzLmNvbXBhcmVyKHgsIHJzLnZhbHVlKTsgfSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzSXRlbXMucHVzaChycy52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcnM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgZG9uZTogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIERpc3RpbmN0SXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpKTtcclxuZXhwb3J0cy5EaXN0aW5jdEl0ZXJhdG9yID0gRGlzdGluY3RJdGVyYXRvcjtcclxuZnVuY3Rpb24gZGlzdGluY3Qoc291cmNlLCBjb21wYXJlcikge1xyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICByZXR1cm4gbmV3IERpc3RpbmN0SXRlcmF0b3Ioc291cmNlLCBjb21wYXJlcik7XHJcbn1cclxuLyoqXHJcbiAqIEdldCBhIGxpc3Qgb2YgdW5pcXVlIGl0ZW1zIHRoYXQgZXhpc3RzIG9uZSBvciBtb3JlIHRpbWVzIGluIHRoZSBkYXRhc2V0LlxyXG4gKi9cclxuZnVuY3Rpb24gZGlzdGluY3RQcm90byhjb21wYXJlcikge1xyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KGRpc3RpbmN0LCBjb21wYXJlcik7XHJcbn1cclxuZXhwb3J0cy5kaXN0aW5jdFByb3RvID0gZGlzdGluY3RQcm90bztcclxuLyoqXHJcbiAqIEdldCBhIGxpc3Qgb2YgdW5pcXVlIGl0ZW1zIHRoYXQgZXhpc3RzIG9uZSBvciBtb3JlIHRpbWVzIGluIGFueSBvZiB0aGUgZGF0YXNldHMuXHJcbiAqIEBwYXJhbSBzb3VyY2UgVGhlIGRhdGFzZXRzIHRvIGJlIGdldCBkaXN0aW5jdCBpdGVtcyBmcm9tLlxyXG4gKi9cclxuZnVuY3Rpb24gZGlzdGluY3RTdGF0aWMoc291cmNlLCBjb21wYXJlcikge1xyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICB2YXIgYSA9IChzb3VyY2UgaW5zdGFuY2VvZiBsaW5xXzEuTGlucSkgPyBzb3VyY2UudG9BcnJheSgpIDogc291cmNlO1xyXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgYS5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgaWYgKCFyZXN1bHQuc29tZShmdW5jdGlvbiAoeSkgeyByZXR1cm4gY29tcGFyZXIoeCwgeSk7IH0pKVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh4KTtcclxuICAgICAgICAvLyBpZiAocmVzdWx0LmluZGV4T2YoeCkgPT09IC0xKSBcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIC8vIGxldCBsaXN0czogQXJyYXk8TGlucT4gPSBbXSwgcmVzdWx0ID0gW107XHJcbiAgICAvLyBkYXRhc2V0cy5mb3JFYWNoKGRhdGFzZXQgPT4ge1xyXG4gICAgLy8gICAgIGxpc3RzLnB1c2goKGRhdGFzZXQgaW5zdGFuY2VvZiBMaW5xKSA/IGRhdGFzZXQgOiBuZXcgTGlucShVdGlsLmNhc3Q8YW55W10+KGRhdGFzZXQpKSk7XHJcbiAgICAvLyB9KTtcclxuICAgIC8vIGxpc3RzLmZvckVhY2gobGlzdCA9PiB7XHJcbiAgICAvLyAgICAgbGlzdC50b0FycmF5KCkuZm9yRWFjaChpdGVtID0+IHtcclxuICAgIC8vICAgICAgICAgaWYgKHJlc3VsdC5pbmRleE9mKGl0ZW0pID09IC0xKVxyXG4gICAgLy8gICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyB9KTtcclxuICAgIC8vIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZXhwb3J0cy5kaXN0aW5jdFN0YXRpYyA9IGRpc3RpbmN0U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaXN0aW5jdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgRXhjZXB0SXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEV4Y2VwdEl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gRXhjZXB0SXRlcmF0b3Ioc291cmNlLCBvdGhlciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXI7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuY29tcGFyZXIgPSBjb21wYXJlcjtcclxuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBpdGVyYXRvcl8xLkJhc2VJdGVyYXRvcikge1xyXG4gICAgICAgICAgICBfdGhpcy5vdGhlciA9IG90aGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgX3RoaXMub3RoZXIgPSBuZXcgaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3Iob3RoZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBFeGNlcHRJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBycztcclxuICAgICAgICBpZiAoIXRoaXMub3RoZXJJdGVtcykge1xyXG4gICAgICAgICAgICB0aGlzLm90aGVySXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgd2hpbGUgKCEocnMgPSB0aGlzLm90aGVyLm5leHQoKSkuZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdGhlckl0ZW1zLnB1c2gocnMudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlICghKHJzID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcykpLmRvbmUpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm90aGVySXRlbXMuc29tZShmdW5jdGlvbiAoeCkgeyByZXR1cm4gX3RoaXMuY29tcGFyZXIocnMudmFsdWUsIHgpOyB9KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBFeGNlcHRJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLkJhc2VJdGVyYXRvcikpO1xyXG5leHBvcnRzLkV4Y2VwdEl0ZXJhdG9yID0gRXhjZXB0SXRlcmF0b3I7XHJcbmZ1bmN0aW9uIGV4Y2VwdChzb3VyY2UsIG90aGVyLCBjb21wYXJlcikge1xyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICByZXR1cm4gbmV3IEV4Y2VwdEl0ZXJhdG9yKHNvdXJjZSwgb3RoZXIsIGNvbXBhcmVyKTtcclxufVxyXG4vKipcclxuICogR2V0IGEgbGlzdCBvZiBpdGVtcyB0aGF0IG9ubHkgZXhpc3RzIGluIG9uZSBvZiB0aGUgZGF0YXNldHMuXHJcbiAqIEBwYXJhbSBvdGhlciBUaGUgb3RoZXIgZGF0YXNldC5cclxuICovXHJcbmZ1bmN0aW9uIGV4Y2VwdFByb3RvKG90aGVyLCBjb21wYXJlcikge1xyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KGV4Y2VwdCwgb3RoZXIsIGNvbXBhcmVyKTtcclxufVxyXG5leHBvcnRzLmV4Y2VwdFByb3RvID0gZXhjZXB0UHJvdG87XHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIGl0ZW1zIHRoYXQgb25seSBleGlzdHMgaW4gb25lIG9mIHRoZSBkYXRhc2V0cy5cclxuICogQHBhcmFtIGEgVGhlIGZpcnN0IGRhdGFzZXQuXHJcbiAqIEBwYXJhbSBiIFRoZSBzZWNvbmQgZGF0YXNldC5cclxuICovXHJcbmZ1bmN0aW9uIGV4Y2VwdFN0YXRpYyhzb3VyY2UsIG90aGVyLCBjb21wYXJlcikge1xyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICB2YXIgYSA9IChzb3VyY2UgaW5zdGFuY2VvZiBsaW5xXzEuTGlucSkgPyBzb3VyY2UudG9BcnJheSgpIDogc291cmNlLCBiID0gKG90aGVyIGluc3RhbmNlb2YgbGlucV8xLkxpbnEpID8gb3RoZXIudG9BcnJheSgpIDogb3RoZXI7XHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICBhLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICBpZiAoIWIuc29tZShmdW5jdGlvbiAoeSkgeyByZXR1cm4gY29tcGFyZXIoeCwgeSk7IH0pKVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh4KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIC8vIGxpc3RzLnB1c2goKGEgaW5zdGFuY2VvZiBMaW5xKSA/IGEudG9BcnJheSgpIDogYSk7XHJcbiAgICAvLyBsaXN0cy5wdXNoKChiIGluc3RhbmNlb2YgTGlucSkgPyBiLnRvQXJyYXkoKSA6IGIpO1xyXG4gICAgLy8gbGV0IGxpc3RzOiBBcnJheTxhbnlbXT4gPSBbXSwgcmVzdWx0ID0gW107XHJcbiAgICAvLyBsaXN0cy5wdXNoKChhIGluc3RhbmNlb2YgTGlucSkgPyBhLnRvQXJyYXkoKSA6IGEpO1xyXG4gICAgLy8gbGlzdHMucHVzaCgoYiBpbnN0YW5jZW9mIExpbnEpID8gYi50b0FycmF5KCkgOiBiKTtcclxuICAgIC8vIG1vcmUuZm9yRWFjaChkYXRhc2V0ID0+IHtcclxuICAgIC8vICAgICBsaXN0cy5wdXNoKChkYXRhc2V0IGluc3RhbmNlb2YgTGlucSkgPyBkYXRhc2V0LnRvQXJyYXkoKSA6IGRhdGFzZXQpO1xyXG4gICAgLy8gfSk7XHJcbiAgICAvLyBsaXN0cy5mb3JFYWNoKGxpc3QgPT4ge1xyXG4gICAgLy8gICAgIGxpc3QuZm9yRWFjaChpdGVtID0+IHtcclxuICAgIC8vICAgICAgICAgbGV0IGV4aXN0cyA9IGxpc3RzLnNvbWUob3RoZXIgPT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKGxpc3QgPT09IG90aGVyKSByZXR1cm47XHJcbiAgICAvLyAgICAgICAgICAgICBpZiAob3RoZXIuc29tZSh4ID0+ICB4ID09PSBpdGVtKSkgcmV0dXJuIHRydWU7XHJcbiAgICAvLyAgICAgICAgIH0pO1xyXG4gICAgLy8gICAgICAgICBpZiAoIWV4aXN0cykgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyB9KTtcclxuICAgIC8vIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZXhwb3J0cy5leGNlcHRTdGF0aWMgPSBleGNlcHRTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4Y2VwdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxudmFyIEZpbHRlckl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhGaWx0ZXJJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEZpbHRlckl0ZXJhdG9yKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoY2FsbGJhY2sgPT09IHZvaWQgMCkgeyBjYWxsYmFjayA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEZpbHRlckl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIHdoaWxlICghKGl0ZW0gPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKSkuZG9uZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFjayhpdGVtLnZhbHVlLCB0aGlzLl9pZHgpKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBGaWx0ZXJJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLkJhc2VJdGVyYXRvcikpO1xyXG5leHBvcnRzLkZpbHRlckl0ZXJhdG9yID0gRmlsdGVySXRlcmF0b3I7XHJcbmZ1bmN0aW9uIGZpbHRlcihzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJJdGVyYXRvcihzb3VyY2UsIHByZWRpY2F0ZSk7XHJcbn1cclxuLyoqXHJcbiAqIEZpbHRlcnMgYSBzZXF1ZW5jZSBvZiB2YWx1ZXMgYmFzZWQgb24gYSBwcmVkaWNhdGUuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBmaWx0ZXJQcm90byhwcmVkaWNhdGUpIHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQoZmlsdGVyLCBwcmVkaWNhdGUpO1xyXG59XHJcbmV4cG9ydHMuZmlsdGVyUHJvdG8gPSBmaWx0ZXJQcm90bztcclxuLyoqXHJcbiAqIEZpbHRlcnMgYSBzZXF1ZW5jZSBvZiB2YWx1ZXMgYmFzZWQgb24gYSBwcmVkaWNhdGUuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBmaWx0ZXJTdGF0aWMoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgIHJldHVybiBzb3VyY2UuZmlsdGVyKHByZWRpY2F0ZSk7XHJcbn1cclxuZXhwb3J0cy5maWx0ZXJTdGF0aWMgPSBmaWx0ZXJTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIGZpbHRlcl8xID0gcmVxdWlyZShcIi4vZmlsdGVyXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnJlcXVpcmUoXCIuLi9hZGQvZmlyc3RcIik7XHJcbnZhciBtYWtlVmFsdWVQcmVkaWNhdGVfMSA9IHJlcXVpcmUoXCIuLi9tYWtlVmFsdWVQcmVkaWNhdGVcIik7XHJcbnZhciBHcm91cEJ5SXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEdyb3VwQnlJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEdyb3VwQnlJdGVyYXRvcihzb3VyY2UsIGtleVNlbGVjdG9yKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmtleVNlbGVjdG9yID0ga2V5U2VsZWN0b3I7XHJcbiAgICAgICAgX3RoaXMuX3ByZXZpb3VzS2V5cyA9IFtdO1xyXG4gICAgICAgIF90aGlzLl9pc1BpcGVsaW5lRXhlY3V0ZWQgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBHcm91cEJ5SXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gVE9ETzogQ3VycmVudGx5IHRoaXMgd2lsbCB1c2UgRmlsdGVySXRlcmF0b3Igb24gdGhlIHdob2xlIHNvdXJjZSBvbmNlIHBlciBrZXkuIENhbiB3ZSBpbXByb3ZlIHRoaXM/XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAvKiBUT0RPOiBCZWNhdXNlIHdlIHNlbmQgaW4gdGhpcy5fc291cmNlIGludG8gdGhlIEZpbHRlckl0ZXJhdG9yLCBpZiB0aGlzLl9zb3VyY2UgaXMgYW4gaXRlcmF0b3IsIHdlIGZpbmlzaCBpdCxcclxuICAgICAgICAgKiBtYWtpbmcgaXQgbm90IGxvb2sgZm9yIHRoZSBuZXh0IGtleSBvbiB0aGUgc2Vjb25kIGNhbGwgdG8gdGhpcyBmdW5jdGlvbi5cclxuICAgICAgICAgKiBXZSBwcm9iYWJseSBuZWVkIHRvIGNyZWF0ZSBhIGxvb2t1cCB0YWJsZSBvZiBzb21lIHNvcnQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc1BpcGVsaW5lRXhlY3V0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlID0gdGhpcy50b0FycmF5KCk7XHJcbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUucmVzZXQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5faXNQaXBlbGluZUV4ZWN1dGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGl0ZW0sIGtleTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uZG9uZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChpdGVtLnZhbHVlKSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBrZXkgPSB0aGlzLmtleVNlbGVjdG9yKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgIH0gd2hpbGUgKHRoaXMuX3ByZXZpb3VzS2V5cy5pbmRleE9mKGtleSkgPiAtMSB8fCBVdGlsLmlzVW5kZWZpbmVkKGl0ZW0udmFsdWUpKTtcclxuICAgICAgICB0aGlzLl9wcmV2aW91c0tleXMucHVzaChrZXkpO1xyXG4gICAgICAgIHZhciBmaWx0ZXIgPSBuZXcgZmlsdGVyXzEuRmlsdGVySXRlcmF0b3IodGhpcy5fc291cmNlLCBmdW5jdGlvbiAoeCwgaWR4KSB7IHJldHVybiBfdGhpcy5rZXlTZWxlY3Rvcih4KSA9PT0ga2V5OyB9KTtcclxuICAgICAgICB2YXIgZ3JvdXBJdGVtLCB2YWx1ZXMgPSBbXTtcclxuICAgICAgICB3aGlsZSAoIVV0aWwuaXNVbmRlZmluZWQoZ3JvdXBJdGVtID0gZmlsdGVyLm5leHQoKS52YWx1ZSkpIHtcclxuICAgICAgICAgICAgdmFsdWVzLnB1c2goZ3JvdXBJdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgICAgICAgIGtleToga2V5LFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiB2YWx1ZXNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZG9uZTogaXRlbS5kb25lXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICBHcm91cEJ5SXRlcmF0b3IucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG4sIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHdoaWxlICghKG4gPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKSkuZG9uZSlcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gobi52YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gR3JvdXBCeUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKSk7XHJcbmV4cG9ydHMuR3JvdXBCeUl0ZXJhdG9yID0gR3JvdXBCeUl0ZXJhdG9yO1xyXG5mdW5jdGlvbiBncm91cEJ5KHNvdXJjZSwga2V5U2VsZWN0b3IpIHtcclxuICAgIHZhciBwcmVkID0gbWFrZVZhbHVlUHJlZGljYXRlXzEubWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKTtcclxuICAgIHJldHVybiBuZXcgR3JvdXBCeUl0ZXJhdG9yKHNvdXJjZSwgcHJlZCk7XHJcbn1cclxuLyoqXHJcbiAqIEdyb3VwcyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBhY2NvcmRpbmcgdG8gYSBzcGVjaWZpZWQga2V5IHNlbGVjdG9yIGZ1bmN0aW9uLlxyXG4gKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IHRoZSBrZXkgZm9yIGVhY2ggZWxlbWVudC5cclxuICovXHJcbmZ1bmN0aW9uIGdyb3VwQnlQcm90byhrZXlTZWxlY3Rvcikge1xyXG4gICAgdmFyIHByZWQgPSBtYWtlVmFsdWVQcmVkaWNhdGVfMS5tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpO1xyXG4gICAgcmV0dXJuIHRoaXMubGlmdChncm91cEJ5LCBwcmVkKTtcclxufVxyXG5leHBvcnRzLmdyb3VwQnlQcm90byA9IGdyb3VwQnlQcm90bztcclxuLyoqXHJcbiAqIEdyb3VwcyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBhY2NvcmRpbmcgdG8gYSBzcGVjaWZpZWQga2V5IHNlbGVjdG9yIGZ1bmN0aW9uLlxyXG4gKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IHRoZSBrZXkgZm9yIGVhY2ggZWxlbWVudC5cclxuICovXHJcbmZ1bmN0aW9uIGdyb3VwQnlTdGF0aWMoc291cmNlLCBrZXlTZWxlY3Rvcikge1xyXG4gICAgdmFyIGksIGFyciA9IFtdLCBwcmVkID0gbWFrZVZhbHVlUHJlZGljYXRlXzEubWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKSwgZ3JvdXAsIGdyb3VwVmFsdWU7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZ3JvdXBWYWx1ZSA9IHByZWQoc291cmNlW2ldKTtcclxuICAgICAgICBncm91cCA9IG5ldyBsaW5xXzEuTGlucShhcnIpLmZpcnN0KGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LmtleSA9PSBncm91cFZhbHVlOyB9KTtcclxuICAgICAgICBpZiAoIWdyb3VwKSB7XHJcbiAgICAgICAgICAgIGdyb3VwID0ge1xyXG4gICAgICAgICAgICAgICAga2V5OiBncm91cFZhbHVlLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBbXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBhcnIucHVzaChncm91cCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdyb3VwLnZhbHVlcy5wdXNoKHNvdXJjZVtpXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXJyO1xyXG59XHJcbmV4cG9ydHMuZ3JvdXBCeVN0YXRpYyA9IGdyb3VwQnlTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdyb3VwQnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIEludGVyc2VjdEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhJbnRlcnNlY3RJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEludGVyc2VjdEl0ZXJhdG9yKHNvdXJjZSwgb3RoZXIsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmNvbXBhcmVyID0gY29tcGFyZXI7XHJcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpIHtcclxuICAgICAgICAgICAgX3RoaXMub3RoZXIgPSBvdGhlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIF90aGlzLm90aGVyID0gbmV3IGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKG90aGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgSW50ZXJzZWN0SXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgcnM7XHJcbiAgICAgICAgaWYgKCF0aGlzLm90aGVySXRlbXMpIHtcclxuICAgICAgICAgICAgdGhpcy5vdGhlckl0ZW1zID0gW107XHJcbiAgICAgICAgICAgIHdoaWxlICghKHJzID0gdGhpcy5vdGhlci5uZXh0KCkpLmRvbmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3RoZXJJdGVtcy5wdXNoKHJzLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAoIShycyA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpKS5kb25lKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm90aGVySXRlbXMuc29tZShmdW5jdGlvbiAoeCkgeyByZXR1cm4gX3RoaXMuY29tcGFyZXIocnMudmFsdWUsIHgpOyB9KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBJbnRlcnNlY3RJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLkJhc2VJdGVyYXRvcikpO1xyXG5leHBvcnRzLkludGVyc2VjdEl0ZXJhdG9yID0gSW50ZXJzZWN0SXRlcmF0b3I7XHJcbmZ1bmN0aW9uIGludGVyc2VjdChzb3VyY2UsIG90aGVyLCBjb21wYXJlcikge1xyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICByZXR1cm4gbmV3IEludGVyc2VjdEl0ZXJhdG9yKHNvdXJjZSwgb3RoZXIsIGNvbXBhcmVyKTtcclxufVxyXG4vKipcclxuICogR2V0IGEgbGlzdCBvZiBpdGVtcyB0aGF0IG9ubHkgZXhpc3RzIGluIG9uZSBvZiB0aGUgZGF0YXNldHMuXHJcbiAqIEBwYXJhbSBvdGhlciBUaGUgb3RoZXIgZGF0YXNldC5cclxuICovXHJcbmZ1bmN0aW9uIGludGVyc2VjdFByb3RvKG90aGVyLCBjb21wYXJlcikge1xyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KGludGVyc2VjdCwgb3RoZXIsIGNvbXBhcmVyKTtcclxufVxyXG5leHBvcnRzLmludGVyc2VjdFByb3RvID0gaW50ZXJzZWN0UHJvdG87XHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIGl0ZW1zIHRoYXQgZXhpc3RzIGluIGFsbCBkYXRhc2V0cy5cclxuICogQHBhcmFtIGEgVGhlIGZpcnN0IGRhdGFzZXQuXHJcbiAqIEBwYXJhbSBiIFRoZSBzZWNvbmQgZGF0YXNldCB0byBiZSBjb21wYXJlZCB0by5cclxuICogQHBhcmFtIG1vcmUgSWYgeW91IGhhdmUgZXZlbiBtb3JlIGRhdGFzZXQgdG8gY29tcGFyZSB0by5cclxuICovXHJcbmZ1bmN0aW9uIGludGVyc2VjdFN0YXRpYyhzb3VyY2UsIG90aGVyLCBjb21wYXJlcikge1xyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICB2YXIgYSA9IChzb3VyY2UgaW5zdGFuY2VvZiBsaW5xXzEuTGlucSkgPyBzb3VyY2UudG9BcnJheSgpIDogc291cmNlLCBiID0gKG90aGVyIGluc3RhbmNlb2YgbGlucV8xLkxpbnEpID8gb3RoZXIudG9BcnJheSgpIDogb3RoZXI7XHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICBhLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICBpZiAoYi5zb21lKGZ1bmN0aW9uICh5KSB7IHJldHVybiBjb21wYXJlcih4LCB5KTsgfSkpXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHgpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgLy8gbGV0IGxpc3RzOiBBcnJheTxhbnlbXT4gPSBbXSwgcmVzdWx0ID0gW107XHJcbiAgICAvLyBsZXQgbGlzdCA9IChhIGluc3RhbmNlb2YgTGlucSkgPyBhLnRvQXJyYXkoKSA6IGE7XHJcbiAgICAvLyBsaXN0cy5wdXNoKChiIGluc3RhbmNlb2YgTGlucSkgPyBiLnRvQXJyYXkoKSA6IGIpO1xyXG4gICAgLy8gbW9yZS5mb3JFYWNoKChkYXRhc2V0KSA9PiB7XHJcbiAgICAvLyAgICAgbGlzdHMucHVzaCgoZGF0YXNldCBpbnN0YW5jZW9mIExpbnEpID8gZGF0YXNldC50b0FycmF5KCkgOiBkYXRhc2V0KTtcclxuICAgIC8vIH0pO1xyXG4gICAgLy8gbGlzdC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgLy8gICAgIGxldCBleGlzdHMgPSBsaXN0cy5ldmVyeShvdGhlciA9PiB7XHJcbiAgICAvLyAgICAgICAgIGlmICghb3RoZXIuc29tZSh4ID0+IHggPT09IGl0ZW0pKSByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gICAgIGlmIChleGlzdHMpIHJlc3VsdC5wdXNoKGl0ZW0pO1xyXG4gICAgLy8gfSk7XHJcbiAgICAvLyByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmV4cG9ydHMuaW50ZXJzZWN0U3RhdGljID0gaW50ZXJzZWN0U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnRlcnNlY3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIEJhc2VJdGVyYXRvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBCYXNlSXRlcmF0b3Ioc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5faWR4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5fYnVmZmVycyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3JldmVyc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fZG9uZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgIH1cclxuICAgIEJhc2VJdGVyYXRvci5wcm90b3R5cGUuZ2V0SXRlcmF0b3JGcm9tUGlwZWxpbmUgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgdHlwZSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXM7XHJcbiAgICAgICAgd2hpbGUgKCEoKHNvdXJjZSA9IHNvdXJjZS5fc291cmNlKSBpbnN0YW5jZW9mIHR5cGUpKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzb3VyY2U7XHJcbiAgICB9O1xyXG4gICAgQmFzZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBuID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmICh0aGlzLl9zb3VyY2UgaW5zdGFuY2VvZiBCYXNlSXRlcmF0b3IpIHtcclxuICAgICAgICAgICAgdmFyIG5leHQgPSB0aGlzLl9zb3VyY2UubmV4dCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pZHgrKztcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcmV2ZXJzZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pZHggPCB0aGlzLl9zb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbiA9IHRoaXMuX3NvdXJjZVt0aGlzLl9zb3VyY2UubGVuZ3RoIC0gMSAtICgrK3RoaXMuX2lkeCldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lkeCA8IHRoaXMuX3NvdXJjZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBuID0gdGhpcy5fc291cmNlWysrdGhpcy5faWR4XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5faWR4ID49IHRoaXMuX3NvdXJjZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gdGhpcy5faWR4ID0gLTE7IC8vIHdlIGZpbmlzaGVkLCByZXNldCB0aGUgY291bnRlclxyXG4gICAgICAgICAgICB0aGlzLl9kb25lID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdmFsdWU6IG4sXHJcbiAgICAgICAgICAgIGRvbmU6IHRoaXMuX2RvbmVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIEJhc2VJdGVyYXRvci5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fcmV2ZXJzZWQgPSAhdGhpcy5fcmV2ZXJzZWQ7IH07XHJcbiAgICBCYXNlSXRlcmF0b3IucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX2lkeCA9IC0xO1xyXG4gICAgICAgIHRoaXMuX2RvbmUgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQmFzZUl0ZXJhdG9yO1xyXG59KCkpO1xyXG5leHBvcnRzLkJhc2VJdGVyYXRvciA9IEJhc2VJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXRlcmF0b3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBmaWx0ZXJfMSA9IHJlcXVpcmUoXCIuL2ZpbHRlclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgbWFrZVZhbHVlUHJlZGljYXRlXzEgPSByZXF1aXJlKFwiLi4vbWFrZVZhbHVlUHJlZGljYXRlXCIpO1xyXG52YXIgSm9pbkl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhKb2luSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBKb2luSXRlcmF0b3Iob3V0ZXIsIGlubmVyLCBvdXRlcktleVNlbGVjdG9yLCBpbm5lcktleVNlbGVjdG9yLCByZXN1bHRTZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG91dGVyKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmlubmVyID0gaW5uZXI7XHJcbiAgICAgICAgX3RoaXMub3V0ZXJLZXlTZWxlY3RvciA9IG91dGVyS2V5U2VsZWN0b3I7XHJcbiAgICAgICAgX3RoaXMuaW5uZXJLZXlTZWxlY3RvciA9IGlubmVyS2V5U2VsZWN0b3I7XHJcbiAgICAgICAgX3RoaXMucmVzdWx0U2VsZWN0b3IgPSByZXN1bHRTZWxlY3RvcjtcclxuICAgICAgICBfdGhpcy5fY291bnRlciA9IDA7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgSm9pbkl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGlubmVySXRlbTtcclxuICAgICAgICBpZiAodGhpcy5fY3VycmVudElubmVyU2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vIFdlJ3JlIGRvaW5nIHRoZSBzZWNvbmQgbG9vcCBvZiB0aGUgc2FtZSBrZXkuXHJcbiAgICAgICAgICAgIGlubmVySXRlbSA9IHRoaXMuX2N1cnJlbnRJbm5lclNlbGVjdGlvbi5uZXh0KCk7XHJcbiAgICAgICAgICAgIC8vIFdlIGtub3cgd2UgaGF2ZSByZWNlaXZlZCBhdCBsZWFzdCBvbmUgaXRlbSBmcm9tIHRoaXMga2V5IGJlZm9yZSwgc28gbm90IHJlY2VpdmluZyBvbmUgbm93IGlzIG5vdCB3cm9uZy5cclxuICAgICAgICAgICAgLy8gSXQganVzdCBtZWFucyBpdCB3YXMgb25seSBhIHNpbmdsZSBpbm5lciBpdGVtIHdpdGggdGhpcyBrZXksIHNvIHdlIGxldCBpdCBjb250aW51ZSBpZiBiZWxvdyBjb25kaXRpb24gaXMgbm90IG1ldC5cclxuICAgICAgICAgICAgaWYgKCFVdGlsLmlzVW5kZWZpbmVkKGlubmVySXRlbS52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMucmVzdWx0U2VsZWN0b3IodGhpcy5fb3V0ZXJJdGVtLnZhbHVlLCBpbm5lckl0ZW0udmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzXzEuX291dGVySXRlbSA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXNfMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzXzEuX291dGVySXRlbS5kb25lKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9IH07XHJcbiAgICAgICAgICAgIGlmICghVXRpbC5pc1VuZGVmaW5lZCh0aGlzXzEuX291dGVySXRlbS52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvdXRlcktleV8xID0gdGhpc18xLm91dGVyS2V5U2VsZWN0b3IodGhpc18xLl9vdXRlckl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpc18xLl9jdXJyZW50SW5uZXJTZWxlY3Rpb24gPSBuZXcgZmlsdGVyXzEuRmlsdGVySXRlcmF0b3IodGhpc18xLmlubmVyLCBmdW5jdGlvbiAoeCkgeyByZXR1cm4gb3V0ZXJLZXlfMSA9PT0gX3RoaXMuaW5uZXJLZXlTZWxlY3Rvcih4KTsgfSk7XHJcbiAgICAgICAgICAgICAgICBpbm5lckl0ZW0gPSB0aGlzXzEuX2N1cnJlbnRJbm5lclNlbGVjdGlvbi5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB0aGlzXzEgPSB0aGlzO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgdmFyIHN0YXRlXzEgPSBfbG9vcF8xKCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3RhdGVfMSA9PT0gXCJvYmplY3RcIilcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZV8xLnZhbHVlO1xyXG4gICAgICAgIH0gd2hpbGUgKFV0aWwuaXNVbmRlZmluZWQoaW5uZXJJdGVtLnZhbHVlKSk7XHJcbiAgICAgICAgdGhpcy5fY291bnRlcisrO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnJlc3VsdFNlbGVjdG9yKHRoaXMuX291dGVySXRlbS52YWx1ZSwgaW5uZXJJdGVtLnZhbHVlKSxcclxuICAgICAgICAgICAgZG9uZTogdGhpcy5fb3V0ZXJJdGVtLmRvbmVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBKb2luSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpKTtcclxuZXhwb3J0cy5Kb2luSXRlcmF0b3IgPSBKb2luSXRlcmF0b3I7XHJcbmZ1bmN0aW9uIGZpbHRlcihzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgcmV0dXJuIG5ldyBmaWx0ZXJfMS5GaWx0ZXJJdGVyYXRvcihzb3VyY2UsIHByZWRpY2F0ZSk7XHJcbn1cclxuLyoqXHJcbiAqIEZpbHRlcnMgYSBzZXF1ZW5jZSBvZiB2YWx1ZXMgYmFzZWQgb24gYSBwcmVkaWNhdGUuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBmaWx0ZXJQcm90byhwcmVkaWNhdGUpIHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQoZmlsdGVyLCBwcmVkaWNhdGUpO1xyXG59XHJcbmV4cG9ydHMuZmlsdGVyUHJvdG8gPSBmaWx0ZXJQcm90bztcclxuLyoqXHJcbiAqIEZpbHRlcnMgYSBzZXF1ZW5jZSBvZiB2YWx1ZXMgYmFzZWQgb24gYSBwcmVkaWNhdGUuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBmaWx0ZXJTdGF0aWMoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgIHJldHVybiBzb3VyY2UuZmlsdGVyKHByZWRpY2F0ZSk7XHJcbn1cclxuZXhwb3J0cy5maWx0ZXJTdGF0aWMgPSBmaWx0ZXJTdGF0aWM7XHJcbmZ1bmN0aW9uIGpvaW4ob3V0ZXIsIGlubmVyLCBvdXRlcktleVNlbGVjdG9yLCBpbm5lcktleVNlbGVjdG9yLCByZXN1bHRTZWxlY3Rvcikge1xyXG4gICAgcmV0dXJuIG5ldyBKb2luSXRlcmF0b3Iob3V0ZXIsIGlubmVyLCBvdXRlcktleVNlbGVjdG9yLCBpbm5lcktleVNlbGVjdG9yLCByZXN1bHRTZWxlY3Rvcik7XHJcbn1cclxuLyoqXHJcbiAqIENvcnJlbGF0ZXMgdGhlIGVsZW1lbnRzIG9mIHR3byBzZXF1ZW5jZXMgYmFzZWQgb24gbWF0Y2hpbmcga2V5cy5cclxuICogQHBhcmFtIGlubmVyIFRoZSBzZXF1ZW5jZSB0byBqb2luIHRvIHRoZSBmaXJzdCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIG91dGVyS2V5U2VsZWN0b3IgVEEgZnVuY3Rpb24gdG8gZXh0cmFjdCB0aGUgam9pbiBrZXkgZnJvbSBlYWNoIGVsZW1lbnQgb2YgdGhlIGZpcnN0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gaW5uZXJLZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgdGhlIGpvaW4ga2V5IGZyb20gZWFjaCBlbGVtZW50IG9mIHRoZSBzZWNvbmQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSByZXN1bHRTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIHJlc3VsdCBlbGVtZW50IGZyb20gdHdvIG1hdGNoaW5nIGVsZW1lbnRzLlxyXG4gKi9cclxuZnVuY3Rpb24gam9pblByb3RvKGlubmVyLCBvdXRlcktleVNlbGVjdG9yLCBpbm5lcktleVNlbGVjdG9yLCByZXN1bHRTZWxlY3Rvcikge1xyXG4gICAgdmFyIG91dGVyUHJlZCA9IG1ha2VWYWx1ZVByZWRpY2F0ZV8xLm1ha2VWYWx1ZVByZWRpY2F0ZShvdXRlcktleVNlbGVjdG9yKSwgaW5uZXJQcmVkID0gbWFrZVZhbHVlUHJlZGljYXRlXzEubWFrZVZhbHVlUHJlZGljYXRlKGlubmVyS2V5U2VsZWN0b3IpO1xyXG4gICAgcmV0dXJuIHRoaXMubGlmdChqb2luLCBpbm5lciwgb3V0ZXJQcmVkLCBpbm5lclByZWQsIHJlc3VsdFNlbGVjdG9yKTtcclxufVxyXG5leHBvcnRzLmpvaW5Qcm90byA9IGpvaW5Qcm90bztcclxuLyoqXHJcbiAqIENvcnJlbGF0ZXMgdGhlIGVsZW1lbnRzIG9mIHR3byBzZXF1ZW5jZXMgYmFzZWQgb24gbWF0Y2hpbmcga2V5cy5cclxuICogQHBhcmFtIG91dGVyIFRoZSBmaXJzdCBzZXF1ZW5jZSB0byBqb2luLlxyXG4gKiBAcGFyYW0gaW5uZXIgVGhlIHNlcXVlbmNlIHRvIGpvaW4gdG8gdGhlIGZpcnN0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gb3V0ZXJLZXlTZWxlY3RvciBUQSBmdW5jdGlvbiB0byBleHRyYWN0IHRoZSBqb2luIGtleSBmcm9tIGVhY2ggZWxlbWVudCBvZiB0aGUgZmlyc3Qgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBpbm5lcktleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCB0aGUgam9pbiBrZXkgZnJvbSBlYWNoIGVsZW1lbnQgb2YgdGhlIHNlY29uZCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIHJlc3VsdFNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gY3JlYXRlIGEgcmVzdWx0IGVsZW1lbnQgZnJvbSB0d28gbWF0Y2hpbmcgZWxlbWVudHMuXHJcbiAqL1xyXG5mdW5jdGlvbiBqb2luU3RhdGljKG91dGVyLCBpbm5lciwgb3V0ZXJLZXlTZWxlY3RvciwgaW5uZXJLZXlTZWxlY3RvciwgcmVzdWx0U2VsZWN0b3IpIHtcclxuICAgIC8vIFRPRE86IFdyaXRlIHN0YXRpYyBqb2luIGZ1bmN0aW9uIHdpdGhvdXQgaW5zdGFudGlhdGluZyBhIG5ldyBMaW5xIG9iamVjdFxyXG4gICAgcmV0dXJuIG5ldyBsaW5xXzEuTGlucShvdXRlcikuam9pbihpbm5lciwgb3V0ZXJLZXlTZWxlY3RvciwgaW5uZXJLZXlTZWxlY3RvciwgcmVzdWx0U2VsZWN0b3IpLnRvQXJyYXkoKTtcclxufVxyXG5leHBvcnRzLmpvaW5TdGF0aWMgPSBqb2luU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1qb2luLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgTWFwSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKE1hcEl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gTWFwSXRlcmF0b3Ioc291cmNlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIE1hcEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgcmV0dXJuICghVXRpbC5pc1VuZGVmaW5lZChpdGVtLnZhbHVlKSlcclxuICAgICAgICAgICAgPyB7IHZhbHVlOiB0aGlzLmNhbGxiYWNrKGl0ZW0udmFsdWUsIHRoaXMuX2lkeCksIGRvbmU6IGZhbHNlIH1cclxuICAgICAgICAgICAgOiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTWFwSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpKTtcclxuZXhwb3J0cy5NYXBJdGVyYXRvciA9IE1hcEl0ZXJhdG9yO1xyXG5mdW5jdGlvbiBtYXAoc291cmNlLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcihzb3VyY2UsIGNhbGxiYWNrKTtcclxufVxyXG4vKipcclxuICogQ3JlYXRlcyBhIG5ldyBzZXF1ZW5jZSB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeSBlbGVtZW50IGluIHRoaXMgYXJyYXkuXHJcbiAqIEBwYXJhbSBjYWxsYmFjayBGdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGFuIGVsZW1lbnQgb2YgdGhlIG5ldyBzZXF1ZW5jZVxyXG4gKi9cclxuZnVuY3Rpb24gbWFwUHJvdG8oY2FsbGJhY2spIHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQobWFwLCBjYWxsYmFjayk7XHJcbn1cclxuZXhwb3J0cy5tYXBQcm90byA9IG1hcFByb3RvO1xyXG4vKipcclxuICogQ3JlYXRlcyBhIG5ldyBzZXF1ZW5jZSB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeSBlbGVtZW50IGluIHRoaXMgYXJyYXkuXHJcbiAqIEBwYXJhbSBjYWxsYmFjayBGdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGFuIGVsZW1lbnQgb2YgdGhlIG5ldyBzZXF1ZW5jZVxyXG4gKi9cclxuZnVuY3Rpb24gbWFwU3RhdGljKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiBzb3VyY2UubWFwKGNhbGxiYWNrKTtcclxufVxyXG5leHBvcnRzLm1hcFN0YXRpYyA9IG1hcFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBtYWtlVmFsdWVQcmVkaWNhdGVfMSA9IHJlcXVpcmUoXCIuLi9tYWtlVmFsdWVQcmVkaWNhdGVcIik7XHJcbnZhciBPcmRlckJ5SXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKE9yZGVyQnlJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIE9yZGVyQnlJdGVyYXRvcihzb3VyY2UsIGtleVNlbGVjdG9yLCBjb21wYXJlciwgZGVzY2VuZGluZykge1xyXG4gICAgICAgIGlmIChrZXlTZWxlY3RvciA9PT0gdm9pZCAwKSB7IGtleVNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgaWYgKGRlc2NlbmRpbmcgPT09IHZvaWQgMCkgeyBkZXNjZW5kaW5nID0gZmFsc2U7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuZGVzY2VuZGluZyA9IGRlc2NlbmRpbmc7XHJcbiAgICAgICAgX3RoaXMuX2lzT3JkZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgIF90aGlzLl9vcmRlcnMgPSBbbmV3IExpbnFPcmRlcihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpXTtcclxuICAgICAgICBfdGhpcy5fYnVmZmVycyA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgT3JkZXJCeUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc09yZGVyZWQpIHtcclxuICAgICAgICAgICAgdmFyIGFyciA9IFtdLCBpdGVtID0gdm9pZCAwO1xyXG4gICAgICAgICAgICAvLyBjYW4ndCBzb21lb25lIGVsc2UgZG8gdGhpcz8gZS5nLiBGaWx0ZXJJdGVyYXRvcj9cclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0udmFsdWUpKVxyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICB9IHdoaWxlICghaXRlbS5kb25lKTtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlID0gYXJyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpID0gMCwgcnM7XHJcbiAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgcnMgPSBfdGhpcy5fb3JkZXJzW2krK10uY29tcGFyZShhLCBiKTtcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHJzID09PSAwICYmIGkgPCBfdGhpcy5fb3JkZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcnM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9pc09yZGVyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLnJlc2V0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxuICAgIH07XHJcbiAgICBPcmRlckJ5SXRlcmF0b3IucHJvdG90eXBlLnRoZW5CeSA9IGZ1bmN0aW9uIChrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpIHtcclxuICAgICAgICBpZiAoa2V5U2VsZWN0b3IgPT09IHZvaWQgMCkgeyBrZXlTZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIGlmIChkZXNjZW5kaW5nID09PSB2b2lkIDApIHsgZGVzY2VuZGluZyA9IGZhbHNlOyB9XHJcbiAgICAgICAgdGhpcy5fb3JkZXJzLnB1c2gobmV3IExpbnFPcmRlcihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gT3JkZXJCeUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKSk7XHJcbmV4cG9ydHMuT3JkZXJCeUl0ZXJhdG9yID0gT3JkZXJCeUl0ZXJhdG9yO1xyXG5mdW5jdGlvbiBvcmRlckJ5KHNvdXJjZSwga2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICB2YXIgc2VsZWN0b3JGbiA9IChrZXlTZWxlY3RvcikgPyBtYWtlVmFsdWVQcmVkaWNhdGVfMS5tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpIDogVXRpbC5kZWZhdWx0U2VsZWN0b3I7XHJcbiAgICByZXR1cm4gbmV3IE9yZGVyQnlJdGVyYXRvcihzb3VyY2UsIHNlbGVjdG9yRm4sIGNvbXBhcmVyLCBmYWxzZSk7XHJcbn1cclxuZnVuY3Rpb24gb3JkZXJCeURlc2Moc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgIHZhciBzZWxlY3RvckZuID0gKGtleVNlbGVjdG9yKSA/IG1ha2VWYWx1ZVByZWRpY2F0ZV8xLm1ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3RvcikgOiBVdGlsLmRlZmF1bHRTZWxlY3RvcjtcclxuICAgIHJldHVybiBuZXcgT3JkZXJCeUl0ZXJhdG9yKHNvdXJjZSwgc2VsZWN0b3JGbiwgY29tcGFyZXIsIHRydWUpO1xyXG59XHJcbi8qKlxyXG4gKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBpbiBhc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgYSBrZXkgZnJvbSBhbiBlbGVtZW50LlxyXG4gKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gKi9cclxuZnVuY3Rpb24gb3JkZXJCeVByb3RvKGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgLy8gVE9ETzogSGF2ZW4ndCBnb3R0ZW4gdGhlIGludGVsbGlzZW5zZSB0byBzaG93IExpbnE8VFNvdXJjZT4gYXMgdGhlIHJlc3VsdCBvZiB0aGlzIGZ1bmN0aW9uLCBpdCBzaG93cyBMaW5xPGFueT4uXHJcbiAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICByZXR1cm4gbmV3IE9yZGVyZWRMaW5xKG9yZGVyQnkodGhpcy5fc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIpKTtcclxufVxyXG5leHBvcnRzLm9yZGVyQnlQcm90byA9IG9yZGVyQnlQcm90bztcclxuLyoqXHJcbiAqIFNvcnRzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGluIGFzY2VuZGluZyBvcmRlciBieSB1c2luZyBhIHNwZWNpZmllZCBjb21wYXJlci5cclxuICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCBhIGtleSBmcm9tIGFuIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSBjb21wYXJlciBBbiBJQ29tcGFyZXI8YW55PiB0byBjb21wYXJlIGtleXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBvcmRlckJ5U3RhdGljKHNvdXJjZSwga2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICByZXR1cm4gbmV3IGxpbnFfMS5MaW5xKHNvdXJjZSkub3JkZXJCeShrZXlTZWxlY3RvciwgY29tcGFyZXIpLnRvQXJyYXkoKTtcclxufVxyXG5leHBvcnRzLm9yZGVyQnlTdGF0aWMgPSBvcmRlckJ5U3RhdGljO1xyXG4vKipcclxuICogU29ydHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgaW4gZGVzY2VuZGluZyBvcmRlciBieSB1c2luZyBhIHNwZWNpZmllZCBjb21wYXJlci5cclxuICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCBhIGtleSBmcm9tIGFuIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSBjb21wYXJlciBBbiBJQ29tcGFyZXI8YW55PiB0byBjb21wYXJlIGtleXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBvcmRlckJ5RGVzY1Byb3RvKGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgLy8gVE9ETzogSGF2ZW4ndCBnb3R0ZW4gdGhlIGludGVsbGlzZW5zZSB0byBzaG93IExpbnE8VFNvdXJjZT4gYXMgdGhlIHJlc3VsdCBvZiB0aGlzIGZ1bmN0aW9uLCBpdCBzaG93cyBMaW5xPGFueT4uXHJcbiAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICByZXR1cm4gbmV3IE9yZGVyZWRMaW5xKG9yZGVyQnlEZXNjKHRoaXMuX3NvdXJjZSwga2V5U2VsZWN0b3IsIGNvbXBhcmVyKSk7XHJcbn1cclxuZXhwb3J0cy5vcmRlckJ5RGVzY1Byb3RvID0gb3JkZXJCeURlc2NQcm90bztcclxuLyoqXHJcbiAqIFNvcnRzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgYSBrZXkgZnJvbSBhbiBlbGVtZW50LlxyXG4gKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gKi9cclxuZnVuY3Rpb24gb3JkZXJCeURlc2NTdGF0aWMoc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgIHJldHVybiBuZXcgbGlucV8xLkxpbnEoc291cmNlKS5vcmRlckJ5RGVzYyhrZXlTZWxlY3RvciwgY29tcGFyZXIpLnRvQXJyYXkoKTtcclxufVxyXG5leHBvcnRzLm9yZGVyQnlEZXNjU3RhdGljID0gb3JkZXJCeURlc2NTdGF0aWM7XHJcbnZhciBMaW5xT3JkZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGlucU9yZGVyKGtleVNlbGVjdG9yLCBjb21wYXJlciwgZGVzY2VuZGluZykge1xyXG4gICAgICAgIGlmIChrZXlTZWxlY3RvciA9PT0gdm9pZCAwKSB7IGtleVNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgaWYgKGRlc2NlbmRpbmcgPT09IHZvaWQgMCkgeyBkZXNjZW5kaW5nID0gZmFsc2U7IH1cclxuICAgICAgICB0aGlzLl9rZXlTZWxlY3RvciA9IGtleVNlbGVjdG9yO1xyXG4gICAgICAgIHRoaXMuX2NvbXBhcmVyID0gY29tcGFyZXI7XHJcbiAgICAgICAgdGhpcy5fZGVzY2VuZGluZyA9IGRlc2NlbmRpbmc7XHJcbiAgICB9XHJcbiAgICBMaW5xT3JkZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fZGVzY2VuZGluZyA/IC0xIDogMSkgKiB0aGlzLl9jb21wYXJlcih0aGlzLl9rZXlTZWxlY3RvcihhKSwgdGhpcy5fa2V5U2VsZWN0b3IoYikpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaW5xT3JkZXI7XHJcbn0oKSk7XHJcbnZhciBPcmRlcmVkTGlucSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoT3JkZXJlZExpbnEsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBPcmRlcmVkTGlucShzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBpbiBkZXNjZW5kaW5nIG9yZGVyIGJ5IHVzaW5nIGEgc3BlY2lmaWVkIGNvbXBhcmVyLlxyXG4gICAgICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCBhIGtleSBmcm9tIGFuIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gICAgICovXHJcbiAgICBPcmRlcmVkTGlucS5wcm90b3R5cGUudGhlbkJ5ID0gZnVuY3Rpb24gKGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICB2YXIgc2VsZWN0b3JGbiA9IChrZXlTZWxlY3RvcikgPyBtYWtlVmFsdWVQcmVkaWNhdGVfMS5tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpIDogVXRpbC5kZWZhdWx0U2VsZWN0b3I7XHJcbiAgICAgICAgdmFyIG9yZGVySXRlcmF0b3IgPSB0aGlzLl9zb3VyY2UuZ2V0SXRlcmF0b3JGcm9tUGlwZWxpbmUoT3JkZXJCeUl0ZXJhdG9yKTtcclxuICAgICAgICBvcmRlckl0ZXJhdG9yLnRoZW5CeShzZWxlY3RvckZuLCBjb21wYXJlciwgZmFsc2UpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU29ydHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgaW4gZGVzY2VuZGluZyBvcmRlciBieSB1c2luZyBhIHNwZWNpZmllZCBjb21wYXJlci5cclxuICAgICAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgYSBrZXkgZnJvbSBhbiBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIGNvbXBhcmVyIEFuIElDb21wYXJlcjxhbnk+IHRvIGNvbXBhcmUga2V5cy5cclxuICAgICAqL1xyXG4gICAgT3JkZXJlZExpbnEucHJvdG90eXBlLnRoZW5CeURlc2MgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIHZhciBzZWxlY3RvckZuID0gKGtleVNlbGVjdG9yKSA/IG1ha2VWYWx1ZVByZWRpY2F0ZV8xLm1ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3RvcikgOiBVdGlsLmRlZmF1bHRTZWxlY3RvcjtcclxuICAgICAgICB2YXIgb3JkZXJJdGVyYXRvciA9IHRoaXMuX3NvdXJjZS5nZXRJdGVyYXRvckZyb21QaXBlbGluZShPcmRlckJ5SXRlcmF0b3IpO1xyXG4gICAgICAgIG9yZGVySXRlcmF0b3IudGhlbkJ5KHNlbGVjdG9yRm4sIGNvbXBhcmVyLCB0cnVlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICByZXR1cm4gT3JkZXJlZExpbnE7XHJcbn0obGlucV8xLkxpbnEpKTtcclxuZXhwb3J0cy5PcmRlcmVkTGlucSA9IE9yZGVyZWRMaW5xO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1vcmRlckJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgU2tpcEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhTa2lwSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBTa2lwSXRlcmF0b3Ioc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5jb3VudCA9IGNvdW50O1xyXG4gICAgICAgIF90aGlzLmNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIFNraXBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKDsgdGhpcy5jb3VudGVyIDwgdGhpcy5jb3VudDsgdGhpcy5jb3VudGVyKyspXHJcbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU2tpcEl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKSk7XHJcbmV4cG9ydHMuU2tpcEl0ZXJhdG9yID0gU2tpcEl0ZXJhdG9yO1xyXG5mdW5jdGlvbiBza2lwKHNvdXJjZSwgY291bnQpIHtcclxuICAgIHJldHVybiBuZXcgU2tpcEl0ZXJhdG9yKHNvdXJjZSwgY291bnQpO1xyXG59XHJcbi8qKlxyXG4gKiBCeXBhc3NlcyBhIHNwZWNpZmllZCBudW1iZXIgb2YgZWxlbWVudHMgaW4gYSBzZXF1ZW5jZSBhbmQgdGhlbiByZXR1cm5zIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXHJcbiAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNraXAgYmVmb3JlIHJldHVybmluZyB0aGUgcmVtYWluaW5nIGVsZW1lbnRzLlxyXG4gKi9cclxuZnVuY3Rpb24gc2tpcFByb3RvKGNvdW50KSB7XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KHNraXAsIGNvdW50KTtcclxufVxyXG5leHBvcnRzLnNraXBQcm90byA9IHNraXBQcm90bztcclxuLyoqXHJcbiAqIEJ5cGFzc2VzIGEgc3BlY2lmaWVkIG51bWJlciBvZiBlbGVtZW50cyBpbiBhIHNlcXVlbmNlIGFuZCB0aGVuIHJldHVybnMgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cclxuICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gc2tpcCBiZWZvcmUgcmV0dXJuaW5nIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXHJcbiAqL1xyXG5mdW5jdGlvbiBza2lwU3RhdGljKHNvdXJjZSwgY291bnQpIHtcclxuICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoY291bnQpO1xyXG4gICAgLy8gcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuc2tpcChjb3VudCkudG9BcnJheSgpO1xyXG59XHJcbmV4cG9ydHMuc2tpcFN0YXRpYyA9IHNraXBTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNraXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIFNraXBXaGlsZUl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhTa2lwV2hpbGVJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFNraXBXaGlsZUl0ZXJhdG9yKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5wcmVkaWNhdGUgPSBwcmVkaWNhdGU7XHJcbiAgICAgICAgX3RoaXMuZG9uZSA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIFNraXBXaGlsZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgaXRlbSA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH0gd2hpbGUgKCF0aGlzLmRvbmUgJiYgIVV0aWwuaXNVbmRlZmluZWQoaXRlbS52YWx1ZSkgJiYgdGhpcy5wcmVkaWNhdGUoaXRlbS52YWx1ZSwgdGhpcy5faWR4KSk7XHJcbiAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU2tpcFdoaWxlSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpKTtcclxuZXhwb3J0cy5Ta2lwV2hpbGVJdGVyYXRvciA9IFNraXBXaGlsZUl0ZXJhdG9yO1xyXG5mdW5jdGlvbiBza2lwV2hpbGUoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgIHJldHVybiBuZXcgU2tpcFdoaWxlSXRlcmF0b3Ioc291cmNlLCBwcmVkaWNhdGUpO1xyXG59XHJcbi8qKlxyXG4gKiBCeXBhc3NlcyBlbGVtZW50cyBpbiBhIHNlcXVlbmNlIGFzIGxvbmcgYXMgYSBzcGVjaWZpZWQgY29uZGl0aW9uIGlzIHRydWUgYW5kIHRoZW4gcmV0dXJucyB0aGUgcmVtYWluaW5nIGVsZW1lbnRzLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gc2tpcFdoaWxlUHJvdG8ocHJlZGljYXRlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KHNraXBXaGlsZSwgcHJlZGljYXRlKTtcclxufVxyXG5leHBvcnRzLnNraXBXaGlsZVByb3RvID0gc2tpcFdoaWxlUHJvdG87XHJcbi8qKlxyXG4gKiBCeXBhc3NlcyBlbGVtZW50cyBpbiBhIHNlcXVlbmNlIGFzIGxvbmcgYXMgYSBzcGVjaWZpZWQgY29uZGl0aW9uIGlzIHRydWUgYW5kIHRoZW4gcmV0dXJucyB0aGUgcmVtYWluaW5nIGVsZW1lbnRzLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gc2tpcFdoaWxlU3RhdGljKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICByZXR1cm4gbmV3IGxpbnFfMS5MaW5xKHNvdXJjZSkuc2tpcFdoaWxlKHByZWRpY2F0ZSkudG9BcnJheSgpO1xyXG59XHJcbmV4cG9ydHMuc2tpcFdoaWxlU3RhdGljID0gc2tpcFdoaWxlU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwV2hpbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBUYWtlSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFRha2VJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFRha2VJdGVyYXRvcihzb3VyY2UsIGNvdW50KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmNvdW50ID0gY291bnQ7XHJcbiAgICAgICAgX3RoaXMuX2NvdW50ZXIgPSAwO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIFRha2VJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY291bnRlciA8IHRoaXMuY291bnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY291bnRlcisrO1xyXG4gICAgICAgICAgICByZXR1cm4gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBUYWtlSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpKTtcclxuZXhwb3J0cy5UYWtlSXRlcmF0b3IgPSBUYWtlSXRlcmF0b3I7XHJcbmZ1bmN0aW9uIHRha2Uoc291cmNlLCBjb3VudCkge1xyXG4gICAgcmV0dXJuIG5ldyBUYWtlSXRlcmF0b3Ioc291cmNlLCBjb3VudCk7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgYSBzcGVjaWZpZWQgbnVtYmVyIG9mIGNvbnRpZ3VvdXMgZWxlbWVudHMgZnJvbSB0aGUgc3RhcnQgb2YgYSBzZXF1ZW5jZS5cclxuICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gcmV0dXJuLlxyXG4gKi9cclxuZnVuY3Rpb24gdGFrZVByb3RvKGNvdW50KSB7XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KHRha2UsIGNvdW50KTtcclxufVxyXG5leHBvcnRzLnRha2VQcm90byA9IHRha2VQcm90bztcclxuLyoqXHJcbiAqIFJldHVybnMgYSBzcGVjaWZpZWQgbnVtYmVyIG9mIGNvbnRpZ3VvdXMgZWxlbWVudHMgZnJvbSB0aGUgc3RhcnQgb2YgYSBzZXF1ZW5jZS5cclxuICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gcmV0dXJuLlxyXG4gKi9cclxuZnVuY3Rpb24gdGFrZVN0YXRpYyhzb3VyY2UsIGNvdW50KSB7XHJcbiAgICByZXR1cm4gc291cmNlLnNsaWNlKDAsIGNvdW50KTtcclxuICAgIC8vIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnNraXAoY291bnQpLnRvQXJyYXkoKTtcclxufVxyXG5leHBvcnRzLnRha2VTdGF0aWMgPSB0YWtlU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YWtlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBUYWtlV2hpbGVJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoVGFrZVdoaWxlSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBUYWtlV2hpbGVJdGVyYXRvcihzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMucHJlZGljYXRlID0gcHJlZGljYXRlO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIFRha2VXaGlsZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBuID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgaWYgKCFuLmRvbmUgJiYgISF0aGlzLnByZWRpY2F0ZShuLnZhbHVlLCB0aGlzLl9pZHgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogbi52YWx1ZSxcclxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBUYWtlV2hpbGVJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLkJhc2VJdGVyYXRvcikpO1xyXG5leHBvcnRzLlRha2VXaGlsZUl0ZXJhdG9yID0gVGFrZVdoaWxlSXRlcmF0b3I7XHJcbmZ1bmN0aW9uIHRha2VXaGlsZShzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgcmV0dXJuIG5ldyBUYWtlV2hpbGVJdGVyYXRvcihzb3VyY2UsIHByZWRpY2F0ZSk7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgZWxlbWVudHMgZnJvbSBhIHNlcXVlbmNlIGFzIGxvbmcgYXMgYSBzcGVjaWZpZWQgY29uZGl0aW9uIGlzIHRydWUuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiB0YWtlV2hpbGVQcm90byhwcmVkaWNhdGUpIHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQodGFrZVdoaWxlLCBwcmVkaWNhdGUpO1xyXG59XHJcbmV4cG9ydHMudGFrZVdoaWxlUHJvdG8gPSB0YWtlV2hpbGVQcm90bztcclxuLyoqXHJcbiAqIFJldHVybnMgZWxlbWVudHMgZnJvbSBhIHNlcXVlbmNlIGFzIGxvbmcgYXMgYSBzcGVjaWZpZWQgY29uZGl0aW9uIGlzIHRydWUuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiB0YWtlV2hpbGVTdGF0aWMoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgIHJldHVybiBuZXcgbGlucV8xLkxpbnEoc291cmNlKS50YWtlV2hpbGUocHJlZGljYXRlKS50b0FycmF5KCk7XHJcbn1cclxuZXhwb3J0cy50YWtlV2hpbGVTdGF0aWMgPSB0YWtlV2hpbGVTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2VXaGlsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgWmlwSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFppcEl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gWmlwSXRlcmF0b3Ioc291cmNlLCBvdGhlciwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMub3RoZXIgPSBvdGhlcjtcclxuICAgICAgICBfdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIFppcEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgaWYgKCFpdGVtLmRvbmUpIHtcclxuICAgICAgICAgICAgdmFyIG8gPSB0aGlzLm90aGVyW3RoaXMuX2lkeF07XHJcbiAgICAgICAgICAgIGlmICghVXRpbC5pc1VuZGVmaW5lZChvKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5jYWxsYmFjayhpdGVtLnZhbHVlLCBvLCB0aGlzLl9pZHgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBaaXBJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLkJhc2VJdGVyYXRvcikpO1xyXG5leHBvcnRzLlppcEl0ZXJhdG9yID0gWmlwSXRlcmF0b3I7XHJcbmZ1bmN0aW9uIHppcChzb3VyY2UsIG90aGVyLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIG5ldyBaaXBJdGVyYXRvcihzb3VyY2UsIG90aGVyLCBjYWxsYmFjayk7XHJcbn1cclxuLyoqXHJcbiAqIE1lcmdlcyBpdGVtcyBmcm9tIHRoZSBmaXJzdCBzZXF1ZW5jZSB3aXRoIHRoZSBpdGVtIGF0IHRoZSBjb3JyZXNwb25kaW5nIGluZGV4IGluIHRoZSBzZWNvbmQgc2VxdWVuY2UgdG9cclxuICogY3JlYXRlIGEgbmV3IHNlcXVlbmNlIHdpdGggdGhlIHJlc3VsdHMgb2YgY2FsbGluZyBhIHByb3ZpZGVkIGZ1bmN0aW9uIG9uIGV2ZXJ5IHBhaXIgb2YgaXRlbXMuXHJcbiAqIFRoZSB6aXAgd2lsbCBzdG9wIGFzIHNvb24gYXMgZWl0aGVyIG9mIHRoZSBzZXF1ZW5jZXMgaGl0cyBhbiB1bmRlZmluZWQgdmFsdWUuXHJcbiAqIEBwYXJhbSBvdGhlciBUaGUgc2Vjb25kIHNlcXVlbmNlIHRvIHppcCB3aXRoXHJcbiAqIEBwYXJhbSBjYWxsYmFjayBGdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGFuIGVsZW1lbnQgb2YgdGhlIG5ldyBzZXF1ZW5jZVxyXG4gKi9cclxuZnVuY3Rpb24gemlwUHJvdG8ob3RoZXIsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KHppcCwgb3RoZXIsIGNhbGxiYWNrKTtcclxufVxyXG5leHBvcnRzLnppcFByb3RvID0gemlwUHJvdG87XHJcbi8qKlxyXG4gKiBNZXJnZXMgaXRlbXMgZnJvbSB0aGUgZmlyc3Qgc2VxdWVuY2Ugd2l0aCB0aGUgaXRlbSBhdCB0aGUgY29ycmVzcG9uZGluZyBpbmRleCBpbiB0aGUgc2Vjb25kIHNlcXVlbmNlIHRvXHJcbiAqIGNyZWF0ZSBhIG5ldyBzZXF1ZW5jZSB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeSBwYWlyIG9mIGl0ZW1zLlxyXG4gKiBUaGUgemlwIHdpbGwgc3RvcCBhcyBzb29uIGFzIGVpdGhlciBvZiB0aGUgc2VxdWVuY2VzIGhpdHMgYW4gdW5kZWZpbmVkIHZhbHVlLlxyXG4gKiBAcGFyYW0gb3RoZXIgVGhlIHNlY29uZCBzZXF1ZW5jZSB0byB6aXAgd2l0aFxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhbiBlbGVtZW50IG9mIHRoZSBuZXcgc2VxdWVuY2VcclxuICovXHJcbmZ1bmN0aW9uIHppcFN0YXRpYyhzb3VyY2UsIG90aGVyLCBjYWxsYmFjaykge1xyXG4gICAgLy8gVE9ETzogV3JpdGUgc3RhdGljIHppcCBmdW5jdGlvbiB3aXRob3V0IGluc3RhbnRpYXRpbmcgYSBuZXcgTGlucSBvYmplY3RcclxuICAgIHJldHVybiBuZXcgbGlucV8xLkxpbnEoc291cmNlKS56aXAob3RoZXIsIGNhbGxiYWNrKS50b0FycmF5KCk7XHJcbn1cclxuZXhwb3J0cy56aXBTdGF0aWMgPSB6aXBTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXppcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yL2l0ZXJhdG9yXCIpO1xyXG52YXIgbWFwXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvci9tYXBcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBMaW5xID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpbnEoc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gKHNvdXJjZSBpbnN0YW5jZW9mIGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKVxyXG4gICAgICAgICAgICA/IHNvdXJjZVxyXG4gICAgICAgICAgICA6IG5ldyBtYXBfMS5NYXBJdGVyYXRvcihzb3VyY2UsIGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtOyB9KTtcclxuICAgIH1cclxuICAgIExpbnEucHJvdG90eXBlLmxpZnQgPSBmdW5jdGlvbiAoaXRlcmF0b3IpIHtcclxuICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShpdGVyYXRvci5hcHBseSh2b2lkIDAsIFt0aGlzLl9zb3VyY2VdLmNvbmNhdChhcmdzKSkpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogSW52ZXJ0cyB0aGUgb3JkZXIgb2YgdGhlIGVsZW1lbnRzIGluIGEgc2VxdWVuY2UuXHJcbiAgICAgKiBUaGlzIHNpbXBseSBpdGVyYXRlcyB0aGUgaXRlbXMgZnJvbSB0aGUgZW5kLCBhbmQgYXMgc3VjaCBoYXMgbm8gYWRkaXRpb25hbCBwZXJmb3JtYW5jZSBjb3N0LlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5yZXZlcnNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlcyB0aGUgcGlwZWxpbmUgYW5kIHJldHVybiB0aGUgcmVzdWx0aW5nIGFycmF5LlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByZXMsIGFyciA9IFtdO1xyXG4gICAgICAgIGlmIChVdGlsLmlzQXJyYXkodGhpcy5fc291cmNlKSkge1xyXG4gICAgICAgICAgICBhcnIgPSBVdGlsLmNhc3QodGhpcy5fc291cmNlKS5zbGljZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgd2hpbGUgKCEocmVzID0gdGhpcy5fc291cmNlLm5leHQoKSkuZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2gocmVzLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaW5xO1xyXG59KCkpO1xyXG5leHBvcnRzLkxpbnEgPSBMaW5xO1xyXG5mdW5jdGlvbiBMUShzb3VyY2UpIHtcclxuICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpO1xyXG59XHJcbmV4cG9ydHMuTFEgPSBMUTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlucS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG5mdW5jdGlvbiBtYWtlVmFsdWVQcmVkaWNhdGUocHJlZGljYXRlKSB7XHJcbiAgICBpZiAoVXRpbC5pc1N0cmluZyhwcmVkaWNhdGUpKSB7XHJcbiAgICAgICAgdmFyIGZpZWxkXzEgPSBwcmVkaWNhdGU7XHJcbiAgICAgICAgcHJlZGljYXRlID0gKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4W2ZpZWxkXzFdOyB9KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKFV0aWwuaXNVbmRlZmluZWQocHJlZGljYXRlKSkge1xyXG4gICAgICAgIHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcmVkaWNhdGU7XHJcbn1cclxuZXhwb3J0cy5tYWtlVmFsdWVQcmVkaWNhdGUgPSBtYWtlVmFsdWVQcmVkaWNhdGU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1ha2VWYWx1ZVByZWRpY2F0ZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5yZXF1aXJlKFwiLi4vYWRkL2FueVwiKTtcclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciBhbGwgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKiBAcGFyYW0gaW52ZXJ0IElmIHRydWUsIGRldGVybWluZXMgd2hldGhlciBub25lIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGFsbFByb3RvKHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICBpZiAoaW52ZXJ0ID09PSB2b2lkIDApIHsgaW52ZXJ0ID0gZmFsc2U7IH1cclxuICAgIHJldHVybiAhKHRoaXMuYW55KHByZWRpY2F0ZSwgIWludmVydCkpO1xyXG59XHJcbmV4cG9ydHMuYWxsUHJvdG8gPSBhbGxQcm90bztcclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciBhbGwgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKiBAcGFyYW0gaW52ZXJ0IElmIHRydWUsIGRldGVybWluZXMgd2hldGhlciBub25lIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGFsbFN0YXRpYyhzb3VyY2UsIHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICBpZiAoaW52ZXJ0ID09PSB2b2lkIDApIHsgaW52ZXJ0ID0gZmFsc2U7IH1cclxuICAgIHJldHVybiBzb3VyY2UuZXZlcnkoZnVuY3Rpb24gKHgpIHsgcmV0dXJuICEhcHJlZGljYXRlKHgpICE9PSBpbnZlcnQ7IH0pO1xyXG59XHJcbmV4cG9ydHMuYWxsU3RhdGljID0gYWxsU3RhdGljO1xyXG4vLyAvKipcclxuLy8gICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFsbCBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIHNhdGlzZnkgYSBjb25kaXRpb24uXHJcbi8vICAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbi8vICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIG5vbmUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4vLyAgKi9cclxuLy8gYWxsKHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+LCBpbnZlcnQ6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xyXG4vLyAgICAgcmV0dXJuICEodGhpcy5hbnkocHJlZGljYXRlLCAhaW52ZXJ0KSk7XHJcbi8vIH1cclxuLy8gLyoqXHJcbi8vICAqIERldGVybWluZXMgd2hldGhlciBhbGwgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4vLyAgKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4vLyAgKiBAcGFyYW0gaW52ZXJ0IElmIHRydWUsIGRldGVybWluZXMgd2hldGhlciBub25lIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuLy8gICovXHJcbi8vIHN0YXRpYyBhbGw8VFNvdXJjZT4oc291cmNlOiBUU291cmNlW10sIHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+LCBpbnZlcnQ6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xyXG4vLyAgICAgcmV0dXJuIHNvdXJjZS5ldmVyeSh4ID0+ICEhcHJlZGljYXRlKHgpICE9PSBpbnZlcnQpO1xyXG4vLyB9XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFsbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5yZXF1aXJlKFwiLi4vYWRkL2ZpcnN0XCIpO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2Ugc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLiBJZiBub3QgcHJvdmlkZWQsIGRldGVybWluZXMgd2hldGhlciB0aGUgc2VxdWVuY2UgY29udGFpbnMgYW55IGVsZW1lbnRzLlxyXG4gKiBAcGFyYW0gaW52ZXJ0IElmIHRydWUsIGRldGVybWluZXMgd2hldGhlciBhbnkgZWxlbWVudCBvZiBhIHNlcXVlbmNlIGRvZXMgbm90IHNhdGlzZmllcyBhIGNvbmRpdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGFueVByb3RvKHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICBpZiAoaW52ZXJ0ID09PSB2b2lkIDApIHsgaW52ZXJ0ID0gZmFsc2U7IH1cclxuICAgIHJldHVybiB0eXBlb2YgdGhpcy5maXJzdChmdW5jdGlvbiAoeCkgeyByZXR1cm4gISFwcmVkaWNhdGUoeCkgIT09IGludmVydDsgfSkgIT09IFwidW5kZWZpbmVkXCI7XHJcbn1cclxuZXhwb3J0cy5hbnlQcm90byA9IGFueVByb3RvO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2Ugc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLiBJZiBub3QgcHJvdmlkZWQsIGRldGVybWluZXMgd2hldGhlciB0aGUgc2VxdWVuY2UgY29udGFpbnMgYW55IGVsZW1lbnRzLlxyXG4gKiBAcGFyYW0gaW52ZXJ0IElmIHRydWUsIGRldGVybWluZXMgd2hldGhlciBhbnkgZWxlbWVudCBvZiBhIHNlcXVlbmNlIGRvZXMgbm90IHNhdGlzZmllcyBhIGNvbmRpdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGFueVN0YXRpYyhzb3VyY2UsIHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICBpZiAoaW52ZXJ0ID09PSB2b2lkIDApIHsgaW52ZXJ0ID0gZmFsc2U7IH1cclxuICAgIHJldHVybiBzb3VyY2Uuc29tZShmdW5jdGlvbiAoeCkgeyByZXR1cm4gISFwcmVkaWNhdGUoeCkgIT09IGludmVydDsgfSk7XHJcbn1cclxuZXhwb3J0cy5hbnlTdGF0aWMgPSBhbnlTdGF0aWM7XHJcbi8vIC8qKlxyXG4vLyAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW55IGVsZW1lbnQgb2YgYSBzZXF1ZW5jZSBzYXRpc2ZpZXMgYSBjb25kaXRpb24uXHJcbi8vICAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uIElmIG5vdCBwcm92aWRlZCwgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzZXF1ZW5jZSBjb250YWlucyBhbnkgZWxlbWVudHMuXHJcbi8vICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2UgZG9lcyBub3Qgc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4vLyAgKi9cclxuLy8gYW55KHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+LCBpbnZlcnQ6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xyXG4vLyAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmZpcnN0KHggPT4gISFwcmVkaWNhdGUoeCkgIT09IGludmVydCkgIT09IFwidW5kZWZpbmVkXCI7XHJcbi8vIH1cclxuLy8gLyoqXHJcbi8vICAqIERldGVybWluZXMgd2hldGhlciBhbnkgZWxlbWVudCBvZiBhIHNlcXVlbmNlIHNhdGlzZmllcyBhIGNvbmRpdGlvbi5cclxuLy8gICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi4gSWYgbm90IHByb3ZpZGVkLCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNlcXVlbmNlIGNvbnRhaW5zIGFueSBlbGVtZW50cy5cclxuLy8gICogQHBhcmFtIGludmVydCBJZiB0cnVlLCBkZXRlcm1pbmVzIHdoZXRoZXIgYW55IGVsZW1lbnQgb2YgYSBzZXF1ZW5jZSBkb2VzIG5vdCBzYXRpc2ZpZXMgYSBjb25kaXRpb24uXHJcbi8vICAqL1xyXG4vLyBzdGF0aWMgYW55PFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdLCBwcmVkaWNhdGU6IFV0aWwuSVByZWRpY2F0ZTxUU291cmNlPiwgaW52ZXJ0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuLy8gICAgIHJldHVybiBzb3VyY2Uuc29tZSh4ID0+ICEhcHJlZGljYXRlKHgpICE9PSBpbnZlcnQpO1xyXG4vLyB9XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFueS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xyXG4vKipcclxuICogQ29tcHV0ZXMgdGhlIGF2ZXJhZ2Ugb2YgYSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gc2VsZWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIGF2ZXJhZ2VQcm90byhzZWxlY3Rvcikge1xyXG4gICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgcmV0dXJuIGF2ZXJhZ2VTdGF0aWModGhpcy50b0FycmF5KCksIHNlbGVjdG9yKTtcclxufVxyXG5leHBvcnRzLmF2ZXJhZ2VQcm90byA9IGF2ZXJhZ2VQcm90bztcclxuLyoqXHJcbiAqIENvbXB1dGVzIHRoZSBhdmVyYWdlIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIHNlbGVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBhdmVyYWdlU3RhdGljKHNvdXJjZSwgc2VsZWN0b3IpIHtcclxuICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgIHZhciBpLCB0b3RhbCA9IDA7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdG90YWwgKz0gc2VsZWN0b3Ioc291cmNlW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0b3RhbCAvIHNvdXJjZS5sZW5ndGg7XHJcbn1cclxuZXhwb3J0cy5hdmVyYWdlU3RhdGljID0gYXZlcmFnZVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXZlcmFnZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xyXG5yZXF1aXJlKFwiLi4vYWRkL2ZpbHRlclwiKTtcclxucmVxdWlyZShcIi4uL2FkZC90YWtlXCIpO1xyXG4vKipcclxuICogUmV0dXJucyB0aGUgZmlyc3QgbWF0Y2hpbmcgaXRlbSBpbiB0aGUgYXJyYXkuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICovXHJcbmZ1bmN0aW9uIGZpcnN0UHJvdG8ocHJlZGljYXRlKSB7XHJcbiAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICB2YXIgYXJyID0gdGhpcy5maWx0ZXIocHJlZGljYXRlKS50YWtlKDEpLnRvQXJyYXkoKTtcclxuICAgIGlmIChhcnIubGVuZ3RoID09IDEpXHJcbiAgICAgICAgcmV0dXJuIGFyclswXTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcbmV4cG9ydHMuZmlyc3RQcm90byA9IGZpcnN0UHJvdG87XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBtYXRjaGluZyBpdGVtIGluIHRoZSBhcnJheS5cclxuICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gKi9cclxuZnVuY3Rpb24gZmlyc3RTdGF0aWMoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgIGlmICghc291cmNlIHx8IHNvdXJjZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIGlmICghcHJlZGljYXRlKVxyXG4gICAgICAgIHJldHVybiBzb3VyY2VbMF07XHJcbiAgICB2YXIgcnMgPSB1bmRlZmluZWQ7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUoc291cmNlW2ldKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc291cmNlW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbn1cclxuZXhwb3J0cy5maXJzdFN0YXRpYyA9IGZpcnN0U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1maXJzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xyXG5yZXF1aXJlKFwiLi4vYWRkL2ZpcnN0XCIpO1xyXG4vKipcclxuICogUmV0dXJucyB0aGUgbGFzdCBtYXRjaGluZyBpdGVtIGluIHRoZSBhcnJheS5cclxuICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gKi9cclxuZnVuY3Rpb24gbGFzdFByb3RvKHByZWRpY2F0ZSkge1xyXG4gICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpLmZpcnN0KHByZWRpY2F0ZSk7XHJcbn1cclxuZXhwb3J0cy5sYXN0UHJvdG8gPSBsYXN0UHJvdG87XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBsYXN0IG1hdGNoaW5nIGl0ZW0gaW4gdGhlIGFycmF5LlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBsYXN0U3RhdGljKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICBpZiAoIXNvdXJjZSB8fCBzb3VyY2UubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICBpZiAoIXByZWRpY2F0ZSlcclxuICAgICAgICByZXR1cm4gc291cmNlW3NvdXJjZS5sZW5ndGggLSAxXTtcclxuICAgIGZvciAodmFyIGkgPSBzb3VyY2UubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlKHNvdXJjZVtpXSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcbmV4cG9ydHMubGFzdFN0YXRpYyA9IGxhc3RTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxhc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxuLyoqXHJcbiAqIENvbXB1dGVzIHRoZSBtYXhpbXVtIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIHNlbGVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBtYXhQcm90byhzZWxlY3Rvcikge1xyXG4gICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgcmV0dXJuIG1heFN0YXRpYyh0aGlzLnRvQXJyYXkoKSwgc2VsZWN0b3IpO1xyXG59XHJcbmV4cG9ydHMubWF4UHJvdG8gPSBtYXhQcm90bztcclxuLyoqXHJcbiAqIENvbXB1dGVzIHRoZSBtYXhpbXVtIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIHNlbGVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBtYXhTdGF0aWMoc291cmNlLCBzZWxlY3Rvcikge1xyXG4gICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIHNvdXJjZS5tYXAoc2VsZWN0b3IpKTtcclxufVxyXG5leHBvcnRzLm1heFN0YXRpYyA9IG1heFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWF4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XHJcbi8qKlxyXG4gKiBDb21wdXRlcyB0aGUgbWluaW11bSBvZiBhIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBzZWxlY3RvclxyXG4gKi9cclxuZnVuY3Rpb24gbWluUHJvdG8oc2VsZWN0b3IpIHtcclxuICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgIHJldHVybiBtaW5TdGF0aWModGhpcy50b0FycmF5KCksIHNlbGVjdG9yKTtcclxufVxyXG5leHBvcnRzLm1pblByb3RvID0gbWluUHJvdG87XHJcbi8qKlxyXG4gKiBDb21wdXRlcyB0aGUgbWluaW11bSBvZiBhIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBzZWxlY3RvclxyXG4gKi9cclxuZnVuY3Rpb24gbWluU3RhdGljKHNvdXJjZSwgc2VsZWN0b3IpIHtcclxuICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShNYXRoLCBzb3VyY2UubWFwKHNlbGVjdG9yKSk7XHJcbn1cclxuZXhwb3J0cy5taW5TdGF0aWMgPSBtaW5TdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1pbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5yZXF1aXJlKFwiLi4vYWRkL2ZpbHRlclwiKTtcclxucmVxdWlyZShcIi4uL2FkZC90YWtlXCIpO1xyXG4vKipcclxuICogUmV0dXJucyB0aGUgbWF0Y2hpbmcgaXRlbSBpbiB0aGUgYXJyYXkuIElmIHRoZXJlIGFyZSB6ZXJvIG9yIHNldmVyYWwgbWF0Y2hlcyBhbiBleGNlcHRpb24gd2lsbCBiZSB0aHJvd25cclxuICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gKiBAdGhyb3dzIEVycm9yLlxyXG4gKi9cclxuZnVuY3Rpb24gc2luZ2xlUHJvdG8ocHJlZGljYXRlKSB7XHJcbiAgICB2YXIgYXJyID0gdGhpcy5maWx0ZXIocHJlZGljYXRlKS50YWtlKDIpLnRvQXJyYXkoKTtcclxuICAgIGlmIChhcnIubGVuZ3RoID09IDApXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHNlcXVlbmNlIGlzIGVtcHR5LlwiKTtcclxuICAgIGlmIChhcnIubGVuZ3RoID09IDIpXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHNlcXVlbmNlIGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgZWxlbWVudC5cIik7XHJcbiAgICBpZiAoYXJyLmxlbmd0aCA9PSAxKVxyXG4gICAgICAgIHJldHVybiBhcnJbMF07XHJcbn1cclxuZXhwb3J0cy5zaW5nbGVQcm90byA9IHNpbmdsZVByb3RvO1xyXG4vKipcclxuICogUmV0dXJucyB0aGUgbWF0Y2hpbmcgaXRlbSBpbiB0aGUgYXJyYXkuIElmIHRoZXJlIGFyZSB6ZXJvIG9yIHNldmVyYWwgbWF0Y2hlcyBhbiBleGNlcHRpb24gd2lsbCBiZSB0aHJvd25cclxuICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gKiBAdGhyb3dzIEVycm9yXHJcbiAqL1xyXG5mdW5jdGlvbiBzaW5nbGVTdGF0aWMoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgIGlmICghc291cmNlIHx8IHNvdXJjZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIGlmICghcHJlZGljYXRlKVxyXG4gICAgICAgIHJldHVybiBzb3VyY2VbMF07XHJcbiAgICB2YXIgcnMgPSB1bmRlZmluZWQ7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUoc291cmNlW2ldKSkge1xyXG4gICAgICAgICAgICBpZiAocnMpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc2VxdWVuY2UgY29udGFpbnMgbW9yZSB0aGFuIG9uZSBlbGVtZW50LlwiKTtcclxuICAgICAgICAgICAgcnMgPSBzb3VyY2VbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFycylcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc2VxdWVuY2UgaXMgZW1wdHkuXCIpO1xyXG4gICAgcmV0dXJuIHJzO1xyXG59XHJcbmV4cG9ydHMuc2luZ2xlU3RhdGljID0gc2luZ2xlU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaW5nbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxuLyoqXHJcbiAqIENvbXB1dGVzIHRoZSBzdW0gb2YgdGhlIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBzZWxlY3RvciBBIHRyYW5zZm9ybSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBzdW1Qcm90byhzZWxlY3Rvcikge1xyXG4gICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgcmV0dXJuIHN1bVN0YXRpYyh0aGlzLnRvQXJyYXkoKSwgc2VsZWN0b3IpO1xyXG59XHJcbmV4cG9ydHMuc3VtUHJvdG8gPSBzdW1Qcm90bztcclxuLyoqXHJcbiAqIENvbXB1dGVzIHRoZSBzdW0gb2YgdGhlIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBzZWxlY3RvciBBIHRyYW5zZm9ybSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBzdW1TdGF0aWMoc291cmNlLCBzZWxlY3Rvcikge1xyXG4gICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgdmFyIGksIHN1bSA9IDA7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3VtICs9IHNlbGVjdG9yKHNvdXJjZVtpXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3VtO1xyXG59XHJcbmV4cG9ydHMuc3VtU3RhdGljID0gc3VtU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdW0uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gZGVmYXVsdFNlbGVjdG9yKGEpIHtcclxuICAgIHJldHVybiBjYXN0KGEpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdFNlbGVjdG9yID0gZGVmYXVsdFNlbGVjdG9yO1xyXG5mdW5jdGlvbiBkZWZhdWx0Q29tcGFyZXIoYSwgYikge1xyXG4gICAgaWYgKGEgPCBiKVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIGVsc2UgaWYgKGEgPiBiKVxyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiAwO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdENvbXBhcmVyID0gZGVmYXVsdENvbXBhcmVyO1xyXG5mdW5jdGlvbiBkZWZhdWx0RXF1YWxpdHlDb21wYXJlcihhLCBiKSB7XHJcbiAgICByZXR1cm4gYSA9PT0gYjtcclxufVxyXG5leHBvcnRzLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyID0gZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXI7XHJcbmZ1bmN0aW9uIGRlZmF1bHRQcmVkaWNhdGUodmFsdWUsIGluZGV4KSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHRQcmVkaWNhdGUgPSBkZWZhdWx0UHJlZGljYXRlO1xyXG5mdW5jdGlvbiBjYXN0KGEpIHtcclxuICAgIHJldHVybiBhO1xyXG59XHJcbmV4cG9ydHMuY2FzdCA9IGNhc3Q7XHJcbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcclxufVxyXG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XHJcbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiO1xyXG59XHJcbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcclxuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XHJcbn1cclxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xyXG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIjtcclxufVxyXG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcclxufVxyXG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xyXG5mdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XHJcbn1cclxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcclxuZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgRGF0ZV1cIjtcclxufVxyXG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpc3RfMSA9IHJlcXVpcmUoXCIuL2xpc3RcIik7XHJcbmV4cG9ydHMuTGlzdCA9IGxpc3RfMS5kZWZhdWx0O1xyXG52YXIgbGlua2VkTGlzdF8xID0gcmVxdWlyZShcIi4vbGlua2VkTGlzdFwiKTtcclxuZXhwb3J0cy5MaW5rZWRMaXN0ID0gbGlua2VkTGlzdF8xLmRlZmF1bHQ7XHJcbnZhciBzdGFja18xID0gcmVxdWlyZShcIi4vc3RhY2tcIik7XHJcbmV4cG9ydHMuU3RhY2sgPSBzdGFja18xLmRlZmF1bHQ7XHJcbnZhciBxdWV1ZV8xID0gcmVxdWlyZShcIi4vcXVldWVcIik7XHJcbmV4cG9ydHMuUXVldWUgPSBxdWV1ZV8xLmRlZmF1bHQ7XHJcbnZhciBiaW5hcnlUcmVlXzEgPSByZXF1aXJlKFwiLi9iaW5hcnlUcmVlXCIpO1xyXG5leHBvcnRzLkJpbmFyeVRyZWUgPSBiaW5hcnlUcmVlXzEuZGVmYXVsdDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIG51bWJlcnNfMSA9IHJlcXVpcmUoXCIuL251bWJlcnNcIik7XHJcbmV4cG9ydHMuTnVtYmVycyA9IG51bWJlcnNfMS5kZWZhdWx0O1xyXG5leHBvcnRzLk51bWJlcnNIZWxwZXIgPSBudW1iZXJzXzEuTnVtYmVyc0hlbHBlcjtcclxudmFyIHN0cmluZ3NfMSA9IHJlcXVpcmUoXCIuL3N0cmluZ3NcIik7XHJcbmV4cG9ydHMuU3RyaW5ncyA9IHN0cmluZ3NfMS5kZWZhdWx0O1xyXG5leHBvcnRzLlN0cmluZ3NIZWxwZXIgPSBzdHJpbmdzXzEuU3RyaW5nc0hlbHBlcjtcclxudmFyIGRhdGVzXzEgPSByZXF1aXJlKFwiLi9kYXRlc1wiKTtcclxuZXhwb3J0cy5EYXRlcyA9IGRhdGVzXzEuZGVmYXVsdDtcclxuZXhwb3J0cy5EYXRlc0hlbHBlciA9IGRhdGVzXzEuRGF0ZXNIZWxwZXI7XHJcbnZhciB1cmxfMSA9IHJlcXVpcmUoXCIuL3VybFwiKTtcclxuZXhwb3J0cy5VcmwgPSB1cmxfMS5kZWZhdWx0O1xyXG5leHBvcnRzLlVybEhlbHBlciA9IHVybF8xLlVybEhlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIG9yZGVyQnlfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yL29yZGVyQnlcIik7XHJcbmV4cG9ydHMuT3JkZXJlZExpbnEgPSBvcmRlckJ5XzEuT3JkZXJlZExpbnE7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi9saW5xXCIpO1xyXG5leHBvcnRzLkxpbnEgPSBsaW5xXzEuTGlucTtcclxuZXhwb3J0cy5MUSA9IGxpbnFfMS5MUTtcclxuLy8gSXRlcmF0b3JzXHJcbnJlcXVpcmUoXCIuL2FkZC9kaXN0aW5jdFwiKTtcclxucmVxdWlyZShcIi4vYWRkL2V4Y2VwdFwiKTtcclxucmVxdWlyZShcIi4vYWRkL2ZpbHRlclwiKTtcclxucmVxdWlyZShcIi4vYWRkL2dyb3VwQnlcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9pbnRlcnNlY3RcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9qb2luXCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvbWFwXCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvb3JkZXJCeVwiKTtcclxucmVxdWlyZShcIi4vYWRkL3NraXBcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9za2lwV2hpbGVcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC90YWtlXCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvdGFrZVdoaWxlXCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvemlwXCIpO1xyXG4vLyBPcGVyYXRvcnNcclxucmVxdWlyZShcIi4vYWRkL2FsbFwiKTtcclxucmVxdWlyZShcIi4vYWRkL2FueVwiKTtcclxucmVxdWlyZShcIi4vYWRkL2F2ZXJhZ2VcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9maXJzdFwiKTtcclxucmVxdWlyZShcIi4vYWRkL2xhc3RcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9tYXhcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9taW5cIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9zaW5nbGVcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9zdW1cIik7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCJdfQ==
;
return {
'Collections': require('Collections'),
'Helpers': require('Helpers'),
'Linq': require('Linq')
};
});
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
    return source.reduce(function (sum, item) { return sum + selector(item); }, 0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9iaW5hcnlUcmVlLmpzIiwiZGlzdC9zcmMvY29sbGVjdGlvbnMvbGlua2VkTGlzdC5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL2xpc3QuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9xdWV1ZS5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL3N0YWNrLmpzIiwiZGlzdC9zcmMvaGVscGVycy9kYXRlcy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvbnVtYmVycy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvc3RyaW5ncy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvdXJsLmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvYWxsLmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvYW55LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvYXZlcmFnZS5qcyIsImRpc3Qvc3JjL2xpbnEvYWRkL2Rpc3RpbmN0LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvZXhjZXB0LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvZmlsdGVyLmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvZmlyc3QuanMiLCJkaXN0L3NyYy9saW5xL2FkZC9ncm91cEJ5LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvaW50ZXJzZWN0LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvam9pbi5qcyIsImRpc3Qvc3JjL2xpbnEvYWRkL2xhc3QuanMiLCJkaXN0L3NyYy9saW5xL2FkZC9tYXAuanMiLCJkaXN0L3NyYy9saW5xL2FkZC9tYXguanMiLCJkaXN0L3NyYy9saW5xL2FkZC9taW4uanMiLCJkaXN0L3NyYy9saW5xL2FkZC9vcmRlckJ5LmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvc2luZ2xlLmpzIiwiZGlzdC9zcmMvbGlucS9hZGQvc2tpcC5qcyIsImRpc3Qvc3JjL2xpbnEvYWRkL3NraXBXaGlsZS5qcyIsImRpc3Qvc3JjL2xpbnEvYWRkL3N1bS5qcyIsImRpc3Qvc3JjL2xpbnEvYWRkL3Rha2UuanMiLCJkaXN0L3NyYy9saW5xL2FkZC90YWtlV2hpbGUuanMiLCJkaXN0L3NyYy9saW5xL2FkZC96aXAuanMiLCJkaXN0L3NyYy9saW5xL2l0ZXJhdG9yL2Rpc3RpbmN0LmpzIiwiZGlzdC9zcmMvbGlucS9pdGVyYXRvci9leGNlcHQuanMiLCJkaXN0L3NyYy9saW5xL2l0ZXJhdG9yL2ZpbHRlci5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IvZ3JvdXBCeS5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IvaW50ZXJzZWN0LmpzIiwiZGlzdC9zcmMvbGlucS9pdGVyYXRvci9pdGVyYXRvci5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3Ivam9pbi5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IvbWFwLmpzIiwiZGlzdC9zcmMvbGlucS9pdGVyYXRvci9vcmRlckJ5LmpzIiwiZGlzdC9zcmMvbGlucS9pdGVyYXRvci9za2lwLmpzIiwiZGlzdC9zcmMvbGlucS9pdGVyYXRvci9za2lwV2hpbGUuanMiLCJkaXN0L3NyYy9saW5xL2l0ZXJhdG9yL3Rha2UuanMiLCJkaXN0L3NyYy9saW5xL2l0ZXJhdG9yL3Rha2VXaGlsZS5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IvemlwLmpzIiwiZGlzdC9zcmMvbGlucS9saW5xLmpzIiwiZGlzdC9zcmMvbGlucS9tYWtlVmFsdWVQcmVkaWNhdGUuanMiLCJkaXN0L3NyYy9saW5xL29wZXJhdG9yL2FsbC5qcyIsImRpc3Qvc3JjL2xpbnEvb3BlcmF0b3IvYW55LmpzIiwiZGlzdC9zcmMvbGlucS9vcGVyYXRvci9hdmVyYWdlLmpzIiwiZGlzdC9zcmMvbGlucS9vcGVyYXRvci9maXJzdC5qcyIsImRpc3Qvc3JjL2xpbnEvb3BlcmF0b3IvbGFzdC5qcyIsImRpc3Qvc3JjL2xpbnEvb3BlcmF0b3IvbWF4LmpzIiwiZGlzdC9zcmMvbGlucS9vcGVyYXRvci9taW4uanMiLCJkaXN0L3NyYy9saW5xL29wZXJhdG9yL3NpbmdsZS5qcyIsImRpc3Qvc3JjL2xpbnEvb3BlcmF0b3Ivc3VtLmpzIiwiZGlzdC9zcmMvdXRpbC9pbmRleC5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL2luZGV4LmpzIiwiZGlzdC9zcmMvaGVscGVycy9pbmRleC5qcyIsImRpc3Qvc3JjL2xpbnEvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgcXVldWVfMSA9IHJlcXVpcmUoXCIuL3F1ZXVlXCIpO1xyXG52YXIgQmluYXJ5VHJlZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBCaW5hcnlUcmVlKHNlbGVjdG9yRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0b3IgPSBzZWxlY3RvckZ1bmN0aW9uIHx8IFV0aWwuZGVmYXVsdFNlbGVjdG9yO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYW4gaXRlbSBpbnRvIHRoZSB0cmVlLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gUmV0dXJuIGZhbHNlIGlmIHRoZSBpdGVtIGFscmVhZHkgZXhpc3RzLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gdGhpcy5pbnNlcnRBdXgodGhpcy5fcm9vdCwgbmV3IFRyZWVOb2RlKGl0ZW0pKTsgfTtcclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0IGEgcmFuZ2Ugb2YgaXRlbXMgaW50byB0aGUgdHJlZS5cclxuICAgICAqIEBwYXJhbSBpdGVtXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmluc2VydFJhbmdlID0gZnVuY3Rpb24gKGl0ZW1zKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IF90aGlzLmluc2VydChpdGVtKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYW4gaXRlbSBpbnRvIHRoZSB0cmVlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB3ZSB3aXNoIHRvIGluc2VydFxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbnNlcnRBdXggPSBmdW5jdGlvbiAodHJlZSwgbm9kZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yb290ID0gbm9kZTtcclxuICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb21wID0gVXRpbC5kZWZhdWx0Q29tcGFyZXIodGhpcy5fc2VsZWN0b3Iobm9kZS52YWx1ZSksIHRoaXMuX3NlbGVjdG9yKHRyZWUudmFsdWUpKTtcclxuICAgICAgICBpZiAoY29tcCA8IDApIHtcclxuICAgICAgICAgICAgaWYgKHRyZWUubGVmdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRBdXgodHJlZS5sZWZ0LCBub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyZWUubGVmdCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHRyZWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb21wID4gMCkge1xyXG4gICAgICAgICAgICBpZiAodHJlZS5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRBdXgodHJlZS5yaWdodCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlLnJpZ2h0ID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdHJlZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fc2VhcmNoKHRoaXMuX3Jvb3QsIGl0ZW0pO1xyXG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlID09PSB0aGlzLl9yb290KSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcm9vdDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub2RlLnZhbHVlIDwgbm9kZS5wYXJlbnQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnQubGVmdDtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIG5vZGUucGFyZW50LnJpZ2h0O1xyXG4gICAgICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHZhciByaWdodCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHdoaWxlIChyaWdodC5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC5yaWdodDtcclxuICAgICAgICAgICAgfSAvLyBHZXQgcmlnaHQgbW9zdCBpdGVtLlxyXG4gICAgICAgICAgICBpZiAocmlnaHQubGVmdCkge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC5sZWZ0OyAvLyBJZiB0aGUgcmlnaHQgbW9zdCBpdGVtIGhhcyBhIGxlZnQsIHVzZSB0aGF0IGluc3RlYWQuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocmlnaHQudmFsdWUgIT09IG5vZGUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByaWdodC5sZWZ0ID0gcmlnaHQucGFyZW50LmxlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQubGVmdC5wYXJlbnQgPSByaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmlnaHQucGFyZW50LnZhbHVlID09PSBub2RlLnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0LnBhcmVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByaWdodC5wYXJlbnQgPSBub2RlLnBhcmVudDtcclxuICAgICAgICAgICAgbm9kZS5sZWZ0ID0gbm9kZS5yaWdodCA9IG5vZGUucGFyZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gdGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdCA9IHJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3Jvb3QucGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSB0cmVlIGNvbnRhaW5zIGEgZ2l2ZW4gaXRlbS5cclxuICAgICAqIEBwYXJhbSBpdGVtXHJcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBpdGVtIGV4aXN0cyBpbiB0aGUgdHJlZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiAhIXRoaXMuX3NlYXJjaCh0aGlzLl9yb290LCBpdGVtKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGUgY2FsbGJhY2sgZm9yIGVhY2ggaXRlbS5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqIEBzZWUgaW5vcmRlclRyYXZlcnNhbFxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsKGNhbGxiYWNrKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIE1ha2UgaW50byBhbiAob3JkZXJlZCkgYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkgeyBhcnIucHVzaChpdGVtKTsgfSk7XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlIHRoZSB0cmVlIGFuZCBleGVjdXRlIGNhbGxiYWNrIHdoZW4gZW50ZXJpbmcgKHBhc3Npbmcgb24gdGhlIGxlZnQgc2lkZSBvZikgYW4gaXRlbS5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucHJlb3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5wcmVvcmRlclRyYXZlcnNhbEF1eCh0aGlzLl9yb290LCBjYWxsYmFjaywgeyBzdG9wOiBmYWxzZSB9KTsgfTtcclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgd2hlbiBlbnRlcmluZyAocGFzc2luZyBvbiB0aGUgbGVmdCBzaWRlIG9mKSBhbiBpdGVtLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgV2hhdCBzaG91bGQgd2UgZG8gd2hlbiB3ZSBnZXQgdGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gc2lnbmFsIE9iamVjdCAoc28gaXQncyBhIHJlZmVyZW5jZSkgdGhhdCB3ZSB1c2UgdG8ga25vdyB3aGVuIHRoZSBjYWxsYmFjayByZXR1cm5lZCBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucHJlb3JkZXJUcmF2ZXJzYWxBdXggPSBmdW5jdGlvbiAodHJlZSwgY2FsbGJhY2ssIHNpZ25hbCkge1xyXG4gICAgICAgIGlmICghdHJlZSB8fCBzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHNpZ25hbC5zdG9wID0gKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcmVvcmRlclRyYXZlcnNhbEF1eCh0cmVlLmxlZnQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5yaWdodCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayB3aGVuIHBhc3NpbmcgKHBhc3MgdW5kZXIgdGhlIGl0ZW0pIGFuIGl0ZW1cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuaW5vcmRlclRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykgeyB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodGhpcy5fcm9vdCwgY2FsbGJhY2ssIHsgc3RvcDogZmFsc2UgfSk7IH07XHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlIHRoZSB0cmVlIGFuZCBleGVjdXRlIGNhbGxiYWNrIHdoZW4gcGFzc2luZyAocGFzcyB1bmRlciB0aGUgaXRlbSkgYW4gaXRlbVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgV2hhdCBzaG91bGQgd2UgZG8gd2hlbiB3ZSBnZXQgdGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gc2lnbmFsIE9iamVjdCAoc28gaXQncyBhIHJlZmVyZW5jZSkgdGhhdCB3ZSB1c2UgdG8ga25vdyB3aGVuIHRoZSBjYWxsYmFjayByZXR1cm5lZCBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuaW5vcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uICh0cmVlLCBjYWxsYmFjaywgc2lnbmFsKSB7XHJcbiAgICAgICAgaWYgKCF0cmVlIHx8IHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsQXV4KHRyZWUubGVmdCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgc2lnbmFsLnN0b3AgPSAoY2FsbGJhY2sodHJlZS52YWx1ZSkgPT09IGZhbHNlKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5yaWdodCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayB3aGVuIGxlYXZpbmcgKHBhc3Npbmcgb24gdGhlIHJpZ2h0IHNpZGUgb2YpIGFuIGl0ZW1cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucG9zdG9yZGVyVHJhdmVyc2FsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7IHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayB3aGVuIHBhc3NpbmcgKHBhc3MgdW5kZXIgdGhlIGl0ZW0pIGFuIGl0ZW1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0gdHJlZSBXaGljaCBUcmVlTm9kZSB3ZSdyZSB0cmF2ZXJzaW5nLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICogQHBhcmFtIHNpZ25hbCBPYmplY3QgKHNvIGl0J3MgYSByZWZlcmVuY2UpIHRoYXQgd2UgdXNlIHRvIGtub3cgd2hlbiB0aGUgY2FsbGJhY2sgcmV0dXJuZWQgZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLnBvc3RvcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uICh0cmVlLCBjYWxsYmFjaywgc2lnbmFsKSB7XHJcbiAgICAgICAgaWYgKCF0cmVlIHx8IHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wb3N0b3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5sZWZ0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnBvc3RvcmRlclRyYXZlcnNhbEF1eCh0cmVlLnJpZ2h0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBzaWduYWwuc3RvcCA9IChjYWxsYmFjayh0cmVlLnZhbHVlKSA9PT0gZmFsc2UpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgb25lIGxldmVsIGF0IGEgdGltZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayBvbiBlYWNoIGFuIGl0ZW1cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubGV2ZWxUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5sZXZlbFRyYXZlcnNhbEF1eCh0aGlzLl9yb290LCBjYWxsYmFjaywgeyBzdG9wOiBmYWxzZSB9KTsgfTtcclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgb25lIGxldmVsIGF0IGEgdGltZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayBvbiBlYWNoIGFuIGl0ZW1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0gdHJlZSBXaGljaCBUcmVlTm9kZSB3ZSdyZSB0cmF2ZXJzaW5nLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICogQHBhcmFtIHNpZ25hbCBPYmplY3QgKHNvIGl0J3MgYSByZWZlcmVuY2UpIHRoYXQgd2UgdXNlIHRvIGtub3cgd2hlbiB0aGUgY2FsbGJhY2sgcmV0dXJuZWQgZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmxldmVsVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICB2YXIgcXVldWUgPSBuZXcgcXVldWVfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKHRyZWUpXHJcbiAgICAgICAgICAgIHF1ZXVlLmVucXVldWUodHJlZSk7XHJcbiAgICAgICAgd2hpbGUgKCFVdGlsLmlzVW5kZWZpbmVkKHRyZWUgPSBxdWV1ZS5kZXF1ZXVlKCkpKSB7XHJcbiAgICAgICAgICAgIHNpZ25hbC5zdG9wID0gc2lnbmFsLnN0b3AgfHwgKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHRyZWUubGVmdClcclxuICAgICAgICAgICAgICAgIHF1ZXVlLmVucXVldWUodHJlZS5sZWZ0KTtcclxuICAgICAgICAgICAgaWYgKHRyZWUucmlnaHQpXHJcbiAgICAgICAgICAgICAgICBxdWV1ZS5lbnF1ZXVlKHRyZWUucmlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgbWluaW11bSB2YWx1ZSBpbiB0aGUgdHJlZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtaW4gPSB0aGlzLm1pbkF1eCh0aGlzLl9yb290KTtcclxuICAgICAgICBpZiAobWluKVxyXG4gICAgICAgICAgICByZXR1cm4gbWluLnZhbHVlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtaW5pbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLm1pbkF1eCA9IGZ1bmN0aW9uICh0cmVlKSB7XHJcbiAgICAgICAgaWYgKHRyZWUubGVmdClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWluQXV4KHRyZWUubGVmdCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdHJlZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgbWF4aW11bSB2YWx1ZSBpbiB0aGUgdHJlZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtYXggPSB0aGlzLm1heEF1eCh0aGlzLl9yb290KTtcclxuICAgICAgICBpZiAobWF4KVxyXG4gICAgICAgICAgICByZXR1cm4gbWF4LnZhbHVlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtYXhpbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLm1heEF1eCA9IGZ1bmN0aW9uICh0cmVlKSB7XHJcbiAgICAgICAgaWYgKHRyZWUucmlnaHQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1heEF1eCh0cmVlLnJpZ2h0KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0cmVlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBkZXB0aCBvZiBhIHRyZWUuXHJcbiAgICAgKiAtMSA9IEVtcHR5XHJcbiAgICAgKiAwID0gT25seSByb290XHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmRlcHRoID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5kZXB0aEF1eCh0aGlzLl9yb290KTsgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtaW5pbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICogLTEgPSBFbXB0eVxyXG4gICAgICogMCA9IE9ubHkgcm9vdFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmRlcHRoQXV4ID0gZnVuY3Rpb24gKHRyZWUpIHtcclxuICAgICAgICBpZiAoIXRyZWUpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5kZXB0aEF1eCh0cmVlLmxlZnQpLCB0aGlzLmRlcHRoQXV4KHRyZWUucmlnaHQpKSArIDE7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZWFyY2ggdGhlIHRyZWUgZm9yIGEgc3BlY2lmaWMgaXRlbS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0gdHJlZSBXaGljaCBUcmVlTm9kZSB3ZSdyZSB0cmF2ZXJzaW5nLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuX3NlYXJjaCA9IGZ1bmN0aW9uICh0cmVlLCBpdGVtKSB7XHJcbiAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQodHJlZSkpXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRyZWUudmFsdWUgPT09IGl0ZW0pXHJcbiAgICAgICAgICAgIHJldHVybiB0cmVlO1xyXG4gICAgICAgIHZhciBjb21wID0gVXRpbC5kZWZhdWx0Q29tcGFyZXIodGhpcy5fc2VsZWN0b3IoaXRlbSksIHRoaXMuX3NlbGVjdG9yKHRyZWUudmFsdWUpKTtcclxuICAgICAgICBpZiAoY29tcCA8IDApIHtcclxuICAgICAgICAgICAgdHJlZSA9IHRoaXMuX3NlYXJjaCh0cmVlLmxlZnQsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb21wID4gMCkge1xyXG4gICAgICAgICAgICB0cmVlID0gdGhpcy5fc2VhcmNoKHRyZWUucmlnaHQsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJlZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQmluYXJ5VHJlZTtcclxufSgpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gQmluYXJ5VHJlZTtcclxudmFyIFRyZWVOb2RlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFRyZWVOb2RlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiB0aGUgbm9kZSBoYXMgbmVpdGhlciBhIHJpZ2h0IG9yIGxlZnQgY2hpbGQuXHJcbiAgICAgKi9cclxuICAgIFRyZWVOb2RlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gIXRoaXMubGVmdCAmJiAhdGhpcy5yaWdodDsgfTtcclxuICAgIHJldHVybiBUcmVlTm9kZTtcclxufSgpKTtcclxuZXhwb3J0cy5UcmVlTm9kZSA9IFRyZWVOb2RlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1iaW5hcnlUcmVlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiBSZXByZXNlbnQgYSBkb3VibHktbGlua2VkIGxpc3QgaW4gd2hpY2ggeW91IGNhbiBhZGQgYW5kIHJlbW92ZSBpdGVtcy5cclxuICovXHJcbnZhciBMaW5rZWRMaXN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGl0ZW1zIFRbXSBJdGVtcyB0byBzdGFydCBmaWxsaW5nIHRoZSBzdGFjayB3aXRoLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBMaW5rZWRMaXN0KGl0ZW1zKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgaWYgKGl0ZW1zKVxyXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7IF90aGlzLmluc2VydCh4KTsgfSk7XHJcbiAgICB9XHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5fZ2V0Tm9kZSA9IGZ1bmN0aW9uIChhdCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBlbHNlIGlmIChhdCA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmlyc3Q7XHJcbiAgICAgICAgZWxzZSBpZiAoYXQgPiB0aGlzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3Q7XHJcbiAgICAgICAgdmFyIGksIG5vZGU7XHJcbiAgICAgICAgaWYgKGF0IDwgdGhpcy5sZW5ndGggLyAyKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIGZldGNoaW5nIGZyb20gZmlyc3QgaGFsZiBvZiBsaXN0LCBzdGFydCBmcm9tIHRoZSBiZWdpbm5pbmdcclxuICAgICAgICAgICAgbm9kZSA9IHRoaXMuX2ZpcnN0O1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gaWYgZmV0Y2hpbmcgZnJvbSBsYXN0IGhhbGYgb2YgbGlzdCwgc3RhcnQgZnJvbSB0aGUgZW5kXHJcbiAgICAgICAgICAgIG5vZGUgPSB0aGlzLl9sYXN0O1xyXG4gICAgICAgICAgICBmb3IgKGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPiBhdDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5wcmV2O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFuIGl0ZW0gYXQgYSBjZXJ0YWluIHBvc2l0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoYXQpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2dldE5vZGUoYXQpO1xyXG4gICAgICAgIGlmIChub2RlKVxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS52YWw7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYW4gaXRlbSBhdCB0aGUgZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHZhciBub2RlID0gbmV3IExpbmtlZExpc3ROb2RlKGl0ZW0pO1xyXG4gICAgICAgIGlmICghdGhpcy5fZmlyc3QpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLl9sYXN0ID0gbm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG5vZGUucHJldiA9IHRoaXMuX2xhc3Q7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3QubmV4dCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3QgPSBub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKyt0aGlzLmxlbmd0aDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEluc2VydCBhbiBpdGVtIGF0IGEgY2VydGFpbiBwb3NpdGlvbiBpbiB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuaW5zZXJ0QXQgPSBmdW5jdGlvbiAoYXQsIGl0ZW0pIHtcclxuICAgICAgICBpZiAoYXQgPj0gdGhpcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydChpdGVtKTtcclxuICAgICAgICB2YXIgbm9kZSA9IG5ldyBMaW5rZWRMaXN0Tm9kZShpdGVtKSwgbmV4dCA9IHRoaXMuX2dldE5vZGUoYXQpLCBwcmV2ID0gbmV4dC5wcmV2O1xyXG4gICAgICAgIGlmIChwcmV2KVxyXG4gICAgICAgICAgICBwcmV2Lm5leHQgPSBub2RlO1xyXG4gICAgICAgIG5leHQucHJldiA9IG5vZGU7XHJcbiAgICAgICAgbm9kZS5wcmV2ID0gcHJldjtcclxuICAgICAgICBub2RlLm5leHQgPSBuZXh0O1xyXG4gICAgICAgIGlmIChhdCA9PT0gMClcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSBub2RlO1xyXG4gICAgICAgIHJldHVybiArK3RoaXMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhIGNlcnRhaW4gcG9zaXRpb24gaW4gdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLnJlbW92ZUF0ID0gZnVuY3Rpb24gKGF0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2dldE5vZGUoYXQpO1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAvLyBvbmx5IDEgaXRlbSBsZWZ0IHRvIHJlbW92ZS5cclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLl9sYXN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChub2RlID09PSB0aGlzLl9maXJzdCkge1xyXG4gICAgICAgICAgICAvLyByZW1vdmluZyB0aGUgZmlyc3QgaXRlbS5cclxuICAgICAgICAgICAgbm9kZS5uZXh0LnByZXYgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0ID0gbm9kZS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChub2RlID09PSB0aGlzLl9sYXN0KSB7XHJcbiAgICAgICAgICAgIC8vIHJlbW92aW5nIHRoZSBsYXN0IGl0ZW0uXHJcbiAgICAgICAgICAgIG5vZGUucHJldi5uZXh0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0ID0gbm9kZS5wcmV2O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcmVtb3ZpbmcgaXRlbSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBsaXN0XHJcbiAgICAgICAgICAgIG5vZGUucHJldi5uZXh0ID0gbm9kZS5uZXh0O1xyXG4gICAgICAgICAgICBub2RlLm5leHQucHJldiA9IG5vZGUucHJldjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0tdGhpcy5sZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX2ZpcnN0ID0gdGhpcy5fbGFzdCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpbmtlZExpc3Q7XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IExpbmtlZExpc3Q7XHJcbnZhciBMaW5rZWRMaXN0Tm9kZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMaW5rZWRMaXN0Tm9kZSh2YWwpIHtcclxuICAgICAgICB0aGlzLnZhbCA9IHZhbDtcclxuICAgIH1cclxuICAgIHJldHVybiBMaW5rZWRMaXN0Tm9kZTtcclxufSgpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlua2VkTGlzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgTGlzdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBuZXcgbGlzdCBvYmplY3QuXHJcbiAgICAgKiBVdGlsaXplcyBhIG5vcm1hbCBhcnJheSBiZWhpbmQgdGhlIHNjZW5lcyBhbmQgbmF0aXZlIGZ1bmN0aW9ucyB3aGVuZXZlciBwb3NzaWJsZSxcclxuICAgICAqIGJ1dCB3aXRoIGZ1bmN0aW9ucyBrbm93biBmb3IgYSBMaXN0LlxyXG4gICAgICogQHBhcmFtIHNvdXJjZSBUaGUgc291cmNlIGFycmF5IGZyb20gd2hpY2ggdG8gY3JlYXRlIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBMaXN0KHNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZSB8fCBbXTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShMaXN0LnByb3RvdHlwZSwgXCJsZW5ndGhcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fc291cmNlLmxlbmd0aDsgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgbGlzdCBhcyBhIGFycmF5LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2U7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGFuIG9iamVjdCB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGl0ZW0gVGhlIG9iamVjdCB0byBiZSBhZGRlZCB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QuYWRkID0gZnVuY3Rpb24gKHNvdXJjZSwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmFkZChpdGVtKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BlY2lmaWVkIGNvbGxlY3Rpb24gdG8gdGhlIGVuZCBvZiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHdob3NlIGVsZW1lbnRzIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5hZGRSYW5nZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gKGNvbGxlY3Rpb24gaW5zdGFuY2VvZiBMaXN0KSA/IGNvbGxlY3Rpb24udG9BcnJheSgpIDogY29sbGVjdGlvbjtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLl9zb3VyY2UsIGl0ZW1zKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LmFkZFJhbmdlID0gZnVuY3Rpb24gKHNvdXJjZSwgY29sbGVjdGlvbikge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmFkZFJhbmdlKGNvbGxlY3Rpb24pLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvLyAvKipcclxuICAgIC8vICAqIFJldHVybnMgYSBuZXcgcmVhZCBvbmx5IGluc3RhbmNlIG9mIHRoZSBsaXN0LlxyXG4gICAgLy8gICovXHJcbiAgICAvLyBhc1JlYWRPbmx5KCk6IExpc3Q8VD4ge1xyXG4gICAgLy8gICAgIHJldHVybiBuZXcgTGlzdChPYmplY3QuZnJlZXplKHRoaXMuX3NvdXJjZS5zbGljZSgpKSk7XHJcbiAgICAvLyB9XHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIHRoZSBzcGVjaWZpZWQgYWN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UuZm9yRWFjaChjYWxsYmFjayk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5mb3JFYWNoID0gZnVuY3Rpb24gKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBuZXcgTGlzdChzb3VyY2UpLmZvckVhY2goY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU2VhcmNoZXMgZm9yIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGFuZCByZXR1cm5zIHRoZSB6ZXJvLWJhc2VkIGluZGV4IG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIHdpdGhpbiB0aGUgc3BlY2lmaWVkIHJhbmdlIG9mIGVsZW1lbnRzIGluIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGl0ZW0gVGhlIG9iamVjdCB0byBsb2NhdGUgaW4gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHNlYXJjaC5cclxuICAgICAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBzZWN0aW9uIHRvIHNlYXJjaC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIChpdGVtLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHZvaWQgMCkgeyBpbmRleCA9IDA7IH1cclxuICAgICAgICBpZiAoY291bnQgPT09IHZvaWQgMCkgeyBjb3VudCA9IHRoaXMubGVuZ3RoOyB9XHJcbiAgICAgICAgdmFyIGlkeCA9IHRoaXMuX3NvdXJjZS5pbmRleE9mKGl0ZW0sIGluZGV4KTtcclxuICAgICAgICBpZiAoaWR4ID4gY291bnQgLSBpbmRleCArIDEpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gaWR4O1xyXG4gICAgfTtcclxuICAgIExpc3QuaW5kZXhPZiA9IGZ1bmN0aW9uIChzb3VyY2UsIGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gMDsgfVxyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gc291cmNlLmxlbmd0aDsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmluZGV4T2YoaXRlbSwgaW5kZXgsIGNvdW50KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNlYXJjaGVzIGZvciB0aGUgc3BlY2lmaWVkIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgemVyby1iYXNlZCBpbmRleCBvZiB0aGUgbGFzdCBvY2N1cnJlbmNlIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgZWxlbWVudHMgaW4gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBzdGFydGluZyBpbmRleCBvZiB0aGUgYmFja3dhcmQgc2VhcmNoLlxyXG4gICAgICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIHNlY3Rpb24gdG8gc2VhcmNoLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIChpdGVtLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHZvaWQgMCkgeyBpbmRleCA9IHRoaXMubGVuZ3RoIC0gMTsgfVxyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gdGhpcy5sZW5ndGg7IH1cclxuICAgICAgICB2YXIgaWR4ID0gdGhpcy5fc291cmNlLmxhc3RJbmRleE9mKGl0ZW0sIGluZGV4KTtcclxuICAgICAgICBpZiAoaWR4IDwgaW5kZXggKyAxIC0gY291bnQpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gaWR4O1xyXG4gICAgfTtcclxuICAgIExpc3QubGFzdEluZGV4T2YgPSBmdW5jdGlvbiAoc291cmNlLCBpdGVtLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHZvaWQgMCkgeyBpbmRleCA9IHNvdXJjZS5sZW5ndGggLSAxOyB9XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSBzb3VyY2UubGVuZ3RoOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkubGFzdEluZGV4T2YoaXRlbSwgaW5kZXgsIGNvdW50KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEluc2VydHMgYW4gZWxlbWVudCBpbnRvIHRoZSBsaXN0IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgaW5kZXggYXQgd2hpY2ggaXRlbSBzaG91bGQgYmUgaW5zZXJ0ZWQuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIGluc2VydC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgMCwgaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5pbnNlcnQgPSBmdW5jdGlvbiAoc291cmNlLCBpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmluc2VydChpbmRleCwgaXRlbSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0cyB0aGUgZWxlbWVudHMgb2YgYSBjb2xsZWN0aW9uIGludG8gdGhlIGxpc3QgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBpbmRleCBhdCB3aGljaCB0aGUgbmV3IGVsZW1lbnRzIHNob3VsZCBiZSBpbnNlcnRlZC5cclxuICAgICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHdob3NlIGVsZW1lbnRzIHNob3VsZCBiZSBpbnNlcnRlZCBpbnRvIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5pbnNlcnRSYW5nZSA9IGZ1bmN0aW9uIChpbmRleCwgY29sbGVjdGlvbikge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IChjb2xsZWN0aW9uIGluc3RhbmNlb2YgTGlzdCkgPyBjb2xsZWN0aW9uLnRvQXJyYXkoKSA6IGNvbGxlY3Rpb247XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0aGlzLl9zb3VyY2UsIG5ldyBBcnJheShpbmRleCwgMCkuY29uY2F0KGl0ZW1zKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5pbnNlcnRSYW5nZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4LCBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuaW5zZXJ0UmFuZ2UoaW5kZXgsIGNvbGxlY3Rpb24pLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBHZXRzIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VbaW5kZXhdO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxyXG4gICAgICogQHBhcmFtIGluZGV4IFNldHMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqIEBwYXJhbSBpdGVtIFRoZSBvYmplY3QgdG8gc2V0IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIGlmIChpbmRleCA+IHRoaXMubGVuZ3RoKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbmRleCB3YXMgb3V0IG9mIHJhbmdlLiBNdXN0IGJlIG5vbi1uZWdhdGl2ZSBhbmQgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBjb2xsZWN0aW9uLlwiKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZVtpbmRleF0gPSBpdGVtO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhIHNwZWNpZmljIG9iamVjdCBmcm9tIHRoZSBMaXN0KE9m4oCCVCkuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIHJlbW92ZSBmcm9tIHRoZSBMaXN0KE9m4oCCVCkuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQXQodGhpcy5fc291cmNlLmluZGV4T2YoaXRlbSkpO1xyXG4gICAgfTtcclxuICAgIExpc3QucmVtb3ZlID0gZnVuY3Rpb24gKHNvdXJjZSwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLnJlbW92ZShpdGVtKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBtYXRjaCB0aGUgY29uZGl0aW9ucyBkZWZpbmVkIGJ5IHRoZSBzcGVjaWZpZWQgcHJlZGljYXRlLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBUaGUgcHJlZGljYXRlIGRlbGVnYXRlIHRoYXQgZGVmaW5lcyB0aGUgY29uZGl0aW9ucyBvZiB0aGUgZWxlbWVudHMgdG8gcmVtb3ZlLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5yZW1vdmVBbGwgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKCFwcmVkaWNhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZSgwKTsgLy8gc3BsaWNlIHJhdGhlciB0aGFuIHJldHVybmluZyBhbiBlbXB0eSBhcnJheSBsZXQncyB1cyBrZWVwIHRoZSByZWZlcmVuY2VcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gdm9pZCAwO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWRpY2F0ZSh0aGlzLl9zb3VyY2VbaV0sIGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZW1vdmVBbGwgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZW1vdmVBbGwocHJlZGljYXRlKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXggb2YgdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgaW5kZXggb2YgdGhlIGVsZW1lbnQgdG8gcmVtb3ZlLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5yZW1vdmVBdCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4IG9mIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSB6ZXJvLWJhc2VkIGluZGV4IG9mIHRoZSBlbGVtZW50IHRvIHJlbW92ZS5cclxuICAgICAqL1xyXG4gICAgTGlzdC5yZW1vdmVBdCA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlQXQoaW5kZXgpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYSByYW5nZSBvZiBlbGVtZW50cyBmcm9tIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSB6ZXJvLWJhc2VkIHN0YXJ0aW5nIGluZGV4IG9mIHRoZSByYW5nZSBvZiBlbGVtZW50cyB0byByZW1vdmUuXHJcbiAgICAgKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZW1vdmUuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZVJhbmdlID0gZnVuY3Rpb24gKGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5zcGxpY2UoaW5kZXgsIGNvdW50ICsgaW5kZXggLSAxKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnJlbW92ZVJhbmdlID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlUmFuZ2UoaW5kZXgsIGNvdW50KS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBlbGVtZW50cyBmcm9tIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUFsbCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QuY2xlYXIgPSBmdW5jdGlvbiAoc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuY2xlYXIoKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbnVtYmVyIHRoYXQgcmVwcmVzZW50cyBob3cgbWFueSBlbGVtZW50cyBpbiB0aGUgc3BlY2lmaWVkIHNlcXVlbmNlIHNhdGlzZnkgYSBjb25kaXRpb24uXHJcbiAgICAgKiBJZiBwcmVkaWNhdGUgaXMgb21pdHRlZCwgdGhlIGZ1bGwgc2l6ZSBvZiB0aGUgbGlzdCB3aWxsIGJlIHJldHVybmVkLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuY291bnQgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKCFwcmVkaWNhdGUpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2UubGVuZ3RoO1xyXG4gICAgICAgIHZhciBzdW0gPSAwO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICBzdW0rKztcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgfTtcclxuICAgIExpc3QuY291bnQgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5jb3VudChwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV2ZXJzZXMgdGhlIG9yZGVyIG9mIHRoZSBlbGVtZW50cyBpbiB0aGUgc3BlY2lmaWVkIHJhbmdlLlxyXG4gICAgICogSWYgaW5kZXggYW5kIGNvdW50IGlzIG9taXR0ZWQgdGhlIGVudGlyZSBsaXN0IHdpbGwgYmUgcmV2ZXJzZWQuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHJhbmdlIHRvIHJldmVyc2UuXHJcbiAgICAgKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgcmFuZ2UgdG8gcmV2ZXJzZS4gSWYgbm90IHByb3ZpZGVkIGl0IHdpbGwgZGVmYXVsdCB0byBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbiAoaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgaWYgKChVdGlsLmlzVW5kZWZpbmVkKGluZGV4KSAmJiBVdGlsLmlzVW5kZWZpbmVkKGNvdW50KSkgfHwgKGluZGV4ID09PSAwICYmIGNvdW50ID49IHRoaXMubGVuZ3RoKSkge1xyXG4gICAgICAgICAgICAvLyByZXZlcnNlIHRoZSBlbnRpcmUgbGlzdFxyXG4gICAgICAgICAgICB0aGlzLl9zb3VyY2UucmV2ZXJzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQoY291bnQpKVxyXG4gICAgICAgICAgICAgICAgY291bnQgPSB0aGlzLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuX3NvdXJjZS5zcGxpY2UoaW5kZXgsIGNvdW50ICsgaW5kZXggLSAxKTtcclxuICAgICAgICAgICAgYXJyLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRSYW5nZShpbmRleCwgYXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZXZlcnNlID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmV2ZXJzZShpbmRleCwgY291bnQpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnJhbmdlID0gZnVuY3Rpb24gKHN0YXJ0LCBjb3VudCkge1xyXG4gICAgICAgIHZhciBhcnIgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBzdGFydCArIGNvdW50OyBpKyspXHJcbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChhcnIpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaXN0O1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBMaXN0O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saXN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5rZWRMaXN0XzEgPSByZXF1aXJlKFwiLi9saW5rZWRMaXN0XCIpO1xyXG4vKipcclxuICogQSBTdGFjayB3b3JrcyBieSBmaXJzdCBpbiwgZmlyc3Qgb3V0LlxyXG4gKi9cclxudmFyIFF1ZXVlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGl0ZW1zIFRbXSBJdGVtcyB0byBzdGFydCBmaWxsaW5nIHRoZSBzdGFjayB3aXRoLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBRdWV1ZShpdGVtcykge1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSBuZXcgbGlua2VkTGlzdF8xLmRlZmF1bHQoaXRlbXMpO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFF1ZXVlLnByb3RvdHlwZSwgXCJsZW5ndGhcIiwge1xyXG4gICAgICAgIC8qKiBHZXQgdGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGUgcXVldWUgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2xpc3QubGVuZ3RoOyB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIDtcclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhbiBpdGVtIHRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlLlxyXG4gICAgICovXHJcbiAgICBRdWV1ZS5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9saXN0Lmluc2VydCh2YWwpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0Lmxlbmd0aDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldHMgYW5kIHJlbW92ZSBhbiBpdGVtIGZyb20gdGhlIGhlYWQgb2YgdGhlIHF1ZXVlLlxyXG4gICAgICovXHJcbiAgICBRdWV1ZS5wcm90b3R5cGUuZGVxdWV1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2xpc3QuZ2V0KDApO1xyXG4gICAgICAgIHRoaXMuX2xpc3QucmVtb3ZlQXQoMCk7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFF1ZXVlO1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBRdWV1ZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cXVldWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbmtlZExpc3RfMSA9IHJlcXVpcmUoXCIuL2xpbmtlZExpc3RcIik7XHJcbi8qKlxyXG4gKiBBIFN0YWNrIHdvcmtzIGJ5IGxhc3QgaW4sIGZpcnN0IG91dC5cclxuICovXHJcbnZhciBTdGFjayA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBpdGVtcyBUW10gSXRlbXMgdG8gc3RhcnQgZmlsbGluZyB0aGUgc3RhY2sgd2l0aC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gU3RhY2soaXRlbXMpIHtcclxuICAgICAgICB0aGlzLl9saXN0ID0gbmV3IGxpbmtlZExpc3RfMS5kZWZhdWx0KGl0ZW1zKTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGFjay5wcm90b3R5cGUsIFwibGVuZ3RoXCIsIHtcclxuICAgICAgICAvKiogR2V0IHRoZSBudW1iZXIgb2YgaXRlbXMgaW4gdGhlIHN0YWNrICovXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9saXN0Lmxlbmd0aDsgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICA7XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gaXRlbSB0byB0aGUgdG9wIG9mIHRoZSBzdGFjay5cclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QuaW5zZXJ0QXQoMCwgaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3QubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFuZCByZW1vdmUgYW4gaXRlbSBmcm9tIHRoZSB0b3Agb2YgdGhlIHN0YWNrLlxyXG4gICAgICovXHJcbiAgICBTdGFjay5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5wZWVrKCk7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5yZW1vdmVBdCgwKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbiBpdGVtIGZyb20gdGhlIHRvcCBvZiB0aGUgc3RhY2sgd2l0aG91dCByZW1vdmluZyBpdC5cclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3QuZ2V0KDApO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgdGhlIHN0YWNrXHJcbiAgICAgKi9cclxuICAgIFN0YWNrLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9saXN0LmNsZWFyKCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFN0YWNrO1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBTdGFjaztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhY2suanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxuLyoqXHJcbiAqIFNob3J0aGFuZCBmdW5jdGlvbiB0byBjcmVhdGUgYSBEYXRlc0hlbHBlciBvYmplY3QuXHJcbiAqIEBwYXJhbSBudW1iZXIgVGhlIGRhdGUgb24gd2hpY2ggdG8gcGVyZm9ybSB0aGUgdmFyaW91cyBmdW5jdGlvbnMuXHJcbiAqL1xyXG5mdW5jdGlvbiBEYXRlcyhkYXRlKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSk7IH1cclxuZXhwb3J0cy5kZWZhdWx0ID0gRGF0ZXM7XHJcbnZhciBEYXRlc0hlbHBlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBEYXRlc0hlbHBlcihkYXRlKSB7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZTtcclxuICAgIH1cclxuICAgIERhdGVzSGVscGVyLnRvRGF0ZSA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQoZGF0ZSkpXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGlmIChVdGlsLmlzU3RyaW5nKGRhdGUpKVxyXG4gICAgICAgICAgICBkYXRlID0gRGF0ZS5wYXJzZShkYXRlKTtcclxuICAgICAgICBpZiAoVXRpbC5pc051bWJlcihkYXRlKSlcclxuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3ZWl0aGVyIHRoZSBkYXRlIGlzIGluIGJldHdlZW4gdHdvIG51bWJlcnMuXHJcbiAgICAgKiBAcGFyYW0gbG93ZXIgVGhlIGxvd2VyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqIEBwYXJhbSB1cHBlciBUaGUgdXBwZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICovXHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYmV0d2VlbiA9IGZ1bmN0aW9uIChsb3dlciwgdXBwZXIpIHtcclxuICAgICAgICByZXR1cm4gRGF0ZXNIZWxwZXIuYmV0d2Vlbih0aGlzLmRhdGUsIGxvd2VyLCB1cHBlcik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdlaXRoZXIgYSBkYXRlIGlzIGluIGJldHdlZW4gdHdvIG51bWJlcnMuXHJcbiAgICAgKiBAcGFyYW0gZGF0ZSBUaGUgZGF0ZSB3aGljaCB0byBjb21wYXJlIHdpdGguXHJcbiAgICAgKiBAcGFyYW0gbG93ZXIgVGhlIGxvd2VyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqIEBwYXJhbSB1cHBlciBUaGUgdXBwZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICovXHJcbiAgICBEYXRlc0hlbHBlci5iZXR3ZWVuID0gZnVuY3Rpb24gKGRhdGUsIGxvd2VyLCB1cHBlcikge1xyXG4gICAgICAgIGlmIChVdGlsLmlzVW5kZWZpbmVkKGxvd2VyKSlcclxuICAgICAgICAgICAgbG93ZXIgPSBuZXcgRGF0ZSgwKTtcclxuICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZCh1cHBlcikpXHJcbiAgICAgICAgICAgIHVwcGVyID0gbmV3IERhdGUoOTk5OTk5OTk5OTk5OSk7XHJcbiAgICAgICAgcmV0dXJuIChsb3dlciA8PSBkYXRlICYmIGRhdGUgPD0gdXBwZXIpO1xyXG4gICAgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRZZWFycyA9IGZ1bmN0aW9uICh5ZWFycykgeyByZXR1cm4gdGhpcy5hZGRNb250aHMoeWVhcnMgKiAxMik7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkTW9udGhzID0gZnVuY3Rpb24gKG1vbnRocykge1xyXG4gICAgICAgIHRoaXMuZGF0ZS5zZXRNb250aCh0aGlzLmRhdGUuZ2V0TW9udGgoKSArIG1vbnRocyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZFdlZWtzID0gZnVuY3Rpb24gKHdlZWspIHsgcmV0dXJuIHRoaXMuYWRkRGF5cyh3ZWVrICogNyk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkRGF5cyA9IGZ1bmN0aW9uIChkYXlzKSB7IHJldHVybiB0aGlzLmFkZEhvdXJzKGRheXMgKiAyNCk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkSG91cnMgPSBmdW5jdGlvbiAoaG91cnMpIHsgcmV0dXJuIHRoaXMuYWRkTWludXRlcyhob3VycyAqIDYwKTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRNaW51dGVzID0gZnVuY3Rpb24gKG1pbnV0ZXMpIHsgcmV0dXJuIHRoaXMuYWRkU2Vjb25kcyhtaW51dGVzICogNjApOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZFNlY29uZHMgPSBmdW5jdGlvbiAoc2Vjb25kcykgeyByZXR1cm4gdGhpcy5hZGRNaWxsaXNlY29uZHMoc2Vjb25kcyAqIDEwMDApOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZE1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uIChtaWxsaXNlY29uZHMpIHtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0TWlsbGlzZWNvbmRzKHRoaXMuZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSArIG1pbGxpc2Vjb25kcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmlzVG9kYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZS50b0RhdGVTdHJpbmcoKSA9PT0gbmV3IERhdGUoKS50b0RhdGVTdHJpbmcoKTtcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUudG9NaWRuaWdodCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0SG91cnMoMCk7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNldE1pbnV0ZXMoMCk7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNldFNlY29uZHMoMCk7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNldE1pbGxpc2Vjb25kcygwKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRZZWFycyA9IGZ1bmN0aW9uIChkYXRlLCB5ZWFycykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZFllYXJzKHllYXJzKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkTW9udGhzID0gZnVuY3Rpb24gKGRhdGUsIG1vbnRocykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZE1vbnRocyhtb250aHMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRXZWVrcyA9IGZ1bmN0aW9uIChkYXRlLCB3ZWVrKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkV2Vla3Mod2VlaykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZERheXMgPSBmdW5jdGlvbiAoZGF0ZSwgZGF5cykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZERheXMoZGF5cykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZEhvdXJzID0gZnVuY3Rpb24gKGRhdGUsIGhvdXJzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkSG91cnMoaG91cnMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRNaW51dGVzID0gZnVuY3Rpb24gKGRhdGUsIG1pbnV0ZXMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRNaW51dGVzKG1pbnV0ZXMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRTZWNvbmRzID0gZnVuY3Rpb24gKGRhdGUsIHNlY29uZHMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRTZWNvbmRzKHNlY29uZHMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRNaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAoZGF0ZSwgbWlsbGlzZWNvbmRzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkTWlsbGlzZWNvbmRzKG1pbGxpc2Vjb25kcykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmlzVG9kYXkgPSBmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmlzVG9kYXkoKTsgfTtcclxuICAgIERhdGVzSGVscGVyLnRvTWlkbmlnaHQgPSBmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLnRvTWlkbmlnaHQoKS5kYXRlOyB9O1xyXG4gICAgcmV0dXJuIERhdGVzSGVscGVyO1xyXG59KCkpO1xyXG5leHBvcnRzLkRhdGVzSGVscGVyID0gRGF0ZXNIZWxwZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbi8qKlxyXG4gKiBTaG9ydGhhbmQgZnVuY3Rpb24gdG8gY3JlYXRlIGEgTnVtYmVyc0hlbHBlciBvYmplY3QuXHJcbiAqIEBwYXJhbSBudW1iZXIgVGhlIG51bWJlciBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICovXHJcbmZ1bmN0aW9uIE51bWJlcnMobnVtKSB7IHJldHVybiBuZXcgTnVtYmVyc0hlbHBlcihudW0pOyB9XHJcbmV4cG9ydHMuZGVmYXVsdCA9IE51bWJlcnM7XHJcbnZhciBOdW1iZXJzSGVscGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIE51bWJlcnNIZWxwZXIgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIG51bWJlciBUaGUgbnVtYmVyIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBOdW1iZXJzSGVscGVyKG51bSkge1xyXG4gICAgICAgIHRoaXMubnVtID0gbnVtO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdlaXRoZXIgdGhlIG51bWJlciBpcyBpbiBiZXR3ZWVuIHR3byBudW1iZXJzLlxyXG4gICAgICogQHBhcmFtIGxvd2VyIFRoZSBsb3dlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKiBAcGFyYW0gdXBwZXIgVGhlIHVwcGVyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqL1xyXG4gICAgTnVtYmVyc0hlbHBlci5wcm90b3R5cGUuYmV0d2VlbiA9IGZ1bmN0aW9uIChsb3dlciwgdXBwZXIpIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyc0hlbHBlci5iZXR3ZWVuKHRoaXMubnVtLCBsb3dlciwgdXBwZXIpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3ZWl0aGVyIGEgbnVtYmVyIGlzIGluIGJldHdlZW4gdHdvIG51bWJlcnMuXHJcbiAgICAgKiBAcGFyYW0gbnVtYmVyIFRoZSBudW1iZXIgd2hpY2ggdG8gY29tcGFyZSB3aXRoLlxyXG4gICAgICogQHBhcmFtIGxvd2VyIFRoZSBsb3dlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKiBAcGFyYW0gdXBwZXIgVGhlIHVwcGVyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqL1xyXG4gICAgTnVtYmVyc0hlbHBlci5iZXR3ZWVuID0gZnVuY3Rpb24gKG51bSwgbG93ZXIsIHVwcGVyKSB7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQobG93ZXIpKVxyXG4gICAgICAgICAgICBsb3dlciA9IE51bWJlci5NSU5fVkFMVUU7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQodXBwZXIpKVxyXG4gICAgICAgICAgICB1cHBlciA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgcmV0dXJuIChsb3dlciA8PSBudW0gJiYgbnVtIDw9IHVwcGVyKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2VpdGhlciB0aGUgbnVtYmVyIGlzIGluIGFuIGFycmF5LlxyXG4gICAgICogQHBhcmFtIG51bWJlcnMgVGhlIGFycmF5IG9mIG51bWJlcnMgdG8gY29tcGFyZSB3aXRoLlxyXG4gICAgICovXHJcbiAgICBOdW1iZXJzSGVscGVyLnByb3RvdHlwZS5pbiA9IGZ1bmN0aW9uIChudW1iZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcnNIZWxwZXIuaW4odGhpcy5udW0sIG51bWJlcnMpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3ZWl0aGVyIGEgbnVtYmVyIGlzIGluIGFuIGFycmF5LlxyXG4gICAgICogQHBhcmFtIG51bWJlciBUaGUgbnVtYmVyIHdoaWNoIHRvIGNvbXBhcmUgd2l0aC5cclxuICAgICAqIEBwYXJhbSBudW1iZXJzIFRoZSBhcnJheSBvZiBudW1iZXJzIHRvIGNvbXBhcmUgd2l0aC5cclxuICAgICAqL1xyXG4gICAgTnVtYmVyc0hlbHBlci5pbiA9IGZ1bmN0aW9uIChudW0sIG51bWJlcnMpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKG51bWJlcnNbaV0gPT0gbnVtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNhZmVseSByb3VuZCBudW1iZXJzIGluIEpTIHdpdGhvdXQgaGl0dGluZyBpbXByZWNpc2lvbnMgb2YgZmxvYXRpbmctcG9pbnQgYXJpdGhtZXRpY3NcclxuICAgICAqIEtpbmRseSBib3Jyb3dlZCBmcm9tIEFuZ3VsYXJKUzogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9ibG9iL2czX3YxXzMvc3JjL25nL2ZpbHRlci9maWx0ZXJzLmpzI0wxNzNcclxuICAgICAqIEBwYXJhbSBwcmVjaXNpb24gSG93IG1hbnkgZGVjaW1hbHMgdGhlIG51bWJlciBzaG91bGQgaGF2ZS5cclxuICAgICAqL1xyXG4gICAgTnVtYmVyc0hlbHBlci5wcm90b3R5cGUudG9GaXhlZCA9IGZ1bmN0aW9uIChwcmVjaXNpb24pIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyc0hlbHBlci50b0ZpeGVkKHRoaXMubnVtLCBwcmVjaXNpb24pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU2FmZWx5IHJvdW5kIG51bWJlcnMgaW4gSlMgd2l0aG91dCBoaXR0aW5nIGltcHJlY2lzaW9ucyBvZiBmbG9hdGluZy1wb2ludCBhcml0aG1ldGljc1xyXG4gICAgICogS2luZGx5IGJvcnJvd2VkIGZyb20gQW5ndWxhckpTOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvZzNfdjFfMy9zcmMvbmcvZmlsdGVyL2ZpbHRlcnMuanMjTDE3M1xyXG4gICAgICogQHBhcmFtIHByZWNpc2lvbiBIb3cgbWFueSBkZWNpbWFscyB0aGUgbnVtYmVyIHNob3VsZCBoYXZlLlxyXG4gICAgICovXHJcbiAgICBOdW1iZXJzSGVscGVyLnRvRml4ZWQgPSBmdW5jdGlvbiAobnVtLCBwcmVjaXNpb24pIHtcclxuICAgICAgICByZXR1cm4gKyhNYXRoLnJvdW5kKCsobnVtLnRvU3RyaW5nKCkgKyBcImVcIiArIHByZWNpc2lvbikpLnRvU3RyaW5nKCkgKyBcImVcIiArIC1wcmVjaXNpb24pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBOdW1iZXJzSGVscGVyO1xyXG59KCkpO1xyXG5leHBvcnRzLk51bWJlcnNIZWxwZXIgPSBOdW1iZXJzSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1udW1iZXJzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiBTaG9ydGhhbmQgZnVuY3Rpb24gdG8gY3JlYXRlIGEgU3RyaW5nc0hlbHBlciBvYmplY3QuXHJcbiAqIEBwYXJhbSBudW1iZXIgVGhlIHN0cmluZyBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICovXHJcbmZ1bmN0aW9uIFN0cmluZ3Moc3RyKSB7IHJldHVybiBuZXcgU3RyaW5nc0hlbHBlcihzdHIpOyB9XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFN0cmluZ3M7XHJcbnZhciBTdHJpbmdzSGVscGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIFN0cmluZ3NIZWxwZXIgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHN0ciBUaGUgc3RyaW5nIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBTdHJpbmdzSGVscGVyKHN0cikge1xyXG4gICAgICAgIHRoaXMuc3RyID0gc3RyO1xyXG4gICAgfVxyXG4gICAgU3RyaW5nc0hlbHBlci5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gU3RyaW5nc0hlbHBlci5mb3JtYXQuYXBwbHkodW5kZWZpbmVkLCBbdGhpcy5zdHJdLmNvbmNhdChhcmdzKSk7XHJcbiAgICB9O1xyXG4gICAgU3RyaW5nc0hlbHBlci5mb3JtYXQgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIlxcXFx7XCIgKyBpICsgXCJcXFxcfVwiLCBcImdcIik7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHJlZ2V4LCBhcmdzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU3RyaW5nc0hlbHBlcjtcclxufSgpKTtcclxuZXhwb3J0cy5TdHJpbmdzSGVscGVyID0gU3RyaW5nc0hlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RyaW5ncy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vLyBpbXBvcnQgXCIuLi9saW5xL2FkZC96aXBcIjtcclxuLyoqXHJcbiAqIFNob3J0aGFuZCBmdW5jdGlvbiB0byBjcmVhdGUgYSBVcmxIZWxwZXIgb2JqZWN0LlxyXG4gKiBAcGFyYW0gdXJsIFRoZSBVUkwgb24gd2hpY2ggdG8gcGVyZm9ybSB0aGUgdmFyaW91cyBmdW5jdGlvbnMuXHJcbiAqL1xyXG5mdW5jdGlvbiBVcmwodXJsKSB7XHJcbiAgICBpZiAodXJsID09PSB2b2lkIDApIHsgdXJsID0gbG9jYXRpb24uaHJlZjsgfVxyXG4gICAgcmV0dXJuIG5ldyBVcmxIZWxwZXIodXJsKTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBVcmw7XHJcbnZhciBVcmxIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgVXJsSGVscGVyIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB1cmwgVGhlIFVSTCBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVXJsSGVscGVyKHVybCkge1xyXG4gICAgICAgIGlmICh1cmwgPT09IHZvaWQgMCkgeyB1cmwgPSBsb2NhdGlvbi5ocmVmOyB9XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgYSBxdWVyeSBpbiB0aGUgVVJMLlxyXG4gICAgICogQHBhcmFtIHBhcmFtIFRoZSBuYW1lIG9mIHRoZSBxdWVyeSB0byBnZXQuXHJcbiAgICAgKi9cclxuICAgIFVybEhlbHBlci5wcm90b3R5cGUuc2VhcmNoID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgcmV0dXJuIFVybEhlbHBlci5zZWFyY2gocGFyYW0sIHRoaXMudXJsKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgYSBxdWVyeSBpbiB0aGUgVVJMLlxyXG4gICAgICogQHBhcmFtIHVybCBUaGUgVVJMIGZyb20gd2hpY2ggdG8gZ2V0IHRoZSBxdWVyeS5cclxuICAgICAqIEBwYXJhbSBwYXJhbSBUaGUgbmFtZSBvZiB0aGUgcXVlcnkgdG8gZ2V0LlxyXG4gICAgICovXHJcbiAgICBVcmxIZWxwZXIuc2VhcmNoID0gZnVuY3Rpb24gKHBhcmFtLCB1cmwpIHtcclxuICAgICAgICBpZiAodXJsID09PSB2b2lkIDApIHsgdXJsID0gbG9jYXRpb24uaHJlZjsgfVxyXG4gICAgICAgIHBhcmFtID0gcGFyYW0ucmVwbGFjZSgvW1xcW10vLCBcIlxcXFxbXCIpLnJlcGxhY2UoL1tcXF1dLywgXCJcXFxcXVwiKTtcclxuICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiW1xcXFw/Jl1cIiArIHBhcmFtICsgXCI9KFteJiNdKilcIiwgXCJpXCIpLCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwgfHwgbG9jYXRpb24uc2VhcmNoKTtcclxuICAgICAgICByZXR1cm4gIXJlc3VsdHMgPyBcIlwiIDogZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMV0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFVybEhlbHBlcjtcclxufSgpKTtcclxuZXhwb3J0cy5VcmxIZWxwZXIgPSBVcmxIZWxwZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXVybC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBhbGxfMSA9IHJlcXVpcmUoXCIuLi9vcGVyYXRvci9hbGxcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5hbGwgPSBhbGxfMS5hbGxQcm90bztcclxubGlucV8xLkxpbnEuYWxsID0gYWxsXzEuYWxsU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbGwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgYW55XzEgPSByZXF1aXJlKFwiLi4vb3BlcmF0b3IvYW55XCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuYW55ID0gYW55XzEuYW55UHJvdG87XHJcbmxpbnFfMS5MaW5xLmFueSA9IGFueV8xLmFueVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW55LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIGF2ZXJhZ2VfMSA9IHJlcXVpcmUoXCIuLi9vcGVyYXRvci9hdmVyYWdlXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuYXZlcmFnZSA9IGF2ZXJhZ2VfMS5hdmVyYWdlUHJvdG87XHJcbmxpbnFfMS5MaW5xLmF2ZXJhZ2UgPSBhdmVyYWdlXzEuYXZlcmFnZVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXZlcmFnZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBkaXN0aW5jdF8xID0gcmVxdWlyZShcIi4uL2l0ZXJhdG9yL2Rpc3RpbmN0XCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuZGlzdGluY3QgPSBkaXN0aW5jdF8xLmRpc3RpbmN0UHJvdG87XHJcbmxpbnFfMS5MaW5xLmRpc3RpbmN0ID0gZGlzdGluY3RfMS5kaXN0aW5jdFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlzdGluY3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgZXhjZXB0XzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3IvZXhjZXB0XCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuZXhjZXB0ID0gZXhjZXB0XzEuZXhjZXB0UHJvdG87XHJcbmxpbnFfMS5MaW5xLmV4Y2VwdCA9IGV4Y2VwdF8xLmV4Y2VwdFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXhjZXB0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIGZpbHRlcl8xID0gcmVxdWlyZShcIi4uL2l0ZXJhdG9yL2ZpbHRlclwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLmZpbHRlciA9IGZpbHRlcl8xLmZpbHRlclByb3RvO1xyXG5saW5xXzEuTGlucS5maWx0ZXIgPSBmaWx0ZXJfMS5maWx0ZXJTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBmaXJzdF8xID0gcmVxdWlyZShcIi4uL29wZXJhdG9yL2ZpcnN0XCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuZmlyc3QgPSBmaXJzdF8xLmZpcnN0UHJvdG87XHJcbmxpbnFfMS5MaW5xLmZpcnN0ID0gZmlyc3RfMS5maXJzdFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zmlyc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgZ3JvdXBCeV8xID0gcmVxdWlyZShcIi4uL2l0ZXJhdG9yL2dyb3VwQnlcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5ncm91cEJ5ID0gZ3JvdXBCeV8xLmdyb3VwQnlQcm90bztcclxubGlucV8xLkxpbnEuZ3JvdXBCeSA9IGdyb3VwQnlfMS5ncm91cEJ5U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1ncm91cEJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIGludGVyc2VjdF8xID0gcmVxdWlyZShcIi4uL2l0ZXJhdG9yL2ludGVyc2VjdFwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLmludGVyc2VjdCA9IGludGVyc2VjdF8xLmludGVyc2VjdFByb3RvO1xyXG5saW5xXzEuTGlucS5pbnRlcnNlY3QgPSBpbnRlcnNlY3RfMS5pbnRlcnNlY3RTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWludGVyc2VjdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBqb2luXzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3Ivam9pblwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLmpvaW4gPSBqb2luXzEuam9pblByb3RvO1xyXG5saW5xXzEuTGlucS5qb2luID0gam9pbl8xLmpvaW5TdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWpvaW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgbGFzdF8xID0gcmVxdWlyZShcIi4uL29wZXJhdG9yL2xhc3RcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5sYXN0ID0gbGFzdF8xLmxhc3RQcm90bztcclxubGlucV8xLkxpbnEubGFzdCA9IGxhc3RfMS5sYXN0U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1sYXN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIG1hcF8xID0gcmVxdWlyZShcIi4uL2l0ZXJhdG9yL21hcFwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLm1hcCA9IG1hcF8xLm1hcFByb3RvO1xyXG5saW5xXzEuTGlucS5tYXAgPSBtYXBfMS5tYXBTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBtYXhfMSA9IHJlcXVpcmUoXCIuLi9vcGVyYXRvci9tYXhcIik7XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5tYXggPSBtYXhfMS5tYXhQcm90bztcclxubGlucV8xLkxpbnEubWF4ID0gbWF4XzEubWF4U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgbWluXzEgPSByZXF1aXJlKFwiLi4vb3BlcmF0b3IvbWluXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUubWluID0gbWluXzEubWluUHJvdG87XHJcbmxpbnFfMS5MaW5xLm1pbiA9IG1pbl8xLm1pblN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWluLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIG9yZGVyQnlfMSA9IHJlcXVpcmUoXCIuLi9pdGVyYXRvci9vcmRlckJ5XCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUub3JkZXJCeSA9IG9yZGVyQnlfMS5vcmRlckJ5UHJvdG87XHJcbmxpbnFfMS5MaW5xLnByb3RvdHlwZS5vcmRlckJ5RGVzYyA9IG9yZGVyQnlfMS5vcmRlckJ5RGVzY1Byb3RvO1xyXG5saW5xXzEuTGlucS5vcmRlckJ5ID0gb3JkZXJCeV8xLm9yZGVyQnlTdGF0aWM7XHJcbmxpbnFfMS5MaW5xLm9yZGVyQnlEZXNjID0gb3JkZXJCeV8xLm9yZGVyQnlEZXNjU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1vcmRlckJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIHNpbmdsZV8xID0gcmVxdWlyZShcIi4uL29wZXJhdG9yL3NpbmdsZVwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLnNpbmdsZSA9IHNpbmdsZV8xLnNpbmdsZVByb3RvO1xyXG5saW5xXzEuTGlucS5zaW5nbGUgPSBzaW5nbGVfMS5zaW5nbGVTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNpbmdsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBza2lwXzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3Ivc2tpcFwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLnNraXAgPSBza2lwXzEuc2tpcFByb3RvO1xyXG5saW5xXzEuTGlucS5za2lwID0gc2tpcF8xLnNraXBTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNraXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgc2tpcFdoaWxlXzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3Ivc2tpcFdoaWxlXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUuc2tpcFdoaWxlID0gc2tpcFdoaWxlXzEuc2tpcFdoaWxlUHJvdG87XHJcbmxpbnFfMS5MaW5xLnNraXBXaGlsZSA9IHNraXBXaGlsZV8xLnNraXBXaGlsZVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcFdoaWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIHN1bV8xID0gcmVxdWlyZShcIi4uL29wZXJhdG9yL3N1bVwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLnN1bSA9IHN1bV8xLnN1bVByb3RvO1xyXG5saW5xXzEuTGlucS5zdW0gPSBzdW1fMS5zdW1TdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN1bS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciB0YWtlXzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3IvdGFrZVwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLnRha2UgPSB0YWtlXzEudGFrZVByb3RvO1xyXG5saW5xXzEuTGlucS50YWtlID0gdGFrZV8xLnRha2VTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgdGFrZVdoaWxlXzEgPSByZXF1aXJlKFwiLi4vaXRlcmF0b3IvdGFrZVdoaWxlXCIpO1xyXG5saW5xXzEuTGlucS5wcm90b3R5cGUudGFrZVdoaWxlID0gdGFrZVdoaWxlXzEudGFrZVdoaWxlUHJvdG87XHJcbmxpbnFfMS5MaW5xLnRha2VXaGlsZSA9IHRha2VXaGlsZV8xLnRha2VXaGlsZVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZVdoaWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIHppcF8xID0gcmVxdWlyZShcIi4uL2l0ZXJhdG9yL3ppcFwiKTtcclxubGlucV8xLkxpbnEucHJvdG90eXBlLnppcCA9IHppcF8xLnppcFByb3RvO1xyXG5saW5xXzEuTGlucS56aXAgPSB6aXBfMS56aXBTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXppcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgRGlzdGluY3RJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoRGlzdGluY3RJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIERpc3RpbmN0SXRlcmF0b3Ioc291cmNlLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5jb21wYXJlciA9IGNvbXBhcmVyO1xyXG4gICAgICAgIF90aGlzLl9wcmV2aW91c0l0ZW1zID0gW107XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgRGlzdGluY3RJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBycztcclxuICAgICAgICB3aGlsZSAoIShycyA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpKS5kb25lKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fcHJldmlvdXNJdGVtcy5zb21lKGZ1bmN0aW9uICh4KSB7IHJldHVybiBfdGhpcy5jb21wYXJlcih4LCBycy52YWx1ZSk7IH0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aW91c0l0ZW1zLnB1c2gocnMudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBEaXN0aW5jdEl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKSk7XHJcbmV4cG9ydHMuRGlzdGluY3RJdGVyYXRvciA9IERpc3RpbmN0SXRlcmF0b3I7XHJcbmZ1bmN0aW9uIGRpc3RpbmN0KHNvdXJjZSwgY29tcGFyZXIpIHtcclxuICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgcmV0dXJuIG5ldyBEaXN0aW5jdEl0ZXJhdG9yKHNvdXJjZSwgY29tcGFyZXIpO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIHVuaXF1ZSBpdGVtcyB0aGF0IGV4aXN0cyBvbmUgb3IgbW9yZSB0aW1lcyBpbiB0aGUgZGF0YXNldC5cclxuICovXHJcbmZ1bmN0aW9uIGRpc3RpbmN0UHJvdG8oY29tcGFyZXIpIHtcclxuICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgcmV0dXJuIHRoaXMubGlmdChkaXN0aW5jdCwgY29tcGFyZXIpO1xyXG59XHJcbmV4cG9ydHMuZGlzdGluY3RQcm90byA9IGRpc3RpbmN0UHJvdG87XHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIHVuaXF1ZSBpdGVtcyB0aGF0IGV4aXN0cyBvbmUgb3IgbW9yZSB0aW1lcyBpbiBhbnkgb2YgdGhlIGRhdGFzZXRzLlxyXG4gKiBAcGFyYW0gc291cmNlIFRoZSBkYXRhc2V0cyB0byBiZSBnZXQgZGlzdGluY3QgaXRlbXMgZnJvbS5cclxuICovXHJcbmZ1bmN0aW9uIGRpc3RpbmN0U3RhdGljKHNvdXJjZSwgY29tcGFyZXIpIHtcclxuICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgdmFyIGEgPSAoc291cmNlIGluc3RhbmNlb2YgbGlucV8xLkxpbnEpID8gc291cmNlLnRvQXJyYXkoKSA6IHNvdXJjZTtcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgIGEuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIGlmICghcmVzdWx0LnNvbWUoZnVuY3Rpb24gKHkpIHsgcmV0dXJuIGNvbXBhcmVyKHgsIHkpOyB9KSlcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goeCk7XHJcbiAgICAgICAgLy8gaWYgKHJlc3VsdC5pbmRleE9mKHgpID09PSAtMSkgXHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAvLyBsZXQgbGlzdHM6IEFycmF5PExpbnE+ID0gW10sIHJlc3VsdCA9IFtdO1xyXG4gICAgLy8gZGF0YXNldHMuZm9yRWFjaChkYXRhc2V0ID0+IHtcclxuICAgIC8vICAgICBsaXN0cy5wdXNoKChkYXRhc2V0IGluc3RhbmNlb2YgTGlucSkgPyBkYXRhc2V0IDogbmV3IExpbnEoVXRpbC5jYXN0PGFueVtdPihkYXRhc2V0KSkpO1xyXG4gICAgLy8gfSk7XHJcbiAgICAvLyBsaXN0cy5mb3JFYWNoKGxpc3QgPT4ge1xyXG4gICAgLy8gICAgIGxpc3QudG9BcnJheSgpLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAvLyAgICAgICAgIGlmIChyZXN1bHQuaW5kZXhPZihpdGVtKSA9PSAtMSlcclxuICAgIC8vICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gfSk7XHJcbiAgICAvLyByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmV4cG9ydHMuZGlzdGluY3RTdGF0aWMgPSBkaXN0aW5jdFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlzdGluY3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIEV4Y2VwdEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhFeGNlcHRJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEV4Y2VwdEl0ZXJhdG9yKHNvdXJjZSwgb3RoZXIsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmNvbXBhcmVyID0gY29tcGFyZXI7XHJcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpIHtcclxuICAgICAgICAgICAgX3RoaXMub3RoZXIgPSBvdGhlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIF90aGlzLm90aGVyID0gbmV3IGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKG90aGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgRXhjZXB0SXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgcnM7XHJcbiAgICAgICAgaWYgKCF0aGlzLm90aGVySXRlbXMpIHtcclxuICAgICAgICAgICAgdGhpcy5vdGhlckl0ZW1zID0gW107XHJcbiAgICAgICAgICAgIHdoaWxlICghKHJzID0gdGhpcy5vdGhlci5uZXh0KCkpLmRvbmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3RoZXJJdGVtcy5wdXNoKHJzLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAoIShycyA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpKS5kb25lKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vdGhlckl0ZW1zLnNvbWUoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIF90aGlzLmNvbXBhcmVyKHJzLnZhbHVlLCB4KTsgfSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBycztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBkb25lOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRXhjZXB0SXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpKTtcclxuZXhwb3J0cy5FeGNlcHRJdGVyYXRvciA9IEV4Y2VwdEl0ZXJhdG9yO1xyXG5mdW5jdGlvbiBleGNlcHQoc291cmNlLCBvdGhlciwgY29tcGFyZXIpIHtcclxuICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgcmV0dXJuIG5ldyBFeGNlcHRJdGVyYXRvcihzb3VyY2UsIG90aGVyLCBjb21wYXJlcik7XHJcbn1cclxuLyoqXHJcbiAqIEdldCBhIGxpc3Qgb2YgaXRlbXMgdGhhdCBvbmx5IGV4aXN0cyBpbiBvbmUgb2YgdGhlIGRhdGFzZXRzLlxyXG4gKiBAcGFyYW0gb3RoZXIgVGhlIG90aGVyIGRhdGFzZXQuXHJcbiAqL1xyXG5mdW5jdGlvbiBleGNlcHRQcm90byhvdGhlciwgY29tcGFyZXIpIHtcclxuICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgcmV0dXJuIHRoaXMubGlmdChleGNlcHQsIG90aGVyLCBjb21wYXJlcik7XHJcbn1cclxuZXhwb3J0cy5leGNlcHRQcm90byA9IGV4Y2VwdFByb3RvO1xyXG4vKipcclxuICogR2V0IGEgbGlzdCBvZiBpdGVtcyB0aGF0IG9ubHkgZXhpc3RzIGluIG9uZSBvZiB0aGUgZGF0YXNldHMuXHJcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBkYXRhc2V0LlxyXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIGRhdGFzZXQuXHJcbiAqL1xyXG5mdW5jdGlvbiBleGNlcHRTdGF0aWMoc291cmNlLCBvdGhlciwgY29tcGFyZXIpIHtcclxuICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgdmFyIGEgPSAoc291cmNlIGluc3RhbmNlb2YgbGlucV8xLkxpbnEpID8gc291cmNlLnRvQXJyYXkoKSA6IHNvdXJjZSwgYiA9IChvdGhlciBpbnN0YW5jZW9mIGxpbnFfMS5MaW5xKSA/IG90aGVyLnRvQXJyYXkoKSA6IG90aGVyO1xyXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgYS5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgaWYgKCFiLnNvbWUoZnVuY3Rpb24gKHkpIHsgcmV0dXJuIGNvbXBhcmVyKHgsIHkpOyB9KSlcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goeCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAvLyBsaXN0cy5wdXNoKChhIGluc3RhbmNlb2YgTGlucSkgPyBhLnRvQXJyYXkoKSA6IGEpO1xyXG4gICAgLy8gbGlzdHMucHVzaCgoYiBpbnN0YW5jZW9mIExpbnEpID8gYi50b0FycmF5KCkgOiBiKTtcclxuICAgIC8vIGxldCBsaXN0czogQXJyYXk8YW55W10+ID0gW10sIHJlc3VsdCA9IFtdO1xyXG4gICAgLy8gbGlzdHMucHVzaCgoYSBpbnN0YW5jZW9mIExpbnEpID8gYS50b0FycmF5KCkgOiBhKTtcclxuICAgIC8vIGxpc3RzLnB1c2goKGIgaW5zdGFuY2VvZiBMaW5xKSA/IGIudG9BcnJheSgpIDogYik7XHJcbiAgICAvLyBtb3JlLmZvckVhY2goZGF0YXNldCA9PiB7XHJcbiAgICAvLyAgICAgbGlzdHMucHVzaCgoZGF0YXNldCBpbnN0YW5jZW9mIExpbnEpID8gZGF0YXNldC50b0FycmF5KCkgOiBkYXRhc2V0KTtcclxuICAgIC8vIH0pO1xyXG4gICAgLy8gbGlzdHMuZm9yRWFjaChsaXN0ID0+IHtcclxuICAgIC8vICAgICBsaXN0LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAvLyAgICAgICAgIGxldCBleGlzdHMgPSBsaXN0cy5zb21lKG90aGVyID0+IHtcclxuICAgIC8vICAgICAgICAgICAgIGlmIChsaXN0ID09PSBvdGhlcikgcmV0dXJuO1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKG90aGVyLnNvbWUoeCA9PiAgeCA9PT0gaXRlbSkpIHJldHVybiB0cnVlO1xyXG4gICAgLy8gICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgaWYgKCFleGlzdHMpIHJlc3VsdC5wdXNoKGl0ZW0pO1xyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gfSk7XHJcbiAgICAvLyByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmV4cG9ydHMuZXhjZXB0U3RhdGljID0gZXhjZXB0U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1leGNlcHQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XHJcbnZhciBGaWx0ZXJJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoRmlsdGVySXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBGaWx0ZXJJdGVyYXRvcihzb3VyY2UsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrID09PSB2b2lkIDApIHsgY2FsbGJhY2sgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBGaWx0ZXJJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbTtcclxuICAgICAgICB3aGlsZSAoIShpdGVtID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcykpLmRvbmUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2soaXRlbS52YWx1ZSwgdGhpcy5faWR4KSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRmlsdGVySXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpKTtcclxuZXhwb3J0cy5GaWx0ZXJJdGVyYXRvciA9IEZpbHRlckl0ZXJhdG9yO1xyXG5mdW5jdGlvbiBmaWx0ZXIoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgIHJldHVybiBuZXcgRmlsdGVySXRlcmF0b3Ioc291cmNlLCBwcmVkaWNhdGUpO1xyXG59XHJcbi8qKlxyXG4gKiBGaWx0ZXJzIGEgc2VxdWVuY2Ugb2YgdmFsdWVzIGJhc2VkIG9uIGEgcHJlZGljYXRlLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gZmlsdGVyUHJvdG8ocHJlZGljYXRlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KGZpbHRlciwgcHJlZGljYXRlKTtcclxufVxyXG5leHBvcnRzLmZpbHRlclByb3RvID0gZmlsdGVyUHJvdG87XHJcbi8qKlxyXG4gKiBGaWx0ZXJzIGEgc2VxdWVuY2Ugb2YgdmFsdWVzIGJhc2VkIG9uIGEgcHJlZGljYXRlLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gZmlsdGVyU3RhdGljKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICByZXR1cm4gc291cmNlLmZpbHRlcihwcmVkaWNhdGUpO1xyXG59XHJcbmV4cG9ydHMuZmlsdGVyU3RhdGljID0gZmlsdGVyU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBmaWx0ZXJfMSA9IHJlcXVpcmUoXCIuL2ZpbHRlclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG5yZXF1aXJlKFwiLi4vYWRkL2ZpcnN0XCIpO1xyXG52YXIgbWFrZVZhbHVlUHJlZGljYXRlXzEgPSByZXF1aXJlKFwiLi4vbWFrZVZhbHVlUHJlZGljYXRlXCIpO1xyXG52YXIgR3JvdXBCeUl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhHcm91cEJ5SXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBHcm91cEJ5SXRlcmF0b3Ioc291cmNlLCBrZXlTZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5rZXlTZWxlY3RvciA9IGtleVNlbGVjdG9yO1xyXG4gICAgICAgIF90aGlzLl9wcmV2aW91c0tleXMgPSBbXTtcclxuICAgICAgICBfdGhpcy5faXNQaXBlbGluZUV4ZWN1dGVkID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgR3JvdXBCeUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIFRPRE86IEN1cnJlbnRseSB0aGlzIHdpbGwgdXNlIEZpbHRlckl0ZXJhdG9yIG9uIHRoZSB3aG9sZSBzb3VyY2Ugb25jZSBwZXIga2V5LiBDYW4gd2UgaW1wcm92ZSB0aGlzP1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgLyogVE9ETzogQmVjYXVzZSB3ZSBzZW5kIGluIHRoaXMuX3NvdXJjZSBpbnRvIHRoZSBGaWx0ZXJJdGVyYXRvciwgaWYgdGhpcy5fc291cmNlIGlzIGFuIGl0ZXJhdG9yLCB3ZSBmaW5pc2ggaXQsXHJcbiAgICAgICAgICogbWFraW5nIGl0IG5vdCBsb29rIGZvciB0aGUgbmV4dCBrZXkgb24gdGhlIHNlY29uZCBjYWxsIHRvIHRoaXMgZnVuY3Rpb24uXHJcbiAgICAgICAgICogV2UgcHJvYmFibHkgbmVlZCB0byBjcmVhdGUgYSBsb29rdXAgdGFibGUgb2Ygc29tZSBzb3J0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICghdGhpcy5faXNQaXBlbGluZUV4ZWN1dGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IHRoaXMudG9BcnJheSgpO1xyXG4gICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLnJlc2V0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzUGlwZWxpbmVFeGVjdXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpdGVtLCBrZXk7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBpdGVtID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmRvbmUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQoaXRlbS52YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAga2V5ID0gdGhpcy5rZXlTZWxlY3RvcihpdGVtLnZhbHVlKTtcclxuICAgICAgICB9IHdoaWxlICh0aGlzLl9wcmV2aW91c0tleXMuaW5kZXhPZihrZXkpID4gLTEgfHwgVXRpbC5pc1VuZGVmaW5lZChpdGVtLnZhbHVlKSk7XHJcbiAgICAgICAgdGhpcy5fcHJldmlvdXNLZXlzLnB1c2goa2V5KTtcclxuICAgICAgICB2YXIgZmlsdGVyID0gbmV3IGZpbHRlcl8xLkZpbHRlckl0ZXJhdG9yKHRoaXMuX3NvdXJjZSwgZnVuY3Rpb24gKHgsIGlkeCkgeyByZXR1cm4gX3RoaXMua2V5U2VsZWN0b3IoeCkgPT09IGtleTsgfSk7XHJcbiAgICAgICAgdmFyIGdyb3VwSXRlbSwgdmFsdWVzID0gW107XHJcbiAgICAgICAgd2hpbGUgKCFVdGlsLmlzVW5kZWZpbmVkKGdyb3VwSXRlbSA9IGZpbHRlci5uZXh0KCkudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKGdyb3VwSXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGtleSxcclxuICAgICAgICAgICAgICAgIHZhbHVlczogdmFsdWVzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRvbmU6IGl0ZW0uZG9uZVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgR3JvdXBCeUl0ZXJhdG9yLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBuLCByZXN1bHQgPSBbXTtcclxuICAgICAgICB3aGlsZSAoIShuID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcykpLmRvbmUpXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG4udmFsdWUpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEdyb3VwQnlJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLkJhc2VJdGVyYXRvcikpO1xyXG5leHBvcnRzLkdyb3VwQnlJdGVyYXRvciA9IEdyb3VwQnlJdGVyYXRvcjtcclxuZnVuY3Rpb24gZ3JvdXBCeShzb3VyY2UsIGtleVNlbGVjdG9yKSB7XHJcbiAgICB2YXIgcHJlZCA9IG1ha2VWYWx1ZVByZWRpY2F0ZV8xLm1ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3Rvcik7XHJcbiAgICByZXR1cm4gbmV3IEdyb3VwQnlJdGVyYXRvcihzb3VyY2UsIHByZWQpO1xyXG59XHJcbi8qKlxyXG4gKiBHcm91cHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgYWNjb3JkaW5nIHRvIGEgc3BlY2lmaWVkIGtleSBzZWxlY3RvciBmdW5jdGlvbi5cclxuICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCB0aGUga2V5IGZvciBlYWNoIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBncm91cEJ5UHJvdG8oa2V5U2VsZWN0b3IpIHtcclxuICAgIHZhciBwcmVkID0gbWFrZVZhbHVlUHJlZGljYXRlXzEubWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKTtcclxuICAgIHJldHVybiB0aGlzLmxpZnQoZ3JvdXBCeSwgcHJlZCk7XHJcbn1cclxuZXhwb3J0cy5ncm91cEJ5UHJvdG8gPSBncm91cEJ5UHJvdG87XHJcbi8qKlxyXG4gKiBHcm91cHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgYWNjb3JkaW5nIHRvIGEgc3BlY2lmaWVkIGtleSBzZWxlY3RvciBmdW5jdGlvbi5cclxuICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCB0aGUga2V5IGZvciBlYWNoIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBncm91cEJ5U3RhdGljKHNvdXJjZSwga2V5U2VsZWN0b3IpIHtcclxuICAgIHZhciBpLCBhcnIgPSBbXSwgcHJlZCA9IG1ha2VWYWx1ZVByZWRpY2F0ZV8xLm1ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3RvciksIGdyb3VwLCBncm91cFZhbHVlO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGdyb3VwVmFsdWUgPSBwcmVkKHNvdXJjZVtpXSk7XHJcbiAgICAgICAgZ3JvdXAgPSBuZXcgbGlucV8xLkxpbnEoYXJyKS5maXJzdChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5rZXkgPT0gZ3JvdXBWYWx1ZTsgfSk7XHJcbiAgICAgICAgaWYgKCFncm91cCkge1xyXG4gICAgICAgICAgICBncm91cCA9IHtcclxuICAgICAgICAgICAgICAgIGtleTogZ3JvdXBWYWx1ZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlczogW11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgYXJyLnB1c2goZ3JvdXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBncm91cC52YWx1ZXMucHVzaChzb3VyY2VbaV0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFycjtcclxufVxyXG5leHBvcnRzLmdyb3VwQnlTdGF0aWMgPSBncm91cEJ5U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1ncm91cEJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBJbnRlcnNlY3RJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoSW50ZXJzZWN0SXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBJbnRlcnNlY3RJdGVyYXRvcihzb3VyY2UsIG90aGVyLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5jb21wYXJlciA9IGNvbXBhcmVyO1xyXG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKSB7XHJcbiAgICAgICAgICAgIF90aGlzLm90aGVyID0gb3RoZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBfdGhpcy5vdGhlciA9IG5ldyBpdGVyYXRvcl8xLkJhc2VJdGVyYXRvcihvdGhlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEludGVyc2VjdEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJzO1xyXG4gICAgICAgIGlmICghdGhpcy5vdGhlckl0ZW1zKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3RoZXJJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICB3aGlsZSAoIShycyA9IHRoaXMub3RoZXIubmV4dCgpKS5kb25lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm90aGVySXRlbXMucHVzaChycy52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKCEocnMgPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKSkuZG9uZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vdGhlckl0ZW1zLnNvbWUoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIF90aGlzLmNvbXBhcmVyKHJzLnZhbHVlLCB4KTsgfSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBycztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBkb25lOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gSW50ZXJzZWN0SXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpKTtcclxuZXhwb3J0cy5JbnRlcnNlY3RJdGVyYXRvciA9IEludGVyc2VjdEl0ZXJhdG9yO1xyXG5mdW5jdGlvbiBpbnRlcnNlY3Qoc291cmNlLCBvdGhlciwgY29tcGFyZXIpIHtcclxuICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgcmV0dXJuIG5ldyBJbnRlcnNlY3RJdGVyYXRvcihzb3VyY2UsIG90aGVyLCBjb21wYXJlcik7XHJcbn1cclxuLyoqXHJcbiAqIEdldCBhIGxpc3Qgb2YgaXRlbXMgdGhhdCBvbmx5IGV4aXN0cyBpbiBvbmUgb2YgdGhlIGRhdGFzZXRzLlxyXG4gKiBAcGFyYW0gb3RoZXIgVGhlIG90aGVyIGRhdGFzZXQuXHJcbiAqL1xyXG5mdW5jdGlvbiBpbnRlcnNlY3RQcm90byhvdGhlciwgY29tcGFyZXIpIHtcclxuICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgcmV0dXJuIHRoaXMubGlmdChpbnRlcnNlY3QsIG90aGVyLCBjb21wYXJlcik7XHJcbn1cclxuZXhwb3J0cy5pbnRlcnNlY3RQcm90byA9IGludGVyc2VjdFByb3RvO1xyXG4vKipcclxuICogR2V0IGEgbGlzdCBvZiBpdGVtcyB0aGF0IGV4aXN0cyBpbiBhbGwgZGF0YXNldHMuXHJcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBkYXRhc2V0LlxyXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIGRhdGFzZXQgdG8gYmUgY29tcGFyZWQgdG8uXHJcbiAqIEBwYXJhbSBtb3JlIElmIHlvdSBoYXZlIGV2ZW4gbW9yZSBkYXRhc2V0IHRvIGNvbXBhcmUgdG8uXHJcbiAqL1xyXG5mdW5jdGlvbiBpbnRlcnNlY3RTdGF0aWMoc291cmNlLCBvdGhlciwgY29tcGFyZXIpIHtcclxuICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgdmFyIGEgPSAoc291cmNlIGluc3RhbmNlb2YgbGlucV8xLkxpbnEpID8gc291cmNlLnRvQXJyYXkoKSA6IHNvdXJjZSwgYiA9IChvdGhlciBpbnN0YW5jZW9mIGxpbnFfMS5MaW5xKSA/IG90aGVyLnRvQXJyYXkoKSA6IG90aGVyO1xyXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgYS5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgaWYgKGIuc29tZShmdW5jdGlvbiAoeSkgeyByZXR1cm4gY29tcGFyZXIoeCwgeSk7IH0pKVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh4KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIC8vIGxldCBsaXN0czogQXJyYXk8YW55W10+ID0gW10sIHJlc3VsdCA9IFtdO1xyXG4gICAgLy8gbGV0IGxpc3QgPSAoYSBpbnN0YW5jZW9mIExpbnEpID8gYS50b0FycmF5KCkgOiBhO1xyXG4gICAgLy8gbGlzdHMucHVzaCgoYiBpbnN0YW5jZW9mIExpbnEpID8gYi50b0FycmF5KCkgOiBiKTtcclxuICAgIC8vIG1vcmUuZm9yRWFjaCgoZGF0YXNldCkgPT4ge1xyXG4gICAgLy8gICAgIGxpc3RzLnB1c2goKGRhdGFzZXQgaW5zdGFuY2VvZiBMaW5xKSA/IGRhdGFzZXQudG9BcnJheSgpIDogZGF0YXNldCk7XHJcbiAgICAvLyB9KTtcclxuICAgIC8vIGxpc3QuZm9yRWFjaChpdGVtID0+IHtcclxuICAgIC8vICAgICBsZXQgZXhpc3RzID0gbGlzdHMuZXZlcnkob3RoZXIgPT4ge1xyXG4gICAgLy8gICAgICAgICBpZiAoIW90aGVyLnNvbWUoeCA9PiB4ID09PSBpdGVtKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8gICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgICBpZiAoZXhpc3RzKSByZXN1bHQucHVzaChpdGVtKTtcclxuICAgIC8vIH0pO1xyXG4gICAgLy8gcmV0dXJuIHJlc3VsdDtcclxufVxyXG5leHBvcnRzLmludGVyc2VjdFN0YXRpYyA9IGludGVyc2VjdFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW50ZXJzZWN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBCYXNlSXRlcmF0b3IgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQmFzZUl0ZXJhdG9yKHNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuX2lkeCA9IC0xO1xyXG4gICAgICAgIHRoaXMuX2J1ZmZlcnMgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9yZXZlcnNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2RvbmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICB9XHJcbiAgICBCYXNlSXRlcmF0b3IucHJvdG90eXBlLmdldEl0ZXJhdG9yRnJvbVBpcGVsaW5lID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIHR5cGUpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHZhciBzb3VyY2UgPSB0aGlzO1xyXG4gICAgICAgIHdoaWxlICghKChzb3VyY2UgPSBzb3VyY2UuX3NvdXJjZSkgaW5zdGFuY2VvZiB0eXBlKSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc291cmNlO1xyXG4gICAgfTtcclxuICAgIEJhc2VJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAodGhpcy5fc291cmNlIGluc3RhbmNlb2YgQmFzZUl0ZXJhdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXh0ID0gdGhpcy5fc291cmNlLm5leHQoKTtcclxuICAgICAgICAgICAgdGhpcy5faWR4Kys7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JldmVyc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faWR4IDwgdGhpcy5fc291cmNlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG4gPSB0aGlzLl9zb3VyY2VbdGhpcy5fc291cmNlLmxlbmd0aCAtIDEgLSAoKyt0aGlzLl9pZHgpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pZHggPCB0aGlzLl9zb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbiA9IHRoaXMuX3NvdXJjZVsrK3RoaXMuX2lkeF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkeCA+PSB0aGlzLl9zb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuX2lkeCA9IC0xOyAvLyB3ZSBmaW5pc2hlZCwgcmVzZXQgdGhlIGNvdW50ZXJcclxuICAgICAgICAgICAgdGhpcy5fZG9uZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBuLFxyXG4gICAgICAgICAgICBkb25lOiB0aGlzLl9kb25lXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICBCYXNlSXRlcmF0b3IucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX3JldmVyc2VkID0gIXRoaXMuX3JldmVyc2VkOyB9O1xyXG4gICAgQmFzZUl0ZXJhdG9yLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9pZHggPSAtMTtcclxuICAgICAgICB0aGlzLl9kb25lID0gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEJhc2VJdGVyYXRvcjtcclxufSgpKTtcclxuZXhwb3J0cy5CYXNlSXRlcmF0b3IgPSBCYXNlSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWl0ZXJhdG9yLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgZmlsdGVyXzEgPSByZXF1aXJlKFwiLi9maWx0ZXJcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIG1ha2VWYWx1ZVByZWRpY2F0ZV8xID0gcmVxdWlyZShcIi4uL21ha2VWYWx1ZVByZWRpY2F0ZVwiKTtcclxudmFyIEpvaW5JdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoSm9pbkl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gSm9pbkl0ZXJhdG9yKG91dGVyLCBpbm5lciwgb3V0ZXJLZXlTZWxlY3RvciwgaW5uZXJLZXlTZWxlY3RvciwgcmVzdWx0U2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBvdXRlcikgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5pbm5lciA9IGlubmVyO1xyXG4gICAgICAgIF90aGlzLm91dGVyS2V5U2VsZWN0b3IgPSBvdXRlcktleVNlbGVjdG9yO1xyXG4gICAgICAgIF90aGlzLmlubmVyS2V5U2VsZWN0b3IgPSBpbm5lcktleVNlbGVjdG9yO1xyXG4gICAgICAgIF90aGlzLnJlc3VsdFNlbGVjdG9yID0gcmVzdWx0U2VsZWN0b3I7XHJcbiAgICAgICAgX3RoaXMuX2NvdW50ZXIgPSAwO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEpvaW5JdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBpbm5lckl0ZW07XHJcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lclNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAvLyBXZSdyZSBkb2luZyB0aGUgc2Vjb25kIGxvb3Agb2YgdGhlIHNhbWUga2V5LlxyXG4gICAgICAgICAgICBpbm5lckl0ZW0gPSB0aGlzLl9jdXJyZW50SW5uZXJTZWxlY3Rpb24ubmV4dCgpO1xyXG4gICAgICAgICAgICAvLyBXZSBrbm93IHdlIGhhdmUgcmVjZWl2ZWQgYXQgbGVhc3Qgb25lIGl0ZW0gZnJvbSB0aGlzIGtleSBiZWZvcmUsIHNvIG5vdCByZWNlaXZpbmcgb25lIG5vdyBpcyBub3Qgd3JvbmcuXHJcbiAgICAgICAgICAgIC8vIEl0IGp1c3QgbWVhbnMgaXQgd2FzIG9ubHkgYSBzaW5nbGUgaW5uZXIgaXRlbSB3aXRoIHRoaXMga2V5LCBzbyB3ZSBsZXQgaXQgY29udGludWUgaWYgYmVsb3cgY29uZGl0aW9uIGlzIG5vdCBtZXQuXHJcbiAgICAgICAgICAgIGlmICghVXRpbC5pc1VuZGVmaW5lZChpbm5lckl0ZW0udmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnJlc3VsdFNlbGVjdG9yKHRoaXMuX291dGVySXRlbS52YWx1ZSwgaW5uZXJJdGVtLnZhbHVlKSxcclxuICAgICAgICAgICAgICAgICAgICBkb25lOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpc18xLl9vdXRlckl0ZW0gPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzXzEpO1xyXG4gICAgICAgICAgICBpZiAodGhpc18xLl9vdXRlckl0ZW0uZG9uZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfSB9O1xyXG4gICAgICAgICAgICBpZiAoIVV0aWwuaXNVbmRlZmluZWQodGhpc18xLl9vdXRlckl0ZW0udmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3V0ZXJLZXlfMSA9IHRoaXNfMS5vdXRlcktleVNlbGVjdG9yKHRoaXNfMS5fb3V0ZXJJdGVtLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXNfMS5fY3VycmVudElubmVyU2VsZWN0aW9uID0gbmV3IGZpbHRlcl8xLkZpbHRlckl0ZXJhdG9yKHRoaXNfMS5pbm5lciwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIG91dGVyS2V5XzEgPT09IF90aGlzLmlubmVyS2V5U2VsZWN0b3IoeCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgaW5uZXJJdGVtID0gdGhpc18xLl9jdXJyZW50SW5uZXJTZWxlY3Rpb24ubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgdGhpc18xID0gdGhpcztcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHZhciBzdGF0ZV8xID0gX2xvb3BfMSgpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHN0YXRlXzEgPT09IFwib2JqZWN0XCIpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVfMS52YWx1ZTtcclxuICAgICAgICB9IHdoaWxlIChVdGlsLmlzVW5kZWZpbmVkKGlubmVySXRlbS52YWx1ZSkpO1xyXG4gICAgICAgIHRoaXMuX2NvdW50ZXIrKztcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5yZXN1bHRTZWxlY3Rvcih0aGlzLl9vdXRlckl0ZW0udmFsdWUsIGlubmVySXRlbS52YWx1ZSksXHJcbiAgICAgICAgICAgIGRvbmU6IHRoaXMuX291dGVySXRlbS5kb25lXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gSm9pbkl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKSk7XHJcbmV4cG9ydHMuSm9pbkl0ZXJhdG9yID0gSm9pbkl0ZXJhdG9yO1xyXG5mdW5jdGlvbiBmaWx0ZXIoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgIHJldHVybiBuZXcgZmlsdGVyXzEuRmlsdGVySXRlcmF0b3Ioc291cmNlLCBwcmVkaWNhdGUpO1xyXG59XHJcbi8qKlxyXG4gKiBGaWx0ZXJzIGEgc2VxdWVuY2Ugb2YgdmFsdWVzIGJhc2VkIG9uIGEgcHJlZGljYXRlLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gZmlsdGVyUHJvdG8ocHJlZGljYXRlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KGZpbHRlciwgcHJlZGljYXRlKTtcclxufVxyXG5leHBvcnRzLmZpbHRlclByb3RvID0gZmlsdGVyUHJvdG87XHJcbi8qKlxyXG4gKiBGaWx0ZXJzIGEgc2VxdWVuY2Ugb2YgdmFsdWVzIGJhc2VkIG9uIGEgcHJlZGljYXRlLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gZmlsdGVyU3RhdGljKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICByZXR1cm4gc291cmNlLmZpbHRlcihwcmVkaWNhdGUpO1xyXG59XHJcbmV4cG9ydHMuZmlsdGVyU3RhdGljID0gZmlsdGVyU3RhdGljO1xyXG5mdW5jdGlvbiBqb2luKG91dGVyLCBpbm5lciwgb3V0ZXJLZXlTZWxlY3RvciwgaW5uZXJLZXlTZWxlY3RvciwgcmVzdWx0U2VsZWN0b3IpIHtcclxuICAgIHJldHVybiBuZXcgSm9pbkl0ZXJhdG9yKG91dGVyLCBpbm5lciwgb3V0ZXJLZXlTZWxlY3RvciwgaW5uZXJLZXlTZWxlY3RvciwgcmVzdWx0U2VsZWN0b3IpO1xyXG59XHJcbi8qKlxyXG4gKiBDb3JyZWxhdGVzIHRoZSBlbGVtZW50cyBvZiB0d28gc2VxdWVuY2VzIGJhc2VkIG9uIG1hdGNoaW5nIGtleXMuXHJcbiAqIEBwYXJhbSBpbm5lciBUaGUgc2VxdWVuY2UgdG8gam9pbiB0byB0aGUgZmlyc3Qgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBvdXRlcktleVNlbGVjdG9yIFRBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgdGhlIGpvaW4ga2V5IGZyb20gZWFjaCBlbGVtZW50IG9mIHRoZSBmaXJzdCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIGlubmVyS2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IHRoZSBqb2luIGtleSBmcm9tIGVhY2ggZWxlbWVudCBvZiB0aGUgc2Vjb25kIHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gcmVzdWx0U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBjcmVhdGUgYSByZXN1bHQgZWxlbWVudCBmcm9tIHR3byBtYXRjaGluZyBlbGVtZW50cy5cclxuICovXHJcbmZ1bmN0aW9uIGpvaW5Qcm90byhpbm5lciwgb3V0ZXJLZXlTZWxlY3RvciwgaW5uZXJLZXlTZWxlY3RvciwgcmVzdWx0U2VsZWN0b3IpIHtcclxuICAgIHZhciBvdXRlclByZWQgPSBtYWtlVmFsdWVQcmVkaWNhdGVfMS5tYWtlVmFsdWVQcmVkaWNhdGUob3V0ZXJLZXlTZWxlY3RvciksIGlubmVyUHJlZCA9IG1ha2VWYWx1ZVByZWRpY2F0ZV8xLm1ha2VWYWx1ZVByZWRpY2F0ZShpbm5lcktleVNlbGVjdG9yKTtcclxuICAgIHJldHVybiB0aGlzLmxpZnQoam9pbiwgaW5uZXIsIG91dGVyUHJlZCwgaW5uZXJQcmVkLCByZXN1bHRTZWxlY3Rvcik7XHJcbn1cclxuZXhwb3J0cy5qb2luUHJvdG8gPSBqb2luUHJvdG87XHJcbi8qKlxyXG4gKiBDb3JyZWxhdGVzIHRoZSBlbGVtZW50cyBvZiB0d28gc2VxdWVuY2VzIGJhc2VkIG9uIG1hdGNoaW5nIGtleXMuXHJcbiAqIEBwYXJhbSBvdXRlciBUaGUgZmlyc3Qgc2VxdWVuY2UgdG8gam9pbi5cclxuICogQHBhcmFtIGlubmVyIFRoZSBzZXF1ZW5jZSB0byBqb2luIHRvIHRoZSBmaXJzdCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIG91dGVyS2V5U2VsZWN0b3IgVEEgZnVuY3Rpb24gdG8gZXh0cmFjdCB0aGUgam9pbiBrZXkgZnJvbSBlYWNoIGVsZW1lbnQgb2YgdGhlIGZpcnN0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gaW5uZXJLZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgdGhlIGpvaW4ga2V5IGZyb20gZWFjaCBlbGVtZW50IG9mIHRoZSBzZWNvbmQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSByZXN1bHRTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIHJlc3VsdCBlbGVtZW50IGZyb20gdHdvIG1hdGNoaW5nIGVsZW1lbnRzLlxyXG4gKi9cclxuZnVuY3Rpb24gam9pblN0YXRpYyhvdXRlciwgaW5uZXIsIG91dGVyS2V5U2VsZWN0b3IsIGlubmVyS2V5U2VsZWN0b3IsIHJlc3VsdFNlbGVjdG9yKSB7XHJcbiAgICAvLyBUT0RPOiBXcml0ZSBzdGF0aWMgam9pbiBmdW5jdGlvbiB3aXRob3V0IGluc3RhbnRpYXRpbmcgYSBuZXcgTGlucSBvYmplY3RcclxuICAgIHJldHVybiBuZXcgbGlucV8xLkxpbnEob3V0ZXIpLmpvaW4oaW5uZXIsIG91dGVyS2V5U2VsZWN0b3IsIGlubmVyS2V5U2VsZWN0b3IsIHJlc3VsdFNlbGVjdG9yKS50b0FycmF5KCk7XHJcbn1cclxuZXhwb3J0cy5qb2luU3RhdGljID0gam9pblN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9am9pbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIE1hcEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhNYXBJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIE1hcEl0ZXJhdG9yKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBNYXBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbSA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiAoIVV0aWwuaXNVbmRlZmluZWQoaXRlbS52YWx1ZSkpXHJcbiAgICAgICAgICAgID8geyB2YWx1ZTogdGhpcy5jYWxsYmFjayhpdGVtLnZhbHVlLCB0aGlzLl9pZHgpLCBkb25lOiBmYWxzZSB9XHJcbiAgICAgICAgICAgIDogeyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE1hcEl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKSk7XHJcbmV4cG9ydHMuTWFwSXRlcmF0b3IgPSBNYXBJdGVyYXRvcjtcclxuZnVuY3Rpb24gbWFwKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiBuZXcgTWFwSXRlcmF0b3Ioc291cmNlLCBjYWxsYmFjayk7XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgc2VxdWVuY2Ugd2l0aCB0aGUgcmVzdWx0cyBvZiBjYWxsaW5nIGEgcHJvdmlkZWQgZnVuY3Rpb24gb24gZXZlcnkgZWxlbWVudCBpbiB0aGlzIGFycmF5LlxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhbiBlbGVtZW50IG9mIHRoZSBuZXcgc2VxdWVuY2VcclxuICovXHJcbmZ1bmN0aW9uIG1hcFByb3RvKGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KG1hcCwgY2FsbGJhY2spO1xyXG59XHJcbmV4cG9ydHMubWFwUHJvdG8gPSBtYXBQcm90bztcclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgc2VxdWVuY2Ugd2l0aCB0aGUgcmVzdWx0cyBvZiBjYWxsaW5nIGEgcHJvdmlkZWQgZnVuY3Rpb24gb24gZXZlcnkgZWxlbWVudCBpbiB0aGlzIGFycmF5LlxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhbiBlbGVtZW50IG9mIHRoZSBuZXcgc2VxdWVuY2VcclxuICovXHJcbmZ1bmN0aW9uIG1hcFN0YXRpYyhzb3VyY2UsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gc291cmNlLm1hcChjYWxsYmFjayk7XHJcbn1cclxuZXhwb3J0cy5tYXBTdGF0aWMgPSBtYXBTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgbWFrZVZhbHVlUHJlZGljYXRlXzEgPSByZXF1aXJlKFwiLi4vbWFrZVZhbHVlUHJlZGljYXRlXCIpO1xyXG52YXIgT3JkZXJCeUl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhPcmRlckJ5SXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBPcmRlckJ5SXRlcmF0b3Ioc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpIHtcclxuICAgICAgICBpZiAoa2V5U2VsZWN0b3IgPT09IHZvaWQgMCkgeyBrZXlTZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIGlmIChkZXNjZW5kaW5nID09PSB2b2lkIDApIHsgZGVzY2VuZGluZyA9IGZhbHNlOyB9XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmRlc2NlbmRpbmcgPSBkZXNjZW5kaW5nO1xyXG4gICAgICAgIF90aGlzLl9pc09yZGVyZWQgPSBmYWxzZTtcclxuICAgICAgICBfdGhpcy5fb3JkZXJzID0gW25ldyBMaW5xT3JkZXIoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKV07XHJcbiAgICAgICAgX3RoaXMuX2J1ZmZlcnMgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIE9yZGVyQnlJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICghdGhpcy5faXNPcmRlcmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBhcnIgPSBbXSwgaXRlbSA9IHZvaWQgMDtcclxuICAgICAgICAgICAgLy8gY2FuJ3Qgc29tZW9uZSBlbHNlIGRvIHRoaXM/IGUuZy4gRmlsdGVySXRlcmF0b3I/XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmICghVXRpbC5pc1VuZGVmaW5lZChpdGVtLnZhbHVlKSlcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChpdGVtLnZhbHVlKTtcclxuICAgICAgICAgICAgfSB3aGlsZSAoIWl0ZW0uZG9uZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IGFyci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaSA9IDAsIHJzO1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJzID0gX3RoaXMuX29yZGVyc1tpKytdLmNvbXBhcmUoYSwgYik7XHJcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChycyA9PT0gMCAmJiBpIDwgX3RoaXMuX29yZGVycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5faXNPcmRlcmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5yZXNldC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgT3JkZXJCeUl0ZXJhdG9yLnByb3RvdHlwZS50aGVuQnkgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKSB7XHJcbiAgICAgICAgaWYgKGtleVNlbGVjdG9yID09PSB2b2lkIDApIHsga2V5U2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICBpZiAoZGVzY2VuZGluZyA9PT0gdm9pZCAwKSB7IGRlc2NlbmRpbmcgPSBmYWxzZTsgfVxyXG4gICAgICAgIHRoaXMuX29yZGVycy5wdXNoKG5ldyBMaW5xT3JkZXIoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE9yZGVyQnlJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLkJhc2VJdGVyYXRvcikpO1xyXG5leHBvcnRzLk9yZGVyQnlJdGVyYXRvciA9IE9yZGVyQnlJdGVyYXRvcjtcclxuZnVuY3Rpb24gb3JkZXJCeShzb3VyY2UsIGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgdmFyIHNlbGVjdG9yRm4gPSAoa2V5U2VsZWN0b3IpID8gbWFrZVZhbHVlUHJlZGljYXRlXzEubWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKSA6IFV0aWwuZGVmYXVsdFNlbGVjdG9yO1xyXG4gICAgcmV0dXJuIG5ldyBPcmRlckJ5SXRlcmF0b3Ioc291cmNlLCBzZWxlY3RvckZuLCBjb21wYXJlciwgZmFsc2UpO1xyXG59XHJcbmZ1bmN0aW9uIG9yZGVyQnlEZXNjKHNvdXJjZSwga2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICB2YXIgc2VsZWN0b3JGbiA9IChrZXlTZWxlY3RvcikgPyBtYWtlVmFsdWVQcmVkaWNhdGVfMS5tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpIDogVXRpbC5kZWZhdWx0U2VsZWN0b3I7XHJcbiAgICByZXR1cm4gbmV3IE9yZGVyQnlJdGVyYXRvcihzb3VyY2UsIHNlbGVjdG9yRm4sIGNvbXBhcmVyLCB0cnVlKTtcclxufVxyXG4vKipcclxuICogU29ydHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgaW4gYXNjZW5kaW5nIG9yZGVyIGJ5IHVzaW5nIGEgc3BlY2lmaWVkIGNvbXBhcmVyLlxyXG4gKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IGEga2V5IGZyb20gYW4gZWxlbWVudC5cclxuICogQHBhcmFtIGNvbXBhcmVyIEFuIElDb21wYXJlcjxhbnk+IHRvIGNvbXBhcmUga2V5cy5cclxuICovXHJcbmZ1bmN0aW9uIG9yZGVyQnlQcm90byhrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgIC8vIFRPRE86IEhhdmVuJ3QgZ290dGVuIHRoZSBpbnRlbGxpc2Vuc2UgdG8gc2hvdyBMaW5xPFRTb3VyY2U+IGFzIHRoZSByZXN1bHQgb2YgdGhpcyBmdW5jdGlvbiwgaXQgc2hvd3MgTGlucTxhbnk+LlxyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgcmV0dXJuIG5ldyBPcmRlcmVkTGlucShvcmRlckJ5KHRoaXMuX3NvdXJjZSwga2V5U2VsZWN0b3IsIGNvbXBhcmVyKSk7XHJcbn1cclxuZXhwb3J0cy5vcmRlckJ5UHJvdG8gPSBvcmRlckJ5UHJvdG87XHJcbi8qKlxyXG4gKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBpbiBhc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgYSBrZXkgZnJvbSBhbiBlbGVtZW50LlxyXG4gKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gKi9cclxuZnVuY3Rpb24gb3JkZXJCeVN0YXRpYyhzb3VyY2UsIGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgcmV0dXJuIG5ldyBsaW5xXzEuTGlucShzb3VyY2UpLm9yZGVyQnkoa2V5U2VsZWN0b3IsIGNvbXBhcmVyKS50b0FycmF5KCk7XHJcbn1cclxuZXhwb3J0cy5vcmRlckJ5U3RhdGljID0gb3JkZXJCeVN0YXRpYztcclxuLyoqXHJcbiAqIFNvcnRzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgYSBrZXkgZnJvbSBhbiBlbGVtZW50LlxyXG4gKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gKi9cclxuZnVuY3Rpb24gb3JkZXJCeURlc2NQcm90byhrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgIC8vIFRPRE86IEhhdmVuJ3QgZ290dGVuIHRoZSBpbnRlbGxpc2Vuc2UgdG8gc2hvdyBMaW5xPFRTb3VyY2U+IGFzIHRoZSByZXN1bHQgb2YgdGhpcyBmdW5jdGlvbiwgaXQgc2hvd3MgTGlucTxhbnk+LlxyXG4gICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgcmV0dXJuIG5ldyBPcmRlcmVkTGlucShvcmRlckJ5RGVzYyh0aGlzLl9zb3VyY2UsIGtleVNlbGVjdG9yLCBjb21wYXJlcikpO1xyXG59XHJcbmV4cG9ydHMub3JkZXJCeURlc2NQcm90byA9IG9yZGVyQnlEZXNjUHJvdG87XHJcbi8qKlxyXG4gKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBpbiBkZXNjZW5kaW5nIG9yZGVyIGJ5IHVzaW5nIGEgc3BlY2lmaWVkIGNvbXBhcmVyLlxyXG4gKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IGEga2V5IGZyb20gYW4gZWxlbWVudC5cclxuICogQHBhcmFtIGNvbXBhcmVyIEFuIElDb21wYXJlcjxhbnk+IHRvIGNvbXBhcmUga2V5cy5cclxuICovXHJcbmZ1bmN0aW9uIG9yZGVyQnlEZXNjU3RhdGljKHNvdXJjZSwga2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICByZXR1cm4gbmV3IGxpbnFfMS5MaW5xKHNvdXJjZSkub3JkZXJCeURlc2Moa2V5U2VsZWN0b3IsIGNvbXBhcmVyKS50b0FycmF5KCk7XHJcbn1cclxuZXhwb3J0cy5vcmRlckJ5RGVzY1N0YXRpYyA9IG9yZGVyQnlEZXNjU3RhdGljO1xyXG52YXIgTGlucU9yZGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpbnFPcmRlcihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpIHtcclxuICAgICAgICBpZiAoa2V5U2VsZWN0b3IgPT09IHZvaWQgMCkgeyBrZXlTZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIGlmIChkZXNjZW5kaW5nID09PSB2b2lkIDApIHsgZGVzY2VuZGluZyA9IGZhbHNlOyB9XHJcbiAgICAgICAgdGhpcy5fa2V5U2VsZWN0b3IgPSBrZXlTZWxlY3RvcjtcclxuICAgICAgICB0aGlzLl9jb21wYXJlciA9IGNvbXBhcmVyO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NlbmRpbmcgPSBkZXNjZW5kaW5nO1xyXG4gICAgfVxyXG4gICAgTGlucU9yZGVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX2Rlc2NlbmRpbmcgPyAtMSA6IDEpICogdGhpcy5fY29tcGFyZXIodGhpcy5fa2V5U2VsZWN0b3IoYSksIHRoaXMuX2tleVNlbGVjdG9yKGIpKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlucU9yZGVyO1xyXG59KCkpO1xyXG52YXIgT3JkZXJlZExpbnEgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKE9yZGVyZWRMaW5xLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gT3JkZXJlZExpbnEoc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU29ydHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgaW4gZGVzY2VuZGluZyBvcmRlciBieSB1c2luZyBhIHNwZWNpZmllZCBjb21wYXJlci5cclxuICAgICAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgYSBrZXkgZnJvbSBhbiBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIGNvbXBhcmVyIEFuIElDb21wYXJlcjxhbnk+IHRvIGNvbXBhcmUga2V5cy5cclxuICAgICAqL1xyXG4gICAgT3JkZXJlZExpbnEucHJvdG90eXBlLnRoZW5CeSA9IGZ1bmN0aW9uIChrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yRm4gPSAoa2V5U2VsZWN0b3IpID8gbWFrZVZhbHVlUHJlZGljYXRlXzEubWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKSA6IFV0aWwuZGVmYXVsdFNlbGVjdG9yO1xyXG4gICAgICAgIHZhciBvcmRlckl0ZXJhdG9yID0gdGhpcy5fc291cmNlLmdldEl0ZXJhdG9yRnJvbVBpcGVsaW5lKE9yZGVyQnlJdGVyYXRvcik7XHJcbiAgICAgICAgb3JkZXJJdGVyYXRvci50aGVuQnkoc2VsZWN0b3JGbiwgY29tcGFyZXIsIGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNvcnRzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAgICAgKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IGEga2V5IGZyb20gYW4gZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSBjb21wYXJlciBBbiBJQ29tcGFyZXI8YW55PiB0byBjb21wYXJlIGtleXMuXHJcbiAgICAgKi9cclxuICAgIE9yZGVyZWRMaW5xLnByb3RvdHlwZS50aGVuQnlEZXNjID0gZnVuY3Rpb24gKGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICB2YXIgc2VsZWN0b3JGbiA9IChrZXlTZWxlY3RvcikgPyBtYWtlVmFsdWVQcmVkaWNhdGVfMS5tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpIDogVXRpbC5kZWZhdWx0U2VsZWN0b3I7XHJcbiAgICAgICAgdmFyIG9yZGVySXRlcmF0b3IgPSB0aGlzLl9zb3VyY2UuZ2V0SXRlcmF0b3JGcm9tUGlwZWxpbmUoT3JkZXJCeUl0ZXJhdG9yKTtcclxuICAgICAgICBvcmRlckl0ZXJhdG9yLnRoZW5CeShzZWxlY3RvckZuLCBjb21wYXJlciwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE9yZGVyZWRMaW5xO1xyXG59KGxpbnFfMS5MaW5xKSk7XHJcbmV4cG9ydHMuT3JkZXJlZExpbnEgPSBPcmRlcmVkTGlucTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b3JkZXJCeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFNraXBJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoU2tpcEl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gU2tpcEl0ZXJhdG9yKHNvdXJjZSwgY291bnQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuY291bnQgPSBjb3VudDtcclxuICAgICAgICBfdGhpcy5jb3VudGVyID0gMDtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBTa2lwSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZm9yICg7IHRoaXMuY291bnRlciA8IHRoaXMuY291bnQ7IHRoaXMuY291bnRlcisrKVxyXG4gICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxuICAgICAgICByZXR1cm4gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNraXBJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLkJhc2VJdGVyYXRvcikpO1xyXG5leHBvcnRzLlNraXBJdGVyYXRvciA9IFNraXBJdGVyYXRvcjtcclxuZnVuY3Rpb24gc2tpcChzb3VyY2UsIGNvdW50KSB7XHJcbiAgICByZXR1cm4gbmV3IFNraXBJdGVyYXRvcihzb3VyY2UsIGNvdW50KTtcclxufVxyXG4vKipcclxuICogQnlwYXNzZXMgYSBzcGVjaWZpZWQgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGEgc2VxdWVuY2UgYW5kIHRoZW4gcmV0dXJucyB0aGUgcmVtYWluaW5nIGVsZW1lbnRzLlxyXG4gKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byBza2lwIGJlZm9yZSByZXR1cm5pbmcgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cclxuICovXHJcbmZ1bmN0aW9uIHNraXBQcm90byhjb3VudCkge1xyXG4gICAgcmV0dXJuIHRoaXMubGlmdChza2lwLCBjb3VudCk7XHJcbn1cclxuZXhwb3J0cy5za2lwUHJvdG8gPSBza2lwUHJvdG87XHJcbi8qKlxyXG4gKiBCeXBhc3NlcyBhIHNwZWNpZmllZCBudW1iZXIgb2YgZWxlbWVudHMgaW4gYSBzZXF1ZW5jZSBhbmQgdGhlbiByZXR1cm5zIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXHJcbiAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNraXAgYmVmb3JlIHJldHVybmluZyB0aGUgcmVtYWluaW5nIGVsZW1lbnRzLlxyXG4gKi9cclxuZnVuY3Rpb24gc2tpcFN0YXRpYyhzb3VyY2UsIGNvdW50KSB7XHJcbiAgICByZXR1cm4gc291cmNlLnNsaWNlKGNvdW50KTtcclxuICAgIC8vIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnNraXAoY291bnQpLnRvQXJyYXkoKTtcclxufVxyXG5leHBvcnRzLnNraXBTdGF0aWMgPSBza2lwU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4uL2xpbnFcIik7XHJcbnZhciBTa2lwV2hpbGVJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoU2tpcFdoaWxlSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBTa2lwV2hpbGVJdGVyYXRvcihzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMucHJlZGljYXRlID0gcHJlZGljYXRlO1xyXG4gICAgICAgIF90aGlzLmRvbmUgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBTa2lwV2hpbGVJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxuICAgICAgICB9IHdoaWxlICghdGhpcy5kb25lICYmICFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0udmFsdWUpICYmIHRoaXMucHJlZGljYXRlKGl0ZW0udmFsdWUsIHRoaXMuX2lkeCkpO1xyXG4gICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNraXBXaGlsZUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKSk7XHJcbmV4cG9ydHMuU2tpcFdoaWxlSXRlcmF0b3IgPSBTa2lwV2hpbGVJdGVyYXRvcjtcclxuZnVuY3Rpb24gc2tpcFdoaWxlKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICByZXR1cm4gbmV3IFNraXBXaGlsZUl0ZXJhdG9yKHNvdXJjZSwgcHJlZGljYXRlKTtcclxufVxyXG4vKipcclxuICogQnlwYXNzZXMgZWxlbWVudHMgaW4gYSBzZXF1ZW5jZSBhcyBsb25nIGFzIGEgc3BlY2lmaWVkIGNvbmRpdGlvbiBpcyB0cnVlIGFuZCB0aGVuIHJldHVybnMgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cclxuICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIHNraXBXaGlsZVByb3RvKHByZWRpY2F0ZSkge1xyXG4gICAgcmV0dXJuIHRoaXMubGlmdChza2lwV2hpbGUsIHByZWRpY2F0ZSk7XHJcbn1cclxuZXhwb3J0cy5za2lwV2hpbGVQcm90byA9IHNraXBXaGlsZVByb3RvO1xyXG4vKipcclxuICogQnlwYXNzZXMgZWxlbWVudHMgaW4gYSBzZXF1ZW5jZSBhcyBsb25nIGFzIGEgc3BlY2lmaWVkIGNvbmRpdGlvbiBpcyB0cnVlIGFuZCB0aGVuIHJldHVybnMgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cclxuICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIHNraXBXaGlsZVN0YXRpYyhzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgcmV0dXJuIG5ldyBsaW5xXzEuTGlucShzb3VyY2UpLnNraXBXaGlsZShwcmVkaWNhdGUpLnRvQXJyYXkoKTtcclxufVxyXG5leHBvcnRzLnNraXBXaGlsZVN0YXRpYyA9IHNraXBXaGlsZVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcFdoaWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVGFrZUl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhUYWtlSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBUYWtlSXRlcmF0b3Ioc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5jb3VudCA9IGNvdW50O1xyXG4gICAgICAgIF90aGlzLl9jb3VudGVyID0gMDtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBUYWtlSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50ZXIgPCB0aGlzLmNvdW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIrKztcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBkb25lOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVGFrZUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuQmFzZUl0ZXJhdG9yKSk7XHJcbmV4cG9ydHMuVGFrZUl0ZXJhdG9yID0gVGFrZUl0ZXJhdG9yO1xyXG5mdW5jdGlvbiB0YWtlKHNvdXJjZSwgY291bnQpIHtcclxuICAgIHJldHVybiBuZXcgVGFrZUl0ZXJhdG9yKHNvdXJjZSwgY291bnQpO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgc3BlY2lmaWVkIG51bWJlciBvZiBjb250aWd1b3VzIGVsZW1lbnRzIGZyb20gdGhlIHN0YXJ0IG9mIGEgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHJldHVybi5cclxuICovXHJcbmZ1bmN0aW9uIHRha2VQcm90byhjb3VudCkge1xyXG4gICAgcmV0dXJuIHRoaXMubGlmdCh0YWtlLCBjb3VudCk7XHJcbn1cclxuZXhwb3J0cy50YWtlUHJvdG8gPSB0YWtlUHJvdG87XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgc3BlY2lmaWVkIG51bWJlciBvZiBjb250aWd1b3VzIGVsZW1lbnRzIGZyb20gdGhlIHN0YXJ0IG9mIGEgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHJldHVybi5cclxuICovXHJcbmZ1bmN0aW9uIHRha2VTdGF0aWMoc291cmNlLCBjb3VudCkge1xyXG4gICAgcmV0dXJuIHNvdXJjZS5zbGljZSgwLCBjb3VudCk7XHJcbiAgICAvLyByZXR1cm4gbmV3IExpbnEoc291cmNlKS5za2lwKGNvdW50KS50b0FycmF5KCk7XHJcbn1cclxuZXhwb3J0cy50YWtlU3RhdGljID0gdGFrZVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuLi9saW5xXCIpO1xyXG52YXIgVGFrZVdoaWxlSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFRha2VXaGlsZUl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gVGFrZVdoaWxlSXRlcmF0b3Ioc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLnByZWRpY2F0ZSA9IHByZWRpY2F0ZTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBUYWtlV2hpbGVJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbiA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIGlmICghbi5kb25lICYmICEhdGhpcy5wcmVkaWNhdGUobi52YWx1ZSwgdGhpcy5faWR4KSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IG4udmFsdWUsXHJcbiAgICAgICAgICAgICAgICBkb25lOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBkb25lOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVGFrZVdoaWxlSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpKTtcclxuZXhwb3J0cy5UYWtlV2hpbGVJdGVyYXRvciA9IFRha2VXaGlsZUl0ZXJhdG9yO1xyXG5mdW5jdGlvbiB0YWtlV2hpbGUoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgIHJldHVybiBuZXcgVGFrZVdoaWxlSXRlcmF0b3Ioc291cmNlLCBwcmVkaWNhdGUpO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGVsZW1lbnRzIGZyb20gYSBzZXF1ZW5jZSBhcyBsb25nIGFzIGEgc3BlY2lmaWVkIGNvbmRpdGlvbiBpcyB0cnVlLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gdGFrZVdoaWxlUHJvdG8ocHJlZGljYXRlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KHRha2VXaGlsZSwgcHJlZGljYXRlKTtcclxufVxyXG5leHBvcnRzLnRha2VXaGlsZVByb3RvID0gdGFrZVdoaWxlUHJvdG87XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGVsZW1lbnRzIGZyb20gYSBzZXF1ZW5jZSBhcyBsb25nIGFzIGEgc3BlY2lmaWVkIGNvbmRpdGlvbiBpcyB0cnVlLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gdGFrZVdoaWxlU3RhdGljKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICByZXR1cm4gbmV3IGxpbnFfMS5MaW5xKHNvdXJjZSkudGFrZVdoaWxlKHByZWRpY2F0ZSkudG9BcnJheSgpO1xyXG59XHJcbmV4cG9ydHMudGFrZVdoaWxlU3RhdGljID0gdGFrZVdoaWxlU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD10YWtlV2hpbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi4vbGlucVwiKTtcclxudmFyIFppcEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhaaXBJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFppcEl0ZXJhdG9yKHNvdXJjZSwgb3RoZXIsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLm90aGVyID0gb3RoZXI7XHJcbiAgICAgICAgX3RoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBaaXBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbSA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIGlmICghaXRlbS5kb25lKSB7XHJcbiAgICAgICAgICAgIHZhciBvID0gdGhpcy5vdGhlclt0aGlzLl9pZHhdO1xyXG4gICAgICAgICAgICBpZiAoIVV0aWwuaXNVbmRlZmluZWQobykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuY2FsbGJhY2soaXRlbS52YWx1ZSwgbywgdGhpcy5faWR4KSxcclxuICAgICAgICAgICAgICAgICAgICBkb25lOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBkb25lOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gWmlwSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5CYXNlSXRlcmF0b3IpKTtcclxuZXhwb3J0cy5aaXBJdGVyYXRvciA9IFppcEl0ZXJhdG9yO1xyXG5mdW5jdGlvbiB6aXAoc291cmNlLCBvdGhlciwgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiBuZXcgWmlwSXRlcmF0b3Ioc291cmNlLCBvdGhlciwgY2FsbGJhY2spO1xyXG59XHJcbi8qKlxyXG4gKiBNZXJnZXMgaXRlbXMgZnJvbSB0aGUgZmlyc3Qgc2VxdWVuY2Ugd2l0aCB0aGUgaXRlbSBhdCB0aGUgY29ycmVzcG9uZGluZyBpbmRleCBpbiB0aGUgc2Vjb25kIHNlcXVlbmNlIHRvXHJcbiAqIGNyZWF0ZSBhIG5ldyBzZXF1ZW5jZSB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeSBwYWlyIG9mIGl0ZW1zLlxyXG4gKiBUaGUgemlwIHdpbGwgc3RvcCBhcyBzb29uIGFzIGVpdGhlciBvZiB0aGUgc2VxdWVuY2VzIGhpdHMgYW4gdW5kZWZpbmVkIHZhbHVlLlxyXG4gKiBAcGFyYW0gb3RoZXIgVGhlIHNlY29uZCBzZXF1ZW5jZSB0byB6aXAgd2l0aFxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhbiBlbGVtZW50IG9mIHRoZSBuZXcgc2VxdWVuY2VcclxuICovXHJcbmZ1bmN0aW9uIHppcFByb3RvKG90aGVyLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIHRoaXMubGlmdCh6aXAsIG90aGVyLCBjYWxsYmFjayk7XHJcbn1cclxuZXhwb3J0cy56aXBQcm90byA9IHppcFByb3RvO1xyXG4vKipcclxuICogTWVyZ2VzIGl0ZW1zIGZyb20gdGhlIGZpcnN0IHNlcXVlbmNlIHdpdGggdGhlIGl0ZW0gYXQgdGhlIGNvcnJlc3BvbmRpbmcgaW5kZXggaW4gdGhlIHNlY29uZCBzZXF1ZW5jZSB0b1xyXG4gKiBjcmVhdGUgYSBuZXcgc2VxdWVuY2Ugd2l0aCB0aGUgcmVzdWx0cyBvZiBjYWxsaW5nIGEgcHJvdmlkZWQgZnVuY3Rpb24gb24gZXZlcnkgcGFpciBvZiBpdGVtcy5cclxuICogVGhlIHppcCB3aWxsIHN0b3AgYXMgc29vbiBhcyBlaXRoZXIgb2YgdGhlIHNlcXVlbmNlcyBoaXRzIGFuIHVuZGVmaW5lZCB2YWx1ZS5cclxuICogQHBhcmFtIG90aGVyIFRoZSBzZWNvbmQgc2VxdWVuY2UgdG8gemlwIHdpdGhcclxuICogQHBhcmFtIGNhbGxiYWNrIEZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgYW4gZWxlbWVudCBvZiB0aGUgbmV3IHNlcXVlbmNlXHJcbiAqL1xyXG5mdW5jdGlvbiB6aXBTdGF0aWMoc291cmNlLCBvdGhlciwgY2FsbGJhY2spIHtcclxuICAgIC8vIFRPRE86IFdyaXRlIHN0YXRpYyB6aXAgZnVuY3Rpb24gd2l0aG91dCBpbnN0YW50aWF0aW5nIGEgbmV3IExpbnEgb2JqZWN0XHJcbiAgICByZXR1cm4gbmV3IGxpbnFfMS5MaW5xKHNvdXJjZSkuemlwKG90aGVyLCBjYWxsYmFjaykudG9BcnJheSgpO1xyXG59XHJcbmV4cG9ydHMuemlwU3RhdGljID0gemlwU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD16aXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvci9pdGVyYXRvclwiKTtcclxudmFyIG1hcF8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3IvbWFwXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgTGlucSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMaW5xKHNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IChzb3VyY2UgaW5zdGFuY2VvZiBpdGVyYXRvcl8xLkJhc2VJdGVyYXRvcilcclxuICAgICAgICAgICAgPyBzb3VyY2VcclxuICAgICAgICAgICAgOiBuZXcgbWFwXzEuTWFwSXRlcmF0b3Ioc291cmNlLCBmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gaXRlbTsgfSk7XHJcbiAgICB9XHJcbiAgICBMaW5xLnByb3RvdHlwZS5saWZ0ID0gZnVuY3Rpb24gKGl0ZXJhdG9yKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoaXRlcmF0b3IuYXBwbHkodm9pZCAwLCBbdGhpcy5fc291cmNlXS5jb25jYXQoYXJncykpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEludmVydHMgdGhlIG9yZGVyIG9mIHRoZSBlbGVtZW50cyBpbiBhIHNlcXVlbmNlLlxyXG4gICAgICogVGhpcyBzaW1wbHkgaXRlcmF0ZXMgdGhlIGl0ZW1zIGZyb20gdGhlIGVuZCwgYW5kIGFzIHN1Y2ggaGFzIG5vIGFkZGl0aW9uYWwgcGVyZm9ybWFuY2UgY29zdC5cclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UucmV2ZXJzZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZXMgdGhlIHBpcGVsaW5lIGFuZCByZXR1cm4gdGhlIHJlc3VsdGluZyBhcnJheS5cclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVzLCBhcnIgPSBbXTtcclxuICAgICAgICBpZiAoVXRpbC5pc0FycmF5KHRoaXMuX3NvdXJjZSkpIHtcclxuICAgICAgICAgICAgYXJyID0gVXRpbC5jYXN0KHRoaXMuX3NvdXJjZSkuc2xpY2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHdoaWxlICghKHJlcyA9IHRoaXMuX3NvdXJjZS5uZXh0KCkpLmRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKHJlcy52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlucTtcclxufSgpKTtcclxuZXhwb3J0cy5MaW5xID0gTGlucTtcclxuZnVuY3Rpb24gTFEoc291cmNlKSB7XHJcbiAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKTtcclxufVxyXG5leHBvcnRzLkxRID0gTFE7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbnEuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxuZnVuY3Rpb24gbWFrZVZhbHVlUHJlZGljYXRlKHByZWRpY2F0ZSkge1xyXG4gICAgaWYgKFV0aWwuaXNTdHJpbmcocHJlZGljYXRlKSkge1xyXG4gICAgICAgIHZhciBmaWVsZF8xID0gcHJlZGljYXRlO1xyXG4gICAgICAgIHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoeCkgeyByZXR1cm4geFtmaWVsZF8xXTsgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChVdGlsLmlzVW5kZWZpbmVkKHByZWRpY2F0ZSkpIHtcclxuICAgICAgICBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJlZGljYXRlO1xyXG59XHJcbmV4cG9ydHMubWFrZVZhbHVlUHJlZGljYXRlID0gbWFrZVZhbHVlUHJlZGljYXRlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWtlVmFsdWVQcmVkaWNhdGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcIi4uL2FkZC9hbnlcIik7XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYWxsIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICogQHBhcmFtIGludmVydCBJZiB0cnVlLCBkZXRlcm1pbmVzIHdoZXRoZXIgbm9uZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIHNhdGlzZnkgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBhbGxQcm90byhwcmVkaWNhdGUsIGludmVydCkge1xyXG4gICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICByZXR1cm4gISh0aGlzLmFueShwcmVkaWNhdGUsICFpbnZlcnQpKTtcclxufVxyXG5leHBvcnRzLmFsbFByb3RvID0gYWxsUHJvdG87XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYWxsIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICogQHBhcmFtIGludmVydCBJZiB0cnVlLCBkZXRlcm1pbmVzIHdoZXRoZXIgbm9uZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIHNhdGlzZnkgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBhbGxTdGF0aWMoc291cmNlLCBwcmVkaWNhdGUsIGludmVydCkge1xyXG4gICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICByZXR1cm4gc291cmNlLmV2ZXJ5KGZ1bmN0aW9uICh4KSB7IHJldHVybiAhIXByZWRpY2F0ZSh4KSAhPT0gaW52ZXJ0OyB9KTtcclxufVxyXG5leHBvcnRzLmFsbFN0YXRpYyA9IGFsbFN0YXRpYztcclxuLy8gLyoqXHJcbi8vICAqIERldGVybWluZXMgd2hldGhlciBhbGwgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4vLyAgKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4vLyAgKiBAcGFyYW0gaW52ZXJ0IElmIHRydWUsIGRldGVybWluZXMgd2hldGhlciBub25lIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuLy8gICovXHJcbi8vIGFsbChwcmVkaWNhdGU6IFV0aWwuSVByZWRpY2F0ZTxUU291cmNlPiwgaW52ZXJ0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuLy8gICAgIHJldHVybiAhKHRoaXMuYW55KHByZWRpY2F0ZSwgIWludmVydCkpO1xyXG4vLyB9XHJcbi8vIC8qKlxyXG4vLyAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYWxsIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuLy8gICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuLy8gICogQHBhcmFtIGludmVydCBJZiB0cnVlLCBkZXRlcm1pbmVzIHdoZXRoZXIgbm9uZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIHNhdGlzZnkgYSBjb25kaXRpb24uXHJcbi8vICAqL1xyXG4vLyBzdGF0aWMgYWxsPFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdLCBwcmVkaWNhdGU6IFV0aWwuSVByZWRpY2F0ZTxUU291cmNlPiwgaW52ZXJ0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuLy8gICAgIHJldHVybiBzb3VyY2UuZXZlcnkoeCA9PiAhIXByZWRpY2F0ZSh4KSAhPT0gaW52ZXJ0KTtcclxuLy8gfVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbGwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcIi4uL2FkZC9maXJzdFwiKTtcclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciBhbnkgZWxlbWVudCBvZiBhIHNlcXVlbmNlIHNhdGlzZmllcyBhIGNvbmRpdGlvbi5cclxuICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi4gSWYgbm90IHByb3ZpZGVkLCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNlcXVlbmNlIGNvbnRhaW5zIGFueSBlbGVtZW50cy5cclxuICogQHBhcmFtIGludmVydCBJZiB0cnVlLCBkZXRlcm1pbmVzIHdoZXRoZXIgYW55IGVsZW1lbnQgb2YgYSBzZXF1ZW5jZSBkb2VzIG5vdCBzYXRpc2ZpZXMgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBhbnlQcm90byhwcmVkaWNhdGUsIGludmVydCkge1xyXG4gICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICByZXR1cm4gdHlwZW9mIHRoaXMuZmlyc3QoZnVuY3Rpb24gKHgpIHsgcmV0dXJuICEhcHJlZGljYXRlKHgpICE9PSBpbnZlcnQ7IH0pICE9PSBcInVuZGVmaW5lZFwiO1xyXG59XHJcbmV4cG9ydHMuYW55UHJvdG8gPSBhbnlQcm90bztcclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciBhbnkgZWxlbWVudCBvZiBhIHNlcXVlbmNlIHNhdGlzZmllcyBhIGNvbmRpdGlvbi5cclxuICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi4gSWYgbm90IHByb3ZpZGVkLCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNlcXVlbmNlIGNvbnRhaW5zIGFueSBlbGVtZW50cy5cclxuICogQHBhcmFtIGludmVydCBJZiB0cnVlLCBkZXRlcm1pbmVzIHdoZXRoZXIgYW55IGVsZW1lbnQgb2YgYSBzZXF1ZW5jZSBkb2VzIG5vdCBzYXRpc2ZpZXMgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBhbnlTdGF0aWMoc291cmNlLCBwcmVkaWNhdGUsIGludmVydCkge1xyXG4gICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICByZXR1cm4gc291cmNlLnNvbWUoZnVuY3Rpb24gKHgpIHsgcmV0dXJuICEhcHJlZGljYXRlKHgpICE9PSBpbnZlcnQ7IH0pO1xyXG59XHJcbmV4cG9ydHMuYW55U3RhdGljID0gYW55U3RhdGljO1xyXG4vLyAvKipcclxuLy8gICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2Ugc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4vLyAgKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLiBJZiBub3QgcHJvdmlkZWQsIGRldGVybWluZXMgd2hldGhlciB0aGUgc2VxdWVuY2UgY29udGFpbnMgYW55IGVsZW1lbnRzLlxyXG4vLyAgKiBAcGFyYW0gaW52ZXJ0IElmIHRydWUsIGRldGVybWluZXMgd2hldGhlciBhbnkgZWxlbWVudCBvZiBhIHNlcXVlbmNlIGRvZXMgbm90IHNhdGlzZmllcyBhIGNvbmRpdGlvbi5cclxuLy8gICovXHJcbi8vIGFueShwcmVkaWNhdGU6IFV0aWwuSVByZWRpY2F0ZTxUU291cmNlPiwgaW52ZXJ0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuLy8gICAgIHJldHVybiB0eXBlb2YgdGhpcy5maXJzdCh4ID0+ICEhcHJlZGljYXRlKHgpICE9PSBpbnZlcnQpICE9PSBcInVuZGVmaW5lZFwiO1xyXG4vLyB9XHJcbi8vIC8qKlxyXG4vLyAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW55IGVsZW1lbnQgb2YgYSBzZXF1ZW5jZSBzYXRpc2ZpZXMgYSBjb25kaXRpb24uXHJcbi8vICAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uIElmIG5vdCBwcm92aWRlZCwgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzZXF1ZW5jZSBjb250YWlucyBhbnkgZWxlbWVudHMuXHJcbi8vICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2UgZG9lcyBub3Qgc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4vLyAgKi9cclxuLy8gc3RhdGljIGFueTxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSwgcHJlZGljYXRlOiBVdGlsLklQcmVkaWNhdGU8VFNvdXJjZT4sIGludmVydDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XHJcbi8vICAgICByZXR1cm4gc291cmNlLnNvbWUoeCA9PiAhIXByZWRpY2F0ZSh4KSAhPT0gaW52ZXJ0KTtcclxuLy8gfVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxuLyoqXHJcbiAqIENvbXB1dGVzIHRoZSBhdmVyYWdlIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIHNlbGVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBhdmVyYWdlUHJvdG8oc2VsZWN0b3IpIHtcclxuICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgIHJldHVybiBhdmVyYWdlU3RhdGljKHRoaXMudG9BcnJheSgpLCBzZWxlY3Rvcik7XHJcbn1cclxuZXhwb3J0cy5hdmVyYWdlUHJvdG8gPSBhdmVyYWdlUHJvdG87XHJcbi8qKlxyXG4gKiBDb21wdXRlcyB0aGUgYXZlcmFnZSBvZiBhIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBzZWxlY3RvclxyXG4gKi9cclxuZnVuY3Rpb24gYXZlcmFnZVN0YXRpYyhzb3VyY2UsIHNlbGVjdG9yKSB7XHJcbiAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICB2YXIgaSwgdG90YWwgPSAwO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRvdGFsICs9IHNlbGVjdG9yKHNvdXJjZVtpXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG90YWwgLyBzb3VyY2UubGVuZ3RoO1xyXG59XHJcbmV4cG9ydHMuYXZlcmFnZVN0YXRpYyA9IGF2ZXJhZ2VTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF2ZXJhZ2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxucmVxdWlyZShcIi4uL2FkZC9maWx0ZXJcIik7XHJcbnJlcXVpcmUoXCIuLi9hZGQvdGFrZVwiKTtcclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGZpcnN0IG1hdGNoaW5nIGl0ZW0gaW4gdGhlIGFycmF5LlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBmaXJzdFByb3RvKHByZWRpY2F0ZSkge1xyXG4gICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgdmFyIGFyciA9IHRoaXMuZmlsdGVyKHByZWRpY2F0ZSkudGFrZSgxKS50b0FycmF5KCk7XHJcbiAgICBpZiAoYXJyLmxlbmd0aCA9PSAxKVxyXG4gICAgICAgIHJldHVybiBhcnJbMF07XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxufVxyXG5leHBvcnRzLmZpcnN0UHJvdG8gPSBmaXJzdFByb3RvO1xyXG4vKipcclxuICogUmV0dXJucyB0aGUgZmlyc3QgbWF0Y2hpbmcgaXRlbSBpbiB0aGUgYXJyYXkuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICovXHJcbmZ1bmN0aW9uIGZpcnN0U3RhdGljKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICBpZiAoIXNvdXJjZSB8fCBzb3VyY2UubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICBpZiAoIXByZWRpY2F0ZSlcclxuICAgICAgICByZXR1cm4gc291cmNlWzBdO1xyXG4gICAgdmFyIHJzID0gdW5kZWZpbmVkO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlKHNvdXJjZVtpXSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcbmV4cG9ydHMuZmlyc3RTdGF0aWMgPSBmaXJzdFN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zmlyc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcclxucmVxdWlyZShcIi4uL2FkZC9maXJzdFwiKTtcclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGxhc3QgbWF0Y2hpbmcgaXRlbSBpbiB0aGUgYXJyYXkuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICovXHJcbmZ1bmN0aW9uIGxhc3RQcm90byhwcmVkaWNhdGUpIHtcclxuICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgIHJldHVybiB0aGlzLnJldmVyc2UoKS5maXJzdChwcmVkaWNhdGUpO1xyXG59XHJcbmV4cG9ydHMubGFzdFByb3RvID0gbGFzdFByb3RvO1xyXG4vKipcclxuICogUmV0dXJucyB0aGUgbGFzdCBtYXRjaGluZyBpdGVtIGluIHRoZSBhcnJheS5cclxuICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gKi9cclxuZnVuY3Rpb24gbGFzdFN0YXRpYyhzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgaWYgKCFzb3VyY2UgfHwgc291cmNlLmxlbmd0aCA9PT0gMClcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgaWYgKCFwcmVkaWNhdGUpXHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZVtzb3VyY2UubGVuZ3RoIC0gMV07XHJcbiAgICBmb3IgKHZhciBpID0gc291cmNlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZShzb3VyY2VbaV0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2VbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcclxufVxyXG5leHBvcnRzLmxhc3RTdGF0aWMgPSBsYXN0U3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1sYXN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XHJcbi8qKlxyXG4gKiBDb21wdXRlcyB0aGUgbWF4aW11bSBvZiBhIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBzZWxlY3RvclxyXG4gKi9cclxuZnVuY3Rpb24gbWF4UHJvdG8oc2VsZWN0b3IpIHtcclxuICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgIHJldHVybiBtYXhTdGF0aWModGhpcy50b0FycmF5KCksIHNlbGVjdG9yKTtcclxufVxyXG5leHBvcnRzLm1heFByb3RvID0gbWF4UHJvdG87XHJcbi8qKlxyXG4gKiBDb21wdXRlcyB0aGUgbWF4aW11bSBvZiBhIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBzZWxlY3RvclxyXG4gKi9cclxuZnVuY3Rpb24gbWF4U3RhdGljKHNvdXJjZSwgc2VsZWN0b3IpIHtcclxuICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgIHJldHVybiBNYXRoLm1heC5hcHBseShNYXRoLCBzb3VyY2UubWFwKHNlbGVjdG9yKSk7XHJcbn1cclxuZXhwb3J0cy5tYXhTdGF0aWMgPSBtYXhTdGF0aWM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1heC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xyXG4vKipcclxuICogQ29tcHV0ZXMgdGhlIG1pbmltdW0gb2YgYSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gc2VsZWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIG1pblByb3RvKHNlbGVjdG9yKSB7XHJcbiAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICByZXR1cm4gbWluU3RhdGljKHRoaXMudG9BcnJheSgpLCBzZWxlY3Rvcik7XHJcbn1cclxuZXhwb3J0cy5taW5Qcm90byA9IG1pblByb3RvO1xyXG4vKipcclxuICogQ29tcHV0ZXMgdGhlIG1pbmltdW0gb2YgYSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gc2VsZWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIG1pblN0YXRpYyhzb3VyY2UsIHNlbGVjdG9yKSB7XHJcbiAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICByZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCwgc291cmNlLm1hcChzZWxlY3RvcikpO1xyXG59XHJcbmV4cG9ydHMubWluU3RhdGljID0gbWluU3RhdGljO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1taW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcIi4uL2FkZC9maWx0ZXJcIik7XHJcbnJlcXVpcmUoXCIuLi9hZGQvdGFrZVwiKTtcclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIG1hdGNoaW5nIGl0ZW0gaW4gdGhlIGFycmF5LiBJZiB0aGVyZSBhcmUgemVybyBvciBzZXZlcmFsIG1hdGNoZXMgYW4gZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICogQHRocm93cyBFcnJvci5cclxuICovXHJcbmZ1bmN0aW9uIHNpbmdsZVByb3RvKHByZWRpY2F0ZSkge1xyXG4gICAgdmFyIGFyciA9IHRoaXMuZmlsdGVyKHByZWRpY2F0ZSkudGFrZSgyKS50b0FycmF5KCk7XHJcbiAgICBpZiAoYXJyLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBzZXF1ZW5jZSBpcyBlbXB0eS5cIik7XHJcbiAgICBpZiAoYXJyLmxlbmd0aCA9PSAyKVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBzZXF1ZW5jZSBjb250YWlucyBtb3JlIHRoYW4gb25lIGVsZW1lbnQuXCIpO1xyXG4gICAgaWYgKGFyci5sZW5ndGggPT0gMSlcclxuICAgICAgICByZXR1cm4gYXJyWzBdO1xyXG59XHJcbmV4cG9ydHMuc2luZ2xlUHJvdG8gPSBzaW5nbGVQcm90bztcclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIG1hdGNoaW5nIGl0ZW0gaW4gdGhlIGFycmF5LiBJZiB0aGVyZSBhcmUgemVybyBvciBzZXZlcmFsIG1hdGNoZXMgYW4gZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICogQHRocm93cyBFcnJvclxyXG4gKi9cclxuZnVuY3Rpb24gc2luZ2xlU3RhdGljKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICBpZiAoIXNvdXJjZSB8fCBzb3VyY2UubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICBpZiAoIXByZWRpY2F0ZSlcclxuICAgICAgICByZXR1cm4gc291cmNlWzBdO1xyXG4gICAgdmFyIHJzID0gdW5kZWZpbmVkO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlKHNvdXJjZVtpXSkpIHtcclxuICAgICAgICAgICAgaWYgKHJzKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHNlcXVlbmNlIGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgZWxlbWVudC5cIik7XHJcbiAgICAgICAgICAgIHJzID0gc291cmNlW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghcnMpXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHNlcXVlbmNlIGlzIGVtcHR5LlwiKTtcclxuICAgIHJldHVybiBycztcclxufVxyXG5leHBvcnRzLnNpbmdsZVN0YXRpYyA9IHNpbmdsZVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2luZ2xlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XHJcbi8qKlxyXG4gKiBDb21wdXRlcyB0aGUgc3VtIG9mIHRoZSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gc2VsZWN0b3IgQSB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50LlxyXG4gKi9cclxuZnVuY3Rpb24gc3VtUHJvdG8oc2VsZWN0b3IpIHtcclxuICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgIHJldHVybiBzdW1TdGF0aWModGhpcy50b0FycmF5KCksIHNlbGVjdG9yKTtcclxufVxyXG5leHBvcnRzLnN1bVByb3RvID0gc3VtUHJvdG87XHJcbi8qKlxyXG4gKiBDb21wdXRlcyB0aGUgc3VtIG9mIHRoZSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gc2VsZWN0b3IgQSB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50LlxyXG4gKi9cclxuZnVuY3Rpb24gc3VtU3RhdGljKHNvdXJjZSwgc2VsZWN0b3IpIHtcclxuICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgIHJldHVybiBzb3VyY2UucmVkdWNlKGZ1bmN0aW9uIChzdW0sIGl0ZW0pIHsgcmV0dXJuIHN1bSArIHNlbGVjdG9yKGl0ZW0pOyB9LCAwKTtcclxufVxyXG5leHBvcnRzLnN1bVN0YXRpYyA9IHN1bVN0YXRpYztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3VtLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIGRlZmF1bHRTZWxlY3RvcihhKSB7XHJcbiAgICByZXR1cm4gY2FzdChhKTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHRTZWxlY3RvciA9IGRlZmF1bHRTZWxlY3RvcjtcclxuZnVuY3Rpb24gZGVmYXVsdENvbXBhcmVyKGEsIGIpIHtcclxuICAgIGlmIChhIDwgYilcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICBlbHNlIGlmIChhID4gYilcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gMDtcclxufVxyXG5leHBvcnRzLmRlZmF1bHRDb21wYXJlciA9IGRlZmF1bHRDb21wYXJlcjtcclxuZnVuY3Rpb24gZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXIoYSwgYikge1xyXG4gICAgcmV0dXJuIGEgPT09IGI7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0RXF1YWxpdHlDb21wYXJlciA9IGRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyO1xyXG5mdW5jdGlvbiBkZWZhdWx0UHJlZGljYXRlKHZhbHVlLCBpbmRleCkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0UHJlZGljYXRlID0gZGVmYXVsdFByZWRpY2F0ZTtcclxuZnVuY3Rpb24gY2FzdChhKSB7XHJcbiAgICByZXR1cm4gYTtcclxufVxyXG5leHBvcnRzLmNhc3QgPSBjYXN0O1xyXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XHJcbn1cclxuZXhwb3J0cy50b1N0cmluZyA9IHRvU3RyaW5nO1xyXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIjtcclxufVxyXG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XHJcbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgU3RyaW5nXVwiO1xyXG59XHJcbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcclxuZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XHJcbn1cclxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XHJcbn1cclxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcclxuZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xyXG59XHJcbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XHJcbmZ1bmN0aW9uIGlzRGF0ZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IERhdGVdXCI7XHJcbn1cclxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaXN0XzEgPSByZXF1aXJlKFwiLi9saXN0XCIpO1xyXG5leHBvcnRzLkxpc3QgPSBsaXN0XzEuZGVmYXVsdDtcclxudmFyIGxpbmtlZExpc3RfMSA9IHJlcXVpcmUoXCIuL2xpbmtlZExpc3RcIik7XHJcbmV4cG9ydHMuTGlua2VkTGlzdCA9IGxpbmtlZExpc3RfMS5kZWZhdWx0O1xyXG52YXIgc3RhY2tfMSA9IHJlcXVpcmUoXCIuL3N0YWNrXCIpO1xyXG5leHBvcnRzLlN0YWNrID0gc3RhY2tfMS5kZWZhdWx0O1xyXG52YXIgcXVldWVfMSA9IHJlcXVpcmUoXCIuL3F1ZXVlXCIpO1xyXG5leHBvcnRzLlF1ZXVlID0gcXVldWVfMS5kZWZhdWx0O1xyXG52YXIgYmluYXJ5VHJlZV8xID0gcmVxdWlyZShcIi4vYmluYXJ5VHJlZVwiKTtcclxuZXhwb3J0cy5CaW5hcnlUcmVlID0gYmluYXJ5VHJlZV8xLmRlZmF1bHQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBudW1iZXJzXzEgPSByZXF1aXJlKFwiLi9udW1iZXJzXCIpO1xyXG5leHBvcnRzLk51bWJlcnMgPSBudW1iZXJzXzEuZGVmYXVsdDtcclxuZXhwb3J0cy5OdW1iZXJzSGVscGVyID0gbnVtYmVyc18xLk51bWJlcnNIZWxwZXI7XHJcbnZhciBzdHJpbmdzXzEgPSByZXF1aXJlKFwiLi9zdHJpbmdzXCIpO1xyXG5leHBvcnRzLlN0cmluZ3MgPSBzdHJpbmdzXzEuZGVmYXVsdDtcclxuZXhwb3J0cy5TdHJpbmdzSGVscGVyID0gc3RyaW5nc18xLlN0cmluZ3NIZWxwZXI7XHJcbnZhciBkYXRlc18xID0gcmVxdWlyZShcIi4vZGF0ZXNcIik7XHJcbmV4cG9ydHMuRGF0ZXMgPSBkYXRlc18xLmRlZmF1bHQ7XHJcbmV4cG9ydHMuRGF0ZXNIZWxwZXIgPSBkYXRlc18xLkRhdGVzSGVscGVyO1xyXG52YXIgdXJsXzEgPSByZXF1aXJlKFwiLi91cmxcIik7XHJcbmV4cG9ydHMuVXJsID0gdXJsXzEuZGVmYXVsdDtcclxuZXhwb3J0cy5VcmxIZWxwZXIgPSB1cmxfMS5VcmxIZWxwZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBvcmRlckJ5XzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvci9vcmRlckJ5XCIpO1xyXG5leHBvcnRzLk9yZGVyZWRMaW5xID0gb3JkZXJCeV8xLk9yZGVyZWRMaW5xO1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4vbGlucVwiKTtcclxuZXhwb3J0cy5MaW5xID0gbGlucV8xLkxpbnE7XHJcbmV4cG9ydHMuTFEgPSBsaW5xXzEuTFE7XHJcbi8vIEl0ZXJhdG9yc1xyXG5yZXF1aXJlKFwiLi9hZGQvZGlzdGluY3RcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9leGNlcHRcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9maWx0ZXJcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9ncm91cEJ5XCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvaW50ZXJzZWN0XCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvam9pblwiKTtcclxucmVxdWlyZShcIi4vYWRkL21hcFwiKTtcclxucmVxdWlyZShcIi4vYWRkL29yZGVyQnlcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9za2lwXCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvc2tpcFdoaWxlXCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvdGFrZVwiKTtcclxucmVxdWlyZShcIi4vYWRkL3Rha2VXaGlsZVwiKTtcclxucmVxdWlyZShcIi4vYWRkL3ppcFwiKTtcclxuLy8gT3BlcmF0b3JzXHJcbnJlcXVpcmUoXCIuL2FkZC9hbGxcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9hbnlcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9hdmVyYWdlXCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvZmlyc3RcIik7XHJcbnJlcXVpcmUoXCIuL2FkZC9sYXN0XCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvbWF4XCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvbWluXCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvc2luZ2xlXCIpO1xyXG5yZXF1aXJlKFwiLi9hZGQvc3VtXCIpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXX0=
;
return {
'Collections': require('Collections'),
'Helpers': require('Helpers'),
'Linq': require('Linq')
};
});
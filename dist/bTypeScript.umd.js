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

},{"../util":26,"./queue":4}],2:[function(require,module,exports){
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

},{"../util":26}],4:[function(require,module,exports){
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

},{"../util":26}],7:[function(require,module,exports){
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

},{"../util":26}],8:[function(require,module,exports){
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
var Util = require("../util");
var iterator_1 = require("./iterator");
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
}(iterator_1.default));
exports.default = DistinctIterator;

},{"../util":26,"./iterator":16}],11:[function(require,module,exports){
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
var Util = require("../util");
var iterator_1 = require("./iterator");
var ExceptIterator = (function (_super) {
    __extends(ExceptIterator, _super);
    function ExceptIterator(source, other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var _this = _super.call(this, source) || this;
        _this.comparer = comparer;
        if (other instanceof iterator_1.default) {
            _this.other = other;
        }
        else {
            _this.other = new iterator_1.default(other);
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
}(iterator_1.default));
exports.default = ExceptIterator;

},{"../util":26,"./iterator":16}],12:[function(require,module,exports){
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
var Util = require("../util");
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
}(iterator_1.default));
exports.default = FilterIterator;

},{"../util":26,"./iterator":16}],13:[function(require,module,exports){
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
var Util = require("../util");
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
        var filter = new filter_1.default(this._source, function (x, idx) { return _this.keySelector(x) === key; });
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
}(iterator_1.default));
exports.default = GroupByIterator;

},{"../util":26,"./filter":12,"./iterator":16}],14:[function(require,module,exports){
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
var Util = require("../util");
var GroupJoinIterator = (function (_super) {
    __extends(GroupJoinIterator, _super);
    function GroupJoinIterator(outer, inner, outerKeySelector, innerKeySelector, resultSelector) {
        var _this = _super.call(this, outer) || this;
        _this.inner = inner;
        _this.outerKeySelector = outerKeySelector;
        _this.innerKeySelector = innerKeySelector;
        _this.resultSelector = resultSelector;
        return _this;
    }
    GroupJoinIterator.prototype.next = function () {
        var _this = this;
        var outerItem;
        var innerItem;
        do {
            outerItem = _super.prototype.next.call(this);
            if (outerItem.done)
                return { value: undefined, done: true };
        } while (Util.isUndefined(outerItem.value));
        var outerKey = this.outerKeySelector(outerItem.value);
        var innerSelection = new filter_1.default(this.inner, function (x, idx) { return outerKey === _this.innerKeySelector(x); });
        var innerArray = [];
        while (!(innerItem = innerSelection.next()).done) {
            innerArray.push(innerItem.value);
        }
        return {
            value: this.resultSelector(outerItem.value, innerArray),
            done: outerItem.done
        };
    };
    return GroupJoinIterator;
}(iterator_1.default));
exports.default = GroupJoinIterator;

},{"../util":26,"./filter":12,"./iterator":16}],15:[function(require,module,exports){
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
var Util = require("../util");
var iterator_1 = require("./iterator");
var IntersectIterator = (function (_super) {
    __extends(IntersectIterator, _super);
    function IntersectIterator(source, other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var _this = _super.call(this, source) || this;
        _this.comparer = comparer;
        if (other instanceof iterator_1.default) {
            _this.other = other;
        }
        else {
            _this.other = new iterator_1.default(other);
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
}(iterator_1.default));
exports.default = IntersectIterator;

},{"../util":26,"./iterator":16}],16:[function(require,module,exports){
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
exports.default = BaseIterator;

},{}],17:[function(require,module,exports){
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
var Util = require("../util");
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
                this_1._currentInnerSelection = new filter_1.default(this_1.inner, function (x) { return outerKey_1 === _this.innerKeySelector(x); });
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
}(iterator_1.default));
exports.default = JoinIterator;

},{"../util":26,"./filter":12,"./iterator":16}],18:[function(require,module,exports){
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
var _1 = require("./");
var Util = require("../util");
var Linq = (function () {
    function Linq(source) {
        this._source = (source instanceof _1.BaseIterator)
            ? source
            : new _1.MapIterator(source, function (item) { return item; });
    }
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    Linq.prototype.map = function (callback) {
        return new Linq(new _1.MapIterator(this._source, callback));
        // try { return new Linq(new MapIterator(this._source, callback)); }
        // catch (ex) { throw this._errorHandler(ex) }
    };
    /**
     * Creates a new sequence with the results of calling a provided function on every element in this array.
     * @param callback Function that produces an element of the new sequence
     */
    Linq.map = function (source, callback) {
        return source.map(callback);
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.filter = function (predicate) {
        return new Linq(new _1.FilterIterator(this._source, predicate));
    };
    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate A function to test each element for a condition.
     */
    Linq.filter = function (source, predicate) {
        return source.filter(predicate);
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
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    Linq.prototype.take = function (count) {
        return new Linq(new _1.TakeIterator(this._source, count));
    };
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    Linq.take = function (source, count) {
        return source.slice(0, count);
        // return new Linq<TSource>(source).take(count).toArray();
    };
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.takeWhile = function (predicate) {
        return new Linq(new _1.TakeWhileIterator(this._source, predicate));
    };
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param predicate A function to test each element for a condition.
     */
    Linq.takeWhile = function (source, predicate) {
        return new Linq(source).takeWhile(predicate).toArray();
    };
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    Linq.prototype.skip = function (count) {
        return new Linq(new _1.SkipIterator(this._source, count));
    };
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    Linq.skip = function (source, count) {
        return source.slice(count);
        // return new Linq(source).skip(count).toArray();
    };
    /**
     * Merges items from the first sequence with the item at the corresponding index in the second sequence to
     * create a new sequence with the results of calling a provided function on every pair of items.
     * The zip will stop as soon as either of the sequences hits an undefined value.
     * @param other The second sequence to zip with
     * @param callback Function that produces an element of the new sequence
     */
    Linq.prototype.zip = function (other, callback) {
        return new Linq(new _1.ZipIterator(this._source, other, callback));
    };
    /**
     * Merges items from the first sequence with the item at the corresponding index in the second sequence to
     * create a new sequence with the results of calling a provided function on every pair of items.
     * The zip will stop as soon as either of the sequences hits an undefined value.
     * @param other The second sequence to zip with
     * @param callback Function that produces an element of the new sequence
     */
    Linq.zip = function (source, other, callback) {
        // TODO: Write static zip function without instantiating a new Linq object
        return new Linq(source).zip(other, callback).toArray();
    };
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    Linq.prototype.skipWhile = function (predicate) {
        return new Linq(new _1.SkipWhileIterator(this._source, predicate));
    };
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate A function to test each element for a condition.
     */
    Linq.skipWhile = function (source, predicate) {
        // TODO: Write static skipWhile function without instantiating a new Linq object
        return new Linq(source).skipWhile(predicate).toArray();
    };
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.prototype.orderBy = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = (keySelector) ? _makeValuePredicate(keySelector) : Util.defaultSelector;
        return new OrderedLinq(new _1.OrderIterator(this._source, selectorFn, comparer, false));
    };
    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.orderBy = function (source, keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        // TODO: Write static orderBy function without instantiating a new Linq object
        return new Linq(source).orderBy(keySelector, comparer).toArray();
    };
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.prototype.orderByDesc = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = (keySelector) ? _makeValuePredicate(keySelector) : Util.defaultSelector;
        return new OrderedLinq(new _1.OrderIterator(this._source, selectorFn, comparer, true));
    };
    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector A function to extract a key from an element.
     * @param comparer An IComparer<any> to compare keys.
     */
    Linq.orderByDesc = function (source, keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        // TODO: Write static orderByDesc function without instantiating a new Linq object
        return new Linq(source).orderByDesc(keySelector, comparer).toArray();
    };
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    Linq.prototype.sum = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Linq.sum(this.toArray(), selector);
    };
    /**
     * Computes the sum of the sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector A transform function to apply to each element.
     */
    Linq.sum = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        var i, sum = 0;
        for (i = 0; i < source.length; i++) {
            sum += selector(source[i]);
        }
        return sum;
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.average = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Linq.average(this.toArray(), selector);
    };
    /**
     * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.average = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        var i, total = 0;
        for (i = 0; i < source.length; i++) {
            total += selector(source[i]);
        }
        return total / source.length;
    };
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.min = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Linq.min(this.toArray(), selector);
    };
    /**
     * Computes the minimum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.min = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Math.min.apply(undefined, source.map(selector));
    };
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.prototype.max = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Linq.max(this.toArray(), selector);
    };
    /**
     * Computes the maximum of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
     * @param selector
     */
    Linq.max = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Math.max.apply(undefined, source.map(selector));
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
        return source.some(function (x) { return !!predicate(x) !== invert; });
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
        return source.every(function (x) { return !!predicate(x) !== invert; });
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
            throw new Error("The sequence contains more than one element.");
        if (arr.length == 1)
            return arr[0];
    };
    /**
     * Returns the matching item in the array. If there are several matches an exception will be thrown
     * @param predicate
     * @throws Error
     */
    Linq.single = function (source, predicate) {
        // TODO: Write static single function without instantiating a new Linq object
        return new Linq(source).single(predicate);
    };
    /**
     * Returns the first matching item in the array.
     * @param predicate
     */
    Linq.prototype.first = function (predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
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
        // TODO: Write static first function without instantiating a new Linq object
        if (!source || source.length === 0)
            return undefined;
        if (!predicate)
            return source[0];
        return new Linq(source).first(predicate);
    };
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    Linq.prototype.last = function (predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return this.reverse().first(predicate);
    };
    /**
     * Returns the last matching item in the array.
     * @param predicate
     */
    Linq.last = function (source, predicate) {
        // TODO: Write static last function without instantiating a new Linq object
        if (!source || source.length === 0)
            return undefined;
        if (!predicate)
            return source[source.length - 1];
        return new Linq(source).last(predicate);
    };
    /**
     * Get a list of items that exists in all datasets.
     * @param other The other dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    Linq.prototype.intersect = function (other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        return new Linq(new _1.IntersectIterator(this._source, other, comparer));
    };
    /**
     * Get a list of items that exists in all datasets.
     * @param a The first dataset.
     * @param b The second dataset to be compared to.
     * @param more If you have even more dataset to compare to.
     */
    Linq.intersect = function (source, other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var a = (source instanceof Linq) ? source.toArray() : source, b = (other instanceof Linq) ? other.toArray() : other;
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
    };
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param other The other dataset.
     */
    Linq.prototype.except = function (other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        return new Linq(new _1.ExceptIterator(this._source, other, comparer));
    };
    /**
     * Get a list of items that only exists in one of the datasets.
     * @param a The first dataset.
     * @param b The second dataset.
     */
    Linq.except = function (source, other, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var a = (source instanceof Linq) ? source.toArray() : source, b = (other instanceof Linq) ? other.toArray() : other;
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
    };
    /**
     * Get a list of unique items that exists one or more times in the dataset.
     */
    Linq.prototype.distinct = function (comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        return new Linq(new _1.DistinctIterator(this._source, comparer));
    };
    /**
     * Get a list of unique items that exists one or more times in any of the datasets.
     * @param source The datasets to be get distinct items from.
     */
    Linq.distinct = function (source, comparer) {
        if (comparer === void 0) { comparer = Util.defaultEqualityComparer; }
        var a = (source instanceof Linq) ? source.toArray() : source;
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
    };
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    Linq.prototype.groupBy = function (keySelector) {
        var pred = _makeValuePredicate(keySelector);
        return new Linq(new _1.GroupByIterator(this._source, pred));
    };
    /**
     * Groups the elements of a sequence according to a specified key selector function.
     * @param keySelector A function to extract the key for each element.
     */
    Linq.groupBy = function (source, keySelector) {
        var i, arr = [], pred = _makeValuePredicate(keySelector), group, groupValue;
        for (i = 0; i < source.length; i++) {
            groupValue = pred(source[i]);
            group = new Linq(arr).first(function (x) { return x.key == groupValue; });
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
    };
    /**
     * Correlates the elements of two sequences based on matching keys.
     * @param inner The sequence to join to the first sequence.
     * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
     * @param innerKeySelector A function to extract the join key from each element of the second sequence.
     * @param resultSelector A function to create a result element from two matching elements.
     */
    Linq.prototype.join = function (inner, outerKeySelector, innerKeySelector, resultSelector) {
        var outerPred = _makeValuePredicate(outerKeySelector), innerPred = _makeValuePredicate(innerKeySelector);
        return new Linq(new _1.JoinIterator(this._source, inner, outerPred, innerPred, resultSelector));
    };
    /**
     * Correlates the elements of two sequences based on matching keys.
     * @param outer The first sequence to join.
     * @param inner The sequence to join to the first sequence.
     * @param outerKeySelector TA function to extract the join key from each element of the first sequence.
     * @param innerKeySelector A function to extract the join key from each element of the second sequence.
     * @param resultSelector A function to create a result element from two matching elements.
     */
    Linq.join = function (outer, inner, outerKeySelector, innerKeySelector, resultSelector) {
        // TODO: Write static join function without instantiating a new Linq object
        return new Linq(outer).join(inner, outerKeySelector, innerKeySelector, resultSelector).toArray();
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
    // [Symbol.iterator]() {
    //     let idx = 0;
    //     return {
    //         next(): BaseIteratorResult<any> {
    //             let res;
    //             if (Util.isArray(this._source)) {
    //                 res = Util.cast<Array<any>>(this._source)[idx++];
    //             } else {
    //                 do {
    //                     res = this._source.next();
    //                 } while (!Util.isUndefined(res));
    //                 idx++;
    //             }
    //             if (res) {
    //                 return {
    //                     done: false,
    //                     value: res,
    //                 };
    //             } else {
    //                 return {
    //                     done: true,
    //                     value: undefined,
    //                 };
    //             }
    //         }
    //     };
    // }
    /* Helper functions */
    Linq.prototype.contains = function (a) {
        var result;
        this.toArray().some(function (item) {
            if (item === a) {
                result = item;
                return true;
            }
        });
        return typeof result !== "undefined";
    };
    return Linq;
}());
exports.default = Linq;
function LQ(source) {
    return new Linq(source);
}
exports.LQ = LQ;
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
        var selectorFn = (keySelector) ? _makeValuePredicate(keySelector) : Util.defaultSelector;
        var orderIterator = this._source.getIteratorFromPipeline(_1.OrderIterator);
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
        var selectorFn = (keySelector) ? _makeValuePredicate(keySelector) : Util.defaultSelector;
        var orderIterator = this._source.getIteratorFromPipeline(_1.OrderIterator);
        orderIterator.thenBy(selectorFn, comparer, true);
        return this;
    };
    return OrderedLinq;
}(Linq));
exports.OrderedLinq = OrderedLinq;
function _makeValuePredicate(predicate) {
    if (Util.isString(predicate)) {
        var field_1 = predicate;
        predicate = (function (x) { return x[field_1]; });
    }
    else if (Util.isUndefined(predicate)) {
        predicate = (function () { return true; });
    }
    return predicate;
}

},{"../util":26,"./":"Linq"}],19:[function(require,module,exports){
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
var Util = require("../util");
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
}(iterator_1.default));
exports.default = MapIterator;

},{"../util":26,"./iterator":16}],20:[function(require,module,exports){
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
var Util = require("../util");
var OrderIterator = (function (_super) {
    __extends(OrderIterator, _super);
    function OrderIterator(source, keySelector, comparer, descending) {
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
    OrderIterator.prototype.next = function () {
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
    OrderIterator.prototype.thenBy = function (keySelector, comparer, descending) {
        if (keySelector === void 0) { keySelector = Util.defaultSelector; }
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        if (descending === void 0) { descending = false; }
        this._orders.push(new LinqOrder(keySelector, comparer, descending));
    };
    return OrderIterator;
}(iterator_1.default));
exports.default = OrderIterator;
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

},{"../util":26,"./iterator":16}],21:[function(require,module,exports){
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
}(iterator_1.default));
exports.default = SkipIterator;

},{"./iterator":16}],22:[function(require,module,exports){
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
var Util = require("../util");
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
}(iterator_1.default));
exports.default = SkipWhileIterator;

},{"../util":26,"./iterator":16}],23:[function(require,module,exports){
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
}(iterator_1.default));
exports.default = TakeIterator;

},{"./iterator":16}],24:[function(require,module,exports){
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
var Util = require("../util");
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
}(iterator_1.default));
exports.default = TakeWhileIterator;

},{"../util":26,"./iterator":16}],25:[function(require,module,exports){
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
var Util = require("../util");
var iterator_1 = require("./iterator");
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
}(iterator_1.default));
exports.default = ZipIterator;

},{"../util":26,"./iterator":16}],26:[function(require,module,exports){
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
var iterator_1 = require("./iterator");
exports.BaseIterator = iterator_1.default;
var filter_1 = require("./filter");
exports.FilterIterator = filter_1.default;
var map_1 = require("./map");
exports.MapIterator = map_1.default;
var order_1 = require("./order");
exports.OrderIterator = order_1.default;
var skip_1 = require("./skip");
exports.SkipIterator = skip_1.default;
var skipWhile_1 = require("./skipWhile");
exports.SkipWhileIterator = skipWhile_1.default;
var take_1 = require("./take");
exports.TakeIterator = take_1.default;
var takeWhile_1 = require("./takeWhile");
exports.TakeWhileIterator = takeWhile_1.default;
var join_1 = require("./join");
exports.JoinIterator = join_1.default;
var groupJoin_1 = require("./groupJoin");
exports.GroupJoinIterator = groupJoin_1.default;
var groupBy_1 = require("./groupBy");
exports.GroupByIterator = groupBy_1.default;
var zip_1 = require("./zip");
exports.ZipIterator = zip_1.default;
var except_1 = require("./except");
exports.ExceptIterator = except_1.default;
var intersect_1 = require("./intersect");
exports.IntersectIterator = intersect_1.default;
var distinct_1 = require("./distinct");
exports.DistinctIterator = distinct_1.default;
var linq_1 = require("./linq");
exports.Linq = linq_1.default;
exports.LQ = linq_1.LQ;
exports.OrderedLinq = linq_1.OrderedLinq;

},{"./distinct":10,"./except":11,"./filter":12,"./groupBy":13,"./groupJoin":14,"./intersect":15,"./iterator":16,"./join":17,"./linq":18,"./map":19,"./order":20,"./skip":21,"./skipWhile":22,"./take":23,"./takeWhile":24,"./zip":25}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9iaW5hcnlUcmVlLmpzIiwiZGlzdC9zcmMvY29sbGVjdGlvbnMvbGlua2VkTGlzdC5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL2xpc3QuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9xdWV1ZS5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL3N0YWNrLmpzIiwiZGlzdC9zcmMvaGVscGVycy9kYXRlcy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvbnVtYmVycy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvc3RyaW5ncy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvdXJsLmpzIiwiZGlzdC9zcmMvbGlucS9kaXN0aW5jdC5qcyIsImRpc3Qvc3JjL2xpbnEvZXhjZXB0LmpzIiwiZGlzdC9zcmMvbGlucS9maWx0ZXIuanMiLCJkaXN0L3NyYy9saW5xL2dyb3VwQnkuanMiLCJkaXN0L3NyYy9saW5xL2dyb3VwSm9pbi5qcyIsImRpc3Qvc3JjL2xpbnEvaW50ZXJzZWN0LmpzIiwiZGlzdC9zcmMvbGlucS9pdGVyYXRvci5qcyIsImRpc3Qvc3JjL2xpbnEvam9pbi5qcyIsImRpc3Qvc3JjL2xpbnEvbGlucS5qcyIsImRpc3Qvc3JjL2xpbnEvbWFwLmpzIiwiZGlzdC9zcmMvbGlucS9vcmRlci5qcyIsImRpc3Qvc3JjL2xpbnEvc2tpcC5qcyIsImRpc3Qvc3JjL2xpbnEvc2tpcFdoaWxlLmpzIiwiZGlzdC9zcmMvbGlucS90YWtlLmpzIiwiZGlzdC9zcmMvbGlucS90YWtlV2hpbGUuanMiLCJkaXN0L3NyYy9saW5xL3ppcC5qcyIsImRpc3Qvc3JjL3V0aWwvaW5kZXguanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9pbmRleC5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvaW5kZXguanMiLCJkaXN0L3NyYy9saW5xL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM21CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgcXVldWVfMSA9IHJlcXVpcmUoXCIuL3F1ZXVlXCIpO1xyXG52YXIgQmluYXJ5VHJlZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBCaW5hcnlUcmVlKHNlbGVjdG9yRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0b3IgPSBzZWxlY3RvckZ1bmN0aW9uIHx8IFV0aWwuZGVmYXVsdFNlbGVjdG9yO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYW4gaXRlbSBpbnRvIHRoZSB0cmVlLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gUmV0dXJuIGZhbHNlIGlmIHRoZSBpdGVtIGFscmVhZHkgZXhpc3RzLlxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gdGhpcy5pbnNlcnRBdXgodGhpcy5fcm9vdCwgbmV3IFRyZWVOb2RlKGl0ZW0pKTsgfTtcclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0IGEgcmFuZ2Ugb2YgaXRlbXMgaW50byB0aGUgdHJlZS5cclxuICAgICAqIEBwYXJhbSBpdGVtXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmluc2VydFJhbmdlID0gZnVuY3Rpb24gKGl0ZW1zKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IF90aGlzLmluc2VydChpdGVtKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYW4gaXRlbSBpbnRvIHRoZSB0cmVlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gbm9kZSBUaGUgbm9kZSB3ZSB3aXNoIHRvIGluc2VydFxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbnNlcnRBdXggPSBmdW5jdGlvbiAodHJlZSwgbm9kZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yb290ID0gbm9kZTtcclxuICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb21wID0gVXRpbC5kZWZhdWx0Q29tcGFyZXIodGhpcy5fc2VsZWN0b3Iobm9kZS52YWx1ZSksIHRoaXMuX3NlbGVjdG9yKHRyZWUudmFsdWUpKTtcclxuICAgICAgICBpZiAoY29tcCA8IDApIHtcclxuICAgICAgICAgICAgaWYgKHRyZWUubGVmdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRBdXgodHJlZS5sZWZ0LCBub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyZWUubGVmdCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHRyZWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb21wID4gMCkge1xyXG4gICAgICAgICAgICBpZiAodHJlZS5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRBdXgodHJlZS5yaWdodCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlLnJpZ2h0ID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdHJlZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fc2VhcmNoKHRoaXMuX3Jvb3QsIGl0ZW0pO1xyXG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlID09PSB0aGlzLl9yb290KSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcm9vdDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub2RlLnZhbHVlIDwgbm9kZS5wYXJlbnQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnQubGVmdDtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIG5vZGUucGFyZW50LnJpZ2h0O1xyXG4gICAgICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHZhciByaWdodCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHdoaWxlIChyaWdodC5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC5yaWdodDtcclxuICAgICAgICAgICAgfSAvLyBHZXQgcmlnaHQgbW9zdCBpdGVtLlxyXG4gICAgICAgICAgICBpZiAocmlnaHQubGVmdCkge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC5sZWZ0OyAvLyBJZiB0aGUgcmlnaHQgbW9zdCBpdGVtIGhhcyBhIGxlZnQsIHVzZSB0aGF0IGluc3RlYWQuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocmlnaHQudmFsdWUgIT09IG5vZGUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByaWdodC5sZWZ0ID0gcmlnaHQucGFyZW50LmxlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQubGVmdC5wYXJlbnQgPSByaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmlnaHQucGFyZW50LnZhbHVlID09PSBub2RlLnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0LnBhcmVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByaWdodC5wYXJlbnQgPSBub2RlLnBhcmVudDtcclxuICAgICAgICAgICAgbm9kZS5sZWZ0ID0gbm9kZS5yaWdodCA9IG5vZGUucGFyZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gdGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdCA9IHJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3Jvb3QucGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSB0cmVlIGNvbnRhaW5zIGEgZ2l2ZW4gaXRlbS5cclxuICAgICAqIEBwYXJhbSBpdGVtXHJcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBpdGVtIGV4aXN0cyBpbiB0aGUgdHJlZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiAhIXRoaXMuX3NlYXJjaCh0aGlzLl9yb290LCBpdGVtKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGUgY2FsbGJhY2sgZm9yIGVhY2ggaXRlbS5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqIEBzZWUgaW5vcmRlclRyYXZlcnNhbFxyXG4gICAgICovXHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsKGNhbGxiYWNrKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIE1ha2UgaW50byBhbiAob3JkZXJlZCkgYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkgeyBhcnIucHVzaChpdGVtKTsgfSk7XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlIHRoZSB0cmVlIGFuZCBleGVjdXRlIGNhbGxiYWNrIHdoZW4gZW50ZXJpbmcgKHBhc3Npbmcgb24gdGhlIGxlZnQgc2lkZSBvZikgYW4gaXRlbS5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucHJlb3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5wcmVvcmRlclRyYXZlcnNhbEF1eCh0aGlzLl9yb290LCBjYWxsYmFjaywgeyBzdG9wOiBmYWxzZSB9KTsgfTtcclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgd2hlbiBlbnRlcmluZyAocGFzc2luZyBvbiB0aGUgbGVmdCBzaWRlIG9mKSBhbiBpdGVtLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgV2hhdCBzaG91bGQgd2UgZG8gd2hlbiB3ZSBnZXQgdGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gc2lnbmFsIE9iamVjdCAoc28gaXQncyBhIHJlZmVyZW5jZSkgdGhhdCB3ZSB1c2UgdG8ga25vdyB3aGVuIHRoZSBjYWxsYmFjayByZXR1cm5lZCBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucHJlb3JkZXJUcmF2ZXJzYWxBdXggPSBmdW5jdGlvbiAodHJlZSwgY2FsbGJhY2ssIHNpZ25hbCkge1xyXG4gICAgICAgIGlmICghdHJlZSB8fCBzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHNpZ25hbC5zdG9wID0gKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcmVvcmRlclRyYXZlcnNhbEF1eCh0cmVlLmxlZnQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5yaWdodCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayB3aGVuIHBhc3NpbmcgKHBhc3MgdW5kZXIgdGhlIGl0ZW0pIGFuIGl0ZW1cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuaW5vcmRlclRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykgeyB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodGhpcy5fcm9vdCwgY2FsbGJhY2ssIHsgc3RvcDogZmFsc2UgfSk7IH07XHJcbiAgICAvKipcclxuICAgICAqIFRyYXZlcnNlIHRoZSB0cmVlIGFuZCBleGVjdXRlIGNhbGxiYWNrIHdoZW4gcGFzc2luZyAocGFzcyB1bmRlciB0aGUgaXRlbSkgYW4gaXRlbVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgV2hhdCBzaG91bGQgd2UgZG8gd2hlbiB3ZSBnZXQgdGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gc2lnbmFsIE9iamVjdCAoc28gaXQncyBhIHJlZmVyZW5jZSkgdGhhdCB3ZSB1c2UgdG8ga25vdyB3aGVuIHRoZSBjYWxsYmFjayByZXR1cm5lZCBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuaW5vcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uICh0cmVlLCBjYWxsYmFjaywgc2lnbmFsKSB7XHJcbiAgICAgICAgaWYgKCF0cmVlIHx8IHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsQXV4KHRyZWUubGVmdCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgc2lnbmFsLnN0b3AgPSAoY2FsbGJhY2sodHJlZS52YWx1ZSkgPT09IGZhbHNlKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5yaWdodCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayB3aGVuIGxlYXZpbmcgKHBhc3Npbmcgb24gdGhlIHJpZ2h0IHNpZGUgb2YpIGFuIGl0ZW1cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucG9zdG9yZGVyVHJhdmVyc2FsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7IHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayB3aGVuIHBhc3NpbmcgKHBhc3MgdW5kZXIgdGhlIGl0ZW0pIGFuIGl0ZW1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0gdHJlZSBXaGljaCBUcmVlTm9kZSB3ZSdyZSB0cmF2ZXJzaW5nLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICogQHBhcmFtIHNpZ25hbCBPYmplY3QgKHNvIGl0J3MgYSByZWZlcmVuY2UpIHRoYXQgd2UgdXNlIHRvIGtub3cgd2hlbiB0aGUgY2FsbGJhY2sgcmV0dXJuZWQgZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLnBvc3RvcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uICh0cmVlLCBjYWxsYmFjaywgc2lnbmFsKSB7XHJcbiAgICAgICAgaWYgKCF0cmVlIHx8IHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wb3N0b3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5sZWZ0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnBvc3RvcmRlclRyYXZlcnNhbEF1eCh0cmVlLnJpZ2h0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBzaWduYWwuc3RvcCA9IChjYWxsYmFjayh0cmVlLnZhbHVlKSA9PT0gZmFsc2UpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgb25lIGxldmVsIGF0IGEgdGltZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayBvbiBlYWNoIGFuIGl0ZW1cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubGV2ZWxUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5sZXZlbFRyYXZlcnNhbEF1eCh0aGlzLl9yb290LCBjYWxsYmFjaywgeyBzdG9wOiBmYWxzZSB9KTsgfTtcclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgb25lIGxldmVsIGF0IGEgdGltZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayBvbiBlYWNoIGFuIGl0ZW1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0gdHJlZSBXaGljaCBUcmVlTm9kZSB3ZSdyZSB0cmF2ZXJzaW5nLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICogQHBhcmFtIHNpZ25hbCBPYmplY3QgKHNvIGl0J3MgYSByZWZlcmVuY2UpIHRoYXQgd2UgdXNlIHRvIGtub3cgd2hlbiB0aGUgY2FsbGJhY2sgcmV0dXJuZWQgZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmxldmVsVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICB2YXIgcXVldWUgPSBuZXcgcXVldWVfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKHRyZWUpXHJcbiAgICAgICAgICAgIHF1ZXVlLmVucXVldWUodHJlZSk7XHJcbiAgICAgICAgd2hpbGUgKCFVdGlsLmlzVW5kZWZpbmVkKHRyZWUgPSBxdWV1ZS5kZXF1ZXVlKCkpKSB7XHJcbiAgICAgICAgICAgIHNpZ25hbC5zdG9wID0gc2lnbmFsLnN0b3AgfHwgKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHRyZWUubGVmdClcclxuICAgICAgICAgICAgICAgIHF1ZXVlLmVucXVldWUodHJlZS5sZWZ0KTtcclxuICAgICAgICAgICAgaWYgKHRyZWUucmlnaHQpXHJcbiAgICAgICAgICAgICAgICBxdWV1ZS5lbnF1ZXVlKHRyZWUucmlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgbWluaW11bSB2YWx1ZSBpbiB0aGUgdHJlZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtaW4gPSB0aGlzLm1pbkF1eCh0aGlzLl9yb290KTtcclxuICAgICAgICBpZiAobWluKVxyXG4gICAgICAgICAgICByZXR1cm4gbWluLnZhbHVlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtaW5pbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLm1pbkF1eCA9IGZ1bmN0aW9uICh0cmVlKSB7XHJcbiAgICAgICAgaWYgKHRyZWUubGVmdClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWluQXV4KHRyZWUubGVmdCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdHJlZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgbWF4aW11bSB2YWx1ZSBpbiB0aGUgdHJlZS5cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtYXggPSB0aGlzLm1heEF1eCh0aGlzLl9yb290KTtcclxuICAgICAgICBpZiAobWF4KVxyXG4gICAgICAgICAgICByZXR1cm4gbWF4LnZhbHVlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtYXhpbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLm1heEF1eCA9IGZ1bmN0aW9uICh0cmVlKSB7XHJcbiAgICAgICAgaWYgKHRyZWUucmlnaHQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1heEF1eCh0cmVlLnJpZ2h0KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0cmVlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBkZXB0aCBvZiBhIHRyZWUuXHJcbiAgICAgKiAtMSA9IEVtcHR5XHJcbiAgICAgKiAwID0gT25seSByb290XHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmRlcHRoID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5kZXB0aEF1eCh0aGlzLl9yb290KTsgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtaW5pbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICogLTEgPSBFbXB0eVxyXG4gICAgICogMCA9IE9ubHkgcm9vdFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKi9cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmRlcHRoQXV4ID0gZnVuY3Rpb24gKHRyZWUpIHtcclxuICAgICAgICBpZiAoIXRyZWUpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5kZXB0aEF1eCh0cmVlLmxlZnQpLCB0aGlzLmRlcHRoQXV4KHRyZWUucmlnaHQpKSArIDE7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZWFyY2ggdGhlIHRyZWUgZm9yIGEgc3BlY2lmaWMgaXRlbS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0gdHJlZSBXaGljaCBUcmVlTm9kZSB3ZSdyZSB0cmF2ZXJzaW5nLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqL1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuX3NlYXJjaCA9IGZ1bmN0aW9uICh0cmVlLCBpdGVtKSB7XHJcbiAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQodHJlZSkpXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRyZWUudmFsdWUgPT09IGl0ZW0pXHJcbiAgICAgICAgICAgIHJldHVybiB0cmVlO1xyXG4gICAgICAgIHZhciBjb21wID0gVXRpbC5kZWZhdWx0Q29tcGFyZXIodGhpcy5fc2VsZWN0b3IoaXRlbSksIHRoaXMuX3NlbGVjdG9yKHRyZWUudmFsdWUpKTtcclxuICAgICAgICBpZiAoY29tcCA8IDApIHtcclxuICAgICAgICAgICAgdHJlZSA9IHRoaXMuX3NlYXJjaCh0cmVlLmxlZnQsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb21wID4gMCkge1xyXG4gICAgICAgICAgICB0cmVlID0gdGhpcy5fc2VhcmNoKHRyZWUucmlnaHQsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJlZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQmluYXJ5VHJlZTtcclxufSgpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gQmluYXJ5VHJlZTtcclxudmFyIFRyZWVOb2RlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFRyZWVOb2RlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJZiB0aGUgbm9kZSBoYXMgbmVpdGhlciBhIHJpZ2h0IG9yIGxlZnQgY2hpbGQuXHJcbiAgICAgKi9cclxuICAgIFRyZWVOb2RlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gIXRoaXMubGVmdCAmJiAhdGhpcy5yaWdodDsgfTtcclxuICAgIHJldHVybiBUcmVlTm9kZTtcclxufSgpKTtcclxuZXhwb3J0cy5UcmVlTm9kZSA9IFRyZWVOb2RlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1iaW5hcnlUcmVlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiBSZXByZXNlbnQgYSBkb3VibHktbGlua2VkIGxpc3QgaW4gd2hpY2ggeW91IGNhbiBhZGQgYW5kIHJlbW92ZSBpdGVtcy5cclxuICovXHJcbnZhciBMaW5rZWRMaXN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGl0ZW1zIFRbXSBJdGVtcyB0byBzdGFydCBmaWxsaW5nIHRoZSBzdGFjayB3aXRoLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBMaW5rZWRMaXN0KGl0ZW1zKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgaWYgKGl0ZW1zKVxyXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7IF90aGlzLmluc2VydCh4KTsgfSk7XHJcbiAgICB9XHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5fZ2V0Tm9kZSA9IGZ1bmN0aW9uIChhdCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBlbHNlIGlmIChhdCA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmlyc3Q7XHJcbiAgICAgICAgZWxzZSBpZiAoYXQgPiB0aGlzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3Q7XHJcbiAgICAgICAgdmFyIGksIG5vZGU7XHJcbiAgICAgICAgaWYgKGF0IDwgdGhpcy5sZW5ndGggLyAyKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIGZldGNoaW5nIGZyb20gZmlyc3QgaGFsZiBvZiBsaXN0LCBzdGFydCBmcm9tIHRoZSBiZWdpbm5pbmdcclxuICAgICAgICAgICAgbm9kZSA9IHRoaXMuX2ZpcnN0O1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gaWYgZmV0Y2hpbmcgZnJvbSBsYXN0IGhhbGYgb2YgbGlzdCwgc3RhcnQgZnJvbSB0aGUgZW5kXHJcbiAgICAgICAgICAgIG5vZGUgPSB0aGlzLl9sYXN0O1xyXG4gICAgICAgICAgICBmb3IgKGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPiBhdDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5wcmV2O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFuIGl0ZW0gYXQgYSBjZXJ0YWluIHBvc2l0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoYXQpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2dldE5vZGUoYXQpO1xyXG4gICAgICAgIGlmIChub2RlKVxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS52YWw7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYW4gaXRlbSBhdCB0aGUgZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHZhciBub2RlID0gbmV3IExpbmtlZExpc3ROb2RlKGl0ZW0pO1xyXG4gICAgICAgIGlmICghdGhpcy5fZmlyc3QpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLl9sYXN0ID0gbm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG5vZGUucHJldiA9IHRoaXMuX2xhc3Q7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3QubmV4dCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3QgPSBub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKyt0aGlzLmxlbmd0aDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEluc2VydCBhbiBpdGVtIGF0IGEgY2VydGFpbiBwb3NpdGlvbiBpbiB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuaW5zZXJ0QXQgPSBmdW5jdGlvbiAoYXQsIGl0ZW0pIHtcclxuICAgICAgICBpZiAoYXQgPj0gdGhpcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydChpdGVtKTtcclxuICAgICAgICB2YXIgbm9kZSA9IG5ldyBMaW5rZWRMaXN0Tm9kZShpdGVtKSwgbmV4dCA9IHRoaXMuX2dldE5vZGUoYXQpLCBwcmV2ID0gbmV4dC5wcmV2O1xyXG4gICAgICAgIGlmIChwcmV2KVxyXG4gICAgICAgICAgICBwcmV2Lm5leHQgPSBub2RlO1xyXG4gICAgICAgIG5leHQucHJldiA9IG5vZGU7XHJcbiAgICAgICAgbm9kZS5wcmV2ID0gcHJldjtcclxuICAgICAgICBub2RlLm5leHQgPSBuZXh0O1xyXG4gICAgICAgIGlmIChhdCA9PT0gMClcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSBub2RlO1xyXG4gICAgICAgIHJldHVybiArK3RoaXMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhIGNlcnRhaW4gcG9zaXRpb24gaW4gdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLnJlbW92ZUF0ID0gZnVuY3Rpb24gKGF0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2dldE5vZGUoYXQpO1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAvLyBvbmx5IDEgaXRlbSBsZWZ0IHRvIHJlbW92ZS5cclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLl9sYXN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChub2RlID09PSB0aGlzLl9maXJzdCkge1xyXG4gICAgICAgICAgICAvLyByZW1vdmluZyB0aGUgZmlyc3QgaXRlbS5cclxuICAgICAgICAgICAgbm9kZS5uZXh0LnByZXYgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0ID0gbm9kZS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChub2RlID09PSB0aGlzLl9sYXN0KSB7XHJcbiAgICAgICAgICAgIC8vIHJlbW92aW5nIHRoZSBsYXN0IGl0ZW0uXHJcbiAgICAgICAgICAgIG5vZGUucHJldi5uZXh0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0ID0gbm9kZS5wcmV2O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcmVtb3ZpbmcgaXRlbSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBsaXN0XHJcbiAgICAgICAgICAgIG5vZGUucHJldi5uZXh0ID0gbm9kZS5uZXh0O1xyXG4gICAgICAgICAgICBub2RlLm5leHQucHJldiA9IG5vZGUucHJldjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0tdGhpcy5sZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhcnMgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX2ZpcnN0ID0gdGhpcy5fbGFzdCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpbmtlZExpc3Q7XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IExpbmtlZExpc3Q7XHJcbnZhciBMaW5rZWRMaXN0Tm9kZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMaW5rZWRMaXN0Tm9kZSh2YWwpIHtcclxuICAgICAgICB0aGlzLnZhbCA9IHZhbDtcclxuICAgIH1cclxuICAgIHJldHVybiBMaW5rZWRMaXN0Tm9kZTtcclxufSgpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlua2VkTGlzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgTGlzdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBuZXcgbGlzdCBvYmplY3QuXHJcbiAgICAgKiBVdGlsaXplcyBhIG5vcm1hbCBhcnJheSBiZWhpbmQgdGhlIHNjZW5lcyBhbmQgbmF0aXZlIGZ1bmN0aW9ucyB3aGVuZXZlciBwb3NzaWJsZSxcclxuICAgICAqIGJ1dCB3aXRoIGZ1bmN0aW9ucyBrbm93biBmb3IgYSBMaXN0LlxyXG4gICAgICogQHBhcmFtIHNvdXJjZSBUaGUgc291cmNlIGFycmF5IGZyb20gd2hpY2ggdG8gY3JlYXRlIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBMaXN0KHNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZSB8fCBbXTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShMaXN0LnByb3RvdHlwZSwgXCJsZW5ndGhcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fc291cmNlLmxlbmd0aDsgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgbGlzdCBhcyBhIGFycmF5LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2U7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGFuIG9iamVjdCB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGl0ZW0gVGhlIG9iamVjdCB0byBiZSBhZGRlZCB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QuYWRkID0gZnVuY3Rpb24gKHNvdXJjZSwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmFkZChpdGVtKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBlbGVtZW50cyBvZiB0aGUgc3BlY2lmaWVkIGNvbGxlY3Rpb24gdG8gdGhlIGVuZCBvZiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHdob3NlIGVsZW1lbnRzIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5hZGRSYW5nZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gKGNvbGxlY3Rpb24gaW5zdGFuY2VvZiBMaXN0KSA/IGNvbGxlY3Rpb24udG9BcnJheSgpIDogY29sbGVjdGlvbjtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLl9zb3VyY2UsIGl0ZW1zKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LmFkZFJhbmdlID0gZnVuY3Rpb24gKHNvdXJjZSwgY29sbGVjdGlvbikge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmFkZFJhbmdlKGNvbGxlY3Rpb24pLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvLyAvKipcclxuICAgIC8vICAqIFJldHVybnMgYSBuZXcgcmVhZCBvbmx5IGluc3RhbmNlIG9mIHRoZSBsaXN0LlxyXG4gICAgLy8gICovXHJcbiAgICAvLyBhc1JlYWRPbmx5KCk6IExpc3Q8VD4ge1xyXG4gICAgLy8gICAgIHJldHVybiBuZXcgTGlzdChPYmplY3QuZnJlZXplKHRoaXMuX3NvdXJjZS5zbGljZSgpKSk7XHJcbiAgICAvLyB9XHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIHRoZSBzcGVjaWZpZWQgYWN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UuZm9yRWFjaChjYWxsYmFjayk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5mb3JFYWNoID0gZnVuY3Rpb24gKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBuZXcgTGlzdChzb3VyY2UpLmZvckVhY2goY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU2VhcmNoZXMgZm9yIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGFuZCByZXR1cm5zIHRoZSB6ZXJvLWJhc2VkIGluZGV4IG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIHdpdGhpbiB0aGUgc3BlY2lmaWVkIHJhbmdlIG9mIGVsZW1lbnRzIGluIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGl0ZW0gVGhlIG9iamVjdCB0byBsb2NhdGUgaW4gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHNlYXJjaC5cclxuICAgICAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBzZWN0aW9uIHRvIHNlYXJjaC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIChpdGVtLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHZvaWQgMCkgeyBpbmRleCA9IDA7IH1cclxuICAgICAgICBpZiAoY291bnQgPT09IHZvaWQgMCkgeyBjb3VudCA9IHRoaXMubGVuZ3RoOyB9XHJcbiAgICAgICAgdmFyIGlkeCA9IHRoaXMuX3NvdXJjZS5pbmRleE9mKGl0ZW0sIGluZGV4KTtcclxuICAgICAgICBpZiAoaWR4ID4gY291bnQgLSBpbmRleCArIDEpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gaWR4O1xyXG4gICAgfTtcclxuICAgIExpc3QuaW5kZXhPZiA9IGZ1bmN0aW9uIChzb3VyY2UsIGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gMDsgfVxyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gc291cmNlLmxlbmd0aDsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmluZGV4T2YoaXRlbSwgaW5kZXgsIGNvdW50KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNlYXJjaGVzIGZvciB0aGUgc3BlY2lmaWVkIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgemVyby1iYXNlZCBpbmRleCBvZiB0aGUgbGFzdCBvY2N1cnJlbmNlIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgZWxlbWVudHMgaW4gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBzdGFydGluZyBpbmRleCBvZiB0aGUgYmFja3dhcmQgc2VhcmNoLlxyXG4gICAgICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIHNlY3Rpb24gdG8gc2VhcmNoLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIChpdGVtLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHZvaWQgMCkgeyBpbmRleCA9IHRoaXMubGVuZ3RoIC0gMTsgfVxyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gdGhpcy5sZW5ndGg7IH1cclxuICAgICAgICB2YXIgaWR4ID0gdGhpcy5fc291cmNlLmxhc3RJbmRleE9mKGl0ZW0sIGluZGV4KTtcclxuICAgICAgICBpZiAoaWR4IDwgaW5kZXggKyAxIC0gY291bnQpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gaWR4O1xyXG4gICAgfTtcclxuICAgIExpc3QubGFzdEluZGV4T2YgPSBmdW5jdGlvbiAoc291cmNlLCBpdGVtLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHZvaWQgMCkgeyBpbmRleCA9IHNvdXJjZS5sZW5ndGggLSAxOyB9XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSBzb3VyY2UubGVuZ3RoOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkubGFzdEluZGV4T2YoaXRlbSwgaW5kZXgsIGNvdW50KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEluc2VydHMgYW4gZWxlbWVudCBpbnRvIHRoZSBsaXN0IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgaW5kZXggYXQgd2hpY2ggaXRlbSBzaG91bGQgYmUgaW5zZXJ0ZWQuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIGluc2VydC5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgMCwgaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5pbnNlcnQgPSBmdW5jdGlvbiAoc291cmNlLCBpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmluc2VydChpbmRleCwgaXRlbSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0cyB0aGUgZWxlbWVudHMgb2YgYSBjb2xsZWN0aW9uIGludG8gdGhlIGxpc3QgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBpbmRleCBhdCB3aGljaCB0aGUgbmV3IGVsZW1lbnRzIHNob3VsZCBiZSBpbnNlcnRlZC5cclxuICAgICAqIEBwYXJhbSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHdob3NlIGVsZW1lbnRzIHNob3VsZCBiZSBpbnNlcnRlZCBpbnRvIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5pbnNlcnRSYW5nZSA9IGZ1bmN0aW9uIChpbmRleCwgY29sbGVjdGlvbikge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IChjb2xsZWN0aW9uIGluc3RhbmNlb2YgTGlzdCkgPyBjb2xsZWN0aW9uLnRvQXJyYXkoKSA6IGNvbGxlY3Rpb247XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0aGlzLl9zb3VyY2UsIG5ldyBBcnJheShpbmRleCwgMCkuY29uY2F0KGl0ZW1zKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5pbnNlcnRSYW5nZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4LCBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuaW5zZXJ0UmFuZ2UoaW5kZXgsIGNvbGxlY3Rpb24pLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBHZXRzIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VbaW5kZXhdO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxyXG4gICAgICogQHBhcmFtIGluZGV4IFNldHMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqIEBwYXJhbSBpdGVtIFRoZSBvYmplY3QgdG8gc2V0IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIGlmIChpbmRleCA+IHRoaXMubGVuZ3RoKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbmRleCB3YXMgb3V0IG9mIHJhbmdlLiBNdXN0IGJlIG5vbi1uZWdhdGl2ZSBhbmQgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBjb2xsZWN0aW9uLlwiKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZVtpbmRleF0gPSBpdGVtO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhIHNwZWNpZmljIG9iamVjdCBmcm9tIHRoZSBMaXN0KE9m4oCCVCkuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIHJlbW92ZSBmcm9tIHRoZSBMaXN0KE9m4oCCVCkuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQXQodGhpcy5fc291cmNlLmluZGV4T2YoaXRlbSkpO1xyXG4gICAgfTtcclxuICAgIExpc3QucmVtb3ZlID0gZnVuY3Rpb24gKHNvdXJjZSwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLnJlbW92ZShpdGVtKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBtYXRjaCB0aGUgY29uZGl0aW9ucyBkZWZpbmVkIGJ5IHRoZSBzcGVjaWZpZWQgcHJlZGljYXRlLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBUaGUgcHJlZGljYXRlIGRlbGVnYXRlIHRoYXQgZGVmaW5lcyB0aGUgY29uZGl0aW9ucyBvZiB0aGUgZWxlbWVudHMgdG8gcmVtb3ZlLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5yZW1vdmVBbGwgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKCFwcmVkaWNhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZSgwKTsgLy8gc3BsaWNlIHJhdGhlciB0aGFuIHJldHVybmluZyBhbiBlbXB0eSBhcnJheSBsZXQncyB1cyBrZWVwIHRoZSByZWZlcmVuY2VcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gdm9pZCAwO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWRpY2F0ZSh0aGlzLl9zb3VyY2VbaV0sIGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZW1vdmVBbGwgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZW1vdmVBbGwocHJlZGljYXRlKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXggb2YgdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgaW5kZXggb2YgdGhlIGVsZW1lbnQgdG8gcmVtb3ZlLlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5yZW1vdmVBdCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4IG9mIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSB6ZXJvLWJhc2VkIGluZGV4IG9mIHRoZSBlbGVtZW50IHRvIHJlbW92ZS5cclxuICAgICAqL1xyXG4gICAgTGlzdC5yZW1vdmVBdCA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlQXQoaW5kZXgpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYSByYW5nZSBvZiBlbGVtZW50cyBmcm9tIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSB6ZXJvLWJhc2VkIHN0YXJ0aW5nIGluZGV4IG9mIHRoZSByYW5nZSBvZiBlbGVtZW50cyB0byByZW1vdmUuXHJcbiAgICAgKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZW1vdmUuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZVJhbmdlID0gZnVuY3Rpb24gKGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5zcGxpY2UoaW5kZXgsIGNvdW50ICsgaW5kZXggLSAxKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnJlbW92ZVJhbmdlID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlUmFuZ2UoaW5kZXgsIGNvdW50KS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBlbGVtZW50cyBmcm9tIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBMaXN0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUFsbCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QuY2xlYXIgPSBmdW5jdGlvbiAoc291cmNlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuY2xlYXIoKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbnVtYmVyIHRoYXQgcmVwcmVzZW50cyBob3cgbWFueSBlbGVtZW50cyBpbiB0aGUgc3BlY2lmaWVkIHNlcXVlbmNlIHNhdGlzZnkgYSBjb25kaXRpb24uXHJcbiAgICAgKiBJZiBwcmVkaWNhdGUgaXMgb21pdHRlZCwgdGhlIGZ1bGwgc2l6ZSBvZiB0aGUgbGlzdCB3aWxsIGJlIHJldHVybmVkLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqL1xyXG4gICAgTGlzdC5wcm90b3R5cGUuY291bnQgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKCFwcmVkaWNhdGUpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2UubGVuZ3RoO1xyXG4gICAgICAgIHZhciBzdW0gPSAwO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICBzdW0rKztcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgfTtcclxuICAgIExpc3QuY291bnQgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5jb3VudChwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV2ZXJzZXMgdGhlIG9yZGVyIG9mIHRoZSBlbGVtZW50cyBpbiB0aGUgc3BlY2lmaWVkIHJhbmdlLlxyXG4gICAgICogSWYgaW5kZXggYW5kIGNvdW50IGlzIG9taXR0ZWQgdGhlIGVudGlyZSBsaXN0IHdpbGwgYmUgcmV2ZXJzZWQuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHJhbmdlIHRvIHJldmVyc2UuXHJcbiAgICAgKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgcmFuZ2UgdG8gcmV2ZXJzZS4gSWYgbm90IHByb3ZpZGVkIGl0IHdpbGwgZGVmYXVsdCB0byBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpc3QucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbiAoaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgaWYgKChVdGlsLmlzVW5kZWZpbmVkKGluZGV4KSAmJiBVdGlsLmlzVW5kZWZpbmVkKGNvdW50KSkgfHwgKGluZGV4ID09PSAwICYmIGNvdW50ID49IHRoaXMubGVuZ3RoKSkge1xyXG4gICAgICAgICAgICAvLyByZXZlcnNlIHRoZSBlbnRpcmUgbGlzdFxyXG4gICAgICAgICAgICB0aGlzLl9zb3VyY2UucmV2ZXJzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQoY291bnQpKVxyXG4gICAgICAgICAgICAgICAgY291bnQgPSB0aGlzLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMuX3NvdXJjZS5zcGxpY2UoaW5kZXgsIGNvdW50ICsgaW5kZXggLSAxKTtcclxuICAgICAgICAgICAgYXJyLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRSYW5nZShpbmRleCwgYXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZXZlcnNlID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmV2ZXJzZShpbmRleCwgY291bnQpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnJhbmdlID0gZnVuY3Rpb24gKHN0YXJ0LCBjb3VudCkge1xyXG4gICAgICAgIHZhciBhcnIgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBzdGFydCArIGNvdW50OyBpKyspXHJcbiAgICAgICAgICAgIGFyci5wdXNoKGkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChhcnIpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaXN0O1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBMaXN0O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saXN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaW5rZWRMaXN0XzEgPSByZXF1aXJlKFwiLi9saW5rZWRMaXN0XCIpO1xyXG4vKipcclxuICogQSBTdGFjayB3b3JrcyBieSBmaXJzdCBpbiwgZmlyc3Qgb3V0LlxyXG4gKi9cclxudmFyIFF1ZXVlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGl0ZW1zIFRbXSBJdGVtcyB0byBzdGFydCBmaWxsaW5nIHRoZSBzdGFjayB3aXRoLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBRdWV1ZShpdGVtcykge1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSBuZXcgbGlua2VkTGlzdF8xLmRlZmF1bHQoaXRlbXMpO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFF1ZXVlLnByb3RvdHlwZSwgXCJsZW5ndGhcIiwge1xyXG4gICAgICAgIC8qKiBHZXQgdGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGUgcXVldWUgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2xpc3QubGVuZ3RoOyB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIDtcclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhbiBpdGVtIHRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlLlxyXG4gICAgICovXHJcbiAgICBRdWV1ZS5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9saXN0Lmluc2VydCh2YWwpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0Lmxlbmd0aDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldHMgYW5kIHJlbW92ZSBhbiBpdGVtIGZyb20gdGhlIGhlYWQgb2YgdGhlIHF1ZXVlLlxyXG4gICAgICovXHJcbiAgICBRdWV1ZS5wcm90b3R5cGUuZGVxdWV1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2xpc3QuZ2V0KDApO1xyXG4gICAgICAgIHRoaXMuX2xpc3QucmVtb3ZlQXQoMCk7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFF1ZXVlO1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBRdWV1ZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cXVldWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpbmtlZExpc3RfMSA9IHJlcXVpcmUoXCIuL2xpbmtlZExpc3RcIik7XHJcbi8qKlxyXG4gKiBBIFN0YWNrIHdvcmtzIGJ5IGxhc3QgaW4sIGZpcnN0IG91dC5cclxuICovXHJcbnZhciBTdGFjayA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBpdGVtcyBUW10gSXRlbXMgdG8gc3RhcnQgZmlsbGluZyB0aGUgc3RhY2sgd2l0aC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gU3RhY2soaXRlbXMpIHtcclxuICAgICAgICB0aGlzLl9saXN0ID0gbmV3IGxpbmtlZExpc3RfMS5kZWZhdWx0KGl0ZW1zKTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGFjay5wcm90b3R5cGUsIFwibGVuZ3RoXCIsIHtcclxuICAgICAgICAvKiogR2V0IHRoZSBudW1iZXIgb2YgaXRlbXMgaW4gdGhlIHN0YWNrICovXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9saXN0Lmxlbmd0aDsgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICA7XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gaXRlbSB0byB0aGUgdG9wIG9mIHRoZSBzdGFjay5cclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QuaW5zZXJ0QXQoMCwgaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3QubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFuZCByZW1vdmUgYW4gaXRlbSBmcm9tIHRoZSB0b3Agb2YgdGhlIHN0YWNrLlxyXG4gICAgICovXHJcbiAgICBTdGFjay5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5wZWVrKCk7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5yZW1vdmVBdCgwKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbiBpdGVtIGZyb20gdGhlIHRvcCBvZiB0aGUgc3RhY2sgd2l0aG91dCByZW1vdmluZyBpdC5cclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3QuZ2V0KDApO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgdGhlIHN0YWNrXHJcbiAgICAgKi9cclxuICAgIFN0YWNrLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9saXN0LmNsZWFyKCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFN0YWNrO1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBTdGFjaztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhY2suanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxuLyoqXHJcbiAqIFNob3J0aGFuZCBmdW5jdGlvbiB0byBjcmVhdGUgYSBEYXRlc0hlbHBlciBvYmplY3QuXHJcbiAqIEBwYXJhbSBudW1iZXIgVGhlIGRhdGUgb24gd2hpY2ggdG8gcGVyZm9ybSB0aGUgdmFyaW91cyBmdW5jdGlvbnMuXHJcbiAqL1xyXG5mdW5jdGlvbiBEYXRlcyhkYXRlKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSk7IH1cclxuZXhwb3J0cy5kZWZhdWx0ID0gRGF0ZXM7XHJcbnZhciBEYXRlc0hlbHBlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBEYXRlc0hlbHBlcihkYXRlKSB7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZTtcclxuICAgIH1cclxuICAgIERhdGVzSGVscGVyLnRvRGF0ZSA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQoZGF0ZSkpXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGlmIChVdGlsLmlzU3RyaW5nKGRhdGUpKVxyXG4gICAgICAgICAgICBkYXRlID0gRGF0ZS5wYXJzZShkYXRlKTtcclxuICAgICAgICBpZiAoVXRpbC5pc051bWJlcihkYXRlKSlcclxuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3ZWl0aGVyIHRoZSBkYXRlIGlzIGluIGJldHdlZW4gdHdvIG51bWJlcnMuXHJcbiAgICAgKiBAcGFyYW0gbG93ZXIgVGhlIGxvd2VyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqIEBwYXJhbSB1cHBlciBUaGUgdXBwZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICovXHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYmV0d2VlbiA9IGZ1bmN0aW9uIChsb3dlciwgdXBwZXIpIHtcclxuICAgICAgICByZXR1cm4gRGF0ZXNIZWxwZXIuYmV0d2Vlbih0aGlzLmRhdGUsIGxvd2VyLCB1cHBlcik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdlaXRoZXIgYSBkYXRlIGlzIGluIGJldHdlZW4gdHdvIG51bWJlcnMuXHJcbiAgICAgKiBAcGFyYW0gZGF0ZSBUaGUgZGF0ZSB3aGljaCB0byBjb21wYXJlIHdpdGguXHJcbiAgICAgKiBAcGFyYW0gbG93ZXIgVGhlIGxvd2VyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqIEBwYXJhbSB1cHBlciBUaGUgdXBwZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICovXHJcbiAgICBEYXRlc0hlbHBlci5iZXR3ZWVuID0gZnVuY3Rpb24gKGRhdGUsIGxvd2VyLCB1cHBlcikge1xyXG4gICAgICAgIGlmIChVdGlsLmlzVW5kZWZpbmVkKGxvd2VyKSlcclxuICAgICAgICAgICAgbG93ZXIgPSBuZXcgRGF0ZSgwKTtcclxuICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZCh1cHBlcikpXHJcbiAgICAgICAgICAgIHVwcGVyID0gbmV3IERhdGUoOTk5OTk5OTk5OTk5OSk7XHJcbiAgICAgICAgcmV0dXJuIChsb3dlciA8PSBkYXRlICYmIGRhdGUgPD0gdXBwZXIpO1xyXG4gICAgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRZZWFycyA9IGZ1bmN0aW9uICh5ZWFycykgeyByZXR1cm4gdGhpcy5hZGRNb250aHMoeWVhcnMgKiAxMik7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkTW9udGhzID0gZnVuY3Rpb24gKG1vbnRocykge1xyXG4gICAgICAgIHRoaXMuZGF0ZS5zZXRNb250aCh0aGlzLmRhdGUuZ2V0TW9udGgoKSArIG1vbnRocyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZFdlZWtzID0gZnVuY3Rpb24gKHdlZWspIHsgcmV0dXJuIHRoaXMuYWRkRGF5cyh3ZWVrICogNyk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkRGF5cyA9IGZ1bmN0aW9uIChkYXlzKSB7IHJldHVybiB0aGlzLmFkZEhvdXJzKGRheXMgKiAyNCk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkSG91cnMgPSBmdW5jdGlvbiAoaG91cnMpIHsgcmV0dXJuIHRoaXMuYWRkTWludXRlcyhob3VycyAqIDYwKTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRNaW51dGVzID0gZnVuY3Rpb24gKG1pbnV0ZXMpIHsgcmV0dXJuIHRoaXMuYWRkU2Vjb25kcyhtaW51dGVzICogNjApOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZFNlY29uZHMgPSBmdW5jdGlvbiAoc2Vjb25kcykgeyByZXR1cm4gdGhpcy5hZGRNaWxsaXNlY29uZHMoc2Vjb25kcyAqIDEwMDApOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZE1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uIChtaWxsaXNlY29uZHMpIHtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0TWlsbGlzZWNvbmRzKHRoaXMuZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSArIG1pbGxpc2Vjb25kcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmlzVG9kYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZS50b0RhdGVTdHJpbmcoKSA9PT0gbmV3IERhdGUoKS50b0RhdGVTdHJpbmcoKTtcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUudG9NaWRuaWdodCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0SG91cnMoMCk7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNldE1pbnV0ZXMoMCk7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNldFNlY29uZHMoMCk7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNldE1pbGxpc2Vjb25kcygwKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRZZWFycyA9IGZ1bmN0aW9uIChkYXRlLCB5ZWFycykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZFllYXJzKHllYXJzKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkTW9udGhzID0gZnVuY3Rpb24gKGRhdGUsIG1vbnRocykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZE1vbnRocyhtb250aHMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRXZWVrcyA9IGZ1bmN0aW9uIChkYXRlLCB3ZWVrKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkV2Vla3Mod2VlaykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZERheXMgPSBmdW5jdGlvbiAoZGF0ZSwgZGF5cykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZERheXMoZGF5cykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZEhvdXJzID0gZnVuY3Rpb24gKGRhdGUsIGhvdXJzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkSG91cnMoaG91cnMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRNaW51dGVzID0gZnVuY3Rpb24gKGRhdGUsIG1pbnV0ZXMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRNaW51dGVzKG1pbnV0ZXMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRTZWNvbmRzID0gZnVuY3Rpb24gKGRhdGUsIHNlY29uZHMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRTZWNvbmRzKHNlY29uZHMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRNaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAoZGF0ZSwgbWlsbGlzZWNvbmRzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkTWlsbGlzZWNvbmRzKG1pbGxpc2Vjb25kcykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmlzVG9kYXkgPSBmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmlzVG9kYXkoKTsgfTtcclxuICAgIERhdGVzSGVscGVyLnRvTWlkbmlnaHQgPSBmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLnRvTWlkbmlnaHQoKS5kYXRlOyB9O1xyXG4gICAgcmV0dXJuIERhdGVzSGVscGVyO1xyXG59KCkpO1xyXG5leHBvcnRzLkRhdGVzSGVscGVyID0gRGF0ZXNIZWxwZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbi8qKlxyXG4gKiBTaG9ydGhhbmQgZnVuY3Rpb24gdG8gY3JlYXRlIGEgTnVtYmVyc0hlbHBlciBvYmplY3QuXHJcbiAqIEBwYXJhbSBudW1iZXIgVGhlIG51bWJlciBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICovXHJcbmZ1bmN0aW9uIE51bWJlcnMobnVtKSB7IHJldHVybiBuZXcgTnVtYmVyc0hlbHBlcihudW0pOyB9XHJcbmV4cG9ydHMuZGVmYXVsdCA9IE51bWJlcnM7XHJcbnZhciBOdW1iZXJzSGVscGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIE51bWJlcnNIZWxwZXIgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIG51bWJlciBUaGUgbnVtYmVyIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBOdW1iZXJzSGVscGVyKG51bSkge1xyXG4gICAgICAgIHRoaXMubnVtID0gbnVtO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdlaXRoZXIgdGhlIG51bWJlciBpcyBpbiBiZXR3ZWVuIHR3byBudW1iZXJzLlxyXG4gICAgICogQHBhcmFtIGxvd2VyIFRoZSBsb3dlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKiBAcGFyYW0gdXBwZXIgVGhlIHVwcGVyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqL1xyXG4gICAgTnVtYmVyc0hlbHBlci5wcm90b3R5cGUuYmV0d2VlbiA9IGZ1bmN0aW9uIChsb3dlciwgdXBwZXIpIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyc0hlbHBlci5iZXR3ZWVuKHRoaXMubnVtLCBsb3dlciwgdXBwZXIpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3ZWl0aGVyIGEgbnVtYmVyIGlzIGluIGJldHdlZW4gdHdvIG51bWJlcnMuXHJcbiAgICAgKiBAcGFyYW0gbnVtYmVyIFRoZSBudW1iZXIgd2hpY2ggdG8gY29tcGFyZSB3aXRoLlxyXG4gICAgICogQHBhcmFtIGxvd2VyIFRoZSBsb3dlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKiBAcGFyYW0gdXBwZXIgVGhlIHVwcGVyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqL1xyXG4gICAgTnVtYmVyc0hlbHBlci5iZXR3ZWVuID0gZnVuY3Rpb24gKG51bSwgbG93ZXIsIHVwcGVyKSB7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQobG93ZXIpKVxyXG4gICAgICAgICAgICBsb3dlciA9IE51bWJlci5NSU5fVkFMVUU7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQodXBwZXIpKVxyXG4gICAgICAgICAgICB1cHBlciA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgcmV0dXJuIChsb3dlciA8PSBudW0gJiYgbnVtIDw9IHVwcGVyKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2VpdGhlciB0aGUgbnVtYmVyIGlzIGluIGFuIGFycmF5LlxyXG4gICAgICogQHBhcmFtIG51bWJlcnMgVGhlIGFycmF5IG9mIG51bWJlcnMgdG8gY29tcGFyZSB3aXRoLlxyXG4gICAgICovXHJcbiAgICBOdW1iZXJzSGVscGVyLnByb3RvdHlwZS5pbiA9IGZ1bmN0aW9uIChudW1iZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcnNIZWxwZXIuaW4odGhpcy5udW0sIG51bWJlcnMpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3ZWl0aGVyIGEgbnVtYmVyIGlzIGluIGFuIGFycmF5LlxyXG4gICAgICogQHBhcmFtIG51bWJlciBUaGUgbnVtYmVyIHdoaWNoIHRvIGNvbXBhcmUgd2l0aC5cclxuICAgICAqIEBwYXJhbSBudW1iZXJzIFRoZSBhcnJheSBvZiBudW1iZXJzIHRvIGNvbXBhcmUgd2l0aC5cclxuICAgICAqL1xyXG4gICAgTnVtYmVyc0hlbHBlci5pbiA9IGZ1bmN0aW9uIChudW0sIG51bWJlcnMpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKG51bWJlcnNbaV0gPT0gbnVtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNhZmVseSByb3VuZCBudW1iZXJzIGluIEpTIHdpdGhvdXQgaGl0dGluZyBpbXByZWNpc2lvbnMgb2YgZmxvYXRpbmctcG9pbnQgYXJpdGhtZXRpY3NcclxuICAgICAqIEtpbmRseSBib3Jyb3dlZCBmcm9tIEFuZ3VsYXJKUzogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9ibG9iL2czX3YxXzMvc3JjL25nL2ZpbHRlci9maWx0ZXJzLmpzI0wxNzNcclxuICAgICAqIEBwYXJhbSBwcmVjaXNpb24gSG93IG1hbnkgZGVjaW1hbHMgdGhlIG51bWJlciBzaG91bGQgaGF2ZS5cclxuICAgICAqL1xyXG4gICAgTnVtYmVyc0hlbHBlci5wcm90b3R5cGUudG9GaXhlZCA9IGZ1bmN0aW9uIChwcmVjaXNpb24pIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyc0hlbHBlci50b0ZpeGVkKHRoaXMubnVtLCBwcmVjaXNpb24pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU2FmZWx5IHJvdW5kIG51bWJlcnMgaW4gSlMgd2l0aG91dCBoaXR0aW5nIGltcHJlY2lzaW9ucyBvZiBmbG9hdGluZy1wb2ludCBhcml0aG1ldGljc1xyXG4gICAgICogS2luZGx5IGJvcnJvd2VkIGZyb20gQW5ndWxhckpTOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvZzNfdjFfMy9zcmMvbmcvZmlsdGVyL2ZpbHRlcnMuanMjTDE3M1xyXG4gICAgICogQHBhcmFtIHByZWNpc2lvbiBIb3cgbWFueSBkZWNpbWFscyB0aGUgbnVtYmVyIHNob3VsZCBoYXZlLlxyXG4gICAgICovXHJcbiAgICBOdW1iZXJzSGVscGVyLnRvRml4ZWQgPSBmdW5jdGlvbiAobnVtLCBwcmVjaXNpb24pIHtcclxuICAgICAgICByZXR1cm4gKyhNYXRoLnJvdW5kKCsobnVtLnRvU3RyaW5nKCkgKyBcImVcIiArIHByZWNpc2lvbikpLnRvU3RyaW5nKCkgKyBcImVcIiArIC1wcmVjaXNpb24pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBOdW1iZXJzSGVscGVyO1xyXG59KCkpO1xyXG5leHBvcnRzLk51bWJlcnNIZWxwZXIgPSBOdW1iZXJzSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1udW1iZXJzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiBTaG9ydGhhbmQgZnVuY3Rpb24gdG8gY3JlYXRlIGEgU3RyaW5nc0hlbHBlciBvYmplY3QuXHJcbiAqIEBwYXJhbSBudW1iZXIgVGhlIHN0cmluZyBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICovXHJcbmZ1bmN0aW9uIFN0cmluZ3Moc3RyKSB7IHJldHVybiBuZXcgU3RyaW5nc0hlbHBlcihzdHIpOyB9XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFN0cmluZ3M7XHJcbnZhciBTdHJpbmdzSGVscGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIFN0cmluZ3NIZWxwZXIgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHN0ciBUaGUgc3RyaW5nIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBTdHJpbmdzSGVscGVyKHN0cikge1xyXG4gICAgICAgIHRoaXMuc3RyID0gc3RyO1xyXG4gICAgfVxyXG4gICAgU3RyaW5nc0hlbHBlci5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gU3RyaW5nc0hlbHBlci5mb3JtYXQuYXBwbHkodW5kZWZpbmVkLCBbdGhpcy5zdHJdLmNvbmNhdChhcmdzKSk7XHJcbiAgICB9O1xyXG4gICAgU3RyaW5nc0hlbHBlci5mb3JtYXQgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIlxcXFx7XCIgKyBpICsgXCJcXFxcfVwiLCBcImdcIik7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHJlZ2V4LCBhcmdzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU3RyaW5nc0hlbHBlcjtcclxufSgpKTtcclxuZXhwb3J0cy5TdHJpbmdzSGVscGVyID0gU3RyaW5nc0hlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RyaW5ncy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogU2hvcnRoYW5kIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIFVybEhlbHBlciBvYmplY3QuXHJcbiAqIEBwYXJhbSB1cmwgVGhlIFVSTCBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICovXHJcbmZ1bmN0aW9uIFVybCh1cmwpIHtcclxuICAgIGlmICh1cmwgPT09IHZvaWQgMCkgeyB1cmwgPSBsb2NhdGlvbi5ocmVmOyB9XHJcbiAgICByZXR1cm4gbmV3IFVybEhlbHBlcih1cmwpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFVybDtcclxudmFyIFVybEhlbHBlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBVcmxIZWxwZXIgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHVybCBUaGUgVVJMIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBVcmxIZWxwZXIodXJsKSB7XHJcbiAgICAgICAgaWYgKHVybCA9PT0gdm9pZCAwKSB7IHVybCA9IGxvY2F0aW9uLmhyZWY7IH1cclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiBhIHF1ZXJ5IGluIHRoZSBVUkwuXHJcbiAgICAgKiBAcGFyYW0gcGFyYW0gVGhlIG5hbWUgb2YgdGhlIHF1ZXJ5IHRvIGdldC5cclxuICAgICAqL1xyXG4gICAgVXJsSGVscGVyLnByb3RvdHlwZS5zZWFyY2ggPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICByZXR1cm4gVXJsSGVscGVyLnNlYXJjaChwYXJhbSwgdGhpcy51cmwpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiBhIHF1ZXJ5IGluIHRoZSBVUkwuXHJcbiAgICAgKiBAcGFyYW0gdXJsIFRoZSBVUkwgZnJvbSB3aGljaCB0byBnZXQgdGhlIHF1ZXJ5LlxyXG4gICAgICogQHBhcmFtIHBhcmFtIFRoZSBuYW1lIG9mIHRoZSBxdWVyeSB0byBnZXQuXHJcbiAgICAgKi9cclxuICAgIFVybEhlbHBlci5zZWFyY2ggPSBmdW5jdGlvbiAocGFyYW0sIHVybCkge1xyXG4gICAgICAgIGlmICh1cmwgPT09IHZvaWQgMCkgeyB1cmwgPSBsb2NhdGlvbi5ocmVmOyB9XHJcbiAgICAgICAgcGFyYW0gPSBwYXJhbS5yZXBsYWNlKC9bXFxbXS8sIFwiXFxcXFtcIikucmVwbGFjZSgvW1xcXV0vLCBcIlxcXFxdXCIpO1xyXG4gICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbXFxcXD8mXVwiICsgcGFyYW0gKyBcIj0oW14mI10qKVwiLCBcImlcIiksIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCB8fCBsb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgICAgIHJldHVybiAhcmVzdWx0cyA/IFwiXCIgOiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVXJsSGVscGVyO1xyXG59KCkpO1xyXG5leHBvcnRzLlVybEhlbHBlciA9IFVybEhlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXJsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgRGlzdGluY3RJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoRGlzdGluY3RJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIERpc3RpbmN0SXRlcmF0b3Ioc291cmNlLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcjsgfVxyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5jb21wYXJlciA9IGNvbXBhcmVyO1xyXG4gICAgICAgIF90aGlzLl9wcmV2aW91c0l0ZW1zID0gW107XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgRGlzdGluY3RJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBycztcclxuICAgICAgICB3aGlsZSAoIShycyA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpKS5kb25lKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fcHJldmlvdXNJdGVtcy5zb21lKGZ1bmN0aW9uICh4KSB7IHJldHVybiBfdGhpcy5jb21wYXJlcih4LCBycy52YWx1ZSk7IH0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aW91c0l0ZW1zLnB1c2gocnMudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBEaXN0aW5jdEl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBEaXN0aW5jdEl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaXN0aW5jdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIEV4Y2VwdEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhFeGNlcHRJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEV4Y2VwdEl0ZXJhdG9yKHNvdXJjZSwgb3RoZXIsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmNvbXBhcmVyID0gY29tcGFyZXI7XHJcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgaXRlcmF0b3JfMS5kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIF90aGlzLm90aGVyID0gb3RoZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBfdGhpcy5vdGhlciA9IG5ldyBpdGVyYXRvcl8xLmRlZmF1bHQob3RoZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBFeGNlcHRJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBycztcclxuICAgICAgICBpZiAoIXRoaXMub3RoZXJJdGVtcykge1xyXG4gICAgICAgICAgICB0aGlzLm90aGVySXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgd2hpbGUgKCEocnMgPSB0aGlzLm90aGVyLm5leHQoKSkuZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdGhlckl0ZW1zLnB1c2gocnMudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlICghKHJzID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcykpLmRvbmUpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm90aGVySXRlbXMuc29tZShmdW5jdGlvbiAoeCkgeyByZXR1cm4gX3RoaXMuY29tcGFyZXIocnMudmFsdWUsIHgpOyB9KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBFeGNlcHRJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRXhjZXB0SXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4Y2VwdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIEZpbHRlckl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhGaWx0ZXJJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEZpbHRlckl0ZXJhdG9yKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoY2FsbGJhY2sgPT09IHZvaWQgMCkgeyBjYWxsYmFjayA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEZpbHRlckl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIHdoaWxlICghKGl0ZW0gPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKSkuZG9uZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFjayhpdGVtLnZhbHVlLCB0aGlzLl9pZHgpKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBGaWx0ZXJJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRmlsdGVySXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIGZpbHRlcl8xID0gcmVxdWlyZShcIi4vZmlsdGVyXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgR3JvdXBCeUl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhHcm91cEJ5SXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBHcm91cEJ5SXRlcmF0b3Ioc291cmNlLCBrZXlTZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5rZXlTZWxlY3RvciA9IGtleVNlbGVjdG9yO1xyXG4gICAgICAgIF90aGlzLl9wcmV2aW91c0tleXMgPSBbXTtcclxuICAgICAgICBfdGhpcy5faXNQaXBlbGluZUV4ZWN1dGVkID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgR3JvdXBCeUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIFRPRE86IEN1cnJlbnRseSB0aGlzIHdpbGwgdXNlIEZpbHRlckl0ZXJhdG9yIG9uIHRoZSB3aG9sZSBzb3VyY2Ugb25jZSBwZXIga2V5LiBDYW4gd2UgaW1wcm92ZSB0aGlzP1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgLyogVE9ETzogQmVjYXVzZSB3ZSBzZW5kIGluIHRoaXMuX3NvdXJjZSBpbnRvIHRoZSBGaWx0ZXJJdGVyYXRvciwgaWYgdGhpcy5fc291cmNlIGlzIGFuIGl0ZXJhdG9yLCB3ZSBmaW5pc2ggaXQsXHJcbiAgICAgICAgICogbWFraW5nIGl0IG5vdCBsb29rIGZvciB0aGUgbmV4dCBrZXkgb24gdGhlIHNlY29uZCBjYWxsIHRvIHRoaXMgZnVuY3Rpb24uXHJcbiAgICAgICAgICogV2UgcHJvYmFibHkgbmVlZCB0byBjcmVhdGUgYSBsb29rdXAgdGFibGUgb2Ygc29tZSBzb3J0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICghdGhpcy5faXNQaXBlbGluZUV4ZWN1dGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IHRoaXMudG9BcnJheSgpO1xyXG4gICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLnJlc2V0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzUGlwZWxpbmVFeGVjdXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpdGVtLCBrZXk7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBpdGVtID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmRvbmUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQoaXRlbS52YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAga2V5ID0gdGhpcy5rZXlTZWxlY3RvcihpdGVtLnZhbHVlKTtcclxuICAgICAgICB9IHdoaWxlICh0aGlzLl9wcmV2aW91c0tleXMuaW5kZXhPZihrZXkpID4gLTEgfHwgVXRpbC5pc1VuZGVmaW5lZChpdGVtLnZhbHVlKSk7XHJcbiAgICAgICAgdGhpcy5fcHJldmlvdXNLZXlzLnB1c2goa2V5KTtcclxuICAgICAgICB2YXIgZmlsdGVyID0gbmV3IGZpbHRlcl8xLmRlZmF1bHQodGhpcy5fc291cmNlLCBmdW5jdGlvbiAoeCwgaWR4KSB7IHJldHVybiBfdGhpcy5rZXlTZWxlY3Rvcih4KSA9PT0ga2V5OyB9KTtcclxuICAgICAgICB2YXIgZ3JvdXBJdGVtLCB2YWx1ZXMgPSBbXTtcclxuICAgICAgICB3aGlsZSAoIVV0aWwuaXNVbmRlZmluZWQoZ3JvdXBJdGVtID0gZmlsdGVyLm5leHQoKS52YWx1ZSkpIHtcclxuICAgICAgICAgICAgdmFsdWVzLnB1c2goZ3JvdXBJdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgICAgICAgIGtleToga2V5LFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiB2YWx1ZXNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZG9uZTogaXRlbS5kb25lXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICBHcm91cEJ5SXRlcmF0b3IucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG4sIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHdoaWxlICghKG4gPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKSkuZG9uZSlcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gobi52YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gR3JvdXBCeUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBHcm91cEJ5SXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdyb3VwQnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBmaWx0ZXJfMSA9IHJlcXVpcmUoXCIuL2ZpbHRlclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIEdyb3VwSm9pbkl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhHcm91cEpvaW5JdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEdyb3VwSm9pbkl0ZXJhdG9yKG91dGVyLCBpbm5lciwgb3V0ZXJLZXlTZWxlY3RvciwgaW5uZXJLZXlTZWxlY3RvciwgcmVzdWx0U2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBvdXRlcikgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5pbm5lciA9IGlubmVyO1xyXG4gICAgICAgIF90aGlzLm91dGVyS2V5U2VsZWN0b3IgPSBvdXRlcktleVNlbGVjdG9yO1xyXG4gICAgICAgIF90aGlzLmlubmVyS2V5U2VsZWN0b3IgPSBpbm5lcktleVNlbGVjdG9yO1xyXG4gICAgICAgIF90aGlzLnJlc3VsdFNlbGVjdG9yID0gcmVzdWx0U2VsZWN0b3I7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgR3JvdXBKb2luSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgb3V0ZXJJdGVtO1xyXG4gICAgICAgIHZhciBpbm5lckl0ZW07XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBvdXRlckl0ZW0gPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgaWYgKG91dGVySXRlbS5kb25lKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgICAgIH0gd2hpbGUgKFV0aWwuaXNVbmRlZmluZWQob3V0ZXJJdGVtLnZhbHVlKSk7XHJcbiAgICAgICAgdmFyIG91dGVyS2V5ID0gdGhpcy5vdXRlcktleVNlbGVjdG9yKG91dGVySXRlbS52YWx1ZSk7XHJcbiAgICAgICAgdmFyIGlubmVyU2VsZWN0aW9uID0gbmV3IGZpbHRlcl8xLmRlZmF1bHQodGhpcy5pbm5lciwgZnVuY3Rpb24gKHgsIGlkeCkgeyByZXR1cm4gb3V0ZXJLZXkgPT09IF90aGlzLmlubmVyS2V5U2VsZWN0b3IoeCk7IH0pO1xyXG4gICAgICAgIHZhciBpbm5lckFycmF5ID0gW107XHJcbiAgICAgICAgd2hpbGUgKCEoaW5uZXJJdGVtID0gaW5uZXJTZWxlY3Rpb24ubmV4dCgpKS5kb25lKSB7XHJcbiAgICAgICAgICAgIGlubmVyQXJyYXkucHVzaChpbm5lckl0ZW0udmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5yZXN1bHRTZWxlY3RvcihvdXRlckl0ZW0udmFsdWUsIGlubmVyQXJyYXkpLFxyXG4gICAgICAgICAgICBkb25lOiBvdXRlckl0ZW0uZG9uZVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEdyb3VwSm9pbkl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBHcm91cEpvaW5JdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z3JvdXBKb2luLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgSW50ZXJzZWN0SXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEludGVyc2VjdEl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gSW50ZXJzZWN0SXRlcmF0b3Ioc291cmNlLCBvdGhlciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXI7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuY29tcGFyZXIgPSBjb21wYXJlcjtcclxuICAgICAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBpdGVyYXRvcl8xLmRlZmF1bHQpIHtcclxuICAgICAgICAgICAgX3RoaXMub3RoZXIgPSBvdGhlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIF90aGlzLm90aGVyID0gbmV3IGl0ZXJhdG9yXzEuZGVmYXVsdChvdGhlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEludGVyc2VjdEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJzO1xyXG4gICAgICAgIGlmICghdGhpcy5vdGhlckl0ZW1zKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3RoZXJJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICB3aGlsZSAoIShycyA9IHRoaXMub3RoZXIubmV4dCgpKS5kb25lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm90aGVySXRlbXMucHVzaChycy52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKCEocnMgPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKSkuZG9uZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vdGhlckl0ZW1zLnNvbWUoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIF90aGlzLmNvbXBhcmVyKHJzLnZhbHVlLCB4KTsgfSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBycztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBkb25lOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gSW50ZXJzZWN0SXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEludGVyc2VjdEl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnRlcnNlY3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIEJhc2VJdGVyYXRvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBCYXNlSXRlcmF0b3Ioc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5faWR4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5fYnVmZmVycyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3JldmVyc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fZG9uZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgIH1cclxuICAgIEJhc2VJdGVyYXRvci5wcm90b3R5cGUuZ2V0SXRlcmF0b3JGcm9tUGlwZWxpbmUgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgdHlwZSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXM7XHJcbiAgICAgICAgd2hpbGUgKCEoKHNvdXJjZSA9IHNvdXJjZS5fc291cmNlKSBpbnN0YW5jZW9mIHR5cGUpKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzb3VyY2U7XHJcbiAgICB9O1xyXG4gICAgQmFzZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBuID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmICh0aGlzLl9zb3VyY2UgaW5zdGFuY2VvZiBCYXNlSXRlcmF0b3IpIHtcclxuICAgICAgICAgICAgdmFyIG5leHQgPSB0aGlzLl9zb3VyY2UubmV4dCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pZHgrKztcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcmV2ZXJzZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pZHggPCB0aGlzLl9zb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbiA9IHRoaXMuX3NvdXJjZVt0aGlzLl9zb3VyY2UubGVuZ3RoIC0gMSAtICgrK3RoaXMuX2lkeCldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lkeCA8IHRoaXMuX3NvdXJjZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBuID0gdGhpcy5fc291cmNlWysrdGhpcy5faWR4XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5faWR4ID49IHRoaXMuX3NvdXJjZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gdGhpcy5faWR4ID0gLTE7IC8vIHdlIGZpbmlzaGVkLCByZXNldCB0aGUgY291bnRlclxyXG4gICAgICAgICAgICB0aGlzLl9kb25lID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdmFsdWU6IG4sXHJcbiAgICAgICAgICAgIGRvbmU6IHRoaXMuX2RvbmVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIEJhc2VJdGVyYXRvci5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fcmV2ZXJzZWQgPSAhdGhpcy5fcmV2ZXJzZWQ7IH07XHJcbiAgICBCYXNlSXRlcmF0b3IucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX2lkeCA9IC0xO1xyXG4gICAgICAgIHRoaXMuX2RvbmUgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQmFzZUl0ZXJhdG9yO1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBCYXNlSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWl0ZXJhdG9yLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgZmlsdGVyXzEgPSByZXF1aXJlKFwiLi9maWx0ZXJcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBKb2luSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEpvaW5JdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEpvaW5JdGVyYXRvcihvdXRlciwgaW5uZXIsIG91dGVyS2V5U2VsZWN0b3IsIGlubmVyS2V5U2VsZWN0b3IsIHJlc3VsdFNlbGVjdG9yKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgb3V0ZXIpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuaW5uZXIgPSBpbm5lcjtcclxuICAgICAgICBfdGhpcy5vdXRlcktleVNlbGVjdG9yID0gb3V0ZXJLZXlTZWxlY3RvcjtcclxuICAgICAgICBfdGhpcy5pbm5lcktleVNlbGVjdG9yID0gaW5uZXJLZXlTZWxlY3RvcjtcclxuICAgICAgICBfdGhpcy5yZXN1bHRTZWxlY3RvciA9IHJlc3VsdFNlbGVjdG9yO1xyXG4gICAgICAgIF90aGlzLl9jb3VudGVyID0gMDtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBKb2luSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgaW5uZXJJdGVtO1xyXG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50SW5uZXJTZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgLy8gV2UncmUgZG9pbmcgdGhlIHNlY29uZCBsb29wIG9mIHRoZSBzYW1lIGtleS5cclxuICAgICAgICAgICAgaW5uZXJJdGVtID0gdGhpcy5fY3VycmVudElubmVyU2VsZWN0aW9uLm5leHQoKTtcclxuICAgICAgICAgICAgLy8gV2Uga25vdyB3ZSBoYXZlIHJlY2VpdmVkIGF0IGxlYXN0IG9uZSBpdGVtIGZyb20gdGhpcyBrZXkgYmVmb3JlLCBzbyBub3QgcmVjZWl2aW5nIG9uZSBub3cgaXMgbm90IHdyb25nLlxyXG4gICAgICAgICAgICAvLyBJdCBqdXN0IG1lYW5zIGl0IHdhcyBvbmx5IGEgc2luZ2xlIGlubmVyIGl0ZW0gd2l0aCB0aGlzIGtleSwgc28gd2UgbGV0IGl0IGNvbnRpbnVlIGlmIGJlbG93IGNvbmRpdGlvbiBpcyBub3QgbWV0LlxyXG4gICAgICAgICAgICBpZiAoIVV0aWwuaXNVbmRlZmluZWQoaW5uZXJJdGVtLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY291bnRlcisrO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5yZXN1bHRTZWxlY3Rvcih0aGlzLl9vdXRlckl0ZW0udmFsdWUsIGlubmVySXRlbS52YWx1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZTogZmFsc2VcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXNfMS5fb3V0ZXJJdGVtID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpc18xKTtcclxuICAgICAgICAgICAgaWYgKHRoaXNfMS5fb3V0ZXJJdGVtLmRvbmUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogeyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH0gfTtcclxuICAgICAgICAgICAgaWYgKCFVdGlsLmlzVW5kZWZpbmVkKHRoaXNfMS5fb3V0ZXJJdGVtLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG91dGVyS2V5XzEgPSB0aGlzXzEub3V0ZXJLZXlTZWxlY3Rvcih0aGlzXzEuX291dGVySXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzXzEuX2N1cnJlbnRJbm5lclNlbGVjdGlvbiA9IG5ldyBmaWx0ZXJfMS5kZWZhdWx0KHRoaXNfMS5pbm5lciwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIG91dGVyS2V5XzEgPT09IF90aGlzLmlubmVyS2V5U2VsZWN0b3IoeCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgaW5uZXJJdGVtID0gdGhpc18xLl9jdXJyZW50SW5uZXJTZWxlY3Rpb24ubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgdGhpc18xID0gdGhpcztcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHZhciBzdGF0ZV8xID0gX2xvb3BfMSgpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHN0YXRlXzEgPT09IFwib2JqZWN0XCIpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVfMS52YWx1ZTtcclxuICAgICAgICB9IHdoaWxlIChVdGlsLmlzVW5kZWZpbmVkKGlubmVySXRlbS52YWx1ZSkpO1xyXG4gICAgICAgIHRoaXMuX2NvdW50ZXIrKztcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5yZXN1bHRTZWxlY3Rvcih0aGlzLl9vdXRlckl0ZW0udmFsdWUsIGlubmVySXRlbS52YWx1ZSksXHJcbiAgICAgICAgICAgIGRvbmU6IHRoaXMuX291dGVySXRlbS5kb25lXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gSm9pbkl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBKb2luSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWpvaW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBfMSA9IHJlcXVpcmUoXCIuL1wiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIExpbnEgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGlucShzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSAoc291cmNlIGluc3RhbmNlb2YgXzEuQmFzZUl0ZXJhdG9yKVxyXG4gICAgICAgICAgICA/IHNvdXJjZVxyXG4gICAgICAgICAgICA6IG5ldyBfMS5NYXBJdGVyYXRvcihzb3VyY2UsIGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtOyB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG5ldyBzZXF1ZW5jZSB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeSBlbGVtZW50IGluIHRoaXMgYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhbiBlbGVtZW50IG9mIHRoZSBuZXcgc2VxdWVuY2VcclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyBfMS5NYXBJdGVyYXRvcih0aGlzLl9zb3VyY2UsIGNhbGxiYWNrKSk7XHJcbiAgICAgICAgLy8gdHJ5IHsgcmV0dXJuIG5ldyBMaW5xKG5ldyBNYXBJdGVyYXRvcih0aGlzLl9zb3VyY2UsIGNhbGxiYWNrKSk7IH1cclxuICAgICAgICAvLyBjYXRjaCAoZXgpIHsgdGhyb3cgdGhpcy5fZXJyb3JIYW5kbGVyKGV4KSB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgbmV3IHNlcXVlbmNlIHdpdGggdGhlIHJlc3VsdHMgb2YgY2FsbGluZyBhIHByb3ZpZGVkIGZ1bmN0aW9uIG9uIGV2ZXJ5IGVsZW1lbnQgaW4gdGhpcyBhcnJheS5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBGdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGFuIGVsZW1lbnQgb2YgdGhlIG5ldyBzZXF1ZW5jZVxyXG4gICAgICovXHJcbiAgICBMaW5xLm1hcCA9IGZ1bmN0aW9uIChzb3VyY2UsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5tYXAoY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRmlsdGVycyBhIHNlcXVlbmNlIG9mIHZhbHVlcyBiYXNlZCBvbiBhIHByZWRpY2F0ZS5cclxuICAgICAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IF8xLkZpbHRlckl0ZXJhdG9yKHRoaXMuX3NvdXJjZSwgcHJlZGljYXRlKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBGaWx0ZXJzIGEgc2VxdWVuY2Ugb2YgdmFsdWVzIGJhc2VkIG9uIGEgcHJlZGljYXRlLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqL1xyXG4gICAgTGlucS5maWx0ZXIgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gc291cmNlLmZpbHRlcihwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogSW52ZXJ0cyB0aGUgb3JkZXIgb2YgdGhlIGVsZW1lbnRzIGluIGEgc2VxdWVuY2UuXHJcbiAgICAgKiBUaGlzIHNpbXBseSBpdGVyYXRlcyB0aGUgaXRlbXMgZnJvbSB0aGUgZW5kLCBhbmQgYXMgc3VjaCBoYXMgbm8gYWRkaXRpb25hbCBwZXJmb3JtYW5jZSBjb3N0LlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5yZXZlcnNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3BlY2lmaWVkIG51bWJlciBvZiBjb250aWd1b3VzIGVsZW1lbnRzIGZyb20gdGhlIHN0YXJ0IG9mIGEgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZXR1cm4uXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLnRha2UgPSBmdW5jdGlvbiAoY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IF8xLlRha2VJdGVyYXRvcih0aGlzLl9zb3VyY2UsIGNvdW50KSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc3BlY2lmaWVkIG51bWJlciBvZiBjb250aWd1b3VzIGVsZW1lbnRzIGZyb20gdGhlIHN0YXJ0IG9mIGEgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZXR1cm4uXHJcbiAgICAgKi9cclxuICAgIExpbnEudGFrZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgwLCBjb3VudCk7XHJcbiAgICAgICAgLy8gcmV0dXJuIG5ldyBMaW5xPFRTb3VyY2U+KHNvdXJjZSkudGFrZShjb3VudCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBlbGVtZW50cyBmcm9tIGEgc2VxdWVuY2UgYXMgbG9uZyBhcyBhIHNwZWNpZmllZCBjb25kaXRpb24gaXMgdHJ1ZS5cclxuICAgICAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLnRha2VXaGlsZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IF8xLlRha2VXaGlsZUl0ZXJhdG9yKHRoaXMuX3NvdXJjZSwgcHJlZGljYXRlKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGVsZW1lbnRzIGZyb20gYSBzZXF1ZW5jZSBhcyBsb25nIGFzIGEgc3BlY2lmaWVkIGNvbmRpdGlvbiBpcyB0cnVlLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqL1xyXG4gICAgTGlucS50YWtlV2hpbGUgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS50YWtlV2hpbGUocHJlZGljYXRlKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBCeXBhc3NlcyBhIHNwZWNpZmllZCBudW1iZXIgb2YgZWxlbWVudHMgaW4gYSBzZXF1ZW5jZSBhbmQgdGhlbiByZXR1cm5zIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXHJcbiAgICAgKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byBza2lwIGJlZm9yZSByZXR1cm5pbmcgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUuc2tpcCA9IGZ1bmN0aW9uIChjb3VudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShuZXcgXzEuU2tpcEl0ZXJhdG9yKHRoaXMuX3NvdXJjZSwgY291bnQpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEJ5cGFzc2VzIGEgc3BlY2lmaWVkIG51bWJlciBvZiBlbGVtZW50cyBpbiBhIHNlcXVlbmNlIGFuZCB0aGVuIHJldHVybnMgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cclxuICAgICAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNraXAgYmVmb3JlIHJldHVybmluZyB0aGUgcmVtYWluaW5nIGVsZW1lbnRzLlxyXG4gICAgICovXHJcbiAgICBMaW5xLnNraXAgPSBmdW5jdGlvbiAoc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoY291bnQpO1xyXG4gICAgICAgIC8vIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnNraXAoY291bnQpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIE1lcmdlcyBpdGVtcyBmcm9tIHRoZSBmaXJzdCBzZXF1ZW5jZSB3aXRoIHRoZSBpdGVtIGF0IHRoZSBjb3JyZXNwb25kaW5nIGluZGV4IGluIHRoZSBzZWNvbmQgc2VxdWVuY2UgdG9cclxuICAgICAqIGNyZWF0ZSBhIG5ldyBzZXF1ZW5jZSB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeSBwYWlyIG9mIGl0ZW1zLlxyXG4gICAgICogVGhlIHppcCB3aWxsIHN0b3AgYXMgc29vbiBhcyBlaXRoZXIgb2YgdGhlIHNlcXVlbmNlcyBoaXRzIGFuIHVuZGVmaW5lZCB2YWx1ZS5cclxuICAgICAqIEBwYXJhbSBvdGhlciBUaGUgc2Vjb25kIHNlcXVlbmNlIHRvIHppcCB3aXRoXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhbiBlbGVtZW50IG9mIHRoZSBuZXcgc2VxdWVuY2VcclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUuemlwID0gZnVuY3Rpb24gKG90aGVyLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShuZXcgXzEuWmlwSXRlcmF0b3IodGhpcy5fc291cmNlLCBvdGhlciwgY2FsbGJhY2spKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIE1lcmdlcyBpdGVtcyBmcm9tIHRoZSBmaXJzdCBzZXF1ZW5jZSB3aXRoIHRoZSBpdGVtIGF0IHRoZSBjb3JyZXNwb25kaW5nIGluZGV4IGluIHRoZSBzZWNvbmQgc2VxdWVuY2UgdG9cclxuICAgICAqIGNyZWF0ZSBhIG5ldyBzZXF1ZW5jZSB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeSBwYWlyIG9mIGl0ZW1zLlxyXG4gICAgICogVGhlIHppcCB3aWxsIHN0b3AgYXMgc29vbiBhcyBlaXRoZXIgb2YgdGhlIHNlcXVlbmNlcyBoaXRzIGFuIHVuZGVmaW5lZCB2YWx1ZS5cclxuICAgICAqIEBwYXJhbSBvdGhlciBUaGUgc2Vjb25kIHNlcXVlbmNlIHRvIHppcCB3aXRoXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhbiBlbGVtZW50IG9mIHRoZSBuZXcgc2VxdWVuY2VcclxuICAgICAqL1xyXG4gICAgTGlucS56aXAgPSBmdW5jdGlvbiAoc291cmNlLCBvdGhlciwgY2FsbGJhY2spIHtcclxuICAgICAgICAvLyBUT0RPOiBXcml0ZSBzdGF0aWMgemlwIGZ1bmN0aW9uIHdpdGhvdXQgaW5zdGFudGlhdGluZyBhIG5ldyBMaW5xIG9iamVjdFxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnppcChvdGhlciwgY2FsbGJhY2spLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEJ5cGFzc2VzIGVsZW1lbnRzIGluIGEgc2VxdWVuY2UgYXMgbG9uZyBhcyBhIHNwZWNpZmllZCBjb25kaXRpb24gaXMgdHJ1ZSBhbmQgdGhlbiByZXR1cm5zIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXHJcbiAgICAgKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5za2lwV2hpbGUgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyBfMS5Ta2lwV2hpbGVJdGVyYXRvcih0aGlzLl9zb3VyY2UsIHByZWRpY2F0ZSkpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQnlwYXNzZXMgZWxlbWVudHMgaW4gYSBzZXF1ZW5jZSBhcyBsb25nIGFzIGEgc3BlY2lmaWVkIGNvbmRpdGlvbiBpcyB0cnVlIGFuZCB0aGVuIHJldHVybnMgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cclxuICAgICAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAgICAgKi9cclxuICAgIExpbnEuc2tpcFdoaWxlID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgLy8gVE9ETzogV3JpdGUgc3RhdGljIHNraXBXaGlsZSBmdW5jdGlvbiB3aXRob3V0IGluc3RhbnRpYXRpbmcgYSBuZXcgTGlucSBvYmplY3RcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5za2lwV2hpbGUocHJlZGljYXRlKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBpbiBhc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAgICAgKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IGEga2V5IGZyb20gYW4gZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSBjb21wYXJlciBBbiBJQ29tcGFyZXI8YW55PiB0byBjb21wYXJlIGtleXMuXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLm9yZGVyQnkgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIHZhciBzZWxlY3RvckZuID0gKGtleVNlbGVjdG9yKSA/IF9tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpIDogVXRpbC5kZWZhdWx0U2VsZWN0b3I7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBPcmRlcmVkTGlucShuZXcgXzEuT3JkZXJJdGVyYXRvcih0aGlzLl9zb3VyY2UsIHNlbGVjdG9yRm4sIGNvbXBhcmVyLCBmYWxzZSkpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU29ydHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgaW4gYXNjZW5kaW5nIG9yZGVyIGJ5IHVzaW5nIGEgc3BlY2lmaWVkIGNvbXBhcmVyLlxyXG4gICAgICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCBhIGtleSBmcm9tIGFuIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gICAgICovXHJcbiAgICBMaW5xLm9yZGVyQnkgPSBmdW5jdGlvbiAoc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgLy8gVE9ETzogV3JpdGUgc3RhdGljIG9yZGVyQnkgZnVuY3Rpb24gd2l0aG91dCBpbnN0YW50aWF0aW5nIGEgbmV3IExpbnEgb2JqZWN0XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkub3JkZXJCeShrZXlTZWxlY3RvciwgY29tcGFyZXIpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNvcnRzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAgICAgKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IGEga2V5IGZyb20gYW4gZWxlbWVudC5cclxuICAgICAqIEBwYXJhbSBjb21wYXJlciBBbiBJQ29tcGFyZXI8YW55PiB0byBjb21wYXJlIGtleXMuXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLm9yZGVyQnlEZXNjID0gZnVuY3Rpb24gKGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICB2YXIgc2VsZWN0b3JGbiA9IChrZXlTZWxlY3RvcikgPyBfbWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKSA6IFV0aWwuZGVmYXVsdFNlbGVjdG9yO1xyXG4gICAgICAgIHJldHVybiBuZXcgT3JkZXJlZExpbnEobmV3IF8xLk9yZGVySXRlcmF0b3IodGhpcy5fc291cmNlLCBzZWxlY3RvckZuLCBjb21wYXJlciwgdHJ1ZSkpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU29ydHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgaW4gZGVzY2VuZGluZyBvcmRlciBieSB1c2luZyBhIHNwZWNpZmllZCBjb21wYXJlci5cclxuICAgICAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgYSBrZXkgZnJvbSBhbiBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIGNvbXBhcmVyIEFuIElDb21wYXJlcjxhbnk+IHRvIGNvbXBhcmUga2V5cy5cclxuICAgICAqL1xyXG4gICAgTGlucS5vcmRlckJ5RGVzYyA9IGZ1bmN0aW9uIChzb3VyY2UsIGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICAvLyBUT0RPOiBXcml0ZSBzdGF0aWMgb3JkZXJCeURlc2MgZnVuY3Rpb24gd2l0aG91dCBpbnN0YW50aWF0aW5nIGEgbmV3IExpbnEgb2JqZWN0XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkub3JkZXJCeURlc2Moa2V5U2VsZWN0b3IsIGNvbXBhcmVyKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wdXRlcyB0aGUgc3VtIG9mIHRoZSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gICAgICogQHBhcmFtIHNlbGVjdG9yIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZWxlbWVudC5cclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUuc3VtID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiBMaW5xLnN1bSh0aGlzLnRvQXJyYXkoKSwgc2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ29tcHV0ZXMgdGhlIHN1bSBvZiB0aGUgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICAgICAqIEBwYXJhbSBzZWxlY3RvciBBIHRyYW5zZm9ybSBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIExpbnEuc3VtID0gZnVuY3Rpb24gKHNvdXJjZSwgc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgdmFyIGksIHN1bSA9IDA7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzdW0gKz0gc2VsZWN0b3Ioc291cmNlW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENvbXB1dGVzIHRoZSBhdmVyYWdlIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICAgICAqIEBwYXJhbSBzZWxlY3RvclxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5hdmVyYWdlID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiBMaW5xLmF2ZXJhZ2UodGhpcy50b0FycmF5KCksIHNlbGVjdG9yKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENvbXB1dGVzIHRoZSBhdmVyYWdlIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICAgICAqIEBwYXJhbSBzZWxlY3RvclxyXG4gICAgICovXHJcbiAgICBMaW5xLmF2ZXJhZ2UgPSBmdW5jdGlvbiAoc291cmNlLCBzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICB2YXIgaSwgdG90YWwgPSAwO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdG90YWwgKz0gc2VsZWN0b3Ioc291cmNlW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvdGFsIC8gc291cmNlLmxlbmd0aDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENvbXB1dGVzIHRoZSBtaW5pbXVtIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICAgICAqIEBwYXJhbSBzZWxlY3RvclxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgcmV0dXJuIExpbnEubWluKHRoaXMudG9BcnJheSgpLCBzZWxlY3Rvcik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wdXRlcyB0aGUgbWluaW11bSBvZiBhIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gc2VsZWN0b3JcclxuICAgICAqL1xyXG4gICAgTGlucS5taW4gPSBmdW5jdGlvbiAoc291cmNlLCBzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICByZXR1cm4gTWF0aC5taW4uYXBwbHkodW5kZWZpbmVkLCBzb3VyY2UubWFwKHNlbGVjdG9yKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wdXRlcyB0aGUgbWF4aW11bSBvZiBhIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gc2VsZWN0b3JcclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiBMaW5xLm1heCh0aGlzLnRvQXJyYXkoKSwgc2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ29tcHV0ZXMgdGhlIG1heGltdW0gb2YgYSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gICAgICogQHBhcmFtIHNlbGVjdG9yXHJcbiAgICAgKi9cclxuICAgIExpbnEubWF4ID0gZnVuY3Rpb24gKHNvdXJjZSwgc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KHVuZGVmaW5lZCwgc291cmNlLm1hcChzZWxlY3RvcikpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2Ugc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi4gSWYgbm90IHByb3ZpZGVkLCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNlcXVlbmNlIGNvbnRhaW5zIGFueSBlbGVtZW50cy5cclxuICAgICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2UgZG9lcyBub3Qgc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5hbnkgPSBmdW5jdGlvbiAocHJlZGljYXRlLCBpbnZlcnQpIHtcclxuICAgICAgICBpZiAoaW52ZXJ0ID09PSB2b2lkIDApIHsgaW52ZXJ0ID0gZmFsc2U7IH1cclxuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaXMuZmlyc3QoZnVuY3Rpb24gKHgpIHsgcmV0dXJuICEhcHJlZGljYXRlKHgpICE9PSBpbnZlcnQ7IH0pICE9PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2Ugc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi4gSWYgbm90IHByb3ZpZGVkLCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNlcXVlbmNlIGNvbnRhaW5zIGFueSBlbGVtZW50cy5cclxuICAgICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2UgZG9lcyBub3Qgc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5xLmFueSA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICAgICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5zb21lKGZ1bmN0aW9uICh4KSB7IHJldHVybiAhIXByZWRpY2F0ZSh4KSAhPT0gaW52ZXJ0OyB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbGwgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIG5vbmUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5hbGwgPSBmdW5jdGlvbiAocHJlZGljYXRlLCBpbnZlcnQpIHtcclxuICAgICAgICBpZiAoaW52ZXJ0ID09PSB2b2lkIDApIHsgaW52ZXJ0ID0gZmFsc2U7IH1cclxuICAgICAgICByZXR1cm4gISh0aGlzLmFueShwcmVkaWNhdGUsICFpbnZlcnQpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhbGwgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICAgICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIG5vbmUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBMaW5xLmFsbCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICAgICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5ldmVyeShmdW5jdGlvbiAoeCkgeyByZXR1cm4gISFwcmVkaWNhdGUoeCkgIT09IGludmVydDsgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXRjaGluZyBpdGVtIGluIHRoZSBhcnJheS4gSWYgdGhlcmUgYXJlIHNldmVyYWwgbWF0Y2hlcyBhbiBleGNlcHRpb24gd2lsbCBiZSB0aHJvd25cclxuICAgICAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICAgICAqIEB0aHJvd3MgRXJyb3IuXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLnNpbmdsZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICB2YXIgYXJyID0gdGhpcy5maWx0ZXIocHJlZGljYXRlKS50YWtlKDIpLnRvQXJyYXkoKTtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc2VxdWVuY2UgaXMgZW1wdHkuXCIpO1xyXG4gICAgICAgIGlmIChhcnIubGVuZ3RoID09IDIpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBzZXF1ZW5jZSBjb250YWlucyBtb3JlIHRoYW4gb25lIGVsZW1lbnQuXCIpO1xyXG4gICAgICAgIGlmIChhcnIubGVuZ3RoID09IDEpXHJcbiAgICAgICAgICAgIHJldHVybiBhcnJbMF07XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXRjaGluZyBpdGVtIGluIHRoZSBhcnJheS4gSWYgdGhlcmUgYXJlIHNldmVyYWwgbWF0Y2hlcyBhbiBleGNlcHRpb24gd2lsbCBiZSB0aHJvd25cclxuICAgICAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICAgICAqIEB0aHJvd3MgRXJyb3JcclxuICAgICAqL1xyXG4gICAgTGlucS5zaW5nbGUgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICAvLyBUT0RPOiBXcml0ZSBzdGF0aWMgc2luZ2xlIGZ1bmN0aW9uIHdpdGhvdXQgaW5zdGFudGlhdGluZyBhIG5ldyBMaW5xIG9iamVjdFxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnNpbmdsZShwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgZmlyc3QgbWF0Y2hpbmcgaXRlbSBpbiB0aGUgYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0gcHJlZGljYXRlXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICB2YXIgYXJyID0gdGhpcy5maWx0ZXIocHJlZGljYXRlKS50YWtlKDEpLnRvQXJyYXkoKTtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PSAxKVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyWzBdO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGZpcnN0IG1hdGNoaW5nIGl0ZW0gaW4gdGhlIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gICAgICovXHJcbiAgICBMaW5xLmZpcnN0ID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgLy8gVE9ETzogV3JpdGUgc3RhdGljIGZpcnN0IGZ1bmN0aW9uIHdpdGhvdXQgaW5zdGFudGlhdGluZyBhIG5ldyBMaW5xIG9iamVjdFxyXG4gICAgICAgIGlmICghc291cmNlIHx8IHNvdXJjZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKCFwcmVkaWNhdGUpXHJcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2VbMF07XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuZmlyc3QocHJlZGljYXRlKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGxhc3QgbWF0Y2hpbmcgaXRlbSBpbiB0aGUgYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0gcHJlZGljYXRlXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnJldmVyc2UoKS5maXJzdChwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbGFzdCBtYXRjaGluZyBpdGVtIGluIHRoZSBhcnJheS5cclxuICAgICAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICAgICAqL1xyXG4gICAgTGlucS5sYXN0ID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgLy8gVE9ETzogV3JpdGUgc3RhdGljIGxhc3QgZnVuY3Rpb24gd2l0aG91dCBpbnN0YW50aWF0aW5nIGEgbmV3IExpbnEgb2JqZWN0XHJcbiAgICAgICAgaWYgKCFzb3VyY2UgfHwgc291cmNlLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoIXByZWRpY2F0ZSlcclxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZVtzb3VyY2UubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkubGFzdChwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgbGlzdCBvZiBpdGVtcyB0aGF0IGV4aXN0cyBpbiBhbGwgZGF0YXNldHMuXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIgVGhlIG90aGVyIGRhdGFzZXQgdG8gYmUgY29tcGFyZWQgdG8uXHJcbiAgICAgKiBAcGFyYW0gbW9yZSBJZiB5b3UgaGF2ZSBldmVuIG1vcmUgZGF0YXNldCB0byBjb21wYXJlIHRvLlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5pbnRlcnNlY3QgPSBmdW5jdGlvbiAob3RoZXIsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyBfMS5JbnRlcnNlY3RJdGVyYXRvcih0aGlzLl9zb3VyY2UsIG90aGVyLCBjb21wYXJlcikpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgbGlzdCBvZiBpdGVtcyB0aGF0IGV4aXN0cyBpbiBhbGwgZGF0YXNldHMuXHJcbiAgICAgKiBAcGFyYW0gYSBUaGUgZmlyc3QgZGF0YXNldC5cclxuICAgICAqIEBwYXJhbSBiIFRoZSBzZWNvbmQgZGF0YXNldCB0byBiZSBjb21wYXJlZCB0by5cclxuICAgICAqIEBwYXJhbSBtb3JlIElmIHlvdSBoYXZlIGV2ZW4gbW9yZSBkYXRhc2V0IHRvIGNvbXBhcmUgdG8uXHJcbiAgICAgKi9cclxuICAgIExpbnEuaW50ZXJzZWN0ID0gZnVuY3Rpb24gKHNvdXJjZSwgb3RoZXIsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIGEgPSAoc291cmNlIGluc3RhbmNlb2YgTGlucSkgPyBzb3VyY2UudG9BcnJheSgpIDogc291cmNlLCBiID0gKG90aGVyIGluc3RhbmNlb2YgTGlucSkgPyBvdGhlci50b0FycmF5KCkgOiBvdGhlcjtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgYS5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgICAgIGlmIChiLnNvbWUoZnVuY3Rpb24gKHkpIHsgcmV0dXJuIGNvbXBhcmVyKHgsIHkpOyB9KSlcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgLy8gbGV0IGxpc3RzOiBBcnJheTxhbnlbXT4gPSBbXSwgcmVzdWx0ID0gW107XHJcbiAgICAgICAgLy8gbGV0IGxpc3QgPSAoYSBpbnN0YW5jZW9mIExpbnEpID8gYS50b0FycmF5KCkgOiBhO1xyXG4gICAgICAgIC8vIGxpc3RzLnB1c2goKGIgaW5zdGFuY2VvZiBMaW5xKSA/IGIudG9BcnJheSgpIDogYik7XHJcbiAgICAgICAgLy8gbW9yZS5mb3JFYWNoKChkYXRhc2V0KSA9PiB7XHJcbiAgICAgICAgLy8gICAgIGxpc3RzLnB1c2goKGRhdGFzZXQgaW5zdGFuY2VvZiBMaW5xKSA/IGRhdGFzZXQudG9BcnJheSgpIDogZGF0YXNldCk7XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgLy8gbGlzdC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIC8vICAgICBsZXQgZXhpc3RzID0gbGlzdHMuZXZlcnkob3RoZXIgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgaWYgKCFvdGhlci5zb21lKHggPT4geCA9PT0gaXRlbSkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAvLyAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAvLyAgICAgaWYgKGV4aXN0cykgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgLy8gcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldCBhIGxpc3Qgb2YgaXRlbXMgdGhhdCBvbmx5IGV4aXN0cyBpbiBvbmUgb2YgdGhlIGRhdGFzZXRzLlxyXG4gICAgICogQHBhcmFtIG90aGVyIFRoZSBvdGhlciBkYXRhc2V0LlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5leGNlcHQgPSBmdW5jdGlvbiAob3RoZXIsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyBfMS5FeGNlcHRJdGVyYXRvcih0aGlzLl9zb3VyY2UsIG90aGVyLCBjb21wYXJlcikpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgbGlzdCBvZiBpdGVtcyB0aGF0IG9ubHkgZXhpc3RzIGluIG9uZSBvZiB0aGUgZGF0YXNldHMuXHJcbiAgICAgKiBAcGFyYW0gYSBUaGUgZmlyc3QgZGF0YXNldC5cclxuICAgICAqIEBwYXJhbSBiIFRoZSBzZWNvbmQgZGF0YXNldC5cclxuICAgICAqL1xyXG4gICAgTGlucS5leGNlcHQgPSBmdW5jdGlvbiAoc291cmNlLCBvdGhlciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXI7IH1cclxuICAgICAgICB2YXIgYSA9IChzb3VyY2UgaW5zdGFuY2VvZiBMaW5xKSA/IHNvdXJjZS50b0FycmF5KCkgOiBzb3VyY2UsIGIgPSAob3RoZXIgaW5zdGFuY2VvZiBMaW5xKSA/IG90aGVyLnRvQXJyYXkoKSA6IG90aGVyO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICBhLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICAgICAgaWYgKCFiLnNvbWUoZnVuY3Rpb24gKHkpIHsgcmV0dXJuIGNvbXBhcmVyKHgsIHkpOyB9KSlcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgLy8gbGlzdHMucHVzaCgoYSBpbnN0YW5jZW9mIExpbnEpID8gYS50b0FycmF5KCkgOiBhKTtcclxuICAgICAgICAvLyBsaXN0cy5wdXNoKChiIGluc3RhbmNlb2YgTGlucSkgPyBiLnRvQXJyYXkoKSA6IGIpO1xyXG4gICAgICAgIC8vIGxldCBsaXN0czogQXJyYXk8YW55W10+ID0gW10sIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIC8vIGxpc3RzLnB1c2goKGEgaW5zdGFuY2VvZiBMaW5xKSA/IGEudG9BcnJheSgpIDogYSk7XHJcbiAgICAgICAgLy8gbGlzdHMucHVzaCgoYiBpbnN0YW5jZW9mIExpbnEpID8gYi50b0FycmF5KCkgOiBiKTtcclxuICAgICAgICAvLyBtb3JlLmZvckVhY2goZGF0YXNldCA9PiB7XHJcbiAgICAgICAgLy8gICAgIGxpc3RzLnB1c2goKGRhdGFzZXQgaW5zdGFuY2VvZiBMaW5xKSA/IGRhdGFzZXQudG9BcnJheSgpIDogZGF0YXNldCk7XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgLy8gbGlzdHMuZm9yRWFjaChsaXN0ID0+IHtcclxuICAgICAgICAvLyAgICAgbGlzdC5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgbGV0IGV4aXN0cyA9IGxpc3RzLnNvbWUob3RoZXIgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGlmIChsaXN0ID09PSBvdGhlcikgcmV0dXJuO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGlmIChvdGhlci5zb21lKHggPT4gIHggPT09IGl0ZW0pKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAvLyAgICAgICAgIH0pO1xyXG4gICAgICAgIC8vICAgICAgICAgaWYgKCFleGlzdHMpIHJlc3VsdC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAvLyB9KTtcclxuICAgICAgICAvLyByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgbGlzdCBvZiB1bmlxdWUgaXRlbXMgdGhhdCBleGlzdHMgb25lIG9yIG1vcmUgdGltZXMgaW4gdGhlIGRhdGFzZXQuXHJcbiAgICAgKi9cclxuICAgIExpbnEucHJvdG90eXBlLmRpc3RpbmN0ID0gZnVuY3Rpb24gKGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyBfMS5EaXN0aW5jdEl0ZXJhdG9yKHRoaXMuX3NvdXJjZSwgY29tcGFyZXIpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdldCBhIGxpc3Qgb2YgdW5pcXVlIGl0ZW1zIHRoYXQgZXhpc3RzIG9uZSBvciBtb3JlIHRpbWVzIGluIGFueSBvZiB0aGUgZGF0YXNldHMuXHJcbiAgICAgKiBAcGFyYW0gc291cmNlIFRoZSBkYXRhc2V0cyB0byBiZSBnZXQgZGlzdGluY3QgaXRlbXMgZnJvbS5cclxuICAgICAqL1xyXG4gICAgTGlucS5kaXN0aW5jdCA9IGZ1bmN0aW9uIChzb3VyY2UsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIGEgPSAoc291cmNlIGluc3RhbmNlb2YgTGlucSkgPyBzb3VyY2UudG9BcnJheSgpIDogc291cmNlO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICBhLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHQuc29tZShmdW5jdGlvbiAoeSkgeyByZXR1cm4gY29tcGFyZXIoeCwgeSk7IH0pKVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeCk7XHJcbiAgICAgICAgICAgIC8vIGlmIChyZXN1bHQuaW5kZXhPZih4KSA9PT0gLTEpIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgLy8gbGV0IGxpc3RzOiBBcnJheTxMaW5xPiA9IFtdLCByZXN1bHQgPSBbXTtcclxuICAgICAgICAvLyBkYXRhc2V0cy5mb3JFYWNoKGRhdGFzZXQgPT4ge1xyXG4gICAgICAgIC8vICAgICBsaXN0cy5wdXNoKChkYXRhc2V0IGluc3RhbmNlb2YgTGlucSkgPyBkYXRhc2V0IDogbmV3IExpbnEoVXRpbC5jYXN0PGFueVtdPihkYXRhc2V0KSkpO1xyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIC8vIGxpc3RzLmZvckVhY2gobGlzdCA9PiB7XHJcbiAgICAgICAgLy8gICAgIGxpc3QudG9BcnJheSgpLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICBpZiAocmVzdWx0LmluZGV4T2YoaXRlbSkgPT0gLTEpXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIC8vIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHcm91cHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgYWNjb3JkaW5nIHRvIGEgc3BlY2lmaWVkIGtleSBzZWxlY3RvciBmdW5jdGlvbi5cclxuICAgICAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgdGhlIGtleSBmb3IgZWFjaCBlbGVtZW50LlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5ncm91cEJ5ID0gZnVuY3Rpb24gKGtleVNlbGVjdG9yKSB7XHJcbiAgICAgICAgdmFyIHByZWQgPSBfbWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKTtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IF8xLkdyb3VwQnlJdGVyYXRvcih0aGlzLl9zb3VyY2UsIHByZWQpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEdyb3VwcyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBhY2NvcmRpbmcgdG8gYSBzcGVjaWZpZWQga2V5IHNlbGVjdG9yIGZ1bmN0aW9uLlxyXG4gICAgICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCB0aGUga2V5IGZvciBlYWNoIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIExpbnEuZ3JvdXBCeSA9IGZ1bmN0aW9uIChzb3VyY2UsIGtleVNlbGVjdG9yKSB7XHJcbiAgICAgICAgdmFyIGksIGFyciA9IFtdLCBwcmVkID0gX21ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3RvciksIGdyb3VwLCBncm91cFZhbHVlO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ3JvdXBWYWx1ZSA9IHByZWQoc291cmNlW2ldKTtcclxuICAgICAgICAgICAgZ3JvdXAgPSBuZXcgTGlucShhcnIpLmZpcnN0KGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LmtleSA9PSBncm91cFZhbHVlOyB9KTtcclxuICAgICAgICAgICAgaWYgKCFncm91cCkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiBncm91cFZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlczogW11cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaChncm91cCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ3JvdXAudmFsdWVzLnB1c2goc291cmNlW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENvcnJlbGF0ZXMgdGhlIGVsZW1lbnRzIG9mIHR3byBzZXF1ZW5jZXMgYmFzZWQgb24gbWF0Y2hpbmcga2V5cy5cclxuICAgICAqIEBwYXJhbSBpbm5lciBUaGUgc2VxdWVuY2UgdG8gam9pbiB0byB0aGUgZmlyc3Qgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gb3V0ZXJLZXlTZWxlY3RvciBUQSBmdW5jdGlvbiB0byBleHRyYWN0IHRoZSBqb2luIGtleSBmcm9tIGVhY2ggZWxlbWVudCBvZiB0aGUgZmlyc3Qgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gaW5uZXJLZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgdGhlIGpvaW4ga2V5IGZyb20gZWFjaCBlbGVtZW50IG9mIHRoZSBzZWNvbmQgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gcmVzdWx0U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBjcmVhdGUgYSByZXN1bHQgZWxlbWVudCBmcm9tIHR3byBtYXRjaGluZyBlbGVtZW50cy5cclxuICAgICAqL1xyXG4gICAgTGlucS5wcm90b3R5cGUuam9pbiA9IGZ1bmN0aW9uIChpbm5lciwgb3V0ZXJLZXlTZWxlY3RvciwgaW5uZXJLZXlTZWxlY3RvciwgcmVzdWx0U2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgb3V0ZXJQcmVkID0gX21ha2VWYWx1ZVByZWRpY2F0ZShvdXRlcktleVNlbGVjdG9yKSwgaW5uZXJQcmVkID0gX21ha2VWYWx1ZVByZWRpY2F0ZShpbm5lcktleVNlbGVjdG9yKTtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IF8xLkpvaW5JdGVyYXRvcih0aGlzLl9zb3VyY2UsIGlubmVyLCBvdXRlclByZWQsIGlubmVyUHJlZCwgcmVzdWx0U2VsZWN0b3IpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENvcnJlbGF0ZXMgdGhlIGVsZW1lbnRzIG9mIHR3byBzZXF1ZW5jZXMgYmFzZWQgb24gbWF0Y2hpbmcga2V5cy5cclxuICAgICAqIEBwYXJhbSBvdXRlciBUaGUgZmlyc3Qgc2VxdWVuY2UgdG8gam9pbi5cclxuICAgICAqIEBwYXJhbSBpbm5lciBUaGUgc2VxdWVuY2UgdG8gam9pbiB0byB0aGUgZmlyc3Qgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gb3V0ZXJLZXlTZWxlY3RvciBUQSBmdW5jdGlvbiB0byBleHRyYWN0IHRoZSBqb2luIGtleSBmcm9tIGVhY2ggZWxlbWVudCBvZiB0aGUgZmlyc3Qgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gaW5uZXJLZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgdGhlIGpvaW4ga2V5IGZyb20gZWFjaCBlbGVtZW50IG9mIHRoZSBzZWNvbmQgc2VxdWVuY2UuXHJcbiAgICAgKiBAcGFyYW0gcmVzdWx0U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBjcmVhdGUgYSByZXN1bHQgZWxlbWVudCBmcm9tIHR3byBtYXRjaGluZyBlbGVtZW50cy5cclxuICAgICAqL1xyXG4gICAgTGlucS5qb2luID0gZnVuY3Rpb24gKG91dGVyLCBpbm5lciwgb3V0ZXJLZXlTZWxlY3RvciwgaW5uZXJLZXlTZWxlY3RvciwgcmVzdWx0U2VsZWN0b3IpIHtcclxuICAgICAgICAvLyBUT0RPOiBXcml0ZSBzdGF0aWMgam9pbiBmdW5jdGlvbiB3aXRob3V0IGluc3RhbnRpYXRpbmcgYSBuZXcgTGlucSBvYmplY3RcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEob3V0ZXIpLmpvaW4oaW5uZXIsIG91dGVyS2V5U2VsZWN0b3IsIGlubmVyS2V5U2VsZWN0b3IsIHJlc3VsdFNlbGVjdG9yKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlcyB0aGUgcGlwZWxpbmUgYW5kIHJldHVybiB0aGUgcmVzdWx0aW5nIGFycmF5LlxyXG4gICAgICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByZXMsIGFyciA9IFtdO1xyXG4gICAgICAgIGlmIChVdGlsLmlzQXJyYXkodGhpcy5fc291cmNlKSkge1xyXG4gICAgICAgICAgICBhcnIgPSBVdGlsLmNhc3QodGhpcy5fc291cmNlKS5zbGljZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgd2hpbGUgKCEocmVzID0gdGhpcy5fc291cmNlLm5leHQoKSkuZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2gocmVzLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuICAgIC8vIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgLy8gICAgIGxldCBpZHggPSAwO1xyXG4gICAgLy8gICAgIHJldHVybiB7XHJcbiAgICAvLyAgICAgICAgIG5leHQoKTogQmFzZUl0ZXJhdG9yUmVzdWx0PGFueT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgbGV0IHJlcztcclxuICAgIC8vICAgICAgICAgICAgIGlmIChVdGlsLmlzQXJyYXkodGhpcy5fc291cmNlKSkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHJlcyA9IFV0aWwuY2FzdDxBcnJheTxhbnk+Pih0aGlzLl9zb3VyY2UpW2lkeCsrXTtcclxuICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICByZXMgPSB0aGlzLl9zb3VyY2UubmV4dCgpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH0gd2hpbGUgKCFVdGlsLmlzVW5kZWZpbmVkKHJlcykpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlkeCsrO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIH07XHJcbiAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGRvbmU6IHRydWUsXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfTtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH07XHJcbiAgICAvLyB9XHJcbiAgICAvKiBIZWxwZXIgZnVuY3Rpb25zICovXHJcbiAgICBMaW5xLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgICB0aGlzLnRvQXJyYXkoKS5zb21lKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtID09PSBhKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIHJlc3VsdCAhPT0gXCJ1bmRlZmluZWRcIjtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlucTtcclxufSgpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGlucTtcclxuZnVuY3Rpb24gTFEoc291cmNlKSB7XHJcbiAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKTtcclxufVxyXG5leHBvcnRzLkxRID0gTFE7XHJcbnZhciBPcmRlcmVkTGlucSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoT3JkZXJlZExpbnEsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBPcmRlcmVkTGlucShzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBpbiBkZXNjZW5kaW5nIG9yZGVyIGJ5IHVzaW5nIGEgc3BlY2lmaWVkIGNvbXBhcmVyLlxyXG4gICAgICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCBhIGtleSBmcm9tIGFuIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gICAgICovXHJcbiAgICBPcmRlcmVkTGlucS5wcm90b3R5cGUudGhlbkJ5ID0gZnVuY3Rpb24gKGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICB2YXIgc2VsZWN0b3JGbiA9IChrZXlTZWxlY3RvcikgPyBfbWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKSA6IFV0aWwuZGVmYXVsdFNlbGVjdG9yO1xyXG4gICAgICAgIHZhciBvcmRlckl0ZXJhdG9yID0gdGhpcy5fc291cmNlLmdldEl0ZXJhdG9yRnJvbVBpcGVsaW5lKF8xLk9yZGVySXRlcmF0b3IpO1xyXG4gICAgICAgIG9yZGVySXRlcmF0b3IudGhlbkJ5KHNlbGVjdG9yRm4sIGNvbXBhcmVyLCBmYWxzZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBpbiBkZXNjZW5kaW5nIG9yZGVyIGJ5IHVzaW5nIGEgc3BlY2lmaWVkIGNvbXBhcmVyLlxyXG4gICAgICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCBhIGtleSBmcm9tIGFuIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gICAgICovXHJcbiAgICBPcmRlcmVkTGlucS5wcm90b3R5cGUudGhlbkJ5RGVzYyA9IGZ1bmN0aW9uIChrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yRm4gPSAoa2V5U2VsZWN0b3IpID8gX21ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3RvcikgOiBVdGlsLmRlZmF1bHRTZWxlY3RvcjtcclxuICAgICAgICB2YXIgb3JkZXJJdGVyYXRvciA9IHRoaXMuX3NvdXJjZS5nZXRJdGVyYXRvckZyb21QaXBlbGluZShfMS5PcmRlckl0ZXJhdG9yKTtcclxuICAgICAgICBvcmRlckl0ZXJhdG9yLnRoZW5CeShzZWxlY3RvckZuLCBjb21wYXJlciwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE9yZGVyZWRMaW5xO1xyXG59KExpbnEpKTtcclxuZXhwb3J0cy5PcmRlcmVkTGlucSA9IE9yZGVyZWRMaW5xO1xyXG5mdW5jdGlvbiBfbWFrZVZhbHVlUHJlZGljYXRlKHByZWRpY2F0ZSkge1xyXG4gICAgaWYgKFV0aWwuaXNTdHJpbmcocHJlZGljYXRlKSkge1xyXG4gICAgICAgIHZhciBmaWVsZF8xID0gcHJlZGljYXRlO1xyXG4gICAgICAgIHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoeCkgeyByZXR1cm4geFtmaWVsZF8xXTsgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChVdGlsLmlzVW5kZWZpbmVkKHByZWRpY2F0ZSkpIHtcclxuICAgICAgICBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJlZGljYXRlO1xyXG59XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbnEuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBNYXBJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoTWFwSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBNYXBJdGVyYXRvcihzb3VyY2UsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgTWFwSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxuICAgICAgICByZXR1cm4gKCFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0udmFsdWUpKVxyXG4gICAgICAgICAgICA/IHsgdmFsdWU6IHRoaXMuY2FsbGJhY2soaXRlbS52YWx1ZSwgdGhpcy5faWR4KSwgZG9uZTogZmFsc2UgfVxyXG4gICAgICAgICAgICA6IHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBNYXBJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTWFwSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIE9yZGVySXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKE9yZGVySXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBPcmRlckl0ZXJhdG9yKHNvdXJjZSwga2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKSB7XHJcbiAgICAgICAgaWYgKGtleVNlbGVjdG9yID09PSB2b2lkIDApIHsga2V5U2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICBpZiAoZGVzY2VuZGluZyA9PT0gdm9pZCAwKSB7IGRlc2NlbmRpbmcgPSBmYWxzZTsgfVxyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5kZXNjZW5kaW5nID0gZGVzY2VuZGluZztcclxuICAgICAgICBfdGhpcy5faXNPcmRlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgX3RoaXMuX29yZGVycyA9IFtuZXcgTGlucU9yZGVyKGtleVNlbGVjdG9yLCBjb21wYXJlciwgZGVzY2VuZGluZyldO1xyXG4gICAgICAgIF90aGlzLl9idWZmZXJzID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBPcmRlckl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc09yZGVyZWQpIHtcclxuICAgICAgICAgICAgdmFyIGFyciA9IFtdLCBpdGVtID0gdm9pZCAwO1xyXG4gICAgICAgICAgICAvLyBjYW4ndCBzb21lb25lIGVsc2UgZG8gdGhpcz8gZS5nLiBGaWx0ZXJJdGVyYXRvcj9cclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0udmFsdWUpKVxyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICB9IHdoaWxlICghaXRlbS5kb25lKTtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlID0gYXJyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpID0gMCwgcnM7XHJcbiAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgcnMgPSBfdGhpcy5fb3JkZXJzW2krK10uY29tcGFyZShhLCBiKTtcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHJzID09PSAwICYmIGkgPCBfdGhpcy5fb3JkZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcnM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9pc09yZGVyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLnJlc2V0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxuICAgIH07XHJcbiAgICBPcmRlckl0ZXJhdG9yLnByb3RvdHlwZS50aGVuQnkgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKSB7XHJcbiAgICAgICAgaWYgKGtleVNlbGVjdG9yID09PSB2b2lkIDApIHsga2V5U2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICBpZiAoZGVzY2VuZGluZyA9PT0gdm9pZCAwKSB7IGRlc2NlbmRpbmcgPSBmYWxzZTsgfVxyXG4gICAgICAgIHRoaXMuX29yZGVycy5wdXNoKG5ldyBMaW5xT3JkZXIoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE9yZGVySXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IE9yZGVySXRlcmF0b3I7XHJcbnZhciBMaW5xT3JkZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGlucU9yZGVyKGtleVNlbGVjdG9yLCBjb21wYXJlciwgZGVzY2VuZGluZykge1xyXG4gICAgICAgIGlmIChrZXlTZWxlY3RvciA9PT0gdm9pZCAwKSB7IGtleVNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgaWYgKGRlc2NlbmRpbmcgPT09IHZvaWQgMCkgeyBkZXNjZW5kaW5nID0gZmFsc2U7IH1cclxuICAgICAgICB0aGlzLl9rZXlTZWxlY3RvciA9IGtleVNlbGVjdG9yO1xyXG4gICAgICAgIHRoaXMuX2NvbXBhcmVyID0gY29tcGFyZXI7XHJcbiAgICAgICAgdGhpcy5fZGVzY2VuZGluZyA9IGRlc2NlbmRpbmc7XHJcbiAgICB9XHJcbiAgICBMaW5xT3JkZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fZGVzY2VuZGluZyA/IC0xIDogMSkgKiB0aGlzLl9jb21wYXJlcih0aGlzLl9rZXlTZWxlY3RvcihhKSwgdGhpcy5fa2V5U2VsZWN0b3IoYikpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaW5xT3JkZXI7XHJcbn0oKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9yZGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgU2tpcEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhTa2lwSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBTa2lwSXRlcmF0b3Ioc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5jb3VudCA9IGNvdW50O1xyXG4gICAgICAgIF90aGlzLmNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIFNraXBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKDsgdGhpcy5jb3VudGVyIDwgdGhpcy5jb3VudDsgdGhpcy5jb3VudGVyKyspXHJcbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU2tpcEl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBTa2lwSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNraXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBTa2lwV2hpbGVJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoU2tpcFdoaWxlSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBTa2lwV2hpbGVJdGVyYXRvcihzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMucHJlZGljYXRlID0gcHJlZGljYXRlO1xyXG4gICAgICAgIF90aGlzLmRvbmUgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBTa2lwV2hpbGVJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBfc3VwZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcclxuICAgICAgICB9IHdoaWxlICghdGhpcy5kb25lICYmICFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0udmFsdWUpICYmIHRoaXMucHJlZGljYXRlKGl0ZW0udmFsdWUsIHRoaXMuX2lkeCkpO1xyXG4gICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNraXBXaGlsZUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBTa2lwV2hpbGVJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcFdoaWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVGFrZUl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhUYWtlSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBUYWtlSXRlcmF0b3Ioc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSkgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5jb3VudCA9IGNvdW50O1xyXG4gICAgICAgIF90aGlzLl9jb3VudGVyID0gMDtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBUYWtlSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50ZXIgPCB0aGlzLmNvdW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIrKztcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBkb25lOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVGFrZUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBUYWtlSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBUYWtlV2hpbGVJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoVGFrZVdoaWxlSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBUYWtlV2hpbGVJdGVyYXRvcihzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMucHJlZGljYXRlID0gcHJlZGljYXRlO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIFRha2VXaGlsZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBuID0gX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XHJcbiAgICAgICAgaWYgKCFuLmRvbmUgJiYgISF0aGlzLnByZWRpY2F0ZShuLnZhbHVlLCB0aGlzLl9pZHgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogbi52YWx1ZSxcclxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBUYWtlV2hpbGVJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gVGFrZVdoaWxlSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2VXaGlsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFppcEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhaaXBJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFppcEl0ZXJhdG9yKHNvdXJjZSwgb3RoZXIsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc291cmNlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLm90aGVyID0gb3RoZXI7XHJcbiAgICAgICAgX3RoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBaaXBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbSA9IF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMpO1xyXG4gICAgICAgIGlmICghaXRlbS5kb25lKSB7XHJcbiAgICAgICAgICAgIHZhciBvID0gdGhpcy5vdGhlclt0aGlzLl9pZHhdO1xyXG4gICAgICAgICAgICBpZiAoIVV0aWwuaXNVbmRlZmluZWQobykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuY2FsbGJhY2soaXRlbS52YWx1ZSwgbywgdGhpcy5faWR4KSxcclxuICAgICAgICAgICAgICAgICAgICBkb25lOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBkb25lOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gWmlwSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFppcEl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD16aXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gZGVmYXVsdFNlbGVjdG9yKGEpIHtcclxuICAgIHJldHVybiBjYXN0KGEpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdFNlbGVjdG9yID0gZGVmYXVsdFNlbGVjdG9yO1xyXG5mdW5jdGlvbiBkZWZhdWx0Q29tcGFyZXIoYSwgYikge1xyXG4gICAgaWYgKGEgPCBiKVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIGVsc2UgaWYgKGEgPiBiKVxyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiAwO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdENvbXBhcmVyID0gZGVmYXVsdENvbXBhcmVyO1xyXG5mdW5jdGlvbiBkZWZhdWx0RXF1YWxpdHlDb21wYXJlcihhLCBiKSB7XHJcbiAgICByZXR1cm4gYSA9PT0gYjtcclxufVxyXG5leHBvcnRzLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyID0gZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXI7XHJcbmZ1bmN0aW9uIGRlZmF1bHRQcmVkaWNhdGUodmFsdWUsIGluZGV4KSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHRQcmVkaWNhdGUgPSBkZWZhdWx0UHJlZGljYXRlO1xyXG5mdW5jdGlvbiBjYXN0KGEpIHtcclxuICAgIHJldHVybiBhO1xyXG59XHJcbmV4cG9ydHMuY2FzdCA9IGNhc3Q7XHJcbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcclxufVxyXG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XHJcbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiO1xyXG59XHJcbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcclxuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XHJcbn1cclxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xyXG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIjtcclxufVxyXG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcclxufVxyXG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xyXG5mdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XHJcbn1cclxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcclxuZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgRGF0ZV1cIjtcclxufVxyXG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGxpc3RfMSA9IHJlcXVpcmUoXCIuL2xpc3RcIik7XHJcbmV4cG9ydHMuTGlzdCA9IGxpc3RfMS5kZWZhdWx0O1xyXG52YXIgbGlua2VkTGlzdF8xID0gcmVxdWlyZShcIi4vbGlua2VkTGlzdFwiKTtcclxuZXhwb3J0cy5MaW5rZWRMaXN0ID0gbGlua2VkTGlzdF8xLmRlZmF1bHQ7XHJcbnZhciBzdGFja18xID0gcmVxdWlyZShcIi4vc3RhY2tcIik7XHJcbmV4cG9ydHMuU3RhY2sgPSBzdGFja18xLmRlZmF1bHQ7XHJcbnZhciBxdWV1ZV8xID0gcmVxdWlyZShcIi4vcXVldWVcIik7XHJcbmV4cG9ydHMuUXVldWUgPSBxdWV1ZV8xLmRlZmF1bHQ7XHJcbnZhciBiaW5hcnlUcmVlXzEgPSByZXF1aXJlKFwiLi9iaW5hcnlUcmVlXCIpO1xyXG5leHBvcnRzLkJpbmFyeVRyZWUgPSBiaW5hcnlUcmVlXzEuZGVmYXVsdDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIG51bWJlcnNfMSA9IHJlcXVpcmUoXCIuL251bWJlcnNcIik7XHJcbmV4cG9ydHMuTnVtYmVycyA9IG51bWJlcnNfMS5kZWZhdWx0O1xyXG5leHBvcnRzLk51bWJlcnNIZWxwZXIgPSBudW1iZXJzXzEuTnVtYmVyc0hlbHBlcjtcclxudmFyIHN0cmluZ3NfMSA9IHJlcXVpcmUoXCIuL3N0cmluZ3NcIik7XHJcbmV4cG9ydHMuU3RyaW5ncyA9IHN0cmluZ3NfMS5kZWZhdWx0O1xyXG5leHBvcnRzLlN0cmluZ3NIZWxwZXIgPSBzdHJpbmdzXzEuU3RyaW5nc0hlbHBlcjtcclxudmFyIGRhdGVzXzEgPSByZXF1aXJlKFwiLi9kYXRlc1wiKTtcclxuZXhwb3J0cy5EYXRlcyA9IGRhdGVzXzEuZGVmYXVsdDtcclxuZXhwb3J0cy5EYXRlc0hlbHBlciA9IGRhdGVzXzEuRGF0ZXNIZWxwZXI7XHJcbnZhciB1cmxfMSA9IHJlcXVpcmUoXCIuL3VybFwiKTtcclxuZXhwb3J0cy5VcmwgPSB1cmxfMS5kZWZhdWx0O1xyXG5leHBvcnRzLlVybEhlbHBlciA9IHVybF8xLlVybEhlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxuZXhwb3J0cy5CYXNlSXRlcmF0b3IgPSBpdGVyYXRvcl8xLmRlZmF1bHQ7XHJcbnZhciBmaWx0ZXJfMSA9IHJlcXVpcmUoXCIuL2ZpbHRlclwiKTtcclxuZXhwb3J0cy5GaWx0ZXJJdGVyYXRvciA9IGZpbHRlcl8xLmRlZmF1bHQ7XHJcbnZhciBtYXBfMSA9IHJlcXVpcmUoXCIuL21hcFwiKTtcclxuZXhwb3J0cy5NYXBJdGVyYXRvciA9IG1hcF8xLmRlZmF1bHQ7XHJcbnZhciBvcmRlcl8xID0gcmVxdWlyZShcIi4vb3JkZXJcIik7XHJcbmV4cG9ydHMuT3JkZXJJdGVyYXRvciA9IG9yZGVyXzEuZGVmYXVsdDtcclxudmFyIHNraXBfMSA9IHJlcXVpcmUoXCIuL3NraXBcIik7XHJcbmV4cG9ydHMuU2tpcEl0ZXJhdG9yID0gc2tpcF8xLmRlZmF1bHQ7XHJcbnZhciBza2lwV2hpbGVfMSA9IHJlcXVpcmUoXCIuL3NraXBXaGlsZVwiKTtcclxuZXhwb3J0cy5Ta2lwV2hpbGVJdGVyYXRvciA9IHNraXBXaGlsZV8xLmRlZmF1bHQ7XHJcbnZhciB0YWtlXzEgPSByZXF1aXJlKFwiLi90YWtlXCIpO1xyXG5leHBvcnRzLlRha2VJdGVyYXRvciA9IHRha2VfMS5kZWZhdWx0O1xyXG52YXIgdGFrZVdoaWxlXzEgPSByZXF1aXJlKFwiLi90YWtlV2hpbGVcIik7XHJcbmV4cG9ydHMuVGFrZVdoaWxlSXRlcmF0b3IgPSB0YWtlV2hpbGVfMS5kZWZhdWx0O1xyXG52YXIgam9pbl8xID0gcmVxdWlyZShcIi4vam9pblwiKTtcclxuZXhwb3J0cy5Kb2luSXRlcmF0b3IgPSBqb2luXzEuZGVmYXVsdDtcclxudmFyIGdyb3VwSm9pbl8xID0gcmVxdWlyZShcIi4vZ3JvdXBKb2luXCIpO1xyXG5leHBvcnRzLkdyb3VwSm9pbkl0ZXJhdG9yID0gZ3JvdXBKb2luXzEuZGVmYXVsdDtcclxudmFyIGdyb3VwQnlfMSA9IHJlcXVpcmUoXCIuL2dyb3VwQnlcIik7XHJcbmV4cG9ydHMuR3JvdXBCeUl0ZXJhdG9yID0gZ3JvdXBCeV8xLmRlZmF1bHQ7XHJcbnZhciB6aXBfMSA9IHJlcXVpcmUoXCIuL3ppcFwiKTtcclxuZXhwb3J0cy5aaXBJdGVyYXRvciA9IHppcF8xLmRlZmF1bHQ7XHJcbnZhciBleGNlcHRfMSA9IHJlcXVpcmUoXCIuL2V4Y2VwdFwiKTtcclxuZXhwb3J0cy5FeGNlcHRJdGVyYXRvciA9IGV4Y2VwdF8xLmRlZmF1bHQ7XHJcbnZhciBpbnRlcnNlY3RfMSA9IHJlcXVpcmUoXCIuL2ludGVyc2VjdFwiKTtcclxuZXhwb3J0cy5JbnRlcnNlY3RJdGVyYXRvciA9IGludGVyc2VjdF8xLmRlZmF1bHQ7XHJcbnZhciBkaXN0aW5jdF8xID0gcmVxdWlyZShcIi4vZGlzdGluY3RcIik7XHJcbmV4cG9ydHMuRGlzdGluY3RJdGVyYXRvciA9IGRpc3RpbmN0XzEuZGVmYXVsdDtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuL2xpbnFcIik7XHJcbmV4cG9ydHMuTGlucSA9IGxpbnFfMS5kZWZhdWx0O1xyXG5leHBvcnRzLkxRID0gbGlucV8xLkxRO1xyXG5leHBvcnRzLk9yZGVyZWRMaW5xID0gbGlucV8xLk9yZGVyZWRMaW5xO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXX0=
;
return {
'Collections': require('Collections'),
'Helpers': require('Helpers'),
'Linq': require('Linq')
};
});
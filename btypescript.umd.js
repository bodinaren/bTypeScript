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
require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../util");
var queue_1 = require("./queue");
var BinaryTree = /** @class */ (function () {
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
        var queue = new queue_1.Queue();
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
exports.BinaryTree = BinaryTree;
var TreeNode = /** @class */ (function () {
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
var LinkedList = /** @class */ (function () {
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
exports.LinkedList = LinkedList;
var LinkedListNode = /** @class */ (function () {
    function LinkedListNode(val) {
        this.val = val;
    }
    return LinkedListNode;
}());
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../util");
var List = /** @class */ (function () {
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
exports.List = List;
},{"../util":57}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linkedList_1 = require("./linkedList");
/**
 * A Stack works by first in, first out.
 */
var Queue = /** @class */ (function () {
    /**
     * @param items T[] Items to start filling the stack with.
     */
    function Queue(items) {
        this._list = new linkedList_1.LinkedList(items);
    }
    Object.defineProperty(Queue.prototype, "length", {
        /** Get the number of items in the queue */
        get: function () { return this._list.length; },
        enumerable: true,
        configurable: true
    });
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
exports.Queue = Queue;
},{"./linkedList":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linkedList_1 = require("./linkedList");
/**
 * A Stack works by last in, first out.
 */
var Stack = /** @class */ (function () {
    /**
     * @param items T[] Items to start filling the stack with.
     */
    function Stack(items) {
        this._list = new linkedList_1.LinkedList(items);
    }
    Object.defineProperty(Stack.prototype, "length", {
        /** Get the number of items in the stack */
        get: function () { return this._list.length; },
        enumerable: true,
        configurable: true
    });
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
exports.Stack = Stack;
},{"./linkedList":2}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../util");
/**
 * Shorthand function to create a DatesHelper object.
 * @param number The date on which to perform the various functions.
 */
function Dates(date) { return new DatesHelper(date); }
exports.Dates = Dates;
var DatesHelper = /** @class */ (function () {
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
exports.Numbers = Numbers;
var NumbersHelper = /** @class */ (function () {
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
exports.Strings = Strings;
var StringsHelper = /** @class */ (function () {
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
exports.Url = Url;
var UrlHelper = /** @class */ (function () {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var DistinctIterator = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var ExceptIterator = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var Util = require("../../util");
var FilterIterator = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var GroupByIterator = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var IntersectIterator = /** @class */ (function (_super) {
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
var BaseIterator = /** @class */ (function () {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var JoinIterator = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../../util");
var iterator_1 = require("./iterator");
var MapIterator = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var OrderByIterator = /** @class */ (function (_super) {
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
var LinqOrder = /** @class */ (function () {
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
var OrderedLinq = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var SkipIterator = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var SkipWhileIterator = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
var TakeIterator = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var TakeWhileIterator = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var ZipIterator = /** @class */ (function (_super) {
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
var Linq = /** @class */ (function () {
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
exports.List = list_1.List;
var linkedList_1 = require("./linkedList");
exports.LinkedList = linkedList_1.LinkedList;
var stack_1 = require("./stack");
exports.Stack = stack_1.Stack;
var queue_1 = require("./queue");
exports.Queue = queue_1.Queue;
var binaryTree_1 = require("./binaryTree");
exports.BinaryTree = binaryTree_1.BinaryTree;
},{"./binaryTree":1,"./linkedList":2,"./list":3,"./queue":4,"./stack":5}],"Helpers":[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var numbers_1 = require("./numbers");
exports.Numbers = numbers_1.Numbers;
exports.NumbersHelper = numbers_1.NumbersHelper;
var strings_1 = require("./strings");
exports.Strings = strings_1.Strings;
exports.StringsHelper = strings_1.StringsHelper;
var dates_1 = require("./dates");
exports.Dates = dates_1.Dates;
exports.DatesHelper = dates_1.DatesHelper;
var url_1 = require("./url");
exports.Url = url_1.Url;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29sbGVjdGlvbnMvYmluYXJ5VHJlZS50cyIsInNyYy9jb2xsZWN0aW9ucy9saW5rZWRMaXN0LnRzIiwic3JjL2NvbGxlY3Rpb25zL2xpc3QudHMiLCJzcmMvY29sbGVjdGlvbnMvcXVldWUudHMiLCJzcmMvY29sbGVjdGlvbnMvc3RhY2sudHMiLCJzcmMvaGVscGVycy9kYXRlcy50cyIsInNyYy9oZWxwZXJzL251bWJlcnMudHMiLCJzcmMvaGVscGVycy9zdHJpbmdzLnRzIiwic3JjL2hlbHBlcnMvdXJsLnRzIiwic3JjL2xpbnEvYWRkL2FsbC50cyIsInNyYy9saW5xL2FkZC9hbnkudHMiLCJzcmMvbGlucS9hZGQvYXZlcmFnZS50cyIsInNyYy9saW5xL2FkZC9kaXN0aW5jdC50cyIsInNyYy9saW5xL2FkZC9leGNlcHQudHMiLCJzcmMvbGlucS9hZGQvZmlsdGVyLnRzIiwic3JjL2xpbnEvYWRkL2ZpcnN0LnRzIiwic3JjL2xpbnEvYWRkL2dyb3VwQnkudHMiLCJzcmMvbGlucS9hZGQvaW50ZXJzZWN0LnRzIiwic3JjL2xpbnEvYWRkL2pvaW4udHMiLCJzcmMvbGlucS9hZGQvbGFzdC50cyIsInNyYy9saW5xL2FkZC9tYXAudHMiLCJzcmMvbGlucS9hZGQvbWF4LnRzIiwic3JjL2xpbnEvYWRkL21pbi50cyIsInNyYy9saW5xL2FkZC9vcmRlckJ5LnRzIiwic3JjL2xpbnEvYWRkL3NpbmdsZS50cyIsInNyYy9saW5xL2FkZC9za2lwLnRzIiwic3JjL2xpbnEvYWRkL3NraXBXaGlsZS50cyIsInNyYy9saW5xL2FkZC9zdW0udHMiLCJzcmMvbGlucS9hZGQvdGFrZS50cyIsInNyYy9saW5xL2FkZC90YWtlV2hpbGUudHMiLCJzcmMvbGlucS9hZGQvemlwLnRzIiwic3JjL2xpbnEvaXRlcmF0b3IvZGlzdGluY3QudHMiLCJzcmMvbGlucS9pdGVyYXRvci9leGNlcHQudHMiLCJzcmMvbGlucS9pdGVyYXRvci9maWx0ZXIudHMiLCJzcmMvbGlucS9pdGVyYXRvci9ncm91cEJ5LnRzIiwic3JjL2xpbnEvaXRlcmF0b3IvaW50ZXJzZWN0LnRzIiwic3JjL2xpbnEvaXRlcmF0b3IvaXRlcmF0b3IudHMiLCJzcmMvbGlucS9pdGVyYXRvci9qb2luLnRzIiwic3JjL2xpbnEvaXRlcmF0b3IvbWFwLnRzIiwic3JjL2xpbnEvaXRlcmF0b3Ivb3JkZXJCeS50cyIsInNyYy9saW5xL2l0ZXJhdG9yL3NraXAudHMiLCJzcmMvbGlucS9pdGVyYXRvci9za2lwV2hpbGUudHMiLCJzcmMvbGlucS9pdGVyYXRvci90YWtlLnRzIiwic3JjL2xpbnEvaXRlcmF0b3IvdGFrZVdoaWxlLnRzIiwic3JjL2xpbnEvaXRlcmF0b3IvemlwLnRzIiwic3JjL2xpbnEvbGlucS50cyIsInNyYy9saW5xL21ha2VWYWx1ZVByZWRpY2F0ZS50cyIsInNyYy9saW5xL29wZXJhdG9yL2FsbC50cyIsInNyYy9saW5xL29wZXJhdG9yL2FueS50cyIsInNyYy9saW5xL29wZXJhdG9yL2F2ZXJhZ2UudHMiLCJzcmMvbGlucS9vcGVyYXRvci9maXJzdC50cyIsInNyYy9saW5xL29wZXJhdG9yL2xhc3QudHMiLCJzcmMvbGlucS9vcGVyYXRvci9tYXgudHMiLCJzcmMvbGlucS9vcGVyYXRvci9taW4udHMiLCJzcmMvbGlucS9vcGVyYXRvci9zaW5nbGUudHMiLCJzcmMvbGlucS9vcGVyYXRvci9zdW0udHMiLCJzcmMvdXRpbC9pbmRleC50cyIsInNyYy9jb2xsZWN0aW9ucy9pbmRleC50cyIsInNyYy9oZWxwZXJzL2luZGV4LnRzIiwic3JjL2xpbnEvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLDhCQUFnQztBQUNoQyxpQ0FBOEI7QUFFOUI7SUFNSSxvQkFBWSxnQkFBNEM7UUFGeEQsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUdmLElBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLElBQUksSUFB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LDRCQUFBLE9BQU8sQ0FBQTtBQUFFLGtDQUFBLGFBQWEsQ0FBQTtBQUM5QixpQ0FBMkM7QUFBbkMsd0JBQUEsS0FBSyxDQUFBO0FBQUUsOEJBQUEsV0FBVyxDQUFBO0FBQzFCLDZCQUFxQztBQUE3QixvQkFBQSxHQUFHLENBQUE7QUFBRSwwQkFBQSxTQUFTLENBQUE7Ozs7QUNGdEIsOENBQWlEO0FBK0I5QixzQkEvQlYscUJBQVcsQ0ErQlU7QUE1QjlCLCtCQUFrQztBQTRCekIsZUE1QkEsV0FBSSxDQTRCQTtBQUFFLGFBNUJBLFNBQUUsQ0E0QkE7QUExQmpCLFlBQVk7QUFDWiwwQkFBd0I7QUFDeEIsd0JBQXNCO0FBQ3RCLHdCQUFzQjtBQUN0Qix5QkFBdUI7QUFDdkIsMkJBQXlCO0FBQ3pCLHNCQUFvQjtBQUNwQixxQkFBbUI7QUFDbkIseUJBQXVCO0FBQ3ZCLHNCQUFvQjtBQUNwQiwyQkFBeUI7QUFDekIsc0JBQW9CO0FBQ3BCLDJCQUF5QjtBQUN6QixxQkFBbUI7QUFFbkIsWUFBWTtBQUNaLHFCQUFtQjtBQUNuQixxQkFBbUI7QUFDbkIseUJBQXVCO0FBQ3ZCLHVCQUFxQjtBQUNyQixzQkFBb0I7QUFDcEIscUJBQW1CO0FBQ25CLHFCQUFtQjtBQUNuQix3QkFBc0I7QUFDdEIscUJBQW1CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0ICogYXMgVXRpbCBmcm9tIFwiLi4vdXRpbFwiO1xyXG5pbXBvcnQge1F1ZXVlfSBmcm9tIFwiLi9xdWV1ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJpbmFyeVRyZWU8VD4ge1xyXG4gICAgcHJpdmF0ZSBfcm9vdDogVHJlZU5vZGU7XHJcbiAgICBwcml2YXRlIF9zZWxlY3RvcjogVXRpbC5JU2VsZWN0b3I8VCwgbnVtYmVyPjtcclxuXHJcbiAgICBsZW5ndGg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2VsZWN0b3JGdW5jdGlvbj86IFV0aWwuSVNlbGVjdG9yPFQsIG51bWJlcj4pIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3RvciA9IHNlbGVjdG9yRnVuY3Rpb24gfHwgVXRpbC5kZWZhdWx0U2VsZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYW4gaXRlbSBpbnRvIHRoZSB0cmVlLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gUmV0dXJuIGZhbHNlIGlmIHRoZSBpdGVtIGFscmVhZHkgZXhpc3RzLlxyXG4gICAgICovXHJcbiAgICBpbnNlcnQoaXRlbTogVCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pbnNlcnRBdXgodGhpcy5fcm9vdCwgbmV3IFRyZWVOb2RlKGl0ZW0pKTsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYSByYW5nZSBvZiBpdGVtcyBpbnRvIHRoZSB0cmVlLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqL1xyXG4gICAgaW5zZXJ0UmFuZ2UoaXRlbXM6IFRbXSk6IHZvaWQge1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiB7IHRoaXMuaW5zZXJ0KGl0ZW0pOyB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0IGFuIGl0ZW0gaW50byB0aGUgdHJlZS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0gdHJlZSBXaGljaCBUcmVlTm9kZSB3ZSdyZSB0cmF2ZXJzaW5nLlxyXG4gICAgICogQHBhcmFtIG5vZGUgVGhlIG5vZGUgd2Ugd2lzaCB0byBpbnNlcnRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbnNlcnRBdXgodHJlZTogVHJlZU5vZGUsIG5vZGU6IFRyZWVOb2RlKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yb290ID0gbm9kZTtcclxuICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY29tcDogbnVtYmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXIodGhpcy5fc2VsZWN0b3Iobm9kZS52YWx1ZSksIHRoaXMuX3NlbGVjdG9yKHRyZWUudmFsdWUpKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbXAgPCAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0cmVlLmxlZnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QXV4KHRyZWUubGVmdCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlLmxlZnQgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSB0cmVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChjb21wID4gMCkge1xyXG4gICAgICAgICAgICBpZiAodHJlZS5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRBdXgodHJlZS5yaWdodCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlLnJpZ2h0ID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdHJlZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUoaXRlbTogVCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fc2VhcmNoKHRoaXMuX3Jvb3QsIGl0ZW0pO1xyXG5cclxuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gdGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3Jvb3Q7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm9kZS52YWx1ZSA8IG5vZGUucGFyZW50LnZhbHVlKSBkZWxldGUgbm9kZS5wYXJlbnQubGVmdDtcclxuICAgICAgICAgICAgZWxzZSBkZWxldGUgbm9kZS5wYXJlbnQucmlnaHQ7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBub2RlLnBhcmVudDtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIGxldCByaWdodCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHdoaWxlIChyaWdodC5yaWdodCkgeyByaWdodCA9IHJpZ2h0LnJpZ2h0OyB9IC8vIEdldCByaWdodCBtb3N0IGl0ZW0uXHJcblxyXG4gICAgICAgICAgICBpZiAocmlnaHQubGVmdCkge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC5sZWZ0OyAvLyBJZiB0aGUgcmlnaHQgbW9zdCBpdGVtIGhhcyBhIGxlZnQsIHVzZSB0aGF0IGluc3RlYWQuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocmlnaHQudmFsdWUgIT09IG5vZGUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByaWdodC5sZWZ0ID0gcmlnaHQucGFyZW50LmxlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQubGVmdC5wYXJlbnQgPSByaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmlnaHQucGFyZW50LnZhbHVlID09PSBub2RlLnZhbHVlKSBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0LnBhcmVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmlnaHQucGFyZW50ID0gbm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgICAgIG5vZGUubGVmdCA9IG5vZGUucmlnaHQgPSBub2RlLnBhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKG5vZGUgPT09IHRoaXMuX3Jvb3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSByaWdodDtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9yb290LnBhcmVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB0aGUgdHJlZSBjb250YWlucyBhIGdpdmVuIGl0ZW0uXHJcbiAgICAgKiBAcGFyYW0gaXRlbVxyXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgaXRlbSBleGlzdHMgaW4gdGhlIHRyZWUuXHJcbiAgICAgKi9cclxuICAgIGNvbnRhaW5zKGl0ZW06IFQpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gISF0aGlzLl9zZWFyY2godGhpcy5fcm9vdCwgaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlIGNhbGxiYWNrIGZvciBlYWNoIGl0ZW0uXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgV2hhdCBzaG91bGQgd2UgZG8gd2hlbiB3ZSBnZXQgdGhlcmUuXHJcbiAgICAgKiBAc2VlIGlub3JkZXJUcmF2ZXJzYWxcclxuICAgICAqL1xyXG4gICAgZm9yRWFjaChjYWxsYmFjazogVXRpbC5JTG9vcEZ1bmN0aW9uPFQ+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsKGNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1ha2UgaW50byBhbiAob3JkZXJlZCkgYXJyYXkuXHJcbiAgICAgKi9cclxuICAgIHRvQXJyYXkoKTogVFtdIHtcclxuICAgICAgICBsZXQgYXJyOiBBcnJheTxUPiA9IFtdO1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaChpdGVtID0+IHsgYXJyLnB1c2goaXRlbSk7IH0pO1xyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgd2hlbiBlbnRlcmluZyAocGFzc2luZyBvbiB0aGUgbGVmdCBzaWRlIG9mKSBhbiBpdGVtLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICovXHJcbiAgICBwcmVvcmRlclRyYXZlcnNhbChjYWxsYmFjazogVXRpbC5JTG9vcEZ1bmN0aW9uPFQ+KTogdm9pZCB7IHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgodGhpcy5fcm9vdCwgY2FsbGJhY2ssIHsgc3RvcDogZmFsc2UgfSk7IH1cclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgd2hlbiBlbnRlcmluZyAocGFzc2luZyBvbiB0aGUgbGVmdCBzaWRlIG9mKSBhbiBpdGVtLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgV2hhdCBzaG91bGQgd2UgZG8gd2hlbiB3ZSBnZXQgdGhlcmUuXHJcbiAgICAgKiBAcGFyYW0gc2lnbmFsIE9iamVjdCAoc28gaXQncyBhIHJlZmVyZW5jZSkgdGhhdCB3ZSB1c2UgdG8ga25vdyB3aGVuIHRoZSBjYWxsYmFjayByZXR1cm5lZCBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBwcmVvcmRlclRyYXZlcnNhbEF1eCh0cmVlOiBUcmVlTm9kZSwgY2FsbGJhY2s6IFV0aWwuSUxvb3BGdW5jdGlvbjxUPiwgc2lnbmFsOiB7IHN0b3A6IGJvb2xlYW4gfSk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdHJlZSB8fCBzaWduYWwuc3RvcCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBzaWduYWwuc3RvcCA9IChjYWxsYmFjayh0cmVlLnZhbHVlKSA9PT0gZmFsc2UpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5sZWZ0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApIHJldHVybjtcclxuICAgICAgICB0aGlzLnByZW9yZGVyVHJhdmVyc2FsQXV4KHRyZWUucmlnaHQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgd2hlbiBwYXNzaW5nIChwYXNzIHVuZGVyIHRoZSBpdGVtKSBhbiBpdGVtXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgV2hhdCBzaG91bGQgd2UgZG8gd2hlbiB3ZSBnZXQgdGhlcmUuXHJcbiAgICAgKi9cclxuICAgIGlub3JkZXJUcmF2ZXJzYWwoY2FsbGJhY2s6IFV0aWwuSUxvb3BGdW5jdGlvbjxUPik6IHZvaWQgeyB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodGhpcy5fcm9vdCwgY2FsbGJhY2ssIHsgc3RvcDogZmFsc2UgfSk7IH1cclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgd2hlbiBwYXNzaW5nIChwYXNzIHVuZGVyIHRoZSBpdGVtKSBhbiBpdGVtXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqIEBwYXJhbSBzaWduYWwgT2JqZWN0IChzbyBpdCdzIGEgcmVmZXJlbmNlKSB0aGF0IHdlIHVzZSB0byBrbm93IHdoZW4gdGhlIGNhbGxiYWNrIHJldHVybmVkIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGlub3JkZXJUcmF2ZXJzYWxBdXgodHJlZTogVHJlZU5vZGUsIGNhbGxiYWNrOiBVdGlsLklMb29wRnVuY3Rpb248VD4sIHNpZ25hbDogeyBzdG9wOiBib29sZWFuIH0pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRyZWUgfHwgc2lnbmFsLnN0b3ApIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsQXV4KHRyZWUubGVmdCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKSByZXR1cm47XHJcbiAgICAgICAgc2lnbmFsLnN0b3AgPSAoY2FsbGJhY2sodHJlZS52YWx1ZSkgPT09IGZhbHNlKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApIHJldHVybjtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5yaWdodCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayB3aGVuIGxlYXZpbmcgKHBhc3Npbmcgb24gdGhlIHJpZ2h0IHNpZGUgb2YpIGFuIGl0ZW1cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqL1xyXG4gICAgcG9zdG9yZGVyVHJhdmVyc2FsKGNhbGxiYWNrOiBVdGlsLklMb29wRnVuY3Rpb248VD4pOiB2b2lkIHsgdGhpcy5wb3N0b3JkZXJUcmF2ZXJzYWxBdXgodGhpcy5fcm9vdCwgY2FsbGJhY2ssIHsgc3RvcDogZmFsc2UgfSk7IH1cclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgYW5kIGV4ZWN1dGUgY2FsbGJhY2sgd2hlbiBwYXNzaW5nIChwYXNzIHVuZGVyIHRoZSBpdGVtKSBhbiBpdGVtXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBXaGF0IHNob3VsZCB3ZSBkbyB3aGVuIHdlIGdldCB0aGVyZS5cclxuICAgICAqIEBwYXJhbSBzaWduYWwgT2JqZWN0IChzbyBpdCdzIGEgcmVmZXJlbmNlKSB0aGF0IHdlIHVzZSB0byBrbm93IHdoZW4gdGhlIGNhbGxiYWNrIHJldHVybmVkIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHBvc3RvcmRlclRyYXZlcnNhbEF1eCh0cmVlOiBUcmVlTm9kZSwgY2FsbGJhY2s6IFV0aWwuSUxvb3BGdW5jdGlvbjxUPiwgc2lnbmFsOiB7IHN0b3A6IGJvb2xlYW4gfSk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdHJlZSB8fCBzaWduYWwuc3RvcCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLnBvc3RvcmRlclRyYXZlcnNhbEF1eCh0cmVlLmxlZnQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KHRyZWUucmlnaHQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcCkgcmV0dXJuO1xyXG4gICAgICAgIHNpZ25hbC5zdG9wID0gKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmF2ZXJzZSB0aGUgdHJlZSBvbmUgbGV2ZWwgYXQgYSB0aW1lIGFuZCBleGVjdXRlIGNhbGxiYWNrIG9uIGVhY2ggYW4gaXRlbVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICovXHJcbiAgICBsZXZlbFRyYXZlcnNhbChjYWxsYmFjazogVXRpbC5JTG9vcEZ1bmN0aW9uPFQ+KTogdm9pZCB7IHRoaXMubGV2ZWxUcmF2ZXJzYWxBdXgodGhpcy5fcm9vdCwgY2FsbGJhY2ssIHsgc3RvcDogZmFsc2UgfSk7IH1cclxuICAgIC8qKlxyXG4gICAgICogVHJhdmVyc2UgdGhlIHRyZWUgb25lIGxldmVsIGF0IGEgdGltZSBhbmQgZXhlY3V0ZSBjYWxsYmFjayBvbiBlYWNoIGFuIGl0ZW1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0gdHJlZSBXaGljaCBUcmVlTm9kZSB3ZSdyZSB0cmF2ZXJzaW5nLlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIFdoYXQgc2hvdWxkIHdlIGRvIHdoZW4gd2UgZ2V0IHRoZXJlLlxyXG4gICAgICogQHBhcmFtIHNpZ25hbCBPYmplY3QgKHNvIGl0J3MgYSByZWZlcmVuY2UpIHRoYXQgd2UgdXNlIHRvIGtub3cgd2hlbiB0aGUgY2FsbGJhY2sgcmV0dXJuZWQgZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbGV2ZWxUcmF2ZXJzYWxBdXgodHJlZTogVHJlZU5vZGUsIGNhbGxiYWNrOiBVdGlsLklMb29wRnVuY3Rpb248VD4sIHNpZ25hbDogeyBzdG9wOiBib29sZWFuIH0pOiB2b2lkIHtcclxuICAgICAgICBsZXQgcXVldWUgPSBuZXcgUXVldWU8VHJlZU5vZGU+KCk7XHJcbiAgICAgICAgaWYgKHRyZWUpIHF1ZXVlLmVucXVldWUodHJlZSk7XHJcblxyXG4gICAgICAgIHdoaWxlICghVXRpbC5pc1VuZGVmaW5lZCh0cmVlID0gcXVldWUuZGVxdWV1ZSgpKSkge1xyXG4gICAgICAgICAgICBzaWduYWwuc3RvcCA9IHNpZ25hbC5zdG9wIHx8IChjYWxsYmFjayh0cmVlLnZhbHVlKSA9PT0gZmFsc2UpO1xyXG4gICAgICAgICAgICBpZiAoc2lnbmFsLnN0b3ApIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHRyZWUubGVmdCkgcXVldWUuZW5xdWV1ZSh0cmVlLmxlZnQpO1xyXG4gICAgICAgICAgICBpZiAodHJlZS5yaWdodCkgcXVldWUuZW5xdWV1ZSh0cmVlLnJpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG1pbmltdW0gdmFsdWUgaW4gdGhlIHRyZWUuXHJcbiAgICAgKi9cclxuICAgIG1pbigpOiBUIHtcclxuICAgICAgICBsZXQgbWluID0gdGhpcy5taW5BdXgodGhpcy5fcm9vdCk7XHJcbiAgICAgICAgaWYgKG1pbikgcmV0dXJuIG1pbi52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtaW5pbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbWluQXV4KHRyZWU6IFRyZWVOb2RlKTogVHJlZU5vZGUge1xyXG4gICAgICAgIGlmICh0cmVlLmxlZnQpIHJldHVybiB0aGlzLm1pbkF1eCh0cmVlLmxlZnQpO1xyXG4gICAgICAgIGVsc2UgcmV0dXJuIHRyZWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG1heGltdW0gdmFsdWUgaW4gdGhlIHRyZWUuXHJcbiAgICAgKi9cclxuICAgIG1heCgpOiBUIHtcclxuICAgICAgICBsZXQgbWF4ID0gdGhpcy5tYXhBdXgodGhpcy5fcm9vdCk7XHJcbiAgICAgICAgaWYgKG1heCkgcmV0dXJuIG1heC52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBtYXhpbXVtIHZhbHVlIGluIHRoZSB0cmVlLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB0cmVlIFdoaWNoIFRyZWVOb2RlIHdlJ3JlIHRyYXZlcnNpbmcuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbWF4QXV4KHRyZWU6IFRyZWVOb2RlKTogVHJlZU5vZGUge1xyXG4gICAgICAgIGlmICh0cmVlLnJpZ2h0KSByZXR1cm4gdGhpcy5tYXhBdXgodHJlZS5yaWdodCk7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gdHJlZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgZGVwdGggb2YgYSB0cmVlLlxyXG4gICAgICogLTEgPSBFbXB0eVxyXG4gICAgICogMCA9IE9ubHkgcm9vdFxyXG4gICAgICovXHJcbiAgICBkZXB0aCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5kZXB0aEF1eCh0aGlzLl9yb290KTsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG1pbmltdW0gdmFsdWUgaW4gdGhlIHRyZWUuXHJcbiAgICAgKiAtMSA9IEVtcHR5XHJcbiAgICAgKiAwID0gT25seSByb290XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHRyZWUgV2hpY2ggVHJlZU5vZGUgd2UncmUgdHJhdmVyc2luZy5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkZXB0aEF1eCh0cmVlOiBUcmVlTm9kZSk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKCF0cmVlKSByZXR1cm4gLTE7XHJcblxyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLmRlcHRoQXV4KHRyZWUubGVmdCksIHRoaXMuZGVwdGhBdXgodHJlZS5yaWdodCkpICsgMTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZWFyY2ggdGhlIHRyZWUgZm9yIGEgc3BlY2lmaWMgaXRlbS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0gdHJlZSBXaGljaCBUcmVlTm9kZSB3ZSdyZSB0cmF2ZXJzaW5nLlxyXG4gICAgICogQHBhcmFtIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfc2VhcmNoKHRyZWU6IFRyZWVOb2RlLCBpdGVtOiBUKTogVHJlZU5vZGUge1xyXG4gICAgICAgIGlmIChVdGlsLmlzVW5kZWZpbmVkKHRyZWUpKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmICh0cmVlLnZhbHVlID09PSBpdGVtKSByZXR1cm4gdHJlZTtcclxuXHJcbiAgICAgICAgbGV0IGNvbXAgPSBVdGlsLmRlZmF1bHRDb21wYXJlcih0aGlzLl9zZWxlY3RvcihpdGVtKSwgdGhpcy5fc2VsZWN0b3IodHJlZS52YWx1ZSkpO1xyXG4gICAgICAgIGlmIChjb21wIDwgMCkge1xyXG4gICAgICAgICAgICB0cmVlID0gdGhpcy5fc2VhcmNoKHRyZWUubGVmdCwgaXRlbSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb21wID4gMCkge1xyXG4gICAgICAgICAgICB0cmVlID0gdGhpcy5fc2VhcmNoKHRyZWUucmlnaHQsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJlZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlIHtcclxuICAgIGxlZnQ6IFRyZWVOb2RlO1xyXG4gICAgcmlnaHQ6IFRyZWVOb2RlO1xyXG4gICAgcGFyZW50OiBUcmVlTm9kZTtcclxuICAgIHZhbHVlOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIElmIHRoZSBub2RlIGhhcyBuZWl0aGVyIGEgcmlnaHQgb3IgbGVmdCBjaGlsZC5cclxuICAgICAqL1xyXG4gICAgaXNFbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuICF0aGlzLmxlZnQgJiYgIXRoaXMucmlnaHQ7IH1cclxuXHJcbiAgICAvLy8qKlxyXG4gICAgLy8gKiBDb21wYXJlIHZhbHVlIHdpdGggdmFsdWUgb2YgYW5vdGhlciBUcmVlTm9kZS5cclxuICAgIC8vICogQHBhcmFtIG90aGVyIE90aGVyIFRyZWVOb2RlXHJcbiAgICAvLyAqL1xyXG4gICAgLy9jb21wYXJlVG8ob3RoZXI6IFRyZWVOb2RlKTogbnVtYmVyIHsgcmV0dXJuIFRyZWVOb2RlLmNvbXBhcmVUbyh0aGlzLCBvdGhlcik7IH1cclxuICAgIC8vLyoqXHJcbiAgICAvLyAqIENvbXBhcmUgdmFsdWVzIG9mIHR3byBUcmVlTm9kZS5cclxuICAgIC8vICogQHBhcmFtIGEgRmlyc3QgVHJlZU5vZGUuXHJcbiAgICAvLyAqIEBwYXJhbSBiIFNlY29uZCBUcmVlTm9kZS5cclxuICAgIC8vICovXHJcbiAgICAvL3N0YXRpYyBjb21wYXJlVG8oYTogVHJlZU5vZGUsIGI6IFRyZWVOb2RlKTogbnVtYmVyIHtcclxuICAgIC8vICAgIHJldHVybiBVdGlsLmRlZmF1bHRDb21wYXJlcihhLnZhbHVlLCBiLnZhbHVlKTtcclxuICAgIC8vfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBSZXByZXNlbnQgYSBkb3VibHktbGlua2VkIGxpc3QgaW4gd2hpY2ggeW91IGNhbiBhZGQgYW5kIHJlbW92ZSBpdGVtcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBMaW5rZWRMaXN0PFQ+IHtcclxuXHJcbiAgICBwcml2YXRlIF9maXJzdDogTGlua2VkTGlzdE5vZGU8VD47XHJcbiAgICBwcml2YXRlIF9sYXN0OiBMaW5rZWRMaXN0Tm9kZTxUPjtcclxuXHJcbiAgICBsZW5ndGg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gaXRlbXMgVFtdIEl0ZW1zIHRvIHN0YXJ0IGZpbGxpbmcgdGhlIHN0YWNrIHdpdGguXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGl0ZW1zPzogVFtdKSB7XHJcbiAgICAgICAgaWYgKGl0ZW1zKSBpdGVtcy5mb3JFYWNoKHggPT4geyB0aGlzLmluc2VydCh4KTsgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0Tm9kZShhdDogbnVtYmVyKTogTGlua2VkTGlzdE5vZGU8VD4ge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBlbHNlIGlmIChhdCA9PSAwKSByZXR1cm4gdGhpcy5fZmlyc3Q7XHJcbiAgICAgICAgZWxzZSBpZiAoYXQgPiB0aGlzLmxlbmd0aCkgcmV0dXJuIHRoaXMuX2xhc3Q7XHJcblxyXG4gICAgICAgIGxldCBpLCBub2RlOiBMaW5rZWRMaXN0Tm9kZTxUPjtcclxuXHJcbiAgICAgICAgaWYgKGF0IDwgdGhpcy5sZW5ndGggLyAyKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIGZldGNoaW5nIGZyb20gZmlyc3QgaGFsZiBvZiBsaXN0LCBzdGFydCBmcm9tIHRoZSBiZWdpbm5pbmdcclxuICAgICAgICAgICAgbm9kZSA9IHRoaXMuX2ZpcnN0O1xyXG5cclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGF0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBpZiBmZXRjaGluZyBmcm9tIGxhc3QgaGFsZiBvZiBsaXN0LCBzdGFydCBmcm9tIHRoZSBlbmRcclxuICAgICAgICAgICAgbm9kZSA9IHRoaXMuX2xhc3Q7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+IGF0OyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLnByZXY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFuIGl0ZW0gYXQgYSBjZXJ0YWluIHBvc2l0aW9uLlxyXG4gICAgICovXHJcbiAgICBnZXQoYXQ6IG51bWJlcik6IFQge1xyXG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fZ2V0Tm9kZShhdCk7XHJcbiAgICAgICAgaWYgKG5vZGUpIHJldHVybiBub2RlLnZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc2VydCBhbiBpdGVtIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIGluc2VydChpdGVtOiBUKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgbm9kZSA9IG5ldyBMaW5rZWRMaXN0Tm9kZShpdGVtKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9maXJzdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9maXJzdCA9IHRoaXMuX2xhc3QgPSBub2RlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5vZGUucHJldiA9IHRoaXMuX2xhc3Q7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3QubmV4dCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3QgPSBub2RlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICsrdGhpcy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnQgYW4gaXRlbSBhdCBhIGNlcnRhaW4gcG9zaXRpb24gaW4gdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIGluc2VydEF0KGF0OiBudW1iZXIsIGl0ZW06IFQpOiBudW1iZXIge1xyXG4gICAgICAgIGlmIChhdCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuIHRoaXMuaW5zZXJ0KGl0ZW0pO1xyXG5cclxuICAgICAgICBsZXQgbm9kZSA9IG5ldyBMaW5rZWRMaXN0Tm9kZShpdGVtKSxcclxuICAgICAgICAgICAgbmV4dCA9IHRoaXMuX2dldE5vZGUoYXQpLFxyXG4gICAgICAgICAgICBwcmV2ID0gbmV4dC5wcmV2O1xyXG5cclxuICAgICAgICBpZiAocHJldikgcHJldi5uZXh0ID0gbm9kZTtcclxuICAgICAgICBuZXh0LnByZXYgPSBub2RlO1xyXG4gICAgICAgIG5vZGUucHJldiA9IHByZXY7XHJcbiAgICAgICAgbm9kZS5uZXh0ID0gbmV4dDtcclxuXHJcbiAgICAgICAgaWYgKGF0ID09PSAwKSB0aGlzLl9maXJzdCA9IG5vZGU7XHJcblxyXG4gICAgICAgIHJldHVybiArK3RoaXMubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGFuIGl0ZW0gZnJvbSBhIGNlcnRhaW4gcG9zaXRpb24gaW4gdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUF0KGF0OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDA7XHJcblxyXG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fZ2V0Tm9kZShhdCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAvLyBvbmx5IDEgaXRlbSBsZWZ0IHRvIHJlbW92ZS5cclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLl9sYXN0ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgPT09IHRoaXMuX2ZpcnN0KSB7XHJcbiAgICAgICAgICAgIC8vIHJlbW92aW5nIHRoZSBmaXJzdCBpdGVtLlxyXG4gICAgICAgICAgICBub2RlLm5leHQucHJldiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSBub2RlLm5leHQ7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSA9PT0gdGhpcy5fbGFzdCkge1xyXG4gICAgICAgICAgICAvLyByZW1vdmluZyB0aGUgbGFzdCBpdGVtLlxyXG4gICAgICAgICAgICBub2RlLnByZXYubmV4dCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdCA9IG5vZGUucHJldjtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcmVtb3ZpbmcgaXRlbSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBsaXN0XHJcbiAgICAgICAgICAgIG5vZGUucHJldi5uZXh0ID0gbm9kZS5uZXh0O1xyXG4gICAgICAgICAgICBub2RlLm5leHQucHJldiA9IG5vZGUucHJldjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAtLXRoaXMubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXJzIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLl9maXJzdCA9IHRoaXMuX2xhc3QgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vcHJvdGVjdGVkIHJlbW92ZUFuZEdldEF0KGF0OiBudW1iZXIpOiBMaW5rZWRMaXN0Tm9kZSB7XHJcbiAgICAvLyAgICBsZXQgaXRlbSA9IHRoaXMuX2dldE5vZGUoYXQpO1xyXG4gICAgLy8gICAgdGhpcy5yZW1vdmVBdChhdCk7XHJcbiAgICAvLyAgICByZXR1cm4gaXRlbTtcclxuICAgIC8vfVxyXG59XHJcblxyXG5jbGFzcyBMaW5rZWRMaXN0Tm9kZTxUPiB7XHJcbiAgICBwcmV2OiBMaW5rZWRMaXN0Tm9kZTxUPjtcclxuICAgIG5leHQ6IExpbmtlZExpc3ROb2RlPFQ+O1xyXG4gICAgdmFsOiBUO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbDogVCkge1xyXG4gICAgICAgIHRoaXMudmFsID0gdmFsO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uL3V0aWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMaXN0PFQ+IHtcclxuXHJcbiAgICBfc291cmNlOiBUW107XHJcblxyXG4gICAgZ2V0IGxlbmd0aCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fc291cmNlLmxlbmd0aDsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG5ldyBsaXN0IG9iamVjdC5cclxuICAgICAqIFV0aWxpemVzIGEgbm9ybWFsIGFycmF5IGJlaGluZCB0aGUgc2NlbmVzIGFuZCBuYXRpdmUgZnVuY3Rpb25zIHdoZW5ldmVyIHBvc3NpYmxlLFxyXG4gICAgICogYnV0IHdpdGggZnVuY3Rpb25zIGtub3duIGZvciBhIExpc3QuXHJcbiAgICAgKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2UgYXJyYXkgZnJvbSB3aGljaCB0byBjcmVhdGUgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZT86IFRbXSkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZSB8fCBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgbGlzdCBhcyBhIGFycmF5LlxyXG4gICAgICovXHJcbiAgICB0b0FycmF5KCk6IFRbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gb2JqZWN0IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIGJlIGFkZGVkIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIGFkZChpdGVtOiBUKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnB1c2goaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYWRkPFQ+KHNvdXJjZTogVFtdLCBpdGVtOiBUKTogVFtdIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5hZGQoaXRlbSkudG9BcnJheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgZWxlbWVudHMgb2YgdGhlIHNwZWNpZmllZCBjb2xsZWN0aW9uIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB3aG9zZSBlbGVtZW50cyBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgYWRkUmFuZ2UoY29sbGVjdGlvbjogVFtdIHwgTGlzdDxUPik6IHRoaXMge1xyXG4gICAgICAgIGxldCBpdGVtcyA9IChjb2xsZWN0aW9uIGluc3RhbmNlb2YgTGlzdCkgPyBjb2xsZWN0aW9uLnRvQXJyYXkoKSA6IGNvbGxlY3Rpb247XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5fc291cmNlLCBpdGVtcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYWRkUmFuZ2U8VD4oc291cmNlOiBUW10sIGNvbGxlY3Rpb246IFRbXSB8IExpc3Q8VD4pOiBUW10ge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmFkZFJhbmdlKGNvbGxlY3Rpb24pLnRvQXJyYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAvKipcclxuICAgIC8vICAqIFJldHVybnMgYSBuZXcgcmVhZCBvbmx5IGluc3RhbmNlIG9mIHRoZSBsaXN0LlxyXG4gICAgLy8gICovXHJcbiAgICAvLyBhc1JlYWRPbmx5KCk6IExpc3Q8VD4ge1xyXG4gICAgLy8gICAgIHJldHVybiBuZXcgTGlzdChPYmplY3QuZnJlZXplKHRoaXMuX3NvdXJjZS5zbGljZSgpKSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtcyB0aGUgc3BlY2lmaWVkIGFjdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgb24gZWFjaCBlbGVtZW50IG9mIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBmb3JFYWNoKGNhbGxiYWNrOiBVdGlsLklMb29wRnVuY3Rpb248VD4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UuZm9yRWFjaChjYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZm9yRWFjaDxUPihzb3VyY2U6IFRbXSwgY2FsbGJhY2s6IFV0aWwuSUxvb3BGdW5jdGlvbjxUPik6IHZvaWQge1xyXG4gICAgICAgIG5ldyBMaXN0KHNvdXJjZSkuZm9yRWFjaChjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZWFyY2hlcyBmb3IgdGhlIHNwZWNpZmllZCBvYmplY3QgYW5kIHJldHVybnMgdGhlIHplcm8tYmFzZWQgaW5kZXggb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugd2l0aGluIHRoZSBzcGVjaWZpZWQgcmFuZ2Ugb2YgZWxlbWVudHMgaW4gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBzdGFydGluZyBpbmRleCBvZiB0aGUgc2VhcmNoLlxyXG4gICAgICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIHNlY3Rpb24gdG8gc2VhcmNoLlxyXG4gICAgICovXHJcbiAgICBpbmRleE9mKGl0ZW06IFQsIGluZGV4OiBudW1iZXIgPSAwLCBjb3VudDogbnVtYmVyID0gdGhpcy5sZW5ndGgpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBpZHggPSB0aGlzLl9zb3VyY2UuaW5kZXhPZihpdGVtLCBpbmRleCk7XHJcbiAgICAgICAgaWYgKGlkeCA+IGNvdW50IC0gaW5kZXggKyAxKSByZXR1cm4gLTE7XHJcbiAgICAgICAgcmV0dXJuIGlkeDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBpbmRleE9mPFQ+KHNvdXJjZTogVFtdLCBpdGVtOiBULCBpbmRleDogbnVtYmVyID0gMCwgY291bnQ6IG51bWJlciA9IHNvdXJjZS5sZW5ndGgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmluZGV4T2YoaXRlbSwgaW5kZXgsIGNvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNlYXJjaGVzIGZvciB0aGUgc3BlY2lmaWVkIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgemVyby1iYXNlZCBpbmRleCBvZiB0aGUgbGFzdCBvY2N1cnJlbmNlIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgZWxlbWVudHMgaW4gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIGxvY2F0ZSBpbiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBzdGFydGluZyBpbmRleCBvZiB0aGUgYmFja3dhcmQgc2VhcmNoLlxyXG4gICAgICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIHNlY3Rpb24gdG8gc2VhcmNoLlxyXG4gICAgICovXHJcbiAgICBsYXN0SW5kZXhPZihpdGVtOiBULCBpbmRleDogbnVtYmVyID0gdGhpcy5sZW5ndGggLSAxLCBjb3VudDogbnVtYmVyID0gdGhpcy5sZW5ndGgpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBpZHggPSB0aGlzLl9zb3VyY2UubGFzdEluZGV4T2YoaXRlbSwgaW5kZXgpO1xyXG4gICAgICAgIGlmIChpZHggPCBpbmRleCArIDEgLSBjb3VudCkgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiBpZHg7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbGFzdEluZGV4T2Y8VD4oc291cmNlOiBUW10sIGl0ZW06IFQsIGluZGV4OiBudW1iZXIgPSBzb3VyY2UubGVuZ3RoIC0gMSwgY291bnQ6IG51bWJlciA9IHNvdXJjZS5sZW5ndGgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmxhc3RJbmRleE9mKGl0ZW0sIGluZGV4LCBjb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnRzIGFuIGVsZW1lbnQgaW50byB0aGUgbGlzdCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxyXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSB6ZXJvLWJhc2VkIGluZGV4IGF0IHdoaWNoIGl0ZW0gc2hvdWxkIGJlIGluc2VydGVkLlxyXG4gICAgICogQHBhcmFtIGl0ZW0gVGhlIG9iamVjdCB0byBpbnNlcnQuXHJcbiAgICAgKi9cclxuICAgIGluc2VydChpbmRleDogbnVtYmVyLCBpdGVtOiBUKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgMCwgaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgaW5zZXJ0PFQ+KHNvdXJjZTogVFtdLCBpbmRleDogbnVtYmVyLCBpdGVtOiBUKTogVFtdIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5pbnNlcnQoaW5kZXgsIGl0ZW0pLnRvQXJyYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluc2VydHMgdGhlIGVsZW1lbnRzIG9mIGEgY29sbGVjdGlvbiBpbnRvIHRoZSBsaXN0IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgaW5kZXggYXQgd2hpY2ggdGhlIG5ldyBlbGVtZW50cyBzaG91bGQgYmUgaW5zZXJ0ZWQuXHJcbiAgICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB3aG9zZSBlbGVtZW50cyBzaG91bGQgYmUgaW5zZXJ0ZWQgaW50byB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgaW5zZXJ0UmFuZ2UoaW5kZXg6IG51bWJlciwgY29sbGVjdGlvbjogVFtdIHwgTGlzdDxUPik6IHRoaXMge1xyXG4gICAgICAgIGxldCBpdGVtcyA9IChjb2xsZWN0aW9uIGluc3RhbmNlb2YgTGlzdCkgPyBjb2xsZWN0aW9uLnRvQXJyYXkoKSA6IGNvbGxlY3Rpb247XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0aGlzLl9zb3VyY2UsIG5ldyBBcnJheTxhbnk+KGluZGV4LCAwKS5jb25jYXQoaXRlbXMpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN0YXRpYyBpbnNlcnRSYW5nZTxUPihzb3VyY2U6IFRbXSwgaW5kZXg6IG51bWJlciwgY29sbGVjdGlvbjogVFtdIHwgTGlzdDxUPik6IFRbXSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuaW5zZXJ0UmFuZ2UoaW5kZXgsIGNvbGxlY3Rpb24pLnRvQXJyYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBHZXRzIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKi9cclxuICAgIGdldChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZVtpbmRleF07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBTZXRzIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIHNldCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxyXG4gICAgICovXHJcbiAgICBzZXQoaW5kZXg6IG51bWJlciwgaXRlbTogVCkge1xyXG4gICAgICAgIGlmIChpbmRleCA+IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoXCJJbmRleCB3YXMgb3V0IG9mIHJhbmdlLiBNdXN0IGJlIG5vbi1uZWdhdGl2ZSBhbmQgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBjb2xsZWN0aW9uLlwiKTtcclxuICAgICAgICBlbHNlIHRoaXMuX3NvdXJjZVtpbmRleF0gPSBpdGVtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhIHNwZWNpZmljIG9iamVjdCBmcm9tIHRoZSBMaXN0KE9m4oCCVCkuXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgb2JqZWN0IHRvIHJlbW92ZSBmcm9tIHRoZSBMaXN0KE9m4oCCVCkuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZShpdGVtOiBUKTogdGhpcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQXQodGhpcy5fc291cmNlLmluZGV4T2YoaXRlbSkpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJlbW92ZTxUPihzb3VyY2U6IFRbXSwgaXRlbTogVCk6IFRbXSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlKGl0ZW0pLnRvQXJyYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIHRoZSBlbGVtZW50cyB0aGF0IG1hdGNoIHRoZSBjb25kaXRpb25zIGRlZmluZWQgYnkgdGhlIHNwZWNpZmllZCBwcmVkaWNhdGUuXHJcbiAgICAgKiBAcGFyYW0gcHJlZGljYXRlIFRoZSBwcmVkaWNhdGUgZGVsZWdhdGUgdGhhdCBkZWZpbmVzIHRoZSBjb25kaXRpb25zIG9mIHRoZSBlbGVtZW50cyB0byByZW1vdmUuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUFsbChwcmVkaWNhdGU/OiBVdGlsLklQcmVkaWNhdGU8VD4pOiB0aGlzIHtcclxuICAgICAgICBpZiAoIXByZWRpY2F0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKDApOyAvLyBzcGxpY2UgcmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIGVtcHR5IGFycmF5IGxldCdzIHVzIGtlZXAgdGhlIHJlZmVyZW5jZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBpO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWRpY2F0ZSh0aGlzLl9zb3VyY2VbaV0sIGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmVtb3ZlQWxsPFQ+KHNvdXJjZTogVFtdLCBwcmVkaWNhdGU/OiBVdGlsLklQcmVkaWNhdGU8VD4pOiBUW10ge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLnJlbW92ZUFsbChwcmVkaWNhdGUpLnRvQXJyYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleCBvZiB0aGUgbGlzdC5cclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgemVyby1iYXNlZCBpbmRleCBvZiB0aGUgZWxlbWVudCB0byByZW1vdmUuXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUF0KGluZGV4OiBudW1iZXIpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4IG9mIHRoZSBsaXN0LlxyXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSB6ZXJvLWJhc2VkIGluZGV4IG9mIHRoZSBlbGVtZW50IHRvIHJlbW92ZS5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbW92ZUF0PFQ+KHNvdXJjZTogVFtdLCBpbmRleDogbnVtYmVyKTogVFtdIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZW1vdmVBdChpbmRleCkudG9BcnJheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhIHJhbmdlIG9mIGVsZW1lbnRzIGZyb20gdGhlIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0gaW5kZXggVGhlIHplcm8tYmFzZWQgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHJhbmdlIG9mIGVsZW1lbnRzIHRvIHJlbW92ZS5cclxuICAgICAqIEBwYXJhbSBjb3VudCBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHJlbW92ZS5cclxuICAgICAqL1xyXG4gICAgcmVtb3ZlUmFuZ2UoaW5kZXg6IG51bWJlciwgY291bnQ6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5zcGxpY2UoaW5kZXgsIGNvdW50ICsgaW5kZXggLSAxKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHN0YXRpYyByZW1vdmVSYW5nZTxUPihzb3VyY2U6IFRbXSwgaW5kZXg6IG51bWJlciwgY291bnQ6IG51bWJlcik6IFRbXSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlUmFuZ2UoaW5kZXgsIGNvdW50KS50b0FycmF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBlbGVtZW50cyBmcm9tIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBjbGVhcigpOiB0aGlzIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUFsbCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGNsZWFyPFQ+KHNvdXJjZTogVFtdKTogVFtdIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5jbGVhcigpLnRvQXJyYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBudW1iZXIgdGhhdCByZXByZXNlbnRzIGhvdyBtYW55IGVsZW1lbnRzIGluIHRoZSBzcGVjaWZpZWQgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuICAgICAqIElmIHByZWRpY2F0ZSBpcyBvbWl0dGVkLCB0aGUgZnVsbCBzaXplIG9mIHRoZSBsaXN0IHdpbGwgYmUgcmV0dXJuZWQuXHJcbiAgICAgKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gICAgICovXHJcbiAgICBjb3VudChwcmVkaWNhdGU/OiBVdGlsLklQcmVkaWNhdGU8VD4pOiBudW1iZXIge1xyXG4gICAgICAgIGlmICghcHJlZGljYXRlKSByZXR1cm4gdGhpcy5fc291cmNlLmxlbmd0aDtcclxuXHJcbiAgICAgICAgbGV0IHN1bSA9IDA7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpIHN1bSsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgY291bnQ8VD4oc291cmNlOiBUW10sIHByZWRpY2F0ZT86IFV0aWwuSVByZWRpY2F0ZTxUPik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuY291bnQocHJlZGljYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldmVyc2VzIHRoZSBvcmRlciBvZiB0aGUgZWxlbWVudHMgaW4gdGhlIHNwZWNpZmllZCByYW5nZS5cclxuICAgICAqIElmIGluZGV4IGFuZCBjb3VudCBpcyBvbWl0dGVkIHRoZSBlbnRpcmUgbGlzdCB3aWxsIGJlIHJldmVyc2VkLlxyXG4gICAgICogQHBhcmFtIGluZGV4IFRoZSB6ZXJvLWJhc2VkIHN0YXJ0aW5nIGluZGV4IG9mIHRoZSByYW5nZSB0byByZXZlcnNlLlxyXG4gICAgICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIHJhbmdlIHRvIHJldmVyc2UuIElmIG5vdCBwcm92aWRlZCBpdCB3aWxsIGRlZmF1bHQgdG8gZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICByZXZlcnNlKGluZGV4PzogbnVtYmVyLCBjb3VudD86IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIGlmICgoVXRpbC5pc1VuZGVmaW5lZChpbmRleCkgJiYgVXRpbC5pc1VuZGVmaW5lZChjb3VudCkpIHx8IChpbmRleCA9PT0gMCAmJiBjb3VudCA+PSB0aGlzLmxlbmd0aCkpIHtcclxuICAgICAgICAgICAgLy8gcmV2ZXJzZSB0aGUgZW50aXJlIGxpc3RcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlLnJldmVyc2UoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChjb3VudCkpIGNvdW50ID0gdGhpcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCBhcnIgPSB0aGlzLl9zb3VyY2Uuc3BsaWNlKGluZGV4LCBjb3VudCArIGluZGV4IC0gMSk7XHJcbiAgICAgICAgICAgIGFyci5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0UmFuZ2UoaW5kZXgsIGFycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJldmVyc2U8VD4oc291cmNlOiBUW10sIGluZGV4PzogbnVtYmVyLCBjb3VudD86IG51bWJlcik6IFRbXSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmV2ZXJzZShpbmRleCwgY291bnQpLnRvQXJyYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmFuZ2Uoc3RhcnQ6IG51bWJlciwgY291bnQ6IG51bWJlcik6IExpc3Q8bnVtYmVyPiB7XHJcbiAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IHN0YXJ0ICsgY291bnQ7IGkrKylcclxuICAgICAgICAgICAgYXJyLnB1c2goaSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChhcnIpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TGlua2VkTGlzdH0gZnJvbSBcIi4vbGlua2VkTGlzdFwiO1xyXG5cclxuLyoqXHJcbiAqIEEgU3RhY2sgd29ya3MgYnkgZmlyc3QgaW4sIGZpcnN0IG91dC5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBRdWV1ZTxUPiB7XHJcbiAgICBwcml2YXRlIF9saXN0OiBMaW5rZWRMaXN0PFQ+O1xyXG5cclxuICAgIC8qKiBHZXQgdGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGUgcXVldWUgKi9cclxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2xpc3QubGVuZ3RoOyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gaXRlbXMgVFtdIEl0ZW1zIHRvIHN0YXJ0IGZpbGxpbmcgdGhlIHN0YWNrIHdpdGguXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGl0ZW1zPzogVFtdKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IG5ldyBMaW5rZWRMaXN0PFQ+KGl0ZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gaXRlbSB0byB0aGUgZW5kIG9mIHRoZSBxdWV1ZS5cclxuICAgICAqL1xyXG4gICAgZW5xdWV1ZSh2YWw6IFQpOiBudW1iZXIge1xyXG4gICAgICAgIHRoaXMuX2xpc3QuaW5zZXJ0KHZhbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3QubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyBhbmQgcmVtb3ZlIGFuIGl0ZW0gZnJvbSB0aGUgaGVhZCBvZiB0aGUgcXVldWUuXHJcbiAgICAgKi9cclxuICAgIGRlcXVldWUoKTogVCB7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9saXN0LmdldCgwKTtcclxuICAgICAgICB0aGlzLl9saXN0LnJlbW92ZUF0KDApO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TGlua2VkTGlzdH0gZnJvbSBcIi4vbGlua2VkTGlzdFwiO1xyXG5cclxuLyoqXHJcbiAqIEEgU3RhY2sgd29ya3MgYnkgbGFzdCBpbiwgZmlyc3Qgb3V0LlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFN0YWNrPFQ+IHtcclxuXHJcbiAgICBwcml2YXRlIF9saXN0OiBMaW5rZWRMaXN0PFQ+O1xyXG5cclxuICAgIC8qKiBHZXQgdGhlIG51bWJlciBvZiBpdGVtcyBpbiB0aGUgc3RhY2sgKi9cclxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2xpc3QubGVuZ3RoOyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gaXRlbXMgVFtdIEl0ZW1zIHRvIHN0YXJ0IGZpbGxpbmcgdGhlIHN0YWNrIHdpdGguXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGl0ZW1zPzogVFtdKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IG5ldyBMaW5rZWRMaXN0PFQ+KGl0ZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYW4gaXRlbSB0byB0aGUgdG9wIG9mIHRoZSBzdGFjay5cclxuICAgICAqL1xyXG4gICAgcHVzaChpdGVtOiBUKTogbnVtYmVyIHtcclxuICAgICAgICB0aGlzLl9saXN0Lmluc2VydEF0KDAsIGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0Lmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbmQgcmVtb3ZlIGFuIGl0ZW0gZnJvbSB0aGUgdG9wIG9mIHRoZSBzdGFjay5cclxuICAgICAqL1xyXG4gICAgcG9wKCk6IFQge1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5wZWVrKCk7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5yZW1vdmVBdCgwKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbiBpdGVtIGZyb20gdGhlIHRvcCBvZiB0aGUgc3RhY2sgd2l0aG91dCByZW1vdmluZyBpdC5cclxuICAgICAqL1xyXG4gICAgcGVlaygpOiBUIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdC5nZXQoMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgc3RhY2tcclxuICAgICAqL1xyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5jbGVhcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uL3V0aWxcIjtcclxuXHJcbi8qKlxyXG4gKiBTaG9ydGhhbmQgZnVuY3Rpb24gdG8gY3JlYXRlIGEgRGF0ZXNIZWxwZXIgb2JqZWN0LlxyXG4gKiBAcGFyYW0gbnVtYmVyIFRoZSBkYXRlIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIERhdGVzKGRhdGU6IERhdGUpOiBEYXRlc0hlbHBlciB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSk7IH1cclxuZXhwb3J0IGNsYXNzIERhdGVzSGVscGVyIHtcclxuICAgIGRhdGU6IERhdGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0ZTogRGF0ZSkge1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHRvRGF0ZShkYXRlOiBhbnkpOiBEYXRlIHtcclxuICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChkYXRlKSkgcmV0dXJuIG5ldyBEYXRlKCk7XHJcbiAgICAgICAgaWYgKFV0aWwuaXNTdHJpbmcoZGF0ZSkpIGRhdGUgPSBEYXRlLnBhcnNlKGRhdGUpO1xyXG4gICAgICAgIGlmIChVdGlsLmlzTnVtYmVyKGRhdGUpKSBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdlaXRoZXIgdGhlIGRhdGUgaXMgaW4gYmV0d2VlbiB0d28gbnVtYmVycy5cclxuICAgICAqIEBwYXJhbSBsb3dlciBUaGUgbG93ZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICogQHBhcmFtIHVwcGVyIFRoZSB1cHBlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKi9cclxuICAgIGJldHdlZW4obG93ZXI/OiBEYXRlLCB1cHBlcj86IERhdGUpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gRGF0ZXNIZWxwZXIuYmV0d2Vlbih0aGlzLmRhdGUsIGxvd2VyLCB1cHBlcik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2VpdGhlciBhIGRhdGUgaXMgaW4gYmV0d2VlbiB0d28gbnVtYmVycy5cclxuICAgICAqIEBwYXJhbSBkYXRlIFRoZSBkYXRlIHdoaWNoIHRvIGNvbXBhcmUgd2l0aC5cclxuICAgICAqIEBwYXJhbSBsb3dlciBUaGUgbG93ZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICogQHBhcmFtIHVwcGVyIFRoZSB1cHBlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBiZXR3ZWVuKGRhdGU6IERhdGUsIGxvd2VyPzogRGF0ZSwgdXBwZXI/OiBEYXRlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQobG93ZXIpKSBsb3dlciA9IG5ldyBEYXRlKDApO1xyXG4gICAgICAgIGlmIChVdGlsLmlzVW5kZWZpbmVkKHVwcGVyKSkgdXBwZXIgPSBuZXcgRGF0ZSg5OTk5OTk5OTk5OTk5KTtcclxuICAgICAgICByZXR1cm4gKGxvd2VyIDw9IGRhdGUgJiYgZGF0ZSA8PSB1cHBlcik7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkWWVhcnMoeWVhcnM6IG51bWJlcik6IHRoaXMgeyByZXR1cm4gdGhpcy5hZGRNb250aHMoeWVhcnMgKiAxMik7IH1cclxuICAgIGFkZE1vbnRocyhtb250aHM6IG51bWJlcik6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuZGF0ZS5zZXRNb250aCh0aGlzLmRhdGUuZ2V0TW9udGgoKSArIG1vbnRocyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkV2Vla3Mod2VlazogbnVtYmVyKTogdGhpcyB7IHJldHVybiB0aGlzLmFkZERheXMod2VlayAqIDcpOyB9XHJcbiAgICBhZGREYXlzKGRheXM6IG51bWJlcik6IHRoaXMgeyByZXR1cm4gdGhpcy5hZGRIb3VycyhkYXlzICogMjQpOyB9XHJcbiAgICBhZGRIb3Vycyhob3VyczogbnVtYmVyKTogdGhpcyB7IHJldHVybiB0aGlzLmFkZE1pbnV0ZXMoaG91cnMgKiA2MCk7IH1cclxuICAgIGFkZE1pbnV0ZXMobWludXRlczogbnVtYmVyKTogdGhpcyB7IHJldHVybiB0aGlzLmFkZFNlY29uZHMobWludXRlcyAqIDYwKTsgfVxyXG4gICAgYWRkU2Vjb25kcyhzZWNvbmRzOiBudW1iZXIpOiB0aGlzIHsgcmV0dXJuIHRoaXMuYWRkTWlsbGlzZWNvbmRzKHNlY29uZHMgKiAxMDAwKTsgfVxyXG4gICAgYWRkTWlsbGlzZWNvbmRzKG1pbGxpc2Vjb25kczogbnVtYmVyKTogdGhpcyB7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNldE1pbGxpc2Vjb25kcyh0aGlzLmRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgKyBtaWxsaXNlY29uZHMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVG9kYXkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZS50b0RhdGVTdHJpbmcoKSA9PT0gbmV3IERhdGUoKS50b0RhdGVTdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b01pZG5pZ2h0KCk6IHRoaXMge1xyXG4gICAgICAgIHRoaXMuZGF0ZS5zZXRIb3VycygwKTtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0TWludXRlcygwKTtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0U2Vjb25kcygwKTtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhZGRZZWFycyhkYXRlOiBEYXRlLCB5ZWFyczogbnVtYmVyKTogRGF0ZSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkWWVhcnMoeWVhcnMpLmRhdGU7IH1cclxuICAgIHN0YXRpYyBhZGRNb250aHMoZGF0ZTogRGF0ZSwgbW9udGhzOiBudW1iZXIpOiBEYXRlIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRNb250aHMobW9udGhzKS5kYXRlOyB9XHJcbiAgICBzdGF0aWMgYWRkV2Vla3MoZGF0ZTogRGF0ZSwgd2VlazogbnVtYmVyKTogRGF0ZSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkV2Vla3Mod2VlaykuZGF0ZTsgfVxyXG4gICAgc3RhdGljIGFkZERheXMoZGF0ZTogRGF0ZSwgZGF5czogbnVtYmVyKTogRGF0ZSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkRGF5cyhkYXlzKS5kYXRlOyB9XHJcbiAgICBzdGF0aWMgYWRkSG91cnMoZGF0ZTogRGF0ZSwgaG91cnM6IG51bWJlcik6IERhdGUgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZEhvdXJzKGhvdXJzKS5kYXRlOyB9XHJcbiAgICBzdGF0aWMgYWRkTWludXRlcyhkYXRlOiBEYXRlLCBtaW51dGVzOiBudW1iZXIpOiBEYXRlIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRNaW51dGVzKG1pbnV0ZXMpLmRhdGU7IH1cclxuICAgIHN0YXRpYyBhZGRTZWNvbmRzKGRhdGU6IERhdGUsIHNlY29uZHM6IG51bWJlcik6IERhdGUgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZFNlY29uZHMoc2Vjb25kcykuZGF0ZTsgfVxyXG4gICAgc3RhdGljIGFkZE1pbGxpc2Vjb25kcyhkYXRlOiBEYXRlLCBtaWxsaXNlY29uZHM6IG51bWJlcik6IERhdGUgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZE1pbGxpc2Vjb25kcyhtaWxsaXNlY29uZHMpLmRhdGU7IH1cclxuICAgIHN0YXRpYyBpc1RvZGF5KGRhdGU6IERhdGUpOiBib29sZWFuIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5pc1RvZGF5KCk7IH1cclxuICAgIHN0YXRpYyB0b01pZG5pZ2h0KGRhdGU6IERhdGUpOiBEYXRlIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS50b01pZG5pZ2h0KCkuZGF0ZTsgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIHV0aWwgZnJvbSBcIi4uL3V0aWxcIjtcclxuXHJcbi8qKlxyXG4gKiBTaG9ydGhhbmQgZnVuY3Rpb24gdG8gY3JlYXRlIGEgTnVtYmVyc0hlbHBlciBvYmplY3QuXHJcbiAqIEBwYXJhbSBudW1iZXIgVGhlIG51bWJlciBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBOdW1iZXJzKG51bTogbnVtYmVyKTogTnVtYmVyc0hlbHBlciB7IHJldHVybiBuZXcgTnVtYmVyc0hlbHBlcihudW0pOyB9XHJcbmV4cG9ydCBjbGFzcyBOdW1iZXJzSGVscGVyIHtcclxuICAgIG51bTogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIE51bWJlcnNIZWxwZXIgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIG51bWJlciBUaGUgbnVtYmVyIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihudW06IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMubnVtID0gbnVtO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3ZWl0aGVyIHRoZSBudW1iZXIgaXMgaW4gYmV0d2VlbiB0d28gbnVtYmVycy5cclxuICAgICAqIEBwYXJhbSBsb3dlciBUaGUgbG93ZXIgaW5jbHVzaXZlIGJvdW5kLlxyXG4gICAgICogQHBhcmFtIHVwcGVyIFRoZSB1cHBlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKi9cclxuICAgIGJldHdlZW4obG93ZXI/OiBudW1iZXIsIHVwcGVyPzogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcnNIZWxwZXIuYmV0d2Vlbih0aGlzLm51bSwgbG93ZXIsIHVwcGVyKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3ZWl0aGVyIGEgbnVtYmVyIGlzIGluIGJldHdlZW4gdHdvIG51bWJlcnMuXHJcbiAgICAgKiBAcGFyYW0gbnVtYmVyIFRoZSBudW1iZXIgd2hpY2ggdG8gY29tcGFyZSB3aXRoLlxyXG4gICAgICogQHBhcmFtIGxvd2VyIFRoZSBsb3dlciBpbmNsdXNpdmUgYm91bmQuXHJcbiAgICAgKiBAcGFyYW0gdXBwZXIgVGhlIHVwcGVyIGluY2x1c2l2ZSBib3VuZC5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGJldHdlZW4obnVtOiBudW1iZXIsIGxvd2VyPzogbnVtYmVyLCB1cHBlcj86IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGxvd2VyKSkgbG93ZXIgPSBOdW1iZXIuTUlOX1ZBTFVFO1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKHVwcGVyKSkgdXBwZXIgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIHJldHVybiAobG93ZXIgPD0gbnVtICYmIG51bSA8PSB1cHBlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdlaXRoZXIgdGhlIG51bWJlciBpcyBpbiBhbiBhcnJheS5cclxuICAgICAqIEBwYXJhbSBudW1iZXJzIFRoZSBhcnJheSBvZiBudW1iZXJzIHRvIGNvbXBhcmUgd2l0aC5cclxuICAgICAqL1xyXG4gICAgaW4obnVtYmVyczogbnVtYmVyW10pOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyc0hlbHBlci5pbih0aGlzLm51bSwgbnVtYmVycyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2VpdGhlciBhIG51bWJlciBpcyBpbiBhbiBhcnJheS5cclxuICAgICAqIEBwYXJhbSBudW1iZXIgVGhlIG51bWJlciB3aGljaCB0byBjb21wYXJlIHdpdGguXHJcbiAgICAgKiBAcGFyYW0gbnVtYmVycyBUaGUgYXJyYXkgb2YgbnVtYmVycyB0byBjb21wYXJlIHdpdGguXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbihudW06IG51bWJlciwgbnVtYmVyczogbnVtYmVyW10pOiBib29sZWFuIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKG51bWJlcnNbaV0gPT0gbnVtKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2FmZWx5IHJvdW5kIG51bWJlcnMgaW4gSlMgd2l0aG91dCBoaXR0aW5nIGltcHJlY2lzaW9ucyBvZiBmbG9hdGluZy1wb2ludCBhcml0aG1ldGljc1xyXG4gICAgICogS2luZGx5IGJvcnJvd2VkIGZyb20gQW5ndWxhckpTOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvZzNfdjFfMy9zcmMvbmcvZmlsdGVyL2ZpbHRlcnMuanMjTDE3M1xyXG4gICAgICogQHBhcmFtIHByZWNpc2lvbiBIb3cgbWFueSBkZWNpbWFscyB0aGUgbnVtYmVyIHNob3VsZCBoYXZlLlxyXG4gICAgICovXHJcbiAgICB0b0ZpeGVkKHByZWNpc2lvbikge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXJzSGVscGVyLnRvRml4ZWQodGhpcy5udW0sIHByZWNpc2lvbik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNhZmVseSByb3VuZCBudW1iZXJzIGluIEpTIHdpdGhvdXQgaGl0dGluZyBpbXByZWNpc2lvbnMgb2YgZmxvYXRpbmctcG9pbnQgYXJpdGhtZXRpY3NcclxuICAgICAqIEtpbmRseSBib3Jyb3dlZCBmcm9tIEFuZ3VsYXJKUzogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9ibG9iL2czX3YxXzMvc3JjL25nL2ZpbHRlci9maWx0ZXJzLmpzI0wxNzNcclxuICAgICAqIEBwYXJhbSBwcmVjaXNpb24gSG93IG1hbnkgZGVjaW1hbHMgdGhlIG51bWJlciBzaG91bGQgaGF2ZS5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRvRml4ZWQobnVtOiBudW1iZXIsIHByZWNpc2lvbikge1xyXG4gICAgICAgIHJldHVybiArKE1hdGgucm91bmQoKyhudW0udG9TdHJpbmcoKSArIFwiZVwiICsgcHJlY2lzaW9uKSkudG9TdHJpbmcoKSArIFwiZVwiICsgLXByZWNpc2lvbik7XHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIFNob3J0aGFuZCBmdW5jdGlvbiB0byBjcmVhdGUgYSBTdHJpbmdzSGVscGVyIG9iamVjdC5cclxuICogQHBhcmFtIG51bWJlciBUaGUgc3RyaW5nIG9uIHdoaWNoIHRvIHBlcmZvcm0gdGhlIHZhcmlvdXMgZnVuY3Rpb25zLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIFN0cmluZ3Moc3RyOiBzdHJpbmcpOiBTdHJpbmdzSGVscGVyIHsgcmV0dXJuIG5ldyBTdHJpbmdzSGVscGVyKHN0cik7IH1cclxuZXhwb3J0IGNsYXNzIFN0cmluZ3NIZWxwZXIge1xyXG4gICAgc3RyOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgU3RyaW5nc0hlbHBlciBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gc3RyIFRoZSBzdHJpbmcgb24gd2hpY2ggdG8gcGVyZm9ybSB0aGUgdmFyaW91cyBmdW5jdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHN0cjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zdHIgPSBzdHI7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0KC4uLmFyZ3M6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgcmV0dXJuIFN0cmluZ3NIZWxwZXIuZm9ybWF0LmFwcGx5KHVuZGVmaW5lZCwgW3RoaXMuc3RyXS5jb25jYXQoYXJncykpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmb3JtYXQoc3RyOiBzdHJpbmcsIC4uLmFyZ3M6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgXFxcXHske2l9XFxcXH1gLCBcImdcIik7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHJlZ2V4LCBhcmdzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH1cclxufVxyXG4iLCIvKipcclxuICogU2hvcnRoYW5kIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIFVybEhlbHBlciBvYmplY3QuXHJcbiAqIEBwYXJhbSB1cmwgVGhlIFVSTCBvbiB3aGljaCB0byBwZXJmb3JtIHRoZSB2YXJpb3VzIGZ1bmN0aW9ucy5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBVcmwodXJsOiBzdHJpbmcgPSBsb2NhdGlvbi5ocmVmKTogVXJsSGVscGVyIHsgcmV0dXJuIG5ldyBVcmxIZWxwZXIodXJsKTsgfVxyXG5leHBvcnQgY2xhc3MgVXJsSGVscGVyIHtcclxuICAgIHVybDogc3RyaW5nO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIFVybEhlbHBlciBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gdXJsIFRoZSBVUkwgb24gd2hpY2ggdG8gcGVyZm9ybSB0aGUgdmFyaW91cyBmdW5jdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nID0gbG9jYXRpb24uaHJlZikge1xyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiBhIHF1ZXJ5IGluIHRoZSBVUkwuXHJcbiAgICAgKiBAcGFyYW0gcGFyYW0gVGhlIG5hbWUgb2YgdGhlIHF1ZXJ5IHRvIGdldC5cclxuICAgICAqL1xyXG4gICAgc2VhcmNoKHBhcmFtOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBVcmxIZWxwZXIuc2VhcmNoKHBhcmFtLCB0aGlzLnVybCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgYSBxdWVyeSBpbiB0aGUgVVJMLlxyXG4gICAgICogQHBhcmFtIHVybCBUaGUgVVJMIGZyb20gd2hpY2ggdG8gZ2V0IHRoZSBxdWVyeS5cclxuICAgICAqIEBwYXJhbSBwYXJhbSBUaGUgbmFtZSBvZiB0aGUgcXVlcnkgdG8gZ2V0LlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2VhcmNoKHBhcmFtOiBzdHJpbmcsIHVybDogc3RyaW5nID0gbG9jYXRpb24uaHJlZik6IHN0cmluZyB7XHJcbiAgICAgICAgcGFyYW0gPSBwYXJhbS5yZXBsYWNlKC9bXFxbXS8sIFwiXFxcXFtcIikucmVwbGFjZSgvW1xcXV0vLCBcIlxcXFxdXCIpO1xyXG4gICAgICAgIGxldCByZWdleCA9IG5ldyBSZWdFeHAoXCJbXFxcXD8mXVwiICsgcGFyYW0gKyBcIj0oW14mI10qKVwiLCBcImlcIiksXHJcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCB8fCBsb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgICAgIHJldHVybiAhcmVzdWx0cyA/IFwiXCIgOiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCB7YWxsUHJvdG8sIGFsbFN0YXRpY30gZnJvbSBcIi4uL29wZXJhdG9yL2FsbFwiO1xyXG5cclxuTGlucS5wcm90b3R5cGUuYWxsID0gYWxsUHJvdG87XHJcbkxpbnEuYWxsID0gYWxsU3RhdGljO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCIuLi9saW5xXCIge1xyXG4gICAgaW50ZXJmYWNlIExpbnE8VFNvdXJjZT4ge1xyXG4gICAgICAgIGFsbDogdHlwZW9mIGFsbFByb3RvO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWVzcGFjZSBMaW5xIHtcclxuICAgICAgICBleHBvcnQgbGV0IGFsbDogdHlwZW9mIGFsbFN0YXRpYztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCB7YW55UHJvdG8sIGFueVN0YXRpY30gZnJvbSBcIi4uL29wZXJhdG9yL2FueVwiO1xyXG5cclxuTGlucS5wcm90b3R5cGUuYW55ID0gYW55UHJvdG87XHJcbkxpbnEuYW55ID0gYW55U3RhdGljO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCIuLi9saW5xXCIge1xyXG4gICAgaW50ZXJmYWNlIExpbnE8VFNvdXJjZT4ge1xyXG4gICAgICAgIGFueTogdHlwZW9mIGFueVByb3RvO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWVzcGFjZSBMaW5xIHtcclxuICAgICAgICBleHBvcnQgbGV0IGFueTogdHlwZW9mIGFueVN0YXRpYztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCB7YXZlcmFnZVByb3RvLCBhdmVyYWdlU3RhdGljfSBmcm9tIFwiLi4vb3BlcmF0b3IvYXZlcmFnZVwiO1xyXG5cclxuTGlucS5wcm90b3R5cGUuYXZlcmFnZSA9IGF2ZXJhZ2VQcm90bztcclxuTGlucS5hdmVyYWdlID0gYXZlcmFnZVN0YXRpYztcclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiLi4vbGlucVwiIHtcclxuICAgIGludGVyZmFjZSBMaW5xPFRTb3VyY2U+IHtcclxuICAgICAgICBhdmVyYWdlOiB0eXBlb2YgYXZlcmFnZVByb3RvO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWVzcGFjZSBMaW5xIHtcclxuICAgICAgICBleHBvcnQgbGV0IGF2ZXJhZ2U6IHR5cGVvZiBhdmVyYWdlU3RhdGljO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TGlucX0gZnJvbSBcIi4uL2xpbnFcIjtcclxuaW1wb3J0IHtkaXN0aW5jdFByb3RvLCBkaXN0aW5jdFN0YXRpY30gZnJvbSBcIi4uL2l0ZXJhdG9yL2Rpc3RpbmN0XCI7XHJcblxyXG5MaW5xLnByb3RvdHlwZS5kaXN0aW5jdCA9IGRpc3RpbmN0UHJvdG87XHJcbkxpbnEuZGlzdGluY3QgPSBkaXN0aW5jdFN0YXRpYztcclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiLi4vbGlucVwiIHtcclxuICAgIGludGVyZmFjZSBMaW5xPFRTb3VyY2U+IHtcclxuICAgICAgICBkaXN0aW5jdDogdHlwZW9mIGRpc3RpbmN0UHJvdG87XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZXNwYWNlIExpbnEge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZGlzdGluY3Q6IHR5cGVvZiBkaXN0aW5jdFN0YXRpYztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCB7ZXhjZXB0UHJvdG8sIGV4Y2VwdFN0YXRpY30gZnJvbSBcIi4uL2l0ZXJhdG9yL2V4Y2VwdFwiO1xyXG5cclxuTGlucS5wcm90b3R5cGUuZXhjZXB0ID0gZXhjZXB0UHJvdG87XHJcbkxpbnEuZXhjZXB0ID0gZXhjZXB0U3RhdGljO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCIuLi9saW5xXCIge1xyXG4gICAgaW50ZXJmYWNlIExpbnE8VFNvdXJjZT4ge1xyXG4gICAgICAgIGV4Y2VwdDogdHlwZW9mIGV4Y2VwdFByb3RvO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWVzcGFjZSBMaW5xIHtcclxuICAgICAgICBleHBvcnQgbGV0IGV4Y2VwdDogdHlwZW9mIGV4Y2VwdFN0YXRpYztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCB7ZmlsdGVyUHJvdG8sIGZpbHRlclN0YXRpY30gZnJvbSBcIi4uL2l0ZXJhdG9yL2ZpbHRlclwiO1xyXG5cclxuTGlucS5wcm90b3R5cGUuZmlsdGVyID0gZmlsdGVyUHJvdG87XHJcbkxpbnEuZmlsdGVyID0gZmlsdGVyU3RhdGljO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCIuLi9saW5xXCIge1xyXG4gICAgaW50ZXJmYWNlIExpbnE8VFNvdXJjZT4ge1xyXG4gICAgICAgIGZpbHRlcjogdHlwZW9mIGZpbHRlclByb3RvO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWVzcGFjZSBMaW5xIHtcclxuICAgICAgICBleHBvcnQgbGV0IGZpbHRlcjogdHlwZW9mIGZpbHRlclN0YXRpYztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCB7Zmlyc3RQcm90bywgZmlyc3RTdGF0aWN9IGZyb20gXCIuLi9vcGVyYXRvci9maXJzdFwiO1xyXG5cclxuTGlucS5wcm90b3R5cGUuZmlyc3QgPSBmaXJzdFByb3RvO1xyXG5MaW5xLmZpcnN0ID0gZmlyc3RTdGF0aWM7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2xpbnFcIiB7XHJcbiAgICBpbnRlcmZhY2UgTGlucTxUU291cmNlPiB7XHJcbiAgICAgICAgZmlyc3Q6IHR5cGVvZiBmaXJzdFByb3RvO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWVzcGFjZSBMaW5xIHtcclxuICAgICAgICBleHBvcnQgbGV0IGZpcnN0OiB0eXBlb2YgZmlyc3RTdGF0aWM7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgTGlucSB9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCB7IGdyb3VwQnlQcm90bywgZ3JvdXBCeVN0YXRpYyB9IGZyb20gXCIuLi9pdGVyYXRvci9ncm91cEJ5XCI7XHJcblxyXG5MaW5xLnByb3RvdHlwZS5ncm91cEJ5ID0gZ3JvdXBCeVByb3RvO1xyXG5MaW5xLmdyb3VwQnkgPSBncm91cEJ5U3RhdGljO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCIuLi9saW5xXCIge1xyXG4gICAgaW50ZXJmYWNlIExpbnE8VFNvdXJjZT4ge1xyXG4gICAgICAgIGdyb3VwQnk6IHR5cGVvZiBncm91cEJ5UHJvdG87XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZXNwYWNlIExpbnEge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgZ3JvdXBCeTogdHlwZW9mIGdyb3VwQnlTdGF0aWM7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5pbXBvcnQge2ludGVyc2VjdFByb3RvLCBpbnRlcnNlY3RTdGF0aWN9IGZyb20gXCIuLi9pdGVyYXRvci9pbnRlcnNlY3RcIjtcclxuXHJcbkxpbnEucHJvdG90eXBlLmludGVyc2VjdCA9IGludGVyc2VjdFByb3RvO1xyXG5MaW5xLmludGVyc2VjdCA9IGludGVyc2VjdFN0YXRpYztcclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiLi4vbGlucVwiIHtcclxuICAgIGludGVyZmFjZSBMaW5xPFRTb3VyY2U+IHtcclxuICAgICAgICBpbnRlcnNlY3Q6IHR5cGVvZiBpbnRlcnNlY3RQcm90bztcclxuICAgIH1cclxuXHJcbiAgICBuYW1lc3BhY2UgTGlucSB7XHJcbiAgICAgICAgZXhwb3J0IGxldCBpbnRlcnNlY3Q6IHR5cGVvZiBpbnRlcnNlY3RTdGF0aWM7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5pbXBvcnQge2pvaW5Qcm90bywgam9pblN0YXRpY30gZnJvbSBcIi4uL2l0ZXJhdG9yL2pvaW5cIjtcclxuXHJcbkxpbnEucHJvdG90eXBlLmpvaW4gPSBqb2luUHJvdG87XHJcbkxpbnEuam9pbiA9IGpvaW5TdGF0aWM7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2xpbnFcIiB7XHJcbiAgICBpbnRlcmZhY2UgTGlucTxUU291cmNlPiB7XHJcbiAgICAgICAgam9pbjogdHlwZW9mIGpvaW5Qcm90bztcclxuICAgIH1cclxuXHJcbiAgICBuYW1lc3BhY2UgTGlucSB7XHJcbiAgICAgICAgZXhwb3J0IGxldCBqb2luOiB0eXBlb2Ygam9pblN0YXRpYztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCB7bGFzdFByb3RvLCBsYXN0U3RhdGljfSBmcm9tIFwiLi4vb3BlcmF0b3IvbGFzdFwiO1xyXG5cclxuTGlucS5wcm90b3R5cGUubGFzdCA9IGxhc3RQcm90bztcclxuTGlucS5sYXN0ID0gbGFzdFN0YXRpYztcclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiLi4vbGlucVwiIHtcclxuICAgIGludGVyZmFjZSBMaW5xPFRTb3VyY2U+IHtcclxuICAgICAgICBsYXN0OiB0eXBlb2YgbGFzdFByb3RvO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWVzcGFjZSBMaW5xIHtcclxuICAgICAgICBleHBvcnQgbGV0IGxhc3Q6IHR5cGVvZiBsYXN0U3RhdGljO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TGlucX0gZnJvbSBcIi4uL2xpbnFcIjtcclxuaW1wb3J0IHttYXBQcm90bywgbWFwU3RhdGljfSBmcm9tIFwiLi4vaXRlcmF0b3IvbWFwXCI7XHJcblxyXG5MaW5xLnByb3RvdHlwZS5tYXAgPSBtYXBQcm90bztcclxuTGlucS5tYXAgPSBtYXBTdGF0aWM7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2xpbnFcIiB7XHJcbiAgICBpbnRlcmZhY2UgTGlucTxUU291cmNlPiB7XHJcbiAgICAgICAgbWFwOiB0eXBlb2YgbWFwUHJvdG87XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZXNwYWNlIExpbnEge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbWFwOiB0eXBlb2YgbWFwU3RhdGljO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TGlucX0gZnJvbSBcIi4uL2xpbnFcIjtcclxuaW1wb3J0IHttYXhQcm90bywgbWF4U3RhdGljfSBmcm9tIFwiLi4vb3BlcmF0b3IvbWF4XCI7XHJcblxyXG5MaW5xLnByb3RvdHlwZS5tYXggPSBtYXhQcm90bztcclxuTGlucS5tYXggPSBtYXhTdGF0aWM7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2xpbnFcIiB7XHJcbiAgICBpbnRlcmZhY2UgTGlucTxUU291cmNlPiB7XHJcbiAgICAgICAgbWF4OiB0eXBlb2YgbWF4UHJvdG87XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZXNwYWNlIExpbnEge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbWF4OiB0eXBlb2YgbWF4U3RhdGljO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TGlucX0gZnJvbSBcIi4uL2xpbnFcIjtcclxuaW1wb3J0IHttaW5Qcm90bywgbWluU3RhdGljfSBmcm9tIFwiLi4vb3BlcmF0b3IvbWluXCI7XHJcblxyXG5MaW5xLnByb3RvdHlwZS5taW4gPSBtaW5Qcm90bztcclxuTGlucS5taW4gPSBtaW5TdGF0aWM7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2xpbnFcIiB7XHJcbiAgICBpbnRlcmZhY2UgTGlucTxUU291cmNlPiB7XHJcbiAgICAgICAgbWluOiB0eXBlb2YgbWluUHJvdG87XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZXNwYWNlIExpbnEge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgbWluOiB0eXBlb2YgbWluU3RhdGljO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TGlucX0gZnJvbSBcIi4uL2xpbnFcIjtcclxuaW1wb3J0IHtCYXNlSXRlcmF0b3J9IGZyb20gXCIuLi9pdGVyYXRvci9pdGVyYXRvclwiO1xyXG5pbXBvcnQge29yZGVyQnlQcm90bywgb3JkZXJCeVN0YXRpYywgb3JkZXJCeURlc2NQcm90bywgb3JkZXJCeURlc2NTdGF0aWN9IGZyb20gXCIuLi9pdGVyYXRvci9vcmRlckJ5XCI7XHJcblxyXG5MaW5xLnByb3RvdHlwZS5vcmRlckJ5ID0gb3JkZXJCeVByb3RvO1xyXG5MaW5xLnByb3RvdHlwZS5vcmRlckJ5RGVzYyA9IG9yZGVyQnlEZXNjUHJvdG87XHJcblxyXG5MaW5xLm9yZGVyQnkgPSBvcmRlckJ5U3RhdGljO1xyXG5MaW5xLm9yZGVyQnlEZXNjID0gb3JkZXJCeURlc2NTdGF0aWM7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2xpbnFcIiB7XHJcbiAgICBpbnRlcmZhY2UgTGlucTxUU291cmNlPiB7XHJcbiAgICAgICAgb3JkZXJCeTogdHlwZW9mIG9yZGVyQnlQcm90bztcclxuICAgICAgICBvcmRlckJ5RGVzYzogdHlwZW9mIG9yZGVyQnlEZXNjUHJvdG87XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZXNwYWNlIExpbnEge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgb3JkZXJCeTogdHlwZW9mIG9yZGVyQnlTdGF0aWM7XHJcbiAgICAgICAgZXhwb3J0IGxldCBvcmRlckJ5RGVzYzogdHlwZW9mIG9yZGVyQnlEZXNjU3RhdGljO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TGlucX0gZnJvbSBcIi4uL2xpbnFcIjtcclxuaW1wb3J0IHtzaW5nbGVQcm90bywgc2luZ2xlU3RhdGljfSBmcm9tIFwiLi4vb3BlcmF0b3Ivc2luZ2xlXCI7XHJcblxyXG5MaW5xLnByb3RvdHlwZS5zaW5nbGUgPSBzaW5nbGVQcm90bztcclxuTGlucS5zaW5nbGUgPSBzaW5nbGVTdGF0aWM7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2xpbnFcIiB7XHJcbiAgICBpbnRlcmZhY2UgTGlucTxUU291cmNlPiB7XHJcbiAgICAgICAgc2luZ2xlOiB0eXBlb2Ygc2luZ2xlUHJvdG87XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZXNwYWNlIExpbnEge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2luZ2xlOiB0eXBlb2Ygc2luZ2xlU3RhdGljO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7TGlucX0gZnJvbSBcIi4uL2xpbnFcIjtcclxuaW1wb3J0IHtza2lwUHJvdG8sIHNraXBTdGF0aWN9IGZyb20gXCIuLi9pdGVyYXRvci9za2lwXCI7XHJcblxyXG5MaW5xLnByb3RvdHlwZS5za2lwID0gc2tpcFByb3RvO1xyXG5MaW5xLnNraXAgPSBza2lwU3RhdGljO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCIuLi9saW5xXCIge1xyXG4gICAgaW50ZXJmYWNlIExpbnE8VFNvdXJjZT4ge1xyXG4gICAgICAgIHNraXA6IHR5cGVvZiBza2lwUHJvdG87XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZXNwYWNlIExpbnEge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgc2tpcDogdHlwZW9mIHNraXBTdGF0aWM7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5pbXBvcnQge3NraXBXaGlsZVByb3RvLCBza2lwV2hpbGVTdGF0aWN9IGZyb20gXCIuLi9pdGVyYXRvci9za2lwV2hpbGVcIjtcclxuXHJcbkxpbnEucHJvdG90eXBlLnNraXBXaGlsZSA9IHNraXBXaGlsZVByb3RvO1xyXG5MaW5xLnNraXBXaGlsZSA9IHNraXBXaGlsZVN0YXRpYztcclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiLi4vbGlucVwiIHtcclxuICAgIGludGVyZmFjZSBMaW5xPFRTb3VyY2U+IHtcclxuICAgICAgICBza2lwV2hpbGU6IHR5cGVvZiBza2lwV2hpbGVQcm90bztcclxuICAgIH1cclxuXHJcbiAgICBuYW1lc3BhY2UgTGlucSB7XHJcbiAgICAgICAgZXhwb3J0IGxldCBza2lwV2hpbGU6IHR5cGVvZiBza2lwV2hpbGVTdGF0aWM7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5pbXBvcnQge3N1bVByb3RvLCBzdW1TdGF0aWN9IGZyb20gXCIuLi9vcGVyYXRvci9zdW1cIjtcclxuXHJcbkxpbnEucHJvdG90eXBlLnN1bSA9IHN1bVByb3RvO1xyXG5MaW5xLnN1bSA9IHN1bVN0YXRpYztcclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiLi4vbGlucVwiIHtcclxuICAgIGludGVyZmFjZSBMaW5xPFRTb3VyY2U+IHtcclxuICAgICAgICBzdW06IHR5cGVvZiBzdW1Qcm90bztcclxuICAgIH1cclxuXHJcbiAgICBuYW1lc3BhY2UgTGlucSB7XHJcbiAgICAgICAgZXhwb3J0IGxldCBzdW06IHR5cGVvZiBzdW1TdGF0aWM7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5pbXBvcnQge3Rha2VQcm90bywgdGFrZVN0YXRpY30gZnJvbSBcIi4uL2l0ZXJhdG9yL3Rha2VcIjtcclxuXHJcbkxpbnEucHJvdG90eXBlLnRha2UgPSB0YWtlUHJvdG87XHJcbkxpbnEudGFrZSA9IHRha2VTdGF0aWM7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcIi4uL2xpbnFcIiB7XHJcbiAgICBpbnRlcmZhY2UgTGlucTxUU291cmNlPiB7XHJcbiAgICAgICAgdGFrZTogdHlwZW9mIHRha2VQcm90bztcclxuICAgIH1cclxuXHJcbiAgICBuYW1lc3BhY2UgTGlucSB7XHJcbiAgICAgICAgZXhwb3J0IGxldCB0YWtlOiB0eXBlb2YgdGFrZVN0YXRpYztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCB7dGFrZVdoaWxlUHJvdG8sIHRha2VXaGlsZVN0YXRpY30gZnJvbSBcIi4uL2l0ZXJhdG9yL3Rha2VXaGlsZVwiO1xyXG5cclxuTGlucS5wcm90b3R5cGUudGFrZVdoaWxlID0gdGFrZVdoaWxlUHJvdG87XHJcbkxpbnEudGFrZVdoaWxlID0gdGFrZVdoaWxlU3RhdGljO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCIuLi9saW5xXCIge1xyXG4gICAgaW50ZXJmYWNlIExpbnE8VFNvdXJjZT4ge1xyXG4gICAgICAgIHRha2VXaGlsZTogdHlwZW9mIHRha2VXaGlsZVByb3RvO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWVzcGFjZSBMaW5xIHtcclxuICAgICAgICBleHBvcnQgbGV0IHRha2VXaGlsZTogdHlwZW9mIHRha2VXaGlsZVN0YXRpYztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCB7emlwUHJvdG8sIHppcFN0YXRpY30gZnJvbSBcIi4uL2l0ZXJhdG9yL3ppcFwiO1xyXG5cclxuTGlucS5wcm90b3R5cGUuemlwID0gemlwUHJvdG87XHJcbkxpbnEuemlwID0gemlwU3RhdGljO1xyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCIuLi9saW5xXCIge1xyXG4gICAgaW50ZXJmYWNlIExpbnE8VFNvdXJjZT4ge1xyXG4gICAgICAgIHppcDogdHlwZW9mIHppcFByb3RvO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWVzcGFjZSBMaW5xIHtcclxuICAgICAgICBleHBvcnQgbGV0IHppcDogdHlwZW9mIHppcFN0YXRpYztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgKiBhcyBVdGlsIGZyb20gXCIuLi8uLi91dGlsXCI7XHJcbmltcG9ydCB7QmFzZUl0ZXJhdG9yLCBJdGVyYXRvclJlc3VsdH0gZnJvbSBcIi4vaXRlcmF0b3JcIjtcclxuaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERpc3RpbmN0SXRlcmF0b3I8VFNvdXJjZT4gZXh0ZW5kcyBCYXNlSXRlcmF0b3I8VFNvdXJjZT4ge1xyXG5cclxuICAgIHByaXZhdGUgX3ByZXZpb3VzSXRlbXM6IFRTb3VyY2VbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHNvdXJjZTogVFNvdXJjZVtdIHwgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+LFxyXG4gICAgICAgIHByaXZhdGUgY29tcGFyZXI6IFV0aWwuSUVxdWFsaXR5Q29tcGFyZXI8YW55PiA9IFV0aWwuZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXJcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKHNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpOiBJdGVyYXRvclJlc3VsdDxUU291cmNlPiB7XHJcbiAgICAgICAgbGV0IHJzOiBJdGVyYXRvclJlc3VsdDxUU291cmNlPjtcclxuXHJcbiAgICAgICAgd2hpbGUgKCEocnMgPSBzdXBlci5uZXh0KCkpLmRvbmUpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9wcmV2aW91c0l0ZW1zLnNvbWUoeCA9PiB0aGlzLmNvbXBhcmVyKHgsIHJzLnZhbHVlKSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzSXRlbXMucHVzaChycy52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcnM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZGlzdGluY3Q8VFNvdXJjZT4oc291cmNlOiBUU291cmNlW10gfCBCYXNlSXRlcmF0b3I8VFNvdXJjZT4sIGNvbXBhcmVyOiBVdGlsLklFcXVhbGl0eUNvbXBhcmVyPFRTb3VyY2U+ID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcik6IERpc3RpbmN0SXRlcmF0b3I8VFNvdXJjZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBEaXN0aW5jdEl0ZXJhdG9yPFRTb3VyY2U+KHNvdXJjZSwgY29tcGFyZXIpO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEdldCBhIGxpc3Qgb2YgdW5pcXVlIGl0ZW1zIHRoYXQgZXhpc3RzIG9uZSBvciBtb3JlIHRpbWVzIGluIHRoZSBkYXRhc2V0LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0UHJvdG88VFNvdXJjZT4odGhpczogTGlucTxUU291cmNlPiwgY29tcGFyZXI6IFV0aWwuSUVxdWFsaXR5Q29tcGFyZXI8VFNvdXJjZT4gPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyKTogTGlucTxUU291cmNlPiB7XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KGRpc3RpbmN0LCBjb21wYXJlcik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIHVuaXF1ZSBpdGVtcyB0aGF0IGV4aXN0cyBvbmUgb3IgbW9yZSB0aW1lcyBpbiBhbnkgb2YgdGhlIGRhdGFzZXRzLlxyXG4gKiBAcGFyYW0gc291cmNlIFRoZSBkYXRhc2V0cyB0byBiZSBnZXQgZGlzdGluY3QgaXRlbXMgZnJvbS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdFN0YXRpYzxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSB8IExpbnE8VFNvdXJjZT4sIGNvbXBhcmVyOiBVdGlsLklFcXVhbGl0eUNvbXBhcmVyPFRTb3VyY2U+ID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcik6IFRTb3VyY2VbXSB7XHJcblxyXG4gICAgbGV0IGE6IFRTb3VyY2VbXSA9IChzb3VyY2UgaW5zdGFuY2VvZiBMaW5xKSA/IHNvdXJjZS50b0FycmF5PFRTb3VyY2U+KCkgOiBzb3VyY2U7XHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGEuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgICBpZiAoIXJlc3VsdC5zb21lKHkgPT4gY29tcGFyZXIoeCwgeSkpKSByZXN1bHQucHVzaCh4KTtcclxuICAgICAgICAvLyBpZiAocmVzdWx0LmluZGV4T2YoeCkgPT09IC0xKVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICAvLyBsZXQgbGlzdHM6IEFycmF5PExpbnE+ID0gW10sIHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIC8vIGRhdGFzZXRzLmZvckVhY2goZGF0YXNldCA9PiB7XHJcbiAgICAvLyAgICAgbGlzdHMucHVzaCgoZGF0YXNldCBpbnN0YW5jZW9mIExpbnEpID8gZGF0YXNldCA6IG5ldyBMaW5xKFV0aWwuY2FzdDxhbnlbXT4oZGF0YXNldCkpKTtcclxuICAgIC8vIH0pO1xyXG5cclxuICAgIC8vIGxpc3RzLmZvckVhY2gobGlzdCA9PiB7XHJcbiAgICAvLyAgICAgbGlzdC50b0FycmF5KCkuZm9yRWFjaChpdGVtID0+IHtcclxuICAgIC8vICAgICAgICAgaWYgKHJlc3VsdC5pbmRleE9mKGl0ZW0pID09IC0xKVxyXG4gICAgLy8gICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyB9KTtcclxuXHJcbiAgICAvLyByZXR1cm4gcmVzdWx0O1xyXG59XHJcbiIsImltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uLy4uL3V0aWxcIjtcclxuaW1wb3J0IHtCYXNlSXRlcmF0b3IsIEl0ZXJhdG9yUmVzdWx0fSBmcm9tIFwiLi9pdGVyYXRvclwiO1xyXG5pbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRXhjZXB0SXRlcmF0b3I8VFNvdXJjZT4gZXh0ZW5kcyBCYXNlSXRlcmF0b3I8VFNvdXJjZT4ge1xyXG5cclxuICAgIHByaXZhdGUgb3RoZXI6IEJhc2VJdGVyYXRvcjxUU291cmNlPjtcclxuICAgIHByaXZhdGUgb3RoZXJJdGVtczogVFNvdXJjZVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHNvdXJjZTogVFNvdXJjZVtdIHwgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+LFxyXG4gICAgICAgIG90aGVyOiBUU291cmNlW10gfCBCYXNlSXRlcmF0b3I8VFNvdXJjZT4sXHJcbiAgICAgICAgcHJpdmF0ZSBjb21wYXJlcjogVXRpbC5JRXF1YWxpdHlDb21wYXJlcjxUU291cmNlPiA9IFV0aWwuZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXJcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKHNvdXJjZSk7XHJcblxyXG4gICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIEJhc2VJdGVyYXRvcikge1xyXG4gICAgICAgICAgICB0aGlzLm90aGVyID0gb3RoZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vdGhlciA9IG5ldyBCYXNlSXRlcmF0b3I8VFNvdXJjZT4ob3RoZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFRTb3VyY2U+IHtcclxuICAgICAgICBsZXQgcnM6IEl0ZXJhdG9yUmVzdWx0PFRTb3VyY2U+O1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3RoZXJJdGVtcykge1xyXG4gICAgICAgICAgICB0aGlzLm90aGVySXRlbXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICghKHJzID0gdGhpcy5vdGhlci5uZXh0KCkpLmRvbmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3RoZXJJdGVtcy5wdXNoKHJzLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2hpbGUgKCEocnMgPSBzdXBlci5uZXh0KCkpLmRvbmUpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm90aGVySXRlbXMuc29tZSh4ID0+IHRoaXMuY29tcGFyZXIocnMudmFsdWUsIHgpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBkb25lOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGV4Y2VwdDxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPiwgb3RoZXI6IFRTb3VyY2VbXSwgY29tcGFyZXI6IFV0aWwuSUVxdWFsaXR5Q29tcGFyZXI8VFNvdXJjZT4gPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyKTogRXhjZXB0SXRlcmF0b3I8VFNvdXJjZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBFeGNlcHRJdGVyYXRvcjxUU291cmNlPihzb3VyY2UsIG90aGVyLCBjb21wYXJlcik7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogR2V0IGEgbGlzdCBvZiBpdGVtcyB0aGF0IG9ubHkgZXhpc3RzIGluIG9uZSBvZiB0aGUgZGF0YXNldHMuXHJcbiAqIEBwYXJhbSBvdGhlciBUaGUgb3RoZXIgZGF0YXNldC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBleGNlcHRQcm90bzxUU291cmNlPih0aGlzOiBMaW5xPFRTb3VyY2U+LCBvdGhlcjogVFNvdXJjZVtdLCBjb21wYXJlcjogVXRpbC5JRXF1YWxpdHlDb21wYXJlcjxUU291cmNlPiA9IFV0aWwuZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXIpOiBMaW5xPFRTb3VyY2U+IHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQoZXhjZXB0LCBvdGhlciwgY29tcGFyZXIpO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IGEgbGlzdCBvZiBpdGVtcyB0aGF0IG9ubHkgZXhpc3RzIGluIG9uZSBvZiB0aGUgZGF0YXNldHMuXHJcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBkYXRhc2V0LlxyXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIGRhdGFzZXQuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZXhjZXB0U3RhdGljPFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdIHwgTGlucTxUU291cmNlPiwgb3RoZXI6IFRTb3VyY2VbXSwgY29tcGFyZXI6IFV0aWwuSUVxdWFsaXR5Q29tcGFyZXI8VFNvdXJjZT4gPSBVdGlsLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyKTogVFNvdXJjZVtdIHtcclxuXHJcbiAgICBsZXQgYTogVFNvdXJjZVtdID0gKHNvdXJjZSBpbnN0YW5jZW9mIExpbnEpID8gc291cmNlLnRvQXJyYXk8VFNvdXJjZT4oKSA6IHNvdXJjZSxcclxuICAgICAgICBiOiBUU291cmNlW10gPSAob3RoZXIgaW5zdGFuY2VvZiBMaW5xKSA/IG90aGVyLnRvQXJyYXk8VFNvdXJjZT4oKSA6IG90aGVyO1xyXG5cclxuICAgIGxldCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBhLmZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgaWYgKCFiLnNvbWUoeSA9PiBjb21wYXJlcih4LCB5KSkpIHJlc3VsdC5wdXNoKHgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICAvLyBsaXN0cy5wdXNoKChhIGluc3RhbmNlb2YgTGlucSkgPyBhLnRvQXJyYXkoKSA6IGEpO1xyXG4gICAgLy8gbGlzdHMucHVzaCgoYiBpbnN0YW5jZW9mIExpbnEpID8gYi50b0FycmF5KCkgOiBiKTtcclxuXHJcbiAgICAvLyBsZXQgbGlzdHM6IEFycmF5PGFueVtdPiA9IFtdLCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAvLyBsaXN0cy5wdXNoKChhIGluc3RhbmNlb2YgTGlucSkgPyBhLnRvQXJyYXkoKSA6IGEpO1xyXG4gICAgLy8gbGlzdHMucHVzaCgoYiBpbnN0YW5jZW9mIExpbnEpID8gYi50b0FycmF5KCkgOiBiKTtcclxuICAgIC8vIG1vcmUuZm9yRWFjaChkYXRhc2V0ID0+IHtcclxuICAgIC8vICAgICBsaXN0cy5wdXNoKChkYXRhc2V0IGluc3RhbmNlb2YgTGlucSkgPyBkYXRhc2V0LnRvQXJyYXkoKSA6IGRhdGFzZXQpO1xyXG4gICAgLy8gfSk7XHJcblxyXG4gICAgLy8gbGlzdHMuZm9yRWFjaChsaXN0ID0+IHtcclxuICAgIC8vICAgICBsaXN0LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAvLyAgICAgICAgIGxldCBleGlzdHMgPSBsaXN0cy5zb21lKG90aGVyID0+IHtcclxuICAgIC8vICAgICAgICAgICAgIGlmIChsaXN0ID09PSBvdGhlcikgcmV0dXJuO1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKG90aGVyLnNvbWUoeCA9PiAgeCA9PT0gaXRlbSkpIHJldHVybiB0cnVlO1xyXG4gICAgLy8gICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgaWYgKCFleGlzdHMpIHJlc3VsdC5wdXNoKGl0ZW0pO1xyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gfSk7XHJcblxyXG4gICAgLy8gcmV0dXJuIHJlc3VsdDtcclxufVxyXG4iLCJpbXBvcnQge0Jhc2VJdGVyYXRvciwgSXRlcmF0b3JSZXN1bHR9IGZyb20gXCIuL2l0ZXJhdG9yXCI7XHJcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uLy4uL3V0aWxcIjtcclxuaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpbHRlckl0ZXJhdG9yPFRTb3VyY2U+IGV4dGVuZHMgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBzb3VyY2U6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPixcclxuICAgICAgICBwcml2YXRlIGNhbGxiYWNrOiBVdGlsLklQcmVkaWNhdGU8VFNvdXJjZT4gPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGVcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKHNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpOiBJdGVyYXRvclJlc3VsdDxUU291cmNlPiB7XHJcbiAgICAgICAgbGV0IGl0ZW06IEl0ZXJhdG9yUmVzdWx0PFRTb3VyY2U+O1xyXG5cclxuICAgICAgICB3aGlsZSAoIShpdGVtID0gc3VwZXIubmV4dCgpKS5kb25lKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGxiYWNrKGl0ZW0udmFsdWUsIHRoaXMuX2lkeCkpIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbHRlcjxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPiwgcHJlZGljYXRlOiBVdGlsLklQcmVkaWNhdGU8VFNvdXJjZT4pOiBGaWx0ZXJJdGVyYXRvcjxUU291cmNlPiB7XHJcbiAgICByZXR1cm4gbmV3IEZpbHRlckl0ZXJhdG9yPFRTb3VyY2U+KHNvdXJjZSwgcHJlZGljYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZpbHRlcnMgYSBzZXF1ZW5jZSBvZiB2YWx1ZXMgYmFzZWQgb24gYSBwcmVkaWNhdGUuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyUHJvdG88VFNvdXJjZT4odGhpczogTGlucTxUU291cmNlPiwgcHJlZGljYXRlOiBVdGlsLklQcmVkaWNhdGU8VFNvdXJjZT4pOiBMaW5xPFRTb3VyY2U+IHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQoZmlsdGVyLCBwcmVkaWNhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICogRmlsdGVycyBhIHNlcXVlbmNlIG9mIHZhbHVlcyBiYXNlZCBvbiBhIHByZWRpY2F0ZS5cclxuICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJTdGF0aWM8VFNvdXJjZT4oc291cmNlOiBUU291cmNlW10sIHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+KTogVFNvdXJjZVtdIHtcclxuICAgIHJldHVybiBzb3VyY2UuZmlsdGVyKHByZWRpY2F0ZSk7XHJcbn1cclxuIiwiaW1wb3J0IHtCYXNlSXRlcmF0b3IsIEl0ZXJhdG9yUmVzdWx0fSBmcm9tIFwiLi9pdGVyYXRvclwiO1xyXG5pbXBvcnQge0ZpbHRlckl0ZXJhdG9yfSBmcm9tIFwiLi9maWx0ZXJcIjtcclxuaW1wb3J0ICogYXMgVXRpbCBmcm9tIFwiLi4vLi4vdXRpbFwiO1xyXG5pbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCBcIi4uL2FkZC9maXJzdFwiO1xyXG5pbXBvcnQge21ha2VWYWx1ZVByZWRpY2F0ZX0gZnJvbSBcIi4uL21ha2VWYWx1ZVByZWRpY2F0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdyb3VwQnlJdGVyYXRvcjxUU291cmNlLCBUS2V5PiBleHRlbmRzIEJhc2VJdGVyYXRvcjxUU291cmNlPiB7XHJcblxyXG4gICAgcHJpdmF0ZSBfcHJldmlvdXNLZXlzID0gW107XHJcbiAgICBwcml2YXRlIF9pc1BpcGVsaW5lRXhlY3V0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBzb3VyY2U6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPixcclxuICAgICAgICBwcml2YXRlIGtleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBUS2V5PlxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PElHcm91cGluZzxUS2V5LCBUU291cmNlPj4ge1xyXG4gICAgICAgIC8vIFRPRE86IEN1cnJlbnRseSB0aGlzIHdpbGwgdXNlIEZpbHRlckl0ZXJhdG9yIG9uIHRoZSB3aG9sZSBzb3VyY2Ugb25jZSBwZXIga2V5LiBDYW4gd2UgaW1wcm92ZSB0aGlzP1xyXG5cclxuICAgICAgICAvKiBUT0RPOiBCZWNhdXNlIHdlIHNlbmQgaW4gdGhpcy5fc291cmNlIGludG8gdGhlIEZpbHRlckl0ZXJhdG9yLCBpZiB0aGlzLl9zb3VyY2UgaXMgYW4gaXRlcmF0b3IsIHdlIGZpbmlzaCBpdCxcclxuICAgICAgICAgKiBtYWtpbmcgaXQgbm90IGxvb2sgZm9yIHRoZSBuZXh0IGtleSBvbiB0aGUgc2Vjb25kIGNhbGwgdG8gdGhpcyBmdW5jdGlvbi5cclxuICAgICAgICAgKiBXZSBwcm9iYWJseSBuZWVkIHRvIGNyZWF0ZSBhIGxvb2t1cCB0YWJsZSBvZiBzb21lIHNvcnQuXHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5faXNQaXBlbGluZUV4ZWN1dGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IHRoaXMudG9BcnJheSgpO1xyXG4gICAgICAgICAgICBzdXBlci5yZXNldCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pc1BpcGVsaW5lRXhlY3V0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGl0ZW06IEl0ZXJhdG9yUmVzdWx0PGFueT4sXHJcbiAgICAgICAgICAgIGtleTogYW55O1xyXG5cclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBzdXBlci5uZXh0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbS5kb25lKSByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQoaXRlbS52YWx1ZSkpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAga2V5ID0gdGhpcy5rZXlTZWxlY3RvcihpdGVtLnZhbHVlKTtcclxuXHJcbiAgICAgICAgfSB3aGlsZSAodGhpcy5fcHJldmlvdXNLZXlzLmluZGV4T2Yoa2V5KSA+IC0xIHx8IFV0aWwuaXNVbmRlZmluZWQoaXRlbS52YWx1ZSkpO1xyXG5cclxuICAgICAgICB0aGlzLl9wcmV2aW91c0tleXMucHVzaChrZXkpO1xyXG5cclxuICAgICAgICBsZXQgZmlsdGVyID0gbmV3IEZpbHRlckl0ZXJhdG9yPFRTb3VyY2U+KHRoaXMuX3NvdXJjZSwgKHgsIGlkeCkgPT4gdGhpcy5rZXlTZWxlY3Rvcih4KSA9PT0ga2V5KTtcclxuICAgICAgICBsZXQgZ3JvdXBJdGVtLCB2YWx1ZXMgPSBbXTtcclxuICAgICAgICB3aGlsZSAoIVV0aWwuaXNVbmRlZmluZWQoZ3JvdXBJdGVtID0gZmlsdGVyLm5leHQoKS52YWx1ZSkpIHtcclxuICAgICAgICAgICAgdmFsdWVzLnB1c2goZ3JvdXBJdGVtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGtleSxcclxuICAgICAgICAgICAgICAgIHZhbHVlczogdmFsdWVzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRvbmU6IGl0ZW0uZG9uZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0b0FycmF5KCk6IGFueVtdIHtcclxuICAgICAgICBsZXQgbjogSXRlcmF0b3JSZXN1bHQ8YW55PixcclxuICAgICAgICAgICAgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgIHdoaWxlICghKG4gPSBzdXBlci5uZXh0KCkpLmRvbmUpXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG4udmFsdWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ3JvdXBCeTxUU291cmNlLCBUS2V5Pihzb3VyY2U6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPiwga2V5U2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRTb3VyY2UsIFRLZXk+IHwgc3RyaW5nKSB7XHJcbiAgICBsZXQgcHJlZCA9IG1ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3Rvcik7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBHcm91cEJ5SXRlcmF0b3I8VFNvdXJjZSwgVEtleT4oc291cmNlLCBwcmVkKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnlQcm90bzxUS2V5Pih0aGlzOiBMaW5xPGFueT4sIGtleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxhbnksIFRLZXk+IHwgc3RyaW5nKTogTGlucTxJR3JvdXBpbmc8VEtleSwgYW55Pj47XHJcbi8qKlxyXG4gKiBHcm91cHMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgYWNjb3JkaW5nIHRvIGEgc3BlY2lmaWVkIGtleSBzZWxlY3RvciBmdW5jdGlvbi5cclxuICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCB0aGUga2V5IGZvciBlYWNoIGVsZW1lbnQuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBCeVByb3RvPFRTb3VyY2UsIFRLZXk+KHRoaXM6IExpbnE8VFNvdXJjZT4sIGtleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBUS2V5PiB8IHN0cmluZyk6IExpbnE8SUdyb3VwaW5nPFRLZXksIFRTb3VyY2U+PiB7XHJcbiAgICBsZXQgcHJlZCA9IG1ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3Rvcik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMubGlmdChncm91cEJ5LCBwcmVkKTtcclxufVxyXG4vKipcclxuICogR3JvdXBzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGFjY29yZGluZyB0byBhIHNwZWNpZmllZCBrZXkgc2VsZWN0b3IgZnVuY3Rpb24uXHJcbiAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgdGhlIGtleSBmb3IgZWFjaCBlbGVtZW50LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnlTdGF0aWM8VFNvdXJjZSwgVEtleT4oc291cmNlOiBUU291cmNlW10sIGtleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBUS2V5PiB8IHN0cmluZyk6IElHcm91cGluZzxUS2V5LCBUU291cmNlPltdIHtcclxuXHJcbiAgICBsZXQgaSxcclxuICAgICAgICBhcnI6IElHcm91cGluZzxUS2V5LCBUU291cmNlPltdID0gW10sXHJcbiAgICAgICAgcHJlZCA9IG1ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3RvciksXHJcbiAgICAgICAgZ3JvdXA6IElHcm91cGluZzxUS2V5LCBUU291cmNlPixcclxuICAgICAgICBncm91cFZhbHVlOiBhbnk7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICBncm91cFZhbHVlID0gcHJlZChzb3VyY2VbaV0pO1xyXG4gICAgICAgIGdyb3VwID0gbmV3IExpbnEoYXJyKS5maXJzdCgoeDogSUdyb3VwaW5nPFRLZXksIFRTb3VyY2U+KSA9PiB4LmtleSA9PSBncm91cFZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKCFncm91cCkge1xyXG4gICAgICAgICAgICBncm91cCA9IHtcclxuICAgICAgICAgICAgICAgIGtleTogZ3JvdXBWYWx1ZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlczogW11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgYXJyLnB1c2goZ3JvdXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ3JvdXAudmFsdWVzLnB1c2goc291cmNlW2ldKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXJyO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJR3JvdXBpbmc8VEtleSwgVFZhbHVlPiB7XHJcbiAgICBrZXk6IFRLZXk7XHJcbiAgICB2YWx1ZXM6IFRWYWx1ZVtdO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uLy4uL3V0aWxcIjtcclxuaW1wb3J0IHtCYXNlSXRlcmF0b3IsIEl0ZXJhdG9yUmVzdWx0fSBmcm9tIFwiLi9pdGVyYXRvclwiO1xyXG5pbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW50ZXJzZWN0SXRlcmF0b3I8VFNvdXJjZT4gZXh0ZW5kcyBCYXNlSXRlcmF0b3I8VFNvdXJjZT4ge1xyXG5cclxuICAgIHByaXZhdGUgb3RoZXI6IEJhc2VJdGVyYXRvcjxUU291cmNlPjtcclxuICAgIHByaXZhdGUgb3RoZXJJdGVtczogYW55W107XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc291cmNlOiBUU291cmNlW10gfCBCYXNlSXRlcmF0b3I8VFNvdXJjZT4sXHJcbiAgICAgICAgb3RoZXI6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPixcclxuICAgICAgICBwcml2YXRlIGNvbXBhcmVyOiBVdGlsLklFcXVhbGl0eUNvbXBhcmVyPFRTb3VyY2U+ID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoc291cmNlKTtcclxuXHJcbiAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgQmFzZUl0ZXJhdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3RoZXIgPSBvdGhlcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm90aGVyID0gbmV3IEJhc2VJdGVyYXRvcihvdGhlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8VFNvdXJjZT4ge1xyXG4gICAgICAgIGxldCByczogSXRlcmF0b3JSZXN1bHQ8VFNvdXJjZT47XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vdGhlckl0ZW1zKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3RoZXJJdGVtcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKCEocnMgPSB0aGlzLm90aGVyLm5leHQoKSkuZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdGhlckl0ZW1zLnB1c2gocnMudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aGlsZSAoIShycyA9IHN1cGVyLm5leHQoKSkuZG9uZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vdGhlckl0ZW1zLnNvbWUoeCA9PiB0aGlzLmNvbXBhcmVyKHJzLnZhbHVlLCB4KSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBycztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgZG9uZTogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gaW50ZXJzZWN0PFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdIHwgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+LCBvdGhlcjogVFNvdXJjZVtdLCBjb21wYXJlcjogVXRpbC5JRXF1YWxpdHlDb21wYXJlcjxUU291cmNlPiA9IFV0aWwuZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXIpOiBJbnRlcnNlY3RJdGVyYXRvcjxUU291cmNlPiB7XHJcbiAgICByZXR1cm4gbmV3IEludGVyc2VjdEl0ZXJhdG9yPFRTb3VyY2U+KHNvdXJjZSwgb3RoZXIsIGNvbXBhcmVyKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIGl0ZW1zIHRoYXQgb25seSBleGlzdHMgaW4gb25lIG9mIHRoZSBkYXRhc2V0cy5cclxuICogQHBhcmFtIG90aGVyIFRoZSBvdGhlciBkYXRhc2V0LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdFByb3RvPFRTb3VyY2U+KHRoaXM6IExpbnE8VFNvdXJjZT4sIG90aGVyOiBUU291cmNlW10gfCBMaW5xPFRTb3VyY2U+LCBjb21wYXJlcjogVXRpbC5JRXF1YWxpdHlDb21wYXJlcjxUU291cmNlPiA9IFV0aWwuZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXIpOiBMaW5xPFRTb3VyY2U+IHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQoaW50ZXJzZWN0LCBvdGhlciwgY29tcGFyZXIpO1xyXG59XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBsaXN0IG9mIGl0ZW1zIHRoYXQgZXhpc3RzIGluIGFsbCBkYXRhc2V0cy5cclxuICAgICAqIEBwYXJhbSBhIFRoZSBmaXJzdCBkYXRhc2V0LlxyXG4gICAgICogQHBhcmFtIGIgVGhlIHNlY29uZCBkYXRhc2V0IHRvIGJlIGNvbXBhcmVkIHRvLlxyXG4gICAgICogQHBhcmFtIG1vcmUgSWYgeW91IGhhdmUgZXZlbiBtb3JlIGRhdGFzZXQgdG8gY29tcGFyZSB0by5cclxuICAgICAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJzZWN0U3RhdGljPFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdIHwgTGlucTxUU291cmNlPiwgb3RoZXI6IFRTb3VyY2VbXSB8IExpbnE8VFNvdXJjZT4sIGNvbXBhcmVyOiBVdGlsLklFcXVhbGl0eUNvbXBhcmVyPFRTb3VyY2U+ID0gVXRpbC5kZWZhdWx0RXF1YWxpdHlDb21wYXJlcik6IFRTb3VyY2VbXSB7XHJcblxyXG4gICAgbGV0IGE6IFRTb3VyY2VbXSA9IChzb3VyY2UgaW5zdGFuY2VvZiBMaW5xKSA/IHNvdXJjZS50b0FycmF5PFRTb3VyY2U+KCkgOiA8VFNvdXJjZVtdPnNvdXJjZSxcclxuICAgICAgICBiOiBUU291cmNlW10gPSAob3RoZXIgaW5zdGFuY2VvZiBMaW5xKSA/IG90aGVyLnRvQXJyYXk8VFNvdXJjZT4oKSA6IDxUU291cmNlW10+b3RoZXI7XHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGEuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgICBpZiAoYi5zb21lKHkgPT4gY29tcGFyZXIoeCwgeSkpKSByZXN1bHQucHVzaCh4KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gICAgLy8gbGV0IGxpc3RzOiBBcnJheTxhbnlbXT4gPSBbXSwgcmVzdWx0ID0gW107XHJcblxyXG4gICAgLy8gbGV0IGxpc3QgPSAoYSBpbnN0YW5jZW9mIExpbnEpID8gYS50b0FycmF5KCkgOiBhO1xyXG4gICAgLy8gbGlzdHMucHVzaCgoYiBpbnN0YW5jZW9mIExpbnEpID8gYi50b0FycmF5KCkgOiBiKTtcclxuICAgIC8vIG1vcmUuZm9yRWFjaCgoZGF0YXNldCkgPT4ge1xyXG4gICAgLy8gICAgIGxpc3RzLnB1c2goKGRhdGFzZXQgaW5zdGFuY2VvZiBMaW5xKSA/IGRhdGFzZXQudG9BcnJheSgpIDogZGF0YXNldCk7XHJcbiAgICAvLyB9KTtcclxuXHJcbiAgICAvLyBsaXN0LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAvLyAgICAgbGV0IGV4aXN0cyA9IGxpc3RzLmV2ZXJ5KG90aGVyID0+IHtcclxuICAgIC8vICAgICAgICAgaWYgKCFvdGhlci5zb21lKHggPT4geCA9PT0gaXRlbSkpIHJldHVybiBmYWxzZTtcclxuICAgIC8vICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyAgICAgaWYgKGV4aXN0cykgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAvLyB9KTtcclxuXHJcbiAgICAvLyByZXR1cm4gcmVzdWx0O1xyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBCYXNlSXRlcmF0b3I8VFNvdXJjZT4gaW1wbGVtZW50cyBJdGVyYXRvcjxUU291cmNlPiB7XHJcbiAgICBwcm90ZWN0ZWQgX3NvdXJjZTogYW55O1xyXG4gICAgcHJvdGVjdGVkIF9pZHg6IG51bWJlciA9IC0xO1xyXG4gICAgcHJvdGVjdGVkIF9idWZmZXJzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX3JldmVyc2VkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX2RvbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBzb3VyY2U6IGFueVtdIHwgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+XHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SXRlcmF0b3JGcm9tUGlwZWxpbmUodHlwZTogYW55KTogYW55IHtcclxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIHR5cGUpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGxldCBzb3VyY2UgPSB0aGlzO1xyXG4gICAgICAgIHdoaWxlICghKChzb3VyY2UgPSBzb3VyY2UuX3NvdXJjZSkgaW5zdGFuY2VvZiB0eXBlKSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8YW55PiB7XHJcbiAgICAgICAgbGV0IG46IFRTb3VyY2UgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NvdXJjZSBpbnN0YW5jZW9mIEJhc2VJdGVyYXRvcikge1xyXG4gICAgICAgICAgICBsZXQgbmV4dDogSXRlcmF0b3JSZXN1bHQ8VFNvdXJjZT4gPSB0aGlzLl9zb3VyY2UubmV4dCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pZHgrKztcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JldmVyc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faWR4IDwgdGhpcy5fc291cmNlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG4gPSB0aGlzLl9zb3VyY2VbdGhpcy5fc291cmNlLmxlbmd0aCAtIDEgLSAoKyt0aGlzLl9pZHgpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pZHggPCB0aGlzLl9zb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbiA9IHRoaXMuX3NvdXJjZVsrK3RoaXMuX2lkeF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pZHggPj0gdGhpcy5fc291cmNlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyB0aGlzLl9pZHggPSAtMTsgLy8gd2UgZmluaXNoZWQsIHJlc2V0IHRoZSBjb3VudGVyXHJcbiAgICAgICAgICAgIHRoaXMuX2RvbmUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB2YWx1ZTogbixcclxuICAgICAgICAgICAgZG9uZTogdGhpcy5fZG9uZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV2ZXJzZSgpIHsgdGhpcy5fcmV2ZXJzZWQgPSAhdGhpcy5fcmV2ZXJzZWQ7IH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5faWR4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5fZG9uZSA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhdG9yPFQ+IHtcclxuICAgIG5leHQodmFsdWU/OiBhbnkpOiBJdGVyYXRvclJlc3VsdDxUPjtcclxuICAgIHJldHVybj8odmFsdWU/OiBhbnkpOiBJdGVyYXRvclJlc3VsdDxUPjtcclxuICAgIHRocm93PyhlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSXRlcmF0b3JSZXN1bHQ8VD4ge1xyXG4gICAgZG9uZTogYm9vbGVhbjtcclxuICAgIHZhbHVlPzogVDtcclxufVxyXG4iLCJpbXBvcnQge0Jhc2VJdGVyYXRvciwgSXRlcmF0b3JSZXN1bHR9IGZyb20gXCIuL2l0ZXJhdG9yXCI7XHJcbmltcG9ydCB7RmlsdGVySXRlcmF0b3J9IGZyb20gXCIuL2ZpbHRlclwiO1xyXG5pbXBvcnQgKiBhcyBVdGlsIGZyb20gXCIuLi8uLi91dGlsXCI7XHJcbmltcG9ydCB7TGlucX0gZnJvbSBcIi4uL2xpbnFcIjtcclxuaW1wb3J0IHttYWtlVmFsdWVQcmVkaWNhdGV9IGZyb20gXCIuLi9tYWtlVmFsdWVQcmVkaWNhdGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBKb2luSXRlcmF0b3I8VE91dGVyLCBUSW5uZXIsIFRLZXksIFRSZXN1bHQ+IGV4dGVuZHMgQmFzZUl0ZXJhdG9yPFRPdXRlcj4ge1xyXG4gICAgcHJpdmF0ZSBfb3V0ZXJJdGVtOiBJdGVyYXRvclJlc3VsdDxUT3V0ZXI+O1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudElubmVyU2VsZWN0aW9uOiBGaWx0ZXJJdGVyYXRvcjxUSW5uZXI+O1xyXG4gICAgcHJpdmF0ZSBfY291bnRlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgb3V0ZXI6IFRPdXRlcltdIHwgQmFzZUl0ZXJhdG9yPFRPdXRlcj4sXHJcbiAgICAgICAgcHJpdmF0ZSBpbm5lcjogVElubmVyW10gfCBCYXNlSXRlcmF0b3I8VElubmVyPixcclxuICAgICAgICBwcml2YXRlIG91dGVyS2V5U2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRPdXRlciwgVEtleT4sXHJcbiAgICAgICAgcHJpdmF0ZSBpbm5lcktleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUSW5uZXIsIFRLZXk+LFxyXG4gICAgICAgIHByaXZhdGUgcmVzdWx0U2VsZWN0b3I6IChvdXRlcjogVE91dGVyLCBpbm5lcjogVElubmVyKSA9PiBUUmVzdWx0XHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihvdXRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dCgpOiBJdGVyYXRvclJlc3VsdDxUUmVzdWx0PiB7XHJcbiAgICAgICAgbGV0IGlubmVySXRlbTogSXRlcmF0b3JSZXN1bHQ8VElubmVyPjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRJbm5lclNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAvLyBXZSdyZSBkb2luZyB0aGUgc2Vjb25kIGxvb3Agb2YgdGhlIHNhbWUga2V5LlxyXG4gICAgICAgICAgICBpbm5lckl0ZW0gPSB0aGlzLl9jdXJyZW50SW5uZXJTZWxlY3Rpb24ubmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gV2Uga25vdyB3ZSBoYXZlIHJlY2VpdmVkIGF0IGxlYXN0IG9uZSBpdGVtIGZyb20gdGhpcyBrZXkgYmVmb3JlLCBzbyBub3QgcmVjZWl2aW5nIG9uZSBub3cgaXMgbm90IHdyb25nLlxyXG4gICAgICAgICAgICAvLyBJdCBqdXN0IG1lYW5zIGl0IHdhcyBvbmx5IGEgc2luZ2xlIGlubmVyIGl0ZW0gd2l0aCB0aGlzIGtleSwgc28gd2UgbGV0IGl0IGNvbnRpbnVlIGlmIGJlbG93IGNvbmRpdGlvbiBpcyBub3QgbWV0LlxyXG4gICAgICAgICAgICBpZiAoIVV0aWwuaXNVbmRlZmluZWQoaW5uZXJJdGVtLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY291bnRlcisrO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5yZXN1bHRTZWxlY3Rvcih0aGlzLl9vdXRlckl0ZW0udmFsdWUsIGlubmVySXRlbS52YWx1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZTogZmFsc2VcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgdGhpcy5fb3V0ZXJJdGVtID0gc3VwZXIubmV4dCgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3V0ZXJJdGVtLmRvbmUpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcclxuXHJcbiAgICAgICAgICAgIGlmICghVXRpbC5pc1VuZGVmaW5lZCh0aGlzLl9vdXRlckl0ZW0udmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3V0ZXJLZXkgPSB0aGlzLm91dGVyS2V5U2VsZWN0b3IodGhpcy5fb3V0ZXJJdGVtLnZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50SW5uZXJTZWxlY3Rpb24gPSBuZXcgRmlsdGVySXRlcmF0b3IodGhpcy5pbm5lciwgeCA9PiBvdXRlcktleSA9PT0gdGhpcy5pbm5lcktleVNlbGVjdG9yKHgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbm5lckl0ZW0gPSB0aGlzLl9jdXJyZW50SW5uZXJTZWxlY3Rpb24ubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gd2hpbGUgKFV0aWwuaXNVbmRlZmluZWQoaW5uZXJJdGVtLnZhbHVlKSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvdW50ZXIrKztcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdmFsdWU6IHRoaXMucmVzdWx0U2VsZWN0b3IodGhpcy5fb3V0ZXJJdGVtLnZhbHVlLCBpbm5lckl0ZW0udmFsdWUpLFxyXG4gICAgICAgICAgICBkb25lOiB0aGlzLl9vdXRlckl0ZW0uZG9uZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBmaWx0ZXI8VFNvdXJjZT4oc291cmNlOiBUU291cmNlW10gfCBCYXNlSXRlcmF0b3I8VFNvdXJjZT4sIHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+KTogRmlsdGVySXRlcmF0b3I8VFNvdXJjZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJJdGVyYXRvcjxUU291cmNlPihzb3VyY2UsIHByZWRpY2F0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaWx0ZXJzIGEgc2VxdWVuY2Ugb2YgdmFsdWVzIGJhc2VkIG9uIGEgcHJlZGljYXRlLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlclByb3RvPFRTb3VyY2U+KHRoaXM6IExpbnE8VFNvdXJjZT4sIHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+KTogTGlucTxUU291cmNlPiB7XHJcbiAgICByZXR1cm4gdGhpcy5saWZ0KGZpbHRlciwgcHJlZGljYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZpbHRlcnMgYSBzZXF1ZW5jZSBvZiB2YWx1ZXMgYmFzZWQgb24gYSBwcmVkaWNhdGUuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyU3RhdGljPFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdLCBwcmVkaWNhdGU6IFV0aWwuSVByZWRpY2F0ZTxUU291cmNlPik6IFRTb3VyY2VbXSB7XHJcbiAgICByZXR1cm4gc291cmNlLmZpbHRlcihwcmVkaWNhdGUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBqb2luPFRPdXRlciwgVElubmVyLCBUS2V5LCBUUmVzdWx0PihcclxuICAgIG91dGVyOiBUT3V0ZXJbXSB8IEJhc2VJdGVyYXRvcjxUT3V0ZXI+LFxyXG4gICAgaW5uZXI6IFRJbm5lcltdLFxyXG4gICAgb3V0ZXJLZXlTZWxlY3RvcjogVXRpbC5JU2VsZWN0b3I8VE91dGVyLCBUS2V5PixcclxuICAgIGlubmVyS2V5U2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRJbm5lciwgVEtleT4sXHJcbiAgICByZXN1bHRTZWxlY3RvcjogKG91dGVyOiBUT3V0ZXIsIGlubmVyOiBUSW5uZXIpID0+IFRSZXN1bHRcclxuKTogSm9pbkl0ZXJhdG9yPFRPdXRlciwgVElubmVyLCBUS2V5LCBUUmVzdWx0PiB7XHJcbiAgICByZXR1cm4gbmV3IEpvaW5JdGVyYXRvcjxUT3V0ZXIsIFRJbm5lciwgVEtleSwgVFJlc3VsdD4ob3V0ZXIsIGlubmVyLCBvdXRlcktleVNlbGVjdG9yLCBpbm5lcktleVNlbGVjdG9yLCByZXN1bHRTZWxlY3Rvcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBqb2luUHJvdG88VElubmVyLCBUS2V5LCBUUmVzdWx0PihcclxuICAgIGlubmVyOiBUSW5uZXJbXSxcclxuICAgIG91dGVyS2V5U2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPGFueSwgVEtleT4gfCBzdHJpbmcsXHJcbiAgICBpbm5lcktleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUSW5uZXIsIFRLZXk+IHwgc3RyaW5nLFxyXG4gICAgcmVzdWx0U2VsZWN0b3I6IChvdXRlcjogYW55LCBpbm5lcjogVElubmVyKSA9PiBUUmVzdWx0XHJcbik6IExpbnE8VFJlc3VsdD47XHJcblxyXG4vKipcclxuICogQ29ycmVsYXRlcyB0aGUgZWxlbWVudHMgb2YgdHdvIHNlcXVlbmNlcyBiYXNlZCBvbiBtYXRjaGluZyBrZXlzLlxyXG4gKiBAcGFyYW0gaW5uZXIgVGhlIHNlcXVlbmNlIHRvIGpvaW4gdG8gdGhlIGZpcnN0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gb3V0ZXJLZXlTZWxlY3RvciBUQSBmdW5jdGlvbiB0byBleHRyYWN0IHRoZSBqb2luIGtleSBmcm9tIGVhY2ggZWxlbWVudCBvZiB0aGUgZmlyc3Qgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBpbm5lcktleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCB0aGUgam9pbiBrZXkgZnJvbSBlYWNoIGVsZW1lbnQgb2YgdGhlIHNlY29uZCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIHJlc3VsdFNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gY3JlYXRlIGEgcmVzdWx0IGVsZW1lbnQgZnJvbSB0d28gbWF0Y2hpbmcgZWxlbWVudHMuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gam9pblByb3RvPFRTb3VyY2UsIFRJbm5lciwgVEtleSwgVFJlc3VsdD4oXHJcbiAgICBpbm5lcjogVElubmVyW10sXHJcbiAgICBvdXRlcktleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBUS2V5PiB8IHN0cmluZyxcclxuICAgIGlubmVyS2V5U2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRJbm5lciwgVEtleT4gfCBzdHJpbmcsXHJcbiAgICByZXN1bHRTZWxlY3RvcjogKG91dGVyOiBUU291cmNlLCBpbm5lcjogVElubmVyKSA9PiBUUmVzdWx0XHJcbik6IExpbnE8VFJlc3VsdD4ge1xyXG5cclxuICAgIGxldCBvdXRlclByZWQgPSBtYWtlVmFsdWVQcmVkaWNhdGUob3V0ZXJLZXlTZWxlY3RvciksXHJcbiAgICAgICAgaW5uZXJQcmVkID0gbWFrZVZhbHVlUHJlZGljYXRlKGlubmVyS2V5U2VsZWN0b3IpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmxpZnQoam9pbiwgaW5uZXIsIG91dGVyUHJlZCwgaW5uZXJQcmVkLCByZXN1bHRTZWxlY3Rvcik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb3JyZWxhdGVzIHRoZSBlbGVtZW50cyBvZiB0d28gc2VxdWVuY2VzIGJhc2VkIG9uIG1hdGNoaW5nIGtleXMuXHJcbiAqIEBwYXJhbSBvdXRlciBUaGUgZmlyc3Qgc2VxdWVuY2UgdG8gam9pbi5cclxuICogQHBhcmFtIGlubmVyIFRoZSBzZXF1ZW5jZSB0byBqb2luIHRvIHRoZSBmaXJzdCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIG91dGVyS2V5U2VsZWN0b3IgVEEgZnVuY3Rpb24gdG8gZXh0cmFjdCB0aGUgam9pbiBrZXkgZnJvbSBlYWNoIGVsZW1lbnQgb2YgdGhlIGZpcnN0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gaW5uZXJLZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgdGhlIGpvaW4ga2V5IGZyb20gZWFjaCBlbGVtZW50IG9mIHRoZSBzZWNvbmQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSByZXN1bHRTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIHJlc3VsdCBlbGVtZW50IGZyb20gdHdvIG1hdGNoaW5nIGVsZW1lbnRzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGpvaW5TdGF0aWM8VE91dGVyLCBUSW5uZXIsIFRLZXksIFRSZXN1bHQ+KFxyXG4gICAgb3V0ZXI6IFRPdXRlcltdLFxyXG4gICAgaW5uZXI6IFRJbm5lcltdLFxyXG4gICAgb3V0ZXJLZXlTZWxlY3RvcjogVXRpbC5JU2VsZWN0b3I8VE91dGVyLCBUS2V5PiB8IHN0cmluZyxcclxuICAgIGlubmVyS2V5U2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRJbm5lciwgVEtleT4gfCBzdHJpbmcsXHJcbiAgICByZXN1bHRTZWxlY3RvcjogKG91dGVyOiBUT3V0ZXIsIGlubmVyOiBUSW5uZXIpID0+IFRSZXN1bHRcclxuKTogVFJlc3VsdFtdIHtcclxuICAgIC8vIFRPRE86IFdyaXRlIHN0YXRpYyBqb2luIGZ1bmN0aW9uIHdpdGhvdXQgaW5zdGFudGlhdGluZyBhIG5ldyBMaW5xIG9iamVjdFxyXG4gICAgcmV0dXJuIG5ldyBMaW5xKG91dGVyKS5qb2luKGlubmVyLCBvdXRlcktleVNlbGVjdG9yLCBpbm5lcktleVNlbGVjdG9yLCByZXN1bHRTZWxlY3RvcikudG9BcnJheTxUUmVzdWx0PigpO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uLy4uL3V0aWxcIjtcclxuaW1wb3J0IHtCYXNlSXRlcmF0b3IsIEl0ZXJhdG9yUmVzdWx0fSBmcm9tIFwiLi9pdGVyYXRvclwiO1xyXG5pbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWFwSXRlcmF0b3I8VFNvdXJjZSwgVFJlc3VsdD4gZXh0ZW5kcyBCYXNlSXRlcmF0b3I8VFNvdXJjZT4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHNvdXJjZTogVFNvdXJjZVtdIHwgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+LFxyXG4gICAgICAgIHByaXZhdGUgY2FsbGJhY2s6IChpdGVtOiBUU291cmNlLCBpZHg6IG51bWJlcikgPT4gVFJlc3VsdFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFRSZXN1bHQ+IHtcclxuICAgICAgICBsZXQgaXRlbSA9IHN1cGVyLm5leHQoKTtcclxuICAgICAgICByZXR1cm4gKCFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0udmFsdWUpKVxyXG4gICAgICAgICAgICA/IHsgdmFsdWU6IHRoaXMuY2FsbGJhY2soaXRlbS52YWx1ZSwgdGhpcy5faWR4KSwgZG9uZTogZmFsc2UgfVxyXG4gICAgICAgICAgICA6IHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbWFwPFRTb3VyY2UsIFRSZXN1bHQ+KHNvdXJjZTogVFNvdXJjZVtdIHwgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+LCBjYWxsYmFjazogKGl0ZW06IFRTb3VyY2UsIGlkeDogbnVtYmVyKSA9PiBUUmVzdWx0KTogTWFwSXRlcmF0b3I8VFNvdXJjZSwgVFJlc3VsdD4ge1xyXG4gICAgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcjxUU291cmNlLCBUUmVzdWx0Pihzb3VyY2UsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXBQcm90bzxUUmVzdWx0Pih0aGlzOiBMaW5xPGFueT4sIGNhbGxiYWNrOiAoaXRlbTogYW55LCBpZHg6IG51bWJlcikgPT4gVFJlc3VsdCk6IExpbnE8VFJlc3VsdD47XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIG5ldyBzZXF1ZW5jZSB3aXRoIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBvbiBldmVyeSBlbGVtZW50IGluIHRoaXMgYXJyYXkuXHJcbiAqIEBwYXJhbSBjYWxsYmFjayBGdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGFuIGVsZW1lbnQgb2YgdGhlIG5ldyBzZXF1ZW5jZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG1hcFByb3RvPFRTb3VyY2UsIFRSZXN1bHQ+KHRoaXM6IExpbnE8VFNvdXJjZT4sIGNhbGxiYWNrOiAoaXRlbTogVFNvdXJjZSwgaWR4OiBudW1iZXIpID0+IFRSZXN1bHQpOiBMaW5xPFRSZXN1bHQ+IHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQobWFwLCBjYWxsYmFjayk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgbmV3IHNlcXVlbmNlIHdpdGggdGhlIHJlc3VsdHMgb2YgY2FsbGluZyBhIHByb3ZpZGVkIGZ1bmN0aW9uIG9uIGV2ZXJ5IGVsZW1lbnQgaW4gdGhpcyBhcnJheS5cclxuICogQHBhcmFtIGNhbGxiYWNrIEZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgYW4gZWxlbWVudCBvZiB0aGUgbmV3IHNlcXVlbmNlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbWFwU3RhdGljPFRTb3VyY2UsIFRSZXN1bHQ+KHNvdXJjZTogVFNvdXJjZVtdLCBjYWxsYmFjazogKGl0ZW06IFRTb3VyY2UsIGlkeDogbnVtYmVyKSA9PiBUUmVzdWx0KTogVFJlc3VsdFtdIHtcclxuICAgIHJldHVybiBzb3VyY2UubWFwKGNhbGxiYWNrKTtcclxufVxyXG4iLCJpbXBvcnQge0Jhc2VJdGVyYXRvciwgSXRlcmF0b3JSZXN1bHR9IGZyb20gXCIuL2l0ZXJhdG9yXCI7XHJcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uLy4uL3V0aWxcIjtcclxuaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5pbXBvcnQge21ha2VWYWx1ZVByZWRpY2F0ZX0gZnJvbSBcIi4uL21ha2VWYWx1ZVByZWRpY2F0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE9yZGVyQnlJdGVyYXRvcjxUU291cmNlLCBUS2V5PiBleHRlbmRzIEJhc2VJdGVyYXRvcjxUU291cmNlPiB7XHJcbiAgICBwcml2YXRlIF9vcmRlcnM6IExpbnFPcmRlcjxUU291cmNlLCBhbnk+W107XHJcbiAgICBwcml2YXRlIF9pc09yZGVyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBzb3VyY2U6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPixcclxuICAgICAgICBrZXlTZWxlY3RvcjogVXRpbC5JU2VsZWN0b3I8VFNvdXJjZSwgVEtleT4gPSBVdGlsLmRlZmF1bHRTZWxlY3RvcixcclxuICAgICAgICBjb21wYXJlcjogVXRpbC5JQ29tcGFyZXI8VEtleT4gPSBVdGlsLmRlZmF1bHRDb21wYXJlcixcclxuICAgICAgICBwcml2YXRlIGRlc2NlbmRpbmc6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoc291cmNlKTtcclxuICAgICAgICB0aGlzLl9vcmRlcnMgPSBbbmV3IExpbnFPcmRlcihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpXTtcclxuICAgICAgICB0aGlzLl9idWZmZXJzID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFRTb3VyY2U+IHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzT3JkZXJlZCkge1xyXG4gICAgICAgICAgICBsZXQgYXJyID0gW10sIGl0ZW07XHJcblxyXG4gICAgICAgICAgICAvLyBjYW4ndCBzb21lb25lIGVsc2UgZG8gdGhpcz8gZS5nLiBGaWx0ZXJJdGVyYXRvcj9cclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHN1cGVyLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIGlmICghVXRpbC5pc1VuZGVmaW5lZChpdGVtLnZhbHVlKSkgYXJyLnB1c2goaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKCFpdGVtLmRvbmUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fc291cmNlID0gYXJyLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpID0gMCwgcnM7XHJcbiAgICAgICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICAgICAgcnMgPSB0aGlzLl9vcmRlcnNbaSsrXS5jb21wYXJlKGEsIGIpO1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAocnMgPT09IDAgJiYgaSA8IHRoaXMuX29yZGVycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2lzT3JkZXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHN1cGVyLnJlc2V0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdXBlci5uZXh0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhlbkJ5PFRLZXk+KFxyXG4gICAgICAgIGtleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBUS2V5PiA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yLFxyXG4gICAgICAgIGNvbXBhcmVyOiBVdGlsLklDb21wYXJlcjxUS2V5PiA9IFV0aWwuZGVmYXVsdENvbXBhcmVyLFxyXG4gICAgICAgIGRlc2NlbmRpbmc6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5fb3JkZXJzLnB1c2gobmV3IExpbnFPcmRlcjxUU291cmNlLCBUS2V5PihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIG9yZGVyQnk8VFNvdXJjZSwgVEtleT4oc291cmNlOiBUU291cmNlW10gfCBCYXNlSXRlcmF0b3I8VFNvdXJjZT4sIGtleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBUS2V5PiB8IHN0cmluZywgY29tcGFyZXI6IFV0aWwuSUNvbXBhcmVyPFRLZXk+ID0gVXRpbC5kZWZhdWx0Q29tcGFyZXIpOiBPcmRlckJ5SXRlcmF0b3I8VFNvdXJjZSwgYW55PiB7XHJcbiAgICBsZXQgc2VsZWN0b3JGbiA9IChrZXlTZWxlY3RvcikgPyBtYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpIDogVXRpbC5kZWZhdWx0U2VsZWN0b3I7XHJcbiAgICByZXR1cm4gbmV3IE9yZGVyQnlJdGVyYXRvcjxUU291cmNlLCBUS2V5Pihzb3VyY2UsIHNlbGVjdG9yRm4sIGNvbXBhcmVyLCBmYWxzZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9yZGVyQnlEZXNjPFRTb3VyY2UsIFRLZXk+KHNvdXJjZTogVFNvdXJjZVtdIHwgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+LCBrZXlTZWxlY3RvcjogVXRpbC5JU2VsZWN0b3I8VFNvdXJjZSwgVEtleT4gfCBzdHJpbmcsIGNvbXBhcmVyOiBVdGlsLklDb21wYXJlcjxUS2V5PiA9IFV0aWwuZGVmYXVsdENvbXBhcmVyKTogT3JkZXJCeUl0ZXJhdG9yPFRTb3VyY2UsIGFueT4ge1xyXG4gICAgbGV0IHNlbGVjdG9yRm4gPSAoa2V5U2VsZWN0b3IpID8gbWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKSA6IFV0aWwuZGVmYXVsdFNlbGVjdG9yO1xyXG4gICAgcmV0dXJuIG5ldyBPcmRlckJ5SXRlcmF0b3I8VFNvdXJjZSwgVEtleT4oc291cmNlLCBzZWxlY3RvckZuLCBjb21wYXJlciwgdHJ1ZSk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb3JkZXJCeVByb3RvPFRLZXk+KHRoaXM6IExpbnE8YW55Piwga2V5U2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPGFueSwgVEtleT4gfCBzdHJpbmcsIGNvbXBhcmVyPzogVXRpbC5JQ29tcGFyZXI8VEtleT4pOiBPcmRlcmVkTGlucTxhbnksIGFueT47XHJcbi8qKlxyXG4gKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBpbiBhc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgYSBrZXkgZnJvbSBhbiBlbGVtZW50LlxyXG4gKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG9yZGVyQnlQcm90bzxUU291cmNlLCBUS2V5Pih0aGlzOiBMaW5xPFRTb3VyY2U+LCBrZXlTZWxlY3RvcjogVXRpbC5JU2VsZWN0b3I8VFNvdXJjZSwgVEtleT4gfCBzdHJpbmcsIGNvbXBhcmVyOiBVdGlsLklDb21wYXJlcjxUS2V5PiA9IFV0aWwuZGVmYXVsdENvbXBhcmVyKTogT3JkZXJlZExpbnE8VFNvdXJjZSwgYW55PiB7XHJcbiAgICAvLyBUT0RPOiBIYXZlbid0IGdvdHRlbiB0aGUgaW50ZWxsaXNlbnNlIHRvIHNob3cgTGlucTxUU291cmNlPiBhcyB0aGUgcmVzdWx0IG9mIHRoaXMgZnVuY3Rpb24sIGl0IHNob3dzIExpbnE8YW55Pi5cclxuXHJcbiAgICByZXR1cm4gbmV3IE9yZGVyZWRMaW5xPFRTb3VyY2UsIFRLZXk+KG9yZGVyQnkodGhpcy5fc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNvcnRzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGluIGFzY2VuZGluZyBvcmRlciBieSB1c2luZyBhIHNwZWNpZmllZCBjb21wYXJlci5cclxuICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCBhIGtleSBmcm9tIGFuIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSBjb21wYXJlciBBbiBJQ29tcGFyZXI8YW55PiB0byBjb21wYXJlIGtleXMuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gb3JkZXJCeVN0YXRpYzxUU291cmNlLCBUS2V5Pihzb3VyY2U6IFRTb3VyY2VbXSwga2V5U2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRTb3VyY2UsIFRLZXk+IHwgc3RyaW5nLCBjb21wYXJlcjogVXRpbC5JQ29tcGFyZXI8VEtleT4gPSBVdGlsLmRlZmF1bHRDb21wYXJlcik6IFRTb3VyY2VbXSB7XHJcbiAgICByZXR1cm4gbmV3IExpbnE8VFNvdXJjZT4oc291cmNlKS5vcmRlckJ5PFRLZXk+KGtleVNlbGVjdG9yLCBjb21wYXJlcikudG9BcnJheTxUU291cmNlPigpO1xyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvcmRlckJ5RGVzY1Byb3RvPFRLZXk+KHRoaXM6IExpbnE8YW55Piwga2V5U2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPGFueSwgVEtleT4gfCBzdHJpbmcsIGNvbXBhcmVyPzogVXRpbC5JQ29tcGFyZXI8VEtleT4pOiBPcmRlcmVkTGlucTxhbnksIGFueT47XHJcbi8qKlxyXG4gKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBpbiBkZXNjZW5kaW5nIG9yZGVyIGJ5IHVzaW5nIGEgc3BlY2lmaWVkIGNvbXBhcmVyLlxyXG4gKiBAcGFyYW0ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0byBleHRyYWN0IGEga2V5IGZyb20gYW4gZWxlbWVudC5cclxuICogQHBhcmFtIGNvbXBhcmVyIEFuIElDb21wYXJlcjxhbnk+IHRvIGNvbXBhcmUga2V5cy5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBvcmRlckJ5RGVzY1Byb3RvPFRTb3VyY2UsIFRLZXk+KHRoaXM6IExpbnE8VFNvdXJjZT4sIGtleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBUS2V5PiB8IHN0cmluZywgY29tcGFyZXI6IFV0aWwuSUNvbXBhcmVyPFRLZXk+ID0gVXRpbC5kZWZhdWx0Q29tcGFyZXIpOiBPcmRlcmVkTGlucTxUU291cmNlLCBhbnk+IHtcclxuICAgIC8vIFRPRE86IEhhdmVuJ3QgZ290dGVuIHRoZSBpbnRlbGxpc2Vuc2UgdG8gc2hvdyBMaW5xPFRTb3VyY2U+IGFzIHRoZSByZXN1bHQgb2YgdGhpcyBmdW5jdGlvbiwgaXQgc2hvd3MgTGlucTxhbnk+LlxyXG5cclxuICAgIHJldHVybiBuZXcgT3JkZXJlZExpbnE8VFNvdXJjZSwgVEtleT4ob3JkZXJCeURlc2ModGhpcy5fc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNvcnRzIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgdXNpbmcgYSBzcGVjaWZpZWQgY29tcGFyZXIuXHJcbiAqIEBwYXJhbSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRvIGV4dHJhY3QgYSBrZXkgZnJvbSBhbiBlbGVtZW50LlxyXG4gKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG9yZGVyQnlEZXNjU3RhdGljPFRTb3VyY2UsIFRLZXk+KHNvdXJjZTogVFNvdXJjZVtdLCBrZXlTZWxlY3RvcjogVXRpbC5JU2VsZWN0b3I8VFNvdXJjZSwgVEtleT4gfCBzdHJpbmcsIGNvbXBhcmVyOiBVdGlsLklDb21wYXJlcjxUS2V5PiA9IFV0aWwuZGVmYXVsdENvbXBhcmVyKTogVFNvdXJjZVtdIHtcclxuICAgIHJldHVybiBuZXcgTGlucTxUU291cmNlPihzb3VyY2UpLm9yZGVyQnlEZXNjPFRLZXk+KGtleVNlbGVjdG9yLCBjb21wYXJlcikudG9BcnJheTxUU291cmNlPigpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuY2xhc3MgTGlucU9yZGVyPFRTb3VyY2UsIFRLZXk+IHtcclxuICAgIHByaXZhdGUgX2tleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBUS2V5PjtcclxuICAgIHByaXZhdGUgX2NvbXBhcmVyOiBVdGlsLklDb21wYXJlcjxUS2V5PjtcclxuICAgIHByaXZhdGUgX2Rlc2NlbmRpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAga2V5U2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRTb3VyY2UsIFRLZXk+ID0gVXRpbC5kZWZhdWx0U2VsZWN0b3IsXHJcbiAgICAgICAgY29tcGFyZXI6IFV0aWwuSUNvbXBhcmVyPFRLZXk+ID0gVXRpbC5kZWZhdWx0Q29tcGFyZXIsXHJcbiAgICAgICAgZGVzY2VuZGluZzogYm9vbGVhbiA9IGZhbHNlXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLl9rZXlTZWxlY3RvciA9IGtleVNlbGVjdG9yO1xyXG4gICAgICAgIHRoaXMuX2NvbXBhcmVyID0gY29tcGFyZXI7XHJcbiAgICAgICAgdGhpcy5fZGVzY2VuZGluZyA9IGRlc2NlbmRpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcGFyZShhLCBiKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX2Rlc2NlbmRpbmcgPyAtMSA6IDEpICogdGhpcy5fY29tcGFyZXIodGhpcy5fa2V5U2VsZWN0b3IoYSksIHRoaXMuX2tleVNlbGVjdG9yKGIpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE9yZGVyZWRMaW5xPFRTb3VyY2UsIFRLZXk+IGV4dGVuZHMgTGlucTxUU291cmNlPiB7XHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPikge1xyXG4gICAgICAgIHN1cGVyKHNvdXJjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBpbiBkZXNjZW5kaW5nIG9yZGVyIGJ5IHVzaW5nIGEgc3BlY2lmaWVkIGNvbXBhcmVyLlxyXG4gICAgICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCBhIGtleSBmcm9tIGFuIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gICAgICovXHJcbiAgICB0aGVuQnkoa2V5U2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRTb3VyY2UsIFRLZXk+IHwgc3RyaW5nLCBjb21wYXJlcjogVXRpbC5JQ29tcGFyZXI8VEtleT4gPSBVdGlsLmRlZmF1bHRDb21wYXJlcik6IE9yZGVyZWRMaW5xPFRTb3VyY2UsIFRLZXk+IHtcclxuICAgICAgICBsZXQgc2VsZWN0b3JGbiA9IChrZXlTZWxlY3RvcikgPyBtYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpIDogVXRpbC5kZWZhdWx0U2VsZWN0b3I7XHJcbiAgICAgICAgbGV0IG9yZGVySXRlcmF0b3I6IE9yZGVyQnlJdGVyYXRvcjxUU291cmNlLCBUS2V5PiA9IHRoaXMuX3NvdXJjZS5nZXRJdGVyYXRvckZyb21QaXBlbGluZShPcmRlckJ5SXRlcmF0b3IpO1xyXG4gICAgICAgIG9yZGVySXRlcmF0b3IudGhlbkJ5KHNlbGVjdG9yRm4sIGNvbXBhcmVyLCBmYWxzZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBpbiBkZXNjZW5kaW5nIG9yZGVyIGJ5IHVzaW5nIGEgc3BlY2lmaWVkIGNvbXBhcmVyLlxyXG4gICAgICogQHBhcmFtIGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdG8gZXh0cmFjdCBhIGtleSBmcm9tIGFuIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0gY29tcGFyZXIgQW4gSUNvbXBhcmVyPGFueT4gdG8gY29tcGFyZSBrZXlzLlxyXG4gICAgICovXHJcbiAgICB0aGVuQnlEZXNjKGtleVNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBUS2V5PiB8IHN0cmluZywgY29tcGFyZXI6IFV0aWwuSUNvbXBhcmVyPFRLZXk+ID0gVXRpbC5kZWZhdWx0Q29tcGFyZXIpOiBPcmRlcmVkTGlucTxUU291cmNlLCBUS2V5PiB7XHJcbiAgICAgICAgbGV0IHNlbGVjdG9yRm4gPSAoa2V5U2VsZWN0b3IpID8gbWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKSA6IFV0aWwuZGVmYXVsdFNlbGVjdG9yO1xyXG4gICAgICAgIGxldCBvcmRlckl0ZXJhdG9yOiBPcmRlckJ5SXRlcmF0b3I8VFNvdXJjZSwgVEtleT4gPSB0aGlzLl9zb3VyY2UuZ2V0SXRlcmF0b3JGcm9tUGlwZWxpbmUoT3JkZXJCeUl0ZXJhdG9yKTtcclxuICAgICAgICBvcmRlckl0ZXJhdG9yLnRoZW5CeShzZWxlY3RvckZuLCBjb21wYXJlciwgdHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtCYXNlSXRlcmF0b3IsIEl0ZXJhdG9yUmVzdWx0fSBmcm9tIFwiLi9pdGVyYXRvclwiO1xyXG5pbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2tpcEl0ZXJhdG9yPFRTb3VyY2U+IGV4dGVuZHMgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+IHtcclxuXHJcbiAgICBwcml2YXRlIGNvdW50ZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHNvdXJjZTogVFNvdXJjZVtdIHwgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+LFxyXG4gICAgICAgIHByaXZhdGUgY291bnQ6IG51bWJlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFRTb3VyY2U+IHtcclxuICAgICAgICBmb3IgKDsgdGhpcy5jb3VudGVyIDwgdGhpcy5jb3VudDsgdGhpcy5jb3VudGVyKyspIHN1cGVyLm5leHQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLm5leHQoKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2tpcDxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPiwgY291bnQ6IG51bWJlcik6IFNraXBJdGVyYXRvcjxUU291cmNlPiB7XHJcbiAgICByZXR1cm4gbmV3IFNraXBJdGVyYXRvcjxUU291cmNlPihzb3VyY2UsIGNvdW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEJ5cGFzc2VzIGEgc3BlY2lmaWVkIG51bWJlciBvZiBlbGVtZW50cyBpbiBhIHNlcXVlbmNlIGFuZCB0aGVuIHJldHVybnMgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cclxuICogQHBhcmFtIGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gc2tpcCBiZWZvcmUgcmV0dXJuaW5nIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2tpcFByb3RvPFRTb3VyY2U+KHRoaXM6IExpbnE8VFNvdXJjZT4sIGNvdW50OiBudW1iZXIpOiBMaW5xPFRTb3VyY2U+IHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQoc2tpcCwgY291bnQpO1xyXG59XHJcblxyXG4vKipcclxuICogQnlwYXNzZXMgYSBzcGVjaWZpZWQgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGEgc2VxdWVuY2UgYW5kIHRoZW4gcmV0dXJucyB0aGUgcmVtYWluaW5nIGVsZW1lbnRzLlxyXG4gKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byBza2lwIGJlZm9yZSByZXR1cm5pbmcgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBza2lwU3RhdGljPFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdLCBjb3VudDogbnVtYmVyKTogVFNvdXJjZVtdIHtcclxuICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoY291bnQpO1xyXG4gICAgLy8gcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuc2tpcChjb3VudCkudG9BcnJheSgpO1xyXG59XHJcbiIsImltcG9ydCB7QmFzZUl0ZXJhdG9yLCBJdGVyYXRvclJlc3VsdH0gZnJvbSBcIi4vaXRlcmF0b3JcIjtcclxuaW1wb3J0ICogYXMgVXRpbCBmcm9tIFwiLi4vLi4vdXRpbFwiO1xyXG5pbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2tpcFdoaWxlSXRlcmF0b3I8VFNvdXJjZT4gZXh0ZW5kcyBCYXNlSXRlcmF0b3I8VFNvdXJjZT4ge1xyXG4gICAgcHJpdmF0ZSBkb25lOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc291cmNlOiBUU291cmNlW10gfCBCYXNlSXRlcmF0b3I8VFNvdXJjZT4sXHJcbiAgICAgICAgcHJpdmF0ZSBwcmVkaWNhdGU6IFV0aWwuSVByZWRpY2F0ZTxUU291cmNlPiA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZVxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFRTb3VyY2U+IHtcclxuICAgICAgICBsZXQgaXRlbTogSXRlcmF0b3JSZXN1bHQ8VFNvdXJjZT47XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBpdGVtID0gc3VwZXIubmV4dCgpO1xyXG4gICAgICAgIH0gd2hpbGUgKCF0aGlzLmRvbmUgJiYgIVV0aWwuaXNVbmRlZmluZWQoaXRlbS52YWx1ZSkgJiYgdGhpcy5wcmVkaWNhdGUoaXRlbS52YWx1ZSwgdGhpcy5faWR4KSk7XHJcblxyXG4gICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNraXBXaGlsZTxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPiwgcHJlZGljYXRlOiBVdGlsLklQcmVkaWNhdGU8VFNvdXJjZT4pOiBTa2lwV2hpbGVJdGVyYXRvcjxUU291cmNlPiB7XHJcbiAgICByZXR1cm4gbmV3IFNraXBXaGlsZUl0ZXJhdG9yPFRTb3VyY2U+KHNvdXJjZSwgcHJlZGljYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEJ5cGFzc2VzIGVsZW1lbnRzIGluIGEgc2VxdWVuY2UgYXMgbG9uZyBhcyBhIHNwZWNpZmllZCBjb25kaXRpb24gaXMgdHJ1ZSBhbmQgdGhlbiByZXR1cm5zIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2tpcFdoaWxlUHJvdG88VFNvdXJjZT4odGhpczogTGlucTxUU291cmNlPiwgcHJlZGljYXRlOiBVdGlsLklQcmVkaWNhdGU8YW55Pik6IExpbnE8VFNvdXJjZT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubGlmdChza2lwV2hpbGUsIHByZWRpY2F0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCeXBhc3NlcyBlbGVtZW50cyBpbiBhIHNlcXVlbmNlIGFzIGxvbmcgYXMgYSBzcGVjaWZpZWQgY29uZGl0aW9uIGlzIHRydWUgYW5kIHRoZW4gcmV0dXJucyB0aGUgcmVtYWluaW5nIGVsZW1lbnRzLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNraXBXaGlsZVN0YXRpYzxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSwgcHJlZGljYXRlOiBVdGlsLklQcmVkaWNhdGU8VFNvdXJjZT4pOiBUU291cmNlW10ge1xyXG4gICAgcmV0dXJuIG5ldyBMaW5xPFRTb3VyY2U+KHNvdXJjZSkuc2tpcFdoaWxlKHByZWRpY2F0ZSkudG9BcnJheTxUU291cmNlPigpO1xyXG59XHJcbiIsImltcG9ydCB7QmFzZUl0ZXJhdG9yLCBJdGVyYXRvclJlc3VsdH0gZnJvbSBcIi4vaXRlcmF0b3JcIjtcclxuaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRha2VJdGVyYXRvcjxUU291cmNlPiBleHRlbmRzIEJhc2VJdGVyYXRvcjxUU291cmNlPiB7XHJcbnByaXZhdGUgX2NvdW50ZXI6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc291cmNlOiBUU291cmNlW10gfCBCYXNlSXRlcmF0b3I8VFNvdXJjZT4sXHJcbiAgICAgICAgcHJpdmF0ZSBjb3VudDogbnVtYmVyXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8VFNvdXJjZT4ge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb3VudGVyIDwgdGhpcy5jb3VudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb3VudGVyKys7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0YWtlPFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdIHwgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+LCBjb3VudDogbnVtYmVyKTogVGFrZUl0ZXJhdG9yPFRTb3VyY2U+IHtcclxuICAgIHJldHVybiBuZXcgVGFrZUl0ZXJhdG9yPFRTb3VyY2U+KHNvdXJjZSwgY291bnQpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIHNwZWNpZmllZCBudW1iZXIgb2YgY29udGlndW91cyBlbGVtZW50cyBmcm9tIHRoZSBzdGFydCBvZiBhIHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZXR1cm4uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdGFrZVByb3RvPFRTb3VyY2U+KHRoaXM6IExpbnE8VFNvdXJjZT4sIGNvdW50OiBudW1iZXIpOiBMaW5xPFRTb3VyY2U+IHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQodGFrZSwgY291bnQpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIHNwZWNpZmllZCBudW1iZXIgb2YgY29udGlndW91cyBlbGVtZW50cyBmcm9tIHRoZSBzdGFydCBvZiBhIHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZXR1cm4uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdGFrZVN0YXRpYzxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSwgY291bnQ6IG51bWJlcik6IFRTb3VyY2VbXSB7XHJcbiAgICByZXR1cm4gc291cmNlLnNsaWNlKDAsIGNvdW50KTtcclxuICAgIC8vIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnNraXAoY291bnQpLnRvQXJyYXkoKTtcclxufVxyXG4iLCJpbXBvcnQge0Jhc2VJdGVyYXRvciwgSXRlcmF0b3JSZXN1bHR9IGZyb20gXCIuL2l0ZXJhdG9yXCI7XHJcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uLy4uL3V0aWxcIjtcclxuaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRha2VXaGlsZUl0ZXJhdG9yPFRTb3VyY2U+IGV4dGVuZHMgQmFzZUl0ZXJhdG9yPFRTb3VyY2U+IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBzb3VyY2U6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPixcclxuICAgICAgICBwcml2YXRlIHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+ID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihzb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8VFNvdXJjZT4ge1xyXG4gICAgICAgIGxldCBuID0gc3VwZXIubmV4dCgpO1xyXG5cclxuICAgICAgICBpZiAoIW4uZG9uZSAmJiAhIXRoaXMucHJlZGljYXRlKG4udmFsdWUsIHRoaXMuX2lkeCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBuLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0YWtlV2hpbGU8VFNvdXJjZT4oc291cmNlOiBUU291cmNlW10gfCBCYXNlSXRlcmF0b3I8VFNvdXJjZT4sIHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+KTogVGFrZVdoaWxlSXRlcmF0b3I8VFNvdXJjZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBUYWtlV2hpbGVJdGVyYXRvcjxUU291cmNlPihzb3VyY2UsIHByZWRpY2F0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGVsZW1lbnRzIGZyb20gYSBzZXF1ZW5jZSBhcyBsb25nIGFzIGEgc3BlY2lmaWVkIGNvbmRpdGlvbiBpcyB0cnVlLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHRha2VXaGlsZVByb3RvPFRTb3VyY2U+KHRoaXM6IExpbnE8VFNvdXJjZT4sIHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPGFueT4pOiBMaW5xPFRTb3VyY2U+IHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQodGFrZVdoaWxlLCBwcmVkaWNhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBlbGVtZW50cyBmcm9tIGEgc2VxdWVuY2UgYXMgbG9uZyBhcyBhIHNwZWNpZmllZCBjb25kaXRpb24gaXMgdHJ1ZS5cclxuICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB0YWtlV2hpbGVTdGF0aWM8VFNvdXJjZT4oc291cmNlOiBUU291cmNlW10sIHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+KTogVFNvdXJjZVtdIHtcclxuICAgIHJldHVybiBuZXcgTGlucTxUU291cmNlPihzb3VyY2UpLnRha2VXaGlsZShwcmVkaWNhdGUpLnRvQXJyYXk8VFNvdXJjZT4oKTtcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBVdGlsIGZyb20gXCIuLi8uLi91dGlsXCI7XHJcbmltcG9ydCB7QmFzZUl0ZXJhdG9yLCBJdGVyYXRvclJlc3VsdH0gZnJvbSBcIi4vaXRlcmF0b3JcIjtcclxuaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFppcEl0ZXJhdG9yPFRGaXJzdCwgVFNlY29uZCwgVFJlc3VsdD4gZXh0ZW5kcyBCYXNlSXRlcmF0b3I8VEZpcnN0PiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc291cmNlOiBURmlyc3RbXSB8IEJhc2VJdGVyYXRvcjxURmlyc3Q+LFxyXG4gICAgICAgIHByaXZhdGUgb3RoZXI6IFRTZWNvbmRbXSxcclxuICAgICAgICBwcml2YXRlIGNhbGxiYWNrOiAoYTogVEZpcnN0LCBiOiBUU2Vjb25kLCBpZHg6IG51bWJlcikgPT4gVFJlc3VsdFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoc291cmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFRSZXN1bHQ+IHtcclxuICAgICAgICBsZXQgaXRlbSA9IHN1cGVyLm5leHQoKTtcclxuICAgICAgICBpZiAoIWl0ZW0uZG9uZSkge1xyXG4gICAgICAgICAgICBsZXQgbyA9IHRoaXMub3RoZXJbdGhpcy5faWR4XTtcclxuICAgICAgICAgICAgaWYgKCFVdGlsLmlzVW5kZWZpbmVkKG8pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmNhbGxiYWNrKGl0ZW0udmFsdWUsIG8sIHRoaXMuX2lkeCksXHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZTogZmFsc2VcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGRvbmU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB6aXA8VEZpcnN0LCBUU2Vjb25kLCBUUmVzdWx0Pihzb3VyY2U6IFRGaXJzdFtdIHwgQmFzZUl0ZXJhdG9yPFRGaXJzdD4sIG90aGVyOiBUU2Vjb25kW10sIGNhbGxiYWNrOiAoYTogVEZpcnN0LCBiOiBUU2Vjb25kLCBpZHg6IG51bWJlcikgPT4gVFJlc3VsdCk6IFppcEl0ZXJhdG9yPFRGaXJzdCwgVFNlY29uZCwgVFJlc3VsdD4ge1xyXG4gICAgcmV0dXJuIG5ldyBaaXBJdGVyYXRvcjxURmlyc3QsIFRTZWNvbmQsIFRSZXN1bHQ+KHNvdXJjZSwgb3RoZXIsIGNhbGxiYWNrKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHppcFByb3RvPFRPdGhlciwgVFJlc3VsdD4odGhpczogTGlucTxhbnk+LCBvdGhlcjogVE90aGVyW10sIGNhbGxiYWNrOiAoYTogYW55LCBiOiBUT3RoZXIsIGlkeDogbnVtYmVyKSA9PiBUUmVzdWx0KTogTGlucTxUUmVzdWx0PjtcclxuLyoqXHJcbiAqIE1lcmdlcyBpdGVtcyBmcm9tIHRoZSBmaXJzdCBzZXF1ZW5jZSB3aXRoIHRoZSBpdGVtIGF0IHRoZSBjb3JyZXNwb25kaW5nIGluZGV4IGluIHRoZSBzZWNvbmQgc2VxdWVuY2UgdG9cclxuICogY3JlYXRlIGEgbmV3IHNlcXVlbmNlIHdpdGggdGhlIHJlc3VsdHMgb2YgY2FsbGluZyBhIHByb3ZpZGVkIGZ1bmN0aW9uIG9uIGV2ZXJ5IHBhaXIgb2YgaXRlbXMuXHJcbiAqIFRoZSB6aXAgd2lsbCBzdG9wIGFzIHNvb24gYXMgZWl0aGVyIG9mIHRoZSBzZXF1ZW5jZXMgaGl0cyBhbiB1bmRlZmluZWQgdmFsdWUuXHJcbiAqIEBwYXJhbSBvdGhlciBUaGUgc2Vjb25kIHNlcXVlbmNlIHRvIHppcCB3aXRoXHJcbiAqIEBwYXJhbSBjYWxsYmFjayBGdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGFuIGVsZW1lbnQgb2YgdGhlIG5ldyBzZXF1ZW5jZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHppcFByb3RvPFRTb3VyY2UsIFRPdGhlciwgVFJlc3VsdD4odGhpczogTGlucTxUU291cmNlPiwgb3RoZXI6IFRPdGhlcltdLCBjYWxsYmFjazogKGE6IFRTb3VyY2UsIGI6IFRPdGhlciwgaWR4OiBudW1iZXIpID0+IFRSZXN1bHQpOiBMaW5xPFRSZXN1bHQ+IHtcclxuICAgIHJldHVybiB0aGlzLmxpZnQoemlwLCBvdGhlciwgY2FsbGJhY2spO1xyXG59XHJcblxyXG4vKipcclxuICogTWVyZ2VzIGl0ZW1zIGZyb20gdGhlIGZpcnN0IHNlcXVlbmNlIHdpdGggdGhlIGl0ZW0gYXQgdGhlIGNvcnJlc3BvbmRpbmcgaW5kZXggaW4gdGhlIHNlY29uZCBzZXF1ZW5jZSB0b1xyXG4gKiBjcmVhdGUgYSBuZXcgc2VxdWVuY2Ugd2l0aCB0aGUgcmVzdWx0cyBvZiBjYWxsaW5nIGEgcHJvdmlkZWQgZnVuY3Rpb24gb24gZXZlcnkgcGFpciBvZiBpdGVtcy5cclxuICogVGhlIHppcCB3aWxsIHN0b3AgYXMgc29vbiBhcyBlaXRoZXIgb2YgdGhlIHNlcXVlbmNlcyBoaXRzIGFuIHVuZGVmaW5lZCB2YWx1ZS5cclxuICogQHBhcmFtIG90aGVyIFRoZSBzZWNvbmQgc2VxdWVuY2UgdG8gemlwIHdpdGhcclxuICogQHBhcmFtIGNhbGxiYWNrIEZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgYW4gZWxlbWVudCBvZiB0aGUgbmV3IHNlcXVlbmNlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gemlwU3RhdGljPFRGaXJzdCwgVFNlY29uZCwgVFJlc3VsdD4oc291cmNlOiBURmlyc3RbXSwgb3RoZXI6IFRTZWNvbmRbXSwgY2FsbGJhY2s6IChhOiBURmlyc3QsIGI6IFRTZWNvbmQsIGlkeDogbnVtYmVyKSA9PiBUUmVzdWx0KTogVFJlc3VsdFtdIHtcclxuICAgIC8vIFRPRE86IFdyaXRlIHN0YXRpYyB6aXAgZnVuY3Rpb24gd2l0aG91dCBpbnN0YW50aWF0aW5nIGEgbmV3IExpbnEgb2JqZWN0XHJcbiAgICByZXR1cm4gbmV3IExpbnE8VEZpcnN0Pihzb3VyY2UpLnppcDxUU2Vjb25kLCBUUmVzdWx0PihvdGhlciwgY2FsbGJhY2spLnRvQXJyYXk8VFJlc3VsdD4oKTtcclxufVxyXG4iLCJpbXBvcnQge0Jhc2VJdGVyYXRvciwgSXRlcmF0b3JSZXN1bHR9IGZyb20gXCIuL2l0ZXJhdG9yL2l0ZXJhdG9yXCI7XHJcbmltcG9ydCB7TWFwSXRlcmF0b3J9IGZyb20gXCIuL2l0ZXJhdG9yL21hcFwiO1xyXG5pbXBvcnQgKiBhcyBVdGlsIGZyb20gXCIuLi91dGlsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlucTxUU291cmNlPiAvKmltcGxlbWVudHMgSXRlcmFibGU8YW55PiovIHtcclxuICAgIHB1YmxpYyBfc291cmNlOiBCYXNlSXRlcmF0b3I8VFNvdXJjZT47IC8vIFRPRE86IEZpZ3VyZSBvdXQgYSB3YXkgdG8gbm90IGhhdmUgaXQgcHVibGljICh1c2VkIGluIE9yZGVyQnlJdGVyYXRvcilcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2U6IFRTb3VyY2VbXSB8IEJhc2VJdGVyYXRvcjxUU291cmNlPikge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IChzb3VyY2UgaW5zdGFuY2VvZiBCYXNlSXRlcmF0b3IpXHJcbiAgICAgICAgICAgID8gc291cmNlXHJcbiAgICAgICAgICAgIDogbmV3IE1hcEl0ZXJhdG9yPFRTb3VyY2UsIFRTb3VyY2U+KHNvdXJjZSwgKGl0ZW0pID0+IGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxpZnQoaXRlcmF0b3I6IChzb3VyY2U6IGFueVtdIHwgQmFzZUl0ZXJhdG9yPGFueT4sIC4uLmFyZ3M6IGFueVtdKSA9PiBCYXNlSXRlcmF0b3I8VFNvdXJjZT4sIC4uLmFyZ3M6IGFueVtdKTogTGlucTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnE8YW55PihpdGVyYXRvcih0aGlzLl9zb3VyY2UsIC4uLmFyZ3MpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEludmVydHMgdGhlIG9yZGVyIG9mIHRoZSBlbGVtZW50cyBpbiBhIHNlcXVlbmNlLlxyXG4gICAgICogVGhpcyBzaW1wbHkgaXRlcmF0ZXMgdGhlIGl0ZW1zIGZyb20gdGhlIGVuZCwgYW5kIGFzIHN1Y2ggaGFzIG5vIGFkZGl0aW9uYWwgcGVyZm9ybWFuY2UgY29zdC5cclxuICAgICAqL1xyXG4gICAgcmV2ZXJzZSgpOiBMaW5xPFRTb3VyY2U+IHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UucmV2ZXJzZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZXMgdGhlIHBpcGVsaW5lIGFuZCByZXR1cm4gdGhlIHJlc3VsdGluZyBhcnJheS5cclxuICAgICAqL1xyXG4gICAgdG9BcnJheTxUUmVzdWx0PigpOiBUUmVzdWx0W10ge1xyXG5cclxuICAgICAgICBsZXQgcmVzOiBJdGVyYXRvclJlc3VsdDxUUmVzdWx0PixcclxuICAgICAgICAgICAgYXJyID0gW107XHJcblxyXG4gICAgICAgIGlmIChVdGlsLmlzQXJyYXkodGhpcy5fc291cmNlKSkge1xyXG4gICAgICAgICAgICBhcnIgPSBVdGlsLmNhc3Q8QXJyYXk8VFJlc3VsdD4+KHRoaXMuX3NvdXJjZSkuc2xpY2UoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aGlsZSAoIShyZXMgPSB0aGlzLl9zb3VyY2UubmV4dCgpKS5kb25lKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaChyZXMudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG4gICAgLy8gICAgIGxldCBpZHggPSAwO1xyXG4gICAgLy8gICAgIHJldHVybiB7XHJcbiAgICAvLyAgICAgICAgIG5leHQoKTogQmFzZUl0ZXJhdG9yUmVzdWx0PGFueT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgbGV0IHJlcztcclxuICAgIC8vICAgICAgICAgICAgIGlmIChVdGlsLmlzQXJyYXkodGhpcy5fc291cmNlKSkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHJlcyA9IFV0aWwuY2FzdDxBcnJheTxhbnk+Pih0aGlzLl9zb3VyY2UpW2lkeCsrXTtcclxuICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICByZXMgPSB0aGlzLl9zb3VyY2UubmV4dCgpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH0gd2hpbGUgKCFVdGlsLmlzVW5kZWZpbmVkKHJlcykpO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlkeCsrO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIH07XHJcbiAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGRvbmU6IHRydWUsXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfTtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH07XHJcbiAgICAvLyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBMUTxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSkge1xyXG4gICAgcmV0dXJuIG5ldyBMaW5xPFRTb3VyY2U+KHNvdXJjZSk7XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgVXRpbCBmcm9tIFwiLi4vdXRpbFwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VWYWx1ZVByZWRpY2F0ZShwcmVkaWNhdGUpOiAocHJlZGljYXRlKSA9PiBhbnkge1xyXG4gICAgaWYgKFV0aWwuaXNTdHJpbmcocHJlZGljYXRlKSkge1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHByZWRpY2F0ZTtcclxuICAgICAgICBwcmVkaWNhdGUgPSAoKHgpID0+IHhbZmllbGRdKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKFV0aWwuaXNVbmRlZmluZWQocHJlZGljYXRlKSkge1xyXG4gICAgICAgIHByZWRpY2F0ZSA9ICgoKSA9PiB0cnVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcmVkaWNhdGU7XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgVXRpbCBmcm9tIFwiLi4vLi4vdXRpbFwiO1xyXG5pbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCBcIi4uL2FkZC9hbnlcIjtcclxuXHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYWxsIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuICogQHBhcmFtIGludmVydCBJZiB0cnVlLCBkZXRlcm1pbmVzIHdoZXRoZXIgbm9uZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIHNhdGlzZnkgYSBjb25kaXRpb24uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYWxsUHJvdG88VFNvdXJjZT4odGhpczogTGlucTxUU291cmNlPiwgcHJlZGljYXRlOiBVdGlsLklQcmVkaWNhdGU8VFNvdXJjZT4sIGludmVydDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gISh0aGlzLmFueShwcmVkaWNhdGUsICFpbnZlcnQpKTtcclxufVxyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFsbCBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIHNhdGlzZnkgYSBjb25kaXRpb24uXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uXHJcbiAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIG5vbmUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFsbFN0YXRpYzxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSwgcHJlZGljYXRlOiBVdGlsLklQcmVkaWNhdGU8VFNvdXJjZT4sIGludmVydDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gc291cmNlLmV2ZXJ5KHggPT4gISFwcmVkaWNhdGUoeCkgIT09IGludmVydCk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gLyoqXHJcbi8vICAqIERldGVybWluZXMgd2hldGhlciBhbGwgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBzYXRpc2Z5IGEgY29uZGl0aW9uLlxyXG4vLyAgKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLlxyXG4vLyAgKiBAcGFyYW0gaW52ZXJ0IElmIHRydWUsIGRldGVybWluZXMgd2hldGhlciBub25lIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuLy8gICovXHJcbi8vIGFsbChwcmVkaWNhdGU6IFV0aWwuSVByZWRpY2F0ZTxUU291cmNlPiwgaW52ZXJ0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuLy8gICAgIHJldHVybiAhKHRoaXMuYW55KHByZWRpY2F0ZSwgIWludmVydCkpO1xyXG4vLyB9XHJcbi8vIC8qKlxyXG4vLyAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYWxsIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2Ugc2F0aXNmeSBhIGNvbmRpdGlvbi5cclxuLy8gICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi5cclxuLy8gICogQHBhcmFtIGludmVydCBJZiB0cnVlLCBkZXRlcm1pbmVzIHdoZXRoZXIgbm9uZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIHNhdGlzZnkgYSBjb25kaXRpb24uXHJcbi8vICAqL1xyXG4vLyBzdGF0aWMgYWxsPFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdLCBwcmVkaWNhdGU6IFV0aWwuSVByZWRpY2F0ZTxUU291cmNlPiwgaW52ZXJ0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuLy8gICAgIHJldHVybiBzb3VyY2UuZXZlcnkoeCA9PiAhIXByZWRpY2F0ZSh4KSAhPT0gaW52ZXJ0KTtcclxuLy8gfVxyXG4iLCJpbXBvcnQgKiBhcyBVdGlsIGZyb20gXCIuLi8uLi91dGlsXCI7XHJcbmltcG9ydCB7TGlucX0gZnJvbSBcIi4uL2xpbnFcIjtcclxuaW1wb3J0IFwiLi4vYWRkL2ZpcnN0XCI7XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2Ugc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gKiBAcGFyYW0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uLiBJZiBub3QgcHJvdmlkZWQsIGRldGVybWluZXMgd2hldGhlciB0aGUgc2VxdWVuY2UgY29udGFpbnMgYW55IGVsZW1lbnRzLlxyXG4gKiBAcGFyYW0gaW52ZXJ0IElmIHRydWUsIGRldGVybWluZXMgd2hldGhlciBhbnkgZWxlbWVudCBvZiBhIHNlcXVlbmNlIGRvZXMgbm90IHNhdGlzZmllcyBhIGNvbmRpdGlvbi5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhbnlQcm90bzxUU291cmNlPih0aGlzOiBMaW5xPFRTb3VyY2U+LCBwcmVkaWNhdGU6IFV0aWwuSVByZWRpY2F0ZTxUU291cmNlPiwgaW52ZXJ0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0eXBlb2YgdGhpcy5maXJzdCh4ID0+ICEhcHJlZGljYXRlKHgpICE9PSBpbnZlcnQpICE9PSBcInVuZGVmaW5lZFwiO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW55IGVsZW1lbnQgb2YgYSBzZXF1ZW5jZSBzYXRpc2ZpZXMgYSBjb25kaXRpb24uXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uIElmIG5vdCBwcm92aWRlZCwgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzZXF1ZW5jZSBjb250YWlucyBhbnkgZWxlbWVudHMuXHJcbiAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2UgZG9lcyBub3Qgc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFueVN0YXRpYzxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSwgcHJlZGljYXRlOiBVdGlsLklQcmVkaWNhdGU8VFNvdXJjZT4sIGludmVydDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gc291cmNlLnNvbWUoeCA9PiAhIXByZWRpY2F0ZSh4KSAhPT0gaW52ZXJ0KTtcclxufVxyXG5cclxuXHJcbi8vIC8qKlxyXG4vLyAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW55IGVsZW1lbnQgb2YgYSBzZXF1ZW5jZSBzYXRpc2ZpZXMgYSBjb25kaXRpb24uXHJcbi8vICAqIEBwYXJhbSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb24uIElmIG5vdCBwcm92aWRlZCwgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzZXF1ZW5jZSBjb250YWlucyBhbnkgZWxlbWVudHMuXHJcbi8vICAqIEBwYXJhbSBpbnZlcnQgSWYgdHJ1ZSwgZGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBlbGVtZW50IG9mIGEgc2VxdWVuY2UgZG9lcyBub3Qgc2F0aXNmaWVzIGEgY29uZGl0aW9uLlxyXG4vLyAgKi9cclxuLy8gYW55KHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+LCBpbnZlcnQ6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xyXG4vLyAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmZpcnN0KHggPT4gISFwcmVkaWNhdGUoeCkgIT09IGludmVydCkgIT09IFwidW5kZWZpbmVkXCI7XHJcbi8vIH1cclxuLy8gLyoqXHJcbi8vICAqIERldGVybWluZXMgd2hldGhlciBhbnkgZWxlbWVudCBvZiBhIHNlcXVlbmNlIHNhdGlzZmllcyBhIGNvbmRpdGlvbi5cclxuLy8gICogQHBhcmFtIHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRvIHRlc3QgZWFjaCBlbGVtZW50IGZvciBhIGNvbmRpdGlvbi4gSWYgbm90IHByb3ZpZGVkLCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNlcXVlbmNlIGNvbnRhaW5zIGFueSBlbGVtZW50cy5cclxuLy8gICogQHBhcmFtIGludmVydCBJZiB0cnVlLCBkZXRlcm1pbmVzIHdoZXRoZXIgYW55IGVsZW1lbnQgb2YgYSBzZXF1ZW5jZSBkb2VzIG5vdCBzYXRpc2ZpZXMgYSBjb25kaXRpb24uXHJcbi8vICAqL1xyXG4vLyBzdGF0aWMgYW55PFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdLCBwcmVkaWNhdGU6IFV0aWwuSVByZWRpY2F0ZTxUU291cmNlPiwgaW52ZXJ0OiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuLy8gICAgIHJldHVybiBzb3VyY2Uuc29tZSh4ID0+ICEhcHJlZGljYXRlKHgpICE9PSBpbnZlcnQpO1xyXG4vLyB9XHJcbiIsImltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uLy4uL3V0aWxcIjtcclxuaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGVzIHRoZSBhdmVyYWdlIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIHNlbGVjdG9yXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYXZlcmFnZVByb3RvPFRTb3VyY2U+KHRoaXM6IExpbnE8VFNvdXJjZT4sIHNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBudW1iZXI+ID0gVXRpbC5kZWZhdWx0U2VsZWN0b3IpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGF2ZXJhZ2VTdGF0aWModGhpcy50b0FycmF5PFRTb3VyY2U+KCksIHNlbGVjdG9yKTtcclxufVxyXG4vKipcclxuICogQ29tcHV0ZXMgdGhlIGF2ZXJhZ2Ugb2YgYSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gc2VsZWN0b3JcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhdmVyYWdlU3RhdGljPFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdLCBzZWxlY3RvcjogVXRpbC5JU2VsZWN0b3I8VFNvdXJjZSwgbnVtYmVyPiA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yKTogbnVtYmVyIHtcclxuICAgIGxldCBpLCB0b3RhbCA9IDA7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdG90YWwgKz0gc2VsZWN0b3Ioc291cmNlW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0b3RhbCAvIHNvdXJjZS5sZW5ndGg7XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgVXRpbCBmcm9tIFwiLi4vLi4vdXRpbFwiO1xyXG5pbXBvcnQge0xpbnF9IGZyb20gXCIuLi9saW5xXCI7XHJcbmltcG9ydCBcIi4uL2FkZC9maWx0ZXJcIjtcclxuaW1wb3J0IFwiLi4vYWRkL3Rha2VcIjtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBtYXRjaGluZyBpdGVtIGluIHRoZSBhcnJheS5cclxuICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZpcnN0UHJvdG88VFNvdXJjZT4odGhpczogTGlucTxUU291cmNlPiwgcHJlZGljYXRlOiBVdGlsLklQcmVkaWNhdGU8VFNvdXJjZT4gPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGUpOiBhbnkge1xyXG4gICAgbGV0IGFyciA9IHRoaXMuZmlsdGVyKHByZWRpY2F0ZSkudGFrZSgxKS50b0FycmF5KCk7XHJcbiAgICBpZiAoYXJyLmxlbmd0aCA9PSAxKSByZXR1cm4gYXJyWzBdO1xyXG4gICAgZWxzZSByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgZmlyc3QgbWF0Y2hpbmcgaXRlbSBpbiB0aGUgYXJyYXkuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmaXJzdFN0YXRpYzxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSwgcHJlZGljYXRlPzogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+KTogVFNvdXJjZSB7XHJcbiAgICBpZiAoIXNvdXJjZSB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgaWYgKCFwcmVkaWNhdGUpIHJldHVybiBzb3VyY2VbMF07XHJcblxyXG4gICAgbGV0IHJzID0gdW5kZWZpbmVkO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlKHNvdXJjZVtpXSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBVdGlsIGZyb20gXCIuLi8uLi91dGlsXCI7XHJcbmltcG9ydCB7TGlucX0gZnJvbSBcIi4uL2xpbnFcIjtcclxuaW1wb3J0IFwiLi4vYWRkL2ZpcnN0XCI7XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgbGFzdCBtYXRjaGluZyBpdGVtIGluIHRoZSBhcnJheS5cclxuICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxhc3RQcm90bzxUU291cmNlPih0aGlzOiBMaW5xPFRTb3VyY2U+LCBwcmVkaWNhdGU6IFV0aWwuSVByZWRpY2F0ZTxUU291cmNlPiA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZSk6IFRTb3VyY2Uge1xyXG4gICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpLmZpcnN0KHByZWRpY2F0ZSk7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGxhc3QgbWF0Y2hpbmcgaXRlbSBpbiB0aGUgYXJyYXkuXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBsYXN0U3RhdGljPFRTb3VyY2U+KHNvdXJjZTogVFNvdXJjZVtdLCBwcmVkaWNhdGU/OiBVdGlsLklQcmVkaWNhdGU8VFNvdXJjZT4pOiBUU291cmNlIHtcclxuICAgIGlmICghc291cmNlIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICBpZiAoIXByZWRpY2F0ZSkgcmV0dXJuIHNvdXJjZVtzb3VyY2UubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IHNvdXJjZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUoc291cmNlW2ldKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc291cmNlW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uLy4uL3V0aWxcIjtcclxuaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGVzIHRoZSBtYXhpbXVtIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIHNlbGVjdG9yXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbWF4UHJvdG88VFNvdXJjZT4odGhpczogTGlucTxUU291cmNlPiwgc2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRTb3VyY2UsIG51bWJlcj4gPSBVdGlsLmRlZmF1bHRTZWxlY3Rvcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gbWF4U3RhdGljKHRoaXMudG9BcnJheTxUU291cmNlPigpLCBzZWxlY3Rvcik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlcyB0aGUgbWF4aW11bSBvZiBhIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBzZWxlY3RvclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG1heFN0YXRpYzxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSwgc2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRTb3VyY2UsIG51bWJlcj4gPSBVdGlsLmRlZmF1bHRTZWxlY3Rvcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgc291cmNlLm1hcChzZWxlY3RvcikpO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uLy4uL3V0aWxcIjtcclxuaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5cclxuLyoqXHJcbiAqIENvbXB1dGVzIHRoZSBtaW5pbXVtIG9mIGEgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIHNlbGVjdG9yXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbWluUHJvdG88VFNvdXJjZT4odGhpczogTGlucTxUU291cmNlPiwgc2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRTb3VyY2UsIG51bWJlcj4gPSBVdGlsLmRlZmF1bHRTZWxlY3Rvcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gbWluU3RhdGljKHRoaXMudG9BcnJheTxUU291cmNlPigpLCBzZWxlY3Rvcik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlcyB0aGUgbWluaW11bSBvZiBhIHNlcXVlbmNlIG9mIG51bWVyaWMgdmFsdWVzIHRoYXQgYXJlIG9idGFpbmVkIGJ5IGludm9raW5nIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggZWxlbWVudCBvZiB0aGUgaW5wdXQgc2VxdWVuY2UuXHJcbiAqIEBwYXJhbSBzZWxlY3RvclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG1pblN0YXRpYzxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSwgc2VsZWN0b3I6IFV0aWwuSVNlbGVjdG9yPFRTb3VyY2UsIG51bWJlcj4gPSBVdGlsLmRlZmF1bHRTZWxlY3Rvcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCwgc291cmNlLm1hcChzZWxlY3RvcikpO1xyXG59XHJcbiIsImltcG9ydCAqIGFzIFV0aWwgZnJvbSBcIi4uLy4uL3V0aWxcIjtcclxuaW1wb3J0IHtMaW5xfSBmcm9tIFwiLi4vbGlucVwiO1xyXG5pbXBvcnQgXCIuLi9hZGQvZmlsdGVyXCI7XHJcbmltcG9ydCBcIi4uL2FkZC90YWtlXCI7XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgbWF0Y2hpbmcgaXRlbSBpbiB0aGUgYXJyYXkuIElmIHRoZXJlIGFyZSB6ZXJvIG9yIHNldmVyYWwgbWF0Y2hlcyBhbiBleGNlcHRpb24gd2lsbCBiZSB0aHJvd25cclxuICogQHBhcmFtIHByZWRpY2F0ZVxyXG4gKiBAdGhyb3dzIEVycm9yLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNpbmdsZVByb3RvPFRTb3VyY2U+KHRoaXM6IExpbnE8VFNvdXJjZT4sIHByZWRpY2F0ZTogVXRpbC5JUHJlZGljYXRlPFRTb3VyY2U+KTogVFNvdXJjZSB7XHJcbiAgICBsZXQgYXJyID0gdGhpcy5maWx0ZXIocHJlZGljYXRlKS50YWtlKDIpLnRvQXJyYXk8VFNvdXJjZT4oKTtcclxuICAgIGlmIChhcnIubGVuZ3RoID09IDApIHRocm93IG5ldyBFcnJvcihcIlRoZSBzZXF1ZW5jZSBpcyBlbXB0eS5cIik7XHJcbiAgICBpZiAoYXJyLmxlbmd0aCA9PSAyKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc2VxdWVuY2UgY29udGFpbnMgbW9yZSB0aGFuIG9uZSBlbGVtZW50LlwiKTtcclxuICAgIGlmIChhcnIubGVuZ3RoID09IDEpIHJldHVybiBhcnJbMF07XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIG1hdGNoaW5nIGl0ZW0gaW4gdGhlIGFycmF5LiBJZiB0aGVyZSBhcmUgemVybyBvciBzZXZlcmFsIG1hdGNoZXMgYW4gZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGVcclxuICogQHRocm93cyBFcnJvclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNpbmdsZVN0YXRpYzxUU291cmNlPihzb3VyY2U6IFRTb3VyY2VbXSwgcHJlZGljYXRlOiAocHJlZGljYXRlKSA9PiBib29sZWFuKTogVFNvdXJjZSB7XHJcbiAgICBpZiAoIXNvdXJjZSB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgaWYgKCFwcmVkaWNhdGUpIHJldHVybiBzb3VyY2VbMF07XHJcblxyXG4gICAgbGV0IHJzID0gdW5kZWZpbmVkO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlKHNvdXJjZVtpXSkpIHtcclxuICAgICAgICAgICAgaWYgKHJzKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc2VxdWVuY2UgY29udGFpbnMgbW9yZSB0aGFuIG9uZSBlbGVtZW50LlwiKTtcclxuXHJcbiAgICAgICAgICAgIHJzID0gc291cmNlW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXJzKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc2VxdWVuY2UgaXMgZW1wdHkuXCIpO1xyXG5cclxuICAgIHJldHVybiBycztcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBVdGlsIGZyb20gXCIuLi8uLi91dGlsXCI7XHJcbmltcG9ydCB7TGlucX0gZnJvbSBcIi4uL2xpbnFcIjtcclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlcyB0aGUgc3VtIG9mIHRoZSBzZXF1ZW5jZSBvZiBudW1lcmljIHZhbHVlcyB0aGF0IGFyZSBvYnRhaW5lZCBieSBpbnZva2luZyBhIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxyXG4gKiBAcGFyYW0gc2VsZWN0b3IgQSB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHN1bVByb3RvPFRTb3VyY2U+KHRoaXM6IExpbnE8VFNvdXJjZT4sIHNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBudW1iZXI+ID0gVXRpbC5kZWZhdWx0U2VsZWN0b3IpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHN1bVN0YXRpYyh0aGlzLnRvQXJyYXk8VFNvdXJjZT4oKSwgc2VsZWN0b3IpO1xyXG59XHJcblxyXG4vKipcclxuICogQ29tcHV0ZXMgdGhlIHN1bSBvZiB0aGUgc2VxdWVuY2Ugb2YgbnVtZXJpYyB2YWx1ZXMgdGhhdCBhcmUgb2J0YWluZWQgYnkgaW52b2tpbmcgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50IG9mIHRoZSBpbnB1dCBzZXF1ZW5jZS5cclxuICogQHBhcmFtIHNlbGVjdG9yIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggZWxlbWVudC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzdW1TdGF0aWM8VFNvdXJjZT4oc291cmNlOiBUU291cmNlW10sIHNlbGVjdG9yOiBVdGlsLklTZWxlY3RvcjxUU291cmNlLCBudW1iZXI+ID0gVXRpbC5kZWZhdWx0U2VsZWN0b3IpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHNvdXJjZS5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgc2VsZWN0b3IoaXRlbSksIDApO1xyXG59XHJcbiIsIu+7v2V4cG9ydCBpbnRlcmZhY2UgSUxvb3BGdW5jdGlvbjxUPiB7IChhOiBULCBpZHg/OiBudW1iZXIpOiBib29sZWFuIHwgdm9pZDsgfVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2VsZWN0b3I8VCwgVT4geyAoYTogVCk6IFU7IH1cclxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRTZWxlY3RvcjxULCBVPihhOiBUKTogVSB7XHJcbiAgICByZXR1cm4gY2FzdDxVPihhKTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ29tcGFyZXI8VD4geyAoYTogVCwgYjogVCk6IG51bWJlcjsgfVxyXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdENvbXBhcmVyPFQ+KGE6IFQsIGI6IFQpOiBudW1iZXIge1xyXG4gICAgaWYgKGEgPCBiKSByZXR1cm4gLTE7XHJcbiAgICBlbHNlIGlmIChhID4gYikgcmV0dXJuIDE7XHJcbiAgICBlbHNlIHJldHVybiAwO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFcXVhbGl0eUNvbXBhcmVyPFQ+IHsgKGE6IFQsIGI6IFQpOiBib29sZWFuOyB9XHJcbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0RXF1YWxpdHlDb21wYXJlcjxUPihhOiBULCBiOiBUKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gYSA9PT0gYjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUHJlZGljYXRlPFQ+IHsgKHZhbHVlOiBULCBpbmRleD86IG51bWJlcik6IGJvb2xlYW47IH1cclxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRQcmVkaWNhdGU8VD4odmFsdWU6IFQsIGluZGV4PzogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNhc3Q8VD4oYTogYW55KTogVCB7XHJcbiAgICByZXR1cm4gYTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmcodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBOdW1iZXJdXCI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNEYXRlKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBEYXRlXVwiO1xyXG59XHJcbiIsImV4cG9ydCB7TGlzdH0gZnJvbSBcIi4vbGlzdFwiO1xyXG5leHBvcnQge0xpbmtlZExpc3R9IGZyb20gXCIuL2xpbmtlZExpc3RcIjtcclxuZXhwb3J0IHtTdGFja30gZnJvbSBcIi4vc3RhY2tcIjtcclxuZXhwb3J0IHtRdWV1ZX0gZnJvbSBcIi4vcXVldWVcIjtcclxuZXhwb3J0IHtCaW5hcnlUcmVlfSBmcm9tIFwiLi9iaW5hcnlUcmVlXCI7XHJcbiIsImV4cG9ydCB7TnVtYmVycywgTnVtYmVyc0hlbHBlcn0gZnJvbSBcIi4vbnVtYmVyc1wiO1xyXG5leHBvcnQge1N0cmluZ3MsIFN0cmluZ3NIZWxwZXJ9IGZyb20gXCIuL3N0cmluZ3NcIjtcclxuZXhwb3J0IHtEYXRlcywgRGF0ZXNIZWxwZXJ9IGZyb20gXCIuL2RhdGVzXCI7XHJcbmV4cG9ydCB7VXJsLCBVcmxIZWxwZXJ9IGZyb20gXCIuL3VybFwiO1xyXG4iLCJpbXBvcnQgeyBCYXNlSXRlcmF0b3IsIEl0ZXJhdG9yUmVzdWx0IH0gZnJvbSBcIi4vaXRlcmF0b3IvaXRlcmF0b3JcIjtcclxuaW1wb3J0IHsgT3JkZXJlZExpbnEgfSBmcm9tIFwiLi9pdGVyYXRvci9vcmRlckJ5XCI7XHJcbmltcG9ydCB7IElHcm91cGluZyB9IGZyb20gXCIuL2l0ZXJhdG9yL2dyb3VwQnlcIjtcclxuXHJcbmltcG9ydCB7IExpbnEsIExRIH0gZnJvbSBcIi4vbGlucVwiO1xyXG5cclxuLy8gSXRlcmF0b3JzXHJcbmltcG9ydCBcIi4vYWRkL2Rpc3RpbmN0XCI7XHJcbmltcG9ydCBcIi4vYWRkL2V4Y2VwdFwiO1xyXG5pbXBvcnQgXCIuL2FkZC9maWx0ZXJcIjtcclxuaW1wb3J0IFwiLi9hZGQvZ3JvdXBCeVwiO1xyXG5pbXBvcnQgXCIuL2FkZC9pbnRlcnNlY3RcIjtcclxuaW1wb3J0IFwiLi9hZGQvam9pblwiO1xyXG5pbXBvcnQgXCIuL2FkZC9tYXBcIjtcclxuaW1wb3J0IFwiLi9hZGQvb3JkZXJCeVwiO1xyXG5pbXBvcnQgXCIuL2FkZC9za2lwXCI7XHJcbmltcG9ydCBcIi4vYWRkL3NraXBXaGlsZVwiO1xyXG5pbXBvcnQgXCIuL2FkZC90YWtlXCI7XHJcbmltcG9ydCBcIi4vYWRkL3Rha2VXaGlsZVwiO1xyXG5pbXBvcnQgXCIuL2FkZC96aXBcIjtcclxuXHJcbi8vIE9wZXJhdG9yc1xyXG5pbXBvcnQgXCIuL2FkZC9hbGxcIjtcclxuaW1wb3J0IFwiLi9hZGQvYW55XCI7XHJcbmltcG9ydCBcIi4vYWRkL2F2ZXJhZ2VcIjtcclxuaW1wb3J0IFwiLi9hZGQvZmlyc3RcIjtcclxuaW1wb3J0IFwiLi9hZGQvbGFzdFwiO1xyXG5pbXBvcnQgXCIuL2FkZC9tYXhcIjtcclxuaW1wb3J0IFwiLi9hZGQvbWluXCI7XHJcbmltcG9ydCBcIi4vYWRkL3NpbmdsZVwiO1xyXG5pbXBvcnQgXCIuL2FkZC9zdW1cIjtcclxuXHJcbmV4cG9ydCB7IExpbnEsIExRLCBPcmRlcmVkTGlucSwgSUdyb3VwaW5nIH07XHJcbiJdfQ==
;
return {
'Collections': require('Collections'),
'Helpers': require('Helpers'),
'Linq': require('Linq')
};
});
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
    function List(source) {
        this._source = source || [];
    }
    Object.defineProperty(List.prototype, "length", {
        get: function () { return this._source.length; },
        enumerable: true,
        configurable: true
    });
    List.prototype.toArray = function () {
        return this._source;
    };
    List.prototype.add = function (item) {
        this._source.push(item);
        return this;
    };
    List.add = function (source, item) {
        return new List(source).add(item).toArray();
    };
    List.prototype.addRange = function (collection) {
        var items = (collection instanceof List) ? collection.toArray() : collection;
        Array.prototype.push.apply(this._source, items);
        return this;
    };
    List.addRange = function (source, collection) {
        return new List(source).addRange(collection).toArray();
    };
    List.prototype.asReadOnly = function () {
        return new List(Object.freeze(this._source.slice()));
    };
    List.prototype.forEach = function (callback) {
        this._source.forEach(callback);
    };
    List.forEach = function (source, callback) {
        new List(source).forEach(callback);
    };
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
    List.prototype.insert = function (index, item) {
        this._source.splice(index, 0, item);
        return this;
    };
    List.insert = function (source, index, item) {
        return new List(source).insert(index, item).toArray();
    };
    List.prototype.insertRange = function (index, collection) {
        var items = (collection instanceof List) ? collection.toArray() : collection;
        Array.prototype.splice.apply(this._source, new Array(index, 0).concat(items));
        return this;
    };
    List.insertRange = function (source, index, collection) {
        return new List(source).insertRange(index, collection).toArray();
    };
    List.prototype.get = function (index) {
        return this._source[index];
    };
    List.prototype.set = function (index, item) {
        if (index > this.length)
            throw new Error("Index was out of range. Must be non-negative and less than the size of the collection.");
        else
            this._source[index] = item;
    };
    List.prototype.remove = function (item) {
        return this.removeAt(this._source.indexOf(item));
    };
    List.remove = function (source, item) {
        return new List(source).remove(item).toArray();
    };
    List.prototype.removeAll = function (predicate) {
        if (!predicate) {
            this._source.splice(0);
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
    List.prototype.removeAt = function (index) {
        this._source.splice(index, 1);
        return this;
    };
    List.removeAt = function (source, index) {
        return new List(source).removeAt(index).toArray();
    };
    List.prototype.removeRange = function (index, count) {
        this._source.splice(index, count + index - 1);
        return this;
    };
    List.removeRange = function (source, index, count) {
        return new List(source).removeRange(index, count).toArray();
    };
    List.prototype.clear = function () {
        this.removeAll();
        return this;
    };
    List.clear = function (source) {
        return new List(source).clear().toArray();
    };
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
    List.prototype.reverse = function (index, count) {
        if ((Util.isUndefined(index) && Util.isUndefined(count)) || (index === 0 && count >= this.length)) {
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
    DatesHelper.prototype.between = function (lower, upper) {
        return DatesHelper.between(this.date, lower, upper);
    };
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
function Numbers(num) { return new NumbersHelper(num); }
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Numbers;
var NumbersHelper = (function () {
    function NumbersHelper(num) {
        this.num = num;
    }
    NumbersHelper.prototype.between = function (lower, upper) {
        return NumbersHelper.between(this.num, lower, upper);
    };
    NumbersHelper.between = function (num, lower, upper) {
        if (util.isUndefined(lower))
            lower = Number.MIN_VALUE;
        if (util.isUndefined(upper))
            upper = Number.MAX_VALUE;
        return (lower <= num && num <= upper);
    };
    NumbersHelper.prototype.in = function (numbers) {
        return NumbersHelper.in(this.num, numbers);
    };
    NumbersHelper.in = function (num, numbers) {
        for (var i = 0; i < numbers.length; i++) {
            if (numbers[i] == num)
                return true;
        }
        return false;
    };
    NumbersHelper.prototype.toFixed = function (precision) {
        return NumbersHelper.toFixed(this.num, precision);
    };
    NumbersHelper.toFixed = function (num, precision) {
        return +(Math.round(+(num.toString() + "e" + precision)).toString() + "e" + -precision);
    };
    return NumbersHelper;
}());
exports.NumbersHelper = NumbersHelper;

},{"../util":18}],8:[function(require,module,exports){
"use strict";
function Strings(str) { return new StringsHelper(str); }
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Strings;
var StringsHelper = (function () {
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
            this._idx = -1;
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
    Linq.prototype.map = function (callback) {
        return new Linq(new map_1.default(this._source, callback));
    };
    Linq.map = function (source, callback) {
        return new Linq(source).map(callback).toArray();
    };
    Linq.prototype.filter = function (predicate) {
        return new Linq(new filter_1.default(this._source, predicate));
    };
    Linq.filter = function (source, predicate) {
        return new Linq(source).filter(predicate).toArray();
    };
    Linq.prototype.where = function (predicate) {
        return this.filter(predicate);
    };
    Linq.where = function (source, predicate) {
        return Linq.filter(source, predicate);
    };
    Linq.prototype.reverse = function () {
        this._source.reverse();
        return this;
    };
    Linq.prototype.take = function (count) {
        return new Linq(new take_1.default(this._source, count));
    };
    Linq.take = function (source, count) {
        return new Linq(source).take(count).toArray();
    };
    Linq.prototype.takeWhile = function (predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(new takeWhile_1.default(this._source, predicate));
    };
    Linq.takeWhile = function (source, predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(source).takeWhile(predicate).toArray();
    };
    Linq.prototype.skip = function (count) {
        return new Linq(new skip_1.default(this._source, count));
    };
    Linq.skip = function (source, count) {
        return new Linq(source).skip(count).toArray();
    };
    Linq.prototype.skipWhile = function (predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(new skipWhile_1.default(this._source, predicate));
    };
    Linq.skipWhile = function (source, predicate) {
        if (predicate === void 0) { predicate = Util.defaultPredicate; }
        return new Linq(source).skipWhile(predicate).toArray();
    };
    Linq.prototype.orderBy = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = this._makeValuePredicate(keySelector);
        return new OrderedLinq(new order_1.default(this._source, selectorFn, comparer, false));
    };
    Linq.orderBy = function (source, keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        return new Linq(source).orderBy(keySelector, comparer).toArray();
    };
    Linq.prototype.orderByDesc = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = this._makeValuePredicate(keySelector);
        return new OrderedLinq(new order_1.default(this._source, selectorFn, comparer, true));
    };
    Linq.orderByDesc = function (source, keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        return new Linq(source).orderByDesc(keySelector, comparer).toArray();
    };
    Linq.prototype.sum = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        var i, sum = 0, arr = this.toArray();
        for (i = 0; i < arr.length; i++) {
            sum += selector(arr[i]);
        }
        return sum;
    };
    Linq.sum = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).sum(selector);
    };
    Linq.prototype.average = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        var i, total = 0, arr = this.toArray();
        for (i = 0; i < arr.length; i++) {
            total += selector(arr[i]);
        }
        return total / arr.length;
    };
    Linq.average = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).average(selector);
    };
    Linq.prototype.min = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Math.min.apply(undefined, this.toArray().map(selector));
    };
    Linq.min = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).min(selector);
    };
    Linq.prototype.max = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Math.max.apply(undefined, this.toArray().map(selector));
    };
    Linq.max = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).max(selector);
    };
    Linq.prototype.any = function (predicate, invert) {
        if (invert === void 0) { invert = false; }
        return typeof this.first(function (x) { return !!predicate(x) !== invert; }) !== "undefined";
    };
    Linq.any = function (source, predicate, invert) {
        if (invert === void 0) { invert = false; }
        return new Linq(source).any(predicate, invert);
    };
    Linq.prototype.all = function (predicate, invert) {
        if (invert === void 0) { invert = false; }
        return !(this.any(predicate, !invert));
    };
    Linq.all = function (source, predicate, invert) {
        if (invert === void 0) { invert = false; }
        return new Linq(source).all(predicate, invert);
    };
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
    Linq.single = function (source, predicate) {
        return new Linq(source).single(predicate);
    };
    Linq.prototype.first = function (predicate) {
        if (predicate === void 0) { predicate = (function () { return true; }); }
        var arr = this.filter(predicate).take(1).toArray();
        if (arr.length == 1)
            return arr[0];
        else
            return undefined;
    };
    Linq.first = function (source, predicate) {
        if (predicate === void 0) { predicate = (function () { return true; }); }
        return new Linq(source).first(predicate);
    };
    Linq.prototype.last = function (predicate) {
        if (predicate === void 0) { predicate = (function () { return true; }); }
        return this.reverse().first(predicate);
    };
    Linq.last = function (source, predicate) {
        if (predicate === void 0) { predicate = (function () { return true; }); }
        return new Linq(source).last(predicate);
    };
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
    Linq.prototype.intersect = function (other) {
        var more = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            more[_i - 1] = arguments[_i];
        }
        return new Linq(Linq.intersect.apply(Linq, [this, other].concat(more)));
    };
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
    Linq.prototype.except = function (other) {
        var more = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            more[_i - 1] = arguments[_i];
        }
        return new Linq(Linq.except.apply(Linq, [this, other].concat(more)));
    };
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
    Linq.prototype.distinct = function () {
        return new Linq(Linq.distinct(this));
    };
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
    Linq.groupBy = function (source, keySelector) {
        return new Linq(source).groupBy(keySelector).toArray();
    };
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
    Linq.prototype.forEach = function (callback) {
        var arr = this.toArray();
        for (var i = 0; i < arr.length; i++) {
            if (callback(arr[i], i) === false)
                return false;
        }
        return true;
    };
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
    OrderedLinq.prototype.thenBy = function (keySelector, comparer) {
        if (comparer === void 0) { comparer = Util.defaultComparer; }
        var selectorFn = this._makeValuePredicate(keySelector);
        var orderIterator = this._source.getIteratorFromPipeline(order_1.default);
        orderIterator.thenBy(selectorFn, comparer, false);
        return this;
    };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMuanMiLCJkaXN0L3NyYy9saW5xLmpzIiwiZGlzdC9zcmMvY29sbGVjdGlvbnMvYmluYXJ5VHJlZS5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL2xpbmtlZExpc3QuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9saXN0LmpzIiwiZGlzdC9zcmMvY29sbGVjdGlvbnMvcXVldWUuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9zdGFjay5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvZGF0ZXMuanMiLCJkaXN0L3NyYy9oZWxwZXJzL251bWJlcnMuanMiLCJkaXN0L3NyYy9oZWxwZXJzL3N0cmluZ3MuanMiLCJkaXN0L3NyYy9saW5xL2ZpbHRlci5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IuanMiLCJkaXN0L3NyYy9saW5xL2xpbnEuanMiLCJkaXN0L3NyYy9saW5xL21hcC5qcyIsImRpc3Qvc3JjL2xpbnEvb3JkZXIuanMiLCJkaXN0L3NyYy9saW5xL3NraXAuanMiLCJkaXN0L3NyYy9saW5xL3NraXBXaGlsZS5qcyIsImRpc3Qvc3JjL2xpbnEvdGFrZS5qcyIsImRpc3Qvc3JjL2xpbnEvdGFrZVdoaWxlLmpzIiwiZGlzdC9zcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBsaXN0XzEgPSByZXF1aXJlKFwiLi9jb2xsZWN0aW9ucy9saXN0XCIpO1xyXG5leHBvcnRzLkxpc3QgPSBsaXN0XzEuZGVmYXVsdDtcclxudmFyIGxpbmtlZExpc3RfMSA9IHJlcXVpcmUoXCIuL2NvbGxlY3Rpb25zL2xpbmtlZExpc3RcIik7XHJcbmV4cG9ydHMuTGlua2VkTGlzdCA9IGxpbmtlZExpc3RfMS5kZWZhdWx0O1xyXG52YXIgc3RhY2tfMSA9IHJlcXVpcmUoXCIuL2NvbGxlY3Rpb25zL3N0YWNrXCIpO1xyXG5leHBvcnRzLlN0YWNrID0gc3RhY2tfMS5kZWZhdWx0O1xyXG52YXIgcXVldWVfMSA9IHJlcXVpcmUoXCIuL2NvbGxlY3Rpb25zL3F1ZXVlXCIpO1xyXG5leHBvcnRzLlF1ZXVlID0gcXVldWVfMS5kZWZhdWx0O1xyXG52YXIgYmluYXJ5VHJlZV8xID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbnMvYmluYXJ5VHJlZVwiKTtcclxuZXhwb3J0cy5CaW5hcnlUcmVlID0gYmluYXJ5VHJlZV8xLmRlZmF1bHQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbGxlY3Rpb25zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgbnVtYmVyc18xID0gcmVxdWlyZShcIi4vaGVscGVycy9udW1iZXJzXCIpO1xyXG5leHBvcnRzLk51bWJlcnMgPSBudW1iZXJzXzEuZGVmYXVsdDtcclxuZXhwb3J0cy5OdW1iZXJzSGVscGVyID0gbnVtYmVyc18xLk51bWJlcnNIZWxwZXI7XHJcbnZhciBzdHJpbmdzXzEgPSByZXF1aXJlKFwiLi9oZWxwZXJzL3N0cmluZ3NcIik7XHJcbmV4cG9ydHMuU3RyaW5ncyA9IHN0cmluZ3NfMS5kZWZhdWx0O1xyXG5leHBvcnRzLlN0cmluZ3NIZWxwZXIgPSBzdHJpbmdzXzEuU3RyaW5nc0hlbHBlcjtcclxudmFyIGRhdGVzXzEgPSByZXF1aXJlKFwiLi9oZWxwZXJzL2RhdGVzXCIpO1xyXG5leHBvcnRzLkRhdGVzID0gZGF0ZXNfMS5kZWZhdWx0O1xyXG5leHBvcnRzLkRhdGVzSGVscGVyID0gZGF0ZXNfMS5EYXRlc0hlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGVscGVycy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9saW5xL2l0ZXJhdG9yXCIpO1xyXG5leHBvcnRzLkl0ZXJhdG9yID0gaXRlcmF0b3JfMS5kZWZhdWx0O1xyXG52YXIgZmlsdGVyXzEgPSByZXF1aXJlKFwiLi9saW5xL2ZpbHRlclwiKTtcclxuZXhwb3J0cy5GaWx0ZXJJdGVyYXRvciA9IGZpbHRlcl8xLmRlZmF1bHQ7XHJcbnZhciBtYXBfMSA9IHJlcXVpcmUoXCIuL2xpbnEvbWFwXCIpO1xyXG5leHBvcnRzLk1hcEl0ZXJhdG9yID0gbWFwXzEuZGVmYXVsdDtcclxudmFyIG9yZGVyXzEgPSByZXF1aXJlKFwiLi9saW5xL29yZGVyXCIpO1xyXG5leHBvcnRzLk9yZGVySXRlcmF0b3IgPSBvcmRlcl8xLmRlZmF1bHQ7XHJcbnZhciBza2lwXzEgPSByZXF1aXJlKFwiLi9saW5xL3NraXBcIik7XHJcbmV4cG9ydHMuU2tpcEl0ZXJhdG9yID0gc2tpcF8xLmRlZmF1bHQ7XHJcbnZhciBza2lwV2hpbGVfMSA9IHJlcXVpcmUoXCIuL2xpbnEvc2tpcFdoaWxlXCIpO1xyXG5leHBvcnRzLlNraXBXaGlsZUl0ZXJhdG9yID0gc2tpcFdoaWxlXzEuZGVmYXVsdDtcclxudmFyIHRha2VfMSA9IHJlcXVpcmUoXCIuL2xpbnEvdGFrZVwiKTtcclxuZXhwb3J0cy5UYWtlSXRlcmF0b3IgPSB0YWtlXzEuZGVmYXVsdDtcclxudmFyIHRha2VXaGlsZV8xID0gcmVxdWlyZShcIi4vbGlucS90YWtlV2hpbGVcIik7XHJcbmV4cG9ydHMuVGFrZVdoaWxlSXRlcmF0b3IgPSB0YWtlV2hpbGVfMS5kZWZhdWx0O1xyXG52YXIgbGlucV8xID0gcmVxdWlyZShcIi4vbGlucS9saW5xXCIpO1xyXG5leHBvcnRzLkxpbnEgPSBsaW5xXzEuZGVmYXVsdDtcclxuZXhwb3J0cy5MUSA9IGxpbnFfMS5MUTtcclxuZXhwb3J0cy5PcmRlcmVkTGlucSA9IGxpbnFfMS5PcmRlcmVkTGlucTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlucS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIHF1ZXVlXzEgPSByZXF1aXJlKFwiLi9xdWV1ZVwiKTtcclxudmFyIEJpbmFyeVRyZWUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQmluYXJ5VHJlZShjb21wYXJlRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fY29tcGFyZSA9IGNvbXBhcmVGdW5jdGlvbiB8fCBVdGlsLmRlZmF1bHRDb21wYXJlcjtcclxuICAgIH1cclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiB0aGlzLmluc2VydEF1eCh0aGlzLl9yb290LCBuZXcgVHJlZU5vZGUoaXRlbSkpOyB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuaW5zZXJ0UmFuZ2UgPSBmdW5jdGlvbiAoaXRlbXMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHsgX3RoaXMuaW5zZXJ0KGl0ZW0pOyB9KTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbnNlcnRBdXggPSBmdW5jdGlvbiAodHJlZSwgbm9kZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9yb290ID0gbm9kZTtcclxuICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb21wID0gdGhpcy5fY29tcGFyZShub2RlLnZhbHVlLCB0cmVlLnZhbHVlKTtcclxuICAgICAgICBpZiAoY29tcCA8IDApIHtcclxuICAgICAgICAgICAgaWYgKHRyZWUubGVmdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRBdXgodHJlZS5sZWZ0LCBub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyZWUubGVmdCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHRyZWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb21wID4gMCkge1xyXG4gICAgICAgICAgICBpZiAodHJlZS5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRBdXgodHJlZS5yaWdodCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlLnJpZ2h0ID0gbm9kZTtcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdHJlZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fc2VhcmNoKHRoaXMuX3Jvb3QsIGl0ZW0pO1xyXG4gICAgICAgIGlmIChub2RlICYmIG5vZGUuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnZhbHVlIDwgbm9kZS5wYXJlbnQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnQubGVmdDtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIG5vZGUucGFyZW50LnJpZ2h0O1xyXG4gICAgICAgICAgICBkZWxldGUgbm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gbm9kZTtcclxuICAgICAgICAgICAgd2hpbGUgKHJpZ2h0LnJpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0LnJpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyaWdodC5sZWZ0KSB7XHJcbiAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0LmxlZnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocmlnaHQudmFsdWUgIT09IG5vZGUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByaWdodC5sZWZ0ID0gcmlnaHQucGFyZW50LmxlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQubGVmdC5wYXJlbnQgPSByaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmlnaHQucGFyZW50LnZhbHVlID09PSBub2RlLnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0LnBhcmVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByaWdodC5wYXJlbnQgPSBub2RlLnBhcmVudDtcclxuICAgICAgICAgICAgbm9kZS5sZWZ0ID0gbm9kZS5yaWdodCA9IG5vZGUucGFyZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gdGhpcy5fcm9vdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdCA9IHJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3Jvb3QucGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fc2VhcmNoKHRoaXMuX3Jvb3QsIGl0ZW0pO1xyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWwoY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkgeyBhcnIucHVzaChpdGVtKTsgfSk7XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5wcmVvcmRlclRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykgeyB0aGlzLnByZW9yZGVyVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucHJlb3JkZXJUcmF2ZXJzYWxBdXggPSBmdW5jdGlvbiAodHJlZSwgY2FsbGJhY2ssIHNpZ25hbCkge1xyXG4gICAgICAgIGlmICghdHJlZSB8fCBzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHNpZ25hbC5zdG9wID0gKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wcmVvcmRlclRyYXZlcnNhbEF1eCh0cmVlLmxlZnQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5yaWdodCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuaW5vcmRlclRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykgeyB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodGhpcy5fcm9vdCwgY2FsbGJhY2ssIHsgc3RvcDogZmFsc2UgfSk7IH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbm9yZGVyVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICBpZiAoIXRyZWUgfHwgc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5sZWZ0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBzaWduYWwuc3RvcCA9IChjYWxsYmFjayh0cmVlLnZhbHVlKSA9PT0gZmFsc2UpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaW5vcmRlclRyYXZlcnNhbEF1eCh0cmVlLnJpZ2h0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5wb3N0b3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5wb3N0b3JkZXJUcmF2ZXJzYWxBdXgodGhpcy5fcm9vdCwgY2FsbGJhY2ssIHsgc3RvcDogZmFsc2UgfSk7IH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5wb3N0b3JkZXJUcmF2ZXJzYWxBdXggPSBmdW5jdGlvbiAodHJlZSwgY2FsbGJhY2ssIHNpZ25hbCkge1xyXG4gICAgICAgIGlmICghdHJlZSB8fCBzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KHRyZWUubGVmdCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wb3N0b3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5yaWdodCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgc2lnbmFsLnN0b3AgPSAoY2FsbGJhY2sodHJlZS52YWx1ZSkgPT09IGZhbHNlKTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5sZXZlbFRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykgeyB0aGlzLmxldmVsVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubGV2ZWxUcmF2ZXJzYWxBdXggPSBmdW5jdGlvbiAodHJlZSwgY2FsbGJhY2ssIHNpZ25hbCkge1xyXG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBxdWV1ZV8xLmRlZmF1bHQoKTtcclxuICAgICAgICBpZiAodHJlZSlcclxuICAgICAgICAgICAgcXVldWUuZW5xdWV1ZSh0cmVlKTtcclxuICAgICAgICB3aGlsZSAoIVV0aWwuaXNVbmRlZmluZWQodHJlZSA9IHF1ZXVlLmRlcXVldWUoKSkpIHtcclxuICAgICAgICAgICAgc2lnbmFsLnN0b3AgPSBzaWduYWwuc3RvcCB8fCAoY2FsbGJhY2sodHJlZS52YWx1ZSkgPT09IGZhbHNlKTtcclxuICAgICAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodHJlZS5sZWZ0KVxyXG4gICAgICAgICAgICAgICAgcXVldWUuZW5xdWV1ZSh0cmVlLmxlZnQpO1xyXG4gICAgICAgICAgICBpZiAodHJlZS5yaWdodClcclxuICAgICAgICAgICAgICAgIHF1ZXVlLmVucXVldWUodHJlZS5yaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWluID0gdGhpcy5taW5BdXgodGhpcy5fcm9vdCk7XHJcbiAgICAgICAgaWYgKG1pbilcclxuICAgICAgICAgICAgcmV0dXJuIG1pbi52YWx1ZTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5taW5BdXggPSBmdW5jdGlvbiAodHJlZSkge1xyXG4gICAgICAgIGlmICh0cmVlLmxlZnQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1pbkF1eCh0cmVlLmxlZnQpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRyZWU7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtYXggPSB0aGlzLm1heEF1eCh0aGlzLl9yb290KTtcclxuICAgICAgICBpZiAobWF4KVxyXG4gICAgICAgICAgICByZXR1cm4gbWF4LnZhbHVlO1xyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLm1heEF1eCA9IGZ1bmN0aW9uICh0cmVlKSB7XHJcbiAgICAgICAgaWYgKHRyZWUucmlnaHQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1heEF1eCh0cmVlLnJpZ2h0KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0cmVlO1xyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmRlcHRoID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5kZXB0aEF1eCh0aGlzLl9yb290KTsgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmRlcHRoQXV4ID0gZnVuY3Rpb24gKHRyZWUpIHtcclxuICAgICAgICBpZiAoIXRyZWUpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5kZXB0aEF1eCh0cmVlLmxlZnQpLCB0aGlzLmRlcHRoQXV4KHRyZWUucmlnaHQpKSArIDE7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuX3NlYXJjaCA9IGZ1bmN0aW9uICh0cmVlLCBpdGVtKSB7XHJcbiAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQodHJlZSkpXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIGNvbXAgPSB0aGlzLl9jb21wYXJlKGl0ZW0sIHRyZWUudmFsdWUpO1xyXG4gICAgICAgIGlmIChjb21wIDwgMCkge1xyXG4gICAgICAgICAgICB0cmVlID0gdGhpcy5fc2VhcmNoKHRyZWUubGVmdCwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNvbXAgPiAwKSB7XHJcbiAgICAgICAgICAgIHRyZWUgPSB0aGlzLl9zZWFyY2godHJlZS5yaWdodCwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cmVlO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBCaW5hcnlUcmVlO1xyXG59KCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEJpbmFyeVRyZWU7XHJcbnZhciBUcmVlTm9kZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBUcmVlTm9kZSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIFRyZWVOb2RlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gIXRoaXMubGVmdCAmJiAhdGhpcy5yaWdodDsgfTtcclxuICAgIHJldHVybiBUcmVlTm9kZTtcclxufSgpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmluYXJ5VHJlZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIExpbmtlZExpc3QgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGlua2VkTGlzdCgpIHtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5fZ2V0Tm9kZSA9IGZ1bmN0aW9uIChhdCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBlbHNlIGlmIChhdCA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmlyc3Q7XHJcbiAgICAgICAgZWxzZSBpZiAoYXQgPiB0aGlzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3Q7XHJcbiAgICAgICAgdmFyIGksIGl0ZW07XHJcbiAgICAgICAgaWYgKGF0IDwgdGhpcy5sZW5ndGggLyAyKSB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSB0aGlzLl9maXJzdDtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGF0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtLm5leHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSB0aGlzLl9sYXN0O1xyXG4gICAgICAgICAgICBmb3IgKGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPiBhdDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gaXRlbS5wcmV2O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfTtcclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChhdCkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fZ2V0Tm9kZShhdCk7XHJcbiAgICAgICAgaWYgKG5vZGUpXHJcbiAgICAgICAgICAgIHJldHVybiBub2RlLnZhbDtcclxuICAgIH07XHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSBuZXcgTGlua2VkTGlzdE5vZGUodmFsKTtcclxuICAgICAgICBpZiAoIXRoaXMuX2ZpcnN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0ID0gdGhpcy5fbGFzdCA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpdGVtLnByZXYgPSB0aGlzLl9sYXN0O1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0Lm5leHQgPSBpdGVtO1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0ID0gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICsrdGhpcy5sZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuaW5zZXJ0QXQgPSBmdW5jdGlvbiAoYXQsIHZhbCkge1xyXG4gICAgICAgIGlmIChhdCA+PSB0aGlzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0KHZhbCk7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSBuZXcgTGlua2VkTGlzdE5vZGUodmFsKSwgbmV4dCA9IHRoaXMuX2dldE5vZGUoYXQpLCBwcmV2ID0gbmV4dC5wcmV2O1xyXG4gICAgICAgIGlmIChwcmV2KVxyXG4gICAgICAgICAgICBwcmV2Lm5leHQgPSBpdGVtO1xyXG4gICAgICAgIG5leHQucHJldiA9IGl0ZW07XHJcbiAgICAgICAgaXRlbS5wcmV2ID0gcHJldjtcclxuICAgICAgICBpdGVtLm5leHQgPSBuZXh0O1xyXG4gICAgICAgIGlmIChhdCA9PT0gMClcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSBpdGVtO1xyXG4gICAgICAgIHJldHVybiArK3RoaXMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLnJlbW92ZUF0ID0gZnVuY3Rpb24gKGF0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2dldE5vZGUoYXQpO1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9maXJzdCA9IHRoaXMuX2xhc3QgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGl0ZW0gPT09IHRoaXMuX2ZpcnN0KSB7XHJcbiAgICAgICAgICAgIGl0ZW0ubmV4dC5wcmV2ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9maXJzdCA9IGl0ZW0ubmV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaXRlbSA9PT0gdGhpcy5fbGFzdCkge1xyXG4gICAgICAgICAgICBpdGVtLm5leHQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGl0ZW0ucHJldi5uZXh0ID0gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucHJldi5uZXh0ID0gaXRlbS5uZXh0O1xyXG4gICAgICAgICAgICBpdGVtLm5leHQucHJldiA9IGl0ZW0ucHJldjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0tdGhpcy5sZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLl9sYXN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlua2VkTGlzdDtcclxufSgpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBMaW5rZWRMaXN0O1xyXG52YXIgTGlua2VkTGlzdE5vZGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGlua2VkTGlzdE5vZGUodmFsKSB7XHJcbiAgICAgICAgdGhpcy52YWwgPSB2YWw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gTGlua2VkTGlzdE5vZGU7XHJcbn0oKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmtlZExpc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBMaXN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpc3Qoc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlIHx8IFtdO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KExpc3QucHJvdG90eXBlLCBcImxlbmd0aFwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9zb3VyY2UubGVuZ3RoOyB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIExpc3QucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QuYWRkID0gZnVuY3Rpb24gKHNvdXJjZSwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmFkZChpdGVtKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuYWRkUmFuZ2UgPSBmdW5jdGlvbiAoY29sbGVjdGlvbikge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IChjb2xsZWN0aW9uIGluc3RhbmNlb2YgTGlzdCkgPyBjb2xsZWN0aW9uLnRvQXJyYXkoKSA6IGNvbGxlY3Rpb247XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5fc291cmNlLCBpdGVtcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5hZGRSYW5nZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGNvbGxlY3Rpb24pIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5hZGRSYW5nZShjb2xsZWN0aW9uKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuYXNSZWFkT25seSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3QoT2JqZWN0LmZyZWV6ZSh0aGlzLl9zb3VyY2Uuc2xpY2UoKSkpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UuZm9yRWFjaChjYWxsYmFjayk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5mb3JFYWNoID0gZnVuY3Rpb24gKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBuZXcgTGlzdChzb3VyY2UpLmZvckVhY2goY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiAoaXRlbSwgaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSB2b2lkIDApIHsgaW5kZXggPSAwOyB9XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSB0aGlzLmxlbmd0aDsgfVxyXG4gICAgICAgIHZhciBpZHggPSB0aGlzLl9zb3VyY2UuaW5kZXhPZihpdGVtLCBpbmRleCk7XHJcbiAgICAgICAgaWYgKGlkeCA+IGNvdW50IC0gaW5kZXggKyAxKVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgcmV0dXJuIGlkeDtcclxuICAgIH07XHJcbiAgICBMaXN0LmluZGV4T2YgPSBmdW5jdGlvbiAoc291cmNlLCBpdGVtLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHZvaWQgMCkgeyBpbmRleCA9IDA7IH1cclxuICAgICAgICBpZiAoY291bnQgPT09IHZvaWQgMCkgeyBjb3VudCA9IHNvdXJjZS5sZW5ndGg7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5pbmRleE9mKGl0ZW0sIGluZGV4LCBjb3VudCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiAoaXRlbSwgaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSB2b2lkIDApIHsgaW5kZXggPSB0aGlzLmxlbmd0aCAtIDE7IH1cclxuICAgICAgICBpZiAoY291bnQgPT09IHZvaWQgMCkgeyBjb3VudCA9IHRoaXMubGVuZ3RoOyB9XHJcbiAgICAgICAgdmFyIGlkeCA9IHRoaXMuX3NvdXJjZS5sYXN0SW5kZXhPZihpdGVtLCBpbmRleCk7XHJcbiAgICAgICAgaWYgKGlkeCA8IGluZGV4ICsgMSAtIGNvdW50KVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgcmV0dXJuIGlkeDtcclxuICAgIH07XHJcbiAgICBMaXN0Lmxhc3RJbmRleE9mID0gZnVuY3Rpb24gKHNvdXJjZSwgaXRlbSwgaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSB2b2lkIDApIHsgaW5kZXggPSB0aGlzLmxlbmd0aCAtIDE7IH1cclxuICAgICAgICBpZiAoY291bnQgPT09IHZvaWQgMCkgeyBjb3VudCA9IHRoaXMubGVuZ3RoOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkubGFzdEluZGV4T2YoaXRlbSwgaW5kZXgsIGNvdW50KTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0Lmluc2VydCA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuaW5zZXJ0KGluZGV4LCBpdGVtKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuaW5zZXJ0UmFuZ2UgPSBmdW5jdGlvbiAoaW5kZXgsIGNvbGxlY3Rpb24pIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSAoY29sbGVjdGlvbiBpbnN0YW5jZW9mIExpc3QpID8gY29sbGVjdGlvbi50b0FycmF5KCkgOiBjb2xsZWN0aW9uO1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkodGhpcy5fc291cmNlLCBuZXcgQXJyYXkoaW5kZXgsIDApLmNvbmNhdChpdGVtcykpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QuaW5zZXJ0UmFuZ2UgPSBmdW5jdGlvbiAoc291cmNlLCBpbmRleCwgY29sbGVjdGlvbikge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmluc2VydFJhbmdlKGluZGV4LCBjb2xsZWN0aW9uKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZVtpbmRleF07XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gdGhpcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluZGV4IHdhcyBvdXQgb2YgcmFuZ2UuIE11c3QgYmUgbm9uLW5lZ2F0aXZlIGFuZCBsZXNzIHRoYW4gdGhlIHNpemUgb2YgdGhlIGNvbGxlY3Rpb24uXCIpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlW2luZGV4XSA9IGl0ZW07XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVBdCh0aGlzLl9zb3VyY2UuaW5kZXhPZihpdGVtKSk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZW1vdmUgPSBmdW5jdGlvbiAoc291cmNlLCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlKGl0ZW0pLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5yZW1vdmVBbGwgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKCFwcmVkaWNhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZSgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gdm9pZCAwO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWRpY2F0ZSh0aGlzLl9zb3VyY2VbaV0sIGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZW1vdmVBbGwgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZW1vdmVBbGwocHJlZGljYXRlKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmVtb3ZlQXQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnJlbW92ZUF0ID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZW1vdmVBdChpbmRleCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZVJhbmdlID0gZnVuY3Rpb24gKGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5zcGxpY2UoaW5kZXgsIGNvdW50ICsgaW5kZXggLSAxKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnJlbW92ZVJhbmdlID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlUmFuZ2UoaW5kZXgsIGNvdW50KS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBbGwoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LmNsZWFyID0gZnVuY3Rpb24gKHNvdXJjZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmNsZWFyKCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmICghcHJlZGljYXRlKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlLmxlbmd0aDtcclxuICAgICAgICB2YXIgc3VtID0gMDtcclxuICAgICAgICB0aGlzLl9zb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgc3VtKys7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgIH07XHJcbiAgICBMaXN0LmNvdW50ID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuY291bnQocHJlZGljYXRlKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24gKGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmICgoVXRpbC5pc1VuZGVmaW5lZChpbmRleCkgJiYgVXRpbC5pc1VuZGVmaW5lZChjb3VudCkpIHx8IChpbmRleCA9PT0gMCAmJiBjb3VudCA+PSB0aGlzLmxlbmd0aCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlLnJldmVyc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChVdGlsLmlzVW5kZWZpbmVkKGNvdW50KSlcclxuICAgICAgICAgICAgICAgIGNvdW50ID0gdGhpcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLl9zb3VyY2Uuc3BsaWNlKGluZGV4LCBjb3VudCArIGluZGV4IC0gMSk7XHJcbiAgICAgICAgICAgIGFyci5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0UmFuZ2UoaW5kZXgsIGFycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QucmV2ZXJzZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLnJldmVyc2UoaW5kZXgsIGNvdW50KS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yYW5nZSA9IGZ1bmN0aW9uIChzdGFydCwgY291bnQpIHtcclxuICAgICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgc3RhcnQgKyBjb3VudDsgaSsrKVxyXG4gICAgICAgICAgICBhcnIucHVzaChpKTtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3QoYXJyKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlzdDtcclxufSgpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBMaXN0O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saXN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgbGlua2VkTGlzdF8xID0gcmVxdWlyZShcIi4vbGlua2VkTGlzdFwiKTtcclxudmFyIFF1ZXVlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFF1ZXVlKCkge1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9saXN0ID0gbmV3IGxpbmtlZExpc3RfMS5kZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgICBRdWV1ZS5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9saXN0Lmluc2VydCh2YWwpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxlbmd0aCA9IHRoaXMuX2xpc3QubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIFF1ZXVlLnByb3RvdHlwZS5kZXF1ZXVlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5fbGlzdC5nZXQoMCk7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLl9saXN0LnJlbW92ZUF0KDApO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBRdWV1ZTtcclxufSgpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBRdWV1ZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cXVldWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBsaW5rZWRMaXN0XzEgPSByZXF1aXJlKFwiLi9saW5rZWRMaXN0XCIpO1xyXG52YXIgU3RhY2sgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gU3RhY2soKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IG5ldyBsaW5rZWRMaXN0XzEuZGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgU3RhY2sucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5pbnNlcnRBdCgwLCB2YWwpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxlbmd0aCA9IHRoaXMuX2xpc3QubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIFN0YWNrLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLnBlZWsoKTtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuX2xpc3QucmVtb3ZlQXQoMCk7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9O1xyXG4gICAgU3RhY2sucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3QuZ2V0KDApO1xyXG4gICAgfTtcclxuICAgIFN0YWNrLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9saXN0LmNsZWFyKCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFN0YWNrO1xyXG59KCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFN0YWNrO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdGFjay5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxuZnVuY3Rpb24gRGF0ZXMoZGF0ZSkgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpOyB9XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRGF0ZXM7XHJcbnZhciBEYXRlc0hlbHBlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBEYXRlc0hlbHBlcihkYXRlKSB7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZTtcclxuICAgIH1cclxuICAgIERhdGVzSGVscGVyLnRvRGF0ZSA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoZGF0ZSkpXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGlmICh1dGlsLmlzU3RyaW5nKGRhdGUpKVxyXG4gICAgICAgICAgICBkYXRlID0gRGF0ZS5wYXJzZShkYXRlKTtcclxuICAgICAgICBpZiAodXRpbC5pc051bWJlcihkYXRlKSlcclxuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5iZXR3ZWVuID0gZnVuY3Rpb24gKGxvd2VyLCB1cHBlcikge1xyXG4gICAgICAgIHJldHVybiBEYXRlc0hlbHBlci5iZXR3ZWVuKHRoaXMuZGF0ZSwgbG93ZXIsIHVwcGVyKTtcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5iZXR3ZWVuID0gZnVuY3Rpb24gKGRhdGUsIGxvd2VyLCB1cHBlcikge1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGxvd2VyKSlcclxuICAgICAgICAgICAgbG93ZXIgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKHVwcGVyKSlcclxuICAgICAgICAgICAgdXBwZXIgPSBuZXcgRGF0ZSg5OTk5OTk5OTk5OTk5KTtcclxuICAgICAgICByZXR1cm4gKGxvd2VyIDw9IGRhdGUgJiYgZGF0ZSA8PSB1cHBlcik7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZFllYXJzID0gZnVuY3Rpb24gKHllYXJzKSB7IHJldHVybiB0aGlzLmFkZE1vbnRocyh5ZWFycyAqIDEyKTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRNb250aHMgPSBmdW5jdGlvbiAobW9udGhzKSB7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNldE1vbnRoKHRoaXMuZGF0ZS5nZXRNb250aCgpICsgbW9udGhzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkV2Vla3MgPSBmdW5jdGlvbiAod2VlaykgeyByZXR1cm4gdGhpcy5hZGREYXlzKHdlZWsgKiA3KTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGREYXlzID0gZnVuY3Rpb24gKGRheXMpIHsgcmV0dXJuIHRoaXMuYWRkSG91cnMoZGF5cyAqIDI0KTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRIb3VycyA9IGZ1bmN0aW9uIChob3VycykgeyByZXR1cm4gdGhpcy5hZGRNaW51dGVzKGhvdXJzICogNjApOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZE1pbnV0ZXMgPSBmdW5jdGlvbiAobWludXRlcykgeyByZXR1cm4gdGhpcy5hZGRTZWNvbmRzKG1pbnV0ZXMgKiA2MCk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkU2Vjb25kcyA9IGZ1bmN0aW9uIChzZWNvbmRzKSB7IHJldHVybiB0aGlzLmFkZE1pbGxpc2Vjb25kcyhzZWNvbmRzICogMTAwMCk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkTWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKG1pbGxpc2Vjb25kcykge1xyXG4gICAgICAgIHRoaXMuZGF0ZS5zZXRNaWxsaXNlY29uZHModGhpcy5kYXRlLmdldE1pbGxpc2Vjb25kcygpICsgbWlsbGlzZWNvbmRzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRZZWFycyA9IGZ1bmN0aW9uIChkYXRlLCB5ZWFycykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZFllYXJzKHllYXJzKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkTW9udGhzID0gZnVuY3Rpb24gKGRhdGUsIG1vbnRocykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZE1vbnRocyhtb250aHMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRXZWVrcyA9IGZ1bmN0aW9uIChkYXRlLCB3ZWVrKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkV2Vla3Mod2VlaykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZERheXMgPSBmdW5jdGlvbiAoZGF0ZSwgZGF5cykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZERheXMoZGF5cykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZEhvdXJzID0gZnVuY3Rpb24gKGRhdGUsIGhvdXJzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkSG91cnMoaG91cnMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRNaW51dGVzID0gZnVuY3Rpb24gKGRhdGUsIG1pbnV0ZXMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRNaW51dGVzKG1pbnV0ZXMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRTZWNvbmRzID0gZnVuY3Rpb24gKGRhdGUsIHNlY29uZHMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRTZWNvbmRzKHNlY29uZHMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRNaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAoZGF0ZSwgbWlsbGlzZWNvbmRzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkTWlsbGlzZWNvbmRzKG1pbGxpc2Vjb25kcykuZGF0ZTsgfTtcclxuICAgIHJldHVybiBEYXRlc0hlbHBlcjtcclxufSgpKTtcclxuZXhwb3J0cy5EYXRlc0hlbHBlciA9IERhdGVzSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRlcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxuZnVuY3Rpb24gTnVtYmVycyhudW0pIHsgcmV0dXJuIG5ldyBOdW1iZXJzSGVscGVyKG51bSk7IH1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBOdW1iZXJzO1xyXG52YXIgTnVtYmVyc0hlbHBlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBOdW1iZXJzSGVscGVyKG51bSkge1xyXG4gICAgICAgIHRoaXMubnVtID0gbnVtO1xyXG4gICAgfVxyXG4gICAgTnVtYmVyc0hlbHBlci5wcm90b3R5cGUuYmV0d2VlbiA9IGZ1bmN0aW9uIChsb3dlciwgdXBwZXIpIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyc0hlbHBlci5iZXR3ZWVuKHRoaXMubnVtLCBsb3dlciwgdXBwZXIpO1xyXG4gICAgfTtcclxuICAgIE51bWJlcnNIZWxwZXIuYmV0d2VlbiA9IGZ1bmN0aW9uIChudW0sIGxvd2VyLCB1cHBlcikge1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGxvd2VyKSlcclxuICAgICAgICAgICAgbG93ZXIgPSBOdW1iZXIuTUlOX1ZBTFVFO1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKHVwcGVyKSlcclxuICAgICAgICAgICAgdXBwZXIgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgICAgIHJldHVybiAobG93ZXIgPD0gbnVtICYmIG51bSA8PSB1cHBlcik7XHJcbiAgICB9O1xyXG4gICAgTnVtYmVyc0hlbHBlci5wcm90b3R5cGUuaW4gPSBmdW5jdGlvbiAobnVtYmVycykge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXJzSGVscGVyLmluKHRoaXMubnVtLCBudW1iZXJzKTtcclxuICAgIH07XHJcbiAgICBOdW1iZXJzSGVscGVyLmluID0gZnVuY3Rpb24gKG51bSwgbnVtYmVycykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtYmVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobnVtYmVyc1tpXSA9PSBudW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIE51bWJlcnNIZWxwZXIucHJvdG90eXBlLnRvRml4ZWQgPSBmdW5jdGlvbiAocHJlY2lzaW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcnNIZWxwZXIudG9GaXhlZCh0aGlzLm51bSwgcHJlY2lzaW9uKTtcclxuICAgIH07XHJcbiAgICBOdW1iZXJzSGVscGVyLnRvRml4ZWQgPSBmdW5jdGlvbiAobnVtLCBwcmVjaXNpb24pIHtcclxuICAgICAgICByZXR1cm4gKyhNYXRoLnJvdW5kKCsobnVtLnRvU3RyaW5nKCkgKyBcImVcIiArIHByZWNpc2lvbikpLnRvU3RyaW5nKCkgKyBcImVcIiArIC1wcmVjaXNpb24pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBOdW1iZXJzSGVscGVyO1xyXG59KCkpO1xyXG5leHBvcnRzLk51bWJlcnNIZWxwZXIgPSBOdW1iZXJzSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1udW1iZXJzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBTdHJpbmdzKHN0cikgeyByZXR1cm4gbmV3IFN0cmluZ3NIZWxwZXIoc3RyKTsgfVxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFN0cmluZ3M7XHJcbnZhciBTdHJpbmdzSGVscGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFN0cmluZ3NIZWxwZXIoc3RyKSB7XHJcbiAgICAgICAgdGhpcy5zdHIgPSBzdHI7XHJcbiAgICB9XHJcbiAgICBTdHJpbmdzSGVscGVyLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBhcmdzW19pIC0gMF0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gU3RyaW5nc0hlbHBlci5mb3JtYXQuYXBwbHkodW5kZWZpbmVkLCBbdGhpcy5zdHJdLmNvbmNhdChhcmdzKSk7XHJcbiAgICB9O1xyXG4gICAgU3RyaW5nc0hlbHBlci5mb3JtYXQgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIlxcXFx7XCIgKyBpICsgXCJcXFxcfVwiLCBcImdcIik7XHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHJlZ2V4LCBhcmdzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU3RyaW5nc0hlbHBlcjtcclxufSgpKTtcclxuZXhwb3J0cy5TdHJpbmdzSGVscGVyID0gU3RyaW5nc0hlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RyaW5ncy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIEZpbHRlckl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhGaWx0ZXJJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEZpbHRlckl0ZXJhdG9yKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoY2FsbGJhY2sgPT09IHZvaWQgMCkgeyBjYWxsYmFjayA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIH1cclxuICAgIEZpbHRlckl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgaXRlbSA9IHRoaXMuX25leHQoKTtcclxuICAgICAgICAgICAgaWYgKFV0aWwuaXNVbmRlZmluZWQoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKGl0ZW0sIHRoaXMuX2lkeCkpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9IHdoaWxlICghVXRpbC5pc1VuZGVmaW5lZChpdGVtKSk7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEZpbHRlckl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEZpbHRlckl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBJdGVyYXRvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBJdGVyYXRvcihzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLl9pZHggPSAtMTtcclxuICAgICAgICB0aGlzLl9idWZmZXJzID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcmV2ZXJzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICB9XHJcbiAgICBJdGVyYXRvci5wcm90b3R5cGUuZ2V0SXRlcmF0b3JGcm9tUGlwZWxpbmUgPSBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgdHlwZSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXM7XHJcbiAgICAgICAgd2hpbGUgKCEoKHNvdXJjZSA9IHNvdXJjZS5fc291cmNlKSBpbnN0YW5jZW9mIHR5cGUpKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzb3VyY2U7XHJcbiAgICB9O1xyXG4gICAgSXRlcmF0b3IucHJvdG90eXBlLl9uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBuID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmICh0aGlzLl9zb3VyY2UgaW5zdGFuY2VvZiBJdGVyYXRvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc291cmNlLm5leHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZXZlcnNlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lkeCA8IHRoaXMuX3NvdXJjZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBuID0gdGhpcy5fc291cmNlW3RoaXMuX3NvdXJjZS5sZW5ndGggLSAxIC0gKCsrdGhpcy5faWR4KV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faWR4IDwgdGhpcy5fc291cmNlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG4gPSB0aGlzLl9zb3VyY2VbKyt0aGlzLl9pZHhdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9pZHggPT0gdGhpcy5fc291cmNlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pZHggPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9O1xyXG4gICAgSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7IH07XHJcbiAgICBJdGVyYXRvci5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fcmV2ZXJzZWQgPSAhdGhpcy5fcmV2ZXJzZWQ7IH07XHJcbiAgICByZXR1cm4gSXRlcmF0b3I7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWl0ZXJhdG9yLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgZmlsdGVyXzEgPSByZXF1aXJlKFwiLi9maWx0ZXJcIik7XHJcbnZhciBtYXBfMSA9IHJlcXVpcmUoXCIuL21hcFwiKTtcclxudmFyIG9yZGVyXzEgPSByZXF1aXJlKFwiLi9vcmRlclwiKTtcclxudmFyIHNraXBfMSA9IHJlcXVpcmUoXCIuL3NraXBcIik7XHJcbnZhciBza2lwV2hpbGVfMSA9IHJlcXVpcmUoXCIuL3NraXBXaGlsZVwiKTtcclxudmFyIHRha2VfMSA9IHJlcXVpcmUoXCIuL3Rha2VcIik7XHJcbnZhciB0YWtlV2hpbGVfMSA9IHJlcXVpcmUoXCIuL3Rha2VXaGlsZVwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIExpbnEgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTGlucShzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSAoc291cmNlIGluc3RhbmNlb2YgaXRlcmF0b3JfMS5kZWZhdWx0KVxyXG4gICAgICAgICAgICA/IHNvdXJjZVxyXG4gICAgICAgICAgICA6IG5ldyBtYXBfMS5kZWZhdWx0KHNvdXJjZSwgZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGl0ZW07IH0pO1xyXG4gICAgfVxyXG4gICAgTGlucS5wcm90b3R5cGUuX21ha2VWYWx1ZVByZWRpY2F0ZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAoVXRpbC5pc1N0cmluZyhwcmVkaWNhdGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWVsZF8xID0gcHJlZGljYXRlO1xyXG4gICAgICAgICAgICBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHhbZmllbGRfMV07IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChVdGlsLmlzVW5kZWZpbmVkKHByZWRpY2F0ZSkpIHtcclxuICAgICAgICAgICAgcHJlZGljYXRlID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJlZGljYXRlO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLl9tYWtlQm9vbFByZWRpY2F0ZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAoVXRpbC5pc1N0cmluZyhwcmVkaWNhdGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWVsZF8yID0gcHJlZGljYXRlO1xyXG4gICAgICAgICAgICBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHhbZmllbGRfMl0gPT09IHRydWU7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChVdGlsLmlzVW5kZWZpbmVkKHByZWRpY2F0ZSkpIHtcclxuICAgICAgICAgICAgcHJlZGljYXRlID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJlZGljYXRlO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShuZXcgbWFwXzEuZGVmYXVsdCh0aGlzLl9zb3VyY2UsIGNhbGxiYWNrKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5tYXAgPSBmdW5jdGlvbiAoc291cmNlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLm1hcChjYWxsYmFjaykudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IGZpbHRlcl8xLmRlZmF1bHQodGhpcy5fc291cmNlLCBwcmVkaWNhdGUpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLmZpbHRlciA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLmZpbHRlcihwcmVkaWNhdGUpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS53aGVyZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXIocHJlZGljYXRlKTtcclxuICAgIH07XHJcbiAgICBMaW5xLndoZXJlID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIExpbnEuZmlsdGVyKHNvdXJjZSwgcHJlZGljYXRlKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZS5yZXZlcnNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUudGFrZSA9IGZ1bmN0aW9uIChjb3VudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShuZXcgdGFrZV8xLmRlZmF1bHQodGhpcy5fc291cmNlLCBjb3VudCkpO1xyXG4gICAgfTtcclxuICAgIExpbnEudGFrZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkudGFrZShjb3VudCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLnRha2VXaGlsZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyB0YWtlV2hpbGVfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgcHJlZGljYXRlKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS50YWtlV2hpbGUgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkudGFrZVdoaWxlKHByZWRpY2F0ZSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLnNraXAgPSBmdW5jdGlvbiAoY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IHNraXBfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgY291bnQpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnNraXAgPSBmdW5jdGlvbiAoc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnNraXAoY291bnQpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5za2lwV2hpbGUgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShuZXcgc2tpcFdoaWxlXzEuZGVmYXVsdCh0aGlzLl9zb3VyY2UsIHByZWRpY2F0ZSkpO1xyXG4gICAgfTtcclxuICAgIExpbnEuc2tpcFdoaWxlID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnNraXBXaGlsZShwcmVkaWNhdGUpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5vcmRlckJ5ID0gZnVuY3Rpb24gKGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICB2YXIgc2VsZWN0b3JGbiA9IHRoaXMuX21ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3Rvcik7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBPcmRlcmVkTGlucShuZXcgb3JkZXJfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgc2VsZWN0b3JGbiwgY29tcGFyZXIsIGZhbHNlKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5vcmRlckJ5ID0gZnVuY3Rpb24gKHNvdXJjZSwga2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLm9yZGVyQnkoa2V5U2VsZWN0b3IsIGNvbXBhcmVyKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUub3JkZXJCeURlc2MgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIHZhciBzZWxlY3RvckZuID0gdGhpcy5fbWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKTtcclxuICAgICAgICByZXR1cm4gbmV3IE9yZGVyZWRMaW5xKG5ldyBvcmRlcl8xLmRlZmF1bHQodGhpcy5fc291cmNlLCBzZWxlY3RvckZuLCBjb21wYXJlciwgdHJ1ZSkpO1xyXG4gICAgfTtcclxuICAgIExpbnEub3JkZXJCeURlc2MgPSBmdW5jdGlvbiAoc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkub3JkZXJCeURlc2Moa2V5U2VsZWN0b3IsIGNvbXBhcmVyKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuc3VtID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHZhciBpLCBzdW0gPSAwLCBhcnIgPSB0aGlzLnRvQXJyYXkoKTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHN1bSArPSBzZWxlY3RvcihhcnJbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3VtO1xyXG4gICAgfTtcclxuICAgIExpbnEuc3VtID0gZnVuY3Rpb24gKHNvdXJjZSwgc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuc3VtKHNlbGVjdG9yKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5hdmVyYWdlID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHZhciBpLCB0b3RhbCA9IDAsIGFyciA9IHRoaXMudG9BcnJheSgpO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdG90YWwgKz0gc2VsZWN0b3IoYXJyW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvdGFsIC8gYXJyLmxlbmd0aDtcclxuICAgIH07XHJcbiAgICBMaW5xLmF2ZXJhZ2UgPSBmdW5jdGlvbiAoc291cmNlLCBzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5hdmVyYWdlKHNlbGVjdG9yKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluLmFwcGx5KHVuZGVmaW5lZCwgdGhpcy50b0FycmF5KCkubWFwKHNlbGVjdG9yKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5taW4gPSBmdW5jdGlvbiAoc291cmNlLCBzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5taW4oc2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkodW5kZWZpbmVkLCB0aGlzLnRvQXJyYXkoKS5tYXAoc2VsZWN0b3IpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLm1heCA9IGZ1bmN0aW9uIChzb3VyY2UsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLm1heChzZWxlY3Rvcik7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuYW55ID0gZnVuY3Rpb24gKHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICAgICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmZpcnN0KGZ1bmN0aW9uICh4KSB7IHJldHVybiAhIXByZWRpY2F0ZSh4KSAhPT0gaW52ZXJ0OyB9KSAhPT0gXCJ1bmRlZmluZWRcIjtcclxuICAgIH07XHJcbiAgICBMaW5xLmFueSA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICAgICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuYW55KHByZWRpY2F0ZSwgaW52ZXJ0KTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5hbGwgPSBmdW5jdGlvbiAocHJlZGljYXRlLCBpbnZlcnQpIHtcclxuICAgICAgICBpZiAoaW52ZXJ0ID09PSB2b2lkIDApIHsgaW52ZXJ0ID0gZmFsc2U7IH1cclxuICAgICAgICByZXR1cm4gISh0aGlzLmFueShwcmVkaWNhdGUsICFpbnZlcnQpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLmFsbCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICAgICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuYWxsKHByZWRpY2F0ZSwgaW52ZXJ0KTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5zaW5nbGUgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IHRoaXMuZmlsdGVyKHByZWRpY2F0ZSkudGFrZSgyKS50b0FycmF5KCk7XHJcbiAgICAgICAgaWYgKGFyci5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHNlcXVlbmNlIGlzIGVtcHR5LlwiKTtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PSAyKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaW5wdXQgc2VxdWVuY2UgY29udGFpbnMgbW9yZSB0aGFuIG9uZSBlbGVtZW50LlwiKTtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PSAxKVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyWzBdO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgICBMaW5xLnNpbmdsZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnNpbmdsZShwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfSk7IH1cclxuICAgICAgICB2YXIgYXJyID0gdGhpcy5maWx0ZXIocHJlZGljYXRlKS50YWtlKDEpLnRvQXJyYXkoKTtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PSAxKVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyWzBdO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgICBMaW5xLmZpcnN0ID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9KTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLmZpcnN0KHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUubGFzdCA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pOyB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpLmZpcnN0KHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5sYXN0ID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9KTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLmxhc3QocHJlZGljYXRlKTtcclxuICAgIH07XHJcbiAgICBMaW5xLmludGVyc2VjdCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIG1vcmUgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDI7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBtb3JlW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGlzdHMgPSBbXSwgcmVzdWx0ID0gW107XHJcbiAgICAgICAgdmFyIGxpc3QgPSAoYSBpbnN0YW5jZW9mIExpbnEpID8gYSA6IG5ldyBMaW5xKFV0aWwuY2FzdChhKSk7XHJcbiAgICAgICAgbGlzdHMucHVzaCgoYiBpbnN0YW5jZW9mIExpbnEpID8gYiA6IG5ldyBMaW5xKFV0aWwuY2FzdChiKSkpO1xyXG4gICAgICAgIG1vcmUuZm9yRWFjaChmdW5jdGlvbiAoZGF0YXNldCkge1xyXG4gICAgICAgICAgICBsaXN0cy5wdXNoKChkYXRhc2V0IGluc3RhbmNlb2YgTGlucSkgPyBkYXRhc2V0IDogbmV3IExpbnEoVXRpbC5jYXN0KGRhdGFzZXQpKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHZhciBleGlzdHMgPSB0cnVlO1xyXG4gICAgICAgICAgICBsaXN0cy5mb3JFYWNoKGZ1bmN0aW9uIChvdGhlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvdGhlci5jb250YWlucyhpdGVtKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGV4aXN0cyA9IGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChleGlzdHMpXHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLmludGVyc2VjdCA9IGZ1bmN0aW9uIChvdGhlcikge1xyXG4gICAgICAgIHZhciBtb3JlID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgbW9yZVtfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKExpbnEuaW50ZXJzZWN0LmFwcGx5KExpbnEsIFt0aGlzLCBvdGhlcl0uY29uY2F0KG1vcmUpKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5leGNlcHQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciBtb3JlID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgbW9yZVtfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxpc3RzID0gW10sIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGxpc3RzLnB1c2goKGEgaW5zdGFuY2VvZiBMaW5xKSA/IGEgOiBuZXcgTGlucShVdGlsLmNhc3QoYSkpKTtcclxuICAgICAgICBsaXN0cy5wdXNoKChiIGluc3RhbmNlb2YgTGlucSkgPyBiIDogbmV3IExpbnEoVXRpbC5jYXN0KGIpKSk7XHJcbiAgICAgICAgbW9yZS5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhc2V0KSB7XHJcbiAgICAgICAgICAgIGxpc3RzLnB1c2goKGRhdGFzZXQgaW5zdGFuY2VvZiBMaW5xKSA/IGRhdGFzZXQgOiBuZXcgTGlucShVdGlsLmNhc3QoZGF0YXNldCkpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBsaXN0cy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0KSB7XHJcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGV4aXN0cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgbGlzdHMuZm9yRWFjaChmdW5jdGlvbiAob3RoZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdCA9PT0gb3RoZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXIuY29udGFpbnMoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChleGlzdHMgPSB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFleGlzdHMpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuZXhjZXB0ID0gZnVuY3Rpb24gKG90aGVyKSB7XHJcbiAgICAgICAgdmFyIG1vcmUgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBtb3JlW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoTGlucS5leGNlcHQuYXBwbHkoTGlucSwgW3RoaXMsIG90aGVyXS5jb25jYXQobW9yZSkpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLmRpc3RpbmN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkYXRhc2V0cyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXRzW19pIC0gMF0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGlzdHMgPSBbXSwgcmVzdWx0ID0gW107XHJcbiAgICAgICAgZGF0YXNldHMuZm9yRWFjaChmdW5jdGlvbiAoZGF0YXNldCkge1xyXG4gICAgICAgICAgICBsaXN0cy5wdXNoKChkYXRhc2V0IGluc3RhbmNlb2YgTGlucSkgPyBkYXRhc2V0IDogbmV3IExpbnEoVXRpbC5jYXN0KGRhdGFzZXQpKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGlzdHMuZm9yRWFjaChmdW5jdGlvbiAobGlzdCkge1xyXG4gICAgICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuaW5kZXhPZihpdGVtKSA9PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5kaXN0aW5jdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoTGlucS5kaXN0aW5jdCh0aGlzKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuZ3JvdXBCeSA9IGZ1bmN0aW9uIChrZXlTZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciBpLCBhcnIgPSBbXSwgb3JpZ2luYWwgPSB0aGlzLnRvQXJyYXkoKSwgcHJlZCA9IHRoaXMuX21ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3RvciksIGdyb3VwLCBncm91cFZhbHVlO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcmlnaW5hbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBncm91cFZhbHVlID0gcHJlZChvcmlnaW5hbFtpXSk7XHJcbiAgICAgICAgICAgIGdyb3VwID0gbmV3IExpbnEoYXJyKS5maXJzdChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5rZXkgPT0gZ3JvdXBWYWx1ZTsgfSk7XHJcbiAgICAgICAgICAgIGlmICghZ3JvdXApIHtcclxuICAgICAgICAgICAgICAgIGdyb3VwID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleTogZ3JvdXBWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IFtdXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2goZ3JvdXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdyb3VwLnZhbHVlcy5wdXNoKG9yaWdpbmFsW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKGFycik7XHJcbiAgICB9O1xyXG4gICAgTGlucS5ncm91cEJ5ID0gZnVuY3Rpb24gKHNvdXJjZSwga2V5U2VsZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5ncm91cEJ5KGtleVNlbGVjdG9yKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVzLCBhcnIgPSBbXTtcclxuICAgICAgICBpZiAoVXRpbC5pc0FycmF5KHRoaXMuX3NvdXJjZSkpIHtcclxuICAgICAgICAgICAgYXJyID0gVXRpbC5jYXN0KHRoaXMuX3NvdXJjZSkuc2xpY2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHJlcyA9IHRoaXMuX3NvdXJjZS5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIVV0aWwuaXNVbmRlZmluZWQocmVzKSlcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChyZXMpO1xyXG4gICAgICAgICAgICB9IHdoaWxlICghVXRpbC5pc1VuZGVmaW5lZChyZXMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IHRoaXMudG9BcnJheSgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhhcnJbaV0sIGkpID09PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgIHZhciByZXN1bHQ7XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtID09PSBhKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiByZXN1bHQgIT09IFwidW5kZWZpbmVkXCI7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpbnE7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGlucTtcclxuZnVuY3Rpb24gTFEoc291cmNlKSB7XHJcbiAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKTtcclxufVxyXG5leHBvcnRzLkxRID0gTFE7XHJcbnZhciBPcmRlcmVkTGlucSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoT3JkZXJlZExpbnEsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBPcmRlcmVkTGlucShzb3VyY2UpIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpO1xyXG4gICAgfVxyXG4gICAgT3JkZXJlZExpbnEucHJvdG90eXBlLnRoZW5CeSA9IGZ1bmN0aW9uIChrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yRm4gPSB0aGlzLl9tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpO1xyXG4gICAgICAgIHZhciBvcmRlckl0ZXJhdG9yID0gdGhpcy5fc291cmNlLmdldEl0ZXJhdG9yRnJvbVBpcGVsaW5lKG9yZGVyXzEuZGVmYXVsdCk7XHJcbiAgICAgICAgb3JkZXJJdGVyYXRvci50aGVuQnkoc2VsZWN0b3JGbiwgY29tcGFyZXIsIGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBPcmRlcmVkTGlucS5wcm90b3R5cGUudGhlbkJ5RGVzYyA9IGZ1bmN0aW9uIChrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yRm4gPSB0aGlzLl9tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpO1xyXG4gICAgICAgIHZhciBvcmRlckl0ZXJhdG9yID0gdGhpcy5fc291cmNlLmdldEl0ZXJhdG9yRnJvbVBpcGVsaW5lKG9yZGVyXzEuZGVmYXVsdCk7XHJcbiAgICAgICAgb3JkZXJJdGVyYXRvci50aGVuQnkoc2VsZWN0b3JGbiwgY29tcGFyZXIsIHRydWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBPcmRlcmVkTGlucTtcclxufShMaW5xKSk7XHJcbmV4cG9ydHMuT3JkZXJlZExpbnEgPSBPcmRlcmVkTGlucTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlucS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIExpbnFNYXBJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoTGlucU1hcEl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gTGlucU1hcEl0ZXJhdG9yKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICB9XHJcbiAgICBMaW5xTWFwSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9uZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuICghVXRpbC5pc1VuZGVmaW5lZChpdGVtKSlcclxuICAgICAgICAgICAgPyB0aGlzLl9jYWxsYmFjayhpdGVtLCB0aGlzLl9pZHgpXHJcbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaW5xTWFwSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGlucU1hcEl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBPcmRlckl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhPcmRlckl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gT3JkZXJJdGVyYXRvcihzb3VyY2UsIGtleVNlbGVjdG9yLCBjb21wYXJlciwgZGVzY2VuZGluZykge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICBpZiAoZGVzY2VuZGluZyA9PT0gdm9pZCAwKSB7IGRlc2NlbmRpbmcgPSBmYWxzZTsgfVxyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5faXNPcmRlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fb3JkZXJzID0gW25ldyBMaW5xT3JkZXIoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKV07XHJcbiAgICAgICAgdGhpcy5fZGVzY2VuZGluZyA9IGRlc2NlbmRpbmc7XHJcbiAgICAgICAgdGhpcy5fYnVmZmVycyA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBPcmRlckl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc09yZGVyZWQpIHtcclxuICAgICAgICAgICAgdmFyIGFyciA9IFtdLCBpdGVtID0gdm9pZCAwO1xyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9IHdoaWxlICghVXRpbC5pc1VuZGVmaW5lZChpdGVtKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IGFyci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaSA9IDAsIHJzO1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJzID0gX3RoaXMuX29yZGVyc1tpKytdLmNvbXBhcmUoYSwgYik7XHJcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChycyA9PT0gMCAmJiBpIDwgX3RoaXMuX29yZGVycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5faXNPcmRlcmVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25leHQoKTtcclxuICAgIH07XHJcbiAgICBPcmRlckl0ZXJhdG9yLnByb3RvdHlwZS50aGVuQnkgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIGlmIChkZXNjZW5kaW5nID09PSB2b2lkIDApIHsgZGVzY2VuZGluZyA9IGZhbHNlOyB9XHJcbiAgICAgICAgdGhpcy5fb3JkZXJzLnB1c2gobmV3IExpbnFPcmRlcihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gT3JkZXJJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBPcmRlckl0ZXJhdG9yO1xyXG52YXIgTGlucU9yZGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpbnFPcmRlcihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgaWYgKGRlc2NlbmRpbmcgPT09IHZvaWQgMCkgeyBkZXNjZW5kaW5nID0gZmFsc2U7IH1cclxuICAgICAgICB0aGlzLl9rZXlTZWxlY3RvciA9IGtleVNlbGVjdG9yO1xyXG4gICAgICAgIHRoaXMuX2NvbXBhcmVyID0gY29tcGFyZXI7XHJcbiAgICAgICAgdGhpcy5fZGVzY2VuZGluZyA9IGRlc2NlbmRpbmc7XHJcbiAgICB9XHJcbiAgICBMaW5xT3JkZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fZGVzY2VuZGluZyA/IC0xIDogMSkgKiB0aGlzLl9jb21wYXJlcih0aGlzLl9rZXlTZWxlY3RvcihhKSwgdGhpcy5fa2V5U2VsZWN0b3IoYikpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaW5xT3JkZXI7XHJcbn0oKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9yZGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgU2tpcEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhTa2lwSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBTa2lwSXRlcmF0b3Ioc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5fY291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5fY291bnQgPSBjb3VudDtcclxuICAgIH1cclxuICAgIFNraXBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKDsgdGhpcy5fY291bnRlciA8IHRoaXMuX2NvdW50OyB0aGlzLl9jb3VudGVyKyspIHtcclxuICAgICAgICAgICAgdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fbmV4dCgpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTa2lwSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gU2tpcEl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgU2tpcFdoaWxlSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFNraXBXaGlsZUl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gU2tpcFdoaWxlSXRlcmF0b3Ioc291cmNlLCBfcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKF9wcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBfcHJlZGljYXRlID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgICAgICB0aGlzLl9kb25lID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcHJlZGljYXRlID0gX3ByZWRpY2F0ZTtcclxuICAgIH1cclxuICAgIFNraXBXaGlsZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgaXRlbSA9IHRoaXMuX25leHQoKTtcclxuICAgICAgICB9IHdoaWxlICghdGhpcy5fZG9uZSAmJiB0aGlzLl9wcmVkaWNhdGUoaXRlbSwgdGhpcy5faWR4KSk7XHJcbiAgICAgICAgdGhpcy5fZG9uZSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNraXBXaGlsZUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFNraXBXaGlsZUl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwV2hpbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBUYWtlSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFRha2VJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFRha2VJdGVyYXRvcihzb3VyY2UsIGNvdW50KSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgICAgICB0aGlzLl9jb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLl9jb3VudCA9IGNvdW50O1xyXG4gICAgfVxyXG4gICAgVGFrZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb3VudGVyIDwgdGhpcy5fY291bnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY291bnRlcisrO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gVGFrZUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFRha2VJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIFRha2VXaGlsZUl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhUYWtlV2hpbGVJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFRha2VXaGlsZUl0ZXJhdG9yKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5fcHJlZGljYXRlID0gcHJlZGljYXRlO1xyXG4gICAgfVxyXG4gICAgVGFrZVdoaWxlSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG4gPSB0aGlzLl9uZXh0KCk7XHJcbiAgICAgICAgaWYgKCEhdGhpcy5fcHJlZGljYXRlKG4sIHRoaXMuX2lkeCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG47XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBUYWtlV2hpbGVJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBUYWtlV2hpbGVJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZVdoaWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBkZWZhdWx0U2VsZWN0b3IoYSkge1xyXG4gICAgcmV0dXJuIGNhc3QoYSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0U2VsZWN0b3IgPSBkZWZhdWx0U2VsZWN0b3I7XHJcbmZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlcihhLCBiKSB7XHJcbiAgICBpZiAoYSA8IGIpXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgZWxzZSBpZiAoYSA+IGIpXHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0Q29tcGFyZXIgPSBkZWZhdWx0Q29tcGFyZXI7XHJcbmZ1bmN0aW9uIGRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyKGEsIGIpIHtcclxuICAgIHJldHVybiBhID09PSBiO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXIgPSBkZWZhdWx0RXF1YWxpdHlDb21wYXJlcjtcclxuZnVuY3Rpb24gZGVmYXVsdFByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdFByZWRpY2F0ZSA9IGRlZmF1bHRQcmVkaWNhdGU7XHJcbmZ1bmN0aW9uIGNhc3QoYSkge1xyXG4gICAgcmV0dXJuIGE7XHJcbn1cclxuZXhwb3J0cy5jYXN0ID0gY2FzdDtcclxuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xyXG59XHJcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcclxuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcclxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCI7XHJcbn1cclxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xyXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcclxufVxyXG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XHJcbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xyXG59XHJcbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcclxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xyXG59XHJcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XHJcbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcclxufVxyXG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xyXG5mdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBEYXRlXVwiO1xyXG59XHJcbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlsLmpzLm1hcCJdfQ==
;
return {
'Collections': require('Collections'),
'Helpers': require('Helpers'),
'Linq': require('Linq')
};
});
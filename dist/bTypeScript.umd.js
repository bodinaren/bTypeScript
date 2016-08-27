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
    Linq.prototype.avg = function (selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return this.average(selector);
    };
    Linq.average = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return new Linq(source).average(selector);
    };
    Linq.avg = function (source, selector) {
        if (selector === void 0) { selector = Util.defaultSelector; }
        return Linq.average(source, selector);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMuanMiLCJkaXN0L3NyYy9saW5xLmpzIiwiZGlzdC9zcmMvY29sbGVjdGlvbnMvYmluYXJ5VHJlZS5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL2xpbmtlZExpc3QuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9saXN0LmpzIiwiZGlzdC9zcmMvY29sbGVjdGlvbnMvcXVldWUuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9zdGFjay5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvZGF0ZXMuanMiLCJkaXN0L3NyYy9oZWxwZXJzL251bWJlcnMuanMiLCJkaXN0L3NyYy9oZWxwZXJzL3N0cmluZ3MuanMiLCJkaXN0L3NyYy9saW5xL2ZpbHRlci5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IuanMiLCJkaXN0L3NyYy9saW5xL2xpbnEuanMiLCJkaXN0L3NyYy9saW5xL21hcC5qcyIsImRpc3Qvc3JjL2xpbnEvb3JkZXIuanMiLCJkaXN0L3NyYy9saW5xL3NraXAuanMiLCJkaXN0L3NyYy9saW5xL3NraXBXaGlsZS5qcyIsImRpc3Qvc3JjL2xpbnEvdGFrZS5qcyIsImRpc3Qvc3JjL2xpbnEvdGFrZVdoaWxlLmpzIiwiZGlzdC9zcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgbGlzdF8xID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbnMvbGlzdFwiKTtcclxuZXhwb3J0cy5MaXN0ID0gbGlzdF8xLmRlZmF1bHQ7XHJcbnZhciBsaW5rZWRMaXN0XzEgPSByZXF1aXJlKFwiLi9jb2xsZWN0aW9ucy9saW5rZWRMaXN0XCIpO1xyXG5leHBvcnRzLkxpbmtlZExpc3QgPSBsaW5rZWRMaXN0XzEuZGVmYXVsdDtcclxudmFyIHN0YWNrXzEgPSByZXF1aXJlKFwiLi9jb2xsZWN0aW9ucy9zdGFja1wiKTtcclxuZXhwb3J0cy5TdGFjayA9IHN0YWNrXzEuZGVmYXVsdDtcclxudmFyIHF1ZXVlXzEgPSByZXF1aXJlKFwiLi9jb2xsZWN0aW9ucy9xdWV1ZVwiKTtcclxuZXhwb3J0cy5RdWV1ZSA9IHF1ZXVlXzEuZGVmYXVsdDtcclxudmFyIGJpbmFyeVRyZWVfMSA9IHJlcXVpcmUoXCIuL2NvbGxlY3Rpb25zL2JpbmFyeVRyZWVcIik7XHJcbmV4cG9ydHMuQmluYXJ5VHJlZSA9IGJpbmFyeVRyZWVfMS5kZWZhdWx0O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb2xsZWN0aW9ucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIG51bWJlcnNfMSA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvbnVtYmVyc1wiKTtcclxuZXhwb3J0cy5OdW1iZXJzID0gbnVtYmVyc18xLmRlZmF1bHQ7XHJcbmV4cG9ydHMuTnVtYmVyc0hlbHBlciA9IG51bWJlcnNfMS5OdW1iZXJzSGVscGVyO1xyXG52YXIgc3RyaW5nc18xID0gcmVxdWlyZShcIi4vaGVscGVycy9zdHJpbmdzXCIpO1xyXG5leHBvcnRzLlN0cmluZ3MgPSBzdHJpbmdzXzEuZGVmYXVsdDtcclxuZXhwb3J0cy5TdHJpbmdzSGVscGVyID0gc3RyaW5nc18xLlN0cmluZ3NIZWxwZXI7XHJcbnZhciBkYXRlc18xID0gcmVxdWlyZShcIi4vaGVscGVycy9kYXRlc1wiKTtcclxuZXhwb3J0cy5EYXRlcyA9IGRhdGVzXzEuZGVmYXVsdDtcclxuZXhwb3J0cy5EYXRlc0hlbHBlciA9IGRhdGVzXzEuRGF0ZXNIZWxwZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhlbHBlcnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vbGlucS9pdGVyYXRvclwiKTtcclxuZXhwb3J0cy5JdGVyYXRvciA9IGl0ZXJhdG9yXzEuZGVmYXVsdDtcclxudmFyIGZpbHRlcl8xID0gcmVxdWlyZShcIi4vbGlucS9maWx0ZXJcIik7XHJcbmV4cG9ydHMuRmlsdGVySXRlcmF0b3IgPSBmaWx0ZXJfMS5kZWZhdWx0O1xyXG52YXIgbWFwXzEgPSByZXF1aXJlKFwiLi9saW5xL21hcFwiKTtcclxuZXhwb3J0cy5NYXBJdGVyYXRvciA9IG1hcF8xLmRlZmF1bHQ7XHJcbnZhciBvcmRlcl8xID0gcmVxdWlyZShcIi4vbGlucS9vcmRlclwiKTtcclxuZXhwb3J0cy5PcmRlckl0ZXJhdG9yID0gb3JkZXJfMS5kZWZhdWx0O1xyXG52YXIgc2tpcF8xID0gcmVxdWlyZShcIi4vbGlucS9za2lwXCIpO1xyXG5leHBvcnRzLlNraXBJdGVyYXRvciA9IHNraXBfMS5kZWZhdWx0O1xyXG52YXIgc2tpcFdoaWxlXzEgPSByZXF1aXJlKFwiLi9saW5xL3NraXBXaGlsZVwiKTtcclxuZXhwb3J0cy5Ta2lwV2hpbGVJdGVyYXRvciA9IHNraXBXaGlsZV8xLmRlZmF1bHQ7XHJcbnZhciB0YWtlXzEgPSByZXF1aXJlKFwiLi9saW5xL3Rha2VcIik7XHJcbmV4cG9ydHMuVGFrZUl0ZXJhdG9yID0gdGFrZV8xLmRlZmF1bHQ7XHJcbnZhciB0YWtlV2hpbGVfMSA9IHJlcXVpcmUoXCIuL2xpbnEvdGFrZVdoaWxlXCIpO1xyXG5leHBvcnRzLlRha2VXaGlsZUl0ZXJhdG9yID0gdGFrZVdoaWxlXzEuZGVmYXVsdDtcclxudmFyIGxpbnFfMSA9IHJlcXVpcmUoXCIuL2xpbnEvbGlucVwiKTtcclxuZXhwb3J0cy5MaW5xID0gbGlucV8xLmRlZmF1bHQ7XHJcbmV4cG9ydHMuTFEgPSBsaW5xXzEuTFE7XHJcbmV4cG9ydHMuT3JkZXJlZExpbnEgPSBsaW5xXzEuT3JkZXJlZExpbnE7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbnEuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBxdWV1ZV8xID0gcmVxdWlyZShcIi4vcXVldWVcIik7XHJcbnZhciBCaW5hcnlUcmVlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEJpbmFyeVRyZWUoY29tcGFyZUZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuX2NvbXBhcmUgPSBjb21wYXJlRnVuY3Rpb24gfHwgVXRpbC5kZWZhdWx0Q29tcGFyZXI7XHJcbiAgICB9XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gdGhpcy5pbnNlcnRBdXgodGhpcy5fcm9vdCwgbmV3IFRyZWVOb2RlKGl0ZW0pKTsgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmluc2VydFJhbmdlID0gZnVuY3Rpb24gKGl0ZW1zKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IF90aGlzLmluc2VydChpdGVtKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuaW5zZXJ0QXV4ID0gZnVuY3Rpb24gKHRyZWUsIG5vZGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3Jvb3QpIHtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29tcCA9IHRoaXMuX2NvbXBhcmUobm9kZS52YWx1ZSwgdHJlZS52YWx1ZSk7XHJcbiAgICAgICAgaWYgKGNvbXAgPCAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0cmVlLmxlZnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QXV4KHRyZWUubGVmdCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlLmxlZnQgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSB0cmVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY29tcCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHRyZWUucmlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QXV4KHRyZWUucmlnaHQsIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJlZS5yaWdodCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHRyZWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX3NlYXJjaCh0aGlzLl9yb290LCBpdGVtKTtcclxuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICBpZiAobm9kZS52YWx1ZSA8IG5vZGUucGFyZW50LnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIG5vZGUucGFyZW50LmxlZnQ7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLnBhcmVudC5yaWdodDtcclxuICAgICAgICAgICAgZGVsZXRlIG5vZGUucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHZhciByaWdodCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHdoaWxlIChyaWdodC5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC5yaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmlnaHQubGVmdCkge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC5sZWZ0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHJpZ2h0LnZhbHVlICE9PSBub2RlLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQubGVmdCA9IHJpZ2h0LnBhcmVudC5sZWZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0LmxlZnQucGFyZW50ID0gcmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJpZ2h0LnBhcmVudC52YWx1ZSA9PT0gbm9kZS52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC5wYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmlnaHQucGFyZW50ID0gbm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgICAgIG5vZGUubGVmdCA9IG5vZGUucmlnaHQgPSBub2RlLnBhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKG5vZGUgPT09IHRoaXMuX3Jvb3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSByaWdodDtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9yb290LnBhcmVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiAhIXRoaXMuX3NlYXJjaCh0aGlzLl9yb290LCBpdGVtKTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsKGNhbGxiYWNrKTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcnIgPSBbXTtcclxuICAgICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHsgYXJyLnB1c2goaXRlbSk7IH0pO1xyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucHJlb3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5wcmVvcmRlclRyYXZlcnNhbEF1eCh0aGlzLl9yb290LCBjYWxsYmFjaywgeyBzdG9wOiBmYWxzZSB9KTsgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLnByZW9yZGVyVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICBpZiAoIXRyZWUgfHwgc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBzaWduYWwuc3RvcCA9IChjYWxsYmFjayh0cmVlLnZhbHVlKSA9PT0gZmFsc2UpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5sZWZ0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByZW9yZGVyVHJhdmVyc2FsQXV4KHRyZWUucmlnaHQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmlub3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5pbm9yZGVyVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuaW5vcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uICh0cmVlLCBjYWxsYmFjaywgc2lnbmFsKSB7XHJcbiAgICAgICAgaWYgKCF0cmVlIHx8IHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsQXV4KHRyZWUubGVmdCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgc2lnbmFsLnN0b3AgPSAoY2FsbGJhY2sodHJlZS52YWx1ZSkgPT09IGZhbHNlKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5yaWdodCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucG9zdG9yZGVyVHJhdmVyc2FsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7IHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucG9zdG9yZGVyVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICBpZiAoIXRyZWUgfHwgc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnBvc3RvcmRlclRyYXZlcnNhbEF1eCh0cmVlLmxlZnQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KHRyZWUucmlnaHQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHNpZ25hbC5zdG9wID0gKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubGV2ZWxUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5sZXZlbFRyYXZlcnNhbEF1eCh0aGlzLl9yb290LCBjYWxsYmFjaywgeyBzdG9wOiBmYWxzZSB9KTsgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmxldmVsVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICB2YXIgcXVldWUgPSBuZXcgcXVldWVfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKHRyZWUpXHJcbiAgICAgICAgICAgIHF1ZXVlLmVucXVldWUodHJlZSk7XHJcbiAgICAgICAgd2hpbGUgKCFVdGlsLmlzVW5kZWZpbmVkKHRyZWUgPSBxdWV1ZS5kZXF1ZXVlKCkpKSB7XHJcbiAgICAgICAgICAgIHNpZ25hbC5zdG9wID0gc2lnbmFsLnN0b3AgfHwgKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHRyZWUubGVmdClcclxuICAgICAgICAgICAgICAgIHF1ZXVlLmVucXVldWUodHJlZS5sZWZ0KTtcclxuICAgICAgICAgICAgaWYgKHRyZWUucmlnaHQpXHJcbiAgICAgICAgICAgICAgICBxdWV1ZS5lbnF1ZXVlKHRyZWUucmlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1pbiA9IHRoaXMubWluQXV4KHRoaXMuX3Jvb3QpO1xyXG4gICAgICAgIGlmIChtaW4pXHJcbiAgICAgICAgICAgIHJldHVybiBtaW4udmFsdWU7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubWluQXV4ID0gZnVuY3Rpb24gKHRyZWUpIHtcclxuICAgICAgICBpZiAodHJlZS5sZWZ0KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5taW5BdXgodHJlZS5sZWZ0KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0cmVlO1xyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWF4ID0gdGhpcy5tYXhBdXgodGhpcy5fcm9vdCk7XHJcbiAgICAgICAgaWYgKG1heClcclxuICAgICAgICAgICAgcmV0dXJuIG1heC52YWx1ZTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5tYXhBdXggPSBmdW5jdGlvbiAodHJlZSkge1xyXG4gICAgICAgIGlmICh0cmVlLnJpZ2h0KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXhBdXgodHJlZS5yaWdodCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdHJlZTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5kZXB0aCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuZGVwdGhBdXgodGhpcy5fcm9vdCk7IH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5kZXB0aEF1eCA9IGZ1bmN0aW9uICh0cmVlKSB7XHJcbiAgICAgICAgaWYgKCF0cmVlKVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRoaXMuZGVwdGhBdXgodHJlZS5sZWZ0KSwgdGhpcy5kZXB0aEF1eCh0cmVlLnJpZ2h0KSkgKyAxO1xyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLl9zZWFyY2ggPSBmdW5jdGlvbiAodHJlZSwgaXRlbSkge1xyXG4gICAgICAgIGlmIChVdGlsLmlzVW5kZWZpbmVkKHRyZWUpKVxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBjb21wID0gdGhpcy5fY29tcGFyZShpdGVtLCB0cmVlLnZhbHVlKTtcclxuICAgICAgICBpZiAoY29tcCA8IDApIHtcclxuICAgICAgICAgICAgdHJlZSA9IHRoaXMuX3NlYXJjaCh0cmVlLmxlZnQsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb21wID4gMCkge1xyXG4gICAgICAgICAgICB0cmVlID0gdGhpcy5fc2VhcmNoKHRyZWUucmlnaHQsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJlZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQmluYXJ5VHJlZTtcclxufSgpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBCaW5hcnlUcmVlO1xyXG52YXIgVHJlZU5vZGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVHJlZU5vZGUodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBUcmVlTm9kZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICF0aGlzLmxlZnQgJiYgIXRoaXMucmlnaHQ7IH07XHJcbiAgICByZXR1cm4gVHJlZU5vZGU7XHJcbn0oKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJpbmFyeVRyZWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBMaW5rZWRMaXN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpbmtlZExpc3QoKSB7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuX2dldE5vZGUgPSBmdW5jdGlvbiAoYXQpIHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgZWxzZSBpZiAoYXQgPT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0O1xyXG4gICAgICAgIGVsc2UgaWYgKGF0ID4gdGhpcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYXN0O1xyXG4gICAgICAgIHZhciBpLCBpdGVtO1xyXG4gICAgICAgIGlmIChhdCA8IHRoaXMubGVuZ3RoIC8gMikge1xyXG4gICAgICAgICAgICBpdGVtID0gdGhpcy5fZmlyc3Q7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhdDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gaXRlbS5uZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpdGVtID0gdGhpcy5fbGFzdDtcclxuICAgICAgICAgICAgZm9yIChpID0gdGhpcy5sZW5ndGggLSAxOyBpID4gYXQ7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW0ucHJldjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoYXQpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2dldE5vZGUoYXQpO1xyXG4gICAgICAgIGlmIChub2RlKVxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS52YWw7XHJcbiAgICB9O1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gbmV3IExpbmtlZExpc3ROb2RlKHZhbCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9maXJzdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9maXJzdCA9IHRoaXMuX2xhc3QgPSBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaXRlbS5wcmV2ID0gdGhpcy5fbGFzdDtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdC5uZXh0ID0gaXRlbTtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdCA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiArK3RoaXMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmluc2VydEF0ID0gZnVuY3Rpb24gKGF0LCB2YWwpIHtcclxuICAgICAgICBpZiAoYXQgPj0gdGhpcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydCh2YWwpO1xyXG4gICAgICAgIHZhciBpdGVtID0gbmV3IExpbmtlZExpc3ROb2RlKHZhbCksIG5leHQgPSB0aGlzLl9nZXROb2RlKGF0KSwgcHJldiA9IG5leHQucHJldjtcclxuICAgICAgICBpZiAocHJldilcclxuICAgICAgICAgICAgcHJldi5uZXh0ID0gaXRlbTtcclxuICAgICAgICBuZXh0LnByZXYgPSBpdGVtO1xyXG4gICAgICAgIGl0ZW0ucHJldiA9IHByZXY7XHJcbiAgICAgICAgaXRlbS5uZXh0ID0gbmV4dDtcclxuICAgICAgICBpZiAoYXQgPT09IDApXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0ID0gaXRlbTtcclxuICAgICAgICByZXR1cm4gKyt0aGlzLmxlbmd0aDtcclxuICAgIH07XHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5yZW1vdmVBdCA9IGZ1bmN0aW9uIChhdCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9nZXROb2RlKGF0KTtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLl9sYXN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpdGVtID09PSB0aGlzLl9maXJzdCkge1xyXG4gICAgICAgICAgICBpdGVtLm5leHQucHJldiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSBpdGVtLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGl0ZW0gPT09IHRoaXMuX2xhc3QpIHtcclxuICAgICAgICAgICAgaXRlbS5uZXh0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpdGVtLnByZXYubmV4dCA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpdGVtLnByZXYubmV4dCA9IGl0ZW0ubmV4dDtcclxuICAgICAgICAgICAgaXRlbS5uZXh0LnByZXYgPSBpdGVtLnByZXY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtLXRoaXMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX2ZpcnN0ID0gdGhpcy5fbGFzdCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpbmtlZExpc3Q7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGlua2VkTGlzdDtcclxudmFyIExpbmtlZExpc3ROb2RlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpbmtlZExpc3ROb2RlKHZhbCkge1xyXG4gICAgICAgIHRoaXMudmFsID0gdmFsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIExpbmtlZExpc3ROb2RlO1xyXG59KCkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5rZWRMaXN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgTGlzdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMaXN0KHNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZSB8fCBbXTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShMaXN0LnByb3RvdHlwZSwgXCJsZW5ndGhcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fc291cmNlLmxlbmd0aDsgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBMaXN0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2U7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UucHVzaChpdGVtKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LmFkZCA9IGZ1bmN0aW9uIChzb3VyY2UsIGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5hZGQoaXRlbSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmFkZFJhbmdlID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24pIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSAoY29sbGVjdGlvbiBpbnN0YW5jZW9mIExpc3QpID8gY29sbGVjdGlvbi50b0FycmF5KCkgOiBjb2xsZWN0aW9uO1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMuX3NvdXJjZSwgaXRlbXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QuYWRkUmFuZ2UgPSBmdW5jdGlvbiAoc291cmNlLCBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuYWRkUmFuZ2UoY29sbGVjdGlvbikudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmFzUmVhZE9ubHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KE9iamVjdC5mcmVlemUodGhpcy5fc291cmNlLnNsaWNlKCkpKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLmZvckVhY2goY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIExpc3QuZm9yRWFjaCA9IGZ1bmN0aW9uIChzb3VyY2UsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbmV3IExpc3Qoc291cmNlKS5mb3JFYWNoKGNhbGxiYWNrKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gKGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gMDsgfVxyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gdGhpcy5sZW5ndGg7IH1cclxuICAgICAgICB2YXIgaWR4ID0gdGhpcy5fc291cmNlLmluZGV4T2YoaXRlbSwgaW5kZXgpO1xyXG4gICAgICAgIGlmIChpZHggPiBjb3VudCAtIGluZGV4ICsgMSlcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiBpZHg7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5pbmRleE9mID0gZnVuY3Rpb24gKHNvdXJjZSwgaXRlbSwgaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSB2b2lkIDApIHsgaW5kZXggPSAwOyB9XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSBzb3VyY2UubGVuZ3RoOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuaW5kZXhPZihpdGVtLCBpbmRleCwgY291bnQpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gKGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gdGhpcy5sZW5ndGggLSAxOyB9XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSB0aGlzLmxlbmd0aDsgfVxyXG4gICAgICAgIHZhciBpZHggPSB0aGlzLl9zb3VyY2UubGFzdEluZGV4T2YoaXRlbSwgaW5kZXgpO1xyXG4gICAgICAgIGlmIChpZHggPCBpbmRleCArIDEgLSBjb3VudClcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiBpZHg7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIChzb3VyY2UsIGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gdGhpcy5sZW5ndGggLSAxOyB9XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSB0aGlzLmxlbmd0aDsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmxhc3RJbmRleE9mKGl0ZW0sIGluZGV4LCBjb3VudCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgMCwgaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5pbnNlcnQgPSBmdW5jdGlvbiAoc291cmNlLCBpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmluc2VydChpbmRleCwgaXRlbSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmluc2VydFJhbmdlID0gZnVuY3Rpb24gKGluZGV4LCBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gKGNvbGxlY3Rpb24gaW5zdGFuY2VvZiBMaXN0KSA/IGNvbGxlY3Rpb24udG9BcnJheSgpIDogY29sbGVjdGlvbjtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMuX3NvdXJjZSwgbmV3IEFycmF5KGluZGV4LCAwKS5jb25jYXQoaXRlbXMpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0Lmluc2VydFJhbmdlID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5pbnNlcnRSYW5nZShpbmRleCwgY29sbGVjdGlvbikudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VbaW5kZXhdO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIGlmIChpbmRleCA+IHRoaXMubGVuZ3RoKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbmRleCB3YXMgb3V0IG9mIHJhbmdlLiBNdXN0IGJlIG5vbi1uZWdhdGl2ZSBhbmQgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBjb2xsZWN0aW9uLlwiKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZVtpbmRleF0gPSBpdGVtO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQXQodGhpcy5fc291cmNlLmluZGV4T2YoaXRlbSkpO1xyXG4gICAgfTtcclxuICAgIExpc3QucmVtb3ZlID0gZnVuY3Rpb24gKHNvdXJjZSwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLnJlbW92ZShpdGVtKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmVtb3ZlQWxsID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmICghcHJlZGljYXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZS5zcGxpY2UoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgaSA9IHZvaWQgMDtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVkaWNhdGUodGhpcy5fc291cmNlW2ldLCBpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NvdXJjZS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QucmVtb3ZlQWxsID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlQWxsKHByZWRpY2F0ZSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZUF0ID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZW1vdmVBdCA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlQXQoaW5kZXgpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5yZW1vdmVSYW5nZSA9IGZ1bmN0aW9uIChpbmRleCwgY291bnQpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKGluZGV4LCBjb3VudCArIGluZGV4IC0gMSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZW1vdmVSYW5nZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLnJlbW92ZVJhbmdlKGluZGV4LCBjb3VudCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5jbGVhciA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5jbGVhcigpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5jb3VudCA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAoIXByZWRpY2F0ZSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZS5sZW5ndGg7XHJcbiAgICAgICAgdmFyIHN1bSA9IDA7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSlcclxuICAgICAgICAgICAgICAgIHN1bSsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICB9O1xyXG4gICAgTGlzdC5jb3VudCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmNvdW50KHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uIChpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoKFV0aWwuaXNVbmRlZmluZWQoaW5kZXgpICYmIFV0aWwuaXNVbmRlZmluZWQoY291bnQpKSB8fCAoaW5kZXggPT09IDAgJiYgY291bnQgPj0gdGhpcy5sZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZS5yZXZlcnNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChjb3VudCkpXHJcbiAgICAgICAgICAgICAgICBjb3VudCA9IHRoaXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgY291bnQgKyBpbmRleCAtIDEpO1xyXG4gICAgICAgICAgICBhcnIucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmluc2VydFJhbmdlKGluZGV4LCBhcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnJldmVyc2UgPSBmdW5jdGlvbiAoc291cmNlLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZXZlcnNlKGluZGV4LCBjb3VudCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucmFuZ2UgPSBmdW5jdGlvbiAoc3RhcnQsIGNvdW50KSB7XHJcbiAgICAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IHN0YXJ0ICsgY291bnQ7IGkrKylcclxuICAgICAgICAgICAgYXJyLnB1c2goaSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KGFycik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpc3Q7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGlzdDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGxpbmtlZExpc3RfMSA9IHJlcXVpcmUoXCIuL2xpbmtlZExpc3RcIik7XHJcbnZhciBRdWV1ZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBRdWV1ZSgpIHtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IG5ldyBsaW5rZWRMaXN0XzEuZGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgUXVldWUucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5pbnNlcnQodmFsKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGggPSB0aGlzLl9saXN0Lmxlbmd0aDtcclxuICAgIH07XHJcbiAgICBRdWV1ZS5wcm90b3R5cGUuZGVxdWV1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2xpc3QuZ2V0KDApO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5fbGlzdC5yZW1vdmVBdCgwKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUXVldWU7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gUXVldWU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXF1ZXVlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgbGlua2VkTGlzdF8xID0gcmVxdWlyZShcIi4vbGlua2VkTGlzdFwiKTtcclxudmFyIFN0YWNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFN0YWNrKCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSBuZXcgbGlua2VkTGlzdF8xLmRlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIFN0YWNrLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QuaW5zZXJ0QXQoMCwgdmFsKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGggPSB0aGlzLl9saXN0Lmxlbmd0aDtcclxuICAgIH07XHJcbiAgICBTdGFjay5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5wZWVrKCk7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLl9saXN0LnJlbW92ZUF0KDApO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfTtcclxuICAgIFN0YWNrLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0LmdldCgwKTtcclxuICAgIH07XHJcbiAgICBTdGFjay5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5jbGVhcigpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTdGFjaztcclxufSgpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBTdGFjaztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhY2suanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbmZ1bmN0aW9uIERhdGVzKGRhdGUpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKTsgfVxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IERhdGVzO1xyXG52YXIgRGF0ZXNIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRGF0ZXNIZWxwZXIoZGF0ZSkge1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGU7XHJcbiAgICB9XHJcbiAgICBEYXRlc0hlbHBlci50b0RhdGUgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGRhdGUpKVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoKTtcclxuICAgICAgICBpZiAodXRpbC5pc1N0cmluZyhkYXRlKSlcclxuICAgICAgICAgICAgZGF0ZSA9IERhdGUucGFyc2UoZGF0ZSk7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNOdW1iZXIoZGF0ZSkpXHJcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgICByZXR1cm4gZGF0ZTtcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYmV0d2VlbiA9IGZ1bmN0aW9uIChsb3dlciwgdXBwZXIpIHtcclxuICAgICAgICByZXR1cm4gRGF0ZXNIZWxwZXIuYmV0d2Vlbih0aGlzLmRhdGUsIGxvd2VyLCB1cHBlcik7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYmV0d2VlbiA9IGZ1bmN0aW9uIChkYXRlLCBsb3dlciwgdXBwZXIpIHtcclxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChsb3dlcikpXHJcbiAgICAgICAgICAgIGxvd2VyID0gbmV3IERhdGUoKTtcclxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZCh1cHBlcikpXHJcbiAgICAgICAgICAgIHVwcGVyID0gbmV3IERhdGUoOTk5OTk5OTk5OTk5OSk7XHJcbiAgICAgICAgcmV0dXJuIChsb3dlciA8PSBkYXRlICYmIGRhdGUgPD0gdXBwZXIpO1xyXG4gICAgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRZZWFycyA9IGZ1bmN0aW9uICh5ZWFycykgeyByZXR1cm4gdGhpcy5hZGRNb250aHMoeWVhcnMgKiAxMik7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkTW9udGhzID0gZnVuY3Rpb24gKG1vbnRocykge1xyXG4gICAgICAgIHRoaXMuZGF0ZS5zZXRNb250aCh0aGlzLmRhdGUuZ2V0TW9udGgoKSArIG1vbnRocyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZFdlZWtzID0gZnVuY3Rpb24gKHdlZWspIHsgcmV0dXJuIHRoaXMuYWRkRGF5cyh3ZWVrICogNyk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkRGF5cyA9IGZ1bmN0aW9uIChkYXlzKSB7IHJldHVybiB0aGlzLmFkZEhvdXJzKGRheXMgKiAyNCk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkSG91cnMgPSBmdW5jdGlvbiAoaG91cnMpIHsgcmV0dXJuIHRoaXMuYWRkTWludXRlcyhob3VycyAqIDYwKTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRNaW51dGVzID0gZnVuY3Rpb24gKG1pbnV0ZXMpIHsgcmV0dXJuIHRoaXMuYWRkU2Vjb25kcyhtaW51dGVzICogNjApOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZFNlY29uZHMgPSBmdW5jdGlvbiAoc2Vjb25kcykgeyByZXR1cm4gdGhpcy5hZGRNaWxsaXNlY29uZHMoc2Vjb25kcyAqIDEwMDApOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZE1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uIChtaWxsaXNlY29uZHMpIHtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0TWlsbGlzZWNvbmRzKHRoaXMuZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSArIG1pbGxpc2Vjb25kcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkWWVhcnMgPSBmdW5jdGlvbiAoZGF0ZSwgeWVhcnMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRZZWFycyh5ZWFycykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZE1vbnRocyA9IGZ1bmN0aW9uIChkYXRlLCBtb250aHMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRNb250aHMobW9udGhzKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkV2Vla3MgPSBmdW5jdGlvbiAoZGF0ZSwgd2VlaykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZFdlZWtzKHdlZWspLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGREYXlzID0gZnVuY3Rpb24gKGRhdGUsIGRheXMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGREYXlzKGRheXMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRIb3VycyA9IGZ1bmN0aW9uIChkYXRlLCBob3VycykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZEhvdXJzKGhvdXJzKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkTWludXRlcyA9IGZ1bmN0aW9uIChkYXRlLCBtaW51dGVzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkTWludXRlcyhtaW51dGVzKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkU2Vjb25kcyA9IGZ1bmN0aW9uIChkYXRlLCBzZWNvbmRzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkU2Vjb25kcyhzZWNvbmRzKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkTWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKGRhdGUsIG1pbGxpc2Vjb25kcykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZE1pbGxpc2Vjb25kcyhtaWxsaXNlY29uZHMpLmRhdGU7IH07XHJcbiAgICByZXR1cm4gRGF0ZXNIZWxwZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuRGF0ZXNIZWxwZXIgPSBEYXRlc0hlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0ZXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbmZ1bmN0aW9uIE51bWJlcnMobnVtKSB7IHJldHVybiBuZXcgTnVtYmVyc0hlbHBlcihudW0pOyB9XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTnVtYmVycztcclxudmFyIE51bWJlcnNIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTnVtYmVyc0hlbHBlcihudW0pIHtcclxuICAgICAgICB0aGlzLm51bSA9IG51bTtcclxuICAgIH1cclxuICAgIE51bWJlcnNIZWxwZXIucHJvdG90eXBlLmJldHdlZW4gPSBmdW5jdGlvbiAobG93ZXIsIHVwcGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcnNIZWxwZXIuYmV0d2Vlbih0aGlzLm51bSwgbG93ZXIsIHVwcGVyKTtcclxuICAgIH07XHJcbiAgICBOdW1iZXJzSGVscGVyLmJldHdlZW4gPSBmdW5jdGlvbiAobnVtLCBsb3dlciwgdXBwZXIpIHtcclxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChsb3dlcikpXHJcbiAgICAgICAgICAgIGxvd2VyID0gTnVtYmVyLk1JTl9WQUxVRTtcclxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZCh1cHBlcikpXHJcbiAgICAgICAgICAgIHVwcGVyID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgICByZXR1cm4gKGxvd2VyIDw9IG51bSAmJiBudW0gPD0gdXBwZXIpO1xyXG4gICAgfTtcclxuICAgIE51bWJlcnNIZWxwZXIucHJvdG90eXBlLmluID0gZnVuY3Rpb24gKG51bWJlcnMpIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyc0hlbHBlci5pbih0aGlzLm51bSwgbnVtYmVycyk7XHJcbiAgICB9O1xyXG4gICAgTnVtYmVyc0hlbHBlci5pbiA9IGZ1bmN0aW9uIChudW0sIG51bWJlcnMpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bWJlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKG51bWJlcnNbaV0gPT0gbnVtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICBOdW1iZXJzSGVscGVyLnByb3RvdHlwZS50b0ZpeGVkID0gZnVuY3Rpb24gKHByZWNpc2lvbikge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXJzSGVscGVyLnRvRml4ZWQodGhpcy5udW0sIHByZWNpc2lvbik7XHJcbiAgICB9O1xyXG4gICAgTnVtYmVyc0hlbHBlci50b0ZpeGVkID0gZnVuY3Rpb24gKG51bSwgcHJlY2lzaW9uKSB7XHJcbiAgICAgICAgcmV0dXJuICsoTWF0aC5yb3VuZCgrKG51bS50b1N0cmluZygpICsgXCJlXCIgKyBwcmVjaXNpb24pKS50b1N0cmluZygpICsgXCJlXCIgKyAtcHJlY2lzaW9uKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTnVtYmVyc0hlbHBlcjtcclxufSgpKTtcclxuZXhwb3J0cy5OdW1iZXJzSGVscGVyID0gTnVtYmVyc0hlbHBlcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bnVtYmVycy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuZnVuY3Rpb24gU3RyaW5ncyhzdHIpIHsgcmV0dXJuIG5ldyBTdHJpbmdzSGVscGVyKHN0cik7IH1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBTdHJpbmdzO1xyXG52YXIgU3RyaW5nc0hlbHBlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTdHJpbmdzSGVscGVyKHN0cikge1xyXG4gICAgICAgIHRoaXMuc3RyID0gc3RyO1xyXG4gICAgfVxyXG4gICAgU3RyaW5nc0hlbHBlci5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaSAtIDBdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFN0cmluZ3NIZWxwZXIuZm9ybWF0LmFwcGx5KHVuZGVmaW5lZCwgW3RoaXMuc3RyXS5jb25jYXQoYXJncykpO1xyXG4gICAgfTtcclxuICAgIFN0cmluZ3NIZWxwZXIuZm9ybWF0ID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJcXFxce1wiICsgaSArIFwiXFxcXH1cIiwgXCJnXCIpO1xyXG4gICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShyZWdleCwgYXJnc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHI7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFN0cmluZ3NIZWxwZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuU3RyaW5nc0hlbHBlciA9IFN0cmluZ3NIZWxwZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0cmluZ3MuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBGaWx0ZXJJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoRmlsdGVySXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBGaWx0ZXJJdGVyYXRvcihzb3VyY2UsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrID09PSB2b2lkIDApIHsgY2FsbGJhY2sgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICB9XHJcbiAgICBGaWx0ZXJJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSB0aGlzLl9uZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChVdGlsLmlzVW5kZWZpbmVkKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYWxsYmFjayhpdGVtLCB0aGlzLl9pZHgpKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfSB3aGlsZSAoIVV0aWwuaXNVbmRlZmluZWQoaXRlbSkpO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBGaWx0ZXJJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBGaWx0ZXJJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgSXRlcmF0b3IgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gSXRlcmF0b3Ioc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5faWR4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5fYnVmZmVycyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3JldmVyc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG4gICAgfVxyXG4gICAgSXRlcmF0b3IucHJvdG90eXBlLmdldEl0ZXJhdG9yRnJvbVBpcGVsaW5lID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIHR5cGUpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIHZhciBzb3VyY2UgPSB0aGlzO1xyXG4gICAgICAgIHdoaWxlICghKChzb3VyY2UgPSBzb3VyY2UuX3NvdXJjZSkgaW5zdGFuY2VvZiB0eXBlKSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc291cmNlO1xyXG4gICAgfTtcclxuICAgIEl0ZXJhdG9yLnByb3RvdHlwZS5fbmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAodGhpcy5fc291cmNlIGluc3RhbmNlb2YgSXRlcmF0b3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZS5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcmV2ZXJzZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pZHggPCB0aGlzLl9zb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbiA9IHRoaXMuX3NvdXJjZVt0aGlzLl9zb3VyY2UubGVuZ3RoIC0gMSAtICgrK3RoaXMuX2lkeCldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lkeCA8IHRoaXMuX3NvdXJjZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBuID0gdGhpcy5fc291cmNlWysrdGhpcy5faWR4XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5faWR4ID09IHRoaXMuX3NvdXJjZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5faWR4ID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfTtcclxuICAgIEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkgeyB9O1xyXG4gICAgSXRlcmF0b3IucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX3JldmVyc2VkID0gIXRoaXMuX3JldmVyc2VkOyB9O1xyXG4gICAgcmV0dXJuIEl0ZXJhdG9yO1xyXG59KCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pdGVyYXRvci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIGZpbHRlcl8xID0gcmVxdWlyZShcIi4vZmlsdGVyXCIpO1xyXG52YXIgbWFwXzEgPSByZXF1aXJlKFwiLi9tYXBcIik7XHJcbnZhciBvcmRlcl8xID0gcmVxdWlyZShcIi4vb3JkZXJcIik7XHJcbnZhciBza2lwXzEgPSByZXF1aXJlKFwiLi9za2lwXCIpO1xyXG52YXIgc2tpcFdoaWxlXzEgPSByZXF1aXJlKFwiLi9za2lwV2hpbGVcIik7XHJcbnZhciB0YWtlXzEgPSByZXF1aXJlKFwiLi90YWtlXCIpO1xyXG52YXIgdGFrZVdoaWxlXzEgPSByZXF1aXJlKFwiLi90YWtlV2hpbGVcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBMaW5xID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpbnEoc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gKHNvdXJjZSBpbnN0YW5jZW9mIGl0ZXJhdG9yXzEuZGVmYXVsdClcclxuICAgICAgICAgICAgPyBzb3VyY2VcclxuICAgICAgICAgICAgOiBuZXcgbWFwXzEuZGVmYXVsdChzb3VyY2UsIGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtOyB9KTtcclxuICAgIH1cclxuICAgIExpbnEucHJvdG90eXBlLl9tYWtlVmFsdWVQcmVkaWNhdGUgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKFV0aWwuaXNTdHJpbmcocHJlZGljYXRlKSkge1xyXG4gICAgICAgICAgICB2YXIgZmllbGRfMSA9IHByZWRpY2F0ZTtcclxuICAgICAgICAgICAgcHJlZGljYXRlID0gKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4W2ZpZWxkXzFdOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoVXRpbC5pc1VuZGVmaW5lZChwcmVkaWNhdGUpKSB7XHJcbiAgICAgICAgICAgIHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByZWRpY2F0ZTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5fbWFrZUJvb2xQcmVkaWNhdGUgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKFV0aWwuaXNTdHJpbmcocHJlZGljYXRlKSkge1xyXG4gICAgICAgICAgICB2YXIgZmllbGRfMiA9IHByZWRpY2F0ZTtcclxuICAgICAgICAgICAgcHJlZGljYXRlID0gKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4W2ZpZWxkXzJdID09PSB0cnVlOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoVXRpbC5pc1VuZGVmaW5lZChwcmVkaWNhdGUpKSB7XHJcbiAgICAgICAgICAgIHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByZWRpY2F0ZTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IG1hcF8xLmRlZmF1bHQodGhpcy5fc291cmNlLCBjYWxsYmFjaykpO1xyXG4gICAgfTtcclxuICAgIExpbnEubWFwID0gZnVuY3Rpb24gKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5tYXAoY2FsbGJhY2spLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyBmaWx0ZXJfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgcHJlZGljYXRlKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5maWx0ZXIgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5maWx0ZXIocHJlZGljYXRlKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUud2hlcmUgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyKHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS53aGVyZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBMaW5xLmZpbHRlcihzb3VyY2UsIHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UucmV2ZXJzZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLnRha2UgPSBmdW5jdGlvbiAoY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IHRha2VfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgY291bnQpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnRha2UgPSBmdW5jdGlvbiAoc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnRha2UoY291bnQpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS50YWtlV2hpbGUgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShuZXcgdGFrZVdoaWxlXzEuZGVmYXVsdCh0aGlzLl9zb3VyY2UsIHByZWRpY2F0ZSkpO1xyXG4gICAgfTtcclxuICAgIExpbnEudGFrZVdoaWxlID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnRha2VXaGlsZShwcmVkaWNhdGUpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5za2lwID0gZnVuY3Rpb24gKGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyBza2lwXzEuZGVmYXVsdCh0aGlzLl9zb3VyY2UsIGNvdW50KSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5za2lwID0gZnVuY3Rpb24gKHNvdXJjZSwgY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5za2lwKGNvdW50KS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuc2tpcFdoaWxlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IHNraXBXaGlsZV8xLmRlZmF1bHQodGhpcy5fc291cmNlLCBwcmVkaWNhdGUpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnNraXBXaGlsZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5za2lwV2hpbGUocHJlZGljYXRlKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUub3JkZXJCeSA9IGZ1bmN0aW9uIChrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yRm4gPSB0aGlzLl9tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpO1xyXG4gICAgICAgIHJldHVybiBuZXcgT3JkZXJlZExpbnEobmV3IG9yZGVyXzEuZGVmYXVsdCh0aGlzLl9zb3VyY2UsIHNlbGVjdG9yRm4sIGNvbXBhcmVyLCBmYWxzZSkpO1xyXG4gICAgfTtcclxuICAgIExpbnEub3JkZXJCeSA9IGZ1bmN0aW9uIChzb3VyY2UsIGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5vcmRlckJ5KGtleVNlbGVjdG9yLCBjb21wYXJlcikudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLm9yZGVyQnlEZXNjID0gZnVuY3Rpb24gKGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICB2YXIgc2VsZWN0b3JGbiA9IHRoaXMuX21ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3Rvcik7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBPcmRlcmVkTGlucShuZXcgb3JkZXJfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgc2VsZWN0b3JGbiwgY29tcGFyZXIsIHRydWUpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLm9yZGVyQnlEZXNjID0gZnVuY3Rpb24gKHNvdXJjZSwga2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLm9yZGVyQnlEZXNjKGtleVNlbGVjdG9yLCBjb21wYXJlcikudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLnN1bSA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICB2YXIgaSwgc3VtID0gMCwgYXJyID0gdGhpcy50b0FycmF5KCk7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzdW0gKz0gc2VsZWN0b3IoYXJyW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgIH07XHJcbiAgICBMaW5xLnN1bSA9IGZ1bmN0aW9uIChzb3VyY2UsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnN1bShzZWxlY3Rvcik7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuYXZlcmFnZSA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICB2YXIgaSwgdG90YWwgPSAwLCBhcnIgPSB0aGlzLnRvQXJyYXkoKTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRvdGFsICs9IHNlbGVjdG9yKGFycltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b3RhbCAvIGFyci5sZW5ndGg7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuYXZnID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmF2ZXJhZ2Uoc2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIExpbnEuYXZlcmFnZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLmF2ZXJhZ2Uoc2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIExpbnEuYXZnID0gZnVuY3Rpb24gKHNvdXJjZSwgc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgcmV0dXJuIExpbnEuYXZlcmFnZShzb3VyY2UsIHNlbGVjdG9yKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluLmFwcGx5KHVuZGVmaW5lZCwgdGhpcy50b0FycmF5KCkubWFwKHNlbGVjdG9yKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5taW4gPSBmdW5jdGlvbiAoc291cmNlLCBzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5taW4oc2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkodW5kZWZpbmVkLCB0aGlzLnRvQXJyYXkoKS5tYXAoc2VsZWN0b3IpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLm1heCA9IGZ1bmN0aW9uIChzb3VyY2UsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLm1heChzZWxlY3Rvcik7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuYW55ID0gZnVuY3Rpb24gKHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICAgICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmZpcnN0KGZ1bmN0aW9uICh4KSB7IHJldHVybiAhIXByZWRpY2F0ZSh4KSAhPT0gaW52ZXJ0OyB9KSAhPT0gXCJ1bmRlZmluZWRcIjtcclxuICAgIH07XHJcbiAgICBMaW5xLmFueSA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICAgICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuYW55KHByZWRpY2F0ZSwgaW52ZXJ0KTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5hbGwgPSBmdW5jdGlvbiAocHJlZGljYXRlLCBpbnZlcnQpIHtcclxuICAgICAgICBpZiAoaW52ZXJ0ID09PSB2b2lkIDApIHsgaW52ZXJ0ID0gZmFsc2U7IH1cclxuICAgICAgICByZXR1cm4gISh0aGlzLmFueShwcmVkaWNhdGUsICFpbnZlcnQpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLmFsbCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICAgICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuYWxsKHByZWRpY2F0ZSwgaW52ZXJ0KTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5zaW5nbGUgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IHRoaXMuZmlsdGVyKHByZWRpY2F0ZSkudGFrZSgyKS50b0FycmF5KCk7XHJcbiAgICAgICAgaWYgKGFyci5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHNlcXVlbmNlIGlzIGVtcHR5LlwiKTtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PSAyKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgaW5wdXQgc2VxdWVuY2UgY29udGFpbnMgbW9yZSB0aGFuIG9uZSBlbGVtZW50LlwiKTtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PSAxKVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyWzBdO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgICBMaW5xLnNpbmdsZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLnNpbmdsZShwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfSk7IH1cclxuICAgICAgICB2YXIgYXJyID0gdGhpcy5maWx0ZXIocHJlZGljYXRlKS50YWtlKDEpLnRvQXJyYXkoKTtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PSAxKVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyWzBdO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgICBMaW5xLmZpcnN0ID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9KTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLmZpcnN0KHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUubGFzdCA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pOyB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpLmZpcnN0KHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5sYXN0ID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9KTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLmxhc3QocHJlZGljYXRlKTtcclxuICAgIH07XHJcbiAgICBMaW5xLmludGVyc2VjdCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgdmFyIG1vcmUgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDI7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBtb3JlW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGlzdHMgPSBbXSwgcmVzdWx0ID0gW107XHJcbiAgICAgICAgdmFyIGxpc3QgPSAoYSBpbnN0YW5jZW9mIExpbnEpID8gYSA6IG5ldyBMaW5xKFV0aWwuY2FzdChhKSk7XHJcbiAgICAgICAgbGlzdHMucHVzaCgoYiBpbnN0YW5jZW9mIExpbnEpID8gYiA6IG5ldyBMaW5xKFV0aWwuY2FzdChiKSkpO1xyXG4gICAgICAgIG1vcmUuZm9yRWFjaChmdW5jdGlvbiAoZGF0YXNldCkge1xyXG4gICAgICAgICAgICBsaXN0cy5wdXNoKChkYXRhc2V0IGluc3RhbmNlb2YgTGlucSkgPyBkYXRhc2V0IDogbmV3IExpbnEoVXRpbC5jYXN0KGRhdGFzZXQpKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHZhciBleGlzdHMgPSB0cnVlO1xyXG4gICAgICAgICAgICBsaXN0cy5mb3JFYWNoKGZ1bmN0aW9uIChvdGhlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvdGhlci5jb250YWlucyhpdGVtKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGV4aXN0cyA9IGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChleGlzdHMpXHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLmludGVyc2VjdCA9IGZ1bmN0aW9uIChvdGhlcikge1xyXG4gICAgICAgIHZhciBtb3JlID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgbW9yZVtfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKExpbnEuaW50ZXJzZWN0LmFwcGx5KExpbnEsIFt0aGlzLCBvdGhlcl0uY29uY2F0KG1vcmUpKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5leGNlcHQgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciBtb3JlID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgbW9yZVtfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxpc3RzID0gW10sIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGxpc3RzLnB1c2goKGEgaW5zdGFuY2VvZiBMaW5xKSA/IGEgOiBuZXcgTGlucShVdGlsLmNhc3QoYSkpKTtcclxuICAgICAgICBsaXN0cy5wdXNoKChiIGluc3RhbmNlb2YgTGlucSkgPyBiIDogbmV3IExpbnEoVXRpbC5jYXN0KGIpKSk7XHJcbiAgICAgICAgbW9yZS5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhc2V0KSB7XHJcbiAgICAgICAgICAgIGxpc3RzLnB1c2goKGRhdGFzZXQgaW5zdGFuY2VvZiBMaW5xKSA/IGRhdGFzZXQgOiBuZXcgTGlucShVdGlsLmNhc3QoZGF0YXNldCkpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBsaXN0cy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0KSB7XHJcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGV4aXN0cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgbGlzdHMuZm9yRWFjaChmdW5jdGlvbiAob3RoZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdCA9PT0gb3RoZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXIuY29udGFpbnMoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChleGlzdHMgPSB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFleGlzdHMpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuZXhjZXB0ID0gZnVuY3Rpb24gKG90aGVyKSB7XHJcbiAgICAgICAgdmFyIG1vcmUgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBtb3JlW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoTGlucS5leGNlcHQuYXBwbHkoTGlucSwgW3RoaXMsIG90aGVyXS5jb25jYXQobW9yZSkpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLmRpc3RpbmN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkYXRhc2V0cyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXRzW19pIC0gMF0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGlzdHMgPSBbXSwgcmVzdWx0ID0gW107XHJcbiAgICAgICAgZGF0YXNldHMuZm9yRWFjaChmdW5jdGlvbiAoZGF0YXNldCkge1xyXG4gICAgICAgICAgICBsaXN0cy5wdXNoKChkYXRhc2V0IGluc3RhbmNlb2YgTGlucSkgPyBkYXRhc2V0IDogbmV3IExpbnEoVXRpbC5jYXN0KGRhdGFzZXQpKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGlzdHMuZm9yRWFjaChmdW5jdGlvbiAobGlzdCkge1xyXG4gICAgICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuaW5kZXhPZihpdGVtKSA9PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5kaXN0aW5jdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoTGlucS5kaXN0aW5jdCh0aGlzKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuZ3JvdXBCeSA9IGZ1bmN0aW9uIChrZXlTZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciBpLCBhcnIgPSBbXSwgb3JpZ2luYWwgPSB0aGlzLnRvQXJyYXkoKSwgcHJlZCA9IHRoaXMuX21ha2VWYWx1ZVByZWRpY2F0ZShrZXlTZWxlY3RvciksIGdyb3VwLCBncm91cFZhbHVlO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcmlnaW5hbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBncm91cFZhbHVlID0gcHJlZChvcmlnaW5hbFtpXSk7XHJcbiAgICAgICAgICAgIGdyb3VwID0gbmV3IExpbnEoYXJyKS5maXJzdChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5rZXkgPT0gZ3JvdXBWYWx1ZTsgfSk7XHJcbiAgICAgICAgICAgIGlmICghZ3JvdXApIHtcclxuICAgICAgICAgICAgICAgIGdyb3VwID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleTogZ3JvdXBWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IFtdXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2goZ3JvdXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdyb3VwLnZhbHVlcy5wdXNoKG9yaWdpbmFsW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKGFycik7XHJcbiAgICB9O1xyXG4gICAgTGlucS5ncm91cEJ5ID0gZnVuY3Rpb24gKHNvdXJjZSwga2V5U2VsZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5ncm91cEJ5KGtleVNlbGVjdG9yKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVzLCBhcnIgPSBbXTtcclxuICAgICAgICBpZiAoVXRpbC5pc0FycmF5KHRoaXMuX3NvdXJjZSkpIHtcclxuICAgICAgICAgICAgYXJyID0gVXRpbC5jYXN0KHRoaXMuX3NvdXJjZSkuc2xpY2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHJlcyA9IHRoaXMuX3NvdXJjZS5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIVV0aWwuaXNVbmRlZmluZWQocmVzKSlcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChyZXMpO1xyXG4gICAgICAgICAgICB9IHdoaWxlICghVXRpbC5pc1VuZGVmaW5lZChyZXMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IHRoaXMudG9BcnJheSgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhhcnJbaV0sIGkpID09PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgIHZhciByZXN1bHQ7XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtID09PSBhKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiByZXN1bHQgIT09IFwidW5kZWZpbmVkXCI7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpbnE7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGlucTtcclxuZnVuY3Rpb24gTFEoc291cmNlKSB7XHJcbiAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKTtcclxufVxyXG5leHBvcnRzLkxRID0gTFE7XHJcbnZhciBPcmRlcmVkTGlucSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoT3JkZXJlZExpbnEsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBPcmRlcmVkTGlucShzb3VyY2UpIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpO1xyXG4gICAgfVxyXG4gICAgT3JkZXJlZExpbnEucHJvdG90eXBlLnRoZW5CeSA9IGZ1bmN0aW9uIChrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yRm4gPSB0aGlzLl9tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpO1xyXG4gICAgICAgIHZhciBvcmRlckl0ZXJhdG9yID0gdGhpcy5fc291cmNlLmdldEl0ZXJhdG9yRnJvbVBpcGVsaW5lKG9yZGVyXzEuZGVmYXVsdCk7XHJcbiAgICAgICAgb3JkZXJJdGVyYXRvci50aGVuQnkoc2VsZWN0b3JGbiwgY29tcGFyZXIsIGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBPcmRlcmVkTGlucS5wcm90b3R5cGUudGhlbkJ5RGVzYyA9IGZ1bmN0aW9uIChrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yRm4gPSB0aGlzLl9tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpO1xyXG4gICAgICAgIHZhciBvcmRlckl0ZXJhdG9yID0gdGhpcy5fc291cmNlLmdldEl0ZXJhdG9yRnJvbVBpcGVsaW5lKG9yZGVyXzEuZGVmYXVsdCk7XHJcbiAgICAgICAgb3JkZXJJdGVyYXRvci50aGVuQnkoc2VsZWN0b3JGbiwgY29tcGFyZXIsIHRydWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBPcmRlcmVkTGlucTtcclxufShMaW5xKSk7XHJcbmV4cG9ydHMuT3JkZXJlZExpbnEgPSBPcmRlcmVkTGlucTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlucS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIExpbnFNYXBJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoTGlucU1hcEl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gTGlucU1hcEl0ZXJhdG9yKHNvdXJjZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICB9XHJcbiAgICBMaW5xTWFwSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9uZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuICghVXRpbC5pc1VuZGVmaW5lZChpdGVtKSlcclxuICAgICAgICAgICAgPyB0aGlzLl9jYWxsYmFjayhpdGVtLCB0aGlzLl9pZHgpXHJcbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaW5xTWFwSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGlucU1hcEl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBPcmRlckl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhPcmRlckl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gT3JkZXJJdGVyYXRvcihzb3VyY2UsIGtleVNlbGVjdG9yLCBjb21wYXJlciwgZGVzY2VuZGluZykge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICBpZiAoZGVzY2VuZGluZyA9PT0gdm9pZCAwKSB7IGRlc2NlbmRpbmcgPSBmYWxzZTsgfVxyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5faXNPcmRlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fb3JkZXJzID0gW25ldyBMaW5xT3JkZXIoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKV07XHJcbiAgICAgICAgdGhpcy5fZGVzY2VuZGluZyA9IGRlc2NlbmRpbmc7XHJcbiAgICAgICAgdGhpcy5fYnVmZmVycyA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBPcmRlckl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc09yZGVyZWQpIHtcclxuICAgICAgICAgICAgdmFyIGFyciA9IFtdLCBpdGVtID0gdm9pZCAwO1xyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9IHdoaWxlICghVXRpbC5pc1VuZGVmaW5lZChpdGVtKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IGFyci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaSA9IDAsIHJzO1xyXG4gICAgICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJzID0gX3RoaXMuX29yZGVyc1tpKytdLmNvbXBhcmUoYSwgYik7XHJcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChycyA9PT0gMCAmJiBpIDwgX3RoaXMuX29yZGVycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5faXNPcmRlcmVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25leHQoKTtcclxuICAgIH07XHJcbiAgICBPcmRlckl0ZXJhdG9yLnByb3RvdHlwZS50aGVuQnkgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIGlmIChkZXNjZW5kaW5nID09PSB2b2lkIDApIHsgZGVzY2VuZGluZyA9IGZhbHNlOyB9XHJcbiAgICAgICAgdGhpcy5fb3JkZXJzLnB1c2gobmV3IExpbnFPcmRlcihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gT3JkZXJJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBPcmRlckl0ZXJhdG9yO1xyXG52YXIgTGlucU9yZGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpbnFPcmRlcihrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgaWYgKGRlc2NlbmRpbmcgPT09IHZvaWQgMCkgeyBkZXNjZW5kaW5nID0gZmFsc2U7IH1cclxuICAgICAgICB0aGlzLl9rZXlTZWxlY3RvciA9IGtleVNlbGVjdG9yO1xyXG4gICAgICAgIHRoaXMuX2NvbXBhcmVyID0gY29tcGFyZXI7XHJcbiAgICAgICAgdGhpcy5fZGVzY2VuZGluZyA9IGRlc2NlbmRpbmc7XHJcbiAgICB9XHJcbiAgICBMaW5xT3JkZXIucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fZGVzY2VuZGluZyA/IC0xIDogMSkgKiB0aGlzLl9jb21wYXJlcih0aGlzLl9rZXlTZWxlY3RvcihhKSwgdGhpcy5fa2V5U2VsZWN0b3IoYikpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaW5xT3JkZXI7XHJcbn0oKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9yZGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgU2tpcEl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhTa2lwSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBTa2lwSXRlcmF0b3Ioc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5fY291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5fY291bnQgPSBjb3VudDtcclxuICAgIH1cclxuICAgIFNraXBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKDsgdGhpcy5fY291bnRlciA8IHRoaXMuX2NvdW50OyB0aGlzLl9jb3VudGVyKyspIHtcclxuICAgICAgICAgICAgdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fbmV4dCgpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTa2lwSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gU2tpcEl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgU2tpcFdoaWxlSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFNraXBXaGlsZUl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gU2tpcFdoaWxlSXRlcmF0b3Ioc291cmNlLCBfcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKF9wcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBfcHJlZGljYXRlID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgICAgICB0aGlzLl9kb25lID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcHJlZGljYXRlID0gX3ByZWRpY2F0ZTtcclxuICAgIH1cclxuICAgIFNraXBXaGlsZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgaXRlbSA9IHRoaXMuX25leHQoKTtcclxuICAgICAgICB9IHdoaWxlICghdGhpcy5fZG9uZSAmJiB0aGlzLl9wcmVkaWNhdGUoaXRlbSwgdGhpcy5faWR4KSk7XHJcbiAgICAgICAgdGhpcy5fZG9uZSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNraXBXaGlsZUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFNraXBXaGlsZUl0ZXJhdG9yO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwV2hpbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBUYWtlSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFRha2VJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFRha2VJdGVyYXRvcihzb3VyY2UsIGNvdW50KSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgICAgICB0aGlzLl9jb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLl9jb3VudCA9IGNvdW50O1xyXG4gICAgfVxyXG4gICAgVGFrZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb3VudGVyIDwgdGhpcy5fY291bnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY291bnRlcisrO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gVGFrZUl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFRha2VJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIFRha2VXaGlsZUl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhUYWtlV2hpbGVJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFRha2VXaGlsZUl0ZXJhdG9yKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5fcHJlZGljYXRlID0gcHJlZGljYXRlO1xyXG4gICAgfVxyXG4gICAgVGFrZVdoaWxlSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG4gPSB0aGlzLl9uZXh0KCk7XHJcbiAgICAgICAgaWYgKCEhdGhpcy5fcHJlZGljYXRlKG4sIHRoaXMuX2lkeCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG47XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBUYWtlV2hpbGVJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBUYWtlV2hpbGVJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZVdoaWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBkZWZhdWx0U2VsZWN0b3IoYSkge1xyXG4gICAgcmV0dXJuIGNhc3QoYSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0U2VsZWN0b3IgPSBkZWZhdWx0U2VsZWN0b3I7XHJcbmZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlcihhLCBiKSB7XHJcbiAgICBpZiAoYSA8IGIpXHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgZWxzZSBpZiAoYSA+IGIpXHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0Q29tcGFyZXIgPSBkZWZhdWx0Q29tcGFyZXI7XHJcbmZ1bmN0aW9uIGRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyKGEsIGIpIHtcclxuICAgIHJldHVybiBhID09PSBiO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXIgPSBkZWZhdWx0RXF1YWxpdHlDb21wYXJlcjtcclxuZnVuY3Rpb24gZGVmYXVsdFByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdFByZWRpY2F0ZSA9IGRlZmF1bHRQcmVkaWNhdGU7XHJcbmZ1bmN0aW9uIGNhc3QoYSkge1xyXG4gICAgcmV0dXJuIGE7XHJcbn1cclxuZXhwb3J0cy5jYXN0ID0gY2FzdDtcclxuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xyXG59XHJcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcclxuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcclxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCI7XHJcbn1cclxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xyXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIjtcclxufVxyXG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XHJcbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgTnVtYmVyXVwiO1xyXG59XHJcbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcclxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xyXG59XHJcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XHJcbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcclxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcclxufVxyXG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xyXG5mdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBEYXRlXVwiO1xyXG59XHJcbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlsLmpzLm1hcCJdfQ==
;
return {
'Collections': require('Collections'),
'Helpers': require('Helpers'),
'Linq': require('Linq')
};
});
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

},{"./collections/binaryTree":2,"./collections/linkedList":3,"./collections/list":4,"./collections/queue":5,"./collections/stack":6}],2:[function(require,module,exports){
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

},{"../util":21,"./queue":5}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"../util":21}],5:[function(require,module,exports){
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

},{"./linkedList":3}],6:[function(require,module,exports){
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

},{"./linkedList":3}],7:[function(require,module,exports){
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

},{"./helpers/dates":8,"./helpers/numbers":9,"./helpers/strings":10}],8:[function(require,module,exports){
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

},{"../util":21}],9:[function(require,module,exports){
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

},{"../util":21}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./linq/filter":12,"./linq/iterator":13,"./linq/linq":14,"./linq/map":15,"./linq/order":16,"./linq/skip":17,"./linq/skipWhile":18,"./linq/take":19,"./linq/takeWhile":20}],12:[function(require,module,exports){
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

},{"../util":21,"./iterator":13}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"../util":21,"./filter":12,"./iterator":13,"./map":15,"./order":16,"./skip":17,"./skipWhile":18,"./take":19,"./takeWhile":20}],15:[function(require,module,exports){
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

},{"../util":21,"./iterator":13}],16:[function(require,module,exports){
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

},{"../util":21,"./iterator":13}],17:[function(require,module,exports){
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

},{"./iterator":13}],18:[function(require,module,exports){
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

},{"../util":21,"./iterator":13}],19:[function(require,module,exports){
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

},{"./iterator":13}],20:[function(require,module,exports){
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

},{"../util":21,"./iterator":13}],21:[function(require,module,exports){
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

},{}],"index":[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("./linq"));
__export(require("./helpers"));
__export(require("./collections"));
__export(require("./util"));

},{"./collections":1,"./helpers":7,"./linq":11,"./util":21}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL2JpbmFyeVRyZWUuanMiLCJkaXN0L3NyYy9jb2xsZWN0aW9ucy9saW5rZWRMaXN0LmpzIiwiZGlzdC9zcmMvY29sbGVjdGlvbnMvbGlzdC5qcyIsImRpc3Qvc3JjL2NvbGxlY3Rpb25zL3F1ZXVlLmpzIiwiZGlzdC9zcmMvY29sbGVjdGlvbnMvc3RhY2suanMiLCJkaXN0L3NyYy9oZWxwZXJzLmpzIiwiZGlzdC9zcmMvaGVscGVycy9kYXRlcy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvbnVtYmVycy5qcyIsImRpc3Qvc3JjL2hlbHBlcnMvc3RyaW5ncy5qcyIsImRpc3Qvc3JjL2xpbnEuanMiLCJkaXN0L3NyYy9saW5xL2ZpbHRlci5qcyIsImRpc3Qvc3JjL2xpbnEvaXRlcmF0b3IuanMiLCJkaXN0L3NyYy9saW5xL2xpbnEuanMiLCJkaXN0L3NyYy9saW5xL21hcC5qcyIsImRpc3Qvc3JjL2xpbnEvb3JkZXIuanMiLCJkaXN0L3NyYy9saW5xL3NraXAuanMiLCJkaXN0L3NyYy9saW5xL3NraXBXaGlsZS5qcyIsImRpc3Qvc3JjL2xpbnEvdGFrZS5qcyIsImRpc3Qvc3JjL2xpbnEvdGFrZVdoaWxlLmpzIiwiZGlzdC9zcmMvdXRpbC5qcyIsImRpc3Qvc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGxpc3RfMSA9IHJlcXVpcmUoXCIuL2NvbGxlY3Rpb25zL2xpc3RcIik7XHJcbmV4cG9ydHMuTGlzdCA9IGxpc3RfMS5kZWZhdWx0O1xyXG52YXIgbGlua2VkTGlzdF8xID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbnMvbGlua2VkTGlzdFwiKTtcclxuZXhwb3J0cy5MaW5rZWRMaXN0ID0gbGlua2VkTGlzdF8xLmRlZmF1bHQ7XHJcbnZhciBzdGFja18xID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbnMvc3RhY2tcIik7XHJcbmV4cG9ydHMuU3RhY2sgPSBzdGFja18xLmRlZmF1bHQ7XHJcbnZhciBxdWV1ZV8xID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbnMvcXVldWVcIik7XHJcbmV4cG9ydHMuUXVldWUgPSBxdWV1ZV8xLmRlZmF1bHQ7XHJcbnZhciBiaW5hcnlUcmVlXzEgPSByZXF1aXJlKFwiLi9jb2xsZWN0aW9ucy9iaW5hcnlUcmVlXCIpO1xyXG5leHBvcnRzLkJpbmFyeVRyZWUgPSBiaW5hcnlUcmVlXzEuZGVmYXVsdDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29sbGVjdGlvbnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBxdWV1ZV8xID0gcmVxdWlyZShcIi4vcXVldWVcIik7XHJcbnZhciBCaW5hcnlUcmVlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEJpbmFyeVRyZWUoY29tcGFyZUZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuX2NvbXBhcmUgPSBjb21wYXJlRnVuY3Rpb24gfHwgVXRpbC5kZWZhdWx0Q29tcGFyZXI7XHJcbiAgICB9XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gdGhpcy5pbnNlcnRBdXgodGhpcy5fcm9vdCwgbmV3IFRyZWVOb2RlKGl0ZW0pKTsgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmluc2VydFJhbmdlID0gZnVuY3Rpb24gKGl0ZW1zKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IF90aGlzLmluc2VydChpdGVtKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuaW5zZXJ0QXV4ID0gZnVuY3Rpb24gKHRyZWUsIG5vZGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3Jvb3QpIHtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29tcCA9IHRoaXMuX2NvbXBhcmUobm9kZS52YWx1ZSwgdHJlZS52YWx1ZSk7XHJcbiAgICAgICAgaWYgKGNvbXAgPCAwKSB7XHJcbiAgICAgICAgICAgIGlmICh0cmVlLmxlZnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QXV4KHRyZWUubGVmdCwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlLmxlZnQgPSBub2RlO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSB0cmVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY29tcCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHRyZWUucmlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QXV4KHRyZWUucmlnaHQsIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJlZS5yaWdodCA9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHRyZWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX3NlYXJjaCh0aGlzLl9yb290LCBpdGVtKTtcclxuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICBpZiAobm9kZS52YWx1ZSA8IG5vZGUucGFyZW50LnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIG5vZGUucGFyZW50LmxlZnQ7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLnBhcmVudC5yaWdodDtcclxuICAgICAgICAgICAgZGVsZXRlIG5vZGUucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHZhciByaWdodCA9IG5vZGU7XHJcbiAgICAgICAgICAgIHdoaWxlIChyaWdodC5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC5yaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmlnaHQubGVmdCkge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC5sZWZ0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHJpZ2h0LnZhbHVlICE9PSBub2RlLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQubGVmdCA9IHJpZ2h0LnBhcmVudC5sZWZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0LmxlZnQucGFyZW50ID0gcmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJpZ2h0LnBhcmVudC52YWx1ZSA9PT0gbm9kZS52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC5wYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmlnaHQucGFyZW50ID0gbm9kZS5wYXJlbnQ7XHJcbiAgICAgICAgICAgIG5vZGUubGVmdCA9IG5vZGUucmlnaHQgPSBub2RlLnBhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKG5vZGUgPT09IHRoaXMuX3Jvb3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSByaWdodDtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9yb290LnBhcmVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIHJldHVybiAhIXRoaXMuX3NlYXJjaCh0aGlzLl9yb290LCBpdGVtKTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsKGNhbGxiYWNrKTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcnIgPSBbXTtcclxuICAgICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHsgYXJyLnB1c2goaXRlbSk7IH0pO1xyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucHJlb3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5wcmVvcmRlclRyYXZlcnNhbEF1eCh0aGlzLl9yb290LCBjYWxsYmFjaywgeyBzdG9wOiBmYWxzZSB9KTsgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLnByZW9yZGVyVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICBpZiAoIXRyZWUgfHwgc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBzaWduYWwuc3RvcCA9IChjYWxsYmFjayh0cmVlLnZhbHVlKSA9PT0gZmFsc2UpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5sZWZ0LCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnByZW9yZGVyVHJhdmVyc2FsQXV4KHRyZWUucmlnaHQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmlub3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5pbm9yZGVyVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUuaW5vcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uICh0cmVlLCBjYWxsYmFjaywgc2lnbmFsKSB7XHJcbiAgICAgICAgaWYgKCF0cmVlIHx8IHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsQXV4KHRyZWUubGVmdCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgc2lnbmFsLnN0b3AgPSAoY2FsbGJhY2sodHJlZS52YWx1ZSkgPT09IGZhbHNlKTtcclxuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgodHJlZS5yaWdodCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucG9zdG9yZGVyVHJhdmVyc2FsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7IHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KHRoaXMuX3Jvb3QsIGNhbGxiYWNrLCB7IHN0b3A6IGZhbHNlIH0pOyB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUucG9zdG9yZGVyVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICBpZiAoIXRyZWUgfHwgc2lnbmFsLnN0b3ApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLnBvc3RvcmRlclRyYXZlcnNhbEF1eCh0cmVlLmxlZnQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KHRyZWUucmlnaHQsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHNpZ25hbC5zdG9wID0gKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubGV2ZWxUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHsgdGhpcy5sZXZlbFRyYXZlcnNhbEF1eCh0aGlzLl9yb290LCBjYWxsYmFjaywgeyBzdG9wOiBmYWxzZSB9KTsgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLmxldmVsVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKHRyZWUsIGNhbGxiYWNrLCBzaWduYWwpIHtcclxuICAgICAgICB2YXIgcXVldWUgPSBuZXcgcXVldWVfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKHRyZWUpXHJcbiAgICAgICAgICAgIHF1ZXVlLmVucXVldWUodHJlZSk7XHJcbiAgICAgICAgd2hpbGUgKCFVdGlsLmlzVW5kZWZpbmVkKHRyZWUgPSBxdWV1ZS5kZXF1ZXVlKCkpKSB7XHJcbiAgICAgICAgICAgIHNpZ25hbC5zdG9wID0gc2lnbmFsLnN0b3AgfHwgKGNhbGxiYWNrKHRyZWUudmFsdWUpID09PSBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmIChzaWduYWwuc3RvcClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHRyZWUubGVmdClcclxuICAgICAgICAgICAgICAgIHF1ZXVlLmVucXVldWUodHJlZS5sZWZ0KTtcclxuICAgICAgICAgICAgaWYgKHRyZWUucmlnaHQpXHJcbiAgICAgICAgICAgICAgICBxdWV1ZS5lbnF1ZXVlKHRyZWUucmlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1pbiA9IHRoaXMubWluQXV4KHRoaXMuX3Jvb3QpO1xyXG4gICAgICAgIGlmIChtaW4pXHJcbiAgICAgICAgICAgIHJldHVybiBtaW4udmFsdWU7XHJcbiAgICB9O1xyXG4gICAgQmluYXJ5VHJlZS5wcm90b3R5cGUubWluQXV4ID0gZnVuY3Rpb24gKHRyZWUpIHtcclxuICAgICAgICBpZiAodHJlZS5sZWZ0KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5taW5BdXgodHJlZS5sZWZ0KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0cmVlO1xyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWF4ID0gdGhpcy5tYXhBdXgodGhpcy5fcm9vdCk7XHJcbiAgICAgICAgaWYgKG1heClcclxuICAgICAgICAgICAgcmV0dXJuIG1heC52YWx1ZTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5tYXhBdXggPSBmdW5jdGlvbiAodHJlZSkge1xyXG4gICAgICAgIGlmICh0cmVlLnJpZ2h0KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXhBdXgodHJlZS5yaWdodCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdHJlZTtcclxuICAgIH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5kZXB0aCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuZGVwdGhBdXgodGhpcy5fcm9vdCk7IH07XHJcbiAgICBCaW5hcnlUcmVlLnByb3RvdHlwZS5kZXB0aEF1eCA9IGZ1bmN0aW9uICh0cmVlKSB7XHJcbiAgICAgICAgaWYgKCF0cmVlKVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRoaXMuZGVwdGhBdXgodHJlZS5sZWZ0KSwgdGhpcy5kZXB0aEF1eCh0cmVlLnJpZ2h0KSkgKyAxO1xyXG4gICAgfTtcclxuICAgIEJpbmFyeVRyZWUucHJvdG90eXBlLl9zZWFyY2ggPSBmdW5jdGlvbiAodHJlZSwgaXRlbSkge1xyXG4gICAgICAgIGlmIChVdGlsLmlzVW5kZWZpbmVkKHRyZWUpKVxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBjb21wID0gdGhpcy5fY29tcGFyZShpdGVtLCB0cmVlLnZhbHVlKTtcclxuICAgICAgICBpZiAoY29tcCA8IDApIHtcclxuICAgICAgICAgICAgdHJlZSA9IHRoaXMuX3NlYXJjaCh0cmVlLmxlZnQsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb21wID4gMCkge1xyXG4gICAgICAgICAgICB0cmVlID0gdGhpcy5fc2VhcmNoKHRyZWUucmlnaHQsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJlZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQmluYXJ5VHJlZTtcclxufSgpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBCaW5hcnlUcmVlO1xyXG52YXIgVHJlZU5vZGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVHJlZU5vZGUodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBUcmVlTm9kZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICF0aGlzLmxlZnQgJiYgIXRoaXMucmlnaHQ7IH07XHJcbiAgICByZXR1cm4gVHJlZU5vZGU7XHJcbn0oKSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJpbmFyeVRyZWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBMaW5rZWRMaXN0ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpbmtlZExpc3QoKSB7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuX2dldE5vZGUgPSBmdW5jdGlvbiAoYXQpIHtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgZWxzZSBpZiAoYXQgPT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0O1xyXG4gICAgICAgIGVsc2UgaWYgKGF0ID4gdGhpcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYXN0O1xyXG4gICAgICAgIHZhciBpLCBpdGVtO1xyXG4gICAgICAgIGlmIChhdCA8IHRoaXMubGVuZ3RoIC8gMikge1xyXG4gICAgICAgICAgICBpdGVtID0gdGhpcy5fZmlyc3Q7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhdDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gaXRlbS5uZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpdGVtID0gdGhpcy5fbGFzdDtcclxuICAgICAgICAgICAgZm9yIChpID0gdGhpcy5sZW5ndGggLSAxOyBpID4gYXQ7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW0ucHJldjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoYXQpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2dldE5vZGUoYXQpO1xyXG4gICAgICAgIGlmIChub2RlKVxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZS52YWw7XHJcbiAgICB9O1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gbmV3IExpbmtlZExpc3ROb2RlKHZhbCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9maXJzdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9maXJzdCA9IHRoaXMuX2xhc3QgPSBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaXRlbS5wcmV2ID0gdGhpcy5fbGFzdDtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdC5uZXh0ID0gaXRlbTtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdCA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiArK3RoaXMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmluc2VydEF0ID0gZnVuY3Rpb24gKGF0LCB2YWwpIHtcclxuICAgICAgICBpZiAoYXQgPj0gdGhpcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydCh2YWwpO1xyXG4gICAgICAgIHZhciBpdGVtID0gbmV3IExpbmtlZExpc3ROb2RlKHZhbCksIG5leHQgPSB0aGlzLl9nZXROb2RlKGF0KSwgcHJldiA9IG5leHQucHJldjtcclxuICAgICAgICBpZiAocHJldilcclxuICAgICAgICAgICAgcHJldi5uZXh0ID0gaXRlbTtcclxuICAgICAgICBuZXh0LnByZXYgPSBpdGVtO1xyXG4gICAgICAgIGl0ZW0ucHJldiA9IHByZXY7XHJcbiAgICAgICAgaXRlbS5uZXh0ID0gbmV4dDtcclxuICAgICAgICBpZiAoYXQgPT09IDApXHJcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0ID0gaXRlbTtcclxuICAgICAgICByZXR1cm4gKyt0aGlzLmxlbmd0aDtcclxuICAgIH07XHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5yZW1vdmVBdCA9IGZ1bmN0aW9uIChhdCkge1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9nZXROb2RlKGF0KTtcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLl9sYXN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpdGVtID09PSB0aGlzLl9maXJzdCkge1xyXG4gICAgICAgICAgICBpdGVtLm5leHQucHJldiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSBpdGVtLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGl0ZW0gPT09IHRoaXMuX2xhc3QpIHtcclxuICAgICAgICAgICAgaXRlbS5uZXh0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpdGVtLnByZXYubmV4dCA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpdGVtLnByZXYubmV4dCA9IGl0ZW0ubmV4dDtcclxuICAgICAgICAgICAgaXRlbS5uZXh0LnByZXYgPSBpdGVtLnByZXY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtLXRoaXMubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX2ZpcnN0ID0gdGhpcy5fbGFzdCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpbmtlZExpc3Q7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGlua2VkTGlzdDtcclxudmFyIExpbmtlZExpc3ROb2RlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIExpbmtlZExpc3ROb2RlKHZhbCkge1xyXG4gICAgICAgIHRoaXMudmFsID0gdmFsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIExpbmtlZExpc3ROb2RlO1xyXG59KCkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5rZWRMaXN0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgTGlzdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMaXN0KHNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZSB8fCBbXTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShMaXN0LnByb3RvdHlwZSwgXCJsZW5ndGhcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fc291cmNlLmxlbmd0aDsgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBMaXN0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2U7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2UucHVzaChpdGVtKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LmFkZCA9IGZ1bmN0aW9uIChzb3VyY2UsIGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5hZGQoaXRlbSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmFkZFJhbmdlID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24pIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSAoY29sbGVjdGlvbiBpbnN0YW5jZW9mIExpc3QpID8gY29sbGVjdGlvbi50b0FycmF5KCkgOiBjb2xsZWN0aW9uO1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMuX3NvdXJjZSwgaXRlbXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QuYWRkUmFuZ2UgPSBmdW5jdGlvbiAoc291cmNlLCBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuYWRkUmFuZ2UoY29sbGVjdGlvbikudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmFzUmVhZE9ubHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KE9iamVjdC5mcmVlemUodGhpcy5fc291cmNlLnNsaWNlKCkpKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLmZvckVhY2goY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIExpc3QuZm9yRWFjaCA9IGZ1bmN0aW9uIChzb3VyY2UsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbmV3IExpc3Qoc291cmNlKS5mb3JFYWNoKGNhbGxiYWNrKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gKGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gMDsgfVxyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gdGhpcy5sZW5ndGg7IH1cclxuICAgICAgICB2YXIgaWR4ID0gdGhpcy5fc291cmNlLmluZGV4T2YoaXRlbSwgaW5kZXgpO1xyXG4gICAgICAgIGlmIChpZHggPiBjb3VudCAtIGluZGV4ICsgMSlcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiBpZHg7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5pbmRleE9mID0gZnVuY3Rpb24gKHNvdXJjZSwgaXRlbSwgaW5kZXgsIGNvdW50KSB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSB2b2lkIDApIHsgaW5kZXggPSAwOyB9XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSBzb3VyY2UubGVuZ3RoOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkuaW5kZXhPZihpdGVtLCBpbmRleCwgY291bnQpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gKGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gdGhpcy5sZW5ndGggLSAxOyB9XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSB0aGlzLmxlbmd0aDsgfVxyXG4gICAgICAgIHZhciBpZHggPSB0aGlzLl9zb3VyY2UubGFzdEluZGV4T2YoaXRlbSwgaW5kZXgpO1xyXG4gICAgICAgIGlmIChpZHggPCBpbmRleCArIDEgLSBjb3VudClcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiBpZHg7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIChzb3VyY2UsIGl0ZW0sIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gdm9pZCAwKSB7IGluZGV4ID0gdGhpcy5sZW5ndGggLSAxOyB9XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSB0aGlzLmxlbmd0aDsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmxhc3RJbmRleE9mKGl0ZW0sIGluZGV4LCBjb3VudCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgMCwgaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5pbnNlcnQgPSBmdW5jdGlvbiAoc291cmNlLCBpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmluc2VydChpbmRleCwgaXRlbSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmluc2VydFJhbmdlID0gZnVuY3Rpb24gKGluZGV4LCBjb2xsZWN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gKGNvbGxlY3Rpb24gaW5zdGFuY2VvZiBMaXN0KSA/IGNvbGxlY3Rpb24udG9BcnJheSgpIDogY29sbGVjdGlvbjtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMuX3NvdXJjZSwgbmV3IEFycmF5KGluZGV4LCAwKS5jb25jYXQoaXRlbXMpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0Lmluc2VydFJhbmdlID0gZnVuY3Rpb24gKHNvdXJjZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5pbnNlcnRSYW5nZShpbmRleCwgY29sbGVjdGlvbikudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2VbaW5kZXhdO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIGlmIChpbmRleCA+IHRoaXMubGVuZ3RoKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbmRleCB3YXMgb3V0IG9mIHJhbmdlLiBNdXN0IGJlIG5vbi1uZWdhdGl2ZSBhbmQgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBjb2xsZWN0aW9uLlwiKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZVtpbmRleF0gPSBpdGVtO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlQXQodGhpcy5fc291cmNlLmluZGV4T2YoaXRlbSkpO1xyXG4gICAgfTtcclxuICAgIExpc3QucmVtb3ZlID0gZnVuY3Rpb24gKHNvdXJjZSwgaXRlbSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLnJlbW92ZShpdGVtKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmVtb3ZlQWxsID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmICghcHJlZGljYXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZS5zcGxpY2UoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgaSA9IHZvaWQgMDtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVkaWNhdGUodGhpcy5fc291cmNlW2ldLCBpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NvdXJjZS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIExpc3QucmVtb3ZlQWxsID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlQWxsKHByZWRpY2F0ZSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLnJlbW92ZUF0ID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZW1vdmVBdCA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KHNvdXJjZSkucmVtb3ZlQXQoaW5kZXgpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5yZW1vdmVSYW5nZSA9IGZ1bmN0aW9uIChpbmRleCwgY291bnQpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2Uuc3BsaWNlKGluZGV4LCBjb3VudCArIGluZGV4IC0gMSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5yZW1vdmVSYW5nZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGluZGV4LCBjb3VudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLnJlbW92ZVJhbmdlKGluZGV4LCBjb3VudCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5jbGVhciA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5jbGVhcigpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaXN0LnByb3RvdHlwZS5jb3VudCA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAoIXByZWRpY2F0ZSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NvdXJjZS5sZW5ndGg7XHJcbiAgICAgICAgdmFyIHN1bSA9IDA7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSlcclxuICAgICAgICAgICAgICAgIHN1bSsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICB9O1xyXG4gICAgTGlzdC5jb3VudCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlzdChzb3VyY2UpLmNvdW50KHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgTGlzdC5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uIChpbmRleCwgY291bnQpIHtcclxuICAgICAgICBpZiAoKFV0aWwuaXNVbmRlZmluZWQoaW5kZXgpICYmIFV0aWwuaXNVbmRlZmluZWQoY291bnQpKSB8fCAoaW5kZXggPT09IDAgJiYgY291bnQgPj0gdGhpcy5sZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZS5yZXZlcnNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChjb3VudCkpXHJcbiAgICAgICAgICAgICAgICBjb3VudCA9IHRoaXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgYXJyID0gdGhpcy5fc291cmNlLnNwbGljZShpbmRleCwgY291bnQgKyBpbmRleCAtIDEpO1xyXG4gICAgICAgICAgICBhcnIucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmluc2VydFJhbmdlKGluZGV4LCBhcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaXN0LnJldmVyc2UgPSBmdW5jdGlvbiAoc291cmNlLCBpbmRleCwgY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpc3Qoc291cmNlKS5yZXZlcnNlKGluZGV4LCBjb3VudCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpc3QucmFuZ2UgPSBmdW5jdGlvbiAoc3RhcnQsIGNvdW50KSB7XHJcbiAgICAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IHN0YXJ0ICsgY291bnQ7IGkrKylcclxuICAgICAgICAgICAgYXJyLnB1c2goaSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0KGFycik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIExpc3Q7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGlzdDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGxpbmtlZExpc3RfMSA9IHJlcXVpcmUoXCIuL2xpbmtlZExpc3RcIik7XHJcbnZhciBRdWV1ZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBRdWV1ZSgpIHtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IG5ldyBsaW5rZWRMaXN0XzEuZGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgUXVldWUucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5pbnNlcnQodmFsKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGggPSB0aGlzLl9saXN0Lmxlbmd0aDtcclxuICAgIH07XHJcbiAgICBRdWV1ZS5wcm90b3R5cGUuZGVxdWV1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2xpc3QuZ2V0KDApO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5fbGlzdC5yZW1vdmVBdCgwKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUXVldWU7XHJcbn0oKSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gUXVldWU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXF1ZXVlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgbGlua2VkTGlzdF8xID0gcmVxdWlyZShcIi4vbGlua2VkTGlzdFwiKTtcclxudmFyIFN0YWNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFN0YWNrKCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSBuZXcgbGlua2VkTGlzdF8xLmRlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIFN0YWNrLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3QuaW5zZXJ0QXQoMCwgdmFsKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5sZW5ndGggPSB0aGlzLl9saXN0Lmxlbmd0aDtcclxuICAgIH07XHJcbiAgICBTdGFjay5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5wZWVrKCk7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLl9saXN0LnJlbW92ZUF0KDApO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfTtcclxuICAgIFN0YWNrLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0LmdldCgwKTtcclxuICAgIH07XHJcbiAgICBTdGFjay5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5jbGVhcigpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTdGFjaztcclxufSgpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBTdGFjaztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhY2suanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBudW1iZXJzXzEgPSByZXF1aXJlKFwiLi9oZWxwZXJzL251bWJlcnNcIik7XHJcbmV4cG9ydHMuTnVtYmVycyA9IG51bWJlcnNfMS5kZWZhdWx0O1xyXG5leHBvcnRzLk51bWJlcnNIZWxwZXIgPSBudW1iZXJzXzEuTnVtYmVyc0hlbHBlcjtcclxudmFyIHN0cmluZ3NfMSA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvc3RyaW5nc1wiKTtcclxuZXhwb3J0cy5TdHJpbmdzID0gc3RyaW5nc18xLmRlZmF1bHQ7XHJcbmV4cG9ydHMuU3RyaW5nc0hlbHBlciA9IHN0cmluZ3NfMS5TdHJpbmdzSGVscGVyO1xyXG52YXIgZGF0ZXNfMSA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvZGF0ZXNcIik7XHJcbmV4cG9ydHMuRGF0ZXMgPSBkYXRlc18xLmRlZmF1bHQ7XHJcbmV4cG9ydHMuRGF0ZXNIZWxwZXIgPSBkYXRlc18xLkRhdGVzSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1oZWxwZXJzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG5mdW5jdGlvbiBEYXRlcyhkYXRlKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSk7IH1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBEYXRlcztcclxudmFyIERhdGVzSGVscGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIERhdGVzSGVscGVyKGRhdGUpIHtcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlO1xyXG4gICAgfVxyXG4gICAgRGF0ZXNIZWxwZXIudG9EYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChkYXRlKSlcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNTdHJpbmcoZGF0ZSkpXHJcbiAgICAgICAgICAgIGRhdGUgPSBEYXRlLnBhcnNlKGRhdGUpO1xyXG4gICAgICAgIGlmICh1dGlsLmlzTnVtYmVyKGRhdGUpKVxyXG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGU7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmJldHdlZW4gPSBmdW5jdGlvbiAobG93ZXIsIHVwcGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIERhdGVzSGVscGVyLmJldHdlZW4odGhpcy5kYXRlLCBsb3dlciwgdXBwZXIpO1xyXG4gICAgfTtcclxuICAgIERhdGVzSGVscGVyLmJldHdlZW4gPSBmdW5jdGlvbiAoZGF0ZSwgbG93ZXIsIHVwcGVyKSB7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQobG93ZXIpKVxyXG4gICAgICAgICAgICBsb3dlciA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQodXBwZXIpKVxyXG4gICAgICAgICAgICB1cHBlciA9IG5ldyBEYXRlKDk5OTk5OTk5OTk5OTkpO1xyXG4gICAgICAgIHJldHVybiAobG93ZXIgPD0gZGF0ZSAmJiBkYXRlIDw9IHVwcGVyKTtcclxuICAgIH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkWWVhcnMgPSBmdW5jdGlvbiAoeWVhcnMpIHsgcmV0dXJuIHRoaXMuYWRkTW9udGhzKHllYXJzICogMTIpOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZE1vbnRocyA9IGZ1bmN0aW9uIChtb250aHMpIHtcclxuICAgICAgICB0aGlzLmRhdGUuc2V0TW9udGgodGhpcy5kYXRlLmdldE1vbnRoKCkgKyBtb250aHMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRXZWVrcyA9IGZ1bmN0aW9uICh3ZWVrKSB7IHJldHVybiB0aGlzLmFkZERheXMod2VlayAqIDcpOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZERheXMgPSBmdW5jdGlvbiAoZGF5cykgeyByZXR1cm4gdGhpcy5hZGRIb3VycyhkYXlzICogMjQpOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIucHJvdG90eXBlLmFkZEhvdXJzID0gZnVuY3Rpb24gKGhvdXJzKSB7IHJldHVybiB0aGlzLmFkZE1pbnV0ZXMoaG91cnMgKiA2MCk7IH07XHJcbiAgICBEYXRlc0hlbHBlci5wcm90b3R5cGUuYWRkTWludXRlcyA9IGZ1bmN0aW9uIChtaW51dGVzKSB7IHJldHVybiB0aGlzLmFkZFNlY29uZHMobWludXRlcyAqIDYwKTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRTZWNvbmRzID0gZnVuY3Rpb24gKHNlY29uZHMpIHsgcmV0dXJuIHRoaXMuYWRkTWlsbGlzZWNvbmRzKHNlY29uZHMgKiAxMDAwKTsgfTtcclxuICAgIERhdGVzSGVscGVyLnByb3RvdHlwZS5hZGRNaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAobWlsbGlzZWNvbmRzKSB7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNldE1pbGxpc2Vjb25kcyh0aGlzLmRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgKyBtaWxsaXNlY29uZHMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZFllYXJzID0gZnVuY3Rpb24gKGRhdGUsIHllYXJzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkWWVhcnMoeWVhcnMpLmRhdGU7IH07XHJcbiAgICBEYXRlc0hlbHBlci5hZGRNb250aHMgPSBmdW5jdGlvbiAoZGF0ZSwgbW9udGhzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkTW9udGhzKG1vbnRocykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZFdlZWtzID0gZnVuY3Rpb24gKGRhdGUsIHdlZWspIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRXZWVrcyh3ZWVrKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkRGF5cyA9IGZ1bmN0aW9uIChkYXRlLCBkYXlzKSB7IHJldHVybiBuZXcgRGF0ZXNIZWxwZXIoZGF0ZSkuYWRkRGF5cyhkYXlzKS5kYXRlOyB9O1xyXG4gICAgRGF0ZXNIZWxwZXIuYWRkSG91cnMgPSBmdW5jdGlvbiAoZGF0ZSwgaG91cnMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRIb3Vycyhob3VycykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZE1pbnV0ZXMgPSBmdW5jdGlvbiAoZGF0ZSwgbWludXRlcykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZE1pbnV0ZXMobWludXRlcykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZFNlY29uZHMgPSBmdW5jdGlvbiAoZGF0ZSwgc2Vjb25kcykgeyByZXR1cm4gbmV3IERhdGVzSGVscGVyKGRhdGUpLmFkZFNlY29uZHMoc2Vjb25kcykuZGF0ZTsgfTtcclxuICAgIERhdGVzSGVscGVyLmFkZE1pbGxpc2Vjb25kcyA9IGZ1bmN0aW9uIChkYXRlLCBtaWxsaXNlY29uZHMpIHsgcmV0dXJuIG5ldyBEYXRlc0hlbHBlcihkYXRlKS5hZGRNaWxsaXNlY29uZHMobWlsbGlzZWNvbmRzKS5kYXRlOyB9O1xyXG4gICAgcmV0dXJuIERhdGVzSGVscGVyO1xyXG59KCkpO1xyXG5leHBvcnRzLkRhdGVzSGVscGVyID0gRGF0ZXNIZWxwZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG5mdW5jdGlvbiBOdW1iZXJzKG51bSkgeyByZXR1cm4gbmV3IE51bWJlcnNIZWxwZXIobnVtKTsgfVxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IE51bWJlcnM7XHJcbnZhciBOdW1iZXJzSGVscGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIE51bWJlcnNIZWxwZXIobnVtKSB7XHJcbiAgICAgICAgdGhpcy5udW0gPSBudW07XHJcbiAgICB9XHJcbiAgICBOdW1iZXJzSGVscGVyLnByb3RvdHlwZS5iZXR3ZWVuID0gZnVuY3Rpb24gKGxvd2VyLCB1cHBlcikge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXJzSGVscGVyLmJldHdlZW4odGhpcy5udW0sIGxvd2VyLCB1cHBlcik7XHJcbiAgICB9O1xyXG4gICAgTnVtYmVyc0hlbHBlci5iZXR3ZWVuID0gZnVuY3Rpb24gKG51bSwgbG93ZXIsIHVwcGVyKSB7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQobG93ZXIpKVxyXG4gICAgICAgICAgICBsb3dlciA9IE51bWJlci5NSU5fVkFMVUU7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQodXBwZXIpKVxyXG4gICAgICAgICAgICB1cHBlciA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgICAgcmV0dXJuIChsb3dlciA8PSBudW0gJiYgbnVtIDw9IHVwcGVyKTtcclxuICAgIH07XHJcbiAgICBOdW1iZXJzSGVscGVyLnByb3RvdHlwZS5pbiA9IGZ1bmN0aW9uIChudW1iZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcnNIZWxwZXIuaW4odGhpcy5udW0sIG51bWJlcnMpO1xyXG4gICAgfTtcclxuICAgIE51bWJlcnNIZWxwZXIuaW4gPSBmdW5jdGlvbiAobnVtLCBudW1iZXJzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1iZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChudW1iZXJzW2ldID09IG51bSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgTnVtYmVyc0hlbHBlci5wcm90b3R5cGUudG9GaXhlZCA9IGZ1bmN0aW9uIChwcmVjaXNpb24pIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyc0hlbHBlci50b0ZpeGVkKHRoaXMubnVtLCBwcmVjaXNpb24pO1xyXG4gICAgfTtcclxuICAgIE51bWJlcnNIZWxwZXIudG9GaXhlZCA9IGZ1bmN0aW9uIChudW0sIHByZWNpc2lvbikge1xyXG4gICAgICAgIHJldHVybiArKE1hdGgucm91bmQoKyhudW0udG9TdHJpbmcoKSArIFwiZVwiICsgcHJlY2lzaW9uKSkudG9TdHJpbmcoKSArIFwiZVwiICsgLXByZWNpc2lvbik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE51bWJlcnNIZWxwZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuTnVtYmVyc0hlbHBlciA9IE51bWJlcnNIZWxwZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW51bWJlcnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmZ1bmN0aW9uIFN0cmluZ3Moc3RyKSB7IHJldHVybiBuZXcgU3RyaW5nc0hlbHBlcihzdHIpOyB9XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gU3RyaW5ncztcclxudmFyIFN0cmluZ3NIZWxwZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gU3RyaW5nc0hlbHBlcihzdHIpIHtcclxuICAgICAgICB0aGlzLnN0ciA9IHN0cjtcclxuICAgIH1cclxuICAgIFN0cmluZ3NIZWxwZXIucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFyZ3NbX2kgLSAwXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBTdHJpbmdzSGVscGVyLmZvcm1hdC5hcHBseSh1bmRlZmluZWQsIFt0aGlzLnN0cl0uY29uY2F0KGFyZ3MpKTtcclxuICAgIH07XHJcbiAgICBTdHJpbmdzSGVscGVyLmZvcm1hdCA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiXFxcXHtcIiArIGkgKyBcIlxcXFx9XCIsIFwiZ1wiKTtcclxuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocmVnZXgsIGFyZ3NbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTdHJpbmdzSGVscGVyO1xyXG59KCkpO1xyXG5leHBvcnRzLlN0cmluZ3NIZWxwZXIgPSBTdHJpbmdzSGVscGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdHJpbmdzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2xpbnEvaXRlcmF0b3JcIik7XHJcbmV4cG9ydHMuSXRlcmF0b3IgPSBpdGVyYXRvcl8xLmRlZmF1bHQ7XHJcbnZhciBmaWx0ZXJfMSA9IHJlcXVpcmUoXCIuL2xpbnEvZmlsdGVyXCIpO1xyXG5leHBvcnRzLkZpbHRlckl0ZXJhdG9yID0gZmlsdGVyXzEuZGVmYXVsdDtcclxudmFyIG1hcF8xID0gcmVxdWlyZShcIi4vbGlucS9tYXBcIik7XHJcbmV4cG9ydHMuTWFwSXRlcmF0b3IgPSBtYXBfMS5kZWZhdWx0O1xyXG52YXIgb3JkZXJfMSA9IHJlcXVpcmUoXCIuL2xpbnEvb3JkZXJcIik7XHJcbmV4cG9ydHMuT3JkZXJJdGVyYXRvciA9IG9yZGVyXzEuZGVmYXVsdDtcclxudmFyIHNraXBfMSA9IHJlcXVpcmUoXCIuL2xpbnEvc2tpcFwiKTtcclxuZXhwb3J0cy5Ta2lwSXRlcmF0b3IgPSBza2lwXzEuZGVmYXVsdDtcclxudmFyIHNraXBXaGlsZV8xID0gcmVxdWlyZShcIi4vbGlucS9za2lwV2hpbGVcIik7XHJcbmV4cG9ydHMuU2tpcFdoaWxlSXRlcmF0b3IgPSBza2lwV2hpbGVfMS5kZWZhdWx0O1xyXG52YXIgdGFrZV8xID0gcmVxdWlyZShcIi4vbGlucS90YWtlXCIpO1xyXG5leHBvcnRzLlRha2VJdGVyYXRvciA9IHRha2VfMS5kZWZhdWx0O1xyXG52YXIgdGFrZVdoaWxlXzEgPSByZXF1aXJlKFwiLi9saW5xL3Rha2VXaGlsZVwiKTtcclxuZXhwb3J0cy5UYWtlV2hpbGVJdGVyYXRvciA9IHRha2VXaGlsZV8xLmRlZmF1bHQ7XHJcbnZhciBsaW5xXzEgPSByZXF1aXJlKFwiLi9saW5xL2xpbnFcIik7XHJcbmV4cG9ydHMuTGlucSA9IGxpbnFfMS5kZWZhdWx0O1xyXG5leHBvcnRzLkxRID0gbGlucV8xLkxRO1xyXG5leHBvcnRzLk9yZGVyZWRMaW5xID0gbGlucV8xLk9yZGVyZWRMaW5xO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5xLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgRmlsdGVySXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEZpbHRlckl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gRmlsdGVySXRlcmF0b3Ioc291cmNlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChjYWxsYmFjayA9PT0gdm9pZCAwKSB7IGNhbGxiYWNrID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG4gICAgRmlsdGVySXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGl0ZW07XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBpdGVtID0gdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgICAgICBpZiAoVXRpbC5pc1VuZGVmaW5lZChpdGVtKSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY2FsbGJhY2soaXRlbSwgdGhpcy5faWR4KSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH0gd2hpbGUgKCFVdGlsLmlzVW5kZWZpbmVkKGl0ZW0pKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRmlsdGVySXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRmlsdGVySXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIEl0ZXJhdG9yID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEl0ZXJhdG9yKHNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuX2lkeCA9IC0xO1xyXG4gICAgICAgIHRoaXMuX2J1ZmZlcnMgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9yZXZlcnNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgIH1cclxuICAgIEl0ZXJhdG9yLnByb3RvdHlwZS5nZXRJdGVyYXRvckZyb21QaXBlbGluZSA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiB0eXBlKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB2YXIgc291cmNlID0gdGhpcztcclxuICAgICAgICB3aGlsZSAoISgoc291cmNlID0gc291cmNlLl9zb3VyY2UpIGluc3RhbmNlb2YgdHlwZSkpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcclxuICAgIH07XHJcbiAgICBJdGVyYXRvci5wcm90b3R5cGUuX25leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG4gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NvdXJjZSBpbnN0YW5jZW9mIEl0ZXJhdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zb3VyY2UubmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JldmVyc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faWR4IDwgdGhpcy5fc291cmNlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG4gPSB0aGlzLl9zb3VyY2VbdGhpcy5fc291cmNlLmxlbmd0aCAtIDEgLSAoKyt0aGlzLl9pZHgpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pZHggPCB0aGlzLl9zb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbiA9IHRoaXMuX3NvdXJjZVsrK3RoaXMuX2lkeF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2lkeCA9PSB0aGlzLl9zb3VyY2UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lkeCA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH07XHJcbiAgICBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgIEl0ZXJhdG9yLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24gKCkgeyB0aGlzLl9yZXZlcnNlZCA9ICF0aGlzLl9yZXZlcnNlZDsgfTtcclxuICAgIHJldHVybiBJdGVyYXRvcjtcclxufSgpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXRlcmF0b3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBmaWx0ZXJfMSA9IHJlcXVpcmUoXCIuL2ZpbHRlclwiKTtcclxudmFyIG1hcF8xID0gcmVxdWlyZShcIi4vbWFwXCIpO1xyXG52YXIgb3JkZXJfMSA9IHJlcXVpcmUoXCIuL29yZGVyXCIpO1xyXG52YXIgc2tpcF8xID0gcmVxdWlyZShcIi4vc2tpcFwiKTtcclxudmFyIHNraXBXaGlsZV8xID0gcmVxdWlyZShcIi4vc2tpcFdoaWxlXCIpO1xyXG52YXIgdGFrZV8xID0gcmVxdWlyZShcIi4vdGFrZVwiKTtcclxudmFyIHRha2VXaGlsZV8xID0gcmVxdWlyZShcIi4vdGFrZVdoaWxlXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgTGlucSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMaW5xKHNvdXJjZSkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IChzb3VyY2UgaW5zdGFuY2VvZiBpdGVyYXRvcl8xLmRlZmF1bHQpXHJcbiAgICAgICAgICAgID8gc291cmNlXHJcbiAgICAgICAgICAgIDogbmV3IG1hcF8xLmRlZmF1bHQoc291cmNlLCBmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gaXRlbTsgfSk7XHJcbiAgICB9XHJcbiAgICBMaW5xLnByb3RvdHlwZS5fbWFrZVZhbHVlUHJlZGljYXRlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChVdGlsLmlzU3RyaW5nKHByZWRpY2F0ZSkpIHtcclxuICAgICAgICAgICAgdmFyIGZpZWxkXzEgPSBwcmVkaWNhdGU7XHJcbiAgICAgICAgICAgIHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoeCkgeyByZXR1cm4geFtmaWVsZF8xXTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKFV0aWwuaXNVbmRlZmluZWQocHJlZGljYXRlKSkge1xyXG4gICAgICAgICAgICBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcmVkaWNhdGU7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuX21ha2VCb29sUHJlZGljYXRlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChVdGlsLmlzU3RyaW5nKHByZWRpY2F0ZSkpIHtcclxuICAgICAgICAgICAgdmFyIGZpZWxkXzIgPSBwcmVkaWNhdGU7XHJcbiAgICAgICAgICAgIHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoeCkgeyByZXR1cm4geFtmaWVsZF8yXSA9PT0gdHJ1ZTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKFV0aWwuaXNVbmRlZmluZWQocHJlZGljYXRlKSkge1xyXG4gICAgICAgICAgICBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcmVkaWNhdGU7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyBtYXBfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgY2FsbGJhY2spKTtcclxuICAgIH07XHJcbiAgICBMaW5xLm1hcCA9IGZ1bmN0aW9uIChzb3VyY2UsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkubWFwKGNhbGxiYWNrKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShuZXcgZmlsdGVyXzEuZGVmYXVsdCh0aGlzLl9zb3VyY2UsIHByZWRpY2F0ZSkpO1xyXG4gICAgfTtcclxuICAgIExpbnEuZmlsdGVyID0gZnVuY3Rpb24gKHNvdXJjZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuZmlsdGVyKHByZWRpY2F0ZSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLndoZXJlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpbHRlcihwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIExpbnEud2hlcmUgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gTGlucS5maWx0ZXIoc291cmNlLCBwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fc291cmNlLnJldmVyc2UoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS50YWtlID0gZnVuY3Rpb24gKGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyB0YWtlXzEuZGVmYXVsdCh0aGlzLl9zb3VyY2UsIGNvdW50KSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS50YWtlID0gZnVuY3Rpb24gKHNvdXJjZSwgY291bnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS50YWtlKGNvdW50KS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUudGFrZVdoaWxlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEobmV3IHRha2VXaGlsZV8xLmRlZmF1bHQodGhpcy5fc291cmNlLCBwcmVkaWNhdGUpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnRha2VXaGlsZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS50YWtlV2hpbGUocHJlZGljYXRlKS50b0FycmF5KCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuc2tpcCA9IGZ1bmN0aW9uIChjb3VudCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShuZXcgc2tpcF8xLmRlZmF1bHQodGhpcy5fc291cmNlLCBjb3VudCkpO1xyXG4gICAgfTtcclxuICAgIExpbnEuc2tpcCA9IGZ1bmN0aW9uIChzb3VyY2UsIGNvdW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuc2tpcChjb3VudCkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLnNraXBXaGlsZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKG5ldyBza2lwV2hpbGVfMS5kZWZhdWx0KHRoaXMuX3NvdXJjZSwgcHJlZGljYXRlKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5za2lwV2hpbGUgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gVXRpbC5kZWZhdWx0UHJlZGljYXRlOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuc2tpcFdoaWxlKHByZWRpY2F0ZSkudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLm9yZGVyQnkgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIHZhciBzZWxlY3RvckZuID0gdGhpcy5fbWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKTtcclxuICAgICAgICByZXR1cm4gbmV3IE9yZGVyZWRMaW5xKG5ldyBvcmRlcl8xLmRlZmF1bHQodGhpcy5fc291cmNlLCBzZWxlY3RvckZuLCBjb21wYXJlciwgZmFsc2UpKTtcclxuICAgIH07XHJcbiAgICBMaW5xLm9yZGVyQnkgPSBmdW5jdGlvbiAoc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkub3JkZXJCeShrZXlTZWxlY3RvciwgY29tcGFyZXIpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5vcmRlckJ5RGVzYyA9IGZ1bmN0aW9uIChrZXlTZWxlY3RvciwgY29tcGFyZXIpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgdmFyIHNlbGVjdG9yRm4gPSB0aGlzLl9tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpO1xyXG4gICAgICAgIHJldHVybiBuZXcgT3JkZXJlZExpbnEobmV3IG9yZGVyXzEuZGVmYXVsdCh0aGlzLl9zb3VyY2UsIHNlbGVjdG9yRm4sIGNvbXBhcmVyLCB0cnVlKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5vcmRlckJ5RGVzYyA9IGZ1bmN0aW9uIChzb3VyY2UsIGtleVNlbGVjdG9yLCBjb21wYXJlcikge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5vcmRlckJ5RGVzYyhrZXlTZWxlY3RvciwgY29tcGFyZXIpLnRvQXJyYXkoKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5zdW0gPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgdmFyIGksIHN1bSA9IDAsIGFyciA9IHRoaXMudG9BcnJheSgpO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgc3VtICs9IHNlbGVjdG9yKGFycltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdW07XHJcbiAgICB9O1xyXG4gICAgTGlucS5zdW0gPSBmdW5jdGlvbiAoc291cmNlLCBzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvciA9PT0gdm9pZCAwKSB7IHNlbGVjdG9yID0gVXRpbC5kZWZhdWx0U2VsZWN0b3I7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5zdW0oc2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLmF2ZXJhZ2UgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHZvaWQgMCkgeyBzZWxlY3RvciA9IFV0aWwuZGVmYXVsdFNlbGVjdG9yOyB9XHJcbiAgICAgICAgdmFyIGksIHRvdGFsID0gMCwgYXJyID0gdGhpcy50b0FycmF5KCk7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0b3RhbCArPSBzZWxlY3RvcihhcnJbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG90YWwgLyBhcnIubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIExpbnEuYXZlcmFnZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yID09PSB2b2lkIDApIHsgc2VsZWN0b3IgPSBVdGlsLmRlZmF1bHRTZWxlY3RvcjsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLmF2ZXJhZ2Uoc2VsZWN0b3IpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLmFueSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUsIGludmVydCkge1xyXG4gICAgICAgIGlmIChpbnZlcnQgPT09IHZvaWQgMCkgeyBpbnZlcnQgPSBmYWxzZTsgfVxyXG4gICAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5maXJzdChmdW5jdGlvbiAoeCkgeyByZXR1cm4gISFwcmVkaWNhdGUoeCkgIT09IGludmVydDsgfSkgIT09IFwidW5kZWZpbmVkXCI7XHJcbiAgICB9O1xyXG4gICAgTGlucS5hbnkgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUsIGludmVydCkge1xyXG4gICAgICAgIGlmIChpbnZlcnQgPT09IHZvaWQgMCkgeyBpbnZlcnQgPSBmYWxzZTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLmFueShwcmVkaWNhdGUsIGludmVydCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuYWxsID0gZnVuY3Rpb24gKHByZWRpY2F0ZSwgaW52ZXJ0KSB7XHJcbiAgICAgICAgaWYgKGludmVydCA9PT0gdm9pZCAwKSB7IGludmVydCA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuICEodGhpcy5hbnkocHJlZGljYXRlLCAhaW52ZXJ0KSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5hbGwgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUsIGludmVydCkge1xyXG4gICAgICAgIGlmIChpbnZlcnQgPT09IHZvaWQgMCkgeyBpbnZlcnQgPSBmYWxzZTsgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShzb3VyY2UpLmFsbChwcmVkaWNhdGUsIGludmVydCk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuc2luZ2xlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xyXG4gICAgICAgIHZhciBhcnIgPSB0aGlzLmZpbHRlcihwcmVkaWNhdGUpLnRha2UoMikudG9BcnJheSgpO1xyXG4gICAgICAgIGlmIChhcnIubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBzZXF1ZW5jZSBpcyBlbXB0eS5cIik7XHJcbiAgICAgICAgaWYgKGFyci5sZW5ndGggPT0gMilcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGlucHV0IHNlcXVlbmNlIGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgZWxlbWVudC5cIik7XHJcbiAgICAgICAgaWYgKGFyci5sZW5ndGggPT0gMSlcclxuICAgICAgICAgICAgcmV0dXJuIGFyclswXTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgTGlucS5zaW5nbGUgPSBmdW5jdGlvbiAoc291cmNlLCBwcmVkaWNhdGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5zaW5nbGUocHJlZGljYXRlKTtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5maXJzdCA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAocHJlZGljYXRlID09PSB2b2lkIDApIHsgcHJlZGljYXRlID0gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pOyB9XHJcbiAgICAgICAgdmFyIGFyciA9IHRoaXMuZmlsdGVyKHByZWRpY2F0ZSkudGFrZSgxKS50b0FycmF5KCk7XHJcbiAgICAgICAgaWYgKGFyci5sZW5ndGggPT0gMSlcclxuICAgICAgICAgICAgcmV0dXJuIGFyclswXTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgTGlucS5maXJzdCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfSk7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5maXJzdChwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHByZWRpY2F0ZSA9PT0gdm9pZCAwKSB7IHByZWRpY2F0ZSA9IChmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9KTsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnJldmVyc2UoKS5maXJzdChwcmVkaWNhdGUpO1xyXG4gICAgfTtcclxuICAgIExpbnEubGFzdCA9IGZ1bmN0aW9uIChzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSAoZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZTsgfSk7IH1cclxuICAgICAgICByZXR1cm4gbmV3IExpbnEoc291cmNlKS5sYXN0KHByZWRpY2F0ZSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5pbnRlcnNlY3QgPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgIHZhciBtb3JlID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgbW9yZVtfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxpc3RzID0gW10sIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHZhciBsaXN0ID0gKGEgaW5zdGFuY2VvZiBMaW5xKSA/IGEgOiBuZXcgTGlucShVdGlsLmNhc3QoYSkpO1xyXG4gICAgICAgIGxpc3RzLnB1c2goKGIgaW5zdGFuY2VvZiBMaW5xKSA/IGIgOiBuZXcgTGlucShVdGlsLmNhc3QoYikpKTtcclxuICAgICAgICBtb3JlLmZvckVhY2goZnVuY3Rpb24gKGRhdGFzZXQpIHtcclxuICAgICAgICAgICAgbGlzdHMucHVzaCgoZGF0YXNldCBpbnN0YW5jZW9mIExpbnEpID8gZGF0YXNldCA6IG5ldyBMaW5xKFV0aWwuY2FzdChkYXRhc2V0KSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICB2YXIgZXhpc3RzID0gdHJ1ZTtcclxuICAgICAgICAgICAgbGlzdHMuZm9yRWFjaChmdW5jdGlvbiAob3RoZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICghb3RoZXIuY29udGFpbnMoaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChleGlzdHMgPSBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RzKVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBMaW5xLnByb3RvdHlwZS5pbnRlcnNlY3QgPSBmdW5jdGlvbiAob3RoZXIpIHtcclxuICAgICAgICB2YXIgbW9yZSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIG1vcmVbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShMaW5xLmludGVyc2VjdC5hcHBseShMaW5xLCBbdGhpcywgb3RoZXJdLmNvbmNhdChtb3JlKSkpO1xyXG4gICAgfTtcclxuICAgIExpbnEuZXhjZXB0ID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICB2YXIgbW9yZSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIG1vcmVbX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsaXN0cyA9IFtdLCByZXN1bHQgPSBbXTtcclxuICAgICAgICBsaXN0cy5wdXNoKChhIGluc3RhbmNlb2YgTGlucSkgPyBhIDogbmV3IExpbnEoVXRpbC5jYXN0KGEpKSk7XHJcbiAgICAgICAgbGlzdHMucHVzaCgoYiBpbnN0YW5jZW9mIExpbnEpID8gYiA6IG5ldyBMaW5xKFV0aWwuY2FzdChiKSkpO1xyXG4gICAgICAgIG1vcmUuZm9yRWFjaChmdW5jdGlvbiAoZGF0YXNldCkge1xyXG4gICAgICAgICAgICBsaXN0cy5wdXNoKChkYXRhc2V0IGluc3RhbmNlb2YgTGlucSkgPyBkYXRhc2V0IDogbmV3IExpbnEoVXRpbC5jYXN0KGRhdGFzZXQpKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGlzdHMuZm9yRWFjaChmdW5jdGlvbiAobGlzdCkge1xyXG4gICAgICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBleGlzdHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGxpc3RzLmZvckVhY2goZnVuY3Rpb24gKG90aGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QgPT09IG90aGVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyLmNvbnRhaW5zKGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZXhpc3RzID0gdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmICghZXhpc3RzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLmV4Y2VwdCA9IGZ1bmN0aW9uIChvdGhlcikge1xyXG4gICAgICAgIHZhciBtb3JlID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgbW9yZVtfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKExpbnEuZXhjZXB0LmFwcGx5KExpbnEsIFt0aGlzLCBvdGhlcl0uY29uY2F0KG1vcmUpKSk7XHJcbiAgICB9O1xyXG4gICAgTGlucS5kaXN0aW5jdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGF0YXNldHMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBkYXRhc2V0c1tfaSAtIDBdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxpc3RzID0gW10sIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGRhdGFzZXRzLmZvckVhY2goZnVuY3Rpb24gKGRhdGFzZXQpIHtcclxuICAgICAgICAgICAgbGlzdHMucHVzaCgoZGF0YXNldCBpbnN0YW5jZW9mIExpbnEpID8gZGF0YXNldCA6IG5ldyBMaW5xKFV0aWwuY2FzdChkYXRhc2V0KSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxpc3RzLmZvckVhY2goZnVuY3Rpb24gKGxpc3QpIHtcclxuICAgICAgICAgICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmluZGV4T2YoaXRlbSkgPT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuZGlzdGluY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKExpbnEuZGlzdGluY3QodGhpcykpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLmdyb3VwQnkgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgaSwgYXJyID0gW10sIG9yaWdpbmFsID0gdGhpcy50b0FycmF5KCksIHByZWQgPSB0aGlzLl9tYWtlVmFsdWVQcmVkaWNhdGUoa2V5U2VsZWN0b3IpLCBncm91cCwgZ3JvdXBWYWx1ZTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb3JpZ2luYWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ3JvdXBWYWx1ZSA9IHByZWQob3JpZ2luYWxbaV0pO1xyXG4gICAgICAgICAgICBncm91cCA9IG5ldyBMaW5xKGFycikuZmlyc3QoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHgua2V5ID09IGdyb3VwVmFsdWU7IH0pO1xyXG4gICAgICAgICAgICBpZiAoIWdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IGdyb3VwVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBbXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKGdyb3VwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBncm91cC52YWx1ZXMucHVzaChvcmlnaW5hbFtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgTGlucShhcnIpO1xyXG4gICAgfTtcclxuICAgIExpbnEuZ3JvdXBCeSA9IGZ1bmN0aW9uIChzb3VyY2UsIGtleVNlbGVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSkuZ3JvdXBCeShrZXlTZWxlY3RvcikudG9BcnJheSgpO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJlcywgYXJyID0gW107XHJcbiAgICAgICAgaWYgKFV0aWwuaXNBcnJheSh0aGlzLl9zb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIGFyciA9IFV0aWwuY2FzdCh0aGlzLl9zb3VyY2UpLnNsaWNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSB0aGlzLl9zb3VyY2UubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFVdGlsLmlzVW5kZWZpbmVkKHJlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2gocmVzKTtcclxuICAgICAgICAgICAgfSB3aGlsZSAoIVV0aWwuaXNVbmRlZmluZWQocmVzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG4gICAgTGlucS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBhcnIgPSB0aGlzLnRvQXJyYXkoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2soYXJyW2ldLCBpKSA9PT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuICAgIExpbnEucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICB2YXIgcmVzdWx0O1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gYSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ICE9PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBMaW5xO1xyXG59KCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IExpbnE7XHJcbmZ1bmN0aW9uIExRKHNvdXJjZSkge1xyXG4gICAgcmV0dXJuIG5ldyBMaW5xKHNvdXJjZSk7XHJcbn1cclxuZXhwb3J0cy5MUSA9IExRO1xyXG52YXIgT3JkZXJlZExpbnEgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKE9yZGVyZWRMaW5xLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gT3JkZXJlZExpbnEoc291cmNlKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgIH1cclxuICAgIE9yZGVyZWRMaW5xLnByb3RvdHlwZS50aGVuQnkgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIHZhciBzZWxlY3RvckZuID0gdGhpcy5fbWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKTtcclxuICAgICAgICB2YXIgb3JkZXJJdGVyYXRvciA9IHRoaXMuX3NvdXJjZS5nZXRJdGVyYXRvckZyb21QaXBlbGluZShvcmRlcl8xLmRlZmF1bHQpO1xyXG4gICAgICAgIG9yZGVySXRlcmF0b3IudGhlbkJ5KHNlbGVjdG9yRm4sIGNvbXBhcmVyLCBmYWxzZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgT3JkZXJlZExpbnEucHJvdG90eXBlLnRoZW5CeURlc2MgPSBmdW5jdGlvbiAoa2V5U2VsZWN0b3IsIGNvbXBhcmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIHZhciBzZWxlY3RvckZuID0gdGhpcy5fbWFrZVZhbHVlUHJlZGljYXRlKGtleVNlbGVjdG9yKTtcclxuICAgICAgICB2YXIgb3JkZXJJdGVyYXRvciA9IHRoaXMuX3NvdXJjZS5nZXRJdGVyYXRvckZyb21QaXBlbGluZShvcmRlcl8xLmRlZmF1bHQpO1xyXG4gICAgICAgIG9yZGVySXRlcmF0b3IudGhlbkJ5KHNlbGVjdG9yRm4sIGNvbXBhcmVyLCB0cnVlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICByZXR1cm4gT3JkZXJlZExpbnE7XHJcbn0oTGlucSkpO1xyXG5leHBvcnRzLk9yZGVyZWRMaW5xID0gT3JkZXJlZExpbnE7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbnEuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBMaW5xTWFwSXRlcmF0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKExpbnFNYXBJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIExpbnFNYXBJdGVyYXRvcihzb3VyY2UsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgc291cmNlKTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG4gICAgTGlucU1hcEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgIHJldHVybiAoIVV0aWwuaXNVbmRlZmluZWQoaXRlbSkpXHJcbiAgICAgICAgICAgID8gdGhpcy5fY2FsbGJhY2soaXRlbSwgdGhpcy5faWR4KVxyXG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlucU1hcEl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IExpbnFNYXBJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xyXG52YXIgT3JkZXJJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoT3JkZXJJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIE9yZGVySXRlcmF0b3Ioc291cmNlLCBrZXlTZWxlY3RvciwgY29tcGFyZXIsIGRlc2NlbmRpbmcpIHtcclxuICAgICAgICBpZiAoY29tcGFyZXIgPT09IHZvaWQgMCkgeyBjb21wYXJlciA9IFV0aWwuZGVmYXVsdENvbXBhcmVyOyB9XHJcbiAgICAgICAgaWYgKGRlc2NlbmRpbmcgPT09IHZvaWQgMCkgeyBkZXNjZW5kaW5nID0gZmFsc2U7IH1cclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpO1xyXG4gICAgICAgIHRoaXMuX2lzT3JkZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX29yZGVycyA9IFtuZXcgTGlucU9yZGVyKGtleVNlbGVjdG9yLCBjb21wYXJlciwgZGVzY2VuZGluZyldO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NlbmRpbmcgPSBkZXNjZW5kaW5nO1xyXG4gICAgICAgIHRoaXMuX2J1ZmZlcnMgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgT3JkZXJJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICghdGhpcy5faXNPcmRlcmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBhcnIgPSBbXSwgaXRlbSA9IHZvaWQgMDtcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHRoaXMuX25leHQoKTtcclxuICAgICAgICAgICAgICAgIGlmICghVXRpbC5pc1VuZGVmaW5lZChpdGVtKSlcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfSB3aGlsZSAoIVV0aWwuaXNVbmRlZmluZWQoaXRlbSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9zb3VyY2UgPSBhcnIuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGkgPSAwLCBycztcclxuICAgICAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgICAgICBycyA9IF90aGlzLl9vcmRlcnNbaSsrXS5jb21wYXJlKGEsIGIpO1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAocnMgPT09IDAgJiYgaSA8IF90aGlzLl9vcmRlcnMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBycztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzT3JkZXJlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9uZXh0KCk7XHJcbiAgICB9O1xyXG4gICAgT3JkZXJJdGVyYXRvci5wcm90b3R5cGUudGhlbkJ5ID0gZnVuY3Rpb24gKGtleVNlbGVjdG9yLCBjb21wYXJlciwgZGVzY2VuZGluZykge1xyXG4gICAgICAgIGlmIChjb21wYXJlciA9PT0gdm9pZCAwKSB7IGNvbXBhcmVyID0gVXRpbC5kZWZhdWx0Q29tcGFyZXI7IH1cclxuICAgICAgICBpZiAoZGVzY2VuZGluZyA9PT0gdm9pZCAwKSB7IGRlc2NlbmRpbmcgPSBmYWxzZTsgfVxyXG4gICAgICAgIHRoaXMuX29yZGVycy5wdXNoKG5ldyBMaW5xT3JkZXIoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE9yZGVySXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gT3JkZXJJdGVyYXRvcjtcclxudmFyIExpbnFPcmRlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMaW5xT3JkZXIoa2V5U2VsZWN0b3IsIGNvbXBhcmVyLCBkZXNjZW5kaW5nKSB7XHJcbiAgICAgICAgaWYgKGNvbXBhcmVyID09PSB2b2lkIDApIHsgY29tcGFyZXIgPSBVdGlsLmRlZmF1bHRDb21wYXJlcjsgfVxyXG4gICAgICAgIGlmIChkZXNjZW5kaW5nID09PSB2b2lkIDApIHsgZGVzY2VuZGluZyA9IGZhbHNlOyB9XHJcbiAgICAgICAgdGhpcy5fa2V5U2VsZWN0b3IgPSBrZXlTZWxlY3RvcjtcclxuICAgICAgICB0aGlzLl9jb21wYXJlciA9IGNvbXBhcmVyO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NlbmRpbmcgPSBkZXNjZW5kaW5nO1xyXG4gICAgfVxyXG4gICAgTGlucU9yZGVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX2Rlc2NlbmRpbmcgPyAtMSA6IDEpICogdGhpcy5fY29tcGFyZXIodGhpcy5fa2V5U2VsZWN0b3IoYSksIHRoaXMuX2tleVNlbGVjdG9yKGIpKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlucU9yZGVyO1xyXG59KCkpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1vcmRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFNraXBJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoU2tpcEl0ZXJhdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gU2tpcEl0ZXJhdG9yKHNvdXJjZSwgY291bnQpIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpO1xyXG4gICAgICAgIHRoaXMuX2NvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuX2NvdW50ID0gY291bnQ7XHJcbiAgICB9XHJcbiAgICBTa2lwSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZm9yICg7IHRoaXMuX2NvdW50ZXIgPCB0aGlzLl9jb3VudDsgdGhpcy5fY291bnRlcisrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX25leHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25leHQoKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU2tpcEl0ZXJhdG9yO1xyXG59KGl0ZXJhdG9yXzEuZGVmYXVsdCkpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFNraXBJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIFV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcclxudmFyIFNraXBXaGlsZUl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhTa2lwV2hpbGVJdGVyYXRvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFNraXBXaGlsZUl0ZXJhdG9yKHNvdXJjZSwgX3ByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChfcHJlZGljYXRlID09PSB2b2lkIDApIHsgX3ByZWRpY2F0ZSA9IFV0aWwuZGVmYXVsdFByZWRpY2F0ZTsgfVxyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5fZG9uZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3ByZWRpY2F0ZSA9IF9wcmVkaWNhdGU7XHJcbiAgICB9XHJcbiAgICBTa2lwV2hpbGVJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXRlbTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSB0aGlzLl9uZXh0KCk7XHJcbiAgICAgICAgfSB3aGlsZSAoIXRoaXMuX2RvbmUgJiYgdGhpcy5fcHJlZGljYXRlKGl0ZW0sIHRoaXMuX2lkeCkpO1xyXG4gICAgICAgIHRoaXMuX2RvbmUgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTa2lwV2hpbGVJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBTa2lwV2hpbGVJdGVyYXRvcjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcFdoaWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgVGFrZUl0ZXJhdG9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhUYWtlSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBUYWtlSXRlcmF0b3Ioc291cmNlLCBjb3VudCkge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5fY291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5fY291bnQgPSBjb3VudDtcclxuICAgIH1cclxuICAgIFRha2VJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY291bnRlciA8IHRoaXMuX2NvdW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIrKztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25leHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFRha2VJdGVyYXRvcjtcclxufShpdGVyYXRvcl8xLmRlZmF1bHQpKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBUYWtlSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBVdGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XHJcbnZhciBUYWtlV2hpbGVJdGVyYXRvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoVGFrZVdoaWxlSXRlcmF0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBUYWtlV2hpbGVJdGVyYXRvcihzb3VyY2UsIHByZWRpY2F0ZSkge1xyXG4gICAgICAgIGlmIChwcmVkaWNhdGUgPT09IHZvaWQgMCkgeyBwcmVkaWNhdGUgPSBVdGlsLmRlZmF1bHRQcmVkaWNhdGU7IH1cclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBzb3VyY2UpO1xyXG4gICAgICAgIHRoaXMuX3ByZWRpY2F0ZSA9IHByZWRpY2F0ZTtcclxuICAgIH1cclxuICAgIFRha2VXaGlsZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBuID0gdGhpcy5fbmV4dCgpO1xyXG4gICAgICAgIGlmICghIXRoaXMuX3ByZWRpY2F0ZShuLCB0aGlzLl9pZHgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gVGFrZVdoaWxlSXRlcmF0b3I7XHJcbn0oaXRlcmF0b3JfMS5kZWZhdWx0KSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gVGFrZVdoaWxlSXRlcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2VXaGlsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuZnVuY3Rpb24gZGVmYXVsdFNlbGVjdG9yKGEpIHtcclxuICAgIHJldHVybiBjYXN0KGEpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdFNlbGVjdG9yID0gZGVmYXVsdFNlbGVjdG9yO1xyXG5mdW5jdGlvbiBkZWZhdWx0Q29tcGFyZXIoYSwgYikge1xyXG4gICAgaWYgKGEgPCBiKVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIGVsc2UgaWYgKGEgPiBiKVxyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiAwO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdENvbXBhcmVyID0gZGVmYXVsdENvbXBhcmVyO1xyXG5mdW5jdGlvbiBkZWZhdWx0RXF1YWxpdHlDb21wYXJlcihhLCBiKSB7XHJcbiAgICByZXR1cm4gYSA9PT0gYjtcclxufVxyXG5leHBvcnRzLmRlZmF1bHRFcXVhbGl0eUNvbXBhcmVyID0gZGVmYXVsdEVxdWFsaXR5Q29tcGFyZXI7XHJcbmZ1bmN0aW9uIGRlZmF1bHRQcmVkaWNhdGUodmFsdWUsIGluZGV4KSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHRQcmVkaWNhdGUgPSBkZWZhdWx0UHJlZGljYXRlO1xyXG5mdW5jdGlvbiBjYXN0KGEpIHtcclxuICAgIHJldHVybiBhO1xyXG59XHJcbmV4cG9ydHMuY2FzdCA9IGNhc3Q7XHJcbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcclxufVxyXG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XHJcbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiO1xyXG59XHJcbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcclxuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBTdHJpbmddXCI7XHJcbn1cclxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xyXG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHRvU3RyaW5nKHZhbHVlKSA9PT0gXCJbb2JqZWN0IE51bWJlcl1cIjtcclxufVxyXG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHJldHVybiB0b1N0cmluZyh2YWx1ZSkgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcclxufVxyXG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xyXG5mdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XHJcbn1cclxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcclxuZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdG9TdHJpbmcodmFsdWUpID09PSBcIltvYmplY3QgRGF0ZV1cIjtcclxufVxyXG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuZnVuY3Rpb24gX19leHBvcnQobSkge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2xpbnFcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9oZWxwZXJzXCIpKTtcclxuX19leHBvcnQocmVxdWlyZShcIi4vY29sbGVjdGlvbnNcIikpO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi91dGlsXCIpKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl19
return require('index');
});
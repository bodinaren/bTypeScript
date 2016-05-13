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
    List.prototype.addRange = function (collection) {
        var items = (collection instanceof List) ? collection.toArray() : collection;
        Array.prototype.push.apply(this._source, items);
        return this;
    };
    List.prototype.asReadOnly = function () {
        return new List(Object.freeze(this._source.slice()));
    };
    List.prototype.forEach = function (callback) {
        this._source.forEach(callback);
    };
    List.prototype.indexOf = function (item, index, count) {
        if (index === void 0) { index = 0; }
        if (count === void 0) { count = this.length; }
        var idx = this._source.indexOf(item, index);
        if (idx > count - index + 1)
            return -1;
        return idx;
    };
    List.prototype.lastIndexOf = function (item, index, count) {
        if (index === void 0) { index = this.length - 1; }
        if (count === void 0) { count = this.length; }
        var idx = this._source.lastIndexOf(item, index);
        if (idx < index + 1 - count)
            return -1;
        return idx;
    };
    List.prototype.insert = function (index, item) {
        this._source.splice(index, 0, item);
        return this;
    };
    List.prototype.insertRange = function (index, collection) {
        var items = (collection instanceof List) ? collection.toArray() : collection;
        Array.prototype.splice.apply(this._source, new Array(index, 0).concat(items));
        return this;
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
    List.prototype.removeAll = function (predicate) {
        if (!predicate)
            predicate = Util.defaultPredicate;
        var i;
        for (i = 0; i < this.length; i++) {
            if (predicate(this._source[i])) {
                this._source.splice(i, 1);
                i--;
            }
        }
        return this;
    };
    List.prototype.removeAt = function (index) {
        this._source.splice(index, 1);
        return this;
    };
    List.prototype.removeRange = function (index, count) {
        this._source.splice(index, count + index - 1);
        return this;
    };
    List.prototype.clear = function () {
        this.removeAll();
        return this;
    };
    List.prototype.count = function (predicate) {
        if (!predicate)
            return this.length;
        var sum = 0;
        this._source.forEach(function (item) {
            if (predicate(item))
                sum++;
        });
        return sum;
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
    List.range = function (start, count) {
        var arr = [];
        for (var i = start; i < start + count; i++)
            arr.push(i);
        return arr;
    };
    return List;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = List;
//# sourceMappingURL=list.js.map
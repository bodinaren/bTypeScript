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
//# sourceMappingURL=list.js.map
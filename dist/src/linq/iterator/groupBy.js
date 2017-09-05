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
//# sourceMappingURL=groupBy.js.map
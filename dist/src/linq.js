(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./linq/iterator", "./linq/filter", "./linq/map", "./linq/order", "./linq/skip", "./linq/skipWhile", "./linq/take", "./linq/takeWhile", "./linq/linq", "./linq/linqOrdered"], factory);
    }
})(function (require, exports) {
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
    var linqOrdered_1 = require("./linq/linqOrdered");
    exports.LinqOrdered = linqOrdered_1.default;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = linq_1.default;
});
//# sourceMappingURL=linq.js.map
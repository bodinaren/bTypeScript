(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./helpers/numbers", "./helpers/strings", "./helpers/dates"], factory);
    }
})(function (require, exports) {
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
});
//# sourceMappingURL=helpers.js.map
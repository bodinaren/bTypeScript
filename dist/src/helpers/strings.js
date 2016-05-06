(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
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
            return StringsHelper.format.apply(null, [this.str].concat(args));
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
});
//# sourceMappingURL=strings.js.map
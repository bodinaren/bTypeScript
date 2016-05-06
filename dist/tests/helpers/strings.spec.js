(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../src/helpers/strings"], factory);
    }
})(function (require, exports) {
    "use strict";
    var strings_1 = require("../../src/helpers/strings");
    describe("Strings", function () {
        it("format", function () {
            expect(strings_1.default("Hello, {0}!").format("World")).toEqual("Hello, World!");
            expect(strings_1.default("{0}, {1} and {2}!").format("Hello", "World", "everybody else")).toEqual("Hello, World and everybody else!");
            expect(strings_1.default("{0}{1}{2}").format("a", "b", "c")).toEqual("abc");
            expect(strings_1.default("{0}{1}{0}{2}{0}").format("a", "b", "c")).toEqual("abaca");
        });
    });
});
//# sourceMappingURL=strings.spec.js.map
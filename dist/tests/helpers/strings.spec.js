"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var strings_1 = require("../../src/helpers/strings");
var chai_1 = require("chai");
describe("Strings", function () {
    it("format", function () {
        chai_1.expect(strings_1.default("Hello, {0}!").format("World")).to.eql("Hello, World!");
        chai_1.expect(strings_1.default("{0}, {1} and {2}!").format("Hello", "World", "everybody else")).to.eql("Hello, World and everybody else!");
        chai_1.expect(strings_1.default("{0}{1}{2}").format("a", "b", "c")).to.eql("abc");
        chai_1.expect(strings_1.default("{0}{1}{0}{2}{0}").format("a", "b", "c")).to.eql("abaca");
        chai_1.expect(strings_1.StringsHelper.format("Hello, {0}!", "World")).to.eql("Hello, World!");
        chai_1.expect(strings_1.StringsHelper.format("{0}, {1} and {2}!", "Hello", "World", "Gusy")).to.eql("Hello, World and Gusy!");
        chai_1.expect(strings_1.StringsHelper.format("{0}{1}{2}", "a", "b", "c")).to.eql("abc");
        chai_1.expect(strings_1.StringsHelper.format("{0}{1}{0}{2}{0}", "a", "b", "c")).to.eql("abaca");
    });
});
//# sourceMappingURL=strings.spec.js.map
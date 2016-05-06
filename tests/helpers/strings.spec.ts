/// <reference path="../../typings/main.d.ts" />

import Strings from "../../src/helpers/strings";

describe("Strings", () => {
    it("format", () => {
        expect(Strings("Hello, {0}!").format("World")).toEqual("Hello, World!");
        expect(Strings("{0}, {1} and {2}!").format("Hello", "World", "everybody else")).toEqual("Hello, World and everybody else!");
        expect(Strings("{0}{1}{2}").format("a", "b", "c")).toEqual("abc");
        expect(Strings("{0}{1}{0}{2}{0}").format("a", "b", "c")).toEqual("abaca");
    }); 
});
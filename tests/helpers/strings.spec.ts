import Strings, {StringsHelper} from "../../src/helpers/strings";
import {expect} from 'chai';

describe("Strings", function() {
    it("format", function() {
        expect(Strings("Hello, {0}!").format("World")).to.eql("Hello, World!");
        expect(Strings("{0}, {1} and {2}!").format("Hello", "World", "everybody else")).to.eql("Hello, World and everybody else!");
        expect(Strings("{0}{1}{2}").format("a", "b", "c")).to.eql("abc");
        expect(Strings("{0}{1}{0}{2}{0}").format("a", "b", "c")).to.eql("abaca");

        expect(StringsHelper.format("Hello, {0}!", "World")).to.eql("Hello, World!");
        expect(StringsHelper.format("{0}, {1} and {2}!", "Hello", "World", "Gusy")).to.eql("Hello, World and Gusy!");
        expect(StringsHelper.format("{0}{1}{2}", "a", "b", "c")).to.eql("abc");
        expect(StringsHelper.format("{0}{1}{0}{2}{0}", "a", "b", "c")).to.eql("abaca");
    }); 
});
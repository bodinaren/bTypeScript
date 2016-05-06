/// <reference path="../../typings/main.d.ts" />

import Numbers from "../../src/helpers/numbers";

describe("Numbers", () => {
    it("in", () => {
        expect(Numbers(4).in([1, 2, 3, 4, 5, 6])).toEqual(true);        
        expect(Numbers(7).in([1, 2, 3, 4, 5, 6])).toEqual(false);
    });

    it("between", () => {
        expect(Numbers(0).between(1, 3)).toEqual(false);
        expect(Numbers(1).between(1, 3)).toEqual(true);
        expect(Numbers(2).between(1, 3)).toEqual(true);
        expect(Numbers(3).between(1, 3)).toEqual(true);
        expect(Numbers(4).between(1, 3)).toEqual(false);
        expect(Numbers(4).between(1)).toEqual(true);
        expect(Numbers(4).between(5)).toEqual(false);
        expect(Numbers(4).between()).toEqual(true);
    });
});
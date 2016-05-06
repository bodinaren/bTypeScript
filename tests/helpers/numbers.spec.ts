/// <reference path="../../typings/main.d.ts" />

import Numbers, {NumbersHelper} from "../../src/helpers/numbers";

describe("Numbers", () => {
    it("in", () => {
        expect(Numbers(4).in([1, 2, 3, 4, 5, 6])).toEqual(true);        
        expect(Numbers(7).in([1, 2, 3, 4, 5, 6])).toEqual(false);
        
        expect(NumbersHelper.in(4, [1, 2, 3, 4, 5, 6])).toEqual(true);        
        expect(NumbersHelper.in(7, [1, 2, 3, 4, 5, 6])).toEqual(false);
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
        
        expect(NumbersHelper.between(0, 1, 3)).toEqual(false);
        expect(NumbersHelper.between(1, 1, 3)).toEqual(true);
        expect(NumbersHelper.between(2, 1, 3)).toEqual(true);
        expect(NumbersHelper.between(3, 1, 3)).toEqual(true);
        expect(NumbersHelper.between(4, 1, 3)).toEqual(false);
        expect(NumbersHelper.between(4, 1)).toEqual(true);
        expect(NumbersHelper.between(4, 5)).toEqual(false);
        expect(NumbersHelper.between(4)).toEqual(true);
    });
});
import Numbers, {NumbersHelper} from "../../src/helpers/numbers";
import {expect} from 'chai';

describe("Numbers", function() {
    it("in", function() {
        expect(Numbers(4).in([1, 2, 3, 4, 5, 6])).to.eql(true);        
        expect(Numbers(7).in([1, 2, 3, 4, 5, 6])).to.eql(false);
        
        expect(NumbersHelper.in(4, [1, 2, 3, 4, 5, 6])).to.eql(true);        
        expect(NumbersHelper.in(7, [1, 2, 3, 4, 5, 6])).to.eql(false);
    });

    it("between", function() {
        expect(Numbers(0).between(1, 3)).to.eql(false);
        expect(Numbers(1).between(1, 3)).to.eql(true);
        expect(Numbers(2).between(1, 3)).to.eql(true);
        expect(Numbers(3).between(1, 3)).to.eql(true);
        expect(Numbers(4).between(1, 3)).to.eql(false);
        expect(Numbers(4).between(1)).to.eql(true);
        expect(Numbers(4).between(5)).to.eql(false);
        expect(Numbers(4).between()).to.eql(true);
        
        expect(NumbersHelper.between(0, 1, 3)).to.eql(false);
        expect(NumbersHelper.between(1, 1, 3)).to.eql(true);
        expect(NumbersHelper.between(2, 1, 3)).to.eql(true);
        expect(NumbersHelper.between(3, 1, 3)).to.eql(true);
        expect(NumbersHelper.between(4, 1, 3)).to.eql(false);
        expect(NumbersHelper.between(4, 1)).to.eql(true);
        expect(NumbersHelper.between(4, 5)).to.eql(false);
        expect(NumbersHelper.between(4)).to.eql(true);
    });
});
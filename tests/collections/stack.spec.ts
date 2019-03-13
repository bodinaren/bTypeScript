import {Stack} from "../../src/collections/stack";
import {expect} from 'chai';

describe("Stack", function() {
    it("push", function() {
        var list = new Stack();

        expect(list.push(6)).to.eql(1);
        expect(list.push(7)).to.eql(2);
        expect(list.push(8)).to.eql(3);
        expect(list.push(9)).to.eql(4);
        expect(list.length).to.eql(4);
    });

    it("pop", function() {
        var list = new Stack();

        list.push(6);
        list.push(7);
        list.push(8);
        list.push(9);

        expect(list.pop()).to.eql(9);
        expect(list.pop()).to.eql(8);
        expect(list.pop()).to.eql(7);
        expect(list.pop()).to.eql(6);
        expect(list.length).to.eql(0);
    });

    it("peek", function() {
        var list = new Stack();

        list.push(6);
        list.push(7);
        list.push(8);
        list.push(9);

        expect(list.peek()).to.eql(9);
        
        expect(list.length).to.eql(4);
    });

    it("clear", function() {
        var x = new Stack();

        x.push(6);
        x.push(7);
        x.push(8);
        x.push(9);
        
        x.clear();

        expect(x.length).to.eql(0);
    });

});
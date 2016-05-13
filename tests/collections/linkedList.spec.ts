/// <reference path="../../typings/main.d.ts" />

import LinkedList from "../../src/collections/linkedList";
import {expect} from 'chai';

describe("LinkedList", function() {
    it("insert", function() {
        var list = new LinkedList();
        expect(list.insert(6)).to.eql(1);
        expect(list.insert(7)).to.eql(2);
        expect(list.insert(8)).to.eql(3);
        expect(list.insert(9)).to.eql(4);
    });

    it("get", function() {
        var list = new LinkedList();
        expect(list.get(0)).to.eql(undefined);

        list.insert(6);
        list.insert(7);
        list.insert(8);
        list.insert(9);

        expect(list.get(0)).to.eql(6);
        expect(list.get(1)).to.eql(7);
        expect(list.get(2)).to.eql(8);
        expect(list.get(3)).to.eql(9);
        
    });

    it("insertAt", function() {
        var list = new LinkedList();
        expect(list.insertAt(2, 6)).to.eql(1);
        expect(list.insertAt(2, 7)).to.eql(2);
        expect(list.insertAt(2, 8)).to.eql(3);
        expect(list.insertAt(2, 9)).to.eql(4);

        expect(list.get(0)).to.eql(6);
        expect(list.get(1)).to.eql(7);
        expect(list.get(2)).to.eql(9);
        expect(list.get(3)).to.eql(8);
    });

    it("removeAt", function() {
        var list = new LinkedList();

        list.insert(6);
        list.insert(7);
        list.insert(8);
        list.insert(9);

        expect(list.removeAt(1)).to.eql(3);

        expect(list.get(0)).to.eql(6);
        expect(list.get(1)).to.eql(8);
        expect(list.get(2)).to.eql(9);
    });
});
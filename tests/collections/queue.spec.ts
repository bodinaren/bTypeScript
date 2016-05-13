/// <reference path="../../typings/main.d.ts" />

import Queue from "../../src/collections/queue";
import {expect} from 'chai';

describe("Queue", function() {
    it("enqueue", function() {
        var list = new Queue();

        expect(list.enqueue(6)).to.eql(1);
        expect(list.enqueue(7)).to.eql(2);
        expect(list.enqueue(8)).to.eql(3);
        expect(list.enqueue(9)).to.eql(4);
    });

    it("dequeue", function() {
        var list = new Queue();

        list.enqueue(6);
        list.enqueue(7);
        list.enqueue(8);
        list.enqueue(9);

        expect(list.dequeue()).to.eql(6);
        expect(list.dequeue()).to.eql(7);
        expect(list.dequeue()).to.eql(8);
        expect(list.dequeue()).to.eql(9);
    });

});
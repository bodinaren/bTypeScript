/// <reference path="../../typings/main.d.ts" />

import Queue from "../../src/collections/queue";

describe("Queue", () => {
    it("enqueue", () => {
        var list = new Queue();

        expect(list.enqueue(6)).toEqual(1);
        expect(list.enqueue(7)).toEqual(2);
        expect(list.enqueue(8)).toEqual(3);
        expect(list.enqueue(9)).toEqual(4);
    });

    it("dequeue", () => {
        var list = new Queue();

        list.enqueue(6);
        list.enqueue(7);
        list.enqueue(8);
        list.enqueue(9);

        expect(list.dequeue()).toEqual(6);
        expect(list.dequeue()).toEqual(7);
        expect(list.dequeue()).toEqual(8);
        expect(list.dequeue()).toEqual(9);
    });

});
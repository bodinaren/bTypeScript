/// <reference path="../../typings/main.d.ts" />

import Stack from "../../src/collections/stack";

describe("Stack", () => {
    it("push", () => {
        var list = new Stack();

        expect(list.push(6)).toEqual(1);
        expect(list.push(7)).toEqual(2);
        expect(list.push(8)).toEqual(3);
        expect(list.push(9)).toEqual(4);
        expect(list.length).toEqual(4);
    });

    it("pop", () => {
        var list = new Stack();

        list.push(6);
        list.push(7);
        list.push(8);
        list.push(9);

        expect(list.pop()).toEqual(9);
        expect(list.pop()).toEqual(8);
        expect(list.pop()).toEqual(7);
        expect(list.pop()).toEqual(6);
        expect(list.length).toEqual(0);
    });

    it("peek", () => {
        var list = new Stack();

        list.push(6);
        list.push(7);
        list.push(8);
        list.push(9);

        expect(list.peek()).toEqual(9);
        expect(list.length).toEqual(4);
    });

});
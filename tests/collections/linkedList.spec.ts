/// <reference path="../../typings/main.d.ts" />

import LinkedList from "../../src/collections/linkedList";

describe("LinkedList", () => {
    it("insert", () => {
        var list = new LinkedList();
        expect(list.insert(6)).toEqual(1);
        expect(list.insert(7)).toEqual(2);
        expect(list.insert(8)).toEqual(3);
        expect(list.insert(9)).toEqual(4);
    });

    it("get", () => {
        var list = new LinkedList();
        expect(list.get(0)).toEqual(undefined);

        list.insert(6);
        list.insert(7);
        list.insert(8);
        list.insert(9);

        expect(list.get(0)).toEqual(6);
        expect(list.get(1)).toEqual(7);
        expect(list.get(2)).toEqual(8);
        expect(list.get(3)).toEqual(9);
        
    });

    it("insertAt", () => {
        var list = new LinkedList();
        expect(list.insertAt(2, 6)).toEqual(1);
        expect(list.insertAt(2, 7)).toEqual(2);
        expect(list.insertAt(2, 8)).toEqual(3);
        expect(list.insertAt(2, 9)).toEqual(4);

        expect(list.get(0)).toEqual(6);
        expect(list.get(1)).toEqual(7);
        expect(list.get(2)).toEqual(9);
        expect(list.get(3)).toEqual(8);
    });

    it("removeAt", () => {
        var list = new LinkedList();

        list.insert(6);
        list.insert(7);
        list.insert(8);
        list.insert(9);

        expect(list.removeAt(1)).toEqual(3);

        expect(list.get(0)).toEqual(6);
        expect(list.get(1)).toEqual(8);
        expect(list.get(2)).toEqual(9);
    });
});
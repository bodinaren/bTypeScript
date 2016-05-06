/// <reference path="../../typings/main.d.ts" />

import List from "../../src/collections/list";

describe("List", () => {
    it("toArray", () => {
        var arr = [1, 2, 3, 4, 5];
        expect(new List(arr).toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it("add", () => {
        var x = new List();
        x.add(1).add(2).add(3);
        expect(x.toArray()).toEqual([1, 2, 3]);
    });

    it("addRange", () => {
        var x = new List([1, 2, 3]);
        x.addRange([4, 5, 6]);
        expect(x.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("asReadOnly", () => {
        var x = new List([1, 2, 3]).asReadOnly();

        expect(x.count.bind(x, y => y == 1)).not.toThrow();
        expect(x.add.bind(x)).toThrow();
    });

    it("indexOf", () => {
        var x = new List([1, 2, 3, 2, 1]);
        expect(x.indexOf(2)).toEqual(1);
        expect(x.indexOf(2, 1)).toEqual(1);
        expect(x.indexOf(2, 1, 2)).toEqual(1);
                         
        expect(x.indexOf(2, 4)).toEqual(-1);
        expect(x.indexOf(2, 2, 1)).toEqual(-1);
    });

    it("lastIndexOf", () => {
        var x = new List([1, 2, 3, 2, 1]);
        expect(x.lastIndexOf(2)).toEqual(3);
        expect(x.lastIndexOf(2, 3)).toEqual(3);
        expect(x.lastIndexOf(2, 3, 2)).toEqual(3);
                 
        expect(x.lastIndexOf(2, 0)).toEqual(-1);
        expect(x.lastIndexOf(2, 2, 1)).toEqual(-1);
    });

    it("insert", () => {
        var x = new List();
        x.insert(0, 1).insert(0, 2).insert(0, 3);
        expect(x.toArray()).toEqual([3, 2, 1]);
    });

    it("insertRange", () => {
        var x = new List([1, 2, 3]);
        x.insertRange(1, [4, 5, 6]);
        expect(x.toArray()).toEqual([1, 4, 5, 6, 2, 3]);
    });

    it("get/set", () => {
        var x = new List([1, 2, 3]);
        expect(x.get(2)).toEqual(3);
        x.set(2, 4);
        expect(x.get(2)).toEqual(4);
        expect(x.set.bind(x, 4, 5)).toThrow();
    });

    it("length", () => {
        var x = new List().add(1);
        expect(x.length).toEqual(1);
        x.insert(0, 1);
        expect(x.length).toEqual(2);
    });

    it("remove", () => {
        var x = new List([1, 2, 3, 2, 1]).remove(1);
        expect(x.toArray()).toEqual([2, 3, 2, 1]);
    });

    it("removeAt", () => {
        var x = new List([1, 2, 3, 2, 1]).removeAt(1);
        expect(x.toArray()).toEqual([1, 3, 2, 1]);
    });

    it("removeAll", () => {
        var x = new List([1, 2, 3, 2, 1]).removeAll(x => x == 1);
        expect(x.toArray()).toEqual([2, 3, 2]);
    });

    it("removeRange", () => {
        var x = new List([1, 2, 3, 4, 5]).removeRange(1, 3);
        expect(x.toArray()).toEqual([1, 5]);
    });

    it("clear", () => {
        var x = new List([1, 2, 3, 2, 1]).clear();
        expect(x.length).toEqual(0);
    });

    //it("count", () => {
    //    var x = new List([1, 2, 3, 2, 1]);
    //    expect(x.count()).toEqual(5);
    //    expect(x.count(x => x == 1)).toEqual(2);
    //    expect(x.count(x => x == 3)).toEqual(1);
    //});

    it("reverse", () => {
        var x = new List([1, 2, 3, 4, 5]);
        x.reverse();
        expect(x.toArray()).toEqual([5, 4, 3, 2, 1]);
        x.reverse(1);
        expect(x.toArray()).toEqual([5, 1, 2, 3, 4]);
        x.reverse(1, 3);
        expect(x.toArray()).toEqual([5, 3, 2, 1, 4]);
    });
});
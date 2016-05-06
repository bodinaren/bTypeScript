/// <reference path="../../typings/main.d.ts" />

import BinaryTree from "../../src/collections/binaryTree";

describe("BinaryTree", () => {
    var defaultTree: BinaryTree<number>;
    
    beforeEach(() => {
        defaultTree = new BinaryTree<number>();

        defaultTree.insert(4);
        defaultTree.insert(2);
        defaultTree.insert(6);
        defaultTree.insert(1);
        defaultTree.insert(3);
        defaultTree.insert(5);
        defaultTree.insert(7);
        
        //      __4__
        //     /     \
        //    2       6
        //   / \     / \
        //  1   3   5   7
    });

    it("length", () => {
        expect(defaultTree.length).toEqual(7);
    });

    it("contains", () => {
        expect(defaultTree.contains(3)).toEqual(true);
    });

    //it("remove", () => {
    //    expect(defaultTree.contains(3)).toEqual(true);
    //});

    it("forEach", () => {
        var sum = 0;
        defaultTree.forEach(item => { sum += item });
        expect(sum).toEqual(28);

        sum = 0;
        defaultTree.forEach(item => {
            sum += item;
            if (item == 5) return false;
        });
        expect(sum).toEqual(15);
    });

    it("toArray", () => {
        var arr = defaultTree.toArray();
        expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it("preorderTraversal", () => {
        var arr = [];
        defaultTree.preorderTraversal(item => { arr.push(item) });
        expect(arr).toEqual([4, 2, 1, 3, 6, 5, 7]);

        arr = [];
        defaultTree.preorderTraversal(item => {
            arr.push(item);
            if (item == 5) return false;
        });
        expect(arr).toEqual([4, 2, 1, 3, 6, 5]);
    });

    it("inorderTraversal", () => {
        var arr = [];
        defaultTree.inorderTraversal(item => { arr.push(item) });
        expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7]);

        arr = [];
        defaultTree.inorderTraversal(item => {
            arr.push(item);
            if (item == 5) return false;
        });
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    it("postorderTraversal", () => {
        var arr = [];
        defaultTree.postorderTraversal(item => { arr.push(item) });
        expect(arr).toEqual([1, 3, 2, 5, 7, 6, 4]);

        arr = [];
        defaultTree.postorderTraversal(item => {
            arr.push(item);
            if (item == 5) return false;
        });
        expect(arr).toEqual([1, 3, 2, 5]);
    });

    it("levelTraversal", () => {
        var arr = [];
        defaultTree.levelTraversal(item => { arr.push(item) });
        expect(arr).toEqual([4, 2, 6, 1, 3, 5, 7]);

        arr = [];
        defaultTree.levelTraversal(item => {
            arr.push(item);
            if (item == 5) return false;
        });
        expect(arr).toEqual([4, 2, 6, 1, 3, 5]);
    });

    describe("remove", () => {
        it("leaf", () => {
            var arr = [];
            defaultTree.remove(1); // remove a left child
            defaultTree.preorderTraversal(item => { arr.push(item) });
            expect(arr).toEqual([4, 2, 3, 6, 5, 7]);

            arr = [];
            defaultTree.remove(7); // remove a right child
            defaultTree.preorderTraversal(item => { arr.push(item) });
            expect(arr).toEqual([4, 2, 3, 6, 5]);
        });

        it("root in perfect tree", () => {
            var arr = [];
            defaultTree.remove(4);
            defaultTree.preorderTraversal(item => { arr.push(item) });
            expect(arr).toEqual([6, 2, 1, 3, 7, 5]);
        });

        //it("root in non-perfect tree", () => {
        //    var arr = [];
        //    defaultTree.remove(7); // make non-perfect tree.
            
        //    defaultTree.remove(4);
        //    defaultTree.preorderTraversal(item => { arr.push(item) });
        //    expect(arr).toEqual([6, 2, 1, 3, 5]);
        //});

        //it("child in perfect tree", () => {
        //    var arr = [];
        //    defaultTree.remove(4);
        //    defaultTree.preorderTraversal(item => { arr.push(item) });
        //    expect(arr).toEqual([6, 2, 1, 3, 7, 5]);
        //});
    });

    it("min", () => {
        expect(defaultTree.min()).toEqual(1);
    });

    it("max", () => {
        expect(defaultTree.max()).toEqual(7);
    });

    it("depth", () => {
        var emptyTree = new BinaryTree<number>(),
            shallowTree = new BinaryTree<number>();
        shallowTree.insert(1);

        expect(defaultTree.depth()).toEqual(2);
        expect(emptyTree.depth()).toEqual(-1);
        expect(shallowTree.depth()).toEqual(0);
        
    });
});
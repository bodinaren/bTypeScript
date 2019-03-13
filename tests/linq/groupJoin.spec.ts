import {expect} from 'chai';
import {IteratorResult} from "../../src/linq/iterator/iterator";
import {GroupJoinIterator} from "../../src/linq/iterator/groupJoin";
import * as TestItems from "./testitems";

describe("GroupJoinIterator", function() {
    it("Basic gives 1-to-1,", function () {
        let parents = [
            { id: 0, name: "parent 0" },
            { id: 1, name: "parent 1" },
            { id: 2, name: "parent 2" },
        ];
        let children = [
            { parent: 0, age: 5 },
            { parent: 1, age: 4 },
            { parent: 2, age: 2 },
        ];

        var iterator = new GroupJoinIterator(parents, children, p => p.id, c => c.parent, (p, c) => {
            return { parent: p.name, childrenAges: c.map(x => x.age) };
        });
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql({ parent: "parent 0", childrenAges: [5] }, "parent 0 should have one child of age 5");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 1", childrenAges: [4] }, "parent 1 should have one child of age 4");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 2", childrenAges: [2] }, "parent 2 should have one child of age 2");

        n = iterator.next();
        expect(n.done).to.equal(true, "4th should be done");
        expect(n.value).to.equal(undefined, "4th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("Multiple inner gives multiple children,", function () {
        let parents = [
            { id: 0, name: "parent 0" },
            { id: 1, name: "parent 1" },
            { id: 2, name: "parent 2" },
        ];
        let children = [
            { parent: 0, age: 5 },
            { parent: 1, age: 4 },
            { parent: 1, age: 3 },
            { parent: 2, age: 2 },
        ];
        
        var iterator = new GroupJoinIterator(parents, children, p => p.id, c => c.parent, (p, c) => {
            return { parent: p.name, childrenAges: c.map(x => x.age) };
        });
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql({ parent: "parent 0", childrenAges: [5] }, "parent 0 should have one child of age 5");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 1", childrenAges: [4, 3] }, "parent 2 should have two children of ages 4 and 3");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 2", childrenAges: [2] }, "parent 2 should have one child of age 2");

        n = iterator.next();
        expect(n.done).to.equal(true, "4th should be done");
        expect(n.value).to.equal(undefined, "4th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("Missing inner will give empty parent,", function () {
        let parents = [
            { id: 0, name: "parent 0" },
            { id: 1, name: "parent 1" },
            { id: 2, name: "parent 2" },
        ];
        let children = [
            { parent: 0, age: 5 },
            { parent: 2, age: 2 },
        ];
        
        var iterator = new GroupJoinIterator(parents, children, p => p.id, c => c.parent, (p, c) => {
            return { parent: p.name, childrenAges: c.map(x => x.age) };
        });
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql({ parent: "parent 0", childrenAges: [5] }, "parent 0 should have one child of age 5");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 1", childrenAges: [] }, "parent 1 shouldn't have any children");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 2", childrenAges: [2] }, "parent 2 should have one child of age 2");

        n = iterator.next();
        expect(n.done).to.equal(true, "4th should be done");
        expect(n.value).to.equal(undefined, "4th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("An inner without an outer is excluded,", function () {
        let parents = [
            { id: 0, name: "parent 0" },
            { id: 2, name: "parent 2" },
        ];
        let children = [
            { parent: 0, age: 5 },
            { parent: 1, age: 4 },
            { parent: 2, age: 2 },
        ];
        
        var iterator = new GroupJoinIterator(parents, children, p => p.id, c => c.parent, (p, c) => {
            return { parent: p.name, childrenAges: c.map(x => x.age) };
        });
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql({ parent: "parent 0", childrenAges: [5] }, "parent 0 should have one child of age 5");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 2", childrenAges: [2] }, "parent 2 should have one child of age 2");

        n = iterator.next();
        expect(n.done).to.equal(true, "3rd should be done");
        expect(n.value).to.equal(undefined, "3rd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
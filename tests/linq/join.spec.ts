import {expect} from 'chai';
import {IteratorResult} from "../../src/linq/iterator/iterator";
import {JoinIterator} from "../../src/linq/iterator/join";

describe("JoinIterator", function() {
    it("Basic gives 1-to-1", function () {
        var parents = [
            { id: 0, name: "parent 0" },
            { id: 1, name: "parent 1" },
            { id: 2, name: "parent 2" },
        ];
        var children = [
            { parent: 0, age: 5 },
            { parent: 1, age: 4 },
            { parent: 2, age: 2 },
        ];

        var iterator = new JoinIterator(parents, children, p => p.id, c => c.parent, (p, c) => {
            return { parent: p.name, childAge: c.age };
        });
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql({ parent: "parent 0", childAge: 5 }, "parent 0 should have one child of age 5");
        
        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 1", childAge: 4 }, "parent 1 should have one child of age 4");
        
        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 2", childAge: 2 }, "parent 2 should have one child of age 2");
        
        n = iterator.next();
        expect(n.done).to.equal(true, "4th should be done");
        expect(n.value).to.equal(undefined, "4th should be undefined");
        
        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("Multiple inner gives same parent multiple times", function () {
        var parents = [
            { id: 0, name: "parent 0" },
            { id: 1, name: "parent 1" },
            { id: 2, name: "parent 2" },
        ];
        var children = [
            { parent: 0, age: 5 },
            { parent: 1, age: 4 },
            { parent: 1, age: 3 },
            { parent: 2, age: 2 },
        ];
        
        var iterator = new JoinIterator(parents, children, p => p.id, c => c.parent, (p, c) => {
            return { parent: p.name, childAge: c.age };
        });
        var n: IteratorResult<any>;

        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql({ parent: "parent 0", childAge: 5 }, "parent 0 should have one child of age 5");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 1", childAge: 4 }, "parent 1 should have two children, the first of age 4");

        n = iterator.next();
        expect(n.done).to.equal(false, "3rd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 1", childAge: 3 }, "parent 1 should have two children, the second of age 3");

        n = iterator.next();
        expect(n.done).to.equal(false, "4th should NOT be done");
        expect(n.value).to.eql({ parent: "parent 2", childAge: 2 }, "parent 2 should have one child of age 2");

        n = iterator.next();
        expect(n.done).to.equal(true, "5th should be done");
        expect(n.value).to.equal(undefined, "5th should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    it("An outer without an inner is excluded", function () {
        var parents = [
            { id: 0, name: "parent 0" },
            { id: 1, name: "parent 1" },
            { id: 2, name: "parent 2" },
        ];
        var children = [
            { parent: 0, age: 5 },
            { parent: 2, age: 2 },
        ];
        
        var iterator = new JoinIterator(parents, children, p => p.id, c => c.parent, (p, c) => {
            return { parent: p.name, childAge: c.age };
        });
        var n: IteratorResult<any>;
    
        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql({ parent: "parent 0", childAge: 5 }, "parent 0 should have one child of age 5");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 2", childAge: 2 }, "parent 2 should have one child of age 2");

        n = iterator.next();
        expect(n.done).to.equal(true, "4rd should be done");
        expect(n.value).to.equal(undefined, "4rd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });

    describe("An inner without an outer is excluded", function () {
        var parents = [
            { id: 0, name: "parent 0" },
            { id: 2, name: "parent 2" },
        ];
        var children = [
            { parent: 0, age: 5 },
            { parent: 1, age: 4 },
            { parent: 2, age: 2 },
        ];
        
        var iterator = new JoinIterator(parents, children, p => p.id, c => c.parent, (p, c) => {
            return { parent: p.name, childAge: c.age };
        });
        var n: IteratorResult<any>;
    
        n = iterator.next();
        expect(n.done).to.equal(false, "1st should NOT be done");
        expect(n.value).to.eql({ parent: "parent 0", childAge: 5 }, "parent 0 should have one child of age 5");

        n = iterator.next();
        expect(n.done).to.equal(false, "2nd should NOT be done");
        expect(n.value).to.eql({ parent: "parent 2", childAge: 2 }, "parent 2 should have one child of age 2");

        n = iterator.next();
        expect(n.done).to.equal(true, "3rd should be done");
        expect(n.value).to.equal(undefined, "3rd should be undefined");

        n = iterator.next();
        expect(n.done).to.equal(true, "consecutive should be done");
        expect(n.value).to.equal(undefined, "consecutive should be undefined");
    });
});
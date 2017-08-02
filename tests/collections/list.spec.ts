import List from "../../src/collections/list";
import {expect} from 'chai';

describe("List", function() {
    it("toArray", function() {
        var arr = [1, 2, 3, 4, 5];
        expect(new List(arr).toArray()).to.eql([1, 2, 3, 4, 5]);
    });

    it("forEach", function () {
        var src = [1, 2, 3, 4, 5];
        var sum1 = 0, sum2 = 0;

        new List(src).forEach(function(nr) {
            sum1 += nr;
        });
        expect(sum1).to.eql(15);

        List.forEach(src, function(nr) {
            sum2 += nr;
        });
        expect(sum2).to.eql(15);
    });

    it("add", function() {
        var x = new List();
        x.add(1).add(2).add(3);
        expect(x.toArray()).to.eql([1, 2, 3]);

        // static
        expect(List.add([1, 2], 3)).to.eql([1, 2, 3]);
    });

    it("addRange", function() {
        var x = new List([1, 2, 3]);
        x.addRange([4, 5, 6]);
        expect(x.toArray()).to.eql([1, 2, 3, 4, 5, 6]);

        // static
        expect(List.addRange([1, 2, 3], [4, 5, 6])).to.eql([1, 2, 3, 4, 5, 6]);
    });

    // it("asReadOnly", function() {
    //     var x = new List([1, 2, 3]).asReadOnly(),
    //         fn1 = x.count.bind(x, y => y == 1),
    //         fn2 = x.add.bind(x);
        
    //     expect(fn1).not.to.throw();
    //     expect(fn2).to.throw();
    // });

    it("indexOf", function() {
        var src = [1, 2, 3, 2, 1];

        var x = new List(src);
        expect(x.indexOf(2)).to.eql(1);
        expect(x.indexOf(2, 1)).to.eql(1);
        expect(x.indexOf(2, 1, 2)).to.eql(1);
                         
        expect(x.indexOf(2, 4)).to.eql(-1);
        expect(x.indexOf(2, 2, 1)).to.eql(-1);

        // static
        expect(List.indexOf(src, 2)).to.eql(1);
        expect(List.indexOf(src, 2, 1)).to.eql(1);
        expect(List.indexOf(src, 2, 1, 2)).to.eql(1);
                         
        expect(List.indexOf(src, 2, 4)).to.eql(-1);
        expect(List.indexOf(src, 2, 2, 1)).to.eql(-1);
    });

    it("lastIndexOf", function() {
        var src = [1, 2, 3, 2, 1];

        var x = new List(src);
        expect(x.lastIndexOf(2)).to.eql(3);
        expect(x.lastIndexOf(2, 3)).to.eql(3);
        expect(x.lastIndexOf(2, 3, 2)).to.eql(3);

        expect(x.lastIndexOf(2, 0)).to.eql(-1);

        //static
        expect(List.lastIndexOf(src, 2)).to.eql(3);
        expect(List.lastIndexOf(src, 2, 3)).to.eql(3);
        expect(List.lastIndexOf(src, 2, 3, 2)).to.eql(3);

        expect(List.lastIndexOf(src, 2, 0)).to.eql(-1);
        expect(List.lastIndexOf(src, 2, 2, 1)).to.eql(-1);
    });

    it("insert", function() {
        var x = new List();
        x.insert(0, 1).insert(0, 2).insert(0, 3);
        expect(x.toArray()).to.eql([3, 2, 1]);
        
        //static
        expect(List.insert([2, 1], 0, 3)).to.eql([3, 2, 1]);
    });

    it("insertRange", function() {
        var x = new List([1, 2, 3]);
        x.insertRange(1, [4, 5, 6]);
        expect(x.toArray()).to.eql([1, 4, 5, 6, 2, 3]);
        
        //static
        expect(List.insertRange([1, 2, 3], 1, [4, 5, 6])).to.eql([1, 4, 5, 6, 2, 3]);
    });

    it("get/set", function() {
        var x = new List([1, 2, 3]);
        expect(x.get(2)).to.eql(3);
        x.set(2, 4);
        expect(x.get(2)).to.eql(4);
        
        let set = x.set.bind(x, 4, 5);
        expect(set).to.throw("Index was out of range. Must be non-negative and less than the size of the collection.");
    });

    it("length", function() {
        var x = new List().add(1);
        expect(x.length).to.eql(1);
        x.insert(0, 1);
        expect(x.length).to.eql(2);
    });

    it("remove", function() {
        var x = new List([1, 2, 3, 2, 1]).remove(1);
        expect(x.toArray()).to.eql([2, 3, 2, 1]);
        
        //static
        expect(List.remove([1, 2, 3, 2, 1], 1)).to.eql([2, 3, 2, 1]);
    });

    it("removeAt", function() {
        var x = new List([1, 2, 3, 2, 1]).removeAt(1);
        expect(x.toArray()).to.eql([1, 3, 2, 1]);
        
        //static
        expect(List.removeAt([1, 2, 3, 2, 1], 1)).to.eql([1, 3, 2, 1]);
    });

    it("removeAll", function() {
        var x = new List([1, 2, 3, 2, 1]).removeAll(x => x == 1);
        expect(x.toArray()).to.eql([2, 3, 2]);
        
        //static
        expect(List.removeAll([1, 2, 3, 2, 1], x => x == 1)).to.eql([2, 3, 2]);
    });

    it("removeRange", function() {
        var x = new List([1, 2, 3, 4, 5]).removeRange(1, 3);
        expect(x.toArray()).to.eql([1, 5]);

        //static
        expect(List.removeRange([1, 2, 3, 4, 5], 1, 3)).to.eql([1, 5]);
    });

    it("clear", function() {
        var x = new List([1, 2, 3, 2, 1]).clear();
        expect(x.length).to.eql(0);

        //static
        expect(List.clear([1, 2, 3, 2, 1]).length).to.eql(0);
    });

    it("count", function() {
        var x = new List([1, 2, 3, 2, 1]);
        expect(x.count()).to.eql(5);
        expect(x.count(x => x == 1)).to.eql(2);
        expect(x.count(x => x == 3)).to.eql(1);

        //static
        expect(List.count([1, 2, 3, 2, 1])).to.eql(5);
        expect(List.count([1, 2, 3, 2, 1], x => x == 1)).to.eql(2);
        expect(List.count([1, 2, 3, 2, 1], x => x == 3)).to.eql(1);
    });

    it("reverse", function() {
        var x = new List([1, 2, 3, 4, 5]);
        x.reverse();
        expect(x.toArray()).to.eql([5, 4, 3, 2, 1]);
        x.reverse(1);
        expect(x.toArray()).to.eql([5, 1, 2, 3, 4]);
        x.reverse(1, 3);
        expect(x.toArray()).to.eql([5, 3, 2, 1, 4]);
        
        //static
        expect(List.reverse([1, 2, 3, 4, 5])).to.eql([5, 4, 3, 2, 1]);
        expect(List.reverse([5, 4, 3, 2, 1], 1)).to.eql([5, 1, 2, 3, 4]);
        expect(List.reverse([5, 1, 2, 3, 4], 1, 3)).to.eql([5, 3, 2, 1, 4]);
    });

    it("range", function () {
        expect(List.range(1, 5).toArray()).to.eql([1, 2, 3, 4, 5]);
        expect(List.range(5, 5).toArray()).to.eql([5, 6, 7, 8, 9]);
    });
});
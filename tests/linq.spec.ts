import * as Util from "../src/util";
import {LQ, Linq, TakeIterator, TakeWhileIterator, SkipIterator, SkipWhileIterator, MapIterator, FilterIterator, JoinIterator, GroupJoinIterator, OrderIterator, OrderedLinq} from "../src/linq";
import * as TestItems from "./linq/testitems";
import {expect} from 'chai';

describe("Linq", function() {

    describe("LQ", function() {
        expect(LQ(TestItems.strings).toArray()).to.eql(TestItems.strings);
    });
    
    describe("chaining", function() {
        describe("strings", function() {
            it("maps before next function", function() {
                var arr = new Linq(TestItems.strings)
                    .map(item => item.substr(0, 2))
                    .map(item => item.substr(1))
                    .toArray();

                expect(arr).to.eql(["a", "u", "å", "i", "o"]);
            });
        });

        describe("objects", function() {
            it("maps before next function", function() {
                var arr = new Linq(TestItems.objects)
                    .map(item => item.first)
                    .map(item => item.substr(0, 2))
                    .map(item => item.substr(1))
                    .toArray();

                expect(arr).to.eql(["a", "u", "å", "i", "o"]);
            });
        });

        describe("numbers", function() {
            it("maps before next function", function() {
                var arr = new Linq(TestItems.numbers)
                    .map(item => item * 3)
                    .map(item => item / 2)
                    .toArray();

                expect(arr).to.eql([0, 3, 6, 9, 12, 13.5, 10.5, 7.5, 4.5, 1.5]);
            });
        });

    });

    describe("toArray", function() {
        it("string", function () {
            expect(new Linq(TestItems.strings).toArray()).to.eql(TestItems.strings);
        });

        it("objects", function () {
            expect(new Linq(TestItems.objects).toArray()).to.eql(TestItems.objects);
        });

        it("numbers", function () {
            expect(new Linq(TestItems.numbers).toArray()).to.eql(TestItems.numbers);
        });
    });

    describe("map", function() {

        it("strings", function() {
            expect(new Linq(TestItems.strings).map(item => item.substr(0, 2)).toArray())
                .to.eql(["ka", "mu", "lå", "mi", "jo"], "intantiated:")
                
            expect(Linq.map(TestItems.strings, item => item.substr(0, 2)))
                .to.eql(["ka", "mu", "lå", "mi", "jo"], "static:")
        });

        it("objects", function() {
            expect(new Linq(TestItems.objects).map(item => item.first.substr(0, 2)).toArray())
                .to.eql(["ka", "mu", "lå", "mi", "jo"], "intantiated:");
                
            expect(Linq.map(TestItems.objects, item => item.first.substr(0, 2)))
                .to.eql(["ka", "mu", "lå", "mi", "jo"], "static:");
        });

        it("numbers", function() {
            expect(new Linq(TestItems.numbers).map(item => item * 2).toArray())
                .to.eql([0, 4, 8, 12, 16, 18, 14, 10, 6, 2], "intantiated:");
                
            expect(Linq.map(TestItems.numbers, item => item * 2))
                .to.eql([0, 4, 8, 12, 16, 18, 14, 10, 6, 2], "static:");
        });
    });

    describe("take", function() {
        it("strings", function() {
            expect(new Linq(TestItems.strings).take(2).toArray()).to.eql(["kalle", "musse"], "intantiated:");
            expect(Linq.take(TestItems.strings, 2)).to.eql(["kalle", "musse"], "static:");
        });
        
        it("objects", function() {
            expect(new Linq(TestItems.objects).take(2).toArray()).to.eql([TestItems.kalle, TestItems.musse], "intantiated:");
            expect(Linq.take(TestItems.objects, 2)).to.eql([TestItems.kalle, TestItems.musse], "static:");
        });
        
        it("numbers", function() {
            expect(new Linq(TestItems.numbers).take(2).toArray()).to.eql([0, 2], "intantiated:");
            expect(Linq.take(TestItems.numbers, 2)).to.eql([0, 2], "static:");
        });
    });

    describe("skip", function() {
        it("strings", function() {
            expect(new Linq(TestItems.strings).skip(3).toArray()).to.eql(["mimmi", "joakim"], "intantiated:");
            expect(Linq.skip(TestItems.strings, 3)).to.eql(["mimmi", "joakim"], "static:");
        });
        
        it("objects", function() {
            expect(new Linq(TestItems.objects).skip(3).toArray()).to.eql([TestItems.mimmi, TestItems.joakim], "intantiated:");
            expect(Linq.skip(TestItems.objects, 3)).to.eql([TestItems.mimmi, TestItems.joakim], "static:");
        });
        
        it("numbers", function() {
            expect(new Linq(TestItems.numbers).skip(3).toArray()).to.eql([6, 8, 9, 7, 5, 3, 1], "intantiated:");
            expect(Linq.skip(TestItems.numbers, 3)).to.eql([6, 8, 9, 7, 5, 3, 1], "static:");
        });
    });

    describe("takeWhile", function() {
        it("strings", function() {
            expect(new Linq(TestItems.strings).takeWhile(x => x.length == 5).toArray()).to.eql([TestItems.kalle.first, TestItems.musse.first], "intantiated:");
            expect(Linq.takeWhile(TestItems.strings, x => x.length == 5)).to.eql([TestItems.kalle.first, TestItems.musse.first], "static:");
        });

        it("objects", function() {
            expect(new Linq(TestItems.objects).takeWhile(x => x.first.length == 5).toArray()).to.eql([TestItems.kalle, TestItems.musse], "intantiated:");
            expect(Linq.takeWhile(TestItems.objects, x => x.first.length == 5)).to.eql([TestItems.kalle, TestItems.musse], "static:");
        });

        it("numbers", function() {
            expect(new Linq(TestItems.numbers).takeWhile(x => x < 8).toArray()).to.eql([0, 2, 4, 6], "intantiated:");
            expect(Linq.takeWhile(TestItems.numbers, x => x < 8)).to.eql([0, 2, 4, 6], "static:");
        });
    });

    describe("skipWhile", function() {
        it("strings", function() {
            expect(new Linq(TestItems.strings).skipWhile(x => x.length == 5).toArray()).to.eql([TestItems.långben.first, TestItems.mimmi.first, TestItems.joakim.first], "intantiated:");
            expect(Linq.skipWhile(TestItems.strings, x => x.length == 5)).to.eql([TestItems.långben.first, TestItems.mimmi.first, TestItems.joakim.first], "static:");
            
            // expect(new Linq(TestItems.strings).skipWhile().toArray()).to.eql(TestItems.strings);
            // expect(Linq.skipWhile(TestItems.strings)).to.eql(TestItems.strings);
        });

        it("objects", function() {
            expect(new Linq(TestItems.objects).skipWhile(x => x.first.length == 5).toArray()).to.eql([TestItems.långben, TestItems.mimmi, TestItems.joakim], "intantiated:");
            expect(Linq.skipWhile(TestItems.objects, x => x.first.length == 5)).to.eql([TestItems.långben, TestItems.mimmi, TestItems.joakim], "static:");

            // expect(new Linq(TestItems.objects).skipWhile().toArray()).to.eql(TestItems.objects);
            // expect(Linq.skipWhile(TestItems.objects)).to.eql(TestItems.objects);
        });

        it("numbers", function() {
            expect(new Linq(TestItems.numbers).skipWhile(x => x !== 7).toArray()).to.eql([7, 5, 3, 1], "intantiated:");
            expect(Linq.skipWhile(TestItems.numbers, x => x !== 7)).to.eql([7, 5, 3, 1], "static:");

            // expect(new Linq(TestItems.numbers).skipWhile().toArray()).to.eql(TestItems.numbers);
            // expect(Linq.skipWhile(TestItems.numbers)).to.eql(TestItems.numbers);
        });
    });

    describe("filter all", function() {
        it("strings", function() {
            expect(new Linq(TestItems.strings).filter(() => true).toArray()).to.eql(TestItems.strings, "intantiated:");
            expect(Linq.filter(TestItems.strings, () => true)).to.eql(TestItems.strings, "static:");
            
            expect(new Linq(TestItems.strings).where(() => true).toArray()).to.eql(TestItems.strings, "intantiated:");
            expect(Linq.where(TestItems.strings, () => true)).to.eql(TestItems.strings, "static:");
        });

        it("objects", function() {
            expect(new Linq(TestItems.objects).filter(() => true).toArray()).to.eql(TestItems.objects, "intantiated:");
            expect(Linq.filter(TestItems.objects, () => true)).to.eql(TestItems.objects, "static:");
            
            expect(new Linq(TestItems.objects).where(() => true).toArray()).to.eql(TestItems.objects, "intantiated:");
            expect(Linq.where(TestItems.objects, () => true)).to.eql(TestItems.objects, "static:");
        });

        it("numbers", function() {
            expect(new Linq(TestItems.numbers).filter(() => true).toArray()).to.eql(TestItems.numbers, "intantiated:");
            expect(Linq.filter(TestItems.numbers, () => true)).to.eql(TestItems.numbers, "static:");
            
            expect(new Linq(TestItems.numbers).where(() => true).toArray()).to.eql(TestItems.numbers, "intantiated:");
            expect(Linq.where(TestItems.numbers, () => true)).to.eql(TestItems.numbers, "static:");
        });
    });

    describe("filter some", function() {
        it("strings", function() {
            expect(new Linq(TestItems.strings).filter(item => item[0] == "m").toArray()).to.eql(["musse", "mimmi"], "intantiated:");
            expect(Linq.filter(TestItems.strings, item => item[0] == "m")).to.eql(["musse", "mimmi"], "static:");
            
            expect(new Linq(TestItems.strings).where(item => item[0] == "m").toArray()).to.eql(["musse", "mimmi"], "intantiated:");
            expect(Linq.where(TestItems.strings, item => item[0] == "m")).to.eql(["musse", "mimmi"], "static:");
        });

        it("objects", function() {
            expect(new Linq(TestItems.objects).filter(item => (item.first[0] == "m")).toArray()).to.eql([TestItems.musse, TestItems.mimmi], "intantiated:");
            expect(Linq.filter(TestItems.objects, item => (item.first[0] == "m"))).to.eql([TestItems.musse, TestItems.mimmi], "static:");
            
            expect(new Linq(TestItems.objects).where(item => (item.first[0] == "m")).toArray()).to.eql([TestItems.musse, TestItems.mimmi], "intantiated:");
            expect(Linq.where(TestItems.objects, item => (item.first[0] == "m"))).to.eql([TestItems.musse, TestItems.mimmi], "static:");
        });

        it("numbers", function() {
            expect(new Linq(TestItems.numbers).filter(item => item % 2 == 0).toArray()).to.eql([0, 2, 4, 6, 8], "intantiated:");
            expect(Linq.filter(TestItems.numbers, item => item % 2 == 0)).to.eql([0, 2, 4, 6, 8], "static:");
            
            expect(new Linq(TestItems.numbers).where(item => item % 2 == 0).toArray()).to.eql([0, 2, 4, 6, 8], "intantiated:");
            expect(Linq.where(TestItems.numbers, item => item % 2 == 0)).to.eql([0, 2, 4, 6, 8], "static:");
        });
    });

    describe("filter none", function() {
        it("strings", function() {
            expect(new Linq(TestItems.strings).filter(() => false).toArray()).to.eql([], "intantiated:");
            expect(Linq.filter(TestItems.strings, () => false)).to.eql([], "static:");
            
            expect(new Linq(TestItems.strings).where(() => false).toArray()).to.eql([], "intantiated:");
            expect(Linq.where(TestItems.strings, () => false)).to.eql([], "static:");
        });

        it("objects", function() {
            expect(new Linq(TestItems.objects).filter(() => false).toArray()).to.eql([], "intantiated:");
            expect(Linq.filter(TestItems.objects, () => false)).to.eql([]);
            
            expect(new Linq(TestItems.objects).where(() => false).toArray()).to.eql([], "intantiated:");
            expect(Linq.where(TestItems.objects, () => false)).to.eql([], "static:");
        });

        it("numbers", function() {
            expect(new Linq(TestItems.numbers).filter((x) => x === -1).toArray()).to.eql([], "intantiated:");
            expect(Linq.filter(TestItems.numbers, (x) => x === -1)).to.eql([], "static:");
            
            expect(new Linq(TestItems.numbers).where((x) => x === -1).toArray()).to.eql([], "intantiated:");
            expect(Linq.where(TestItems.numbers, (x) => x === -1)).to.eql([], "static:");
        });
    });

    describe("first", function() {
        describe("with predicate", function() {
            it("strings", function() {
                expect(new Linq(TestItems.strings).first((item) => item[0] == "m")).to.eql("musse", "intantiated:");
                expect(Linq.first(TestItems.strings, (item) => item[0] == "m")).to.eql("musse", "static:");
            });

            it("objects", function() {
                expect(new Linq(TestItems.objects).first((item) => item.first[0] == "m")).to.eql(TestItems.musse, "intantiated:");
                expect(Linq.first(TestItems.objects, (item) => item.first[0] == "m")).to.eql(TestItems.musse, "static:");
            });

            it("numbers", function() {
                expect(new Linq(TestItems.numbers).first((item) => item % 2 == 1)).to.eql(9, "intantiated:");
                expect(Linq.first(TestItems.numbers, (item) => item % 2 == 1)).to.eql(9, "static:");
            });
        });

        describe("without predicate", function() {
            it("strings", function() {
                expect(new Linq(TestItems.strings).first()).to.eql("kalle", "intantiated:");
                expect(Linq.first(TestItems.strings)).to.eql("kalle", "static:");
            });

            it("objects", function() {
                expect(new Linq(TestItems.objects).first()).to.eql(TestItems.kalle, "intantiated:");
                expect(Linq.first(TestItems.objects)).to.eql(TestItems.kalle, "static:");
            });

            it("numbers", function() {
                expect(new Linq(TestItems.numbers).first()).to.eql(0, "intantiated:");
                expect(Linq.first(TestItems.numbers)).to.eql(0, "static:");
            });
        });
    });

    describe("last", function() {
        describe("with predicate", function() {
            it("strings", function() {
                expect(new Linq(TestItems.strings).last((item) => item[0] == "m")).to.eql("mimmi", "intantiated:");
                expect(Linq.last(TestItems.strings, (item) => item[0] == "m")).to.eql("mimmi", "static:");
            });

            it("objects", function() {
                expect(new Linq(TestItems.objects).last((item) => item.first[0] == "m")).to.eql(TestItems.mimmi, "intantiated:");
                expect(Linq.last(TestItems.objects, (item) => item.first[0] == "m")).to.eql(TestItems.mimmi, "static:");
            });

            it("numbers", function() {
                expect(new Linq(TestItems.numbers).last((item) => item % 2 == 0)).to.eql(8, "intantiated:");
                expect(Linq.last(TestItems.numbers, (item) => item % 2 == 0)).to.eql(8, "static:");
            });
        });

        describe("without predicate", function() {
            it("strings", function() {
                expect(new Linq(TestItems.strings).last()).to.eql("joakim", "intantiated:");
                expect(Linq.last(TestItems.strings)).to.eql("joakim", "static:");
            });

            it("objects", function() {
                expect(new Linq(TestItems.objects).last()).to.eql(TestItems.joakim, "intantiated:");
                expect(Linq.last(TestItems.objects)).to.eql(TestItems.joakim, "static:");
            });

            it("numbers", function() {
                expect(new Linq(TestItems.numbers).last()).to.eql(1, "intantiated:");
                expect(Linq.last(TestItems.numbers)).to.eql(1, "static:");
            });
        });
    });

    describe("single", function() {
        describe("with predicate", function() {

            describe("returns single", function () {
                it("string", function () {
                    expect(new Linq(TestItems.strings).single((item) => item[0] == "l")).to.eql(TestItems.långben.first, "intantiated:");
                    expect(Linq.single(TestItems.strings, (item) => item[0] == "l")).to.eql(TestItems.långben.first, "static:");
                });

                it("object", function () {
                    expect(new Linq(TestItems.objects).single((item) => item.first[0] == "l")).to.eql(TestItems.långben, "intantiated:");
                    expect(Linq.single(TestItems.objects, (item) => item.first[0] == "l")).to.eql(TestItems.långben, "static:");
                });

                it("number", function () {
                    expect(new Linq(TestItems.numbers).single((item) => item / 9 == 1)).to.eql(9, "intantiated:");
                    expect(Linq.single(TestItems.numbers, (item) => item / 9 == 1)).to.eql(9, "static:");
                });
            });

            describe("throws on multiple", function () {
                it("strings", function () {
                    var lq = new Linq(TestItems.strings);

                    let single1 = lq.single.bind(lq, (item) => item[0] == "m");
                    expect(single1).to.throw("The sequence contains more than one element.", "intantiated:");

                    let single2 = Linq.single.bind(undefined, TestItems.strings, (item) => item[0] == "m")
                    expect(single2).to.throw("The sequence contains more than one element.", "static:");
                });

                it("objects", function () {
                    var lq = new Linq(TestItems.objects);

                    var single1 = lq.single.bind(lq, (item) => item.first[0] == "m");
                    expect(single1).to.throw("The sequence contains more than one element.", "intantiated:");

                    var single2 = Linq.single.bind(undefined, TestItems.objects, (item) => item.first[0] == "m");
                    expect(single2).to.throw("The sequence contains more than one element.", "static:");
                });

                it("numbers", function () {
                    var lq = new Linq(TestItems.numbers);

                    var single1 = lq.single.bind(lq, (item) => item % 2 == 1);
                    expect(single1).to.throw("The sequence contains more than one element.", "intantiated:");

                    var single2 = Linq.single.bind(undefined, TestItems.numbers, (item) => item % 2 == 1);
                    expect(single2).to.throw("The sequence contains more than one element.", "static:");
                });
            });

            describe("throws on no matching", function () {
                it("string", function () {
                    var lq = new Linq(TestItems.strings);

                    let single1 = lq.single.bind(lq, (item) => item[0] == "q");
                    expect(single1).to.throw("The sequence is empty.", "intantiated:");

                    let single2 = Linq.single.bind(undefined, TestItems.strings, (item) => item[0] == "q")
                    expect(single2).to.throw("The sequence is empty.", "static:");
                });

                it("object", function () {
                    var lq = new Linq(TestItems.objects);

                    let single1 = lq.single.bind(lq, (item) => item.first[0] == "q");
                    expect(single1).to.throw("The sequence is empty.", "intantiated:");

                    let single2 = Linq.single.bind(undefined, TestItems.objects, (item) => item.first[0] == "q")
                    expect(single2).to.throw("The sequence is empty.", "static:");
                });

                it("number", function () {
                    var lq = new Linq(TestItems.numbers);

                    let single1 = lq.single.bind(lq, (item) => item == 100);
                    expect(single1).to.throw("The sequence is empty.", "intantiated:");

                    let single2 = Linq.single.bind(undefined, TestItems.numbers, (item) => item == 100)
                    expect(single2).to.throw("The sequence is empty.", "static:");
                });
            });
        });
    });

    describe("orderBy", function() {
        it("strings", function() {
            expect(new Linq(TestItems.strings).orderBy(x => x).first()).to.eql("joakim", "intantiated:");
            expect(new Linq(TestItems.strings).orderBy(x => x).last()).to.eql("musse", "intantiated:");
            
            expect(Linq.orderBy(TestItems.strings, x => x)[0]).to.eql("joakim", "static:");
            expect(Linq.orderBy(TestItems.strings, x => x)[TestItems.strings.length - 1]).to.eql("musse", "static:");
        });
        describe("objects", function() {
            it("with function", function() {
                expect(new Linq(TestItems.objects).orderBy(x => x.first).first()).to.eql(TestItems.joakim, "intantiated:");
                expect(new Linq(TestItems.objects).orderBy(x => x.first).last()).to.eql(TestItems.musse, "intantiated:");
            
                expect(Linq.orderBy(TestItems.objects, x => x.first)[0]).to.eql(TestItems.joakim, "static:");
                expect(Linq.orderBy(TestItems.objects, x => x.first)[TestItems.objects.length - 1]).to.eql(TestItems.musse, "static:");
            });

            it("with string", function() {
                expect(new Linq(TestItems.objects).orderBy("first").first()).to.eql(TestItems.joakim, "intantiated:");
                expect(new Linq(TestItems.objects).orderBy("first").last()).to.eql(TestItems.musse, "intantiated:");
            
                expect(Linq.orderBy(TestItems.objects, "first")[0]).to.eql(TestItems.joakim, "static:");
                expect(Linq.orderBy(TestItems.objects, "first")[TestItems.objects.length - 1]).to.eql(TestItems.musse, "static:");
            });
        });
        it("numbers", function() {
            expect(new Linq(TestItems.numbers).orderBy(x => x).first()).to.eql(0, "intantiated:");
            expect(new Linq(TestItems.numbers).orderBy(x => x).last()).to.eql(9, "intantiated:");
            
            expect(Linq.orderBy(TestItems.numbers, x => x)[0]).to.eql(0, "static:");
            expect(Linq.orderBy(TestItems.numbers, x => x)[TestItems.numbers.length - 1]).to.eql(9, "static:");
        });
    });

    describe("orderByDesc", function() {
        it("strings", function() {
            expect(new Linq(TestItems.strings).orderByDesc(x => x).first()).to.eql("musse", "intantiated:");
            expect(Linq.orderByDesc(TestItems.strings, x => x)[0]).to.eql("musse"), "static:";
        });
        describe("objects", function() {
            it("with function", function() { 
                expect(new Linq(TestItems.objects).orderByDesc(x => x.first).last()).to.eql(TestItems.joakim, "intantiated:");
                expect(Linq.orderByDesc(TestItems.objects, x => x.first)[TestItems.objects.length - 1]).to.eql(TestItems.joakim, "static:");
            });

            it("with string",() => { 
                expect(new Linq(TestItems.objects).orderByDesc("first").last()).to.eql(TestItems.joakim, "intantiated:");
                expect(Linq.orderByDesc(TestItems.objects, "first")[TestItems.objects.length - 1]).to.eql(TestItems.joakim, "static:");
            });
        });
        it("numbers",() => { 
            expect(new Linq(TestItems.numbers).orderByDesc(x => x).first()).to.eql(9, "intantiated:");
            expect(Linq.orderByDesc(TestItems.numbers, x => x)[0]).to.eql(9, "static:");
        });
    });

    describe("thenBy", function() {
        // thenBy is not possible with static functions.
        
        describe("objects", function() {
            it("with function", function() {
                expect(new Linq(TestItems.objects).orderBy(x => x.last).thenBy(x => x.first).first()).to.eql(TestItems.joakim, "intantiated:");
            });

            it("with string", function() {
                expect(new Linq(TestItems.objects).orderBy("last").thenBy("first").first()).to.eql(TestItems.joakim, "intantiated:");
            });
        });
        it("numbers", function() {
            expect(new Linq(TestItems.numbers).orderBy(x => x % 2).thenBy(x => x).first()).to.eql(0, "intantiated:");
            expect(new Linq(TestItems.numbers).orderBy(x => x % 2).thenBy(x => x).last()).to.eql(9, "intantiated:");
    
            expect(new Linq(TestItems.numbers).orderBy(x => x % 2).thenBy(x => x % 4).thenBy(x => x).first()).to.eql(0, "intantiated:");
            expect(new Linq(TestItems.numbers).orderBy(x => x % 2).thenBy(x => x % 4).thenBy(x => x).last()).to.eql(7, "intantiated:");
        });
    });

    describe("thenByDesc", function() {
        // thenBy is not possible with static functions.
        
        describe("objects", function() {
            it("with function", function() {
                expect(new Linq(TestItems.objects).orderBy(x => x.last).thenByDesc(x => x.first).first()).to.eql(TestItems.mimmi, "intantiated:");
            });

            it("with string", function() {
                expect(new Linq(TestItems.objects).orderBy("last").thenByDesc("first").first()).to.eql(TestItems.mimmi, "intantiated:");
            });
        });
        it("numbers", function() {
            expect(new Linq(TestItems.numbers).orderBy(x => x % 2).thenByDesc(x => x).first()).to.eql(8, "intantiated:");
            expect(new Linq(TestItems.numbers).orderBy(x => x % 2).thenByDesc(x => x).last()).to.eql(1, "intantiated:");

            expect(new Linq(TestItems.numbers).orderBy(x => x % 2).thenByDesc(x => x % 4).thenBy(x => x).first()).to.eql(2, "intantiated:");
            expect(new Linq(TestItems.numbers).orderBy(x => x % 2).thenByDesc(x => x % 4).thenBy(x => x).last()).to.eql(9, "intantiated:");
            
            expect(new Linq(TestItems.numbers).orderBy(x => x % 2).thenByDesc(x => x % 4).thenByDesc(x => x).first()).to.eql(6, "intantiated:");
            expect(new Linq(TestItems.numbers).orderBy(x => x % 2).thenByDesc(x => x % 4).thenByDesc(x => x).last()).to.eql(1, "intantiated:");
        });
    });

    describe("sum", function() {
        it("without selector", function() {
            expect(new Linq(TestItems.numbers).sum()).to.eql(45, "intantiated:");
            expect(Linq.sum(TestItems.numbers)).to.eql(45);
        });

        it("with selector", function() {
            expect(new Linq(TestItems.numbers).sum(x => x)).to.eql(45, "intantiated:");
            expect(Linq.sum(TestItems.numbers, x => x)).to.eql(45);
        });
    });

    describe("average", function() {
        it("without selector", function() {
            expect(new Linq(TestItems.numbers).average()).to.eql(4.5, "intantiated:");
            expect(Linq.average(TestItems.numbers)).to.eql(4.5, "static:");
            
            expect(new Linq(TestItems.numbers).avg()).to.eql(4.5, "intantiated:");
            expect(Linq.avg(TestItems.numbers)).to.eql(4.5, "static:");
        });

        it("with selector", function() {
            expect(new Linq(TestItems.numbers).average(x => x)).to.eql(4.5, "intantiated:");
            expect(Linq.average(TestItems.numbers, x => x)).to.eql(4.5, "static:");
            
            expect(new Linq(TestItems.numbers).avg(x => x)).to.eql(4.5, "intantiated:");
            expect(Linq.avg(TestItems.numbers, x => x)).to.eql(4.5, "static:");
        });
    });

    describe("min", function() {
        it("without selector", function() {
            expect(new Linq(TestItems.numbers).min()).to.eql(0, "intantiated:");
            expect(Linq.min(TestItems.numbers)).to.eql(0, "static:");
        });

        it("with selector", function() {
            expect(new Linq(TestItems.numbers).min(x => x)).to.eql(0, "intantiated:");
            expect(Linq.min(TestItems.numbers, x => x)).to.eql(0, "static:");
        });
    });

    describe("max", function() {
        it("without selector", function() {
            expect(new Linq(TestItems.numbers).max()).to.eql(9, "intantiated:");
            expect(Linq.max(TestItems.numbers)).to.eql(9, "static:");
        });

        it("with selector", function() {
            expect(new Linq(TestItems.numbers).max(x => x)).to.eql(9, "intantiated:");
            expect(Linq.max(TestItems.numbers, x => x)).to.eql(9, "static:");
        });
    });

    describe("any", function() {
        it("strings", function() {
            expect(new Linq(TestItems.strings).any(item => item[0] == "m")).to.eql(true, "intantiated:");
            expect(new Linq(TestItems.strings).any(item => item[0] == "å")).to.eql(false, "intantiated:");
            
            expect(Linq.any(TestItems.strings, item => item[0] == "m")).to.eql(true, "static:");
            expect(Linq.any(TestItems.strings, item => item[0] == "å")).to.eql(false, "static:");
        });

        it("objects", function() {
            expect(new Linq(TestItems.objects).any(item => item.first[0] == "m")).to.eql(true, "intantiated:");
            expect(new Linq(TestItems.objects).any(item => item.first[0] == "å")).to.eql(false, "intantiated:");
            
            expect(Linq.any(TestItems.objects, item => item.first[0] == "m")).to.eql(true, "static:");
            expect(Linq.any(TestItems.objects, item => item.first[0] == "å")).to.eql(false, "static:");
        });

        it("objects", function() {
            expect(new Linq(TestItems.numbers).any(item => item == 1)).to.eql(true, "intantiated:");
            expect(new Linq(TestItems.numbers).any(item => item == 10)).to.eql(false, "intantiated:");
            
            expect(Linq.any(TestItems.numbers, item => item == 1)).to.eql(true, "static:");
            expect(Linq.any(TestItems.numbers, item => item == 10)).to.eql(false, "static:");
        });

        describe("booleans", function () {
            it("1", function () { expect(Linq.any([true, true, true], x => x)).to.eql(true); });
            it("2", function () { expect(Linq.any([true, true, false], x => x)).to.eql(true); });
            it("3", function () { expect(Linq.any([false, true, true], x => x)).to.eql(true); });
        });
    });

    describe("all", function() {
        it("strings", function() {
            expect(new Linq(TestItems.strings).all(item => item[0] == "m")).to.eql(false, "intantiated:");
            expect(new Linq(TestItems.strings).all(item => item.length > 1)).to.eql(true, "intantiated:");
            
            expect(Linq.all(TestItems.strings, item => item[0] == "m")).to.eql(false, "static:");
            expect(Linq.all(TestItems.strings, item => item.length > 1)).to.eql(true, "static:");
        });

        it("objects", function() {
            expect(new Linq(TestItems.objects).all(item => item.first[0] == "m")).to.eql(false, "intantiated:");
            expect(new Linq(TestItems.objects).all(item => item.first.length > 1)).to.eql(true, "intantiated:");
            
            expect(Linq.all(TestItems.objects, item => item.first[0] == "m")).to.eql(false, "static:");
            expect(Linq.all(TestItems.objects, item => item.first.length > 1)).to.eql(true, "static:");
        });

        it("numbers", function() {
            expect(new Linq(TestItems.numbers).all(item => item < 5)).to.eql(false, "intantiated:");
            expect(new Linq(TestItems.numbers).all(item => item < 10)).to.eql(true, "intantiated:");
            
            expect(Linq.all(TestItems.numbers, item => item < 5)).to.eql(false, "static:");
            expect(Linq.all(TestItems.numbers, item => item < 10)).to.eql(true, "static:");
        });

        describe("booleans", function () {
            it("1", function () { expect(new Linq([true, true, true]).all(x => x)).to.eql(true); });
            it("2", function () { expect(new Linq([true, true, false]).all(x => x)).to.eql(false); });
            it("3", function () { expect(new Linq([false, true, true]).all(x => x)).to.eql(false); });
        });
    });
    
    it("intersect", function() {
        it("default comparer", function () {
            var x = [0, 1, 2, 3],
                y = [2, 3, 4, 5];
            
            expect(new Linq(x).intersect(y).toArray()).to.eql([2, 3], "intantiated:");
            expect(Linq.intersect(x, y)).to.eql([2, 3], "static:");
        });
        it("with comparer", function () {
            var x = TestItems.objects.slice(0, 3),
                y = TestItems.objects.slice(2),
                fn = function (x, y) { return x.last === y.last };

            expect(new Linq(x).intersect(y, fn).toArray()).to.eql([TestItems.kalle, TestItems.långben, "intantiated:"]);
            expect(Linq.intersect(x, y, fn)).to.eql([TestItems.kalle, TestItems.långben, "static:"]);
        });
    });

    describe("except", function() {
        it("default comparer", function () {
            var x = [0, 1, 2, 3],
                y = [2, 3, 4, 5];
            
            expect(new Linq(x).except(y).toArray()).to.eql([0, 1], "intantiated:");
            expect(Linq.except(x, y)).to.eql([0, 1], "static:");
        });
        it("with comparer", function () {
            var x = TestItems.objects.slice(0, 3),
                y = TestItems.objects.slice(2),
                fn = function (x, y) { return x.last === y.last };

            expect(new Linq(x).except(y, fn).toArray()).to.eql([TestItems.musse], "intantiated:");
            expect(Linq.except(x, y, fn)).to.eql([TestItems.musse], "static:");
        });            
    });

    describe("distinct", function () {
        it("default comparer", function() {
            var x = [1, 2, 3, 4, 5, 4, 3, 2, 1];
            
            expect(new Linq(x).distinct().toArray()).to.eql([1, 2, 3, 4, 5], "intantiated:");
            expect(Linq.distinct(x)).to.eql([1, 2, 3, 4, 5], "static:");
        });

        it("with comparer", function() {
            // we compare only lastnames, therefore "mimmi anka" and "joakim anka" will be excluded, because we already have "kalle anka"
            var fn = function (x, y) { return x.last === y.last };
            
            expect(new Linq(TestItems.objects).distinct(fn).toArray()).to.eql([TestItems.kalle, TestItems.musse, TestItems.långben], "intantiated:");
            expect(Linq.distinct(TestItems.objects, fn)).to.eql([TestItems.kalle, TestItems.musse, TestItems.långben], "static:");
        });
    })
    

    describe("groupBy", function() {
        describe("objects", function() {
            var groupByArr = [
                { key: 1, value: 1 },
                { key: 2, value: 3 },
                { key: 1, value: 2 },
                { key: 3, value: 5 },
                { key: 2, value: 4 }
            ];

            it("with function", function() {
                expect(new Linq(groupByArr).groupBy(x => x.key).toArray().length).to.eql(3, "intantiated:");
                expect(Linq.groupBy(groupByArr, x => x.key).length).to.eql(3, "static:");
            });

            it("with string", function() {
                expect(new Linq(groupByArr).groupBy("key").toArray().length).to.eql(3, "intantiated:");
                expect(Linq.groupBy(groupByArr, "key").length).to.eql(3, "static:");
            });
        });
    });

    it("zip", function() {
        function cb(str, obj) { return { first: str, last: obj.last } }
        
        expect(new Linq(TestItems.strings).zip(TestItems.objects, cb).toArray()).to.eql(TestItems.objects, "intantiated:");
        expect(Linq.zip(TestItems.strings, TestItems.objects, cb)).to.eql(TestItems.objects, "static:");
    });
});
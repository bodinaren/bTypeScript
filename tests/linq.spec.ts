/// <reference path="../typings/main.d.ts" />

import * as Util from "../src/util";
import {Linq, TakeIterator, TakeWhileIterator, SkipIterator, SkipWhileIterator, MapIterator, FilterIterator, OrderIterator, OrderedLinq} from "../src/linq";
import {expect} from 'chai';

describe("Linq", function() {
    const _kalle = { first: "kalle", last: "anka" },
        _musse = { first: "musse", last: "pigg" },
        _långben = { first: "långben", last: "långben" },
        _mimmi = { first: "mimmi", last: "anka" },
        _joakim = { first: "joakim", last: "anka" },

        _numbers = [0, 2, 4, 6, 8, 9, 7, 5, 3, 1],
        _strings = [_kalle.first, _musse.first, _långben.first, _mimmi.first, _joakim.first],
        _objects = [_kalle, _musse, _långben, _mimmi, _joakim],
        _associative = {
            "kalle": _kalle,
            "musse": _musse,
            "långben": _långben,
            "mimmi": _mimmi,
            "joakim": _joakim,
        };
    
    describe("Iterators", function() {
        it("TakeIterator", function() {
            var it = new TakeIterator(_numbers, 2);
            expect(it.next()).to.eql(0);
            expect(it.next()).to.eql(2);
            expect(it.next()).to.be.undefined;
        });
    
        it("TakeWhileIterator", function() {
            var it = new TakeWhileIterator(_numbers, x => x < 8);
            expect(it.next()).to.eql(0);
            expect(it.next()).to.eql(2);
            expect(it.next()).to.eql(4);
            expect(it.next()).to.eql(6);
            expect(it.next()).to.be.undefined;
        });
    
        it("SkipIterator", function() {
            var it = new SkipIterator(_numbers, 7);
            expect(it.next()).to.eql(5);
            expect(it.next()).to.eql(3);
            expect(it.next()).to.eql(1);
            expect(it.next()).to.be.undefined;
        });
    
        it("SkipWhileIterator", function() {
            var it = new SkipWhileIterator(_numbers, x => x != 7);
            expect(it.next()).to.eql(7);
            expect(it.next()).to.eql(5);
            expect(it.next()).to.eql(3);
            expect(it.next()).to.eql(1);
            expect(it.next()).to.be.undefined;
        });
    
        it("MapIterator", function() {
            var it = new MapIterator(_strings, x => x[0]);
            expect(it.next()).to.eql("k");
            expect(it.next()).to.eql("m");
            expect(it.next()).to.eql("l");
            expect(it.next()).to.eql("m");
            expect(it.next()).to.eql("j");
            expect(it.next()).to.be.undefined;
        });
        
        it("FilterIterator", function() {
            var it = new FilterIterator(_objects, x => x.last == "anka");
            expect(it.next()).to.eql(_kalle);
            expect(it.next()).to.eql(_mimmi);
            expect(it.next()).to.eql(_joakim);
            expect(it.next()).to.be.undefined;
        });

        describe("OrderIterator", function() {
            it("ascending", function() {
                var it = new OrderIterator(_numbers, x => x);
                expect(it.next()).to.eql(0);
                expect(it.next()).to.eql(1);
                expect(it.next()).to.eql(2);
                expect(it.next()).to.eql(3);
                expect(it.next()).to.eql(4);
                expect(it.next()).to.eql(5);
                expect(it.next()).to.eql(6);
                expect(it.next()).to.eql(7);
                expect(it.next()).to.eql(8);
                expect(it.next()).to.eql(9);
                expect(it.next()).to.be.undefined;
            });
            
            it("descending", function() {
                var it = new OrderIterator(_numbers, x => x, Util.defaultComparer, true);
                expect(it.next()).to.eql(9);
                expect(it.next()).to.eql(8);
                expect(it.next()).to.eql(7);
                expect(it.next()).to.eql(6);
                expect(it.next()).to.eql(5);
                expect(it.next()).to.eql(4);
                expect(it.next()).to.eql(3);
                expect(it.next()).to.eql(2);
                expect(it.next()).to.eql(1);
                expect(it.next()).to.eql(0);
                expect(it.next()).to.be.undefined;
            });
        });
    });
    
    describe("Linq", function() {
        describe("chaining", function() {
            describe("strings", function() {
                it("maps before next function", function() {
                    var arr = new Linq(_strings)
                        .map(item => item.substr(0, 2))
                        .map(item => item.substr(1))
                        .toArray();

                    expect(arr).to.eql(["a", "u", "å", "i", "o"]);
                });
            });

            describe("objects", function() {
                it("maps before next function", function() {
                    var arr = new Linq(_objects)
                        .map(item => item.first)
                        .map(item => item.substr(0, 2))
                        .map(item => item.substr(1))
                        .toArray();

                    expect(arr).to.eql(["a", "u", "å", "i", "o"]);
                });
            });

            describe("numbers", function() {
                it("maps before next function", function() {
                    var arr = new Linq(_numbers)
                        .map(item => item * 3)
                        .map(item => item / 2)
                        .toArray();

                    expect(arr).to.eql([0, 3, 6, 9, 12, 13.5, 10.5, 7.5, 4.5, 1.5]);
                });
            });

        });

        describe("toArray", function() {
            it("string", 
                () => expect(new Linq(_strings).toArray()).to.eql(_strings));

            it("objects",
                () => expect(new Linq(_objects).toArray()).to.eql(_objects));

            it("numbers",
                () => expect(new Linq(_numbers).toArray()).to.eql(_numbers));
        });

        describe("map", function() {

            it("strings", function() {
                expect(new Linq(_strings).map(item => item.substr(0, 2)).toArray())
                    .to.eql(["ka", "mu", "lå", "mi", "jo"])
                    
                expect(Linq.map(_strings, item => item.substr(0, 2)))
                    .to.eql(["ka", "mu", "lå", "mi", "jo"])
            });

            it("objects", function() {
                expect(new Linq(_objects).map(item => item.first.substr(0, 2)).toArray())
                    .to.eql(["ka", "mu", "lå", "mi", "jo"]);
                    
                expect(Linq.map(_objects, item => item.first.substr(0, 2)))
                    .to.eql(["ka", "mu", "lå", "mi", "jo"]);
            });

            it("numbers", function() {
                expect(new Linq(_numbers).map(item => item * 2).toArray())
                    .to.eql([0, 4, 8, 12, 16, 18, 14, 10, 6, 2]);
                    
                expect(Linq.map(_numbers, item => item * 2))
                    .to.eql([0, 4, 8, 12, 16, 18, 14, 10, 6, 2]);
            });
        });

        describe("take", function() {
            it("strings", function() {
                expect(new Linq(_strings).take(2).toArray()).to.eql(["kalle", "musse"]);
                expect(Linq.take(_strings, 2)).to.eql(["kalle", "musse"]);
            });
            
            it("objects", function() {
                expect(new Linq(_objects).take(2).toArray()).to.eql([_kalle, _musse]);
                expect(Linq.take(_objects, 2)).to.eql([_kalle, _musse]);
            });
            
            it("numbers", function() {
                expect(new Linq(_numbers).take(2).toArray()).to.eql([0, 2]);
                expect(Linq.take(_numbers, 2)).to.eql([0, 2]);
            });
        });

        describe("skip", function() {
            it("strings", function() {
                expect(new Linq(_strings).skip(3).toArray()).to.eql(["mimmi", "joakim"]);
                expect(Linq.skip(_strings, 3)).to.eql(["mimmi", "joakim"]);
            });
            
            it("objects", function() {
                expect(new Linq(_objects).skip(3).toArray()).to.eql([_mimmi, _joakim]);
                expect(Linq.skip(_objects, 3)).to.eql([_mimmi, _joakim]);
            });
            
            it("numbers", function() {
                expect(new Linq(_numbers).skip(3).toArray()).to.eql([6, 8, 9, 7, 5, 3, 1]);
                expect(Linq.skip(_numbers, 3)).to.eql([6, 8, 9, 7, 5, 3, 1]);
            });
        });

        describe("takeWhile", function() {
            it("strings", function() {
                expect(new Linq(_strings).takeWhile(x => x.length == 5).toArray()).to.eql(["kalle", "musse"]);
                expect(Linq.takeWhile(_strings, x => x.length == 5)).to.eql(["kalle", "musse"]);
            });

            it("objects", function() {
                expect(new Linq(_objects).takeWhile(x => x.first.length == 5).toArray()).to.eql([_kalle, _musse]);
                expect(Linq.takeWhile(_objects, x => x.first.length == 5)).to.eql([_kalle, _musse]);
            });

            it("numbers", function() {
                expect(new Linq(_numbers).takeWhile(x => x < 8).toArray()).to.eql([0, 2, 4, 6]);
                expect(Linq.takeWhile(_numbers, x => x < 8)).to.eql([0, 2, 4, 6]);
            });
        });

        describe("skipWhile", function() {
            it("strings", function() {
                expect(new Linq(_strings).skipWhile(x => x.length == 5).toArray()).to.eql(["långben", "mimmi", "joakim"]);
                expect(Linq.skipWhile(_strings, x => x.length == 5)).to.eql(["långben", "mimmi", "joakim"]);
            });

            it("objects", function() {
                expect(new Linq(_objects).skipWhile(x => x.first.length == 5).toArray()).to.eql([_långben, _mimmi, _joakim]);
                expect(Linq.skipWhile(_objects, x => x.first.length == 5)).to.eql([_långben, _mimmi, _joakim]);
            });

            it("numbers", function() {
                expect(new Linq(_numbers).skipWhile(x => x !== 7).toArray()).to.eql([7, 5, 3, 1]);
                expect(Linq.skipWhile(_numbers, x => x !== 7)).to.eql([7, 5, 3, 1]);
            });
        });

        describe("filter all", function() {
            it("strings", function() {
                expect(new Linq(_strings).filter(() => true).toArray()).to.eql(_strings);
                expect(Linq.filter(_strings, () => true)).to.eql(_strings);
            });

            it("objects", function() {
                expect(new Linq(_objects).filter(() => true).toArray()).to.eql(_objects);
                expect(Linq.filter(_objects, () => true)).to.eql(_objects);
            });

            it("numbers", function() {
                expect(new Linq(_numbers).filter(() => true).toArray()).to.eql(_numbers);
                expect(Linq.filter(_numbers, () => true)).to.eql(_numbers);
            });
        });

        describe("filter some", function() {
            it("strings", function() {
                expect(new Linq(_strings).filter(item => item[0] == "m").toArray())
                    .to.eql(["musse", "mimmi"]);
                
                expect(Linq.filter(_strings, item => item[0] == "m"))
                    .to.eql(["musse", "mimmi"]);
            });

            it("objects", function() {
                expect(new Linq(_objects).filter(item => (item.first[0] == "m")).toArray())
                    .to.eql([_musse, _mimmi]);
                
                expect(Linq.filter(_objects, item => (item.first[0] == "m")))
                    .to.eql([_musse, _mimmi]);
            });

            it("numbers", function() {
                expect(new Linq(_numbers).filter(item => item % 2 == 0).toArray())
                    .to.eql([0, 2, 4, 6, 8]);
                
                expect(Linq.filter(_numbers, item => item % 2 == 0))
                    .to.eql([0, 2, 4, 6, 8]);
            });
        });

        describe("filter none", function() {
            it("strings", function() {
                expect(new Linq(_strings).filter(() => false).toArray()).to.eql([]);
                expect(Linq.filter(_strings, () => false)).to.eql([]);
            });

            it("objects", function() {
                expect(new Linq(_objects).filter(() => false).toArray()).to.eql([]);
                expect(Linq.filter(_objects, () => false)).to.eql([]);
            });

            it("numbers", function() {
                expect(new Linq(_numbers).filter((x) => x === -1).toArray()).to.eql([]);
                expect(Linq.filter(_numbers, (x) => x === -1)).to.eql([]);
            });
        });

        describe("first", function() {
            describe("with predicate", function() {
                it("strings", function() {
                    expect(new Linq(_strings).first((item) => item[0] == "m")).to.eql("musse");
                    expect(Linq.first(_strings, (item) => item[0] == "m")).to.eql("musse");
                });

                it("objects", function() {
                    expect(new Linq(_objects).first((item) => item.first[0] == "m")).to.eql(_musse);
                    expect(Linq.first(_objects, (item) => item.first[0] == "m")).to.eql(_musse);
                });

                it("numbers", function() {
                    expect(new Linq(_numbers).first((item) => item % 2 == 1)).to.eql(9);
                    expect(Linq.first(_numbers, (item) => item % 2 == 1)).to.eql(9);
                });
            });

            describe("without predicate", function() {
                it("strings", function() {
                    expect(new Linq(_strings).first()).to.eql("kalle");
                    expect(Linq.first(_strings)).to.eql("kalle");
                });

                it("objects", function() {
                    expect(new Linq(_objects).first()).to.eql(_kalle);
                    expect(Linq.first(_objects)).to.eql(_kalle);
                });

                it("numbers", function() {
                    expect(new Linq(_numbers).first()).to.eql(0);
                    expect(Linq.first(_numbers)).to.eql(0);
                });
            });
        });

        describe("last", function() {
            describe("with predicate", function() {
                it("strings", function() {
                    expect(new Linq(_strings).last((item) => item[0] == "m")).to.eql("mimmi");
                    expect(Linq.last(_strings, (item) => item[0] == "m")).to.eql("mimmi");
                });

                it("objects", function() {
                    expect(new Linq(_objects).last((item) => item.first[0] == "m")).to.eql(_mimmi);
                    expect(Linq.last(_objects, (item) => item.first[0] == "m")).to.eql(_mimmi);
                });

                it("numbers", function() {
                    expect(new Linq(_numbers).last((item) => item % 2 == 0)).to.eql(8);
                    expect(Linq.last(_numbers, (item) => item % 2 == 0)).to.eql(8);
                });
            });

            describe("without predicate", function() {
                it("strings", function() {
                    expect(new Linq(_strings).last()).to.eql("joakim");
                    expect(Linq.last(_strings)).to.eql("joakim");
                });

                it("objects", function() {
                    expect(new Linq(_objects).last()).to.eql(_joakim);
                    expect(Linq.last(_objects)).to.eql(_joakim);
                });

                it("numbers", function() {
                    expect(new Linq(_numbers).last()).to.eql(1);
                    expect(Linq.last(_numbers)).to.eql(1);
                });
            });
        });

        describe("single", function() {
            describe("with predicate", function() {
                it("strings", function() {
                    var single1 = new Linq(_strings).single,
                        single2 = Linq.single;
                    
                    single1.bind((item) => item[0] == "m");
                    single2.bind(_strings, (item) => item[0] == "m")
                    
                    expect(single1).to.throw();
                    expect(new Linq(_strings).single((item) => item[0] == "l")).to.eql(_långben.first);
                    
                    expect(single2).to.throw();
                    expect(Linq.single(_strings, (item) => item[0] == "l")).to.eql(_långben.first);
                });

                it("objects", function() {
                    var single1 = new Linq(_strings).single,
                        single2 = Linq.single;
                    
                    single1.bind((item) => item.first[0] == "m");
                    single2.bind(_strings, (item) => item.first[0] == "m");
                    
                    expect(single1).to.throw();
                    expect(new Linq(_objects).single((item) => item.first[0] == "l")).to.eql(_långben);
                    
                    expect(single2).to.throw();
                    expect(Linq.single(_objects, (item) => item.first[0] == "l")).to.eql(_långben);
                });

                it("numbers", function() {
                    var single1 = new Linq(_strings).single,
                        single2 = Linq.single;
                    
                    single1.bind((item) => item % 2 == 1);
                    single2.bind(_strings, (item) => item % 2 == 1);
                    
                    expect(single1).to.throw();
                    expect(new Linq(_numbers).single((item) => item / 9 == 1)).to.eql(9);
                    
                    expect(single2).to.throw();
                    expect(Linq.single(_numbers, (item) => item / 9 == 1)).to.eql(9);
                });
            });
        });

        describe("orderBy", function() {
            it("strings", function() {
                expect(new Linq(_strings).orderBy(x => x).first()).to.eql("joakim");
                expect(new Linq(_strings).orderBy(x => x).last()).to.eql("musse");
                
                expect(Linq.orderBy(_strings, x => x)[0]).to.eql("joakim");
                expect(Linq.orderBy(_strings, x => x)[_strings.length - 1]).to.eql("musse");
            });
            describe("objects", function() {
                it("with function", function() {
                    expect(new Linq(_objects).orderBy(x => x.first).first()).to.eql(_joakim);
                    expect(new Linq(_objects).orderBy(x => x.first).last()).to.eql(_musse);
                
                    expect(Linq.orderBy(_objects, x => x.first)[0]).to.eql(_joakim);
                    expect(Linq.orderBy(_objects, x => x.first)[_objects.length - 1]).to.eql(_musse);
                });

                it("with string", function() {
                    expect(new Linq(_objects).orderBy("first").first()).to.eql(_joakim);
                    expect(new Linq(_objects).orderBy("first").last()).to.eql(_musse);
                
                    expect(Linq.orderBy(_objects, "first")[0]).to.eql(_joakim);
                    expect(Linq.orderBy(_objects, "first")[_objects.length - 1]).to.eql(_musse);
                });
            });
            it("numbers", function() {
                expect(new Linq(_numbers).orderBy(x => x).first()).to.eql(0);
                expect(new Linq(_numbers).orderBy(x => x).last()).to.eql(9);
                
                expect(Linq.orderBy(_numbers, x => x)[0]).to.eql(0);
                expect(Linq.orderBy(_numbers, x => x)[_numbers.length - 1]).to.eql(9);
            });
        });

        describe("orderByDesc", function() {
            it("strings", function() {
                expect(new Linq(_strings).orderByDesc(x => x).first()).to.eql("musse");
                expect(Linq.orderByDesc(_strings, x => x)[0]).to.eql("musse");
            });
            describe("objects", function() {
                it("with function", function() { 
                    expect(new Linq(_objects).orderByDesc(x => x.first).last()).to.eql(_joakim);
                    expect(Linq.orderByDesc(_objects, x => x.first)[_objects.length - 1]).to.eql(_joakim);
                });

                it("with string",() => { 
                    expect(new Linq(_objects).orderByDesc("first").last()).to.eql(_joakim);
                    expect(Linq.orderByDesc(_objects, "first")[_objects.length - 1]).to.eql(_joakim);
                });
            });
            it("numbers",() => { 
                expect(new Linq(_numbers).orderByDesc(x => x).first()).to.eql(9);
                expect(Linq.orderByDesc(_numbers, x => x)[0]).to.eql(9);
            });
        });

        describe("thenBy", function() {
            // thenBy is not possible with static functions.
            
            describe("objects", function() {
                it("with function", function() {
                    expect(new Linq(_objects).orderBy(x => x.last).thenBy(x => x.first).first()).to.eql(_joakim);
                });

                it("with string", function() {
                    expect(new Linq(_objects).orderBy("last").thenBy("first").first()).to.eql(_joakim);
                });
            });
            it("numbers", function() {
                expect(new Linq(_numbers).orderBy(x => x % 2).thenBy(x => x).first()).to.eql(0);
                expect(new Linq(_numbers).orderBy(x => x % 2).thenBy(x => x).last()).to.eql(9);
       
                expect(new Linq(_numbers).orderBy(x => x % 2).thenBy(x => x % 4).thenBy(x => x).first()).to.eql(0);
                expect(new Linq(_numbers).orderBy(x => x % 2).thenBy(x => x % 4).thenBy(x => x).last()).to.eql(7);
            });
        });

        describe("thenByDesc", function() {
            // thenBy is not possible with static functions.
            
            describe("objects", function() {
                it("with function", function() {
                    expect(new Linq(_objects).orderBy(x => x.last).thenByDesc(x => x.first).first()).to.eql(_mimmi);
                });

                it("with string", function() {
                    expect(new Linq(_objects).orderBy("last").thenByDesc("first").first()).to.eql(_mimmi);
                });
            });
            it("numbers", function() {
                expect(new Linq(_numbers).orderBy(x => x % 2).thenByDesc(x => x).first()).to.eql(8);
                expect(new Linq(_numbers).orderBy(x => x % 2).thenByDesc(x => x).last()).to.eql(1);

                expect(new Linq(_numbers).orderBy(x => x % 2).thenByDesc(x => x % 4).thenBy(x => x).first()).to.eql(2);
                expect(new Linq(_numbers).orderBy(x => x % 2).thenByDesc(x => x % 4).thenBy(x => x).last()).to.eql(9);
                
                expect(new Linq(_numbers).orderBy(x => x % 2).thenByDesc(x => x % 4).thenByDesc(x => x).first()).to.eql(6);
                expect(new Linq(_numbers).orderBy(x => x % 2).thenByDesc(x => x % 4).thenByDesc(x => x).last()).to.eql(1);
            });
        });

        describe("sum", function() {
            it("without selector", function() {
                expect(new Linq(_numbers).sum()).to.eql(45);
                expect(Linq.sum(_numbers)).to.eql(45);
            });

            it("with selector", function() {
                expect(new Linq(_numbers).sum(x => x)).to.eql(45);
                expect(Linq.sum(_numbers, x => x)).to.eql(45);
            });
        });

        describe("average", function() {
            it("without selector", function() {
                expect(new Linq(_numbers).average()).to.eql(4.5);
                expect(Linq.average(_numbers)).to.eql(4.5);
            });

            it("with selector", function() {
                expect(new Linq(_numbers).average(x => x)).to.eql(4.5);
                expect(Linq.average(_numbers, x => x)).to.eql(4.5);
            });
        });

        describe("any", function() {
            it("strings", function() {
                expect(new Linq(_strings).any(item => item[0] == "m")).to.eql(true);
                expect(new Linq(_strings).any(item => item[0] == "å")).to.eql(false);
                
                expect(Linq.any(_strings, item => item[0] == "m")).to.eql(true);
                expect(Linq.any(_strings, item => item[0] == "å")).to.eql(false);
            });

            it("objects", function() {
                expect(new Linq(_objects).any(item => item.first[0] == "m")).to.eql(true);
                expect(new Linq(_objects).any(item => item.first[0] == "å")).to.eql(false);
                
                expect(Linq.any(_objects, item => item.first[0] == "m")).to.eql(true);
                expect(Linq.any(_objects, item => item.first[0] == "å")).to.eql(false);
            });

            it("objects", function() {
                expect(new Linq(_numbers).any(item => item == 1)).to.eql(true);
                expect(new Linq(_numbers).any(item => item == 10)).to.eql(false);
                
                expect(Linq.any(_numbers, item => item == 1)).to.eql(true);
                expect(Linq.any(_numbers, item => item == 10)).to.eql(false);
            });

            describe("booleans", function () {
                it("1", function () { expect(Linq.any([true, true, true], x => x)).to.eql(true); });
                it("2", function () { expect(Linq.any([true, true, false], x => x)).to.eql(true); });
                it("3", function () { expect(Linq.any([false, true, true], x => x)).to.eql(true); });
            });
        });

        describe("all", function() {
            it("strings", function() {
                expect(new Linq(_strings).all(item => item[0] == "m")).to.eql(false);
                expect(new Linq(_strings).all(item => item.length > 1)).to.eql(true);
                
                expect(Linq.all(_strings, item => item[0] == "m")).to.eql(false);
                expect(Linq.all(_strings, item => item.length > 1)).to.eql(true);
            });

            it("objects", function() {
                expect(new Linq(_objects).all(item => item.first[0] == "m")).to.eql(false);
                expect(new Linq(_objects).all(item => item.first.length > 1)).to.eql(true);
                
                expect(Linq.all(_objects, item => item.first[0] == "m")).to.eql(false);
                expect(Linq.all(_objects, item => item.first.length > 1)).to.eql(true);
            });

            it("numbers", function() {
                expect(new Linq(_numbers).all(item => item < 5)).to.eql(false);
                expect(new Linq(_numbers).all(item => item < 10)).to.eql(true);
                
                expect(Linq.all(_numbers, item => item < 5)).to.eql(false);
                expect(Linq.all(_numbers, item => item < 10)).to.eql(true);
            });

            describe("booleans", function () {
                it("1", function () { expect(new Linq([true, true, true]).all(x => x)).to.eql(true); });
                it("2", function () { expect(new Linq([true, true, false]).all(x => x)).to.eql(false); });
                it("3", function () { expect(new Linq([false, true, true]).all(x => x)).to.eql(false); });
            });
        });
        
        it("intersect", function() {
            var x = [0, 1, 2, 3],
                y = [1, 2, 3, 4],
                z = [2, 3, 4, 5];
            
            expect(new Linq(x).intersect(y, z).toArray()).to.eql([2, 3]);
            expect(Linq.intersect(x, y, z)).to.eql([2, 3]);
        });

        it("except", function() {
            var x = [0, 1, 2, 3],
                y = [3, 4, 5, 6],
                z = [6, 7, 8, 9];
            
            expect(new Linq(x).except(y, z).toArray()).to.eql([0, 1, 2, 4, 5, 7, 8, 9]);
            expect(Linq.except(x, y, z)).to.eql([0, 1, 2, 4, 5, 7, 8, 9]);
        });

        it("distinct", function() {
            var x = [1, 2, 3, 4, 5, 4, 3, 2, 1],
                y = [5, 6, 7, 8, 9, 8, 7, 6, 5];
            
            expect(new Linq(x).distinct().toArray()).to.eql([1, 2, 3, 4, 5]);
            expect(Linq.distinct(x)).to.eql([1, 2, 3, 4, 5]);
            expect(Linq.distinct(x, y)).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });

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
                    expect(new Linq(groupByArr).groupBy(x => x.key).toArray().length).to.eql(3);
                    expect(Linq.groupBy(groupByArr, x => x.key).length).to.eql(3);
                });

                it("with string", function() {
                    expect(new Linq(groupByArr).groupBy("key").toArray().length).to.eql(3);
                    expect(Linq.groupBy(groupByArr, "key").length).to.eql(3);
                });
            });
        }); 
    });
});
/// <reference path="../typings/main.d.ts" />

import * as Util from "../src/util";
import Linq, {TakeIterator, TakeWhileIterator, SkipIterator, SkipWhileIterator, MapIterator, FilterIterator, OrderIterator, LinqOrdered} from "../src/linq";

describe("Linq", () => {
    var _kalle = { first: "kalle", last: "anka" },
        _musse = { first: "musse", last: "pigg" },
        _långben = { first: "långben", last: "långben" },
        _mimmi = { first: "mimmi", last: "anka" },
        _joakim = { first: "joakim", last: "anka" },

        _numbers = [2, 4, 6, 8, 9, 7, 5, 3, 1],
        _strings = [_kalle.first, _musse.first, _långben.first, _mimmi.first, _joakim.first],
        _objects = [_kalle, _musse, _långben, _mimmi, _joakim],
        _associative = {
            "kalle": _kalle,
            "musse": _musse,
            "långben": _långben,
            "mimmi": _mimmi,
            "joakim": _joakim,
        };
 
    describe("Iterators", () => {
        it("TakeIterator", () => {
            var it = new TakeIterator(_numbers, 2);
            expect(it.next()).toEqual(2);
            expect(it.next()).toEqual(4);
            expect(it.next()).toBeUndefined();
        });
    
        it("TakeWhileIterator", () => {
            var it = new TakeWhileIterator(_numbers, x => x < 8);
            expect(it.next()).toEqual(2);
            expect(it.next()).toEqual(4);
            expect(it.next()).toEqual(6);
            expect(it.next()).toBeUndefined();
        });
    
        it("SkipIterator", () => {
            var it = new SkipIterator(_numbers, 7);
            expect(it.next()).toEqual(3);
            expect(it.next()).toEqual(1);
            expect(it.next()).toBeUndefined();
        });
    
        it("SkipWhileIterator", () => {
            var it = new SkipWhileIterator(_numbers, x => x != 7);
            expect(it.next()).toEqual(5);
            expect(it.next()).toEqual(3);
            expect(it.next()).toEqual(1);
            expect(it.next()).toBeUndefined();
        });
    
        it("MapIterator", () => {
            var it = new MapIterator(_strings, x => x[0]);
            expect(it.next()).toEqual("k");
            expect(it.next()).toEqual("m");
            expect(it.next()).toEqual("l");
            expect(it.next()).toEqual("m");
            expect(it.next()).toEqual("j");
            expect(it.next()).toBeUndefined();
        });
        
        it("FilterIterator", () => {
            var it = new FilterIterator(_objects, x => x.last == "anka");
            expect(it.next()).toEqual(_kalle);
            expect(it.next()).toEqual(_mimmi);
            expect(it.next()).toEqual(_joakim);
            expect(it.next()).toBeUndefined();
        });
        
        describe("OrderIterator", () => {
            it("ascending", () => {
                var it = new OrderIterator(_numbers, x => x);
                expect(it.next()).toEqual(1);
                expect(it.next()).toEqual(2);
                expect(it.next()).toEqual(3);
                expect(it.next()).toEqual(4);
                expect(it.next()).toEqual(5);
                expect(it.next()).toEqual(6);
                expect(it.next()).toEqual(7);
                expect(it.next()).toEqual(8);
                expect(it.next()).toEqual(9);
                expect(it.next()).toBeUndefined();
            });
            
            it("descending", () => {
                var it = new OrderIterator(_numbers, x => x, Util.defaultComparer, true);
                expect(it.next()).toEqual(9);
                expect(it.next()).toEqual(8);
                expect(it.next()).toEqual(7);
                expect(it.next()).toEqual(6);
                expect(it.next()).toEqual(5);
                expect(it.next()).toEqual(4);
                expect(it.next()).toEqual(3);
                expect(it.next()).toEqual(2);
                expect(it.next()).toEqual(1);
                expect(it.next()).toBeUndefined();
            });
        });
    });
    
    describe("Linq", () => {
        describe("chaining", () => {
            describe("strings", () => {
                it("maps before next function", () => {
                    var arr = new Linq(_strings)
                        .map(item => item.substr(0, 2))
                        .map(item => item.substr(1))
                        .toArray();

                    expect(arr).toEqual(["a", "u", "å", "i", "o"]);
                });
            });

            describe("objects", () => {
                it("maps before next function", () => {
                    var arr = new Linq(_objects)
                        .map(item => item.first)
                        .map(item => item.substr(0, 2))
                        .map(item => item.substr(1))
                        .toArray();

                    expect(arr).toEqual(["a", "u", "å", "i", "o"]);
                });
            });

            describe("numbers", () => {
                it("maps before next function", () => {
                    var arr = new Linq(_numbers)
                        .map(item => item * 3)
                        .map(item => item / 2)
                        .toArray();

                    expect(arr).toEqual([3, 6, 9, 12, 13.5, 10.5, 7.5, 4.5, 1.5]);
                });
            });

        });

        describe("toArray", () => {
            it("string",
                () => expect(new Linq(_strings).toArray()).toEqual(_strings));

            it("objects",
                () => expect(new Linq(_objects).toArray()).toEqual(_objects));

            it("numbers",
                () => expect(new Linq(_numbers).toArray()).toEqual(_numbers));
        });

        describe("map", () => {

            it("strings",
                () => expect(new Linq(_strings).map(item => item.substr(0, 2)).toArray())
                    .toEqual(["ka", "mu", "lå", "mi", "jo"]));

            it("objects",
                () => expect(new Linq(_objects).map(item => item.first.substr(0, 2)).toArray())
                    .toEqual(["ka", "mu", "lå", "mi", "jo"]));

            it("numbers",
                () => expect(new Linq(_numbers).map(item => item * 2).toArray())
                    .toEqual([4, 8, 12, 16, 18, 14, 10, 6, 2]));
        });

        describe("take", () => {
            it("strings",
                () => expect(new Linq(_strings).take(2).toArray()).toEqual(["kalle", "musse"]));

            it("objects",
                () => expect(new Linq(_objects).take(2).toArray()).toEqual([_kalle, _musse]));

            it("numbers",
                () => expect(new Linq(_numbers).take(2).toArray()).toEqual([2, 4]));
        });

        describe("skip", () => {
            it("strings",
                () => expect(new Linq(_strings).skip(3).toArray()).toEqual(["mimmi", "joakim"]));
            
            it("objects",
                () => expect(new Linq(_objects).skip(3).toArray()).toEqual([_mimmi, _joakim]));

            it("numbers",
                () => expect(new Linq(_numbers).skip(3).toArray()).toEqual([8, 9, 7, 5, 3, 1]));
        });

        describe("takeWhile", () => {
            it("strings",
                () => expect(new Linq(_strings).takeWhile(x => x.length == 5).toArray()).toEqual(["kalle", "musse"]));

            it("objects",
                () => expect(new Linq(_objects).takeWhile(x => x.first.length == 5).toArray()).toEqual([_kalle, _musse]));

            it("numbers",
                () => expect(new Linq(_numbers).takeWhile(x => x < 8).toArray()).toEqual([2, 4, 6]));
        });

        describe("skipWhile", () => {
            it("strings",
                () => expect(new Linq(_strings).skipWhile(x => x.length == 5).toArray()).toEqual(["långben", "mimmi", "joakim"]));

            it("objects",
                () => expect(new Linq(_objects).skipWhile(x => x.first.length == 5).toArray()).toEqual([_långben, _mimmi, _joakim]));

            it("numbers",
                () => expect(new Linq(_numbers).skipWhile(x => x !== 7).toArray()).toEqual([7, 5, 3, 1]));
        });

        describe("filter all", () => {
            it("strings", 
                () => expect(new Linq(_strings).filter(() => true).toArray()).toEqual(_strings));

            it("objects",
                () => expect(new Linq(_objects).filter(() => true).toArray()).toEqual(_objects));

            it("numbers",
                () => expect(new Linq(_numbers).filter(() => true).toArray()).toEqual(_numbers));
        });

        describe("filter some", () => {
            it("strings", () => {
                expect(new Linq(_strings)
                    .filter(item => item[0] == "m")
                    .toArray()
                ).toEqual(["musse", "mimmi"]);
            });

            it("objects", () => {
                expect(new Linq(_objects)
                    .filter(item => (item.first[0] == "m"))
                    .toArray()
                ).toEqual([_musse, _mimmi]);
            });

            it("numbers", () => {
                expect(new Linq(_numbers)
                    .filter(item => item % 2 == 0)
                    .toArray()
                ).toEqual([2, 4, 6, 8]);
            });
        });

        describe("filter none", () => {
            it("strings",
                () => expect(new Linq(_strings).filter(() => false).toArray()).toEqual([]));

            it("objects",
                () => expect(new Linq(_objects).filter(() => false).toArray()).toEqual([]));

            it("numbers",
                () => expect(new Linq(_numbers).filter(() => false).toArray()).toEqual([]));
        });

        describe("first", () => {
            describe("with predicate", () => {
                it("strings",
                    () => expect(new Linq(_strings).first((item) => item[0] == "m")).toEqual("musse"));

                it("objects",
                    () => expect(new Linq(_objects).first((item) => item.first[0] == "m")).toEqual(_musse));

                it("numbers",
                    () => expect(new Linq(_numbers).first((item) => item % 2 == 1)).toEqual(9));
            });

            describe("without predicate", () => {
                it("strings",
                    () => expect(new Linq(_strings).first()).toEqual("kalle"));

                it("objects",
                    () => expect(new Linq(_objects).first()).toEqual(_kalle));

                it("numbers",
                    () => expect(new Linq(_numbers).first()).toEqual(2));
            });
        });

        describe("last", () => {
            describe("with predicate", () => {
                it("strings",
                    () => expect(new Linq(_strings).last((item) => item[0] == "m")).toEqual("mimmi"));

                it("objects",
                    () => expect(new Linq(_objects).last((item) => item.first[0] == "m")).toEqual(_mimmi));

                it("numbers",
                    () => expect(new Linq(_numbers).last((item) => item % 2 == 0)).toEqual(8));
            });

            describe("without predicate", () => {
                it("strings",
                    () => expect(new Linq(_strings).last()).toEqual("joakim"));

                it("objects",
                    () => expect(new Linq(_objects).last()).toEqual(_joakim));

                it("numbers",
                    () => expect(new Linq(_numbers).last()).toEqual(1));
            });
        });

        describe("single", () => {
            describe("with predicate", () => {
                it("strings", () => {
                    expect(new Linq(_strings).single.bind((item) => item[0] == "m")).toThrow();
                    expect(new Linq(_strings).single((item) => item[0] == "l")).toEqual(_långben.first);
                });

                it("objects", () => {
                    expect(new Linq(_objects).single.bind((item) => item.first[0] == "m")).toThrow();
                    expect(new Linq(_objects).single((item) => item.first[0] == "l")).toEqual(_långben);
                });

                it("numbers", () => {
                    expect(new Linq(_numbers).single.bind((item) => item % 2 == 1)).toThrow();
                    expect(new Linq(_numbers).single((item) => item / 9 == 1)).toEqual(9);
                });
            });
        });

        describe("orderBy", () => {
            it("strings", () => {
                expect(new Linq(_strings).orderBy(x => x).first()).toEqual("joakim");
                expect(new Linq(_strings).orderBy(x => x).last()).toEqual("musse");
            });
            describe("objects", () => {
                it("with function", () => {
                    expect(new Linq(_objects).orderBy(x => x.first).first().first).toEqual("joakim");
                    expect(new Linq(_objects).orderBy(x => x.first).last().first).toEqual("musse");
                });

                it("with string", () => {
                    expect(new Linq(_objects).orderBy("first").first().first).toEqual("joakim");
                    expect(new Linq(_objects).orderBy("first").last().first).toEqual("musse");
                });
            });
            it("numbers", () => {
                expect(new Linq(_numbers).orderBy(x => x).first()).toEqual(1);
                expect(new Linq(_numbers).orderBy(x => x).last()).toEqual(9);
            });
        });

        describe("orderByDesc", () => {
            it("strings", () =>
                expect(new Linq(_strings).orderByDesc(x => x).first()).toEqual("musse"));
            describe("objects", () => {
                it("with function",
                    () => expect(new Linq(_objects).orderByDesc(x => x.first).last()).toEqual(_joakim));

                it("with string",
                    () => expect(new Linq(_objects).orderByDesc("first").last()).toEqual(_joakim));
            });
            it("numbers",
                () => expect(new Linq(_numbers).orderByDesc(x => x).first()).toEqual(9));
        });

        describe("thenBy", () => {
            describe("objects", () => {
                it("with function", () => {
                    expect(new Linq(_objects).orderBy(x => x.last).thenBy(x => x.first).first()).toEqual(_joakim);
                });

                it("with string", () => {
                    expect(new Linq(_objects).orderBy("last").thenBy("first").first()).toEqual(_joakim);
                });
            });
            it("numbers", () => {
                expect(new Linq(_numbers).orderBy(x => x % 2).thenBy(x => x).first()).toEqual(2);
                expect(new Linq(_numbers).orderBy(x => x % 2).thenBy(x => x).last()).toEqual(9);
            });
        });

        describe("thenByDesc", () => {
            describe("objects", () => {
                it("with function", () => {
                    expect(new Linq(_objects).orderBy(x => x.last).thenByDesc(x => x.first).first()).toEqual(_mimmi);
                });

                it("with string", () => {
                    expect(new Linq(_objects).orderBy("last").thenByDesc("first").first()).toEqual(_mimmi);
                });
            });
            it("numbers", () => {
                expect(new Linq(_numbers).orderBy(x => x % 2).thenByDesc(x => x).first()).toEqual(8);
                expect(new Linq(_numbers).orderBy(x => x % 2).thenByDesc(x => x).last()).toEqual(1);
            });
        });

        describe("sum", () => {
            it("without selector",
                () => expect(new Linq(_numbers).sum()).toEqual(45));

            it("with selector", () => {
                expect(new Linq(_numbers).sum(x => x)).toEqual(45);
            });
        });

        describe("average", () => {
            it("without selector",
                () => expect(new Linq(_numbers).average()).toEqual(5));

            it("with selector", () => {
                expect(new Linq(_numbers).average(x => x)).toEqual(5);
            });
        });

        describe("any", () => {
            it("strings", () => {
                expect(new Linq(_strings).any(item => item[0] == "m")).toEqual(true);
                expect(new Linq(_strings).any(item => item[0] == "å")).toEqual(false);
            });

            it("objects", () => {
                expect(new Linq(_objects).any(item => item.first[0] == "m")).toEqual(true);
                expect(new Linq(_objects).any(item => item.first[0] == "å")).toEqual(false);
            });

            it("objects", () => {
                expect(new Linq(_numbers).any(item => item == 1)).toEqual(true);
                expect(new Linq(_numbers).any(item => item == 10)).toEqual(false);
            });
        });

        describe("all", () => {
            it("strings", () => {
                expect(new Linq(_strings).all(item => item[0] == "m")).toEqual(false);
                expect(new Linq(_strings).all(item => item.length > 1)).toEqual(true);
            });

            it("objects", () => {
                expect(new Linq(_objects).all(item => item.first[0] == "m")).toEqual(false);
                expect(new Linq(_objects).all(item => item.first.length > 1)).toEqual(true);
            });

            it("numbers", () => {
                expect(new Linq(_numbers).all(item => item < 5)).toEqual(false);
                expect(new Linq(_numbers).all(item => item < 10)).toEqual(true);
            });
        });
        
        it("intersect", () => {
            var x = [0, 1, 2, 3],
                y = [1, 2, 3, 4],
                z = [2, 3, 4, 5];
            
            expect(Linq.intersect(x, y, z)).toEqual([2, 3]);
        });

        it("except", () => {
            var x = [0, 1, 2, 3],
                y = [3, 4, 5, 6],
                z = [6, 7, 8, 9];
            
            expect(Linq.except(x, y, z)).toEqual([0, 1, 2, 4, 5, 7, 8, 9]);
        });

        it("distinct", () => {
            var x = [1, 2, 3, 4, 5, 4, 3, 2, 1],
                y = [5, 6, 7, 8, 9, 8, 7, 6, 5];
            
            expect(Linq.distinct(x, y)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });

        describe("groupBy", () => {
            describe("objects", () => {
                var groupByArr = [
                    { key: 1, value: 1 },
                    { key: 2, value: 3 },
                    { key: 1, value: 2 },
                    { key: 3, value: 5 },
                    { key: 2, value: 4 }
                ];

                it("with function", () => {
                    expect(new Linq(groupByArr).groupBy(x => x.key).toArray().length).toEqual(3);
                });

                it("with string", () => {
                    expect(new Linq(groupByArr).groupBy("key").toArray().length).toEqual(3);
                });
            });
        }); 
    });
});
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../src/util", "../src/linq"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Util = require("../src/util");
    var linq_1 = require("../src/linq");
    describe("Linq", function () {
        var _kalle = { first: "kalle", last: "anka" }, _musse = { first: "musse", last: "pigg" }, _långben = { first: "långben", last: "långben" }, _mimmi = { first: "mimmi", last: "anka" }, _joakim = { first: "joakim", last: "anka" }, _numbers = [2, 4, 6, 8, 9, 7, 5, 3, 1], _strings = [_kalle.first, _musse.first, _långben.first, _mimmi.first, _joakim.first], _objects = [_kalle, _musse, _långben, _mimmi, _joakim], _associative = {
            "kalle": _kalle,
            "musse": _musse,
            "långben": _långben,
            "mimmi": _mimmi,
            "joakim": _joakim,
        };
        describe("Iterators", function () {
            it("TakeIterator", function () {
                var it = new linq_1.TakeIterator(_numbers, 2);
                expect(it.next()).toEqual(2);
                expect(it.next()).toEqual(4);
                expect(it.next()).toBeUndefined();
            });
            it("TakeWhileIterator", function () {
                var it = new linq_1.TakeWhileIterator(_numbers, function (x) { return x < 8; });
                expect(it.next()).toEqual(2);
                expect(it.next()).toEqual(4);
                expect(it.next()).toEqual(6);
                expect(it.next()).toBeUndefined();
            });
            it("SkipIterator", function () {
                var it = new linq_1.SkipIterator(_numbers, 7);
                expect(it.next()).toEqual(3);
                expect(it.next()).toEqual(1);
                expect(it.next()).toBeUndefined();
            });
            it("SkipWhileIterator", function () {
                var it = new linq_1.SkipWhileIterator(_numbers, function (x) { return x != 7; });
                expect(it.next()).toEqual(5);
                expect(it.next()).toEqual(3);
                expect(it.next()).toEqual(1);
                expect(it.next()).toBeUndefined();
            });
            it("MapIterator", function () {
                var it = new linq_1.MapIterator(_strings, function (x) { return x[0]; });
                expect(it.next()).toEqual("k");
                expect(it.next()).toEqual("m");
                expect(it.next()).toEqual("l");
                expect(it.next()).toEqual("m");
                expect(it.next()).toEqual("j");
                expect(it.next()).toBeUndefined();
            });
            it("FilterIterator", function () {
                var it = new linq_1.FilterIterator(_objects, function (x) { return x.last == "anka"; });
                expect(it.next()).toEqual(_kalle);
                expect(it.next()).toEqual(_mimmi);
                expect(it.next()).toEqual(_joakim);
                expect(it.next()).toBeUndefined();
            });
            describe("OrderIterator", function () {
                it("ascending", function () {
                    var it = new linq_1.OrderIterator(_numbers, function (x) { return x; });
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
                it("descending", function () {
                    var it = new linq_1.OrderIterator(_numbers, function (x) { return x; }, Util.defaultComparer, true);
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
        describe("Linq", function () {
            describe("chaining", function () {
                describe("strings", function () {
                    it("maps before next function", function () {
                        var arr = new linq_1.default(_strings)
                            .map(function (item) { return item.substr(0, 2); })
                            .map(function (item) { return item.substr(1); })
                            .toArray();
                        expect(arr).toEqual(["a", "u", "å", "i", "o"]);
                    });
                });
                describe("objects", function () {
                    it("maps before next function", function () {
                        var arr = new linq_1.default(_objects)
                            .map(function (item) { return item.first; })
                            .map(function (item) { return item.substr(0, 2); })
                            .map(function (item) { return item.substr(1); })
                            .toArray();
                        expect(arr).toEqual(["a", "u", "å", "i", "o"]);
                    });
                });
                describe("numbers", function () {
                    it("maps before next function", function () {
                        var arr = new linq_1.default(_numbers)
                            .map(function (item) { return item * 3; })
                            .map(function (item) { return item / 2; })
                            .toArray();
                        expect(arr).toEqual([3, 6, 9, 12, 13.5, 10.5, 7.5, 4.5, 1.5]);
                    });
                });
            });
            describe("toArray", function () {
                it("string", function () { return expect(new linq_1.default(_strings).toArray()).toEqual(_strings); });
                it("objects", function () { return expect(new linq_1.default(_objects).toArray()).toEqual(_objects); });
                it("numbers", function () { return expect(new linq_1.default(_numbers).toArray()).toEqual(_numbers); });
            });
            describe("map", function () {
                it("strings", function () { return expect(new linq_1.default(_strings).map(function (item) { return item.substr(0, 2); }).toArray())
                    .toEqual(["ka", "mu", "lå", "mi", "jo"]); });
                it("objects", function () { return expect(new linq_1.default(_objects).map(function (item) { return item.first.substr(0, 2); }).toArray())
                    .toEqual(["ka", "mu", "lå", "mi", "jo"]); });
                it("numbers", function () { return expect(new linq_1.default(_numbers).map(function (item) { return item * 2; }).toArray())
                    .toEqual([4, 8, 12, 16, 18, 14, 10, 6, 2]); });
            });
            describe("take", function () {
                it("strings", function () { return expect(new linq_1.default(_strings).take(2).toArray()).toEqual(["kalle", "musse"]); });
                it("objects", function () { return expect(new linq_1.default(_objects).take(2).toArray()).toEqual([_kalle, _musse]); });
                it("numbers", function () { return expect(new linq_1.default(_numbers).take(2).toArray()).toEqual([2, 4]); });
            });
            describe("skip", function () {
                it("strings", function () { return expect(new linq_1.default(_strings).skip(3).toArray()).toEqual(["mimmi", "joakim"]); });
                it("objects", function () { return expect(new linq_1.default(_objects).skip(3).toArray()).toEqual([_mimmi, _joakim]); });
                it("numbers", function () { return expect(new linq_1.default(_numbers).skip(3).toArray()).toEqual([8, 9, 7, 5, 3, 1]); });
            });
            describe("takeWhile", function () {
                it("strings", function () { return expect(new linq_1.default(_strings).takeWhile(function (x) { return x.length == 5; }).toArray()).toEqual(["kalle", "musse"]); });
                it("objects", function () { return expect(new linq_1.default(_objects).takeWhile(function (x) { return x.first.length == 5; }).toArray()).toEqual([_kalle, _musse]); });
                it("numbers", function () { return expect(new linq_1.default(_numbers).takeWhile(function (x) { return x < 8; }).toArray()).toEqual([2, 4, 6]); });
            });
            describe("skipWhile", function () {
                it("strings", function () { return expect(new linq_1.default(_strings).skipWhile(function (x) { return x.length == 5; }).toArray()).toEqual(["långben", "mimmi", "joakim"]); });
                it("objects", function () { return expect(new linq_1.default(_objects).skipWhile(function (x) { return x.first.length == 5; }).toArray()).toEqual([_långben, _mimmi, _joakim]); });
                it("numbers", function () { return expect(new linq_1.default(_numbers).skipWhile(function (x) { return x !== 7; }).toArray()).toEqual([7, 5, 3, 1]); });
            });
            describe("filter all", function () {
                it("strings", function () { return expect(new linq_1.default(_strings).filter(function () { return true; }).toArray()).toEqual(_strings); });
                it("objects", function () { return expect(new linq_1.default(_objects).filter(function () { return true; }).toArray()).toEqual(_objects); });
                it("numbers", function () { return expect(new linq_1.default(_numbers).filter(function () { return true; }).toArray()).toEqual(_numbers); });
            });
            describe("filter some", function () {
                it("strings", function () {
                    expect(new linq_1.default(_strings)
                        .filter(function (item) { return item[0] == "m"; })
                        .toArray()).toEqual(["musse", "mimmi"]);
                });
                it("objects", function () {
                    expect(new linq_1.default(_objects)
                        .filter(function (item) { return (item.first[0] == "m"); })
                        .toArray()).toEqual([_musse, _mimmi]);
                });
                it("numbers", function () {
                    expect(new linq_1.default(_numbers)
                        .filter(function (item) { return item % 2 == 0; })
                        .toArray()).toEqual([2, 4, 6, 8]);
                });
            });
            describe("filter none", function () {
                it("strings", function () { return expect(new linq_1.default(_strings).filter(function () { return false; }).toArray()).toEqual([]); });
                it("objects", function () { return expect(new linq_1.default(_objects).filter(function () { return false; }).toArray()).toEqual([]); });
                it("numbers", function () { return expect(new linq_1.default(_numbers).filter(function () { return false; }).toArray()).toEqual([]); });
            });
            describe("first", function () {
                describe("with predicate", function () {
                    it("strings", function () { return expect(new linq_1.default(_strings).first(function (item) { return item[0] == "m"; })).toEqual("musse"); });
                    it("objects", function () { return expect(new linq_1.default(_objects).first(function (item) { return item.first[0] == "m"; })).toEqual(_musse); });
                    it("numbers", function () { return expect(new linq_1.default(_numbers).first(function (item) { return item % 2 == 1; })).toEqual(9); });
                });
                describe("without predicate", function () {
                    it("strings", function () { return expect(new linq_1.default(_strings).first()).toEqual("kalle"); });
                    it("objects", function () { return expect(new linq_1.default(_objects).first()).toEqual(_kalle); });
                    it("numbers", function () { return expect(new linq_1.default(_numbers).first()).toEqual(2); });
                });
            });
            describe("last", function () {
                describe("with predicate", function () {
                    it("strings", function () { return expect(new linq_1.default(_strings).last(function (item) { return item[0] == "m"; })).toEqual("mimmi"); });
                    it("objects", function () { return expect(new linq_1.default(_objects).last(function (item) { return item.first[0] == "m"; })).toEqual(_mimmi); });
                    it("numbers", function () { return expect(new linq_1.default(_numbers).last(function (item) { return item % 2 == 0; })).toEqual(8); });
                });
                describe("without predicate", function () {
                    it("strings", function () { return expect(new linq_1.default(_strings).last()).toEqual("joakim"); });
                    it("objects", function () { return expect(new linq_1.default(_objects).last()).toEqual(_joakim); });
                    it("numbers", function () { return expect(new linq_1.default(_numbers).last()).toEqual(1); });
                });
            });
            describe("single", function () {
                describe("with predicate", function () {
                    it("strings", function () {
                        expect(new linq_1.default(_strings).single.bind(function (item) { return item[0] == "m"; })).toThrow();
                        expect(new linq_1.default(_strings).single(function (item) { return item[0] == "l"; })).toEqual(_långben.first);
                    });
                    it("objects", function () {
                        expect(new linq_1.default(_objects).single.bind(function (item) { return item.first[0] == "m"; })).toThrow();
                        expect(new linq_1.default(_objects).single(function (item) { return item.first[0] == "l"; })).toEqual(_långben);
                    });
                    it("numbers", function () {
                        expect(new linq_1.default(_numbers).single.bind(function (item) { return item % 2 == 1; })).toThrow();
                        expect(new linq_1.default(_numbers).single(function (item) { return item / 9 == 1; })).toEqual(9);
                    });
                });
            });
            describe("orderBy", function () {
                it("strings", function () {
                    expect(new linq_1.default(_strings).orderBy(function (x) { return x; }).first()).toEqual("joakim");
                    expect(new linq_1.default(_strings).orderBy(function (x) { return x; }).last()).toEqual("musse");
                });
                describe("objects", function () {
                    it("with function", function () {
                        expect(new linq_1.default(_objects).orderBy(function (x) { return x.first; }).first().first).toEqual("joakim");
                        expect(new linq_1.default(_objects).orderBy(function (x) { return x.first; }).last().first).toEqual("musse");
                    });
                    it("with string", function () {
                        expect(new linq_1.default(_objects).orderBy("first").first().first).toEqual("joakim");
                        expect(new linq_1.default(_objects).orderBy("first").last().first).toEqual("musse");
                    });
                });
                it("numbers", function () {
                    expect(new linq_1.default(_numbers).orderBy(function (x) { return x; }).first()).toEqual(1);
                    expect(new linq_1.default(_numbers).orderBy(function (x) { return x; }).last()).toEqual(9);
                });
            });
            describe("orderByDesc", function () {
                it("strings", function () {
                    return expect(new linq_1.default(_strings).orderByDesc(function (x) { return x; }).first()).toEqual("musse");
                });
                describe("objects", function () {
                    it("with function", function () { return expect(new linq_1.default(_objects).orderByDesc(function (x) { return x.first; }).last()).toEqual(_joakim); });
                    it("with string", function () { return expect(new linq_1.default(_objects).orderByDesc("first").last()).toEqual(_joakim); });
                });
                it("numbers", function () { return expect(new linq_1.default(_numbers).orderByDesc(function (x) { return x; }).first()).toEqual(9); });
            });
            describe("thenBy", function () {
                describe("objects", function () {
                    it("with function", function () {
                        expect(new linq_1.default(_objects).orderBy(function (x) { return x.last; }).thenBy(function (x) { return x.first; }).first()).toEqual(_joakim);
                    });
                    it("with string", function () {
                        expect(new linq_1.default(_objects).orderBy("last").thenBy("first").first()).toEqual(_joakim);
                    });
                });
                it("numbers", function () {
                    expect(new linq_1.default(_numbers).orderBy(function (x) { return x % 2; }).thenBy(function (x) { return x; }).first()).toEqual(2);
                    expect(new linq_1.default(_numbers).orderBy(function (x) { return x % 2; }).thenBy(function (x) { return x; }).last()).toEqual(9);
                });
            });
            describe("thenByDesc", function () {
                describe("objects", function () {
                    it("with function", function () {
                        expect(new linq_1.default(_objects).orderBy(function (x) { return x.last; }).thenByDesc(function (x) { return x.first; }).first()).toEqual(_mimmi);
                    });
                    it("with string", function () {
                        expect(new linq_1.default(_objects).orderBy("last").thenByDesc("first").first()).toEqual(_mimmi);
                    });
                });
                it("numbers", function () {
                    expect(new linq_1.default(_numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x; }).first()).toEqual(8);
                    expect(new linq_1.default(_numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x; }).last()).toEqual(1);
                });
            });
            describe("sum", function () {
                it("without selector", function () { return expect(new linq_1.default(_numbers).sum()).toEqual(45); });
                it("with selector", function () {
                    expect(new linq_1.default(_numbers).sum(function (x) { return x; })).toEqual(45);
                });
            });
            describe("average", function () {
                it("without selector", function () { return expect(new linq_1.default(_numbers).average()).toEqual(5); });
                it("with selector", function () {
                    expect(new linq_1.default(_numbers).average(function (x) { return x; })).toEqual(5);
                });
            });
            describe("any", function () {
                it("strings", function () {
                    expect(new linq_1.default(_strings).any(function (item) { return item[0] == "m"; })).toEqual(true);
                    expect(new linq_1.default(_strings).any(function (item) { return item[0] == "å"; })).toEqual(false);
                });
                it("objects", function () {
                    expect(new linq_1.default(_objects).any(function (item) { return item.first[0] == "m"; })).toEqual(true);
                    expect(new linq_1.default(_objects).any(function (item) { return item.first[0] == "å"; })).toEqual(false);
                });
                it("objects", function () {
                    expect(new linq_1.default(_numbers).any(function (item) { return item == 1; })).toEqual(true);
                    expect(new linq_1.default(_numbers).any(function (item) { return item == 10; })).toEqual(false);
                });
            });
            describe("all", function () {
                it("strings", function () {
                    expect(new linq_1.default(_strings).all(function (item) { return item[0] == "m"; })).toEqual(false);
                    expect(new linq_1.default(_strings).all(function (item) { return item.length > 1; })).toEqual(true);
                });
                it("objects", function () {
                    expect(new linq_1.default(_objects).all(function (item) { return item.first[0] == "m"; })).toEqual(false);
                    expect(new linq_1.default(_objects).all(function (item) { return item.first.length > 1; })).toEqual(true);
                });
                it("numbers", function () {
                    expect(new linq_1.default(_numbers).all(function (item) { return item < 5; })).toEqual(false);
                    expect(new linq_1.default(_numbers).all(function (item) { return item < 10; })).toEqual(true);
                });
            });
            it("intersect", function () {
                var x = [0, 1, 2, 3], y = [1, 2, 3, 4], z = [2, 3, 4, 5];
                expect(linq_1.default.intersect(x, y, z)).toEqual([2, 3]);
            });
            it("except", function () {
                var x = [0, 1, 2, 3], y = [3, 4, 5, 6], z = [6, 7, 8, 9];
                expect(linq_1.default.except(x, y, z)).toEqual([0, 1, 2, 4, 5, 7, 8, 9]);
            });
            it("distinct", function () {
                var x = [1, 2, 3, 4, 5, 4, 3, 2, 1], y = [5, 6, 7, 8, 9, 8, 7, 6, 5];
                expect(linq_1.default.distinct(x, y)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
            describe("groupBy", function () {
                describe("objects", function () {
                    var groupByArr = [
                        { key: 1, value: 1 },
                        { key: 2, value: 3 },
                        { key: 1, value: 2 },
                        { key: 3, value: 5 },
                        { key: 2, value: 4 }
                    ];
                    it("with function", function () {
                        expect(new linq_1.default(groupByArr).groupBy(function (x) { return x.key; }).toArray().length).toEqual(3);
                    });
                    it("with string", function () {
                        expect(new linq_1.default(groupByArr).groupBy("key").toArray().length).toEqual(3);
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=linq.spec.js.map
/// <reference path="../typings/main.d.ts" />
"use strict";
var Util = require("../src/util");
var linq_1 = require("../src/linq");
var chai_1 = require('chai');
describe("Linq", function () {
    var _kalle = { first: "kalle", last: "anka" }, _musse = { first: "musse", last: "pigg" }, _långben = { first: "långben", last: "långben" }, _mimmi = { first: "mimmi", last: "anka" }, _joakim = { first: "joakim", last: "anka" }, _numbers = [0, 2, 4, 6, 8, 9, 7, 5, 3, 1], _strings = [_kalle.first, _musse.first, _långben.first, _mimmi.first, _joakim.first], _objects = [_kalle, _musse, _långben, _mimmi, _joakim], _associative = {
        "kalle": _kalle,
        "musse": _musse,
        "långben": _långben,
        "mimmi": _mimmi,
        "joakim": _joakim,
    };
    describe("Iterators", function () {
        it("TakeIterator", function () {
            var it = new linq_1.TakeIterator(_numbers, 2);
            chai_1.expect(it.next()).to.eql(0);
            chai_1.expect(it.next()).to.eql(2);
            chai_1.expect(it.next()).to.be.undefined;
        });
        it("TakeWhileIterator", function () {
            var it = new linq_1.TakeWhileIterator(_numbers, function (x) { return x < 8; });
            chai_1.expect(it.next()).to.eql(0);
            chai_1.expect(it.next()).to.eql(2);
            chai_1.expect(it.next()).to.eql(4);
            chai_1.expect(it.next()).to.eql(6);
            chai_1.expect(it.next()).to.be.undefined;
        });
        it("SkipIterator", function () {
            var it = new linq_1.SkipIterator(_numbers, 7);
            chai_1.expect(it.next()).to.eql(5);
            chai_1.expect(it.next()).to.eql(3);
            chai_1.expect(it.next()).to.eql(1);
            chai_1.expect(it.next()).to.be.undefined;
        });
        it("SkipWhileIterator", function () {
            var it = new linq_1.SkipWhileIterator(_numbers, function (x) { return x != 7; });
            chai_1.expect(it.next()).to.eql(7);
            chai_1.expect(it.next()).to.eql(5);
            chai_1.expect(it.next()).to.eql(3);
            chai_1.expect(it.next()).to.eql(1);
            chai_1.expect(it.next()).to.be.undefined;
        });
        it("MapIterator", function () {
            var it = new linq_1.MapIterator(_strings, function (x) { return x[0]; });
            chai_1.expect(it.next()).to.eql("k");
            chai_1.expect(it.next()).to.eql("m");
            chai_1.expect(it.next()).to.eql("l");
            chai_1.expect(it.next()).to.eql("m");
            chai_1.expect(it.next()).to.eql("j");
            chai_1.expect(it.next()).to.be.undefined;
        });
        it("FilterIterator", function () {
            var it = new linq_1.FilterIterator(_objects, function (x) { return x.last == "anka"; });
            chai_1.expect(it.next()).to.eql(_kalle);
            chai_1.expect(it.next()).to.eql(_mimmi);
            chai_1.expect(it.next()).to.eql(_joakim);
            chai_1.expect(it.next()).to.be.undefined;
        });
        describe("OrderIterator", function () {
            it("ascending", function () {
                var it = new linq_1.OrderIterator(_numbers, function (x) { return x; });
                chai_1.expect(it.next()).to.eql(0);
                chai_1.expect(it.next()).to.eql(1);
                chai_1.expect(it.next()).to.eql(2);
                chai_1.expect(it.next()).to.eql(3);
                chai_1.expect(it.next()).to.eql(4);
                chai_1.expect(it.next()).to.eql(5);
                chai_1.expect(it.next()).to.eql(6);
                chai_1.expect(it.next()).to.eql(7);
                chai_1.expect(it.next()).to.eql(8);
                chai_1.expect(it.next()).to.eql(9);
                chai_1.expect(it.next()).to.be.undefined;
            });
            it("descending", function () {
                var it = new linq_1.OrderIterator(_numbers, function (x) { return x; }, Util.defaultComparer, true);
                chai_1.expect(it.next()).to.eql(9);
                chai_1.expect(it.next()).to.eql(8);
                chai_1.expect(it.next()).to.eql(7);
                chai_1.expect(it.next()).to.eql(6);
                chai_1.expect(it.next()).to.eql(5);
                chai_1.expect(it.next()).to.eql(4);
                chai_1.expect(it.next()).to.eql(3);
                chai_1.expect(it.next()).to.eql(2);
                chai_1.expect(it.next()).to.eql(1);
                chai_1.expect(it.next()).to.eql(0);
                chai_1.expect(it.next()).to.be.undefined;
            });
        });
    });
    describe("Linq", function () {
        describe("chaining", function () {
            describe("strings", function () {
                it("maps before next function", function () {
                    var arr = new linq_1.Linq(_strings)
                        .map(function (item) { return item.substr(0, 2); })
                        .map(function (item) { return item.substr(1); })
                        .toArray();
                    chai_1.expect(arr).to.eql(["a", "u", "å", "i", "o"]);
                });
            });
            describe("objects", function () {
                it("maps before next function", function () {
                    var arr = new linq_1.Linq(_objects)
                        .map(function (item) { return item.first; })
                        .map(function (item) { return item.substr(0, 2); })
                        .map(function (item) { return item.substr(1); })
                        .toArray();
                    chai_1.expect(arr).to.eql(["a", "u", "å", "i", "o"]);
                });
            });
            describe("numbers", function () {
                it("maps before next function", function () {
                    var arr = new linq_1.Linq(_numbers)
                        .map(function (item) { return item * 3; })
                        .map(function (item) { return item / 2; })
                        .toArray();
                    chai_1.expect(arr).to.eql([0, 3, 6, 9, 12, 13.5, 10.5, 7.5, 4.5, 1.5]);
                });
            });
        });
        describe("toArray", function () {
            it("string", function () { return chai_1.expect(new linq_1.Linq(_strings).toArray()).to.eql(_strings); });
            it("objects", function () { return chai_1.expect(new linq_1.Linq(_objects).toArray()).to.eql(_objects); });
            it("numbers", function () { return chai_1.expect(new linq_1.Linq(_numbers).toArray()).to.eql(_numbers); });
        });
        describe("map", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).map(function (item) { return item.substr(0, 2); }).toArray())
                    .to.eql(["ka", "mu", "lå", "mi", "jo"]);
                chai_1.expect(linq_1.Linq.map(_strings, function (item) { return item.substr(0, 2); }))
                    .to.eql(["ka", "mu", "lå", "mi", "jo"]);
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(_objects).map(function (item) { return item.first.substr(0, 2); }).toArray())
                    .to.eql(["ka", "mu", "lå", "mi", "jo"]);
                chai_1.expect(linq_1.Linq.map(_objects, function (item) { return item.first.substr(0, 2); }))
                    .to.eql(["ka", "mu", "lå", "mi", "jo"]);
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).map(function (item) { return item * 2; }).toArray())
                    .to.eql([0, 4, 8, 12, 16, 18, 14, 10, 6, 2]);
                chai_1.expect(linq_1.Linq.map(_numbers, function (item) { return item * 2; }))
                    .to.eql([0, 4, 8, 12, 16, 18, 14, 10, 6, 2]);
            });
        });
        describe("take", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).take(2).toArray()).to.eql(["kalle", "musse"]);
                chai_1.expect(linq_1.Linq.take(_strings, 2)).to.eql(["kalle", "musse"]);
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(_objects).take(2).toArray()).to.eql([_kalle, _musse]);
                chai_1.expect(linq_1.Linq.take(_objects, 2)).to.eql([_kalle, _musse]);
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).take(2).toArray()).to.eql([0, 2]);
                chai_1.expect(linq_1.Linq.take(_numbers, 2)).to.eql([0, 2]);
            });
        });
        describe("skip", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).skip(3).toArray()).to.eql(["mimmi", "joakim"]);
                chai_1.expect(linq_1.Linq.skip(_strings, 3)).to.eql(["mimmi", "joakim"]);
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(_objects).skip(3).toArray()).to.eql([_mimmi, _joakim]);
                chai_1.expect(linq_1.Linq.skip(_objects, 3)).to.eql([_mimmi, _joakim]);
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).skip(3).toArray()).to.eql([6, 8, 9, 7, 5, 3, 1]);
                chai_1.expect(linq_1.Linq.skip(_numbers, 3)).to.eql([6, 8, 9, 7, 5, 3, 1]);
            });
        });
        describe("takeWhile", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).takeWhile(function (x) { return x.length == 5; }).toArray()).to.eql(["kalle", "musse"]);
                chai_1.expect(linq_1.Linq.takeWhile(_strings, function (x) { return x.length == 5; })).to.eql(["kalle", "musse"]);
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(_objects).takeWhile(function (x) { return x.first.length == 5; }).toArray()).to.eql([_kalle, _musse]);
                chai_1.expect(linq_1.Linq.takeWhile(_objects, function (x) { return x.first.length == 5; })).to.eql([_kalle, _musse]);
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).takeWhile(function (x) { return x < 8; }).toArray()).to.eql([0, 2, 4, 6]);
                chai_1.expect(linq_1.Linq.takeWhile(_numbers, function (x) { return x < 8; })).to.eql([0, 2, 4, 6]);
            });
        });
        describe("skipWhile", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).skipWhile(function (x) { return x.length == 5; }).toArray()).to.eql(["långben", "mimmi", "joakim"]);
                chai_1.expect(linq_1.Linq.skipWhile(_strings, function (x) { return x.length == 5; })).to.eql(["långben", "mimmi", "joakim"]);
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(_objects).skipWhile(function (x) { return x.first.length == 5; }).toArray()).to.eql([_långben, _mimmi, _joakim]);
                chai_1.expect(linq_1.Linq.skipWhile(_objects, function (x) { return x.first.length == 5; })).to.eql([_långben, _mimmi, _joakim]);
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).skipWhile(function (x) { return x !== 7; }).toArray()).to.eql([7, 5, 3, 1]);
                chai_1.expect(linq_1.Linq.skipWhile(_numbers, function (x) { return x !== 7; })).to.eql([7, 5, 3, 1]);
            });
        });
        describe("filter all", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).filter(function () { return true; }).toArray()).to.eql(_strings);
                chai_1.expect(linq_1.Linq.filter(_strings, function () { return true; })).to.eql(_strings);
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(_objects).filter(function () { return true; }).toArray()).to.eql(_objects);
                chai_1.expect(linq_1.Linq.filter(_objects, function () { return true; })).to.eql(_objects);
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).filter(function () { return true; }).toArray()).to.eql(_numbers);
                chai_1.expect(linq_1.Linq.filter(_numbers, function () { return true; })).to.eql(_numbers);
            });
        });
        describe("filter some", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).filter(function (item) { return item[0] == "m"; }).toArray())
                    .to.eql(["musse", "mimmi"]);
                chai_1.expect(linq_1.Linq.filter(_strings, function (item) { return item[0] == "m"; }))
                    .to.eql(["musse", "mimmi"]);
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(_objects).filter(function (item) { return (item.first[0] == "m"); }).toArray())
                    .to.eql([_musse, _mimmi]);
                chai_1.expect(linq_1.Linq.filter(_objects, function (item) { return (item.first[0] == "m"); }))
                    .to.eql([_musse, _mimmi]);
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).filter(function (item) { return item % 2 == 0; }).toArray())
                    .to.eql([0, 2, 4, 6, 8]);
                chai_1.expect(linq_1.Linq.filter(_numbers, function (item) { return item % 2 == 0; }))
                    .to.eql([0, 2, 4, 6, 8]);
            });
        });
        describe("filter none", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).filter(function () { return false; }).toArray()).to.eql([]);
                chai_1.expect(linq_1.Linq.filter(_strings, function () { return false; })).to.eql([]);
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(_objects).filter(function () { return false; }).toArray()).to.eql([]);
                chai_1.expect(linq_1.Linq.filter(_objects, function () { return false; })).to.eql([]);
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).filter(function (x) { return x === -1; }).toArray()).to.eql([]);
                chai_1.expect(linq_1.Linq.filter(_numbers, function (x) { return x === -1; })).to.eql([]);
            });
        });
        describe("first", function () {
            describe("with predicate", function () {
                it("strings", function () {
                    chai_1.expect(new linq_1.Linq(_strings).first(function (item) { return item[0] == "m"; })).to.eql("musse");
                    chai_1.expect(linq_1.Linq.first(_strings, function (item) { return item[0] == "m"; })).to.eql("musse");
                });
                it("objects", function () {
                    chai_1.expect(new linq_1.Linq(_objects).first(function (item) { return item.first[0] == "m"; })).to.eql(_musse);
                    chai_1.expect(linq_1.Linq.first(_objects, function (item) { return item.first[0] == "m"; })).to.eql(_musse);
                });
                it("numbers", function () {
                    chai_1.expect(new linq_1.Linq(_numbers).first(function (item) { return item % 2 == 1; })).to.eql(9);
                    chai_1.expect(linq_1.Linq.first(_numbers, function (item) { return item % 2 == 1; })).to.eql(9);
                });
            });
            describe("without predicate", function () {
                it("strings", function () {
                    chai_1.expect(new linq_1.Linq(_strings).first()).to.eql("kalle");
                    chai_1.expect(linq_1.Linq.first(_strings)).to.eql("kalle");
                });
                it("objects", function () {
                    chai_1.expect(new linq_1.Linq(_objects).first()).to.eql(_kalle);
                    chai_1.expect(linq_1.Linq.first(_objects)).to.eql(_kalle);
                });
                it("numbers", function () {
                    chai_1.expect(new linq_1.Linq(_numbers).first()).to.eql(0);
                    chai_1.expect(linq_1.Linq.first(_numbers)).to.eql(0);
                });
            });
        });
        describe("last", function () {
            describe("with predicate", function () {
                it("strings", function () {
                    chai_1.expect(new linq_1.Linq(_strings).last(function (item) { return item[0] == "m"; })).to.eql("mimmi");
                    chai_1.expect(linq_1.Linq.last(_strings, function (item) { return item[0] == "m"; })).to.eql("mimmi");
                });
                it("objects", function () {
                    chai_1.expect(new linq_1.Linq(_objects).last(function (item) { return item.first[0] == "m"; })).to.eql(_mimmi);
                    chai_1.expect(linq_1.Linq.last(_objects, function (item) { return item.first[0] == "m"; })).to.eql(_mimmi);
                });
                it("numbers", function () {
                    chai_1.expect(new linq_1.Linq(_numbers).last(function (item) { return item % 2 == 0; })).to.eql(8);
                    chai_1.expect(linq_1.Linq.last(_numbers, function (item) { return item % 2 == 0; })).to.eql(8);
                });
            });
            describe("without predicate", function () {
                it("strings", function () {
                    chai_1.expect(new linq_1.Linq(_strings).last()).to.eql("joakim");
                    chai_1.expect(linq_1.Linq.last(_strings)).to.eql("joakim");
                });
                it("objects", function () {
                    chai_1.expect(new linq_1.Linq(_objects).last()).to.eql(_joakim);
                    chai_1.expect(linq_1.Linq.last(_objects)).to.eql(_joakim);
                });
                it("numbers", function () {
                    chai_1.expect(new linq_1.Linq(_numbers).last()).to.eql(1);
                    chai_1.expect(linq_1.Linq.last(_numbers)).to.eql(1);
                });
            });
        });
        describe("single", function () {
            describe("with predicate", function () {
                it("strings", function () {
                    var single1 = new linq_1.Linq(_strings).single, single2 = linq_1.Linq.single;
                    single1.bind(function (item) { return item[0] == "m"; });
                    single2.bind(_strings, function (item) { return item[0] == "m"; });
                    chai_1.expect(single1).to.throw();
                    chai_1.expect(new linq_1.Linq(_strings).single(function (item) { return item[0] == "l"; })).to.eql(_långben.first);
                    chai_1.expect(single2).to.throw();
                    chai_1.expect(linq_1.Linq.single(_strings, function (item) { return item[0] == "l"; })).to.eql(_långben.first);
                });
                it("objects", function () {
                    var single1 = new linq_1.Linq(_strings).single, single2 = linq_1.Linq.single;
                    single1.bind(function (item) { return item.first[0] == "m"; });
                    single2.bind(_strings, function (item) { return item.first[0] == "m"; });
                    chai_1.expect(single1).to.throw();
                    chai_1.expect(new linq_1.Linq(_objects).single(function (item) { return item.first[0] == "l"; })).to.eql(_långben);
                    chai_1.expect(single2).to.throw();
                    chai_1.expect(linq_1.Linq.single(_objects, function (item) { return item.first[0] == "l"; })).to.eql(_långben);
                });
                it("numbers", function () {
                    var single1 = new linq_1.Linq(_strings).single, single2 = linq_1.Linq.single;
                    single1.bind(function (item) { return item % 2 == 1; });
                    single2.bind(_strings, function (item) { return item % 2 == 1; });
                    chai_1.expect(single1).to.throw();
                    chai_1.expect(new linq_1.Linq(_numbers).single(function (item) { return item / 9 == 1; })).to.eql(9);
                    chai_1.expect(single2).to.throw();
                    chai_1.expect(linq_1.Linq.single(_numbers, function (item) { return item / 9 == 1; })).to.eql(9);
                });
            });
        });
        describe("orderBy", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).orderBy(function (x) { return x; }).first()).to.eql("joakim");
                chai_1.expect(new linq_1.Linq(_strings).orderBy(function (x) { return x; }).last()).to.eql("musse");
                chai_1.expect(linq_1.Linq.orderBy(_strings, function (x) { return x; })[0]).to.eql("joakim");
                chai_1.expect(linq_1.Linq.orderBy(_strings, function (x) { return x; })[_strings.length - 1]).to.eql("musse");
            });
            describe("objects", function () {
                it("with function", function () {
                    chai_1.expect(new linq_1.Linq(_objects).orderBy(function (x) { return x.first; }).first()).to.eql(_joakim);
                    chai_1.expect(new linq_1.Linq(_objects).orderBy(function (x) { return x.first; }).last()).to.eql(_musse);
                    chai_1.expect(linq_1.Linq.orderBy(_objects, function (x) { return x.first; })[0]).to.eql(_joakim);
                    chai_1.expect(linq_1.Linq.orderBy(_objects, function (x) { return x.first; })[_objects.length - 1]).to.eql(_musse);
                });
                it("with string", function () {
                    chai_1.expect(new linq_1.Linq(_objects).orderBy("first").first()).to.eql(_joakim);
                    chai_1.expect(new linq_1.Linq(_objects).orderBy("first").last()).to.eql(_musse);
                    chai_1.expect(linq_1.Linq.orderBy(_objects, "first")[0]).to.eql(_joakim);
                    chai_1.expect(linq_1.Linq.orderBy(_objects, "first")[_objects.length - 1]).to.eql(_musse);
                });
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x; }).first()).to.eql(0);
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x; }).last()).to.eql(9);
                chai_1.expect(linq_1.Linq.orderBy(_numbers, function (x) { return x; })[0]).to.eql(0);
                chai_1.expect(linq_1.Linq.orderBy(_numbers, function (x) { return x; })[_numbers.length - 1]).to.eql(9);
            });
        });
        describe("orderByDesc", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).orderByDesc(function (x) { return x; }).first()).to.eql("musse");
                chai_1.expect(linq_1.Linq.orderByDesc(_strings, function (x) { return x; })[0]).to.eql("musse");
            });
            describe("objects", function () {
                it("with function", function () {
                    chai_1.expect(new linq_1.Linq(_objects).orderByDesc(function (x) { return x.first; }).last()).to.eql(_joakim);
                    chai_1.expect(linq_1.Linq.orderByDesc(_objects, function (x) { return x.first; })[_objects.length - 1]).to.eql(_joakim);
                });
                it("with string", function () {
                    chai_1.expect(new linq_1.Linq(_objects).orderByDesc("first").last()).to.eql(_joakim);
                    chai_1.expect(linq_1.Linq.orderByDesc(_objects, "first")[_objects.length - 1]).to.eql(_joakim);
                });
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).orderByDesc(function (x) { return x; }).first()).to.eql(9);
                chai_1.expect(linq_1.Linq.orderByDesc(_numbers, function (x) { return x; })[0]).to.eql(9);
            });
        });
        describe("thenBy", function () {
            // thenBy is not possible with static functions.
            describe("objects", function () {
                it("with function", function () {
                    chai_1.expect(new linq_1.Linq(_objects).orderBy(function (x) { return x.last; }).thenBy(function (x) { return x.first; }).first()).to.eql(_joakim);
                });
                it("with string", function () {
                    chai_1.expect(new linq_1.Linq(_objects).orderBy("last").thenBy("first").first()).to.eql(_joakim);
                });
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x % 2; }).thenBy(function (x) { return x; }).first()).to.eql(0);
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x % 2; }).thenBy(function (x) { return x; }).last()).to.eql(9);
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x % 2; }).thenBy(function (x) { return x % 4; }).thenBy(function (x) { return x; }).first()).to.eql(0);
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x % 2; }).thenBy(function (x) { return x % 4; }).thenBy(function (x) { return x; }).last()).to.eql(7);
            });
        });
        describe("thenByDesc", function () {
            // thenBy is not possible with static functions.
            describe("objects", function () {
                it("with function", function () {
                    chai_1.expect(new linq_1.Linq(_objects).orderBy(function (x) { return x.last; }).thenByDesc(function (x) { return x.first; }).first()).to.eql(_mimmi);
                });
                it("with string", function () {
                    chai_1.expect(new linq_1.Linq(_objects).orderBy("last").thenByDesc("first").first()).to.eql(_mimmi);
                });
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x; }).first()).to.eql(8);
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x; }).last()).to.eql(1);
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x % 4; }).thenBy(function (x) { return x; }).first()).to.eql(2);
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x % 4; }).thenBy(function (x) { return x; }).last()).to.eql(9);
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x % 4; }).thenByDesc(function (x) { return x; }).first()).to.eql(6);
                chai_1.expect(new linq_1.Linq(_numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x % 4; }).thenByDesc(function (x) { return x; }).last()).to.eql(1);
            });
        });
        describe("sum", function () {
            it("without selector", function () {
                chai_1.expect(new linq_1.Linq(_numbers).sum()).to.eql(45);
                chai_1.expect(linq_1.Linq.sum(_numbers)).to.eql(45);
            });
            it("with selector", function () {
                chai_1.expect(new linq_1.Linq(_numbers).sum(function (x) { return x; })).to.eql(45);
                chai_1.expect(linq_1.Linq.sum(_numbers, function (x) { return x; })).to.eql(45);
            });
        });
        describe("average", function () {
            it("without selector", function () {
                chai_1.expect(new linq_1.Linq(_numbers).average()).to.eql(4.5);
                chai_1.expect(linq_1.Linq.average(_numbers)).to.eql(4.5);
            });
            it("with selector", function () {
                chai_1.expect(new linq_1.Linq(_numbers).average(function (x) { return x; })).to.eql(4.5);
                chai_1.expect(linq_1.Linq.average(_numbers, function (x) { return x; })).to.eql(4.5);
            });
        });
        describe("min", function () {
            it("without selector", function () {
                chai_1.expect(new linq_1.Linq(_numbers).min()).to.eql(0);
                chai_1.expect(linq_1.Linq.min(_numbers)).to.eql(0);
            });
            it("with selector", function () {
                chai_1.expect(new linq_1.Linq(_numbers).min(function (x) { return x; })).to.eql(0);
                chai_1.expect(linq_1.Linq.min(_numbers, function (x) { return x; })).to.eql(0);
            });
        });
        describe("max", function () {
            it("without selector", function () {
                chai_1.expect(new linq_1.Linq(_numbers).max()).to.eql(9);
                chai_1.expect(linq_1.Linq.max(_numbers)).to.eql(9);
            });
            it("with selector", function () {
                chai_1.expect(new linq_1.Linq(_numbers).max(function (x) { return x; })).to.eql(9);
                chai_1.expect(linq_1.Linq.max(_numbers, function (x) { return x; })).to.eql(9);
            });
        });
        describe("any", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).any(function (item) { return item[0] == "m"; })).to.eql(true);
                chai_1.expect(new linq_1.Linq(_strings).any(function (item) { return item[0] == "å"; })).to.eql(false);
                chai_1.expect(linq_1.Linq.any(_strings, function (item) { return item[0] == "m"; })).to.eql(true);
                chai_1.expect(linq_1.Linq.any(_strings, function (item) { return item[0] == "å"; })).to.eql(false);
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(_objects).any(function (item) { return item.first[0] == "m"; })).to.eql(true);
                chai_1.expect(new linq_1.Linq(_objects).any(function (item) { return item.first[0] == "å"; })).to.eql(false);
                chai_1.expect(linq_1.Linq.any(_objects, function (item) { return item.first[0] == "m"; })).to.eql(true);
                chai_1.expect(linq_1.Linq.any(_objects, function (item) { return item.first[0] == "å"; })).to.eql(false);
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(_numbers).any(function (item) { return item == 1; })).to.eql(true);
                chai_1.expect(new linq_1.Linq(_numbers).any(function (item) { return item == 10; })).to.eql(false);
                chai_1.expect(linq_1.Linq.any(_numbers, function (item) { return item == 1; })).to.eql(true);
                chai_1.expect(linq_1.Linq.any(_numbers, function (item) { return item == 10; })).to.eql(false);
            });
            describe("booleans", function () {
                it("1", function () { chai_1.expect(linq_1.Linq.any([true, true, true], function (x) { return x; })).to.eql(true); });
                it("2", function () { chai_1.expect(linq_1.Linq.any([true, true, false], function (x) { return x; })).to.eql(true); });
                it("3", function () { chai_1.expect(linq_1.Linq.any([false, true, true], function (x) { return x; })).to.eql(true); });
            });
        });
        describe("all", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(_strings).all(function (item) { return item[0] == "m"; })).to.eql(false);
                chai_1.expect(new linq_1.Linq(_strings).all(function (item) { return item.length > 1; })).to.eql(true);
                chai_1.expect(linq_1.Linq.all(_strings, function (item) { return item[0] == "m"; })).to.eql(false);
                chai_1.expect(linq_1.Linq.all(_strings, function (item) { return item.length > 1; })).to.eql(true);
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(_objects).all(function (item) { return item.first[0] == "m"; })).to.eql(false);
                chai_1.expect(new linq_1.Linq(_objects).all(function (item) { return item.first.length > 1; })).to.eql(true);
                chai_1.expect(linq_1.Linq.all(_objects, function (item) { return item.first[0] == "m"; })).to.eql(false);
                chai_1.expect(linq_1.Linq.all(_objects, function (item) { return item.first.length > 1; })).to.eql(true);
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(_numbers).all(function (item) { return item < 5; })).to.eql(false);
                chai_1.expect(new linq_1.Linq(_numbers).all(function (item) { return item < 10; })).to.eql(true);
                chai_1.expect(linq_1.Linq.all(_numbers, function (item) { return item < 5; })).to.eql(false);
                chai_1.expect(linq_1.Linq.all(_numbers, function (item) { return item < 10; })).to.eql(true);
            });
            describe("booleans", function () {
                it("1", function () { chai_1.expect(new linq_1.Linq([true, true, true]).all(function (x) { return x; })).to.eql(true); });
                it("2", function () { chai_1.expect(new linq_1.Linq([true, true, false]).all(function (x) { return x; })).to.eql(false); });
                it("3", function () { chai_1.expect(new linq_1.Linq([false, true, true]).all(function (x) { return x; })).to.eql(false); });
            });
        });
        it("intersect", function () {
            var x = [0, 1, 2, 3], y = [1, 2, 3, 4], z = [2, 3, 4, 5];
            chai_1.expect(new linq_1.Linq(x).intersect(y, z).toArray()).to.eql([2, 3]);
            chai_1.expect(linq_1.Linq.intersect(x, y, z)).to.eql([2, 3]);
        });
        it("except", function () {
            var x = [0, 1, 2, 3], y = [3, 4, 5, 6], z = [6, 7, 8, 9];
            chai_1.expect(new linq_1.Linq(x).except(y, z).toArray()).to.eql([0, 1, 2, 4, 5, 7, 8, 9]);
            chai_1.expect(linq_1.Linq.except(x, y, z)).to.eql([0, 1, 2, 4, 5, 7, 8, 9]);
        });
        it("distinct", function () {
            var x = [1, 2, 3, 4, 5, 4, 3, 2, 1], y = [5, 6, 7, 8, 9, 8, 7, 6, 5];
            chai_1.expect(new linq_1.Linq(x).distinct().toArray()).to.eql([1, 2, 3, 4, 5]);
            chai_1.expect(linq_1.Linq.distinct(x)).to.eql([1, 2, 3, 4, 5]);
            chai_1.expect(linq_1.Linq.distinct(x, y)).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
                    chai_1.expect(new linq_1.Linq(groupByArr).groupBy(function (x) { return x.key; }).toArray().length).to.eql(3);
                    chai_1.expect(linq_1.Linq.groupBy(groupByArr, function (x) { return x.key; }).length).to.eql(3);
                });
                it("with string", function () {
                    chai_1.expect(new linq_1.Linq(groupByArr).groupBy("key").toArray().length).to.eql(3);
                    chai_1.expect(linq_1.Linq.groupBy(groupByArr, "key").length).to.eql(3);
                });
            });
        });
    });
});
//# sourceMappingURL=linq.spec.js.map
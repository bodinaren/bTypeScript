"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../src/linq");
var TestItems = require("./linq/testitems");
var chai_1 = require("chai");
// // Iterators
// import "../src/linq/add/distinct";
// import "../src/linq/add/except";
// import "../src/linq/add/filter";
// import "../src/linq/add/groupBy";
// import "../src/linq/add/intersect";
// import "../src/linq/add/join";
// import "../src/linq/add/map";
// import "../src/linq/add/orderBy";
// import "../src/linq/add/skip";
// import "../src/linq/add/skipWhile";
// import "../src/linq/add/take";
// import "../src/linq/add/takeWhile";
// import "../src/linq/add/zip";
// // Operators
// import "../src/linq/add/all";
// import "../src/linq/add/any";
// import "../src/linq/add/average";
// import "../src/linq/add/first";
// import "../src/linq/add/last";
// import "../src/linq/add/max";
// import "../src/linq/add/min";
// import "../src/linq/add/single";
// import "../src/linq/add/sum";
describe("Linq", function () {
    describe("LQ", function () {
        chai_1.expect(linq_1.LQ(TestItems.strings).toArray()).to.eql(TestItems.strings);
    });
    describe("chaining", function () {
        describe("strings", function () {
            it("maps before next function", function () {
                var arr = new linq_1.Linq(TestItems.strings)
                    .map(function (item) { return item.substr(0, 2); })
                    .map(function (item) { return item.substr(1); })
                    .toArray();
                chai_1.expect(arr).to.eql(["a", "u", "å", "i", "o"]);
            });
        });
        describe("objects", function () {
            it("maps before next function", function () {
                var arr = new linq_1.Linq(TestItems.objects)
                    .map(function (item) { return item.first; })
                    .map(function (item) { return item.substr(0, 2); })
                    .map(function (item) { return item.substr(1); })
                    .toArray();
                chai_1.expect(arr).to.eql(["a", "u", "å", "i", "o"]);
            });
        });
        describe("numbers", function () {
            it("maps before next function", function () {
                var arr = new linq_1.Linq(TestItems.numbers)
                    .map(function (item) { return item * 3; })
                    .map(function (item) { return item / 2; })
                    .toArray();
                chai_1.expect(arr).to.eql([0, 3, 6, 9, 12, 13.5, 10.5, 7.5, 4.5, 1.5]);
            });
        });
    });
    describe("toArray", function () {
        it("string", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).toArray()).to.eql(TestItems.strings);
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.objects).toArray()).to.eql(TestItems.objects);
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).toArray()).to.eql(TestItems.numbers);
        });
    });
    describe("map", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).map(function (item) { return item.substr(0, 2); }).toArray())
                .to.eql(["ka", "mu", "lå", "mi", "jo"], "intantiated:");
            chai_1.expect(linq_1.Linq.map(TestItems.strings, function (item) { return item.substr(0, 2); }))
                .to.eql(["ka", "mu", "lå", "mi", "jo"], "static:");
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.objects).map(function (item) { return item.first.substr(0, 2); }).toArray())
                .to.eql(["ka", "mu", "lå", "mi", "jo"], "intantiated:");
            chai_1.expect(linq_1.Linq.map(TestItems.objects, function (item) { return item.first.substr(0, 2); }))
                .to.eql(["ka", "mu", "lå", "mi", "jo"], "static:");
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).map(function (item) { return item * 2; }).toArray())
                .to.eql([0, 4, 8, 12, 16, 18, 14, 10, 6, 2], "intantiated:");
            chai_1.expect(linq_1.Linq.map(TestItems.numbers, function (item) { return item * 2; }))
                .to.eql([0, 4, 8, 12, 16, 18, 14, 10, 6, 2], "static:");
        });
    });
    describe("take", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).take(2).toArray()).to.eql(["kalle", "musse"], "intantiated:");
            chai_1.expect(linq_1.Linq.take(TestItems.strings, 2)).to.eql(["kalle", "musse"], "static:");
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.objects).take(2).toArray()).to.eql([TestItems.kalle, TestItems.musse], "intantiated:");
            chai_1.expect(linq_1.Linq.take(TestItems.objects, 2)).to.eql([TestItems.kalle, TestItems.musse], "static:");
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).take(2).toArray()).to.eql([0, 2], "intantiated:");
            chai_1.expect(linq_1.Linq.take(TestItems.numbers, 2)).to.eql([0, 2], "static:");
        });
    });
    describe("skip", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).skip(3).toArray()).to.eql(["mimmi", "joakim"], "intantiated:");
            chai_1.expect(linq_1.Linq.skip(TestItems.strings, 3)).to.eql(["mimmi", "joakim"], "static:");
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.objects).skip(3).toArray()).to.eql([TestItems.mimmi, TestItems.joakim], "intantiated:");
            chai_1.expect(linq_1.Linq.skip(TestItems.objects, 3)).to.eql([TestItems.mimmi, TestItems.joakim], "static:");
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).skip(3).toArray()).to.eql([6, 8, 9, 7, 5, 3, 1], "intantiated:");
            chai_1.expect(linq_1.Linq.skip(TestItems.numbers, 3)).to.eql([6, 8, 9, 7, 5, 3, 1], "static:");
        });
    });
    describe("takeWhile", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).takeWhile(function (x) { return x.length == 5; }).toArray()).to.eql([TestItems.kalle.first, TestItems.musse.first], "intantiated:");
            chai_1.expect(linq_1.Linq.takeWhile(TestItems.strings, function (x) { return x.length == 5; })).to.eql([TestItems.kalle.first, TestItems.musse.first], "static:");
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.objects).takeWhile(function (x) { return x.first.length == 5; }).toArray()).to.eql([TestItems.kalle, TestItems.musse], "intantiated:");
            chai_1.expect(linq_1.Linq.takeWhile(TestItems.objects, function (x) { return x.first.length == 5; })).to.eql([TestItems.kalle, TestItems.musse], "static:");
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).takeWhile(function (x) { return x < 8; }).toArray()).to.eql([0, 2, 4, 6], "intantiated:");
            chai_1.expect(linq_1.Linq.takeWhile(TestItems.numbers, function (x) { return x < 8; })).to.eql([0, 2, 4, 6], "static:");
        });
    });
    describe("skipWhile", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).skipWhile(function (x) { return x.length == 5; }).toArray()).to.eql([TestItems.långben.first, TestItems.mimmi.first, TestItems.joakim.first], "intantiated:");
            chai_1.expect(linq_1.Linq.skipWhile(TestItems.strings, function (x) { return x.length == 5; })).to.eql([TestItems.långben.first, TestItems.mimmi.first, TestItems.joakim.first], "static:");
            // expect(new Linq(TestItems.strings).skipWhile().toArray()).to.eql(TestItems.strings);
            // expect(Linq.skipWhile(TestItems.strings)).to.eql(TestItems.strings);
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.objects).skipWhile(function (x) { return x.first.length == 5; }).toArray()).to.eql([TestItems.långben, TestItems.mimmi, TestItems.joakim], "intantiated:");
            chai_1.expect(linq_1.Linq.skipWhile(TestItems.objects, function (x) { return x.first.length == 5; })).to.eql([TestItems.långben, TestItems.mimmi, TestItems.joakim], "static:");
            // expect(new Linq(TestItems.objects).skipWhile().toArray()).to.eql(TestItems.objects);
            // expect(Linq.skipWhile(TestItems.objects)).to.eql(TestItems.objects);
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).skipWhile(function (x) { return x !== 7; }).toArray()).to.eql([7, 5, 3, 1], "intantiated:");
            chai_1.expect(linq_1.Linq.skipWhile(TestItems.numbers, function (x) { return x !== 7; })).to.eql([7, 5, 3, 1], "static:");
            // expect(new Linq(TestItems.numbers).skipWhile().toArray()).to.eql(TestItems.numbers);
            // expect(Linq.skipWhile(TestItems.numbers)).to.eql(TestItems.numbers);
        });
    });
    describe("filter all", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).filter(function () { return true; }).toArray()).to.eql(TestItems.strings, "intantiated:");
            chai_1.expect(linq_1.Linq.filter(TestItems.strings, function () { return true; })).to.eql(TestItems.strings, "static:");
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.objects).filter(function () { return true; }).toArray()).to.eql(TestItems.objects, "intantiated:");
            chai_1.expect(linq_1.Linq.filter(TestItems.objects, function () { return true; })).to.eql(TestItems.objects, "static:");
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).filter(function () { return true; }).toArray()).to.eql(TestItems.numbers, "intantiated:");
            chai_1.expect(linq_1.Linq.filter(TestItems.numbers, function () { return true; })).to.eql(TestItems.numbers, "static:");
        });
    });
    describe("filter some", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).filter(function (item) { return item[0] == "m"; }).toArray()).to.eql(["musse", "mimmi"], "intantiated:");
            chai_1.expect(linq_1.Linq.filter(TestItems.strings, function (item) { return item[0] == "m"; })).to.eql(["musse", "mimmi"], "static:");
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.objects).filter(function (item) { return (item.first[0] == "m"); }).toArray()).to.eql([TestItems.musse, TestItems.mimmi], "intantiated:");
            chai_1.expect(linq_1.Linq.filter(TestItems.objects, function (item) { return (item.first[0] == "m"); })).to.eql([TestItems.musse, TestItems.mimmi], "static:");
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).filter(function (item) { return item % 2 == 0; }).toArray()).to.eql([0, 2, 4, 6, 8], "intantiated:");
            chai_1.expect(linq_1.Linq.filter(TestItems.numbers, function (item) { return item % 2 == 0; })).to.eql([0, 2, 4, 6, 8], "static:");
        });
    });
    describe("filter none", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).filter(function () { return false; }).toArray()).to.eql([], "intantiated:");
            chai_1.expect(linq_1.Linq.filter(TestItems.strings, function () { return false; })).to.eql([], "static:");
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.objects).filter(function () { return false; }).toArray()).to.eql([], "intantiated:");
            chai_1.expect(linq_1.Linq.filter(TestItems.objects, function () { return false; })).to.eql([]);
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).filter(function (x) { return x === -1; }).toArray()).to.eql([], "intantiated:");
            chai_1.expect(linq_1.Linq.filter(TestItems.numbers, function (x) { return x === -1; })).to.eql([], "static:");
        });
    });
    describe("first", function () {
        describe("with predicate", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(TestItems.strings).first(function (item) { return item[0] == "m"; })).to.eql("musse", "intantiated:");
                chai_1.expect(linq_1.Linq.first(TestItems.strings, function (item) { return item[0] == "m"; })).to.eql("musse", "static:");
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).first(function (item) { return item.first[0] == "m"; })).to.eql(TestItems.musse, "intantiated:");
                chai_1.expect(linq_1.Linq.first(TestItems.objects, function (item) { return item.first[0] == "m"; })).to.eql(TestItems.musse, "static:");
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(TestItems.numbers).first(function (item) { return item % 2 == 1; })).to.eql(9, "intantiated:");
                chai_1.expect(linq_1.Linq.first(TestItems.numbers, function (item) { return item % 2 == 1; })).to.eql(9, "static:");
            });
        });
        describe("without predicate", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(TestItems.strings).first()).to.eql("kalle", "intantiated:");
                chai_1.expect(linq_1.Linq.first(TestItems.strings)).to.eql("kalle", "static:");
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).first()).to.eql(TestItems.kalle, "intantiated:");
                chai_1.expect(linq_1.Linq.first(TestItems.objects)).to.eql(TestItems.kalle, "static:");
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(TestItems.numbers).first()).to.eql(0, "intantiated:");
                chai_1.expect(linq_1.Linq.first(TestItems.numbers)).to.eql(0, "static:");
            });
        });
    });
    describe("last", function () {
        describe("with predicate", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(TestItems.strings).last(function (item) { return item[0] == "m"; })).to.eql("mimmi", "intantiated:");
                chai_1.expect(linq_1.Linq.last(TestItems.strings, function (item) { return item[0] == "m"; })).to.eql("mimmi", "static:");
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).last(function (item) { return item.first[0] == "m"; })).to.eql(TestItems.mimmi, "intantiated:");
                chai_1.expect(linq_1.Linq.last(TestItems.objects, function (item) { return item.first[0] == "m"; })).to.eql(TestItems.mimmi, "static:");
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(TestItems.numbers).last(function (item) { return item % 2 == 0; })).to.eql(8, "intantiated:");
                chai_1.expect(linq_1.Linq.last(TestItems.numbers, function (item) { return item % 2 == 0; })).to.eql(8, "static:");
            });
        });
        describe("without predicate", function () {
            it("strings", function () {
                chai_1.expect(new linq_1.Linq(TestItems.strings).last()).to.eql("joakim", "intantiated:");
                chai_1.expect(linq_1.Linq.last(TestItems.strings)).to.eql("joakim", "static:");
            });
            it("objects", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).last()).to.eql(TestItems.joakim, "intantiated:");
                chai_1.expect(linq_1.Linq.last(TestItems.objects)).to.eql(TestItems.joakim, "static:");
            });
            it("numbers", function () {
                chai_1.expect(new linq_1.Linq(TestItems.numbers).last()).to.eql(1, "intantiated:");
                chai_1.expect(linq_1.Linq.last(TestItems.numbers)).to.eql(1, "static:");
            });
        });
    });
    describe("single", function () {
        describe("with predicate", function () {
            describe("returns single", function () {
                it("string", function () {
                    chai_1.expect(new linq_1.Linq(TestItems.strings).single(function (item) { return item[0] == "l"; })).to.eql(TestItems.långben.first, "intantiated:");
                    chai_1.expect(linq_1.Linq.single(TestItems.strings, function (item) { return item[0] == "l"; })).to.eql(TestItems.långben.first, "static:");
                });
                it("object", function () {
                    chai_1.expect(new linq_1.Linq(TestItems.objects).single(function (item) { return item.first[0] == "l"; })).to.eql(TestItems.långben, "intantiated:");
                    chai_1.expect(linq_1.Linq.single(TestItems.objects, function (item) { return item.first[0] == "l"; })).to.eql(TestItems.långben, "static:");
                });
                it("number", function () {
                    chai_1.expect(new linq_1.Linq(TestItems.numbers).single(function (item) { return item / 9 == 1; })).to.eql(9, "intantiated:");
                    chai_1.expect(linq_1.Linq.single(TestItems.numbers, function (item) { return item / 9 == 1; })).to.eql(9, "static:");
                });
            });
            describe("throws on multiple", function () {
                it("strings", function () {
                    var lq = new linq_1.Linq(TestItems.strings);
                    var single1 = lq.single.bind(lq, function (item) { return item[0] == "m"; });
                    chai_1.expect(single1).to.throw("The sequence contains more than one element.", "intantiated:");
                    var single2 = linq_1.Linq.single.bind(undefined, TestItems.strings, function (item) { return item[0] == "m"; });
                    chai_1.expect(single2).to.throw("The sequence contains more than one element.", "static:");
                });
                it("objects", function () {
                    var lq = new linq_1.Linq(TestItems.objects);
                    var single1 = lq.single.bind(lq, function (item) { return item.first[0] == "m"; });
                    chai_1.expect(single1).to.throw("The sequence contains more than one element.", "intantiated:");
                    var single2 = linq_1.Linq.single.bind(undefined, TestItems.objects, function (item) { return item.first[0] == "m"; });
                    chai_1.expect(single2).to.throw("The sequence contains more than one element.", "static:");
                });
                it("numbers", function () {
                    var lq = new linq_1.Linq(TestItems.numbers);
                    var single1 = lq.single.bind(lq, function (item) { return item % 2 == 1; });
                    chai_1.expect(single1).to.throw("The sequence contains more than one element.", "intantiated:");
                    var single2 = linq_1.Linq.single.bind(undefined, TestItems.numbers, function (item) { return item % 2 == 1; });
                    chai_1.expect(single2).to.throw("The sequence contains more than one element.", "static:");
                });
            });
            describe("throws on no matching", function () {
                it("string", function () {
                    var lq = new linq_1.Linq(TestItems.strings);
                    var single1 = lq.single.bind(lq, function (item) { return item[0] == "q"; });
                    chai_1.expect(single1).to.throw("The sequence is empty.", "intantiated:");
                    var single2 = linq_1.Linq.single.bind(undefined, TestItems.strings, function (item) { return item[0] == "q"; });
                    chai_1.expect(single2).to.throw("The sequence is empty.", "static:");
                });
                it("object", function () {
                    var lq = new linq_1.Linq(TestItems.objects);
                    var single1 = lq.single.bind(lq, function (item) { return item.first[0] == "q"; });
                    chai_1.expect(single1).to.throw("The sequence is empty.", "intantiated:");
                    var single2 = linq_1.Linq.single.bind(undefined, TestItems.objects, function (item) { return item.first[0] == "q"; });
                    chai_1.expect(single2).to.throw("The sequence is empty.", "static:");
                });
                it("number", function () {
                    var lq = new linq_1.Linq(TestItems.numbers);
                    var single1 = lq.single.bind(lq, function (item) { return item == 100; });
                    chai_1.expect(single1).to.throw("The sequence is empty.", "intantiated:");
                    var single2 = linq_1.Linq.single.bind(undefined, TestItems.numbers, function (item) { return item == 100; });
                    chai_1.expect(single2).to.throw("The sequence is empty.", "static:");
                });
            });
        });
    });
    describe("orderBy", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).orderBy(function (x) { return x; }).first()).to.eql("joakim", "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.strings).orderBy(function (x) { return x; }).last()).to.eql("musse", "intantiated:");
            chai_1.expect(linq_1.Linq.orderBy(TestItems.strings, function (x) { return x; })[0]).to.eql("joakim", "static:");
            chai_1.expect(linq_1.Linq.orderBy(TestItems.strings, function (x) { return x; })[TestItems.strings.length - 1]).to.eql("musse", "static:");
        });
        describe("objects", function () {
            it("with function", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).orderBy(function (x) { return x.first; }).first()).to.eql(TestItems.joakim, "intantiated:");
                chai_1.expect(new linq_1.Linq(TestItems.objects).orderBy(function (x) { return x.first; }).last()).to.eql(TestItems.musse, "intantiated:");
                chai_1.expect(linq_1.Linq.orderBy(TestItems.objects, function (x) { return x.first; })[0]).to.eql(TestItems.joakim, "static:");
                chai_1.expect(linq_1.Linq.orderBy(TestItems.objects, function (x) { return x.first; })[TestItems.objects.length - 1]).to.eql(TestItems.musse, "static:");
            });
            it("with string", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).orderBy("first").first()).to.eql(TestItems.joakim, "intantiated:");
                chai_1.expect(new linq_1.Linq(TestItems.objects).orderBy("first").last()).to.eql(TestItems.musse, "intantiated:");
                chai_1.expect(linq_1.Linq.orderBy(TestItems.objects, "first")[0]).to.eql(TestItems.joakim, "static:");
                chai_1.expect(linq_1.Linq.orderBy(TestItems.objects, "first")[TestItems.objects.length - 1]).to.eql(TestItems.musse, "static:");
            });
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x; }).first()).to.eql(0, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x; }).last()).to.eql(9, "intantiated:");
            chai_1.expect(linq_1.Linq.orderBy(TestItems.numbers, function (x) { return x; })[0]).to.eql(0, "static:");
            chai_1.expect(linq_1.Linq.orderBy(TestItems.numbers, function (x) { return x; })[TestItems.numbers.length - 1]).to.eql(9, "static:");
        });
    });
    describe("orderByDesc", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).orderByDesc(function (x) { return x; }).first()).to.eql("musse", "intantiated:");
            chai_1.expect(linq_1.Linq.orderByDesc(TestItems.strings, function (x) { return x; })[0]).to.eql("musse"), "static:";
        });
        describe("objects", function () {
            it("with function", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).orderByDesc(function (x) { return x.first; }).last()).to.eql(TestItems.joakim, "intantiated:");
                chai_1.expect(linq_1.Linq.orderByDesc(TestItems.objects, function (x) { return x.first; })[TestItems.objects.length - 1]).to.eql(TestItems.joakim, "static:");
            });
            it("with string", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).orderByDesc("first").last()).to.eql(TestItems.joakim, "intantiated:");
                chai_1.expect(linq_1.Linq.orderByDesc(TestItems.objects, "first")[TestItems.objects.length - 1]).to.eql(TestItems.joakim, "static:");
            });
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderByDesc(function (x) { return x; }).first()).to.eql(9, "intantiated:");
            chai_1.expect(linq_1.Linq.orderByDesc(TestItems.numbers, function (x) { return x; })[0]).to.eql(9, "static:");
        });
    });
    describe("thenBy", function () {
        // thenBy is not possible with static functions.
        describe("objects", function () {
            it("with function", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).orderBy(function (x) { return x.last; }).thenBy(function (x) { return x.first; }).first()).to.eql(TestItems.joakim, "intantiated:");
            });
            it("with string", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).orderBy("last").thenBy("first").first()).to.eql(TestItems.joakim, "intantiated:");
            });
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x % 2; }).thenBy(function (x) { return x; }).first()).to.eql(0, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x % 2; }).thenBy(function (x) { return x; }).last()).to.eql(9, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x % 2; }).thenBy(function (x) { return x % 4; }).thenBy(function (x) { return x; }).first()).to.eql(0, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x % 2; }).thenBy(function (x) { return x % 4; }).thenBy(function (x) { return x; }).last()).to.eql(7, "intantiated:");
        });
    });
    describe("thenByDesc", function () {
        // thenBy is not possible with static functions.
        describe("objects", function () {
            it("with function", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).orderBy(function (x) { return x.last; }).thenByDesc(function (x) { return x.first; }).first()).to.eql(TestItems.mimmi, "intantiated:");
            });
            it("with string", function () {
                chai_1.expect(new linq_1.Linq(TestItems.objects).orderBy("last").thenByDesc("first").first()).to.eql(TestItems.mimmi, "intantiated:");
            });
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x; }).first()).to.eql(8, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x; }).last()).to.eql(1, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x % 4; }).thenBy(function (x) { return x; }).first()).to.eql(2, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x % 4; }).thenBy(function (x) { return x; }).last()).to.eql(9, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x % 4; }).thenByDesc(function (x) { return x; }).first()).to.eql(6, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.numbers).orderBy(function (x) { return x % 2; }).thenByDesc(function (x) { return x % 4; }).thenByDesc(function (x) { return x; }).last()).to.eql(1, "intantiated:");
        });
    });
    describe("sum", function () {
        it("without selector", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).sum()).to.eql(45, "intantiated:");
            chai_1.expect(linq_1.Linq.sum(TestItems.numbers)).to.eql(45);
        });
        it("with selector", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).sum(function (x) { return x; })).to.eql(45, "intantiated:");
            chai_1.expect(linq_1.Linq.sum(TestItems.numbers, function (x) { return x; })).to.eql(45);
        });
    });
    describe("average", function () {
        it("without selector", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).average()).to.eql(4.5, "intantiated:");
            chai_1.expect(linq_1.Linq.average(TestItems.numbers)).to.eql(4.5, "static:");
        });
        it("with selector", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).average(function (x) { return x; })).to.eql(4.5, "intantiated:");
            chai_1.expect(linq_1.Linq.average(TestItems.numbers, function (x) { return x; })).to.eql(4.5, "static:");
        });
    });
    describe("min", function () {
        it("without selector", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).min()).to.eql(0, "intantiated:");
            chai_1.expect(linq_1.Linq.min(TestItems.numbers)).to.eql(0, "static:");
        });
        it("with selector", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).min(function (x) { return x; })).to.eql(0, "intantiated:");
            chai_1.expect(linq_1.Linq.min(TestItems.numbers, function (x) { return x; })).to.eql(0, "static:");
        });
    });
    describe("max", function () {
        it("without selector", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).max()).to.eql(9, "intantiated:");
            chai_1.expect(linq_1.Linq.max(TestItems.numbers)).to.eql(9, "static:");
        });
        it("with selector", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).max(function (x) { return x; })).to.eql(9, "intantiated:");
            chai_1.expect(linq_1.Linq.max(TestItems.numbers, function (x) { return x; })).to.eql(9, "static:");
        });
    });
    describe("any", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).any(function (item) { return item[0] == "m"; })).to.eql(true, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.strings).any(function (item) { return item[0] == "å"; })).to.eql(false, "intantiated:");
            chai_1.expect(linq_1.Linq.any(TestItems.strings, function (item) { return item[0] == "m"; })).to.eql(true, "static:");
            chai_1.expect(linq_1.Linq.any(TestItems.strings, function (item) { return item[0] == "å"; })).to.eql(false, "static:");
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.objects).any(function (item) { return item.first[0] == "m"; })).to.eql(true, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.objects).any(function (item) { return item.first[0] == "å"; })).to.eql(false, "intantiated:");
            chai_1.expect(linq_1.Linq.any(TestItems.objects, function (item) { return item.first[0] == "m"; })).to.eql(true, "static:");
            chai_1.expect(linq_1.Linq.any(TestItems.objects, function (item) { return item.first[0] == "å"; })).to.eql(false, "static:");
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).any(function (item) { return item == 1; })).to.eql(true, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.numbers).any(function (item) { return item == 10; })).to.eql(false, "intantiated:");
            chai_1.expect(linq_1.Linq.any(TestItems.numbers, function (item) { return item == 1; })).to.eql(true, "static:");
            chai_1.expect(linq_1.Linq.any(TestItems.numbers, function (item) { return item == 10; })).to.eql(false, "static:");
        });
        describe("booleans", function () {
            it("1", function () { chai_1.expect(linq_1.Linq.any([true, true, true], function (x) { return x; })).to.eql(true); });
            it("2", function () { chai_1.expect(linq_1.Linq.any([true, true, false], function (x) { return x; })).to.eql(true); });
            it("3", function () { chai_1.expect(linq_1.Linq.any([false, true, true], function (x) { return x; })).to.eql(true); });
        });
    });
    describe("all", function () {
        it("strings", function () {
            chai_1.expect(new linq_1.Linq(TestItems.strings).all(function (item) { return item[0] == "m"; })).to.eql(false, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.strings).all(function (item) { return item.length > 1; })).to.eql(true, "intantiated:");
            chai_1.expect(linq_1.Linq.all(TestItems.strings, function (item) { return item[0] == "m"; })).to.eql(false, "static:");
            chai_1.expect(linq_1.Linq.all(TestItems.strings, function (item) { return item.length > 1; })).to.eql(true, "static:");
        });
        it("objects", function () {
            chai_1.expect(new linq_1.Linq(TestItems.objects).all(function (item) { return item.first[0] == "m"; })).to.eql(false, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.objects).all(function (item) { return item.first.length > 1; })).to.eql(true, "intantiated:");
            chai_1.expect(linq_1.Linq.all(TestItems.objects, function (item) { return item.first[0] == "m"; })).to.eql(false, "static:");
            chai_1.expect(linq_1.Linq.all(TestItems.objects, function (item) { return item.first.length > 1; })).to.eql(true, "static:");
        });
        it("numbers", function () {
            chai_1.expect(new linq_1.Linq(TestItems.numbers).all(function (item) { return item < 5; })).to.eql(false, "intantiated:");
            chai_1.expect(new linq_1.Linq(TestItems.numbers).all(function (item) { return item < 10; })).to.eql(true, "intantiated:");
            chai_1.expect(linq_1.Linq.all(TestItems.numbers, function (item) { return item < 5; })).to.eql(false, "static:");
            chai_1.expect(linq_1.Linq.all(TestItems.numbers, function (item) { return item < 10; })).to.eql(true, "static:");
        });
        describe("booleans", function () {
            it("1", function () { chai_1.expect(new linq_1.Linq([true, true, true]).all(function (x) { return x; })).to.eql(true); });
            it("2", function () { chai_1.expect(new linq_1.Linq([true, true, false]).all(function (x) { return x; })).to.eql(false); });
            it("3", function () { chai_1.expect(new linq_1.Linq([false, true, true]).all(function (x) { return x; })).to.eql(false); });
        });
    });
    it("intersect", function () {
        it("default comparer", function () {
            var x = [0, 1, 2, 3], y = [2, 3, 4, 5];
            chai_1.expect(new linq_1.Linq(x).intersect(y).toArray()).to.eql([2, 3], "intantiated:");
            chai_1.expect(linq_1.Linq.intersect(x, y)).to.eql([2, 3], "static:");
        });
        it("with comparer", function () {
            var x = TestItems.objects.slice(0, 3), y = TestItems.objects.slice(2), fn = function (x, y) { return x.last === y.last; };
            chai_1.expect(new linq_1.Linq(x).intersect(y, fn).toArray()).to.eql([TestItems.kalle, TestItems.långben, "intantiated:"]);
            chai_1.expect(linq_1.Linq.intersect(x, y, fn)).to.eql([TestItems.kalle, TestItems.långben, "static:"]);
        });
    });
    describe("except", function () {
        it("default comparer", function () {
            var x = [0, 1, 2, 3], y = [2, 3, 4, 5];
            chai_1.expect(new linq_1.Linq(x).except(y).toArray()).to.eql([0, 1], "intantiated:");
            chai_1.expect(linq_1.Linq.except(x, y)).to.eql([0, 1], "static:");
        });
        it("with comparer", function () {
            var x = TestItems.objects.slice(0, 3), y = TestItems.objects.slice(2), fn = function (x, y) { return x.last === y.last; };
            chai_1.expect(new linq_1.Linq(x).except(y, fn).toArray()).to.eql([TestItems.musse], "intantiated:");
            chai_1.expect(linq_1.Linq.except(x, y, fn)).to.eql([TestItems.musse], "static:");
        });
    });
    describe("distinct", function () {
        it("default comparer", function () {
            var x = [1, 2, 3, 4, 5, 4, 3, 2, 1];
            chai_1.expect(new linq_1.Linq(x).distinct().toArray()).to.eql([1, 2, 3, 4, 5], "intantiated:");
            chai_1.expect(linq_1.Linq.distinct(x)).to.eql([1, 2, 3, 4, 5], "static:");
        });
        it("with comparer", function () {
            // we compare only lastnames, therefore "mimmi anka" and "joakim anka" will be excluded, because we already have "kalle anka"
            var fn = function (x, y) { return x.last === y.last; };
            chai_1.expect(new linq_1.Linq(TestItems.objects).distinct(fn).toArray()).to.eql([TestItems.kalle, TestItems.musse, TestItems.långben], "intantiated:");
            chai_1.expect(linq_1.Linq.distinct(TestItems.objects, fn)).to.eql([TestItems.kalle, TestItems.musse, TestItems.långben], "static:");
        });
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
                chai_1.expect(new linq_1.Linq(groupByArr).groupBy(function (x) { return x.key; }).toArray().length).to.eql(3, "intantiated:");
                chai_1.expect(linq_1.Linq.groupBy(groupByArr, function (x) { return x.key; }).length).to.eql(3, "static:");
            });
            it("with string", function () {
                chai_1.expect(new linq_1.Linq(groupByArr).groupBy("key").toArray().length).to.eql(3, "intantiated:");
                chai_1.expect(linq_1.Linq.groupBy(groupByArr, "key").length).to.eql(3, "static:");
            });
        });
    });
    it("zip", function () {
        function cb(str, obj) { return { first: str, last: obj.last }; }
        chai_1.expect(new linq_1.Linq(TestItems.strings).zip(TestItems.objects, cb).toArray()).to.eql(TestItems.objects, "intantiated:");
        chai_1.expect(linq_1.Linq.zip(TestItems.strings, TestItems.objects, cb)).to.eql(TestItems.objects, "static:");
    });
});
//# sourceMappingURL=linq.spec.js.map
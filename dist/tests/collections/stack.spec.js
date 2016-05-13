"use strict";
var stack_1 = require("../../src/collections/stack");
var chai_1 = require('chai');
describe("Stack", function () {
    it("push", function () {
        var list = new stack_1.default();
        chai_1.expect(list.push(6)).to.eql(1);
        chai_1.expect(list.push(7)).to.eql(2);
        chai_1.expect(list.push(8)).to.eql(3);
        chai_1.expect(list.push(9)).to.eql(4);
        chai_1.expect(list.length).to.eql(4);
    });
    it("pop", function () {
        var list = new stack_1.default();
        list.push(6);
        list.push(7);
        list.push(8);
        list.push(9);
        chai_1.expect(list.pop()).to.eql(9);
        chai_1.expect(list.pop()).to.eql(8);
        chai_1.expect(list.pop()).to.eql(7);
        chai_1.expect(list.pop()).to.eql(6);
        chai_1.expect(list.length).to.eql(0);
    });
    it("peek", function () {
        var list = new stack_1.default();
        list.push(6);
        list.push(7);
        list.push(8);
        list.push(9);
        chai_1.expect(list.peek()).to.eql(9);
        chai_1.expect(list.length).to.eql(4);
    });
});
//# sourceMappingURL=stack.spec.js.map
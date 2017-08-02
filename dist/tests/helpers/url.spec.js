"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("../../src/helpers/url");
var chai_1 = require("chai");
describe("Url", function () {
    describe("search", function () {
        it("with no query", function () {
            chai_1.expect(url_1.default("http://localhost/Test.html").search("firstname")).to.eql("");
            chai_1.expect(url_1.UrlHelper.search("firstname", "http://localhost/Test.html")).to.eql("");
        });
        it("with ? but no query", function () {
            chai_1.expect(url_1.default("http://localhost/Test.html?").search("firstname")).to.eql("");
            chai_1.expect(url_1.UrlHelper.search("firstname", "http://localhost/Test.html?")).to.eql("");
        });
        it("with single query", function () {
            chai_1.expect(url_1.default("http://localhost/Test.html?firstname=donald").search("firstname")).to.eql("donald");
            chai_1.expect(url_1.UrlHelper.search("firstname", "http://localhost/Test.html?firstname=donald")).to.eql("donald");
        });
        it("first of multiple queries", function () {
            chai_1.expect(url_1.default("http://localhost/Test.html?firstname=donald&lastname=duck").search("firstname")).to.eql("donald");
            chai_1.expect(url_1.UrlHelper.search("firstname", "http://localhost/Test.html?firstname=donald&lastname=duck")).to.eql("donald");
        });
        it("rest of multiple queries", function () {
            chai_1.expect(url_1.default("http://localhost/Test.html?firstname=donald&lastname=duck").search("lastname")).to.eql("duck");
            chai_1.expect(url_1.UrlHelper.search("lastname", "http://localhost/Test.html?firstname=donald&lastname=duck")).to.eql("duck");
        });
        it("with wrong search", function () {
            chai_1.expect(url_1.default("http://localhost/Test.html?firstname=donald").search("lastname")).to.eql("");
            chai_1.expect(url_1.UrlHelper.search("lastname", "http://localhost/Test.html?firstname=donald")).to.eql("");
        });
        it("with wrong search of multiple queries", function () {
            chai_1.expect(url_1.default("http://localhost/Test.html?first=donald&last=duck").search("firstname")).to.eql("");
            chai_1.expect(url_1.UrlHelper.search("firstname", "http://localhost/Test.html?first=donald&last=duck")).to.eql("");
        });
    });
});
//# sourceMappingURL=url.spec.js.map
import Url, {UrlHelper} from "../../src/helpers/url";
import {expect} from 'chai';

describe("Url", function() {
    describe("search", function() {

        it("with no query", function () {
            expect(Url("http://localhost/Test.html").search("firstname")).to.eql("");
            expect(UrlHelper.search("firstname", "http://localhost/Test.html")).to.eql("");
        });
        
        it("with ? but no query", function () {
            expect(Url("http://localhost/Test.html?").search("firstname")).to.eql("");
            expect(UrlHelper.search("firstname", "http://localhost/Test.html?")).to.eql("");
        });
        
        it("with single query", function () {
            expect(Url("http://localhost/Test.html?firstname=donald").search("firstname")).to.eql("donald");
            expect(UrlHelper.search("firstname", "http://localhost/Test.html?firstname=donald")).to.eql("donald");
        });
        
        it("first of multiple queries", function () {
            expect(Url("http://localhost/Test.html?firstname=donald&lastname=duck").search("firstname")).to.eql("donald");
            expect(UrlHelper.search("firstname", "http://localhost/Test.html?firstname=donald&lastname=duck")).to.eql("donald");
        });
        
        it("rest of multiple queries", function () {
            expect(Url("http://localhost/Test.html?firstname=donald&lastname=duck").search("lastname")).to.eql("duck");
            expect(UrlHelper.search("lastname", "http://localhost/Test.html?firstname=donald&lastname=duck")).to.eql("duck");
        });
        
        it("with wrong search", function () {
            expect(Url("http://localhost/Test.html?firstname=donald").search("lastname")).to.eql("");
            expect(UrlHelper.search("lastname", "http://localhost/Test.html?firstname=donald")).to.eql("");
        });
        
        it("with wrong search of multiple queries", function () {
            expect(Url("http://localhost/Test.html?first=donald&last=duck").search("firstname")).to.eql("");
            expect(UrlHelper.search("firstname", "http://localhost/Test.html?first=donald&last=duck")).to.eql("");
        });
    });
});
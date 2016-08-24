"use strict;"

var browserify  = require("browserify");
var fs = require("fs");
var Umd = require("browserify-umdify");
var UglifyJS = require("uglify-js");

var browserifyFs = fs.createWriteStream("./dist/btypescript.umd.js", { encoding: "utf-8", flags: "w"});
var bundled = browserify({
		extensions: [".js", ".json"],
		debug: true
	})
	.require("./dist/src/linq.js", { expose: "Linq" })
	.require("./dist/src/collections.js", { expose: "Collections" })
	.require("./dist/src/helpers.js", { expose: "Helpers" })
	.bundle()
	.pipe(new Umd());

bundled.pipe(browserifyFs);
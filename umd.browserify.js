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
	.require("./dist/src/linq/index.js", { expose: "Linq" })
	.require("./dist/src/collections/index.js", { expose: "Collections" })
	.require("./dist/src/helpers/index.js", { expose: "Helpers" })
	.bundle()
	.pipe(new Umd());

bundled.pipe(browserifyFs);
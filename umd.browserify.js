"use strict;"

var browserify  = require("browserify");
var fs = require("fs");
var Umd = require("browserify-umdify");
var UglifyJS = require("uglify-js");

if (process.argv.length >= 3 && process.argv[2].toLowerCase() == "hattrick") {
	var browserifyFs = fs.createWriteStream("./dist/hattrick.umd.js", { encoding: "utf-8", flags: "w"});
	var bundled = browserify({
			extensions: [".js", ".json"],
			debug: true
		})
		.require("./dist/src/linq.js", { expose: "Linq" })
		.require("./dist/src/collections/list.js", { expose: "List" })
		.require("./dist/src/helpers.js", { expose: "Helpers" })
		.bundle()
		.pipe(new Umd());

	bundled.pipe(browserifyFs);
} else {
	var browserifyFs = fs.createWriteStream("./dist/bTypeScript.umd.js", { encoding: "utf-8", flags: "w"});
	var bundled = browserify({
			extensions: [".js", ".json"],
			debug: true
		})
		.require("./dist/src/index.js", { expose: "index" })
		.bundle()
		.pipe(new Umd());

	bundled.pipe(browserifyFs);
}

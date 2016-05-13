"use strict;"

var browserify  = require("browserify");
var fs = require("fs");
var Umd = require("browserify-umdify");
var UglifyJS = require("uglify-js");

var browserifyFs = fs.createWriteStream("./dist/bTypeScript.umd.js", { encoding: "utf-8", flags: "w"})

var bundled = browserify({
		extensions: [".js", ".json"],
		debug: true
	})
	.require("./dist/src/bTypeScript.js", { expose: "bTypeScript" })
	.bundle()
	.pipe(new Umd());

bundled.pipe(browserifyFs);

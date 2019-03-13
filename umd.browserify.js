"use strict;"

var browserify  = require("browserify");
var fs = require("fs");
var Umd = require("browserify-umdify");
var tsify = require("tsify");
var babelify = require("babelify");

var browserifyFs = fs.createWriteStream("./btypescript.umd.js", { encoding: "utf-8", flags: "w"});
var bundled = browserify({
		debug: true,
		// transform: [babelify.configure({ sourceMaps: false, stage: 3 })],
	})
	// .add([
	// 	"./src/linq/index.ts",
	// 	"./src/collections/index.ts",
	// 	"./src/helpers/index.ts",
	// ])
	.require("./src/linq/index.ts", { expose: "Linq" })
	.require("./src/collections/index.ts", { expose: "Collections" })
	.require("./src/helpers/index.ts", { expose: "Helpers" })
	.plugin(tsify, { module: "commonjs" })
	// .transform("babelify")
	// .transform(babelify, { extensions: [".ts"] })
	// .transform("babelify", { sourceMaps: false })
	.bundle()
	.on('error', function (error) { console.error(error.toString()); })
	.pipe(new Umd());

bundled.pipe(browserifyFs);

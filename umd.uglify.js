"use strict;"

var UglifyJS = require("uglify-js");
var fs = require('fs')

var result = UglifyJS.minify("./dist/bTypeScript.umd.js", { mangle: true });
fs.writeFileSync("./dist/bTypeScript.umd.min.js", result.code, { encoding: "utf-8" });
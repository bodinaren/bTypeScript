"use strict;"

var UglifyJS = require("uglify-js");
var fs = require('fs')
var module = process.argv[2] || "bTypeScript";

var result = UglifyJS.minify("./dist/" + module + ".umd.js", { mangle: true, outSourceMap: module + ".umd.min.js.map" });
fs.writeFileSync("./dist/" + module + ".umd.min.js", result.code, { encoding: "utf-8" });
fs.writeFileSync("./dist/" + module + ".umd.min.js.map", result.map, { encoding: "utf-8" });
"use strict;"

var UglifyJS = require("uglify-js");
var fs = require('fs')

var result = UglifyJS.minify("./dist/btypescript.umd.js", { mangle: true, outSourceMap: "btypescript.umd.min.js.map" });
fs.writeFileSync("./dist/btypescript.umd.min.js", result.code, { encoding: "utf-8" });
fs.writeFileSync("./dist/btypescript.umd.min.js.map", result.map, { encoding: "utf-8" });

"use strict;"

var UglifyJS = require("uglify-js");
var fs = require('fs')

var code = fs.readFileSync("./btypescript.umd.js").toString();

var result = UglifyJS.minify(code, {
  sourceMap: { filename: "btypescript.umd.js", url: "btypescript.umd.min.js.map" }
});
if (result.error) {
  console.error(result.error);
} else {
  fs.writeFileSync("./btypescript.umd.min.js", result.code, { encoding: "utf-8" });
  fs.writeFileSync("./btypescript.umd.min.js.map", result.map, { encoding: "utf-8" });
}

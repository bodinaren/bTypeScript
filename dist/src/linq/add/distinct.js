"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var distinct_1 = require("../iterator/distinct");
linq_1.Linq.prototype.distinct = distinct_1.distinctProto;
linq_1.Linq.distinct = distinct_1.distinctStatic;
//# sourceMappingURL=distinct.js.map
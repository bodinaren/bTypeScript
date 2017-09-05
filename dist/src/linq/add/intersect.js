"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var intersect_1 = require("../iterator/intersect");
linq_1.Linq.prototype.intersect = intersect_1.intersectProto;
linq_1.Linq.intersect = intersect_1.intersectStatic;
//# sourceMappingURL=intersect.js.map
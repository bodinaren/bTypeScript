"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var groupBy_1 = require("../iterator/groupBy");
linq_1.Linq.prototype.groupBy = groupBy_1.groupByProto;
linq_1.Linq.groupBy = groupBy_1.groupByStatic;
//# sourceMappingURL=groupBy.js.map
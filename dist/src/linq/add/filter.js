"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var filter_1 = require("../iterator/filter");
linq_1.Linq.prototype.filter = filter_1.filterProto;
linq_1.Linq.filter = filter_1.filterStatic;
//# sourceMappingURL=filter.js.map
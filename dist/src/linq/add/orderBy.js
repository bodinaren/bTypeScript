"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var orderBy_1 = require("../iterator/orderBy");
linq_1.Linq.prototype.orderBy = orderBy_1.orderByProto;
linq_1.Linq.prototype.orderByDesc = orderBy_1.orderByDescProto;
linq_1.Linq.orderBy = orderBy_1.orderByStatic;
linq_1.Linq.orderByDesc = orderBy_1.orderByDescStatic;
//# sourceMappingURL=orderBy.js.map
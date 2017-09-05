"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var sum_1 = require("../operator/sum");
linq_1.Linq.prototype.sum = sum_1.sumProto;
linq_1.Linq.sum = sum_1.sumStatic;
//# sourceMappingURL=sum.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var average_1 = require("../operator/average");
linq_1.Linq.prototype.average = average_1.averageProto;
linq_1.Linq.average = average_1.averageStatic;
//# sourceMappingURL=average.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var single_1 = require("../operator/single");
linq_1.Linq.prototype.single = single_1.singleProto;
linq_1.Linq.single = single_1.singleStatic;
//# sourceMappingURL=single.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var take_1 = require("../iterator/take");
linq_1.Linq.prototype.take = take_1.takeProto;
linq_1.Linq.take = take_1.takeStatic;
//# sourceMappingURL=take.js.map
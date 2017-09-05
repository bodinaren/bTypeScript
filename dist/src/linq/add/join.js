"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var join_1 = require("../iterator/join");
linq_1.Linq.prototype.join = join_1.joinProto;
linq_1.Linq.join = join_1.joinStatic;
//# sourceMappingURL=join.js.map
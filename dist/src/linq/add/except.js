"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var except_1 = require("../iterator/except");
linq_1.Linq.prototype.except = except_1.exceptProto;
linq_1.Linq.except = except_1.exceptStatic;
//# sourceMappingURL=except.js.map
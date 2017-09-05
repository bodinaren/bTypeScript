"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linq_1 = require("../linq");
var skip_1 = require("../iterator/skip");
linq_1.Linq.prototype.skip = skip_1.skipProto;
linq_1.Linq.skip = skip_1.skipStatic;
//# sourceMappingURL=skip.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../util");
function makeValuePredicate(predicate) {
    if (Util.isString(predicate)) {
        var field_1 = predicate;
        predicate = (function (x) { return x[field_1]; });
    }
    else if (Util.isUndefined(predicate)) {
        predicate = (function () { return true; });
    }
    return predicate;
}
exports.makeValuePredicate = makeValuePredicate;
//# sourceMappingURL=makeValuePredicate.js.map
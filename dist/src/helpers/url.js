"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Shorthand function to create a UrlHelper object.
 * @param url The URL on which to perform the various functions.
 */
function Url(url) {
    if (url === void 0) { url = location.href; }
    return new UrlHelper(url);
}
exports.default = Url;
var UrlHelper = (function () {
    /**
     * Creates a UrlHelper object.
     * @param url The URL on which to perform the various functions.
     */
    function UrlHelper(url) {
        if (url === void 0) { url = location.href; }
        this.url = url;
    }
    /**
     * Get the value of a query in the URL.
     * @param param The name of the query to get.
     */
    UrlHelper.prototype.search = function (param) {
        return UrlHelper.search(param, this.url);
    };
    /**
     * Get the value of a query in the URL.
     * @param url The URL from which to get the query.
     * @param param The name of the query to get.
     */
    UrlHelper.search = function (param, url) {
        if (url === void 0) { url = location.href; }
        param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + param + "=([^&#]*)", "i"), results = regex.exec(url || location.search);
        return !results ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    return UrlHelper;
}());
exports.UrlHelper = UrlHelper;
//# sourceMappingURL=url.js.map
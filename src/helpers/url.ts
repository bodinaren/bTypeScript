import {Linq} from "../linq/linq";
// import "../linq/add/zip";

/**
 * Shorthand function to create a UrlHelper object.
 * @param url The URL on which to perform the various functions.
 */
export default function Url(url: string = location.href): UrlHelper { return new UrlHelper(url); }
export class UrlHelper {
    url: string;

    /**
     * Creates a UrlHelper object.
     * @param url The URL on which to perform the various functions.
     */
    constructor(url: string = location.href) {
        this.url = url;
    }

    /**
     * Get the value of a query in the URL.
     * @param param The name of the query to get.
     */
    search(param: string): string {
        return UrlHelper.search(param, this.url);
    }
    /**
     * Get the value of a query in the URL.
     * @param url The URL from which to get the query.
     * @param param The name of the query to get.
     */
    static search(param: string, url: string = location.href): string {
        param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        let regex = new RegExp("[\\?&]" + param + "=([^&#]*)", "i"),
            results = regex.exec(url || location.search);
        return !results ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}

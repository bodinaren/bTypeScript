/**
 * Shorthand function to create a UrlHelper object.
 * @param url The URL on which to perform the various functions.
 */
export default function Url(url?: string): UrlHelper;
export declare class UrlHelper {
    url: string;
    /**
     * Creates a UrlHelper object.
     * @param url The URL on which to perform the various functions.
     */
    constructor(url?: string);
    /**
     * Get the value of a query in the URL.
     * @param param The name of the query to get.
     */
    search(param: string): string;
    /**
     * Get the value of a query in the URL.
     * @param url The URL from which to get the query.
     * @param param The name of the query to get.
     */
    static search(param: string, url?: string): string;
}

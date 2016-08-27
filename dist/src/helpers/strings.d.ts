/**
 * Shorthand function to create a StringsHelper object.
 * @param number The string on which to perform the various functions.
 */
export default function Strings(str: string): StringsHelper;
export declare class StringsHelper {
    str: string;
    /**
     * Creates a StringsHelper object.
     * @param str The string on which to perform the various functions.
     */
    constructor(str: string);
    format(...args: string[]): any;
    static format(str: string, ...args: string[]): string;
}

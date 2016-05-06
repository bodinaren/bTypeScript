import * as util from "../util";

/**
 * Shorthand function to create a StringsHelper object.
 * @param number The string on which to perform the various functions.
 */
export default function Strings(str: string): StringsHelper { return new StringsHelper(str); }
export class StringsHelper {
    str: string;
    
    /**
     * Creates a StringsHelper object.
     * @param str The string on which to perform the various functions.
     */
    constructor(str: string) {
        this.str = str;
    }
    
    format(...args: string[]) {
        return StringsHelper.format.apply(null, [this.str].concat(args));
    }

    static format(str: string, ...args: string[]): string {
        for (let i = 0; i < args.length; i++) {
            let regex = new RegExp(`\\{${i}\\}`, "g");
            str = str.replace(regex, args[i]);
        }
        return str;
    }
}
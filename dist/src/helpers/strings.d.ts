export default function Strings(str: string): StringsHelper;
export declare class StringsHelper {
    str: string;
    constructor(str: string);
    format(...args: string[]): string;
}

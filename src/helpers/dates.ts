import * as util from "../util";

/**
 * Shorthand function to create a DatesHelper object.
 * @param number The date on which to perform the various functions.
 */
export default function Dates(date: Date): DatesHelper { return new DatesHelper(date); }
export class DatesHelper {
    date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    static toDate(date: any): Date {
        if (util.isUndefined(date)) return new Date();
        if (util.isString(date)) date = Date.parse(date);
        if (util.isNumber(date)) date = new Date(date);
        return date;
    }

    between(lower?: Date, upper?: Date): boolean {
        if (util.isUndefined(lower)) lower = new Date();
        if (util.isUndefined(upper)) upper = new Date(9999999999999);
        return (lower <= this.date && this.date <= upper);
    }

    addYears(years: number): DatesHelper { return this.addMonths(years * 12); }
    addMonths(months: number): DatesHelper {
        this.date.setMonth(this.date.getMonth() + months);
        return this;
    }

    addWeeks(week: number): DatesHelper { return this.addDays(week * 7); }
    addDays(days: number): DatesHelper { return this.addHours(days * 24); }
    addHours(hours: number): DatesHelper { return this.addMinutes(hours * 60); }
    addMinutes(minutes: number): DatesHelper { return this.addSeconds(minutes * 60); }
    addSeconds(seconds: number): DatesHelper { return this.addMilliseconds(seconds * 1000); }
    addMilliseconds(milliseconds: number): DatesHelper {
        this.date.setMilliseconds(this.date.getMilliseconds() + milliseconds);
        return this;
    }
}
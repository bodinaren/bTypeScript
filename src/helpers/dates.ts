import * as Util from "../util";

/**
 * Shorthand function to create a DatesHelper object.
 * @param number The date on which to perform the various functions.
 */
export function Dates(date: Date): DatesHelper { return new DatesHelper(date); }
export class DatesHelper {
    date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    static toDate(date: any): Date {
        if (Util.isUndefined(date)) return new Date();
        if (Util.isString(date)) date = Date.parse(date);
        if (Util.isNumber(date)) date = new Date(date);
        return date;
    }

    /**
     * Returns weither the date is in between two numbers.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    between(lower?: Date, upper?: Date): boolean {
        return DatesHelper.between(this.date, lower, upper);
    }
    /**
     * Returns weither a date is in between two numbers.
     * @param date The date which to compare with.
     * @param lower The lower inclusive bound.
     * @param upper The upper inclusive bound.
     */
    static between(date: Date, lower?: Date, upper?: Date): boolean {
        if (Util.isUndefined(lower)) lower = new Date(0);
        if (Util.isUndefined(upper)) upper = new Date(9999999999999);
        return (lower <= date && date <= upper);
    }

    addYears(years: number): this { return this.addMonths(years * 12); }
    addMonths(months: number): this {
        this.date.setMonth(this.date.getMonth() + months);
        return this;
    }

    addWeeks(week: number): this { return this.addDays(week * 7); }
    addDays(days: number): this { return this.addHours(days * 24); }
    addHours(hours: number): this { return this.addMinutes(hours * 60); }
    addMinutes(minutes: number): this { return this.addSeconds(minutes * 60); }
    addSeconds(seconds: number): this { return this.addMilliseconds(seconds * 1000); }
    addMilliseconds(milliseconds: number): this {
        this.date.setMilliseconds(this.date.getMilliseconds() + milliseconds);
        return this;
    }

    isToday(): boolean {
        return this.date.toDateString() === new Date().toDateString();
    }

    toMidnight(): this {
        this.date.setHours(0);
        this.date.setMinutes(0);
        this.date.setSeconds(0);
        this.date.setMilliseconds(0);
        return this;
    }

    static addYears(date: Date, years: number): Date { return new DatesHelper(date).addYears(years).date; }
    static addMonths(date: Date, months: number): Date { return new DatesHelper(date).addMonths(months).date; }
    static addWeeks(date: Date, week: number): Date { return new DatesHelper(date).addWeeks(week).date; }
    static addDays(date: Date, days: number): Date { return new DatesHelper(date).addDays(days).date; }
    static addHours(date: Date, hours: number): Date { return new DatesHelper(date).addHours(hours).date; }
    static addMinutes(date: Date, minutes: number): Date { return new DatesHelper(date).addMinutes(minutes).date; }
    static addSeconds(date: Date, seconds: number): Date { return new DatesHelper(date).addSeconds(seconds).date; }
    static addMilliseconds(date: Date, milliseconds: number): Date { return new DatesHelper(date).addMilliseconds(milliseconds).date; }
    static isToday(date: Date): boolean { return new DatesHelper(date).isToday(); }
    static toMidnight(date: Date): Date { return new DatesHelper(date).toMidnight().date; }
}

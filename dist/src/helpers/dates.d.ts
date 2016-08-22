export default function Dates(date: Date): DatesHelper;
export declare class DatesHelper {
    date: Date;
    constructor(date: Date);
    static toDate(date: any): Date;
    between(lower?: Date, upper?: Date): boolean;
    static between(date: Date, lower?: Date, upper?: Date): boolean;
    addYears(years: number): this;
    addMonths(months: number): this;
    addWeeks(week: number): this;
    addDays(days: number): this;
    addHours(hours: number): this;
    addMinutes(minutes: number): this;
    addSeconds(seconds: number): this;
    addMilliseconds(milliseconds: number): this;
    static addYears(date: Date, years: number): Date;
    static addMonths(date: Date, months: number): Date;
    static addWeeks(date: Date, week: number): Date;
    static addDays(date: Date, days: number): Date;
    static addHours(date: Date, hours: number): Date;
    static addMinutes(date: Date, minutes: number): Date;
    static addSeconds(date: Date, seconds: number): Date;
    static addMilliseconds(date: Date, milliseconds: number): Date;
}

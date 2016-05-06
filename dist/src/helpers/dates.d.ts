export default function Dates(date: Date): DatesHelper;
export declare class DatesHelper {
    date: Date;
    constructor(date: Date);
    static toDate(date: any): Date;
    between(lower?: Date, upper?: Date): boolean;
    addYears(years: number): DatesHelper;
    addMonths(months: number): DatesHelper;
    addWeeks(week: number): DatesHelper;
    addDays(days: number): DatesHelper;
    addHours(hours: number): DatesHelper;
    addMinutes(minutes: number): DatesHelper;
    addSeconds(seconds: number): DatesHelper;
    addMilliseconds(milliseconds: number): DatesHelper;
}

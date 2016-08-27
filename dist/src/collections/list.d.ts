import * as Util from "../util";
export default class List<T> {
    _source: T[];
    length: number;
    /**
     * Creates a new list object.
     * Utilizes a normal array behind the scenes and native functions whenever possible,
     * but with functions known for a List.
     * @param source The source array from which to create the list.
     */
    constructor(source?: T[]);
    /**
     * Get the list as a array.
     */
    toArray(): T[];
    /**
     * Adds an object to the end of the list.
     * @param item The object to be added to the end of the list.
     */
    add(item: T): this;
    static add<T>(source: T[], item: T): T[];
    /**
     * Adds the elements of the specified collection to the end of the list.
     * @param collection The collection whose elements should be added to the end of the list.
     */
    addRange(collection: T[] | List<T>): this;
    static addRange<T>(source: T[], collection: T[] | List<T>): T[];
    /**
     * Returns a new read only instance of the list.
     */
    asReadOnly(): List<T>;
    /**
     * Performs the specified action on each element of the list.
     * @param callback The callback to execute on each element of the list.
     */
    forEach(callback: Util.ILoopFunction<T>): void;
    static forEach<T>(source: T[], callback: Util.ILoopFunction<T>): void;
    /**
     * Searches for the specified object and returns the zero-based index of the first occurrence within the specified range of elements in the list.
     * @param item The object to locate in the list.
     * @param index The zero-based starting index of the search.
     * @param count The number of elements in the section to search.
     */
    indexOf(item: T, index?: number, count?: number): number;
    static indexOf<T>(source: T[], item: T, index?: number, count?: number): number;
    /**
     * Searches for the specified object and returns the zero-based index of the last occurrence within the range of elements in the list.
     * @param item The object to locate in the list.
     * @param index The zero-based starting index of the backward search.
     * @param count The number of elements in the section to search.
     */
    lastIndexOf(item: T, index?: number, count?: number): number;
    static lastIndexOf<T>(source: T[], item: T, index?: number, count?: number): number;
    /**
     * Inserts an element into the list at the specified index.
     * @param index The zero-based index at which item should be inserted.
     * @param item The object to insert.
     */
    insert(index: number, item: T): this;
    static insert<T>(source: T[], index: number, item: T): T[];
    /**
     * Inserts the elements of a collection into the list at the specified index.
     * @param index The zero-based index at which the new elements should be inserted.
     * @param collection The collection whose elements should be inserted into the list.
     */
    insertRange(index: number, collection: T[] | List<T>): this;
    static insertRange<T>(source: T[], index: number, collection: T[] | List<T>): T[];
    /**
     * Gets the element at the specified index.
     * @param index Gets the element at the specified index.
     */
    get(index: number): T;
    /**
     * Sets the element at the specified index.
     * @param index Sets the element at the specified index.
     * @param item The object to set at the specified index.
     */
    set(index: number, item: T): void;
    /**
     * Removes the first occurrence of a specific object from the List(Of T).
     * @param item The object to remove from the List(Of T).
     */
    remove(item: T): this;
    static remove<T>(source: T[], item: T): T[];
    /**
     * Removes all the elements that match the conditions defined by the specified predicate.
     * @param predicate The predicate delegate that defines the conditions of the elements to remove.
     */
    removeAll(predicate?: Util.IPredicate<T>): this;
    static removeAll<T>(source: T[], predicate?: Util.IPredicate<T>): T[];
    /**
     * Removes the element at the specified index of the list.
     * @param index The zero-based index of the element to remove.
     */
    removeAt(index: number): this;
    /**
     * Removes the element at the specified index of the list.
     * @param index The zero-based index of the element to remove.
     */
    static removeAt<T>(source: T[], index: number): T[];
    /**
     * Removes a range of elements from the list.
     * @param index The zero-based starting index of the range of elements to remove.
     * @param count The number of elements to remove.
     */
    removeRange(index: number, count: number): this;
    static removeRange<T>(source: T[], index: number, count: number): T[];
    /**
     * Removes all elements from the list.
     */
    clear(): this;
    static clear<T>(source: T[]): T[];
    /**
     * Returns a number that represents how many elements in the specified sequence satisfy a condition.
     * If predicate is omitted, the full size of the list will be returned.
     * @param predicate A function to test each element for a condition.
     */
    count(predicate?: Util.IPredicate<T>): number;
    static count<T>(source: T[], predicate?: Util.IPredicate<T>): number;
    /**
     * Reverses the order of the elements in the specified range.
     * If index and count is omitted the entire list will be reversed.
     * @param index The zero-based starting index of the range to reverse.
     * @param count The number of elements in the range to reverse. If not provided it will default to end of the list.
     */
    reverse(index?: number, count?: number): this;
    static reverse<T>(source: T[], index?: number, count?: number): T[];
    static range(start: number, count: number): List<number>;
}

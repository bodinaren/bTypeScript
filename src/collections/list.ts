import * as Util from "../util";

export default class List<T> {

    _source: T[];

    get length(): number { return this._source.length; }

    /**
     * Creates a new list object.
     * Utilizes a normal array behind the scenes and native functions whenever possible,
     * but with functions known for a List.
     * @param source The source array from which to create the list.
     */
    constructor(source?: T[]) {
        this._source = source || [];
    }
    
    /**
     * Get the list as a array.
     */
    toArray(): T[] {
        return this._source;
    }

    /**
     * Adds an object to the end of the list.
     * @param item The object to be added to the end of the list.
     */
    add(item: T): List<T> {
        this._source.push(item);
        return this;
    }
    /**
     * Adds the elements of the specified collection to the end of the list.
     * @param collection The collection whose elements should be added to the end of the list.
     */
    addRange(collection: T[] | List<T>): List<T> {
        let items = (collection instanceof List) ? collection.toArray() : collection;
        Array.prototype.push.apply(this._source, items);
        return this;
    }

    /**
     * Returns a new read only instance of the list.
     */
    asReadOnly(): List<T> {
        return new List(Object.freeze(this._source.slice()));
    }

    /**
     * Performs the specified action on each element of the list.
     * @param callback The callback to execute on each element of the list.
     */
    forEach(callback: Util.ILoopFunction<T>): void {
        this._source.forEach(callback);
    }
    
    /**
     * Searches for the specified object and returns the zero-based index of the first occurrence within the specified range of elements in the list.
     * @param item The object to locate in the list.
     * @param index The zero-based starting index of the search.
     * @param count The number of elements in the section to search.
     */
    indexOf(item: T, index: number = 0, count: number = this.length) {
        let idx = this._source.indexOf(item, index);
        if (idx > count - index + 1) return -1;
        return idx;
    }

    /**
     * Searches for the specified object and returns the zero-based index of the last occurrence within the range of elements in the list.
     * @param item The object to locate in the list.
     * @param index The zero-based starting index of the backward search.
     * @param count The number of elements in the section to search.
     */
    lastIndexOf(item: T, index: number = this.length - 1, count: number = this.length) {
        let idx = this._source.lastIndexOf(item, index);
        if (idx < index + 1 - count) return -1;
        return idx;
    }
    
    /**
     * Inserts an element into the list at the specified index.
     * @param index The zero-based index at which item should be inserted.
     * @param item The object to insert.
     */
    insert(index: number, item: T): List<T> {
        this._source.splice(index, 0, item);
        return this;
    }
    /**
     * Inserts the elements of a collection into the list at the specified index.
     * @param index The zero-based index at which the new elements should be inserted.
     * @param collection The collection whose elements should be inserted into the list.
     */
    insertRange(index: number, collection: T[] | List<T>): List<T> {
        let items = (collection instanceof List) ? collection.toArray() : collection;
        Array.prototype.splice.apply(this._source, new Array<any>(index, 0).concat(items));
        return this;
    }

    /**
     * Gets the element at the specified index.
     * @param index Gets the element at the specified index.
     */
    get(index: number) {
        return this._source[index];
    }
    /**
     * Sets the element at the specified index.
     * @param index Sets the element at the specified index.
     * @param item The object to set at the specified index.
     */
    set(index: number, item: T) {
        if (index > this.length) throw new Error("Index was out of range. Must be non-negative and less than the size of the collection.");
        else this._source[index] = item;
    }

    /**
     * Removes the first occurrence of a specific object from the List(Of T).
     * @param item The object to remove from the List(Of T).
     */
    remove(item: T): List<T> {
        return this.removeAt(this._source.indexOf(item));
    }
    /**
     * Removes all the elements that match the conditions defined by the specified predicate.
     * @param predicate The predicate delegate that defines the conditions of the elements to remove.
     */
    removeAll(predicate?: Util.IPredicate<T>): List<T> {
        if (!predicate) predicate = Util.defaultPredicate;
        let i;
        for (i = 0; i < this.length; i++) {
            if (predicate(this._source[i])) {
                this._source.splice(i, 1);
                i--;
            }
        }
        return this;
    }
    /**
     * Removes the element at the specified index of the list.
     * @param index The zero-based index of the element to remove.
     */
    removeAt(index: number): List<T> {
        this._source.splice(index, 1);
        return this;
    }
    /**
     * Removes a range of elements from the list.
     * @param index The zero-based starting index of the range of elements to remove.
     * @param count The number of elements to remove.
     */
    removeRange(index: number, count: number): List<T> {
        this._source.splice(index, count + index - 1);
        return this;
    }
    /**
     * Removes all elements from the list.
     */
    clear(): List<T> {
        this.removeAll();
        return this;
    }
    /**
     * Returns a number that represents how many elements in the specified sequence satisfy a condition.
     * If predicate is omitted, the full size of the list will be returned.
     * @param predicate A function to test each element for a condition.
     */
    count(predicate?: Util.IPredicate<T>): number {
        if (!predicate) return this.length;

        let sum = 0;
        this._source.forEach(item => {
            if (predicate(item)) sum++;
        });
        return sum;
    }
    
    /**
     * Reverses the order of the elements in the specified range.
     * If index and count is omitted the entire list will be reversed.
     * @param index The zero-based starting index of the range to reverse.
     * @param count The number of elements in the range to reverse. If not provided it will default to end of the list.
     */
    reverse(index?: number, count?: number): List<T> {
        if ((Util.isUndefined(index) && Util.isUndefined(count)) || (index === 0 && count >= this.length)) {
            // reverse the entire list
            this._source.reverse();
        } else {
            if (Util.isUndefined(count)) count = this.length;
            let arr = this._source.splice(index, count + index - 1);
            arr.reverse();
            this.insertRange(index, arr);
        }
        return this;
    }


    static range(start: number, count: number): number[] {
        let arr = [];
        for (let i = start; i < start + count; i++)
            arr.push(i);
        return arr;
    }
}
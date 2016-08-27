import * as Util from "../util";
export default class BinaryTree<T> {
    private _root;
    private _compare;
    length: number;
    constructor(compareFunction?: Util.IComparer<T>);
    /**
     * Insert an item into the tree.
     * @param item
     * @returns boolean Return false if the item already exists.
     */
    insert(item: T): boolean;
    /**
     * Insert a range of items into the tree.
     * @param item
     */
    insertRange(items: T[]): void;
    /**
     * Insert an item into the tree.
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param node The node we wish to insert
     */
    private insertAux(tree, node);
    remove(item: T): boolean;
    /**
     * Check if the tree contains a given item.
     * @param item
     * @returns True if the item exists in the tree.
     */
    contains(item: T): boolean;
    /**
     * Execute callback for each item.
     * @param callback What should we do when we get there.
     * @see inorderTraversal
     */
    forEach(callback: Util.ILoopFunction<T>): void;
    /**
     * Make into an (ordered) array.
     */
    toArray(): T[];
    /**
     * Traverse the tree and execute callback when entering (passing on the left side of) an item.
     * @param callback What should we do when we get there.
     */
    preorderTraversal(callback: Util.ILoopFunction<T>): void;
    /**
     * Traverse the tree and execute callback when entering (passing on the left side of) an item.
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
    private preorderTraversalAux(tree, callback, signal);
    /**
     * Traverse the tree and execute callback when passing (pass under the item) an item
     * @param callback What should we do when we get there.
     */
    inorderTraversal(callback: Util.ILoopFunction<T>): void;
    /**
     * Traverse the tree and execute callback when passing (pass under the item) an item
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
    private inorderTraversalAux(tree, callback, signal);
    /**
     * Traverse the tree and execute callback when leaving (passing on the right side of) an item
     * @param callback What should we do when we get there.
     */
    postorderTraversal(callback: Util.ILoopFunction<T>): void;
    /**
     * Traverse the tree and execute callback when passing (pass under the item) an item
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
    private postorderTraversalAux(tree, callback, signal);
    /**
     * Traverse the tree one level at a time and execute callback on each an item
     * @param callback What should we do when we get there.
     */
    levelTraversal(callback: Util.ILoopFunction<T>): void;
    /**
     * Traverse the tree one level at a time and execute callback on each an item
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
    private levelTraversalAux(tree, callback, signal);
    /**
     * Get the minimum value in the tree.
     */
    min(): T;
    /**
     * Get the minimum value in the tree.
     * @private
     * @param tree Which TreeNode we're traversing.
     */
    private minAux(tree);
    /**
     * Get the maximum value in the tree.
     */
    max(): T;
    /**
     * Get the maximum value in the tree.
     * @private
     * @param tree Which TreeNode we're traversing.
     */
    private maxAux(tree);
    /**
     * Get the depth of a tree.
     * -1 = Empty
     * 0 = Only root
     */
    depth(): number;
    /**
     * Get the minimum value in the tree.
     * -1 = Empty
     * 0 = Only root
     * @private
     * @param tree Which TreeNode we're traversing.
     */
    private depthAux(tree);
    /**
     * Search the tree for a specific item.
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param item
     */
    private _search(tree, item);
}

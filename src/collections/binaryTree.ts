import * as Util from "../util";
import Queue from "./queue";

export default class BinaryTree<T> {
    private _root: TreeNode;
    private _compare: Util.IComparer<T>;

    length: number = 0;

    constructor(compareFunction?: Util.IComparer<T>) {
        this._compare = compareFunction || Util.defaultComparer;
    }


    /**
     * Insert an item into the tree.
     * @param item
     * @returns boolean Return false if the item already exists.
     */
    insert(item: T): boolean { return this.insertAux(this._root, new TreeNode(item)); }
    /**
     * Insert a range of items into the tree.
     * @param item
     */
    insertRange(items: T[]): void {
        items.forEach(item => { this.insert(item); });
    }
    /**
     * Insert an item into the tree.
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param node The node we wish to insert
     */
    private insertAux(tree: TreeNode, node: TreeNode): boolean {

        if (!this._root) {
            this._root = node;
            this.length++;
            return true;
        }

        let comp: number = this._compare(node.value, tree.value);

        if (comp < 0) {
            if (tree.left) {
                this.insertAux(tree.left, node);
            } else {
                tree.left = node;
                node.parent = tree;
                this.length++;
            }
            return true;

        } else if (comp > 0) {
            if (tree.right) {
                this.insertAux(tree.right, node);
            } else {
                tree.right = node;
                node.parent = tree;
                this.length++;
            }
            return true;
        }
        return false;
    }

    remove(item: T): boolean {
        let node = this._search(this._root, item);

        if (node && node.isEmpty()) {
            if (node.value < node.parent.value) delete node.parent.left;
            else delete node.parent.right;
            delete node.parent;
        } else if (node) {
            let right = node;
            while (right.right) { right = right.right; } // Get right most item.
            if (right.left) {
                right = right.left; // If the right most item has a left, use that instead.


            } else {

                while (right.value !== node.value) {
                    right.left = right.parent.left;
                    right.left.parent = right;
                    if (right.parent.value === node.value) break;
                    right = right.parent;
                }
            }

            right.parent = node.parent;
            node.left = node.right = node.parent = undefined;
            if (node === this._root) {
                this._root = right;
                delete this._root.parent;
            }
        }
        return false;
    }

    /**
     * Check if the tree contains a given item.
     * @param item
     * @returns True if the item exists in the tree.
     */
    contains(item: T): boolean {
        return !!this._search(this._root, item);
    }

    /**
     * Execute callback for each item.
     * @param callback What should we do when we get there.
     * @see inorderTraversal
     */
    forEach(callback: Util.ILoopFunction<T>): void {
        this.inorderTraversal(callback);
    }

    /**
     * Make into an (ordered) array.
     */
    toArray(): T[] {
        let arr: Array<T> = [];
        this.forEach(item => { arr.push(item); });
        return arr;
    }


    /**
     * Traverse the tree and execute callback when entering (passing on the left side of) an item.
     * @param callback What should we do when we get there.
     */
    preorderTraversal(callback: Util.ILoopFunction<T>): void { this.preorderTraversalAux(this._root, callback, { stop: false }); }
    /**
     * Traverse the tree and execute callback when entering (passing on the left side of) an item.
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
    private preorderTraversalAux(tree: TreeNode, callback: Util.ILoopFunction<T>, signal: { stop: boolean }): void {
        if (!tree || signal.stop) return;

        signal.stop = (callback(tree.value) === false);
        if (signal.stop) return;
        this.preorderTraversalAux(tree.left, callback, signal);
        if (signal.stop) return;
        this.preorderTraversalAux(tree.right, callback, signal);
    }

    /**
     * Traverse the tree and execute callback when passing (pass under the item) an item
     * @param callback What should we do when we get there.
     */
    inorderTraversal(callback: Util.ILoopFunction<T>): void { this.inorderTraversalAux(this._root, callback, { stop: false }); }
    /**
     * Traverse the tree and execute callback when passing (pass under the item) an item
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
    private inorderTraversalAux(tree: TreeNode, callback: Util.ILoopFunction<T>, signal: { stop: boolean }): void {
        if (!tree || signal.stop) return;

        this.inorderTraversalAux(tree.left, callback, signal);
        if (signal.stop) return;
        signal.stop = (callback(tree.value) === false);
        if (signal.stop) return;
        this.inorderTraversalAux(tree.right, callback, signal);
    }

    /**
     * Traverse the tree and execute callback when leaving (passing on the right side of) an item
     * @param callback What should we do when we get there.
     */
    postorderTraversal(callback: Util.ILoopFunction<T>): void { this.postorderTraversalAux(this._root, callback, { stop: false }); }
    /**
     * Traverse the tree and execute callback when passing (pass under the item) an item
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
    private postorderTraversalAux(tree: TreeNode, callback: Util.ILoopFunction<T>, signal: { stop: boolean }): void {
        if (!tree || signal.stop) return;

        this.postorderTraversalAux(tree.left, callback, signal);
        if (signal.stop) return;
        this.postorderTraversalAux(tree.right, callback, signal);
        if (signal.stop) return;
        signal.stop = (callback(tree.value) === false);
    }

    /**
     * Traverse the tree one level at a time and execute callback on each an item
     * @param callback What should we do when we get there.
     */
    levelTraversal(callback: Util.ILoopFunction<T>): void { this.levelTraversalAux(this._root, callback, { stop: false }); }
    /**
     * Traverse the tree one level at a time and execute callback on each an item
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param callback What should we do when we get there.
     * @param signal Object (so it's a reference) that we use to know when the callback returned false.
     */
    private levelTraversalAux(tree: TreeNode, callback: Util.ILoopFunction<T>, signal: { stop: boolean }): void {
        let queue = new Queue<TreeNode>();
        if (tree) queue.enqueue(tree);

        while (!Util.isUndefined(tree = queue.dequeue())) {
            signal.stop = signal.stop || (callback(tree.value) === false);
            if (signal.stop) return;
            if (tree.left) queue.enqueue(tree.left);
            if (tree.right) queue.enqueue(tree.right);
        }
    }

    /**
     * Get the minimum value in the tree.
     */
    min(): T {
        let min = this.minAux(this._root);
        if (min) return min.value;
    }
    /**
     * Get the minimum value in the tree.
     * @private
     * @param tree Which TreeNode we're traversing.
     */
    private minAux(tree: TreeNode): TreeNode {
        if (tree.left) return this.minAux(tree.left);
        else return tree;
    }

    /**
     * Get the maximum value in the tree.
     */
    max(): T {
        let max = this.maxAux(this._root);
        if (max) return max.value;
    }
    /**
     * Get the maximum value in the tree.
     * @private
     * @param tree Which TreeNode we're traversing.
     */
    private maxAux(tree: TreeNode): TreeNode {
        if (tree.right) return this.maxAux(tree.right);
        else return tree;
    }

    /**
     * Get the depth of a tree.
     * -1 = Empty
     * 0 = Only root
     */
    depth(): number { return this.depthAux(this._root); }
    /**
     * Get the minimum value in the tree.
     * -1 = Empty
     * 0 = Only root
     * @private
     * @param tree Which TreeNode we're traversing.
     */
    private depthAux(tree: TreeNode): number {
        if (!tree) return -1;

        return Math.max(this.depthAux(tree.left), this.depthAux(tree.right)) + 1;

    }

    /**
     * Search the tree for a specific item.
     * @private
     * @param tree Which TreeNode we're traversing.
     * @param item 
     */
    private _search(tree: TreeNode, item: T): TreeNode {
        if (Util.isUndefined(tree)) return undefined;

        let comp = this._compare(item, tree.value);
        if (comp < 0) {
            tree = this._search(tree.left, item);
        } else if (comp > 0) {
            tree = this._search(tree.right, item);
        }
        return tree;
    }
}

class TreeNode {
    left: TreeNode;
    right: TreeNode;
    parent: TreeNode;
    value: any;

    constructor(value: any) {
        this.value = value;
    }

    /**
     * If the node has neither a right or left child.
     */
    isEmpty(): boolean { return !this.left && !this.right; }

    ///**
    // * Compare value with value of another TreeNode.
    // * @param other Other TreeNode
    // */
    //compareTo(other: TreeNode): number { return TreeNode.compareTo(this, other); }
    ///**
    // * Compare values of two TreeNode.
    // * @param a First TreeNode.
    // * @param b Second TreeNode.
    // */
    //static compareTo(a: TreeNode, b: TreeNode): number {
    //    return Util.defaultComparer(a.value, b.value);
    //}
}

import * as Util from "../util";
export default class BinaryTree<T> {
    private _root;
    private _compare;
    length: number;
    constructor(compareFunction?: Util.IComparer<T>);
    insert(item: T): boolean;
    insertRange(items: T[]): void;
    private insertAux(tree, node);
    remove(item: T): boolean;
    contains(item: T): boolean;
    forEach(callback: Util.ILoopFunction<T>): void;
    toArray(): T[];
    preorderTraversal(callback: Util.ILoopFunction<T>): void;
    private preorderTraversalAux(tree, callback, signal);
    inorderTraversal(callback: Util.ILoopFunction<T>): void;
    private inorderTraversalAux(tree, callback, signal);
    postorderTraversal(callback: Util.ILoopFunction<T>): void;
    private postorderTraversalAux(tree, callback, signal);
    levelTraversal(callback: Util.ILoopFunction<T>): void;
    private levelTraversalAux(tree, callback, signal);
    min(): T;
    private minAux(tree);
    max(): T;
    private maxAux(tree);
    depth(): number;
    private depthAux(tree);
    private _search(tree, item);
}

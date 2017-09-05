import * as Util from "../util";

export function makeValuePredicate(predicate): (predicate) => any {
    if (Util.isString(predicate)) {
        let field = predicate;
        predicate = ((x) => x[field]);

    } else if (Util.isUndefined(predicate)) {
        predicate = (() => true);
    }
    return predicate;
}

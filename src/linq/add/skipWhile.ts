import {Linq} from "../linq";
import {skipWhileProto, skipWhileStatic} from "../iterator/skipWhile";

Linq.prototype.skipWhile = skipWhileProto;
Linq.skipWhile = skipWhileStatic;

declare module "../linq" {
    interface Linq<TSource> {
        skipWhile: typeof skipWhileProto;
    }

    namespace Linq {
        export let skipWhile: typeof skipWhileStatic;
    }
}

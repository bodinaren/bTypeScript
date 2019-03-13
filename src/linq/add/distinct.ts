import {Linq} from "../linq";
import {distinctProto, distinctStatic} from "../iterator/distinct";

Linq.prototype.distinct = distinctProto;
Linq.distinct = distinctStatic;

declare module "../linq" {
    interface Linq<TSource> {
        distinct: typeof distinctProto;
    }

    namespace Linq {
        export let distinct: typeof distinctStatic;
    }
}

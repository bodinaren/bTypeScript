import {Linq} from "../linq";
import {filterProto, filterStatic} from "../iterator/filter";

Linq.prototype.filter = filterProto;
Linq.filter = filterStatic;

declare module "../linq" {
    interface Linq<TSource> {
        filter: typeof filterProto;
    }

    namespace Linq {
        export let filter: typeof filterStatic;
    }
}

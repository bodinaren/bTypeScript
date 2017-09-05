import {Linq} from "../linq";
import {groupByProto, groupByStatic} from "../iterator/groupBy";

Linq.prototype.groupBy = groupByProto;
Linq.groupBy = groupByStatic;

declare module "../linq" {
    interface Linq<TSource> {
        groupBy: typeof groupByProto;
    }

    namespace Linq {
        export let groupBy: typeof groupByStatic;
    }
}

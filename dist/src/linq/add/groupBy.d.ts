import { groupByProto, groupByStatic } from "../iterator/groupBy";
declare module "../linq" {
    interface Linq<TSource> {
        groupBy: typeof groupByProto;
    }
    namespace Linq {
        let groupBy: typeof groupByStatic;
    }
}

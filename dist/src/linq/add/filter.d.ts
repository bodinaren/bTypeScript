import { filterProto, filterStatic } from "../iterator/filter";
declare module "../linq" {
    interface Linq<TSource> {
        filter: typeof filterProto;
    }
    namespace Linq {
        let filter: typeof filterStatic;
    }
}

import { intersectProto, intersectStatic } from "../iterator/intersect";
declare module "../linq" {
    interface Linq<TSource> {
        intersect: typeof intersectProto;
    }
    namespace Linq {
        let intersect: typeof intersectStatic;
    }
}

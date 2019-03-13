import {Linq} from "../linq";
import {intersectProto, intersectStatic} from "../iterator/intersect";

Linq.prototype.intersect = intersectProto;
Linq.intersect = intersectStatic;

declare module "../linq" {
    interface Linq<TSource> {
        intersect: typeof intersectProto;
    }

    namespace Linq {
        export let intersect: typeof intersectStatic;
    }
}

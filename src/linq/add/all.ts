import {Linq} from "../linq";
import {allProto, allStatic} from "../operator/all";

Linq.prototype.all = allProto;
Linq.all = allStatic;

declare module "../linq" {
    interface Linq<TSource> {
        all: typeof allProto;
    }

    namespace Linq {
        export let all: typeof allStatic;
    }
}

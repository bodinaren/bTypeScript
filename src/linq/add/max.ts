import {Linq} from "../linq";
import {maxProto, maxStatic} from "../operator/max";

Linq.prototype.max = maxProto;
Linq.max = maxStatic;

declare module "../linq" {
    interface Linq<TSource> {
        max: typeof maxProto;
    }

    namespace Linq {
        export let max: typeof maxStatic;
    }
}

import {Linq} from "../linq";
import {minProto, minStatic} from "../operator/min";

Linq.prototype.min = minProto;
Linq.min = minStatic;

declare module "../linq" {
    interface Linq<TSource> {
        min: typeof minProto;
    }

    namespace Linq {
        export let min: typeof minStatic;
    }
}

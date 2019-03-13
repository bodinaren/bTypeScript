import {Linq} from "../linq";
import {firstProto, firstStatic} from "../operator/first";

Linq.prototype.first = firstProto;
Linq.first = firstStatic;

declare module "../linq" {
    interface Linq<TSource> {
        first: typeof firstProto;
    }

    namespace Linq {
        export let first: typeof firstStatic;
    }
}

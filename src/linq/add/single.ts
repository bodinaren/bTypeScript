import {Linq} from "../linq";
import {singleProto, singleStatic} from "../operator/single";

Linq.prototype.single = singleProto;
Linq.single = singleStatic;

declare module "../linq" {
    interface Linq<TSource> {
        single: typeof singleProto;
    }

    namespace Linq {
        export let single: typeof singleStatic;
    }
}

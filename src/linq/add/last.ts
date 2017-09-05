import {Linq} from "../linq";
import {lastProto, lastStatic} from "../operator/last";

Linq.prototype.last = lastProto;
Linq.last = lastStatic;

declare module "../linq" {
    interface Linq<TSource> {
        last: typeof lastProto;
    }

    namespace Linq {
        export let last: typeof lastStatic;
    }
}

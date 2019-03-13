import {Linq} from "../linq";
import {sumProto, sumStatic} from "../operator/sum";

Linq.prototype.sum = sumProto;
Linq.sum = sumStatic;

declare module "../linq" {
    interface Linq<TSource> {
        sum: typeof sumProto;
    }

    namespace Linq {
        export let sum: typeof sumStatic;
    }
}

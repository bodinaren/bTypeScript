import {Linq} from "../linq";
import {averageProto, averageStatic} from "../operator/average";

Linq.prototype.average = averageProto;
Linq.average = averageStatic;

declare module "../linq" {
    interface Linq<TSource> {
        average: typeof averageProto;
    }

    namespace Linq {
        export let average: typeof averageStatic;
    }
}

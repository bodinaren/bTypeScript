import {Linq} from "../linq";
import {anyProto, anyStatic} from "../operator/any";

Linq.prototype.any = anyProto;
Linq.any = anyStatic;

declare module "../linq" {
    interface Linq<TSource> {
        any: typeof anyProto;
    }

    namespace Linq {
        export let any: typeof anyStatic;
    }
}

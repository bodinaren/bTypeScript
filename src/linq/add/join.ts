import {Linq} from "../linq";
import {joinProto, joinStatic} from "../iterator/join";

Linq.prototype.join = joinProto;
Linq.join = joinStatic;

declare module "../linq" {
    interface Linq<TSource> {
        join: typeof joinProto;
    }

    namespace Linq {
        export let join: typeof joinStatic;
    }
}

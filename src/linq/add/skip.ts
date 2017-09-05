import {Linq} from "../linq";
import {skipProto, skipStatic} from "../iterator/skip";

Linq.prototype.skip = skipProto;
Linq.skip = skipStatic;

declare module "../linq" {
    interface Linq<TSource> {
        skip: typeof skipProto;
    }

    namespace Linq {
        export let skip: typeof skipStatic;
    }
}

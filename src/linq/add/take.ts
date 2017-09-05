import {Linq} from "../linq";
import {takeProto, takeStatic} from "../iterator/take";

Linq.prototype.take = takeProto;
Linq.take = takeStatic;

declare module "../linq" {
    interface Linq<TSource> {
        take: typeof takeProto;
    }

    namespace Linq {
        export let take: typeof takeStatic;
    }
}

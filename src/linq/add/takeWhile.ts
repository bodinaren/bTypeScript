import {Linq} from "../linq";
import {takeWhileProto, takeWhileStatic} from "../iterator/takeWhile";

Linq.prototype.takeWhile = takeWhileProto;
Linq.takeWhile = takeWhileStatic;

declare module "../linq" {
    interface Linq<TSource> {
        takeWhile: typeof takeWhileProto;
    }

    namespace Linq {
        export let takeWhile: typeof takeWhileStatic;
    }
}

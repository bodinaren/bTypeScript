import {Linq} from "../linq";
import {mapProto, mapStatic} from "../iterator/map";

Linq.prototype.map = mapProto;
Linq.map = mapStatic;

declare module "../linq" {
    interface Linq<TSource> {
        map: typeof mapProto;
    }

    namespace Linq {
        export let map: typeof mapStatic;
    }
}

import { mapProto, mapStatic } from "../iterator/map";
declare module "../linq" {
    interface Linq<TSource> {
        map: typeof mapProto;
    }
    namespace Linq {
        let map: typeof mapStatic;
    }
}

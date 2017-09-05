import { distinctProto, distinctStatic } from "../iterator/distinct";
declare module "../linq" {
    interface Linq<TSource> {
        distinct: typeof distinctProto;
    }
    namespace Linq {
        let distinct: typeof distinctStatic;
    }
}

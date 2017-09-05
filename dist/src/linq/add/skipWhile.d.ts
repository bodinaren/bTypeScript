import { skipWhileProto, skipWhileStatic } from "../iterator/skipWhile";
declare module "../linq" {
    interface Linq<TSource> {
        skipWhile: typeof skipWhileProto;
    }
    namespace Linq {
        let skipWhile: typeof skipWhileStatic;
    }
}

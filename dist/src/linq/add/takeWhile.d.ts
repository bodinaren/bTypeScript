import { takeWhileProto, takeWhileStatic } from "../iterator/takeWhile";
declare module "../linq" {
    interface Linq<TSource> {
        takeWhile: typeof takeWhileProto;
    }
    namespace Linq {
        let takeWhile: typeof takeWhileStatic;
    }
}

import { skipProto, skipStatic } from "../iterator/skip";
declare module "../linq" {
    interface Linq<TSource> {
        skip: typeof skipProto;
    }
    namespace Linq {
        let skip: typeof skipStatic;
    }
}

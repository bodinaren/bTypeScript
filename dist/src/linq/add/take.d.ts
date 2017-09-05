import { takeProto, takeStatic } from "../iterator/take";
declare module "../linq" {
    interface Linq<TSource> {
        take: typeof takeProto;
    }
    namespace Linq {
        let take: typeof takeStatic;
    }
}

import { joinProto, joinStatic } from "../iterator/join";
declare module "../linq" {
    interface Linq<TSource> {
        join: typeof joinProto;
    }
    namespace Linq {
        let join: typeof joinStatic;
    }
}

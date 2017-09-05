import { maxProto, maxStatic } from "../operator/max";
declare module "../linq" {
    interface Linq<TSource> {
        max: typeof maxProto;
    }
    namespace Linq {
        let max: typeof maxStatic;
    }
}

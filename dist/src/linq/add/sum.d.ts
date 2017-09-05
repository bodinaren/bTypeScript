import { sumProto, sumStatic } from "../operator/sum";
declare module "../linq" {
    interface Linq<TSource> {
        sum: typeof sumProto;
    }
    namespace Linq {
        let sum: typeof sumStatic;
    }
}

import { singleProto, singleStatic } from "../operator/single";
declare module "../linq" {
    interface Linq<TSource> {
        single: typeof singleProto;
    }
    namespace Linq {
        let single: typeof singleStatic;
    }
}

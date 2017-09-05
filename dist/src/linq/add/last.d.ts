import { lastProto, lastStatic } from "../operator/last";
declare module "../linq" {
    interface Linq<TSource> {
        last: typeof lastProto;
    }
    namespace Linq {
        let last: typeof lastStatic;
    }
}

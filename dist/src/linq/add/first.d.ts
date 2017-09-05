import { firstProto, firstStatic } from "../operator/first";
declare module "../linq" {
    interface Linq<TSource> {
        first: typeof firstProto;
    }
    namespace Linq {
        let first: typeof firstStatic;
    }
}

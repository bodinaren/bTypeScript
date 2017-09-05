import { anyProto, anyStatic } from "../operator/any";
declare module "../linq" {
    interface Linq<TSource> {
        any: typeof anyProto;
    }
    namespace Linq {
        let any: typeof anyStatic;
    }
}

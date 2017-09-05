import { minProto, minStatic } from "../operator/min";
declare module "../linq" {
    interface Linq<TSource> {
        min: typeof minProto;
    }
    namespace Linq {
        let min: typeof minStatic;
    }
}

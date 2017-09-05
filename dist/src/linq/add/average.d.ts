import { averageProto, averageStatic } from "../operator/average";
declare module "../linq" {
    interface Linq<TSource> {
        average: typeof averageProto;
    }
    namespace Linq {
        let average: typeof averageStatic;
    }
}

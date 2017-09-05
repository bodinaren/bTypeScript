import { allProto, allStatic } from "../operator/all";
declare module "../linq" {
    interface Linq<TSource> {
        all: typeof allProto;
    }
    namespace Linq {
        let all: typeof allStatic;
    }
}

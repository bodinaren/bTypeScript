import { orderByProto, orderByStatic, orderByDescProto, orderByDescStatic } from "../iterator/orderBy";
declare module "../linq" {
    interface Linq<TSource> {
        orderBy: typeof orderByProto;
        orderByDesc: typeof orderByDescProto;
    }
    namespace Linq {
        let orderBy: typeof orderByStatic;
        let orderByDesc: typeof orderByDescStatic;
    }
}

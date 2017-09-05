import {Linq} from "../linq";
import {BaseIterator} from "../iterator/iterator";
import {orderByProto, orderByStatic, orderByDescProto, orderByDescStatic} from "../iterator/orderBy";

Linq.prototype.orderBy = orderByProto;
Linq.prototype.orderByDesc = orderByDescProto;

Linq.orderBy = orderByStatic;
Linq.orderByDesc = orderByDescStatic;

declare module "../linq" {
    interface Linq<TSource> {
        orderBy: typeof orderByProto;
        orderByDesc: typeof orderByDescProto;
    }

    namespace Linq {
        export let orderBy: typeof orderByStatic;
        export let orderByDesc: typeof orderByDescStatic;
    }
}

import {Linq} from "../linq";
import {exceptProto, exceptStatic} from "../iterator/except";

Linq.prototype.except = exceptProto;
Linq.except = exceptStatic;

declare module "../linq" {
    interface Linq<TSource> {
        except: typeof exceptProto;
    }

    namespace Linq {
        export let except: typeof exceptStatic;
    }
}

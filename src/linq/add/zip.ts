import {Linq} from "../linq";
import {zipProto, zipStatic} from "../iterator/zip";

Linq.prototype.zip = zipProto;
Linq.zip = zipStatic;

declare module "../linq" {
    interface Linq<TSource> {
        zip: typeof zipProto;
    }

    namespace Linq {
        export let zip: typeof zipStatic;
    }
}

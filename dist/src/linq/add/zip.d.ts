import { zipProto, zipStatic } from "../iterator/zip";
declare module "../linq" {
    interface Linq<TSource> {
        zip: typeof zipProto;
    }
    namespace Linq {
        let zip: typeof zipStatic;
    }
}

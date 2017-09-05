import { exceptProto, exceptStatic } from "../iterator/except";
declare module "../linq" {
    interface Linq<TSource> {
        except: typeof exceptProto;
    }
    namespace Linq {
        let except: typeof exceptStatic;
    }
}

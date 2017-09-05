import {BaseIterator, IteratorResult} from "./iterator/iterator";
import {OrderedLinq} from "./iterator/orderBy";

import {Linq, LQ} from "./linq";

// Iterators
import "./add/distinct";
import "./add/except";
import "./add/filter";
import "./add/groupBy";
import "./add/intersect";
import "./add/join";
import "./add/map";
import "./add/orderBy";
import "./add/skip";
import "./add/skipWhile";
import "./add/take";
import "./add/takeWhile";
import "./add/zip";

// Operators
import "./add/all";
import "./add/any";
import "./add/average";
import "./add/first";
import "./add/last";
import "./add/max";
import "./add/min";
import "./add/single";
import "./add/sum";

export {Linq, LQ, OrderedLinq};

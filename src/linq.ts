﻿import Iterator from "./linq/iterator";
import FilterIterator from "./linq/filter";
import MapIterator from "./linq/map";
import OrderIterator from "./linq/order";
import SkipIterator from "./linq/skip";
import SkipWhileIterator from "./linq/skipWhile";
import TakeIterator from "./linq/take";
import TakeWhileIterator from "./linq/takeWhile";

import Linq from "./linq/linq";
import LinqOrdered from "./linq/linqOrdered";

export default Linq;
export {LinqOrdered, Iterator, FilterIterator, MapIterator, OrderIterator, SkipIterator, SkipWhileIterator, TakeIterator, TakeWhileIterator};
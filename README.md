# bTypeScript
TypeScript collections, Linq and various helpers.

## Install
I'm still working on the packaging, install directly from Git for now: `npm install https://github.com/bodinaren/bTypeScript`

## Examples
See tests for a complete set of examples.

### Collections
```
import {Queue, List} from 'btypescript';

var q = new Queue<number>();
q.enqueue(10);
q.dequeue(); // 10

var l = new List<number>();
l.addRange(List.range(10, 20));
l.count(); // 20
```

### Linq

#### Usage
```
import {Linq} from 'btypescript';

var arr1 = [2, 4, 6, 8, 9, 7, 5, 3, 1],
    arr2 = [0, 3, 5, 7, 10],
    arr3 = [5, 10];

new Linq(arr1).filter(x => x % 2 == 0).toArray(); // [2, 4, 6, 8]
new Linq(arr1).orderBy(x => x).toArray(); // [1, 2, 3, 4, 5, 6, 7, 8, 9];
new Linq(arr1).skipWhile(x => x != 7).toArray(); // [7, 5, 3, 1];

new Linq(arr1).intersect(arr2).toArray(); // [3, 5, 7];
new Linq(arr1).intersect(arr2, arr3).toArray(); // [5];

new Linq(arr1)
    .filter(x => x % 2 == 1) // [9, 7, 5, 3, 1]
    .map(x => x * 2) // [18, 14, 10, 6, 2]
    .skip(3) // [6, 2]
    .sum(); // 8
```

#### Short-hand ####
You can also use the short-hand LQ.
```
import {LQ} from 'btypescript';

var arr1 = [2, 4, 6, 8, 9, 7, 5, 3, 1],
    arr2 = [0, 3, 5, 7, 10],
    arr3 = [5, 10];

LQ(arr1).filter(x => x % 2 == 0).toArray(); // [2, 4, 6, 8]
LQ(arr1).orderBy(x => x).toArray(); // [1, 2, 3, 4, 5, 6, 7, 8, 9];
LQ(arr1).skipWhile(x => x != 7).toArray(); // [7, 5, 3, 1];

LQ(arr1).intersect(arr2).toArray(); // [3, 5, 7];
LQ(arr1).intersect(arr2, arr3).toArray(); // [5];

LQ(arr1)
    .filter(x => x % 2 == 1) // [9, 7, 5, 3, 1]
    .map(x => x * 2) // [18, 14, 10, 6, 2]
    .skip(3) // [6, 2]
    .sum(); // 8
```

#### Static calls ####
If you're not looking to build chains you can also use static versions of all functions, no trailing `.toArray()` required.
```
import {Linq} from 'btypescript';

var arr1 = [2, 4, 6, 8, 9, 7, 5, 3, 1],
    arr2 = [0, 3, 5, 7, 10],
    arr3 = [5, 10];

Linq.filter(arr1, x => x % 2 == 0); // [2, 4, 6, 8]
Linq.orderBy(arr1, x => x); // [1, 2, 3, 4, 5, 6, 7, 8, 9];
Linq.skipWhile(arr1, x => x != 7); // [7, 5, 3, 1];

Linq.intersect(arr1, arr2); // [3, 5, 7];
Linq.intersect(arr1, arr2, arr3); // [5];
```

#### Modules ####
For smaller build build files you each Linq is build in modules. So instead of including everything by using `Linq` from `btypescript` or `btypescript/src/linq` you can import each module individually.
```
import {Linq} from 'btypescript/src/linq/linq';
import 'btypescript/src/linq/add/filter';
import 'btypescript/src/linq/add/map';
import 'btypescript/src/linq/add/average';
```
This will build only the minimum code required for using `.filter`, `.map` and `.average`.

### Helpers ###
```
import {Numbers, NumbersHelper, Strings, StringsHelper, Dates, DatesHelper} from './src/helpers';

Numbers(5).in([4, 5, 6]); // true
Numbers(5).between(1, 10); // true

Strings("Hello, {0}!").format("World"); // "Hello, World!"
StringsHelper.format("Hello, {0}", "World"); // "Hello, World!"

var d1 = new Date("2015-01-01T00:00:00+00:00"),
    d2 = new Date("2016-01-01T00:00:00+00:00"),
    d3 = new Date("2017-01-01T00:00:00+00:00");

Dates(d2).between(d1, d3); // true
DatesHelper.between(d2, d1, d3); // true
Dates(d2).addWeeks(1).date; // 2016-01-08T00:00:00+00:00
```
Sorting is something almost every program needs. We could write our own sort every time, but C already has a fast one in stdlib.h: **qsort**. It can sort any array, of ints, of strings, of structs. To do that, it needs our help with one thing: how to compare two values. We give it that as a function pointer

```c
#include <stdio.h>
#include <stdlib.h>

int compare_ints(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
}

int main(void) {
    int v[] = { 42, 7, 19, 3, 25 };
    qsort(v, 5, sizeof(int), compare_ints);
    for (int i = 0; i < 5; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
    return 0;
}
```

Output

```text
3 7 19 25 42
```

---

qsort takes four things

1. The array
2. How many values it has
3. How big one value is, in bytes: `sizeof(int)`
4. The compare function

qsort doesn't know what's in the array, so it gives our compare function two `const void *`. A **void pointer** is an address with no type: "something is here, I don't know what". We know it's an int, so we turn it into a `const int *` with a cast, then read it with `*`

The compare function must return

- a negative number when a should come before b
- a positive number when a should come after b
- 0 when it doesn't matter

---

A shortcut you'll see a lot is `return x - y;`. It works for small numbers, but when x and y are very far apart, the subtraction can overflow and give the wrong sign. The two ifs are always safe

To sort from big to small, flip the answer: return 1 where we returned -1, and the other way around

---

Sorting structs works the same way. The compare function gets pointers to two structs, and decides by the fields we choose. When the first field is equal, we can look at a second one, so the order is always clear

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct reel {
    char label[16];
    int year;
};

int by_year(const void *a, const void *b) {
    const struct reel *x = a;
    const struct reel *y = b;
    if (x->year != y->year) {
        return x->year < y->year ? -1 : 1;
    }
    return strcmp(x->label, y->label);
}

int main(void) {
    struct reel reels[] = {
        { "payroll", 1971 },
        { "census", 1969 },
        { "orbit", 1971 }
    };
    qsort(reels, 3, sizeof(struct reel), by_year);
    for (int i = 0; i < 3; i++) {
        printf("%d %s\n", reels[i].year, reels[i].label);
    }
    return 0;
}
```

Output

```text
1969 census
1971 orbit
1971 payroll
```

A `void *` can go into a typed pointer without a cast, so `const struct reel *x = a;` is enough. strcmp already returns negative, 0 or positive, exactly what qsort wants

---

## Mission: The Operator Ranking

At the end of the month, the computing center ranks its operators by how many jobs they ran. The list on the wall goes from the most jobs to the fewest. When two operators ran the same number of jobs, they are listed in alphabetical order

1. Keep each operator in a struct with a name and a number of jobs
2. Read a whole number n, then n lines, each with a name and a number of jobs
3. Sort them with qsort and a compare function of your own: most jobs first, and alphabetical by name when the jobs are equal
4. Print the ranking, as in the example

n is from 1 to 100. A name is one word of at most 15 letters, and the jobs are from 0 to 10000

**Example**

Input

```text
4
grace 31
ken 45
alan 31
linus 12
```

Output

```text
1. ken 45
2. alan 31
3. grace 31
4. linus 12
```

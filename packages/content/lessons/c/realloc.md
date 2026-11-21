With malloc, we must know the size before we ask for memory. But sometimes we only find out while reading: values keep coming until the input ends. We could ask for a huge block just in case, but that wastes memory, and it may still be too small

The answer is to start small and grow the block when it gets full. That's what **realloc** does

---

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *v = malloc(2 * sizeof(int));
    v[0] = 10;
    v[1] = 20;

    v = realloc(v, 4 * sizeof(int));
    v[2] = 30;
    v[3] = 40;

    for (int i = 0; i < 4; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
    free(v);
    return 0;
}
```

Output

```text
10 20 30 40
```

`realloc(v, new_size)` gives back a block of the new size, with the old values still in it. The new part, after them, holds garbage until we write something there

---

There is a catch. If there is no free room right after the old block, realloc finds a new place, copies everything there and frees the old block. So the address can change. That's why we always use the pointer that realloc returns, and forget the old one

And if there is no memory at all, realloc returns NULL, but the old block is still there. If we wrote `v = realloc(v, ...)` and got NULL, we would lose our only pointer to the old block, and it would leak. The safe way uses a second pointer

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *v = malloc(2 * sizeof(int));
    v[0] = 10;
    v[1] = 20;

    int new_size = 4 * sizeof(int);
    int *bigger = realloc(v, new_size);
    if (bigger == NULL) {
        free(v);
        return 1;
    }
    v = bigger;

    v[2] = 30;
    v[3] = 40;
    for (int i = 0; i < 4; i++) {
        printf("%d\n", v[i]);
    }
    free(v);
    return 0;
}
```

Output

```text
10
20
30
40
```

---

How much should we grow each time? Growing by one place every time would call realloc for every single value, and each call may copy the whole array. The usual trick is to **double** the size when the array is full. We keep two numbers: how many values we have, the count, and how many fit, the **capacity**

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int capacity = 2;
    int count = 0;
    int *v = malloc(capacity * sizeof(int));

    for (int x = 1; x <= 5; x++) {
        if (count == capacity) {
            capacity = capacity * 2;
            v = realloc(v, capacity * sizeof(int));
            printf("grew to %d\n", capacity);
        }
        v[count] = x;
        count++;
    }

    printf("%d values, room for %d\n", count, capacity);
    free(v);
    return 0;
}
```

Output

```text
grew to 4
grew to 8
5 values, room for 8
```

Five values, only two calls to realloc. With a million values, doubling needs about 20 calls

---

## Mission: The Endless Tape

A sensor writes its readings on a tape, and nobody knows how long the tape is. The technicians want to know the average reading, and which readings were above it. To find those, all the readings must be kept until the end

1. Read whole numbers until the input ends. Keep them in an array that starts with room for 2 values and doubles its capacity with realloc each time it gets full
2. Print how many values there were and the final capacity, as in the example
3. Print the values that are bigger than the average of all of them, in the order they came, separated by spaces. If none are, print `none`
4. Free the array at the end

There is at least one value and at most 10000. Each one is from -1000 to 1000

**Example**

Input

```text
4 9 1 7 3
```

Output

```text
Values: 5
Capacity: 8
Above average: 9 7
```

The average here is 24 / 5 = 4.8, so 9 and 7 are above it

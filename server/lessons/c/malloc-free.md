Until now, every variable we've created lives on the **stack** — a region of memory that's automatically managed. When a function ends, its stack variables are destroyed. But what if we need memory that **survives** after the function returns? Or what if we don't know at compile time **how much** memory we need?

Enter **dynamic memory allocation** — the **heap**

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(sizeof(int));
    *p = 42;
    printf("%d\n", *p);
    free(p);
    return 0;
}
```

**malloc** (memory allocate) asks the operating system for a block of memory on the **heap**. It returns a **pointer** to that memory. **sizeof(int)** tells it how many bytes we need (4 on most systems)

**free** returns the memory. If you don't free it, the memory stays allocated until your program ends — this is called a **memory leak**. In a long-running program, memory leaks can eat up all the RAM

---

The most common use: **dynamic arrays** — arrays whose size we decide at runtime

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    printf("How many scores? ");
    scanf("%d", &n);

    int *scores = malloc(n * sizeof(int));

    for (int i = 0; i < n; i++) {
        scores[i] = (i + 1) * 10;
    }

    for (int i = 0; i < n; i++) {
        printf("%d\n", scores[i]);
    }

    free(scores);
    return 0;
}
```

We use **scores[i]** exactly like a normal array — because the name of an array is a pointer anyway. The only difference: we allocated it ourselves and **must free it** when we're done

---

**calloc** is malloc's cousin. It allocates AND initializes everything to zero

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *arr = calloc(5, sizeof(int));
    // arr[0] through arr[4] are all 0
    printf("%d\n", arr[0]);
    free(arr);
    return 0;
}
```

With **malloc**, the memory contains garbage (whatever was there before). With **calloc**, it's clean. Use calloc when you want zeros

---

The golden rules of dynamic memory:

1. Every **malloc** or **calloc** must have a matching **free**
2. Never use memory after it's been freed (**use after free** — a dangerous bug)
3. Never free the same memory twice (**double free** — also dangerous)
4. Always check whether malloc returned **NULL** (it does when the system is out of memory)

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(sizeof(int));
    if (p == NULL) {
        printf("Out of memory!\n");
        return 1;
    }
    *p = 42;
    printf("%d\n", *p);
    free(p);
    return 0;
}
```

These rules sound simple, but breaking them causes some of the nastiest bugs in the world. Real-world security vulnerabilities like buffer overflows and use-after-free come from breaking these rules

---

## Mission: Dynamic Buffer for the Card Reader

The punch card reader sends a batch of readings, but the number of cards in the batch isn't known at compile time — it comes from the first line of the input tape. Allocate a dynamic buffer of exactly the right size, fill it with the readings, print them, and free the memory before the next batch.

1. Read an integer **n** — the number of readings in the batch
2. Allocate a dynamic array of **n ints** using **malloc**
3. Read the **n** values from input and put them in the array
4. Print each value on its own line
5. **free** the memory when you're done

**Example**

Input

```text
5
2 4 6 8 10
```

Output

```text
2
4
6
8
10
```

**Example**

Input

```text
3
7 14 21
```

Output

```text
7
14
21
```

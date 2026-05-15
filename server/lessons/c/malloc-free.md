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

**malloc** (memory allocate) asks the operating system for a chunk of memory on the **heap**. It returns a **pointer** to that memory. **sizeof(int)** tells it how many bytes we need (4 on most systems)

**free** gives the memory back. If you don't free it, the memory stays allocated until your program ends — this is called a **memory leak**. In a long-running program, memory leaks can eat all your RAM

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

We use **scores[i]** just like a normal array — because an array name is a pointer anyway. The only difference: we allocated it ourselves and we **must free it** when we're done

---

**calloc** is malloc's cousin. It allocates AND initializes everything to zero
```c
int *arr = calloc(5, sizeof(int));
// arr[0] through arr[4] are all 0
```

With **malloc**, the memory contains garbage (whatever was there before). With **calloc**, it's clean. Use calloc when you want zeros

---

The golden rules of dynamic memory:
1. Every **malloc** or **calloc** must have a matching **free**
2. Never use memory after freeing it (**use after free** — a dangerous bug)
3. Never free the same memory twice (**double free** — also dangerous)
4. Always check if malloc returned **NULL** (it does when the system is out of memory)

```c
int *p = malloc(sizeof(int));
if (p == NULL) {
    printf("Out of memory!\n");
    return 1;
}
```

These rules sound simple but violating them causes some of the hardest bugs in the world. Real-world security vulnerabilities like buffer overflows and use-after-free are caused by breaking these rules

---

Create a dynamic array of **5 ints** using **malloc**. Fill it with the values **{2, 4, 6, 8, 10}**. Print each value on a separate line. Don't forget to **free** the memory

Expected output
```text
2
4
6
8
10
```

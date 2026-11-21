After fork, the parent and the child each have their own copy of memory. If the child changes a variable, the parent never sees it. That's safe, but it makes sending results back hard. The exit status holds only one byte, from 0 to 255, and a pipe needs reading and writing on both sides

There is a more direct way: memory that both processes really share. We ask the kernel for it with **mmap**, from sys/mman.h, before the fork

---

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/wait.h>

int main(void) {
    int normal = 0;
    int *shared = mmap(NULL, sizeof(int), PROT_READ | PROT_WRITE,
                       MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    *shared = 0;

    fflush(stdout);
    if (fork() == 0) {
        normal = 500;
        *shared = 500;
        _exit(0);
    }
    wait(NULL);

    printf("normal: %d\n", normal);
    printf("shared: %d\n", *shared);
    munmap(shared, sizeof(int));
    return 0;
}
```

Output

```text
normal: 0
shared: 500
```

The child changed both. The parent sees only the shared one, because that page of memory is the same one in both processes, not a copy

---

mmap takes many arguments. For shared memory between a parent and its children, we always write them the same way

- `NULL`: let the kernel choose the address
- the size, in bytes
- `PROT_READ | PROT_WRITE`: we want to read and write it
- `MAP_SHARED | MAP_ANONYMOUS`: shared with our children, and not backed by any file
- `-1, 0`: no file, no offset

It returns a pointer, like malloc. On failure it returns **MAP_FAILED**, not NULL, so that's what we check. When we're done, **munmap** gives it back, like free

---

We can ask for room for many values at once and use the pointer as an array

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/wait.h>

int main(void) {
    int n = 3;
    long *results = mmap(NULL, n * sizeof(long), PROT_READ | PROT_WRITE,
                         MAP_SHARED | MAP_ANONYMOUS, -1, 0);

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if (fork() == 0) {
            results[i] = (i + 1) * 100;
            _exit(0);
        }
    }
    for (int i = 0; i < n; i++) {
        wait(NULL);
    }

    for (int i = 0; i < n; i++) {
        printf("%ld\n", results[i]);
    }
    return 0;
}
```

Output

```text
100
200
300
```

Each child writes only into its own slot, results[i]. Since no two processes write to the same place, they can't step on each other. When two processes write to the **same** place at the same time, we get a race condition, just like with threads, and we'd need a semaphore to take turns

---

The parent must not read the results before the children have written them. Waiting for every child with wait is what makes it safe: after the last wait, all the work is done

---

## Mission: The Prime Census

The census office wants to know how many primes there are up to several limits. Counting is slow, so every limit gets its own child, all running at once. The counts can be big, much bigger than 255, so they can't come back through the exit status

1. Read a whole number n, then n limits
2. Make a shared array of n longs with mmap, before any fork
3. Start all n children. Child i counts the prime numbers from 2 up to limit i, both included, writes the count into slot i and exits
4. Wait for all the children. Then print each limit with its count, in the order of the input, and the total of all counts, as in the example
5. Give the memory back with munmap

n is from 1 to 8, and every limit is from 1 to 100000. Call fflush(stdout) before every fork

**Example**

Input

```text
3
10 100 1
```

Output

```text
up to 10: 4
up to 100: 25
up to 1: 0
Total: 29
```

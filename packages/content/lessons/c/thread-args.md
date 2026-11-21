In the Threads lesson, each thread got one string through the last argument of pthread_create. Real work needs more: which part of the data to handle, and a place to put the result. The usual way is a **struct**, one for each thread, given as that one argument

```c
#include <stdio.h>
#include <pthread.h>

struct job {
    int from;
    int to;
    long result;
};

void *add_range(void *arg) {
    struct job *j = arg;
    long sum = 0;
    for (int x = j->from; x <= j->to; x++) {
        sum = sum + x;
    }
    j->result = sum;
    return NULL;
}

int main(void) {
    struct job jobs[2] = { { 1, 50, 0 }, { 51, 100, 0 } };
    pthread_t t[2];

    for (int i = 0; i < 2; i++) {
        pthread_create(&t[i], NULL, add_range, &jobs[i]);
    }
    for (int i = 0; i < 2; i++) {
        pthread_join(t[i], NULL);
    }

    printf("%ld + %ld = %ld\n", jobs[0].result, jobs[1].result,
           jobs[0].result + jobs[1].result);
    return 0;
}
```

Output

```text
1275 + 3775 = 5050
```

Each thread gets the address of its own struct. It reads its range from it, and writes its result back into it. Threads share memory, so main sees the results directly, without pipes. And since each thread writes only into its own struct, they never touch the same place: no mutex needed

---

A classic mistake: giving every thread the address of the loop variable

```text
for (int i = 0; i < 4; i++) {
    pthread_create(&t[i], NULL, work, &i);
}
```

All four threads get the same address, &i. By the time a thread reads it, the loop may already have moved on, so two threads can see the same number, and some numbers nobody sees. Each thread needs its own place: an array of structs, or an array of ints, with one slot per thread, that stays alive until the threads are done

---

The thread's function returns a `void *`, and pthread_join can catch it in its second argument. So a thread can also hand back a result as a pointer, for example to memory it got with malloc. Then main must free it

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

void *square(void *arg) {
    long n = *(long *)arg;
    long *value = malloc(sizeof(long));
    *value = n * n;
    return value;
}

int main(void) {
    pthread_t t;
    long n = 12;
    pthread_create(&t, NULL, square, &n);

    void *result;
    pthread_join(t, &result);
    long *value = result;
    printf("%ld\n", *value);
    free(value);
    return 0;
}
```

Output

```text
144
```

Writing into the struct is often simpler, and there's nothing to free

---

## Mission: The Split Sum

A long list of readings must be added up quickly, so the work is split between several threads. Each thread adds up one piece, and main puts the pieces together

1. Read k, the number of threads, then n, then the n readings
2. Split the readings into k pieces, one after another, as equal as possible. With n readings, each piece gets n / k of them, and the first n % k pieces get one more
3. Start k threads. Give each one its own struct with where its piece starts, how long it is, a pointer to the readings, and room for its result
4. Wait for all of them, then print each piece's size and sum, and the total, as in the example

k is from 1 to 8, n from k to 100000, and each reading from -1000 to 1000

**Example**

Input

```text
3
8
5 1 4 2 8 3 7 6
```

Output

```text
piece 1: 3 readings, sum 10
piece 2: 3 readings, sum 13
piece 3: 2 readings, sum 13
total: 36
```

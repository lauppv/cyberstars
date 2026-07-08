Semaphores extend the mutex idea. A **semaphore** is an atomic counter with two operations:

- **sem_wait(&s)** — decrements the counter. If it's 0, the thread **waits** until someone else increments.
- **sem_post(&s)** — increments the counter (and wakes up one blocked thread, if any).

In C, POSIX gives us the **<semaphore.h>** library. A semaphore is declared with the `sem_t` type and initialized with `sem_init(&s, 0, initial_value)`. The second argument is `0` when the semaphore is shared between threads of the same process (our case); `1` would mean shared between different processes.

---

When we initialize the semaphore with **1**, it behaves like a mutex: one thread enters (the counter goes to 0), and the others wait until it leaves and increments back.

```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t sem;
int counter = 0;

void *increment(void *arg) {
    for (int i = 0; i < 100000; i++) {
        sem_wait(&sem);
        counter++;
        sem_post(&sem);
    }
    return NULL;
}

int main(void) {
    sem_init(&sem, 0, 1);

    pthread_t t1, t2;
    pthread_create(&t1, NULL, increment, NULL);
    pthread_create(&t2, NULL, increment, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Counter: %d\n", counter);
    sem_destroy(&sem);
    return 0;
}
```

The result is always **200000**. The code is equivalent to the mutex version from the previous lesson — only the mechanism changed. **Why use a semaphore instead of a mutex?** Because the semaphore's counter can exceed 1, and that makes it far more flexible.

---

A **counting semaphore** (initialized to N > 1) models a number of **shared resources**. Picture the computing centre with **5 printers**: five jobs can run at once, and the sixth one waits until one of them frees up.

```text
sem_t printers;
sem_init(&printers, 0, 5);

// in each thread:
sem_wait(&printers);   // grab a printer (counter--)
// ... run the job
sem_post(&printers);   // release the printer (counter++)
```

When five threads have called `sem_wait`, the counter is 0. The sixth thread **blocks** on `sem_wait` until one of the running jobs finishes and calls `sem_post`.

A mutex couldn't do this — a mutex is always binary (held or free). A counting semaphore **caps how many go in at once**, not just one.

---

Don't forget `sem_destroy(&sem)` at the end — it releases internal resources. And `sem_init`'s third argument is the counter's **starting** value: 0, 1, or N.

---

## Mission: The Printer Queue

The computing centre has **2 printers** available. Four operators submit jobs simultaneously, but at any given moment at most 2 can be printing; the others queue politely.

1. Create a semaphore initialized to **2**.
2. Start **4 threads**, each with its ID (1, 2, 3, 4) passed as an argument.
3. Each thread:
   - Waits on the semaphore (`sem_wait`).
   - Prints `Thread K printing`.
   - Prints `Thread K done`.
   - Releases the semaphore (`sem_post`).
4. The main thread waits for all 4 threads with `pthread_join`, then prints `All jobs finished`.

**Example**

The order of the `printing`/`done` lines may vary — the rule is: at any moment, at most 2 threads are between `printing` and `done`.

```text
Thread 1 printing
Thread 2 printing
Thread 1 done
Thread 3 printing
Thread 2 done
Thread 4 printing
Thread 3 done
Thread 4 done
All jobs finished
```

The final message always appears last, because the main thread waits with `pthread_join`.

Use `sem_t`, `sem_init`, `sem_wait`, `sem_post`, `sem_destroy` from **<semaphore.h>**, plus `pthread_create` and `pthread_join` from **<pthread.h>**.

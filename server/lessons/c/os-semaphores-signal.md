A semaphore's most powerful use isn't as a mutex — it's as a **signal** between threads. The trick: initialize the semaphore to **0**. Now `sem_wait` blocks right away, until another thread calls `sem_post`.

That's useful when we want one thread to wait for an **event** from another: a result being ready, an input being available, a job finishing. Unlike a mutex where both threads "compete" for a resource, here we have a clear relationship: one waits, the other signals.

```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t ready;
int result;

void *compute(void *arg) {
    // Do some long computation...
    result = 42;
    // Signal that the result is ready.
    sem_post(&ready);
    return NULL;
}

int main(void) {
    sem_init(&ready, 0, 0);   // init to 0 — sem_wait blocks immediately

    pthread_t worker;
    pthread_create(&worker, NULL, compute, NULL);

    // Wait for the worker's signal.
    sem_wait(&ready);
    printf("Result: %d\n", result);

    pthread_join(worker, NULL);
    sem_destroy(&ready);
    return 0;
}
```

You might say: "But `pthread_join` does the same thing — it waits for the thread." True, and in this example `pthread_join` alone would be enough. Semaphores shine when we want to **wait for an intermediate moment** during a thread's execution (not its full termination), or when the thread runs in an infinite loop and never really ends.

---

Chain two semaphores together and you can synchronize two actors trading messages — a pattern called **rendezvous**. The producer puts a value in a shared variable, signals `full`, then waits for `empty`; the consumer waits for `full`, reads, then signals `empty` back. Both threads take turns through a single slot.

```c
sem_t full;    // init 0 — signalled by producer when the slot has data
sem_t empty;   // init 1 — signalled by consumer when the slot is free again
```

That pattern is the foundation of many message queues and pipelines.

---

## Mission: Wait for the Result

A worker thread must compute the sum of the numbers **1 through 10** and store it in a global variable. The main thread waits for the signal, then prints the result.

1. Declare a semaphore `ready` initialized to **0**.
2. The worker thread computes `1 + 2 + ... + 10` and writes it into the global `sum`. Then calls `sem_post(&ready)`.
3. The main thread calls `sem_wait(&ready)`, then prints `Sum: 55`.
4. At the end: `pthread_join` on the worker and `sem_destroy` on the semaphore.

**Example**

```text
Sum: 55
```

The output is deterministic — the main thread can't print the value until the worker has written it and signalled.

Use `sem_t`, `sem_init`, `sem_wait`, `sem_post`, `sem_destroy` from **<semaphore.h>**, and `pthread_create`, `pthread_join` from **<pthread.h>**.

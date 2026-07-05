# Medium · Ping-pong with Semaphores

Two threads must print **alternating** "Ping" and "Pong" — Ping first, then Pong, then Ping again, and so on. Mutexes and `pthread_join` alone can't enforce that order. You need a **signalling** mechanism between the threads.

Use **two semaphores** to pass control from one thread to the other. The "Ping" thread starts with its semaphore at 1 (allowed to print). The "Pong" thread starts with its semaphore at 0 (waiting). After Ping prints, it calls `sem_post` on Pong's semaphore. Pong unblocks, prints, calls `sem_post` on Ping's semaphore. Repeat N times.

### Input

- First line: integer `N` (1 ≤ N ≤ 20) — how many times each thread prints.

### Output

- 2N lines alternating `Ping` and `Pong`, always starting with `Ping`.

### Examples

```
Input:
3
Output:
Ping
Pong
Ping
Pong
Ping
Pong
```

```
Input:
1
Output:
Ping
Pong
```

Even though the threads run concurrently, the order of the lines is **deterministic** — the semaphores force the alternation.

Use **sem_t**, **sem_init**, **sem_wait**, **sem_post**, **sem_destroy** from `<semaphore.h>` and **pthread_create**, **pthread_join** from `<pthread.h>`.

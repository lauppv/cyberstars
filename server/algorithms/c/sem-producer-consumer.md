# Hard · Producer-Consumer with Semaphores

A "producer" thread reads N numbers and pushes them one at a time into a **shared buffer** with a single slot. A "consumer" thread reads from the buffer and prints each number. Because the buffer has only 1 slot, the producer must wait until the consumer has taken the previous value.

The synchronization uses **two semaphores**:

- `full` (init 0) — signalled by the producer right after writing the buffer.
- `empty` (init 1) — signalled by the consumer right after reading the buffer.

The producer calls `sem_wait(&empty)` before writing, then `sem_post(&full)` after. The consumer calls `sem_wait(&full)` before reading, then `sem_post(&empty)` after. The two threads take perfect turns through the single slot.

### Input

- First line: integer `N` (1 ≤ N ≤ 20)
- The next `N` lines: one integer per line

### Output

- `N` lines with the numbers, in the order they were read.

### Examples

```
Input:
3
10
20
30
Output:
10
20
30
```

```
Input:
5
7
7
7
7
7
Output:
7
7
7
7
7
```

The order is always **deterministic** — the consumer can't read a number until the producer has written it, and the producer can't write the next one until the consumer has taken the previous one.

Use **sem_t**, **sem_init**, **sem_wait**, **sem_post**, **sem_destroy** from `<semaphore.h>` and **pthread_create**, **pthread_join** from `<pthread.h>`.

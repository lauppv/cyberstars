Two operators need the same two tape drives. The first one takes drive A and waits for drive B. At the same moment, the second one takes drive B and waits for drive A. Each waits for something the other holds, so both wait forever. That's a **deadlock**

With threads, the drives are mutexes

```c
#include <stdio.h>
#include <pthread.h>

pthread_mutex_t a = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t b = PTHREAD_MUTEX_INITIALIZER;

void *first(void *arg) {
    (void)arg;
    pthread_mutex_lock(&a);
    pthread_mutex_lock(&b);
    // work
    pthread_mutex_unlock(&b);
    pthread_mutex_unlock(&a);
    return NULL;
}

void *second(void *arg) {
    (void)arg;
    pthread_mutex_lock(&b);
    pthread_mutex_lock(&a);
    // work
    pthread_mutex_unlock(&a);
    pthread_mutex_unlock(&b);
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, first, NULL);
    pthread_create(&t2, NULL, second, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("both threads are done\n");
    return 0;
}
```

Output

```text
both threads are done
```

Most of the time this program works, because one thread is a little faster and takes both mutexes before the other starts. But sometimes the first thread gets a, the second gets b, and the program freezes. A bug that appears once in a thousand runs is the hardest kind to find

---

A deadlock needs four things at the same time

1. **Only one at a time**: a resource can be held by one thread only, like a mutex
2. **Hold and wait**: a thread keeps what it has while it waits for more
3. **No taking back**: nobody can take a resource away from the thread that holds it
4. **A circle**: thread 1 waits for thread 2, which waits for thread 1, or a longer circle

Remove any one of them and a deadlock can't happen. The easiest to remove is the circle

---

The fix: give every mutex a fixed place in an order, and **always lock them in that order**. If every thread that needs a and b locks a first, then a thread that has b can never be waiting for a. No circle, no deadlock

When the mutexes are in an array, the order is simply the index: lock the smaller index first

```c
#include <stdio.h>
#include <pthread.h>

pthread_mutex_t locks[3];
int moves = 0;

void lock_both(int i, int j) {
    if (i < j) {
        pthread_mutex_lock(&locks[i]);
        pthread_mutex_lock(&locks[j]);
    } else {
        pthread_mutex_lock(&locks[j]);
        pthread_mutex_lock(&locks[i]);
    }
}

void *forward(void *arg) {
    (void)arg;
    for (int k = 0; k < 100000; k++) {
        lock_both(0, 2);
        moves++;
        pthread_mutex_unlock(&locks[0]);
        pthread_mutex_unlock(&locks[2]);
    }
    return NULL;
}

void *backward(void *arg) {
    (void)arg;
    for (int k = 0; k < 100000; k++) {
        lock_both(2, 0);
        moves++;
        pthread_mutex_unlock(&locks[2]);
        pthread_mutex_unlock(&locks[0]);
    }
    return NULL;
}

int main(void) {
    for (int i = 0; i < 3; i++) {
        pthread_mutex_init(&locks[i], NULL);
    }
    pthread_t t1, t2;
    pthread_create(&t1, NULL, forward, NULL);
    pthread_create(&t2, NULL, backward, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("moves: %d\n", moves);
    return 0;
}
```

Output

```text
moves: 200000
```

Unlocking order doesn't matter: unlocking never waits

---

Another way out: **pthread_mutex_trylock**. It never waits. If the mutex is free, it locks it and returns 0. If not, it returns at once with an error. A thread that can't get the second mutex can then give back the first one and try again later. That removes "hold and wait"

---

## Mission: The Transfer Desk

The computing center's bank keeps several accounts, each one guarded by its own mutex. Transfers run in four threads at the same time. A transfer touches two accounts, so it must lock both, and the order of locking is what keeps the bank from freezing

1. Read a, the number of accounts, then their a starting balances. Then read transfers until the input ends: `from to amount`, with accounts numbered from 0
2. Give every account its own mutex
3. Start 4 threads. Thread t does transfers t, t + 4, t + 8 and so on. For each transfer, lock both accounts in order, smaller number first, move the amount from one to the other, then unlock. A balance may go below zero
4. Wait for all the threads, then print every balance and the total of all balances, as in the example

a is from 2 to 10, and there are from 1 to 2000 transfers. from and to are always different

**Example**

Input

```text
3
100 50 0
0 1 30
1 2 70
2 0 10
```

Output

```text
account 0: 80
account 1: 10
account 2: 60
total: 150
```

The total never changes: money only moves between accounts

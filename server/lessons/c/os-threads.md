A **process** is a whole program with its own memory. But sometimes we want multiple things happening at the same time **within the same program**, sharing the same memory. That's what **threads** are

A thread is like a **lightweight process**. Multiple threads inside one process share the same heap, global variables, and code — but each has its **own stack** (its own local variables)

Think of it this way: a **process** is a kitchen (separate space, separate utensils). A **thread** is a cook inside the kitchen. Multiple cooks (threads) share the same kitchen (process), using the same ingredients (memory), but each follows their own recipe (stack)

---

In C, we use the **pthread** (POSIX threads) library

```c
#include <stdio.h>
#include <pthread.h>

void *sayHello(void *arg) {
    char *name = (char *)arg;
    printf("Hello from thread: %s\n", name);
    return NULL;
}

int main(void) {
    pthread_t t1, t2;

    pthread_create(&t1, NULL, sayHello, "Thread A");
    pthread_create(&t2, NULL, sayHello, "Thread B");

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Both threads finished\n");
    return 0;
}
```

**pthread_create** starts a new thread running the function **sayHello**. The last argument is passed to the function. **pthread_join** waits for the thread to finish — like **wait()** for processes

The function signature is special: it takes a **void \*** and returns a **void \***. That's the pthread convention — **void \*** is C's "generic pointer" that can point to anything

---

Why threads instead of processes? **Speed**. Creating a thread is much faster than forking a process. And threads share memory, so they can communicate without pipes. But this comes with a price: **shared memory is dangerous**

```c
#include <stdio.h>
#include <pthread.h>

int counter = 0;

void *increment(void *arg) {
    for (int i = 0; i < 100000; i++) {
        counter++;
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;

    pthread_create(&t1, NULL, increment, NULL);
    pthread_create(&t2, NULL, increment, NULL);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Counter: %d\n", counter);
    return 0;
}
```

You'd expect **200000**, but run it a few times and you might get different numbers each time! This is a **race condition** — both threads are modifying **counter** simultaneously, and their operations can interfere with each other

---

The fix: a **mutex** (mutual exclusion lock). Only one thread can hold the lock at a time

```c
#include <stdio.h>
#include <pthread.h>

int counter = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *increment(void *arg) {
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&lock);
        counter++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, increment, NULL);
    pthread_create(&t2, NULL, increment, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("Counter: %d\n", counter);
    return 0;
}
```

Now **counter** will always be exactly 200000. The mutex ensures only one thread touches counter at a time. But there's a tradeoff: locking/unlocking is slower. The art of multithreading is minimizing the time you hold locks

---

When to use **threads** vs **processes**:

- **Threads**: shared memory needed, lightweight, same program doing parallel work (web server handling requests, video game updating physics and rendering)
- **Processes**: isolation needed, safety (a crash in one process doesn't kill the other), running different programs

---

## Mission: Dual Thruster Calibration

The station's twin thrusters must fire test pulses simultaneously. Each thruster runs on its own thread, repeating its callsign to confirm alignment. Once both finish, the bridge logs the calibration as complete.

1. Create **two threads**, passing **"Ping"** to the first and **"Pong"** to the second
2. Each thread prints its string **3 times**
3. The main thread waits for both to finish, then prints **"Game over"**

**Output**

```text
Ping
Ping
Ping
Pong
Pong
Pong
Game over
```

The order of Ping and Pong lines may vary, but **"Game over"** must always be last

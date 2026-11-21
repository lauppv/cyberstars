A mutex keeps two threads from changing the same thing at once. But often a thread must **wait until something becomes true**: until there is work in a queue, until it's its turn, until a result is ready. Checking again and again in a loop would burn the processor for nothing. A **condition variable** lets the thread sleep until another thread tells it "something changed, look again"

---

A condition variable always works together with a mutex and a shared value that we check

```c
#include <stdio.h>
#include <pthread.h>

pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t changed = PTHREAD_COND_INITIALIZER;
int ready = 0;

void *worker(void *arg) {
    (void)arg;
    pthread_mutex_lock(&lock);
    ready = 1;
    pthread_cond_signal(&changed);
    pthread_mutex_unlock(&lock);
    return NULL;
}

int main(void) {
    pthread_t t;
    pthread_create(&t, NULL, worker, NULL);

    pthread_mutex_lock(&lock);
    while (!ready) {
        pthread_cond_wait(&changed, &lock);
    }
    pthread_mutex_unlock(&lock);

    printf("the worker is ready\n");
    pthread_join(t, NULL);
    return 0;
}
```

Output

```text
the worker is ready
```

---

**pthread_cond_wait(&cond, &lock)** does three things in one step: it unlocks the mutex, puts the thread to sleep, and when the thread is woken, locks the mutex again before returning. That's why we must hold the mutex when we call it. It's also what makes it safe: no signal can slip in between our check and our sleep

**pthread_cond_signal** wakes one waiting thread. **pthread_cond_broadcast** wakes all of them

---

Notice the **while**, not an if. A thread can wake up even when the value is not what it waits for: another thread may have been faster and changed it again, or the system may wake it for no reason at all, a "spurious wakeup". So after every wake, it checks again. The rule is simple: always wait in a while loop that checks the real condition

---

When several threads wait for different things on the same condition variable, use broadcast. signal might wake the wrong thread, which goes back to sleep, and the right one never hears anything

---

## Mission: Taking Turns

The teleprinter can only be used by one operator at a time, and they must take turns in a fixed order: operator 1, then 2, then 3, and back to 1. Each operator is a thread

1. Read k, the number of operators, and r, the number of rounds
2. Keep a shared value, turn, that says whose turn it is. Start k threads. Thread i, counting from 1, does this r times: wait until turn is i, print its line, then pass the turn to the next operator and wake the others
3. Use one mutex and one condition variable. Wait in a while loop
4. main waits for all the threads, then prints `done`

k is from 2 to 6, and r from 1 to 20

**Example**

Input

```text
3 2
```

Output

```text
operator 1, round 1
operator 2, round 1
operator 3, round 1
operator 1, round 2
operator 2, round 2
operator 3, round 2
done
```

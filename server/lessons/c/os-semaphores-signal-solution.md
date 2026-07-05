```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t ready;
int sum = 0;

void *worker(void *arg) {
    for (int i = 1; i <= 10; i++) {
        sum += i;
    }
    // Signal the main thread that the result is ready.
    sem_post(&ready);
    return NULL;
}

int main(void) {
    // Init to 0 — sem_wait blocks until the worker calls sem_post.
    sem_init(&ready, 0, 0);

    pthread_t t;
    pthread_create(&t, NULL, worker, NULL);

    sem_wait(&ready);
    printf("Sum: %d\n", sum);

    pthread_join(t, NULL);
    sem_destroy(&ready);
    return 0;
}
```

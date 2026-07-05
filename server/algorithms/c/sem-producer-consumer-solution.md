```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

int nums[20];
int n;

int buffer;
sem_t full;
sem_t empty;

void *producer(void *arg) {
    for (int i = 0; i < n; i++) {
        sem_wait(&empty);
        buffer = nums[i];
        sem_post(&full);
    }
    return NULL;
}

void *consumer(void *arg) {
    for (int i = 0; i < n; i++) {
        sem_wait(&full);
        printf("%d\n", buffer);
        sem_post(&empty);
    }
    return NULL;
}

int main(void) {
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }

    // empty = 1 free slot at start; full = 0 (nothing in buffer).
    sem_init(&full, 0, 0);
    sem_init(&empty, 0, 1);

    pthread_t p, c;
    pthread_create(&p, NULL, producer, NULL);
    pthread_create(&c, NULL, consumer, NULL);
    pthread_join(p, NULL);
    pthread_join(c, NULL);

    sem_destroy(&full);
    sem_destroy(&empty);
    return 0;
}
```

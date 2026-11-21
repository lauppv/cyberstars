```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

int belt[5];
int size;
int in = 0, out = 0, count = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t not_full = PTHREAD_COND_INITIALIZER;
pthread_cond_t not_empty = PTHREAD_COND_INITIALIZER;

int weights[1000];
int parts = 0;
long total = 0;

void put(int item) {
    pthread_mutex_lock(&lock);
    while (count == size) {
        pthread_cond_wait(&not_full, &lock);
    }
    belt[in] = item;
    in = (in + 1) % size;
    count++;
    pthread_cond_signal(&not_empty);
    pthread_mutex_unlock(&lock);
}

int take(void) {
    pthread_mutex_lock(&lock);
    while (count == 0) {
        pthread_cond_wait(&not_empty, &lock);
    }
    int item = belt[out];
    out = (out + 1) % size;
    count--;
    pthread_cond_signal(&not_full);
    pthread_mutex_unlock(&lock);
    return item;
}

void *press(void *arg) {
    (void)arg;
    for (int i = 0; i < parts; i++) {
        put(weights[i]);
    }
    put(0);
    return NULL;
}

void *packer(void *arg) {
    (void)arg;
    while (1) {
        int item = take();
        if (item == 0) {
            break;
        }
        printf("packed %d\n", item);
        total = total + item;
    }
    return NULL;
}

int main(void) {
    scanf("%d", &size);
    while (parts < 1000 && scanf("%d", &weights[parts]) == 1) {
        parts++;
    }

    pthread_t producer, consumer;
    pthread_create(&producer, NULL, press, NULL);
    pthread_create(&consumer, NULL, packer, NULL);
    pthread_join(producer, NULL);
    pthread_join(consumer, NULL);

    printf("Total: %ld\n", total);
    return 0;
}
```

#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>

static int nums[20000], n, buffer;
static sem_t full, empty;

static void *producer(void *arg) {
    for (int i = n - 1; i >= 0; i--) {
        sem_wait(&empty);
        buffer = nums[i];
        sem_post(&full);
    }
    return NULL;
}

static void *consumer(void *arg) {
    for (int i = 0; i < n; i++) {
        sem_wait(&full);
        printf("%d\n", buffer);
        sem_post(&empty);
    }
    return NULL;
}

int main(void) {
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    sem_init(&full, 0, 0);
    sem_init(&empty, 0, 1);
    pthread_t p, c;
    pthread_create(&p, NULL, producer, NULL);
    pthread_create(&c, NULL, consumer, NULL);
    pthread_join(p, NULL);
    pthread_join(c, NULL);
    return 0;
}

#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>

static int values[20000], count, slot;
static sem_t has_value, has_room;

static void *produce(void *arg) {
    for (int i = 0; i < count; i++) {
        sem_wait(&has_room);
        slot = values[i];
        sem_post(&has_value);
    }
    return NULL;
}

static void *consume(void *arg) {
    for (int i = 0; i < count; i++) {
        sem_wait(&has_value);
        printf("%d\n", slot);
        sem_post(&has_room);
    }
    return NULL;
}

int main(void) {
    scanf("%d", &count);
    for (int i = 0; i < count; i++) scanf("%d", &values[i]);
    sem_init(&has_value, 0, 0);
    sem_init(&has_room, 0, 1);
    pthread_t p, c;
    pthread_create(&c, NULL, consume, NULL);
    pthread_create(&p, NULL, produce, NULL);
    pthread_join(p, NULL);
    pthread_join(c, NULL);
    return 0;
}

#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>

static sem_t sp, sq;
static int rounds;

static void *ping(void *arg) {
    for (int i = 0; i < rounds; i++) {
        sem_wait(&sp);
        puts("Ping");
        sem_post(&sq);
    }
    return NULL;
}

static void *pong(void *arg) {
    for (int i = 0; i < rounds; i++) {
        sem_wait(&sq);
        puts("Pong");
        sem_post(&sp);
    }
    return NULL;
}

int main(void) {
    scanf("%d", &rounds);
    sem_init(&sp, 0, 0);
    sem_init(&sq, 0, 1);
    pthread_t a, b;
    pthread_create(&a, NULL, ping, NULL);
    pthread_create(&b, NULL, pong, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    return 0;
}

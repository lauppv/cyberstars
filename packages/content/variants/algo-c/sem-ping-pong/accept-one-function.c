#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>

static sem_t turn[2];
static int rounds;

static void *player(void *arg) {
    int me = *(int *)arg;
    for (int i = 0; i < rounds; i++) {
        sem_wait(&turn[me]);
        puts(me ? "Pong" : "Ping");
        sem_post(&turn[1 - me]);
    }
    return NULL;
}

int main(void) {
    scanf("%d", &rounds);
    sem_init(&turn[0], 0, 1);
    sem_init(&turn[1], 0, 0);
    int ids[2] = {0, 1};
    pthread_t t[2];
    for (int i = 0; i < 2; i++) pthread_create(&t[i], NULL, player, &ids[i]);
    for (int i = 0; i < 2; i++) pthread_join(t[i], NULL);
    return 0;
}

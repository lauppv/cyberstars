```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t sem_ping;
sem_t sem_pong;
int rounds;

void *ping(void *arg) {
    for (int i = 0; i < rounds; i++) {
        sem_wait(&sem_ping);
        printf("Ping\n");
        sem_post(&sem_pong);
    }
    return NULL;
}

void *pong(void *arg) {
    for (int i = 0; i < rounds; i++) {
        sem_wait(&sem_pong);
        printf("Pong\n");
        sem_post(&sem_ping);
    }
    return NULL;
}

int main(void) {
    scanf("%d", &rounds);

    // Ping goes first: its semaphore starts at 1, Pong's at 0.
    sem_init(&sem_ping, 0, 1);
    sem_init(&sem_pong, 0, 0);

    pthread_t t1, t2;
    pthread_create(&t1, NULL, ping, NULL);
    pthread_create(&t2, NULL, pong, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    sem_destroy(&sem_ping);
    sem_destroy(&sem_pong);
    return 0;
}
```

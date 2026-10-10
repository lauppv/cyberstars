#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t ready;
int sum;

void *compute(void *unused) {
    (void)unused;
    int n = 10;
    sum = n * (n + 1) / 2;
    sem_post(&ready);
    return NULL;
}

int main(void) {
    sem_init(&ready, 0, 0);
    pthread_t worker;
    pthread_create(&worker, NULL, compute, NULL);
    sem_wait(&ready);
    printf("Sum: %d\n", sum);
    pthread_join(worker, NULL);
    sem_destroy(&ready);
    return 0;
}

#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

static sem_t done_signal;
static int total = 0;

static void *adder(void *arg) {
    int k = 10;
    while (k > 0) {
        total += k;
        k--;
    }
    sem_post(&done_signal);
    return arg;
}

int main(void) {
    pthread_t th;
    sem_init(&done_signal, 0, 0);
    if (pthread_create(&th, NULL, adder, NULL) != 0) return 1;
    sem_wait(&done_signal);
    printf("Sum: %d\n", total);
    pthread_join(th, NULL);
    sem_destroy(&done_signal);
    return 0;
}

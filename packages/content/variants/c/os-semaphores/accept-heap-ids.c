#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>

static sem_t slots;

static void *job(void *arg) {
    int me = *(int *)arg;
    free(arg);
    sem_wait(&slots);
    printf("Thread %d printing\n", me);
    printf("Thread %d done\n", me);
    sem_post(&slots);
    return NULL;
}

int main(void) {
    sem_init(&slots, 0, 2);
    pthread_t workers[4];
    int k = 0;
    while (k < 4) {
        int *who = malloc(sizeof *who);
        *who = k + 1;
        pthread_create(&workers[k], NULL, job, who);
        k++;
    }
    for (k = 0; k < 4; k++) pthread_join(workers[k], NULL);
    puts("All jobs finished");
    sem_destroy(&slots);
    return 0;
}

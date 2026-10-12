#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t printers;

void *operator_job(void *arg) {
    long id = (long)arg;
    sem_wait(&printers);
    printf("Thread %ld printing\nThread %ld done\n", id, id);
    sem_post(&printers);
    return NULL;
}

int main(void) {
    sem_init(&printers, 0, 2);
    pthread_t t1, t2, t3, t4;
    pthread_create(&t1, NULL, operator_job, (void *)1L);
    pthread_create(&t2, NULL, operator_job, (void *)2L);
    pthread_create(&t3, NULL, operator_job, (void *)3L);
    pthread_create(&t4, NULL, operator_job, (void *)4L);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    pthread_join(t3, NULL);
    pthread_join(t4, NULL);
    printf("All jobs finished\n");
    sem_destroy(&printers);
    return 0;
}

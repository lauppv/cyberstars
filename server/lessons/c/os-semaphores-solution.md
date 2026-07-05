```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t printers;

void *work(void *arg) {
    int id = *(int *)arg;
    sem_wait(&printers);
    printf("Thread %d printing\n", id);
    printf("Thread %d done\n", id);
    sem_post(&printers);
    return NULL;
}

int main(void) {
    // Counting semaphore with initial value 2 — at most 2 threads pass sem_wait at once.
    sem_init(&printers, 0, 2);

    pthread_t threads[4];
    int id[4] = {1, 2, 3, 4};
    for (int i = 0; i < 4; i++) {
        pthread_create(&threads[i], NULL, work, &id[i]);
    }
    for (int i = 0; i < 4; i++) {
        pthread_join(threads[i], NULL);
    }

    printf("All jobs finished\n");
    sem_destroy(&printers);
    return 0;
}
```

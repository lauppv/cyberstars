```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t gata;
int suma = 0;

void *worker(void *arg) {
    for (int i = 1; i <= 10; i++) {
        suma += i;
    }
    // Semnalam firul principal ca rezultatul e gata.
    sem_post(&gata);
    return NULL;
}

int main(void) {
    // Init cu 0 — sem_wait blocheaza pana cand worker face sem_post.
    sem_init(&gata, 0, 0);

    pthread_t t;
    pthread_create(&t, NULL, worker, NULL);

    sem_wait(&gata);
    printf("Suma: %d\n", suma);

    pthread_join(t, NULL);
    sem_destroy(&gata);
    return 0;
}
```

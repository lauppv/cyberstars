```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

int numere[20];
int n;

int slot;
sem_t plin;
sem_t gol;

void *producator(void *arg) {
    for (int i = 0; i < n; i++) {
        sem_wait(&gol);
        slot = numere[i];
        sem_post(&plin);
    }
    return NULL;
}

void *consumator(void *arg) {
    for (int i = 0; i < n; i++) {
        sem_wait(&plin);
        printf("%d\n", slot);
        sem_post(&gol);
    }
    return NULL;
}

int main(void) {
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &numere[i]);
    }

    // gol = 1 slot liber la start; plin = 0 (nimic in slot).
    sem_init(&plin, 0, 0);
    sem_init(&gol, 0, 1);

    pthread_t p, c;
    pthread_create(&p, NULL, producator, NULL);
    pthread_create(&c, NULL, consumator, NULL);
    pthread_join(p, NULL);
    pthread_join(c, NULL);

    sem_destroy(&plin);
    sem_destroy(&gol);
    return 0;
}
```

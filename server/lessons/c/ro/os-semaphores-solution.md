```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t imprimante;

void *lucreaza(void *arg) {
    int id = *(int *)arg;
    sem_wait(&imprimante);
    printf("Firul %d printeaza\n", id);
    printf("Firul %d termina\n", id);
    sem_post(&imprimante);
    return NULL;
}

int main(void) {
    // Semafor cu contor initial 2 — la orice moment cel mult 2 fire trec de sem_wait.
    sem_init(&imprimante, 0, 2);

    pthread_t fire[4];
    int id[4] = {1, 2, 3, 4};
    for (int i = 0; i < 4; i++) {
        pthread_create(&fire[i], NULL, lucreaza, &id[i]);
    }
    for (int i = 0; i < 4; i++) {
        pthread_join(fire[i], NULL);
    }

    printf("Toate lucrarile s-au terminat\n");
    sem_destroy(&imprimante);
    return 0;
}
```

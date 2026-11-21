```c
#include <stdio.h>
#include <pthread.h>

pthread_mutex_t lacat = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t schimbat = PTHREAD_COND_INITIALIZER;
int rand = 1;
int operatori;
int ture;

void *lucreaza(void *arg) {
    int eu = *(int *)arg;
    for (int tura = 1; tura <= ture; tura++) {
        pthread_mutex_lock(&lacat);
        while (rand != eu) {
            pthread_cond_wait(&schimbat, &lacat);
        }
        printf("operatorul %d, tura %d\n", eu, tura);
        rand = eu % operatori + 1;
        pthread_cond_broadcast(&schimbat);
        pthread_mutex_unlock(&lacat);
    }
    return NULL;
}

int main(void) {
    scanf("%d %d", &operatori, &ture);

    pthread_t fire[6];
    int id[6];
    for (int i = 0; i < operatori; i++) {
        id[i] = i + 1;
        pthread_create(&fire[i], NULL, lucreaza, &id[i]);
    }
    for (int i = 0; i < operatori; i++) {
        pthread_join(fire[i], NULL);
    }
    printf("gata\n");
    return 0;
}
```

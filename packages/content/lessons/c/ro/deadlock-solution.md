```c
#include <stdio.h>
#include <pthread.h>

struct transfer {
    int din;
    int in;
    int suma;
};

int conturi;
long sold[10];
pthread_mutex_t lacate[10];
struct transfer transferuri[2000];
int numar = 0;

void blocheaza_ambele(int i, int j) {
    if (i < j) {
        pthread_mutex_lock(&lacate[i]);
        pthread_mutex_lock(&lacate[j]);
    } else {
        pthread_mutex_lock(&lacate[j]);
        pthread_mutex_lock(&lacate[i]);
    }
}

void *ghiseu(void *arg) {
    int t = *(int *)arg;
    for (int k = t; k < numar; k = k + 4) {
        struct transfer *tr = &transferuri[k];
        blocheaza_ambele(tr->din, tr->in);
        sold[tr->din] = sold[tr->din] - tr->suma;
        sold[tr->in] = sold[tr->in] + tr->suma;
        pthread_mutex_unlock(&lacate[tr->din]);
        pthread_mutex_unlock(&lacate[tr->in]);
    }
    return NULL;
}

int main(void) {
    scanf("%d", &conturi);
    for (int i = 0; i < conturi; i++) {
        scanf("%ld", &sold[i]);
        pthread_mutex_init(&lacate[i], NULL);
    }
    while (numar < 2000 && scanf("%d %d %d", &transferuri[numar].din,
                                 &transferuri[numar].in, &transferuri[numar].suma) == 3) {
        numar++;
    }

    pthread_t fire[4];
    int ids[4];
    for (int t = 0; t < 4; t++) {
        ids[t] = t;
        pthread_create(&fire[t], NULL, ghiseu, &ids[t]);
    }
    for (int t = 0; t < 4; t++) {
        pthread_join(fire[t], NULL);
    }

    long total = 0;
    for (int i = 0; i < conturi; i++) {
        printf("contul %d: %ld\n", i, sold[i]);
        total = total + sold[i];
    }
    printf("total: %ld\n", total);
    return 0;
}
```

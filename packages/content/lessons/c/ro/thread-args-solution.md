```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

struct bucata {
    int inceput;
    int lungime;
    int *citiri;
    long suma;
};

void *aduna_bucata(void *arg) {
    struct bucata *p = arg;
    long suma = 0;
    for (int i = p->inceput; i < p->inceput + p->lungime; i++) {
        suma = suma + p->citiri[i];
    }
    p->suma = suma;
    return NULL;
}

int main(void) {
    int k, n;
    scanf("%d %d", &k, &n);
    int *citiri = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &citiri[i]);
    }

    struct bucata bucati[8];
    pthread_t fire[8];
    int inceput = 0;
    for (int i = 0; i < k; i++) {
        bucati[i].inceput = inceput;
        bucati[i].lungime = n / k + (i < n % k ? 1 : 0);
        bucati[i].citiri = citiri;
        bucati[i].suma = 0;
        inceput = inceput + bucati[i].lungime;
        pthread_create(&fire[i], NULL, aduna_bucata, &bucati[i]);
    }

    long total = 0;
    for (int i = 0; i < k; i++) {
        pthread_join(fire[i], NULL);
        printf("bucata %d: %d citiri, suma %ld\n", i + 1, bucati[i].lungime, bucati[i].suma);
        total = total + bucati[i].suma;
    }
    printf("total: %ld\n", total);

    free(citiri);
    return 0;
}
```
